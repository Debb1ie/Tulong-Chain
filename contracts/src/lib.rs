#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, token, Address, Env, Symbol, Vec, String,
};

#[cfg(test)]
mod test;

// ─── Storage ──────────────────────────────────────────────────────────────────

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    TotalDonated,
    TotalWithdrawn,
    Emergency,
    Donations,
    Withdrawals,
    Paused,
    EmergencyTimelockSeconds,
    EmergencyTimestamp,
}

// ─── Types ────────────────────────────────────────────────────────────────────

#[contracttype]
#[derive(Clone)]
pub struct Donation {
    pub donor: Address,
    pub amount: i128,
    pub timestamp: u64,
    pub asset: AssetType,
}

#[contracttype]
#[derive(Clone)]
pub enum AssetType {
    Usdc,
    Xlm,
}

#[contracttype]
#[derive(Clone)]
pub struct Withdrawal {
    pub coordinator: Address,
    pub amount: i128,
    pub purpose: String,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone)]
pub struct TimelockInfo {
    pub declared_at: u64,
    pub activates_at: u64,
}

// ─── Contract ─────────────────────────────────────────────────────────────────

#[contract]
pub struct TulongChain;

#[contractimpl]
impl TulongChain {
    // ── Init ─────────────────────────────────────────────────────────────────

    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::TotalDonated, &0i128);
        env.storage().instance().set(&DataKey::TotalWithdrawn, &0i128);
        env.storage().instance().set(&DataKey::Emergency, &false);
        env.storage().instance().set(&DataKey::Paused, &false);
        env.storage().instance().set(&DataKey::EmergencyTimelockSeconds, &0u64);
        env.storage().instance().set(&DataKey::EmergencyTimestamp, &TimelockInfo {
            declared_at: 0,
            activates_at: 0,
        });
    }

    // ── Pausable ─────────────────────────────────────────────────────────────

    pub fn pause(env: Env) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        env.storage().instance().set(&DataKey::Paused, &true);
        env.events().publish((Symbol::new(&env, "paused"),), ());
    }

    pub fn unpause(env: Env) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        env.storage().instance().set(&DataKey::Paused, &false);
        env.events().publish((Symbol::new(&env, "unpaused"),), ());
    }

    pub fn is_paused(env: Env) -> bool {
        env.storage().instance().get(&DataKey::Paused).unwrap_or(false)
    }

    // ── Timelock ──────────────────────────────────────────────────────────────

    pub fn set_timelock(env: Env, seconds: u64) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        assert!(seconds >= 3600, "Timelock must be at least 1 hour");
        env.storage()
            .instance()
            .set(&DataKey::EmergencyTimelockSeconds, &seconds);
    }

    pub fn get_timelock_duration(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::EmergencyTimelockSeconds)
            .unwrap_or(0)
    }

    pub fn declare_emergency(env: Env) -> u64 {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        assert!(!env.storage().instance().get(&DataKey::Paused).unwrap_or(false), "Paused");
        let already: bool = env
            .storage()
            .instance()
            .get(&DataKey::Emergency)
            .unwrap_or(false);
        assert!(!already, "Already declared");

        let now = env.ledger().timestamp();
        let timelock: u64 = env
            .storage()
            .instance()
            .get(&DataKey::EmergencyTimelockSeconds)
            .unwrap_or(0);
        let activates_at = if timelock > 0 { now + timelock } else { now };

        env.storage().instance().set(
            &DataKey::EmergencyTimestamp,
            &TimelockInfo {
                declared_at: now,
                activates_at,
            },
        );
        if timelock == 0 {
            env.storage().instance().set(&DataKey::Emergency, &true);
        }

        env.events().publish(
            (Symbol::new(&env, "emergency_declared"),),
            (now, activates_at),
        );
        activates_at
    }

    pub fn activate_emergency(env: Env) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        let info: TimelockInfo = env
            .storage()
            .instance()
            .get(&DataKey::EmergencyTimestamp)
            .unwrap_or(TimelockInfo {
                declared_at: 0,
                activates_at: 0,
            });
        assert!(info.activates_at > 0, "No pending declaration");
        let now = env.ledger().timestamp();
        assert!(now >= info.activates_at, "Timelock not expired");
        env.storage().instance().set(&DataKey::Emergency, &true);
        env.events()
            .publish((Symbol::new(&env, "emergency_activated"),), ());
    }

    pub fn lift_emergency(env: Env) {
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        admin.require_auth();
        env.storage().instance().set(&DataKey::Emergency, &false);
        env.storage().instance().set(&DataKey::EmergencyTimestamp, &TimelockInfo {
            declared_at: 0,
            activates_at: 0,
        });
        env.events()
            .publish((Symbol::new(&env, "emergency_lifted"),), ());
    }

    pub fn get_emergency_timelock(env: Env) -> TimelockInfo {
        env.storage()
            .instance()
            .get(&DataKey::EmergencyTimestamp)
            .unwrap_or(TimelockInfo {
                declared_at: 0,
                activates_at: 0,
            })
    }

    // ── Donations ─────────────────────────────────────────────────────────────

    pub fn donate(env: Env, donor: Address, token: Address, amount: i128) {
        donor.require_auth();
        assert!(!env.storage().instance().get(&DataKey::Paused).unwrap_or(false), "paused");
        assert!(amount > 0, "Amount must be > 0");

        let token_client = token::Client::new(&env, &token);
        token_client.transfer(&donor, &env.current_contract_address(), &amount);

        let mut donations: Vec<Donation> = env
            .storage()
            .instance()
            .get(&DataKey::Donations)
            .unwrap_or(Vec::new(&env));

        donations.push_back(Donation {
            donor: donor.clone(),
            amount,
            timestamp: env.ledger().timestamp(),
            asset: AssetType::Usdc,
        });

        env.storage().instance().set(&DataKey::Donations, &donations);

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

    pub fn batch_donate(
        env: Env,
        donor: Address,
        batches: Vec<(Address, i128, AssetType)>,
    ) {
        donor.require_auth();
        assert!(!env.storage().instance().get(&DataKey::Paused).unwrap_or(false), "paused");
        assert!(batches.len() > 0, "Empty batch");
        assert!(batches.len() <= 50, "Batch limit exceeded");

        let mut total: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TotalDonated)
            .unwrap_or(0);
        let mut donations: Vec<Donation> = env
            .storage()
            .instance()
            .get(&DataKey::Donations)
            .unwrap_or(Vec::new(&env));

        for i in 0..batches.len() {
            let entry = batches.get(i).unwrap();
            let token_addr = &entry.0;
            let amount = entry.1;
            let asset = &entry.2;
            assert!(amount > 0, "Amount must be > 0");

            let token_client = token::Client::new(&env, token_addr);
            token_client.transfer(&donor, &env.current_contract_address(), &amount);

            donations.push_back(Donation {
                donor: donor.clone(),
                amount,
                timestamp: env.ledger().timestamp(),
                asset: asset.clone(),
            });
            total += amount;
        }

        env.storage().instance().set(&DataKey::Donations, &donations);
        env.storage()
            .instance()
            .set(&DataKey::TotalDonated, &total);
        env.events().publish(
            (Symbol::new(&env, "batch_donated"),),
            (donor, batches.len() as u32, total),
        );
    }

    // ── Withdrawals ────────────────────────────────────────────────────────────

    pub fn withdraw(
        env: Env,
        coordinator: Address,
        token: Address,
        amount: i128,
        purpose: String,
    ) {
        let mut batch = Vec::new(&env);
        batch.push_back((purpose, amount));
        Self::batch_withdraw(env, coordinator, token, batch);
    }

    pub fn batch_withdraw(
        env: Env,
        coordinator: Address,
        token: Address,
        batches: Vec<(String, i128)>,
    ) {
        coordinator.require_auth();

        assert!(env
            .storage()
            .instance()
            .get(&DataKey::Emergency)
            .unwrap_or(false), "No active emergency");
        let admin: Address = env.storage().instance().get(&DataKey::Admin).unwrap();
        assert!(coordinator == admin, "Unauthorized");
        assert!(!env.storage().instance().get(&DataKey::Paused).unwrap_or(false), "paused");

        assert!(batches.len() > 0, "Empty batch");
        assert!(batches.len() <= 20, "Batch limit exceeded");

        let mut balance = Self::get_balance(env.clone());
        let mut total_w: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TotalWithdrawn)
            .unwrap_or(0);
        let mut withdrawals: Vec<Withdrawal> = env
            .storage()
            .instance()
            .get(&DataKey::Withdrawals)
            .unwrap_or(Vec::new(&env));

        for i in 0..batches.len() {
            let entry = batches.get(i).unwrap();
            let purpose = &entry.0;
            let amount = entry.1;
            assert!(amount > 0, "Invalid amount");
            assert!(amount <= balance, "Insufficient balance");

            let token_client = token::Client::new(&env, &token);
            token_client.transfer(&env.current_contract_address(), &coordinator, &amount);

            withdrawals.push_back(Withdrawal {
                coordinator: coordinator.clone(),
                amount,
                purpose: purpose.clone(),
                timestamp: env.ledger().timestamp(),
            });
            balance -= amount;
            total_w += amount;
        }

        env.storage()
            .instance()
            .set(&DataKey::Withdrawals, &withdrawals);
        env.storage()
            .instance()
            .set(&DataKey::TotalWithdrawn, &total_w);
        env.events().publish(
            (Symbol::new(&env, "batch_withdrawn"),),
            (coordinator, batches.len() as u32, total_w),
        );
    }

    // ── Views ──────────────────────────────────────────────────────────────────

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
        let e: bool = env
            .storage()
            .instance()
            .get(&DataKey::Emergency)
            .unwrap_or(false);
        if e {
            return true;
        }
        let info: TimelockInfo = env
            .storage()
            .instance()
            .get(&DataKey::EmergencyTimestamp)
            .unwrap_or(TimelockInfo {
                declared_at: 0,
                activates_at: 0,
            });
        if info.activates_at > 0 {
            return env.ledger().timestamp() >= info.activates_at;
        }
        false
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

    pub fn get_paused(env: Env) -> bool {
        env.storage().instance().get(&DataKey::Paused).unwrap_or(false)
    }

    pub fn get_timelock_info(env: Env) -> TimelockInfo {
        env.storage()
            .instance()
            .get(&DataKey::EmergencyTimestamp)
            .unwrap_or(TimelockInfo {
                declared_at: 0,
                activates_at: 0,
            })
    }
}
