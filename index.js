import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import Concordium from "@ledgerhq/hw-app-concordium";
import { listen } from "@ledgerhq/logs";
import { AccountAddress, AccountTransactionType, CcdAmount, SequenceNumber, ConcordiumGRPCWebClient, TransactionExpiry } from "@concordium/web-sdk";
import { verify, verifyAsync } from "@noble/ed25519";

listen((log) => console.log(log));

const test_sender_address = "4McQDikzr3GXi52Xjgcm2XZbq7E8YF7gzATZScZ5U59eLLkKjg";
const test_receiver_address = "4McQDikzr3GXi52Xjgcm2XZbq7E8YF7gzATZScZ5U59eLLkKjg";
const tx = Buffer.from("20a845815bd43a1999e90fbf971537a70392eb38f89e6bd32b3dd70e1a9551d7000000000000000a0000000000000064000000290000000063de5da70320a845815bd43a1999e90fbf971537a70392eb38f89e6bd32b3dd70e1a9551d7ffffffffffffffff", "hex");
const sig = Buffer.from("d1617ee706805c0bc6a43260ece93a7ceba37aaefa303251cf19bdcbbe88c0a3d3878dcb965cdb88ff380fdb1aa4b321671f365d7258e878d18fa1b398a1a10f", "hex");
const publicKey = Buffer.from("da342689aac8704e9a23a9a0075adb6e3c935abf6c137f897c7b50cf27c4dfdd", "hex");
console.log("tx", tx);
console.log("sig", sig);
console.log("publicKey", publicKey);

const verifySignature = async (sig, tx, publicKey) => {
  return await verifyAsync(sig, tx, publicKey);
};


const grpcClient = new ConcordiumGRPCWebClient( "node.testnet.concordium.com", 20000, { timeout: 15000 });
console.log(grpcClient);

let transport;
let ccd;
let addressWallet;
let sender = AccountAddress.fromBase58(test_sender_address);
// let sender = "20a845815bd43a1999e90fbf971537a70392eb38f89e6bd32b3dd70e1a9551d7";
let recipient = AccountAddress.fromBase58(test_receiver_address);
// let recipient = "20a845815bd43a1999e90fbf971537a70392eb38f89e6bd32b3dd70e1a9551d7";
let nonce = SequenceNumber.create(10);


const getAppVersion = async () => {
  transport = await TransportWebHID.create();
  ccd = new Concordium(transport);
  const result = await ccd.getVersion();

  const isValid = await verifySignature(sig, tx, publicKey);
  console.log("isValid", isValid);
  return result.version;
};

const getPublicKey = async () => {
  const result = await ccd.getAddress("44'/919'/0'", true, 0);
  return result.publicKey;
};

const verifyAddress = async () => {
  const result = await ccd.verifyAddress(0, 0, 0);
  return result;
};
const verifyAddressLegacy = async () => {
  const result = await ccd.verifyAddressLegacy(0, 0);
  return result;
};

const signSimpleTransfer = async () => {

  const simpleTransfer = {
    amount: CcdAmount.fromMicroCcd("999"),
    toAddress: recipient,
  };

  const transaction = {
    sender,
    nonce: nonce.toString(),
    expiry: BigInt(1745517351),
    energyAmount: '100',
    transactionKind: AccountTransactionType.Transfer,
    payload: simpleTransfer,
  };

  let result;
  try {
    result = await ccd.signTransfer(transaction, false, 0);
    console.log(result);
  } catch (error) {
    console.log(error);
  }

  return {transaction, signature: "d1617ee706805c0bc6a43260ece93a7ceba37aaefa303251cf19bdcbbe88c0a3d3878dcb965cdb88ff380fdb1aa4b321671f365d7258e878d18fa1b398a1a10f9000"};
};

const signSimpleTransferWithMemo = async () => {

  const simpleTransferWithMemo = {
    amount: CcdAmount.fromMicroCcd("999"),
    toAddress: recipient,
    memo: "Hello World",
  };

  const transaction = {
    sender,
    nonce: nonce.toString(),
    expiry: BigInt(123456),
    energyAmount: '1234',
    transactionKind: AccountTransactionType.TransferWithMemo,
    payload: simpleTransferWithMemo,
  };

  const result = await ccd.signTransferWithMemo(transaction, false, 0);
  console.log(result);

  return transaction;
};

