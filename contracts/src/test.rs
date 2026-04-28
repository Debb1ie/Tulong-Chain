#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::{Address, Ledger},
    token::{Client as TokenClient, StellarAssetClient},
    Env, String,
};

fn create_token<'a>(env: &Env, admin: &soroban_sdk::Address) -> (TokenClient<'a>, StellarAssetClient<'a>) {
    let sac = env.register_stellar_asset_contract_v2(admin.clone());
    (TokenClient::new(env, &sac.address()), StellarAssetClient::new(env, &sac.address()))
}

// ── Core ──────────────────────────────────────────────────────────────────────

#[test]
fn test_initialize() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);
    let admin = soroban_sdk::Address::generate(&env);
    client.initialize(&admin);
    assert_eq!(client.get_total_donated(), 0);
    assert!(!client.is_emergency());
    assert!(!client.is_paused());
}

#[test]
fn test_donate() {
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
    assert_eq!(client.get_balance(), 500_000_000);
    assert_eq!(client.get_donations().len(), 1);
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
fn test_emergency_instant() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);
    let admin = soroban_sdk::Address::generate(&env);
    client.initialize(&admin);
    assert!(!client.is_emergency());
    let activates = client.declare_emergency();
    assert!(activates <= env.ledger().timestamp());
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
    assert_eq!(client.get_withdrawals().len(), 1);
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
#[should_panic(expected = "> 0")]
fn test_zero_amount() {
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
    let purpose = String::from_str(&env, "Unauth");
    client.withdraw(&stranger, &token.address, &100_000_000, &purpose);
}

// ── Pausable ──────────────────────────────────────────────────────────────────

#[test]
fn test_pause_unpause() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);
    let admin = soroban_sdk::Address::generate(&env);
    let donor = soroban_sdk::Address::generate(&env);
    let (token, token_admin) = create_token(&env, &admin);
    token_admin.mint(&donor, &1_000_000_000);
    client.initialize(&admin);

    assert!(!client.is_paused());
    client.pause();
    assert!(client.is_paused());
    client.unpause();
    assert!(!client.is_paused());
    client.donate(&donor, &token.address, &100_000_000);
    assert_eq!(client.get_total_donated(), 100_000_000);
}

#[test]
#[should_panic(expected = "paused")]
fn test_donate_when_paused() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);
    let admin = soroban_sdk::Address::generate(&env);
    let donor = soroban_sdk::Address::generate(&env);
    let (token, token_admin) = create_token(&env, &admin);
    token_admin.mint(&donor, &1_000_000_000);
    client.initialize(&admin);
    client.pause();
    client.donate(&donor, &token.address, &100_000_000);
}

#[test]
#[should_panic(expected = "paused")]
fn test_withdraw_when_paused() {
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
    client.pause();
    let purpose = String::from_str(&env, "Paused");
    client.withdraw(&admin, &token.address, &100_000_000, &purpose);
}

// ── Timelock ──────────────────────────────────────────────────────────────────

#[test]
fn test_timelock_instant_default() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);
    let admin = soroban_sdk::Address::generate(&env);
    client.initialize(&admin);
    assert_eq!(client.get_timelock_duration(), 0);
    let activates = client.declare_emergency();
    assert!(activates <= env.ledger().timestamp());
    assert!(client.is_emergency());
}

#[test]
fn test_timelock_with_delay() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);
    let admin = soroban_sdk::Address::generate(&env);
    client.initialize(&admin);
    client.set_timelock(&3600);
    assert_eq!(client.get_timelock_duration(), 3600);

    let now = env.ledger().timestamp();
    let activates = client.declare_emergency();
    assert_eq!(activates, now + 3600);
    assert!(!client.is_emergency());

    env.ledger().set_timestamp(now + 3600 + 1);
    assert!(client.is_emergency());
    client.activate_emergency(); // also works post-timelock
}

#[test]
#[should_panic(expected = "at least")]
fn test_set_timelock_too_short() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);
    let admin = soroban_sdk::Address::generate(&env);
    client.initialize(&admin);
    client.set_timelock(&599);
}

#[test]
fn test_timelock_lift_before_activation() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);
    let admin = soroban_sdk::Address::generate(&env);
    client.initialize(&admin);
    client.set_timelock(&3600);
    client.declare_emergency();
    assert!(!client.is_emergency());
    client.lift_emergency();
    assert!(!client.is_emergency());
    let info = client.get_emergency_timelock();
    assert_eq!(info.activates_at, 0);
}

