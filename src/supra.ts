import { a, aw, U } from "@aptos-labs/ts-sdk/dist/common/accountAddress-BHsGaOsa";
import { 
  HexString, 
  SupraAccount, 
  SupraClient, 
  BCS, 
  TxnBuilderTypes,
} from "supra-l1-sdk";
const supraCoinType:string = "0x1::supra_coin::SupraCoin";

async function getClient() {
  let url = "https://rpc-testnet.supra.com/";
  let supraClient = await SupraClient.init(url);  
  console.log("Connected to Supra client:");
  return supraClient;
}

async function getAccount(path?:string, mnemonic?:string,privateKey?:Uint8Array) {
  if (privateKey) {
    return new SupraAccount(privateKey);
  }

  if (mnemonic && path) {
    return SupraAccount.fromDerivePath(path, mnemonic);
  }

  throw new Error(
    "Must provide either privateKey or both mnemonic and path"
  );
}

async function fundAccount(path:string, mnemonic:string) {
  const client:SupraClient = await getClient();
  const account:SupraAccount = await getAccount(path, mnemonic);
  const txHash = await client.fundAccountWithFaucet(account.address());
  console.log("txHash:", txHash);
}


async function getTransactionDetails(txHash: string, path?:string, mnemonic?:string,privateKey?:Uint8Array) {
  let client = await getClient();
  let account = await getAccount(path, mnemonic,privateKey);
  const txDetails = await client.getTransactionDetail(
    account.address(),
    txHash
  );
  console.log("Transaction Details:", txDetails);
  return txDetails;
}

async function getTransactionHistory(path:string, mnemonic:string,count?:number) {
  let client = await getClient();
  let account = await getAccount(path, mnemonic);
  const txHistory = await client.getAccountCompleteTransactionsDetail(account.address(),count);
  console.log("Transaction History:", txHistory);
  return txHistory;
}


async function getAccountInfo(path:string, mnemonic:string) {
  const client:SupraClient = await getClient();
  const account:SupraAccount = await getAccount(path, mnemonic);
  const accountInfo = await client.getAccountInfo(account.address());
  console.log("accountInfo:", accountInfo);
  const balance = await client.getAccountCoinBalance(account.address(), supraCoinType);
  console.log("balance:", balance);
}

async function getAccountModules(path?:string, mnemonic?:string, privateKey?:Uint8Array) {
  const client:SupraClient = await getClient();
  const account:SupraAccount = await getAccount(path, mnemonic, privateKey);
  const accountResources = await client.getAccountResources(account.address());
  return accountResources;
}
async function transferCoins(path:string, mnemonic:string, recipient:string, amount:number,coinType:string) {
  const client:SupraClient = await getClient();
  const account:SupraAccount = await getAccount(path, mnemonic);
  const recipientAddress = new HexString(recipient);
  const txn = await client.transferCoin(
    account,
    recipientAddress,
    BigInt(amount),
    coinType,
  );
  console.log("txn:", txn);
}

async function initDeploy(path?:string, mnemonic?:string, privateKey?:Uint8Array) {
  const client:SupraClient = await getClient();
  const account:SupraAccount = await getAccount(path, mnemonic, privateKey);
  console.log("account:", account.address());
  let fargs:any = [];
  let args: Uint8Array[] = [];
  const rawTxn = await client.createSerializedRawTxObject(account.address(),BigInt(10),account.address().toString(),'micropayment','init_deploy',fargs,args);
  console.log("rawTxn:", rawTxn);
  const result = await client.sendTxUsingSerializedRawTransaction(account,rawTxn);
  console.log("result:", result);

}

async function createChannel(path?:string, mnemonic?:string, privateKey?:Uint8Array) {
  const client:SupraClient = await getClient();
  const tpath = "m/44'/637'/0'/0'/0'"; // replace with your actual path
  const tmnemonic = "true before faith someone cushion plate copper know nominee wealth attend swing"; 
  const account:SupraAccount = await getAccount(path, mnemonic, privateKey);
  const merch:SupraAccount = await getAccount(tpath, tmnemonic, undefined);
  console.log("account:", account.address());
  let functionArgumentTypes: TxnBuilderTypes.TypeTag[] = [
    // TxnBuilderTypes.TransactionArgumentAddress,  // Argument type for address
    // TxnBuilderTypes.TypeTag.      // Argument type for u64 (amount)
  ];
  let fArgs: Uint8Array[] = [merch.address().toUint8Array(),BCS.bcsSerializeUint64(10000),BCS.bcsSerializeUint64(10000),BCS.bcsSerializeStr('9c8401a28be16654631911f6db21ba0b374d13108578462f7426995d7a006050')];
  const rawTxn = await client.createSerializedRawTxObject(account.address(),
  ( await client.getAccountInfo(account.address())).sequence_number
  ,account.address().toString(),'micropayment','create_channel',functionArgumentTypes,fArgs);
  console.log("rawTxn:", rawTxn);
  const result = await client.sendTxUsingSerializedRawTransaction(account,rawTxn,{
    enableTransactionSimulation: true,
    enableWaitForTransaction: true,
  });
  console.log("result:", result);

}

