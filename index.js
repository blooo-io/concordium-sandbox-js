import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import Concordium from "@ledgerhq/hw-app-concordium";
import { listen } from "@ledgerhq/logs";
import { AccountAddress, AccountTransactionType, CcdAmount, SequenceNumber } from "@concordium/web-sdk";
import { verifyAsync } from "@noble/ed25519";

listen((log) => console.log(log));

const test_sender_address = "4McQDikzr3GXi52Xjgcm2XZbq7E8YF7gzATZScZ5U59eLLkKjg";
const test_receiver_address = "4McQDikzr3GXi52Xjgcm2XZbq7E8YF7gzATZScZ5U59eLLkKjg";

const verifySignature = async (sig, tx, publicKey) => {
  return await verifyAsync(sig, tx, publicKey);
};

let transport;
let ccd;
let publicKey;
let sender = AccountAddress.fromBase58(test_sender_address);
let recipient = AccountAddress.fromBase58(test_receiver_address);
let nonce = SequenceNumber.create(10);

const getAppVersion = async () => {
  transport = await TransportWebHID.create();
  ccd = new Concordium(transport);
  const result = await ccd.getVersion();
  return result.version;
};

const getPublicKey = async () => {
  const result = await ccd.getPublicKey("44'/919'/0'/0'/0'/0'", true, true);
  return result.publicKey;
};

const verifyAddress = async () => {
  const result = await ccd.verifyAddress(0, 0, 0);
  return result.status;
};
const verifyAddressLegacy = async () => {
  const result = await ccd.verifyAddressLegacy(0, 0);
  return result.status;
};

const signSimpleTransfer = async () => {
  try {
    const simpleTransfer = {
      amount: CcdAmount.fromMicroCcd("999"),
      toAddress: recipient,
    };

    const tx = {
      sender,
      nonce: nonce.toString(),
      expiry: BigInt(1745517351),
      energyAmount: '100',
      transactionKind: AccountTransactionType.Transfer,
      payload: simpleTransfer,
    };

    const {publicKey} = await ccd.getPublicKey("44'/919'/0'/0'/0'/0'", false, true);
    const { transaction, signature } = await ccd.signTransfer(tx, "44'/919'/0'/0'/0'/0'");

    const isValid = await verifySignature(signature, transaction, publicKey);
    return isValid;
  } catch (error) {
    console.log(error);
  }
};

const signSimpleTransferWithMemo = async () => {
  try {

    const simpleTransferWithMemo = {
      amount: CcdAmount.fromMicroCcd("999"),
      toAddress: recipient,
      memo: "Hello World",
    };

    const tx = {
      sender,
      nonce: nonce.toString(),
      expiry: BigInt(123456),
      energyAmount: '1234',
      transactionKind: AccountTransactionType.TransferWithMemo,
      payload: simpleTransferWithMemo,
    };

    const {publicKey} = await ccd.getPublicKey("44'/919'/0'/0'/0'/0'", false, true);
    const {transaction, signature} = await ccd.signTransferWithMemo(tx, "44'/919'/0'/0'/0'/0'");

    const isValid = await verifySignature(signature, transaction, publicKey);
    return isValid;
  } catch (error) {
    console.log(error);
  }
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

  const tx = {
    sender,
    nonce: nonce.toString(),
    expiry: BigInt(123),
    energyAmount: '1234',
    transactionKind: AccountTransactionType.TransferWithSchedule,
    payload: simpleTransferWithSchedule,
  };

  const {publicKey} = await ccd.getPublicKey("44'/919'/0'/0'/0'/0'", false, true);
  const {transaction, signature} = await ccd.signTransferWithSchedule(tx, "44'/919'/0'/0'/0'/0'");

  const isValid = await verifySignature(signature, transaction, publicKey);
  return isValid;
};

