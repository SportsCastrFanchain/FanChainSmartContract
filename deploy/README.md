# FanChain by SportsCastr DEPLOY

**Contracts in deploy/contracts where flattened using "truffle-flattener" ( https://github.com/alcuadrado/truffle-flattener )**

truffle-flattener version: truffle-flattener@1.2.5

---

**Compiled using solcjs.**

solcjs version: 0.4.24+commit.e67f0147.Emscripten.clang

---

**Compile Operation**

```
==> perl -e 'print time() . "\n" . gmtime() . "\n";'; echo "-------" ; solcjs --abi FanCoin_flat.sol ; echo "-------" ; solcjs --bin FanCoin_flat.sol ; echo "-------"; perl -e 'print time() . "\n" . gmtime() . "\n";'
1529095893
Fri Jun 15 20:51:33 2018
-------
FanCoin_flat.sol:160:5: Warning: Defining constructors as functions with the same name as the contract is deprecated. Use "constructor(...) { ... }" instead.
    function FanCoin() public {
    ^ (Relevant source part starts here and spans across multiple lines).

-------
FanCoin_flat.sol:160:5: Warning: Defining constructors as functions with the same name as the contract is deprecated. Use "constructor(...) { ... }" instead.
    function FanCoin() public {
    ^ (Relevant source part starts here and spans across multiple lines).

-------
1529095917
Fri Jun 15 20:51:57 2018
```

---

**SHA256 Results**

```
==> shasum -a 256 FanCoin_flat*
dc3616ebc7d5e332bac73e4c4c5a6be98b8dee9ed337ae9a84e64c4b718d34e0  FanCoin_flat.sol
4e9cc408f5e74979c974f8e87290bf82a17eced92661947e1e08b0a41358b2ba  FanCoin_flat_sol_ERC20.abi
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  FanCoin_flat_sol_ERC20.bin
9776c88575a07a5ffca330f18cd5f61cfccd8c199519b7f42f32a417a29f8e6e  FanCoin_flat_sol_FanCoin.abi
fc5e1f6eb6ca59a570639c255c80019a226ccac25babb23704729a06d65a9457  FanCoin_flat_sol_FanCoin.bin
4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945  FanCoin_flat_sol_SafeMath.abi
f4600957f25fde167b3aef55733ad3892bccb4651f886d64c3a22b77ca4b4cae  FanCoin_flat_sol_SafeMath.bin
c429bdbedf7603339865e8589531b7989ef9a845b731ec90db7be5309ab559b0  FanCoin_flat_sol_Stampable.abi
e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  FanCoin_flat_sol_Stampable.bin
```

---

**Versions as used to create contract**

Files were renamed and placed in the *deploy* directory

```
==> shasum -a 256 deploy/FanChain.*
9776c88575a07a5ffca330f18cd5f61cfccd8c199519b7f42f32a417a29f8e6e  deploy/FanChain.abi
fc5e1f6eb6ca59a570639c255c80019a226ccac25babb23704729a06d65a9457  deploy/FanChain.bin
```

---

**DEPLOY**

Transaction: 0xd2a69634d81f3b4bb5d57d5e46713436160188a8adf92d0238cc8975bb6e705b

Creator: 0x7ddf115b8eef3058944a3373025fb507effad012 ( Owner )

Contract: 0xA22160BEA244F00BEF5a0b1Ca85977b005716Fec

https://etherscan.io/address/0xA22160BEA244F00BEF5a0b1Ca85977b005716Fec