async function closeChannel(path?:string, mnemonic?:string, privateKey?:Uint8Array) {
  const account:SupraAccount = await getAccount(undefined, undefined, privateKey);
  const client:SupraClient = await getClient();
  const tpath = "m/44'/637'/0'/0'/0'"; // replace with your actual path
  const tmnemonic = "true before faith someone cushion plate copper know nominee wealth attend swing"; 
  const merch:SupraAccount = await getAccount(tpath, tmnemonic, undefined);
  let functionArgumentTypes: TxnBuilderTypes.TypeTag[] = [
    // TxnBuilderTypes.TransactionArgumentAddress,  // Argument type for address
    // TxnBuilderTypes.TypeTag.      // Argument type for u64 (amount)
  ];
  let fArgs: Uint8Array[] = [BCS.bcsSerializeStr('4a2a1b705685a31066c631974bf373df7ff95a375231f756a1af63253026e01b'),BCS.bcsSerializeUint64(2),BCS.bcsSerializeUint64(2)];
  const rawTxn = await client.createSerializedRawTxObject(merch.address(),
    ( await client.getAccountInfo(merch.address())).sequence_number
    ,account.address().toString(),'micropayment','redeem_channel',functionArgumentTypes,fArgs);
  console.log("rawTxn:", rawTxn);
  const result = await client.sendTxUsingSerializedRawTransaction(merch,rawTxn);
  console.log("result:", result);
}

async function main() {
  const userPrivateKey = new Uint8Array([
    177, 13, 175, 245, 45, 202, 185, 140, 173, 157, 243,
    19, 209, 64, 56, 190, 218, 166, 24, 30, 211, 102,
    32, 55, 142, 197, 216, 242, 145, 229, 23, 146, 90,
    210, 132, 125, 3, 140, 68, 1, 148, 110, 112, 19,
    15, 226, 161, 108, 65, 15, 245, 64, 154, 24, 248,
    211, 203, 191, 65, 202, 121, 246, 18, 178
  ]);
  const hexString = '67e240c49df15ae512328ab26a34fbe3cec33fa9e0fd9a758e7c43cd914019da';
  const key =  hexToUint8Array(hexString);
  const path = "m/44'/637'/0'/0'/0'"; // replace with your actual path
  const mnemonic = "true before faith someone cushion plate copper know nominee wealth attend swing"; 
  const txHash = '0xde428cadef25e4d0588d9f82bbe2e9be7e6cef7723a500b8cda7f25838856cfb';
  try {
    // const accountInfo = await getAccountInfo(path, mnemonic);
    // console.log(accountInfo);
    // const transfer = await transferCoins(path, mnemonic, "0x3938d6c06231866bcdf7bbdbd4f7f8fbeb7e7591069574ec9b4527e48380eb2f", 100000000, supraCoinType);
    // console.log(transfer);
    // let txHashInfo = await getTransactionDetails(txHash, undefined, undefined,key);
    // console.log(txHashInfo);
    // let txHistory = await getTransactionHistory(path, mnemonic, 5);
    // console.log(txHistory);
    //  let resources = await getAccountModules(undefined, undefined, key);
    //  await fetchPackageRegistry(resources);
  //     resources.resource.forEach(([resourceType, resourceData]) => {
  //     console.log('Resource Type:', resourceType);
  //     console.log('Resource Data:', resourceData);
  // });
   await closeChannel(undefined, undefined, key);
  } catch (error) {
    console.error(error);
  }
}

main();


async function fetchPackageRegistry(accountResources: any): Promise<void> {
  const packageRegistryResourceType = 
      '0x0000000000000000000000000000000000000000000000000000000000000001::code::PackageRegistry';

  try {
      // Locate the PackageRegistry resource
      const packageRegistry = accountResources.resource.find(
          ([type]: any) => type === packageRegistryResourceType
      );

      if (packageRegistry) {
          console.log('Package Registry Resource Found:');
          console.log('Resource Data:', packageRegistry[1]);
      } else {
          console.log('No Package Registry found for this account.');
      }
  } catch (error) {
      console.error('Error fetching Package Registry:', error);
  }
}


function hexToUint8Array(hexString: string): Uint8Array {
  // Remove '0x' prefix if present
  hexString = hexString.replace('0x', '');
  
  // Ensure even number of characters
  if (hexString.length % 2 !== 0) {
      hexString = '0' + hexString;
  }
  
  // Convert hex string to array
  const numbers = [];
  for (let i = 0; i < hexString.length; i += 2) {
      const byte = parseInt(hexString.substr(i, 2), 16);
      numbers.push(byte);
  }
  
  return new Uint8Array(numbers);
}

function uint8ArrayToHex(uint8Array: Uint8Array): string {
  return Array.from(uint8Array)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
}
