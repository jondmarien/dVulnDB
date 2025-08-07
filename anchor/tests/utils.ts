import * as anchor from "@coral-xyz/anchor";

export class TestUtils {
  static async airdropSol(
    connection: anchor.web3.Connection,
    publicKey: anchor.web3.PublicKey,
    amount: number = 2_000_000_000
  ): Promise<void> {
    const signature = await connection.requestAirdrop(publicKey, amount);
    await connection.confirmTransaction(signature);
  }

  static async airdropToMultiple(
    connection: anchor.web3.Connection,
    publicKeys: anchor.web3.PublicKey[],
    amount: number = 2_000_000_000
  ): Promise<void> {
    const promises = publicKeys.map(pk => this.airdropSol(connection, pk, amount));
    await Promise.all(promises);
  }

  static generateKeypairs(count: number): anchor.web3.Keypair[] {
    return Array.from({ length: count }, () => anchor.web3.Keypair.generate());
  }

  static async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static generateRandomCvssScore(): number {
    return Math.floor(Math.random() * 100) + 1;
  }

  static generateRandomIpfsHash(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'Qm';
    for (let i = 0; i < 44; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static async waitForConfirmation(
    connection: anchor.web3.Connection,
    signature: string,
    commitment: anchor.web3.Commitment = 'confirmed'
  ): Promise<void> {
    await connection.confirmTransaction(signature, commitment);
  }

  static async getAccountBalance(
    connection: anchor.web3.Connection,
    publicKey: anchor.web3.PublicKey
  ): Promise<number> {
    return await connection.getBalance(publicKey);
  }

  static lamportsToSol(lamports: number): number {
    return lamports / anchor.web3.LAMPORTS_PER_SOL;
  }

  static solToLamports(sol: number): number {
    return sol * anchor.web3.LAMPORTS_PER_SOL;
  }
}