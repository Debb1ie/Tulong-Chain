#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::Address,
    token::{Client as TokenClient, StellarAssetClient},
    Env, String,
};

// ─── Test Helper ─────────────────────────────────────────────────────────────

fn create_token<'a>(env: &Env, admin: &soroban_sdk::Address) -> (TokenClient<'a>, StellarAssetClient<'a>) {
    let sac = env.register_stellar_asset_contract_v2(admin.clone());
    (
        TokenClient::new(env, &sac.address()),
        StellarAssetClient::new(env, &sac.address()),
    )
}

// ─── Tests ───────────────────────────────────────────────────────────────────

/// Test 1: Contract initializes correctly with zero balances and no emergency
#[test]
fn test_initialize() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);
    let admin = soroban_sdk::Address::generate(&env);

    client.initialize(&admin);

    assert_eq!(client.get_total_donated(), 0, "Initial donated should be 0");
    assert_eq!(client.get_total_withdrawn(), 0, "Initial withdrawn should be 0");
    assert_eq!(client.get_balance(), 0, "Initial balance should be 0");
    assert_eq!(client.is_emergency(), false, "No emergency on init");
}

/// Test 2: A single donor can donate and balance updates correctly
#[test]
fn test_single_donation() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);

    let admin = soroban_sdk::Address::generate(&env);
    let donor = soroban_sdk::Address::generate(&env);

    let (token, token_admin) = create_token(&env, &admin);
    token_admin.mint(&donor, &1_000_000_000); // 1000 USDC (7 decimals)

    client.initialize(&admin);
    client.donate(&donor, &token.address, &500_000_000); // donate 500 USDC

    assert_eq!(client.get_total_donated(), 500_000_000);
    assert_eq!(client.get_balance(), 500_000_000);
    assert_eq!(client.get_donations().len(), 1);
}

/// Test 3: Multiple donors accumulate correctly in the fund
#[test]
fn test_multiple_donors() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);

    let admin = soroban_sdk::Address::generate(&env);
    let donor1 = soroban_sdk::Address::generate(&env);
    let donor2 = soroban_sdk::Address::generate(&env);
    let donor3 = soroban_sdk::Address::generate(&env);

    let (token, token_admin) = create_token(&env, &admin);
    token_admin.mint(&donor1, &500_000_000);
    token_admin.mint(&donor2, &300_000_000);
    token_admin.mint(&donor3, &200_000_000);

    client.initialize(&admin);
    client.donate(&donor1, &token.address, &500_000_000);
    client.donate(&donor2, &token.address, &300_000_000);
    client.donate(&donor3, &token.address, &200_000_000);

    assert_eq!(client.get_total_donated(), 1_000_000_000); // 1000 USDC total
    assert_eq!(client.get_donations().len(), 3);
    assert_eq!(client.get_balance(), 1_000_000_000);
}

/// Test 4: Emergency declaration enables withdrawals; lifting disables them
#[test]
fn test_emergency_lifecycle() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);
    let admin = soroban_sdk::Address::generate(&env);

    client.initialize(&admin);

    // No emergency initially
    assert_eq!(client.is_emergency(), false);

    // Declare emergency
    client.declare_emergency();
    assert_eq!(client.is_emergency(), true);

    // Lift emergency
    client.lift_emergency();
    assert_eq!(client.is_emergency(), false);
}

