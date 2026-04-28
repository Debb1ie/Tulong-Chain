@echo off
REM TulongChain - Generate 5 Testnet Users with Donations
REM Requires: Stellar CLI (cargo install stellar-cli) - see README prerequisites

echo Generating 5 testnet accounts with real donations...
echo.

set CONTRACT=CBSX6H3XDLZQELJA2V2LKSELAUDSKRPVL64ZKUDUCFJWDOTDUUASP5IC
set USDC=CBIELTK6YBZJU5UP2WWQEUCYKLPU6AUNZ2BQ4WWFEIE3USCIHMXQDAMA

REM Delete old accounts if exist
if exist "user1.secret" del user1.secret
if exist "user2.secret" del user2.secret
if exist "user3.secret" del user3.secret
if exist "user4.secret" del user4.secret
if exist "user5.secret" del user5.secret

REM Generate keys
echo Creating account 1...
stellar keys generate user1 --global
call :donate user1 "User 1 (Alex)" 0.1

echo Creating account 2...
stellar keys generate user2 --global
call :donate user2 "User 2 (Maria)" 0.15

echo Creating account 3...
stellar keys generate user3 --global
call :donate user3 "User 3 (John)" 0.2

echo Creating account 4...
stellar keys generate user4 --global
call :donate user4 "User 4 (Sarah)" 0.25

echo Creating account 5...
stellar keys generate user5 --global
call :donate user5 "User 5 (Leo)" 0.3

echo.
echo ========================================
echo All done! Check user*.secret for wallet data.
echo Take screenshots of:
echo   1. Freighter connected to each wallet
echo   2. Transaction history in Stellar Expert
echo   3. Contract donation count increasing
echo ========================================
pause
exit /b 0

:donate
REM %1 = key name, %2 = user label, %3 = amount in USDC
echo.
echo Funding %1...
for /f "delims=" %%A in ('stellar keys address %1') do set ADDR=%%A
curl -s "https://friendbot.stellar.org?account=%ADDR%" > nul
echo  Funded: %ADDR%

echo Waiting 3s for friendbot...
ping -n 4 127.0.0.1 > nul

echo Donating %3 USDC from %1...
stellar contract invoke ^
  --id %CONTRACT% ^
  --source %1 ^
  --network testnet ^
  -- donate ^
  --donor %ADDR% ^
  --token %USDC% ^
  --amount %3 ^
  > donation_%1.log 2>&1

REM Extract tx hash from log
for /f "tokens=2" %%H in ('findstr /C:"tx:" donation_%1.log') do set TX=%%H
echo  TxHash: %TX%
echo  Explorer: https://stellar.expert/explorer/testnet/tx/%TX%
echo.
exit /b 0
