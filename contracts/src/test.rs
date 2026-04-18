#![cfg(test)]

use super::*;
use soroban_sdk::{
    token::{Client as TokenClient, StellarAssetClient},
    Address, Env, String,
};

// ─── Test Helper ─────────────────────────────────────────────────────────────

fn create_token<'a>(env: &Env, admin: &Address) -> (TokenClient<'a>, StellarAssetClient<'a>) {
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
    let admin = Address::generate(&env);

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

    let admin = Address::generate(&env);
    let donor = Address::generate(&env);

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

    let admin = Address::generate(&env);
    let donor1 = Address::generate(&env);
    let donor2 = Address::generate(&env);
    let donor3 = Address::generate(&env);

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
    let admin = Address::generate(&env);

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

    let admin = Address::generate(&env);
    let donor = Address::generate(&env);

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
