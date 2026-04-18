#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, token, Address, Env, Symbol, Vec, String,
};

// ─── Storage Keys ────────────────────────────────────────────────────────────

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    TotalDonated,
    TotalWithdrawn,
    Emergency,
    Donations,
    Withdrawals,
}

// ─── Data Structures ─────────────────────────────────────────────────────────

#[contracttype]
#[derive(Clone)]
pub struct Donation {
    pub donor: Address,
    pub amount: i128,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone)]
pub struct Withdrawal {
    pub coordinator: Address,
    pub amount: i128,
    pub purpose: String,
    pub timestamp: u64,
}

// ─── Contract ────────────────────────────────────────────────────────────────

#[contract]
pub struct TulongChain;

#[contractimpl]
impl TulongChain {
    /// Initialize the contract with an admin (relief coordinator) address.
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TotalDonated, &0i128);
        env.storage().instance().set(&DataKey::TotalWithdrawn, &0i128);
        env.storage().instance().set(&DataKey::Emergency, &false);
    }

    /// Donate USDC to the community relief fund.
    pub fn donate(env: Env, donor: Address, token: Address, amount: i128) {
        donor.require_auth();
        assert!(amount > 0, "Amount must be greater than zero");

        // Transfer tokens from donor into this contract
        let token_client = token::Client::new(&env, &token);
        token_client.transfer(&donor, &env.current_contract_address(), &amount);

        // Record donation in history
        let mut donations: Vec<Donation> = env
            .storage()
            .instance()
            .get(&DataKey::Donations)
            .unwrap_or(Vec::new(&env));

        donations.push_back(Donation {
            donor: donor.clone(),
            amount,
            timestamp: env.ledger().timestamp(),
        });

        env.storage().instance().set(&DataKey::Donations, &donations);

        // Update running total
        let total: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TotalDonated)
            .unwrap_or(0);
        env.storage()
            .instance()
            .set(&DataKey::TotalDonated, &(total + amount));

        env.events()
            .publish((Symbol::new(&env, "donated"),), (donor, amount));
    }

    /// Admin declares a disaster emergency — enables fund withdrawals.
    pub fn declare_emergency(env: Env) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap();
        admin.require_auth();
        env.storage().instance().set(&DataKey::Emergency, &true);

        env.events()
            .publish((Symbol::new(&env, "emergency_declared"),), ());
    }

    /// Admin lifts the emergency status.
    pub fn lift_emergency(env: Env) {
        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap();
        admin.require_auth();
        env.storage().instance().set(&DataKey::Emergency, &false);

        env.events()
            .publish((Symbol::new(&env, "emergency_lifted"),), ());
    }

    /// Coordinator withdraws funds during a declared emergency.
    pub fn withdraw(
        env: Env,
        coordinator: Address,
        token: Address,
        amount: i128,
        purpose: String,
    ) {
        coordinator.require_auth();

        let is_emergency: bool = env
            .storage()
            .instance()
            .get(&DataKey::Emergency)
            .unwrap_or(false);
        assert!(is_emergency, "No active emergency declared");

        let admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap();
        assert!(coordinator == admin, "Only admin/coordinator can withdraw");

        assert!(amount > 0, "Amount must be greater than zero");

        // Check available balance
        let balance = Self::get_balance(env.clone());
        assert!(amount <= balance, "Insufficient contract balance");

        // Transfer tokens out to coordinator
        let token_client = token::Client::new(&env, &token);
        token_client.transfer(&env.current_contract_address(), &coordinator, &amount);

        // Record withdrawal
        let mut withdrawals: Vec<Withdrawal> = env
            .storage()
            .instance()
            .get(&DataKey::Withdrawals)
            .unwrap_or(Vec::new(&env));

        withdrawals.push_back(Withdrawal {
            coordinator: coordinator.clone(),
            amount,
            purpose: purpose.clone(),
            timestamp: env.ledger().timestamp(),
        });

        env.storage()
            .instance()
            .set(&DataKey::Withdrawals, &withdrawals);

        // Update total withdrawn
        let total_withdrawn: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TotalWithdrawn)
            .unwrap_or(0);
        env.storage()
            .instance()
            .set(&DataKey::TotalWithdrawn, &(total_withdrawn + amount));

        env.events()
            .publish((Symbol::new(&env, "withdrawn"),), (coordinator, amount, purpose));
    }

    // ─── Read-Only Views ──────────────────────────────────────────────────────

    pub fn get_total_donated(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::TotalDonated)
            .unwrap_or(0)
    }

    pub fn get_total_withdrawn(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::TotalWithdrawn)
            .unwrap_or(0)
    }

    pub fn get_balance(env: Env) -> i128 {
        let donated: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TotalDonated)
            .unwrap_or(0);
        let withdrawn: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TotalWithdrawn)
            .unwrap_or(0);
        donated - withdrawn
    }

    pub fn is_emergency(env: Env) -> bool {
        env.storage()
            .instance()
            .get(&DataKey::Emergency)
            .unwrap_or(false)
    }

    pub fn get_donations(env: Env) -> Vec<Donation> {
        env.storage()
            .instance()
            .get(&DataKey::Donations)
            .unwrap_or(Vec::new(&env))
    }

    pub fn get_withdrawals(env: Env) -> Vec<Withdrawal> {
        env.storage()
            .instance()
            .get(&DataKey::Withdrawals)
            .unwrap_or(Vec::new(&env))
    }
}
