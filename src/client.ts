import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { TxnBuilderTypes, HexString } from 'aptos';


async function aptos() {
  try {
    // Aptos Network Interaction
    const config = new AptosConfig({ network: Network.MAINNET });
    const clientAptos = new Aptos(config);

    // Fetch Aptos account info
    const accountInfoAptos = await clientAptos.getAccountInfo({
      accountAddress: "0x17ebe4fe7e28a3663fe1a6fb9513b4f72eb4b5c3687e514f04bdc074c25e0132",
    });
    
    // fetch balance
    const balance = await clientAptos.getAccountCoinAmount({
      accountAddress: "0x17ebe4fe7e28a3663fe1a6fb9513b4f72eb4b5c3687e514f04bdc074c25e0132",
      coinType: "0x1::aptos_coin::AptosCoin",
    });
    console.log("balance:", balance);
  }
  catch (error) {
    console.error("Error occurred:", error);   
  }
}


// Main execution
(async () => {
  console.log("Starting blockchain operations...");
 
  
  // Execute Aptos operations if needed
  // await aptos();
  
  console.log("Completed blockchain operations.");
})();