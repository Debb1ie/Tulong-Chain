#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::Address,
    token::{Client as TokenClient, StellarAssetClient},
    Env, String,
};

fn create_token<'a>(env: &Env, admin: &soroban_sdk::Address) -> (TokenClient<'a>, StellarAssetClient<'a>) {
    let sac = env.register_stellar_asset_contract_v2(admin.clone());
    (TokenClient::new(env, &sac.address()), StellarAssetClient::new(env, &sac.address()))
}

#[test]
fn test_initialize() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);
    let admin = soroban_sdk::Address::generate(&env);
    client.initialize(&admin);
    assert_eq!(client.get_total_donated(), 0);
    assert_eq!(client.is_emergency(), false);
}

#[test]
fn test_single_donation() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);
    let admin = soroban_sdk::Address::generate(&env);
    let donor = soroban_sdk::Address::generate(&env);
    let (token, token_admin) = create_token(&env, &admin);
    token_admin.mint(&donor, &1_000_000_000);
    client.initialize(&admin);
    client.donate(&donor, &token.address, &500_000_000);
    assert_eq!(client.get_total_donated(), 500_000_000);
}

#[test]
fn test_multiple_donors() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);
    let admin = soroban_sdk::Address::generate(&env);
    let donor1 = soroban_sdk::Address::generate(&env);
    let donor2 = soroban_sdk::Address::generate(&env);
    let (token, token_admin) = create_token(&env, &admin);
    token_admin.mint(&donor1, &500_000_000);
    token_admin.mint(&donor2, &300_000_000);
    client.initialize(&admin);
    client.donate(&donor1, &token.address, &500_000_000);
    client.donate(&donor2, &token.address, &300_000_000);
    assert_eq!(client.get_total_donated(), 800_000_000);
}

#[test]
fn test_emergency_lifecycle() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);
    let admin = soroban_sdk::Address::generate(&env);
    client.initialize(&admin);
    assert!(!client.is_emergency());
    client.declare_emergency();
    assert!(client.is_emergency());
    client.lift_emergency();
    assert!(!client.is_emergency());
}

#[test]
fn test_withdraw() {
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
    client.declare_emergency();
    let purpose = String::from_str(&env, "Relief");
    client.withdraw(&admin, &token.address, &300_000_000, &purpose);
    assert_eq!(client.get_total_withdrawn(), 300_000_000);
    assert_eq!(client.get_balance(), 700_000_000);
}

#[test]
#[should_panic(expected = "Insufficient")]
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
    let purpose = String::from_str(&env, "Overdraw");
    client.withdraw(&admin, &token.address, &600_000_000, &purpose);
}

#[test]
#[should_panic(expected = "Amount must be > 0")]
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
    client.donate(&donor, &token.address, &0i128);
}

#[test]
fn test_history() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);
    let admin = soroban_sdk::Address::generate(&env);
    let (token, token_admin) = create_token(&env, &admin);
    let d1 = soroban_sdk::Address::generate(&env);
    let d2 = soroban_sdk::Address::generate(&env);
    let d3 = soroban_sdk::Address::generate(&env);
    token_admin.mint(&d1, &100_000_000);
    token_admin.mint(&d2, &200_000_000);
    token_admin.mint(&d3, &300_000_000);
    client.initialize(&admin);
    client.donate(&d1, &token.address, &100_000_000);
    client.donate(&d2, &token.address, &200_000_000);
    client.donate(&d3, &token.address, &300_000_000);
    assert_eq!(client.get_total_donated(), 600_000_000);
    assert_eq!(client.get_donations().len(), 3);
}

#[test]
fn test_balance() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);
    let admin = soroban_sdk::Address::generate(&env);
    let donor = soroban_sdk::Address::generate(&env);
    let (token, token_admin) = create_token(&env, &admin);
    token_admin.mint(&donor, &1_000_000_000);
    client.initialize(&admin);
    client.donate(&donor, &token.address, &400_000_000);
    assert_eq!(client.get_balance(), 400_000_000);
    client.declare_emergency();
    let purpose = String::from_str(&env, "Out");
    client.withdraw(&admin, &token.address, &150_000_000, &purpose);
    assert_eq!(client.get_balance(), 250_000_000);
}

#[test]
#[should_panic(expected = "auth")]
fn test_unauthorized_withdraw() {
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
    client.declare_emergency();
    let stranger = soroban_sdk::Address::generate(&env);
    let purpose = String::from_str(&env, "Unauthorized");
    client.withdraw(&stranger, &token.address, &100_000_000, &purpose);
}