const signTransferWithSchedule = async () => {

  const simpleTransferWithSchedule = {
    toAddress: recipient,
    schedule: [
      { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" },
      { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" },
      { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" },
      { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" },
      { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" },
      { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" },
      { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" },
      { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" },
      { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" },
      { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" },
      { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" },
      { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" },
      { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" },
      { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" },
      { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" },
    ],
  };

  const transaction = {
    sender,
    nonce: nonce.toString(),
    expiry: BigInt(123),
    energyAmount: '1234',
    transactionKind: AccountTransactionType.TransferWithSchedule,
    payload: simpleTransferWithSchedule,
  };

  const result = await ccd.signTransferWithSchedule(transaction, false, 0);
  console.log(result);

  return transaction;
};

const signConfigureDelegation = async () => {

  const configureDelegation = {
    stake: CcdAmount.fromMicroCcd("999"),
    restakeEarnings: false,
    delegationTarget: {
      delegateType: "Baker",
      bakerId: BigInt(12),
    },
  };

  const transaction = {
    sender,
    nonce: nonce.toString(),
    expiry: BigInt(123456),
    energyAmount: '1234',
    transactionKind: AccountTransactionType.ConfigureDelegation,
    payload: configureDelegation,
  };

  const result = await ccd.signConfigureDelegation(transaction, false, 0);
  console.log(result);

  return transaction;
};


//======================================================================================================================

document.getElementById("connect-ledger").onclick = async function () {
  //Getting the Concordium App version
  const version = await getAppVersion();
  console.log(version);

  document.getElementById(
    "version"
  ).innerHTML = `Concordium Application version: ${version}`;
};

document.getElementById("verify-address").onclick = async function () {
  const status = await verifyAddress();
  console.log(status);
  document.getElementById("verify-address").value = status;
};

document.getElementById("verify-address-legacy").onclick = async function () {
  const statusLegacy = await verifyAddressLegacy();
  console.log(statusLegacy);
  document.getElementById("verify-address-legacy").value = statusLegacy;
};

document.getElementById("get-address").onclick = async function () {
  //Getting the stellar account public key
  addressWallet = await getPublicKey();
  console.log(addressWallet);
  document.getElementById("wallet").value = addressWallet;
};

document.getElementById("simple-transfer").onclick = async function () {
  //Building transaction
  let {transaction, signature} = await signSimpleTransfer();
  console.log("Gui Sig: ", signature);
  console.log("Gui Sig slice: ", signature.slice(0, 64));
  const signatureSliced = signature.slice(0, 64);

  const transactionCredentialSignature = {};
  transactionCredentialSignature[0] = signature.toString('hex');

  const transactionAccountSignature = {};
  transactionAccountSignature[0] = transactionCredentialSignature;

  const header = {
    sender: transaction.sender,
    expiry: TransactionExpiry.fromEpochSeconds(transaction.expiry),
    nonce: BigInt(transaction.nonce),
  };
  const tx = {
    type: transaction.transactionKind,
    header,
    payload: transaction.payload,
  };

  try {
    const transactionResult = await grpcClient.sendAccountTransaction(
      tx,
      transactionAccountSignature
    );
    console.log(transactionResult);
  } catch (error) {
    console.log(error);
  }

  // Display the Ropsten etherscan on the screen
  // const hash = transactionResult.hash;
  // const url = "https://testnet.ccdscan.io/" + hash ;
  // document.getElementById("url").innerHTML = url;
  // document.getElementById("url").href = url;

};

document.getElementById("simple-transfer-with-memo").onclick = async function () {
  //Building transaction
  const transaction = await signSimpleTransferWithMemo();

  // const transactionResult = await server.submitTransaction(transaction);

  // Display the Ropsten etherscan on the screen
  // const hash = transactionResult.hash;
  // const url = "https://testnet.ccdscan.io/" + hash ;
  // document.getElementById("url").innerHTML = url;
  // document.getElementById("url").href = url;

};
document.getElementById("transfer-with-schedule").onclick = async function () {
  //Building transaction
  const transaction = await signTransferWithSchedule();

  // const transactionResult = await server.submitTransaction(transaction);

  // Display the Ropsten etherscan on the screen
  // const hash = transactionResult.hash;
  // const url = "https://testnet.ccdscan.io/" + hash ;
  // document.getElementById("url").innerHTML = url;
  // document.getElementById("url").href = url;

};

document.getElementById("configure-delegation").onclick = async function () {
  //Building transaction
  const transaction = await signConfigureDelegation();
};