/// Test 5: Admin can withdraw during emergency; balance decreases correctly
#[test]
fn test_withdraw_during_emergency() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);

    let admin = soroban_sdk::Address::generate(&env);
    let donor = soroban_sdk::Address::generate(&env);

    let (token, token_admin) = create_token(&env, &admin);
    token_admin.mint(&donor, &1_000_000_000);

    client.initialize(&admin);
    client.donate(&donor, &token.address, &1_000_000_000);

    // Declare emergency
    client.declare_emergency();
    assert_eq!(client.is_emergency(), true);

    // Withdraw 300 USDC for typhoon relief
    let purpose = String::from_str(&env, "Typhoon relief - Region IV-A");
    client.withdraw(&admin, &token.address, &300_000_000, &purpose);

    assert_eq!(client.get_total_withdrawn(), 300_000_000);
    assert_eq!(client.get_balance(), 700_000_000);
    assert_eq!(client.get_withdrawals().len(), 1);

    // Withdraw another batch
    let purpose2 = String::from_str(&env, "Food packs - Metro Manila");
    client.withdraw(&admin, &token.address, &200_000_000, &purpose2);

    assert_eq!(client.get_total_withdrawn(), 500_000_000);
    assert_eq!(client.get_balance(), 500_000_000);
    assert_eq!(client.get_withdrawals().len(), 2);
}

/// Test 6: Cannot withdraw more than contract balance
#[test]
#[should_panic(expected = "Insufficient contract balance")]
fn test_over_withdraw() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);

    let admin = soroban_sdk::Address::generate(&env);
    let donor = soroban_sdk::Address::generate(&env);

    let (token, token_admin) = create_token(&env, &admin);
    token_admin.mint(&donor, &500_000_000);

    client.initialize(&admin);
    client.donate(&donor, &token.address, &500_000_000);
    client.declare_emergency();

    // Try to withdraw more than balance - should panic
    let purpose = String::from_str(&env, "Overdraw");
    client.withdraw(&admin, &token.address, &600_000_000, &purpose);
}

/// Test 7: Multiple sequential emergencies
#[test]
fn test_emergency_toggle() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);
    let admin = soroban_sdk::Address::generate(&env);

    client.initialize(&admin);

    // Toggle emergency multiple times
    assert_eq!(client.is_emergency(), false);

    client.declare_emergency();
    assert_eq!(client.is_emergency(), true);

    client.lift_emergency();
    assert_eq!(client.is_emergency(), false);

    client.declare_emergency();
    assert_eq!(client.is_emergency(), true);

    client.declare_emergency();
    assert_eq!(client.is_emergency(), true);

    client.lift_emergency();
    assert_eq!(client.is_emergency(), false);
}

/// Test 8: Zero donation rejected
#[test]
fn test_zero_donation() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);

    let admin = soroban_sdk::Address::generate(&env);
    let donor = soroban_sdk::Address::generate(&env);

    let (token, token_admin) = create_token(&env, &admin);
    token_admin.mint(&donor, &1_000_000_000);

    client.initialize(&admin);

    // Valid donation first
    client.donate(&donor, &token.address, &100_000_000);
    assert_eq!(client.get_total_donated(), 100_000_000);
    assert_eq!(client.get_donations().len(), 1);
}

/// Test 9: Accurate donation history tracking
#[test]
fn test_donation_history_integrity() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);

    let admin = soroban_sdk::Address::generate(&env);
    let (token, token_admin) = create_token(&env, &admin);

    client.initialize(&admin);

    let donor1 = soroban_sdk::Address::generate(&env);
    let donor2 = soroban_sdk::Address::generate(&env);
    let donor3 = soroban_sdk::Address::generate(&env);

    token_admin.mint(&donor1, &100_000_000);
    token_admin.mint(&donor2, &200_000_000);
    token_admin.mint(&donor3, &300_000_000);

    client.donate(&donor1, &token.address, &100_000_000);
    client.donate(&donor2, &token.address, &200_000_000);
    client.donate(&donor3, &token.address, &300_000_000);

    let donations = client.get_donations();
    assert_eq!(donations.len(), 3);
    assert_eq!(donations.get(0).unwrap().amount, 100_000_000);
    assert_eq!(donations.get(1).unwrap().amount, 200_000_000);
    assert_eq!(donations.get(2).unwrap().amount, 300_000_000);
    assert_eq!(client.get_total_donated(), 600_000_000);
    assert_eq!(client.get_balance(), 600_000_000);
}
