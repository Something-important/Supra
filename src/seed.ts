import * as bip39 from 'bip39';

function main() {
    // Optional passphrase
    const passphrase = "MySecretPassphrase";  // Set to empty string "" for no passphrase
    
    // Generate a mnemonic
    const mnemonic = bip39.generateMnemonic();
    console.log("\nOriginal Mnemonic:", mnemonic);
    
    // Generate two seeds - one with passphrase, one without
    const seedWithPassphrase = bip39.mnemonicToSeedSync(mnemonic, passphrase);
    const seedWithoutPassphrase = bip39.mnemonicToSeedSync(mnemonic, "");
    
    console.log("\nSeed with passphrase:", seedWithPassphrase.toString('hex'));
    console.log("Seed without passphrase:", seedWithoutPassphrase.toString('hex'));
    
    // Demonstrate that the same mnemonic + different passphrases = different seeds
    console.log("\nAre the seeds different?", seedWithPassphrase.toString('hex') !== seedWithoutPassphrase.toString('hex'));
    
    // Store and recover the mnemonic (the correct way)
    const entropy = bip39.mnemonicToEntropy(mnemonic);
    const recoveredMnemonic = bip39.entropyToMnemonic(entropy);
    
    console.log("\nMnemonic Recovery Test:");
    console.log("Original:", mnemonic);
    console.log("Recovered:", recoveredMnemonic);
    console.log("Do they match?", mnemonic === recoveredMnemonic);
    
    // Demonstrate that we can regenerate the same seeds with the recovered mnemonic
    const newSeedWithPassphrase = bip39.mnemonicToSeedSync(recoveredMnemonic, passphrase);
    console.log("\nDo regenerated seeds match?");
    console.log("With passphrase:", seedWithPassphrase.toString('hex') === newSeedWithPassphrase.toString('hex'));

    // Utility function to show the first and last 8 characters of a long string
    function truncate(str: string): string {
        if (str.length <= 16) return str;
        return `${str.slice(0, 8)}...${str.slice(-8)}`;
    }

    // Summary of what we've learned
    console.log("\nSummary:");
    console.log("1. Mnemonic:", truncate(mnemonic));
    console.log("2. Passphrase:", passphrase || "(none)");
    console.log("3. Seed with passphrase:", truncate(seedWithPassphrase.toString('hex')));
    console.log("4. Seed without passphrase:", truncate(seedWithoutPassphrase.toString('hex')));
}

// Run with error handling
try {
    main();
} catch (error) {
    console.error("An error occurred:", error);
}