const signTransferWithScheduleMemo = async () => {

  const simpleTransferWithScheduleAndMemo = {
    toAddress: recipient,
    schedule: [
      { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" },
      { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" },
      { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" }, { timestamp: "123456", amount: "999" },
    ],
    memo: "Hello World",
  };

  const tx = {
    sender,
    nonce: nonce.toString(),
    expiry: BigInt(123),
    energyAmount: '1234',
    transactionKind: AccountTransactionType.TransferWithScheduleAndMemo,
    payload: simpleTransferWithScheduleAndMemo,
  };

  const {publicKey} = await ccd.getPublicKey("44'/919'/0'/0'/0'/0'", false, true);
  const {transaction, signature} = await ccd.signTransferWithScheduleAndMemo(tx, "44'/919'/0'/0'/0'/0'");

  const isValid = await verifySignature(signature, transaction, publicKey);
  return isValid;
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

  const tx = {
    sender,
    nonce: nonce.toString(),
    expiry: BigInt(123456),
    energyAmount: '1234',
    transactionKind: AccountTransactionType.ConfigureDelegation,
    payload: configureDelegation,
  };

  const {publicKey} = await ccd.getPublicKey("44'/919'/0'/0'/0'/0'", false, true);
  const {transaction, signature} = await ccd.signConfigureDelegation(tx, "44'/919'/0'/0'/0'/0'");

  const isValid = await verifySignature(signature, transaction, publicKey);
  return isValid;
};

const signConfigureBaker = async () => {

  const configureBaker = {
    stake: CcdAmount.fromMicroCcd("999"),
    restakeEarnings: false,
    openForDelegation: 0,
    keys: {
      signatureVerifyKey: "7873cd57848d7aea7be03fbb3f1e8b9e69987fc73f13e473356776a16f26c96b",
      electionVerifyKey: "32f892fb3d0dc6138976b6848259cf730e37fa4a61a659c782ec6def978c0828",
      aggregationVerifyKey: "7873cd57848d7aea7be03fbb3f1e8b9e69987fc73f13e473356776a16f26c96b32f892fb3d0dc6138976b6848259cf730e37fa4a61a659c782ec6def978c082832f892fb3d0dc6138976b6848259cf730e37fa4a61a659c782ec6def978c0828",
      proofAggregation: "957aec4b2b7ed979ba2079d62246d135aefd61e7f46690c452fec8bcbb593481e229f6f1968194a09cf612490887e71d96730e2d852201e53fec9c89d36f8a90",
      proofSig: "a47cdf9133572e9ad5c02c3a7ffd1d05db7bb98860d918092454146153d62788f224c0157c65853ed4a0245ab3e0a593a3f85fa81cc4cb99eeaa643bfc793eab",
      proofElection: "01fc695a8c51d4599cbe032a39832ad49bab900d88105b01d025b760b0d0d555b8c828f2d8fe29cc78c6307d979e6358b8bba9cf4d8200f272cc85b2a3813eff",
    },
    metadataUrl: "https://example.com",
    transactionFeeCommission: 10,
    bakingRewardCommission: 10,
    finalizationRewardCommission: 10,
  };

  const tx = {
    sender,
    nonce: nonce.toString(),
    expiry: BigInt(123456),
    energyAmount: '1234',
    transactionKind: AccountTransactionType.ConfigureBaker,
    payload: configureBaker,
  };

  const {publicKey} = await ccd.getPublicKey("44'/919'/0'/0'/0'/0'", false, true);
  const {transaction, signature} = await ccd.signConfigureBaker(tx, "44'/919'/0'/0'/0'/0'");

  const isValid = await verifySignature(signature, transaction, publicKey);
  return isValid;
};


//======================================================================================================================

document.getElementById("connect-ledger").onclick = async function () {
  //Getting the Concordium App version
  const version = await getAppVersion();
  document.getElementById(
    "version"
  ).innerHTML = `Concordium Application version: ${version}`;


};

document.getElementById("verify-address").onclick = async function () {
  const status = await verifyAddress();
  document.getElementById("verify-address-input").value = status;
};

document.getElementById("verify-address-legacy").onclick = async function () {
  const statusLegacy = await verifyAddressLegacy();
  document.getElementById("verify-address-legacy-input").value = statusLegacy;
};

document.getElementById("get-address").onclick = async function () {
  //Getting the stellar account public key
  publicKey = await getPublicKey();
  document.getElementById("wallet-input").value = publicKey;
};

document.getElementById("simple-transfer").onclick = async function () {
  //Building transaction
  const isValid = await signSimpleTransfer();

  document.getElementById("simple-transfer-input").value = isValid ? "Valid Signature" : "Invalid Signature";
};

document.getElementById("simple-transfer-with-memo").onclick = async function () {
  //Building transaction
  const isValid = await signSimpleTransferWithMemo();
  document.getElementById("simple-transfer-with-memo-input").value = isValid ? "Valid Signature" : "Invalid Signature";
};
document.getElementById("transfer-with-schedule").onclick = async function () {
  //Building transaction
  const isValid = await signTransferWithSchedule();
  document.getElementById("transfer-with-schedule-input").value = isValid ? "Valid Signature" : "Invalid Signature";
};
document.getElementById("transfer-with-schedule-memo").onclick = async function () {
  //Building transaction
  const isValid = await signTransferWithScheduleMemo();
  document.getElementById("transfer-with-schedule-memo-input").value = isValid ? "Valid Signature" : "Invalid Signature";
};

document.getElementById("configure-delegation").onclick = async function () {
  //Building transaction
  const isValid = await signConfigureDelegation();
  document.getElementById("configure-delegation-input").value = isValid ? "Valid Signature" : "Invalid Signature";
};

document.getElementById("configure-baker").onclick = async function () {
  //Building transaction
  const isValid = await signConfigureBaker();
  document.getElementById("configure-baker-input").value = isValid ? "Valid Signature" : "Invalid Signature";
};
