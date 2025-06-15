import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { BountyEscrow } from "../target/types/bounty_escrow";
import { assert } from "chai";

describe("bounty_escrow", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const program = anchor.workspace.BountyEscrow as Program<BountyEscrow>;

  it("Initializes escrow and deposits bounty", async () => {
    // Generate test keypairs
    const payer = anchor.web3.Keypair.generate();
    const researcher = anchor.web3.Keypair.generate();
    const vulnId = new anchor.BN(1);
    const bountyAmount = new anchor.BN(1_000_000_000); // 1 SOL

    // Airdrop SOL to payer
    const sig = await provider.connection.requestAirdrop(payer.publicKey, 2_000_000_000);
    await provider.connection.confirmTransaction(sig);

    // Derive escrow PDA
    const [escrowPda, escrowBump] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from("escrow"), vulnId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    // Call deposit_bounty
    await program.methods.depositBounty(vulnId, bountyAmount)
      .accounts({
        payer: payer.publicKey,
        escrow: escrowPda,
        researcher: researcher.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([payer])
      .rpc();

    // Fetch escrow account and check state
    const escrowAccount = await program.account.escrowAccount.fetch(escrowPda);
    assert.equal(escrowAccount.vulnId.toNumber(), 1);
    assert.equal(escrowAccount.researcher.toBase58(), researcher.publicKey.toBase58());
    assert.equal(escrowAccount.amount.toNumber(), bountyAmount.toNumber());
    assert.equal(escrowAccount.status.deposited, {});
  });

  it("Releases bounty to researcher", async () => {
    // TODO: Add logic for release_bounty
    assert.ok(true);
  });

  it("Handles dispute and refund", async () => {
    // TODO: Add logic for dispute resolution
    assert.ok(true);
  });
});
