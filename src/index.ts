import { SupraAccount } from "supra-l1-sdk";
import * as bip39 from "bip39";
import { entropyToMnemonic, mnemonicToEntropy } from "bip39";

function main() {
    const passphrase = "your-secret-passphrase";
    const privateKey = new Uint8Array([
        177, 13, 175, 245, 45, 202, 185, 140, 173, 157, 243,
        19, 209, 64, 56, 190, 218, 166, 24, 30, 211, 102,
        32, 55, 142, 197, 216, 242, 145, 229, 23, 146, 90,
        210, 132, 125, 3, 140, 68, 1, 148, 110, 112, 19,
        15, 226, 161, 108, 65, 15, 245, 64, 154, 24, 248,
        211, 203, 191, 65, 202, 121, 246, 18, 178
    ]);
    // create a new account
     const newAccount = new SupraAccount();

    //create an account from a mnemonic
    // const path = "m/44'/637'/0'/0'/0'";
    // generate a mnemonic
    const mnemonic = bip39.generateMnemonic();
    console.log("Generated Mnemonic: ", mnemonic);

    // Convert the mnemonic to a seed
    const seed = bip39.mnemonicToSeedSync(mnemonic, passphrase);
    console.log("Generated Seed: ", seed.toString("hex"));

    // const accountFromMnemonics = SupraAccount.fromDerivePath(path, mnemonic);


    // Recover private key (entropy) from mnemonic
    // const recoveredEntropyHex = mnemonicToEntropy(mnemonic);
    // const recoveredPrivateKey = Buffer.from(recoveredEntropyHex, "hex");
    // console.log("Recovered Private Key:", recoveredPrivateKey);

    // create an account from a private key
    const accountFromPk = new SupraAccount(privateKey);
    console.log(accountFromPk.address().toString());


    // Convert private key to hex string
    const entropyHex = Buffer.from(privateKey).toString("hex");
    console.log("Entropy:", entropyHex);
    // Generate mnemonic from private key
    const mnemonicFromHex = entropyToMnemonic(entropyHex);
    console.log("Mnemonic From Hex:", mnemonicFromHex);

}

main();