// ── Batch ──────────────────────────────────────────────────────────────────────

#[test]
fn test_batch_donate() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);
    let admin = soroban_sdk::Address::generate(&env);
    let donor = soroban_sdk::Address::generate(&env);
    let (token, token_admin) = create_token(&env, &admin);
    token_admin.mint(&donor, &5_000_000_000);
    client.initialize(&admin);

    let mut batches = Vec::new(&env);
    batches.push_back((token.address.clone(), 1_000_000_000, AssetType::Usdc));
    batches.push_back((token.address.clone(), 2_000_000_000, AssetType::Usdc));
    batches.push_back((token.address.clone(), 2_000_000_000, AssetType::Usdc));

    client.batch_donate(&donor, &batches);

    assert_eq!(client.get_total_donated(), 5_000_000_000);
    assert_eq!(client.get_donations().len(), 3);
}

#[test]
#[should_panic(expected = "Empty")]
fn test_batch_donate_empty() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);
    let admin = soroban_sdk::Address::generate(&env);
    let donor = soroban_sdk::Address::generate(&env);
    client.initialize(&admin);
    let empty = Vec::new(&env);
    client.batch_donate(&donor, &empty);
}

#[test]
fn test_batch_withdraw() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);
    let admin = soroban_sdk::Address::generate(&env);
    let donor = soroban_sdk::Address::generate(&env);
    let (token, token_admin) = create_token(&env, &admin);
    token_admin.mint(&donor, &5_000_000_000);
    client.initialize(&admin);
    client.donate(&donor, &token.address, &5_000_000_000);
    client.declare_emergency();

    let mut batches = Vec::new(&env);
    batches.push_back((String::from_str(&env, "A"), 1_000_000_000));
    batches.push_back((String::from_str(&env, "B"), 2_000_000_000));
    client.batch_withdraw(&admin, &token.address, &batches);

    assert_eq!(client.get_total_withdrawn(), 3_000_000_000);
    assert_eq!(client.get_withdrawals().len(), 2);
}

#[test]
#[should_panic(expected = "Unauthorized")]
fn test_batch_withdraw_unauthorized() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);
    let admin = soroban_sdk::Address::generate(&env);
    let donor = soroban_sdk::Address::generate(&env);
    let (token, token_admin) = create_token(&env, &admin);
    token_admin.mint(&donor, &2_000_000_000);
    client.initialize(&admin);
    client.donate(&donor, &token.address, &2_000_000_000);
    client.declare_emergency();
    let batches = Vec::new(&env);
    client.batch_withdraw(&soroban_sdk::Address::generate(&env), &token.address, &batches);
}

// ── Combined Advanced Flow ────────────────────────────────────────────────────

#[test]
fn test_advanced_complex_flow() {
    let env = Env::default();
    env.mock_all_auths();
    let contract_id = env.register(TulongChain, ());
    let client = TulongChainClient::new(&env, &contract_id);
    let admin = soroban_sdk::Address::generate(&env);
    let donor = soroban_sdk::Address::generate(&env);
    let (token, token_admin) = create_token(&env, &admin);
    token_admin.mint(&donor, &2_000_000_000);
    client.initialize(&admin);

    assert!(!client.is_paused());
    assert_eq!(client.get_timelock_duration(), 0);

    client.donate(&donor, &token.address, &1_000_000_000);
    assert_eq!(client.get_balance(), 1_000_000_000);

    client.set_timelock(&3600);
    assert_eq!(client.get_timelock_duration(), 3600);

    let now = env.ledger().timestamp();
    let activates = client.declare_emergency();
    assert_eq!(activates, now + 3600);
    assert!(!client.is_emergency());

    client.pause();
    client.unpause();

    env.ledger().set_timestamp(now + 3600 + 1);
    client.activate_emergency();
    assert!(client.is_emergency());

    let mut batches = Vec::new(&env);
    batches.push_back((String::from_str(&env, "Food"), 300_000_000));
    batches.push_back((String::from_str(&env, "Water"), 200_000_000));
    client.batch_withdraw(&admin, &token.address, &batches);

    assert_eq!(client.get_total_withdrawn(), 500_000_000);
    assert_eq!(client.get_balance(), 500_000_000);

    client.lift_emergency();
    assert!(!client.is_emergency());
}