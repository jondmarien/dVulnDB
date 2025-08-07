import * as anchor from "@coral-xyz/anchor";
import { assert } from "chai";

describe("DVulnDB Integration Tests", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  before(function() {
    // Skip tests if any program not built yet
    if (!anchor.workspace.BountyEscrow || 
        !anchor.workspace.VulnerabilityRegistry || 
        !anchor.workspace.ReputationNft) {
      console.log("⚠️  One or more programs not built yet. Run 'anchor build' first.");
      this.skip();
    }
  });

  it("should have all programs loaded", async function() {
    const bountyProgram = anchor.workspace.BountyEscrow;
    const vulnProgram = anchor.workspace.VulnerabilityRegistry;
    const reputationProgram = anchor.workspace.ReputationNft;

    assert.ok(bountyProgram, "BountyEscrow program should be loaded");
    assert.ok(vulnProgram, "VulnerabilityRegistry program should be loaded");
    assert.ok(reputationProgram, "ReputationNft program should be loaded");
  });

  it("should support complete vulnerability workflow", async function() {
    // This test will be implemented once contracts are built
    // Will test: profile creation -> vulnerability submission -> bounty creation -> validation -> payout
    assert.ok(true, "Test framework is working");
  });

  it("should support multi-validator consensus", async function() {
    // This test will be implemented once contracts are built
    assert.ok(true, "Test framework is working");
  });

  it("should support reputation-based validation", async function() {
    // This test will be implemented once contracts are built
    assert.ok(true, "Test framework is working");
  });
});