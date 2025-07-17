use anchor_lang::prelude::*;

declare_id!("3aiStNroDenw7KpSKXvFWVFox35gCk4FcUx8nzXRF2HH");

#[program]
pub mod bounty_escrow {
    use super::*;

    /// Initialize the bounty escrow state
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.admin = ctx.accounts.admin.key();
        state.vulnerability_registry = Pubkey::default();
        state.approvers = vec![ctx.accounts.admin.key()]; // Admin is default approver
        state.paused = false;
        state.approval_threshold = 2;
        state.total_escrowed = 0;
        state.bump = *ctx.bumps.get("state").unwrap();
        Ok(())
    }

    /// Deposit bounty funds for a vulnerability
    pub fn deposit_bounty(
        ctx: Context<DepositBounty>,
        vuln_id: u64,
        amount: u64,
    ) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        require!(amount > 0, CustomError::InvalidAmount);
        require!(escrow.amount == 0, CustomError::EscrowExists);
        escrow.vuln_id = vuln_id;
        escrow.researcher = ctx.accounts.researcher.key();
        escrow.amount = amount;
        escrow.deposit_time = Clock::get()?.unix_timestamp;
        escrow.status = EscrowStatus::Deposited;
        escrow.approval_count = 0;
        escrow.bump = *ctx.bumps.get("escrow").unwrap();
        // Transfer SOL from payer to escrow PDA
        anchor_lang::system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: ctx.accounts.payer.to_account_info(),
                    to: ctx.accounts.escrow.to_account_info(),
                },
            ),
            amount,
        )?;
        emit!(BountyDeposited {
            vuln_id,
            researcher: ctx.accounts.researcher.key(),
            amount,
        });
        Ok(())
    }

    /// Release bounty to researcher after validation (called by registry)
    pub fn release_bounty(ctx: Context<ReleaseBounty>, vuln_id: u64) -> Result<()> {
        let state = &ctx.accounts.state;
        let escrow = &mut ctx.accounts.escrow;
        
        // Only allow registry to call this
        require!(
            ctx.accounts.registry.key() == state.vulnerability_registry,
            CustomError::UnauthorizedRegistry
        );
        
        require!(escrow.status == EscrowStatus::Deposited, CustomError::InvalidStatus);
        require!(!escrow.is_disputed, CustomError::Disputed);
        
        escrow.status = EscrowStatus::Released;
        escrow.release_time = Clock::get()?.unix_timestamp;
        let amount = escrow.amount;
        
        // Transfer SOL from escrow PDA to researcher
        **ctx.accounts.escrow.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.researcher.try_borrow_mut_lamports()? += amount;
        
        emit!(BountyReleased {
            vuln_id: escrow.vuln_id,
            researcher: escrow.researcher,
            amount,
        });
        Ok(())
    }

    /// Approve bounty release (multi-sig)
    pub fn approve_bounty_release(ctx: Context<ApproveBountyRelease>) -> Result<()> {
        let state = &ctx.accounts.state;
        let escrow = &mut ctx.accounts.escrow;
        
        require!(escrow.status == EscrowStatus::Deposited, CustomError::InvalidStatus);
        require!(!escrow.is_disputed, CustomError::Disputed);
        require!(state.approvers.contains(&ctx.accounts.approver.key()), CustomError::NotApprover);
        
        // Check if approver already voted
        let approval = &mut ctx.accounts.approval;
        require!(approval.data_is_empty(), CustomError::AlreadyApproved);
        
        // Record approval
        approval.vuln_id = escrow.vuln_id;
        approval.approver = ctx.accounts.approver.key();
        approval.timestamp = Clock::get()?.unix_timestamp;
        approval.bump = *ctx.bumps.get("approval").unwrap();
        
        escrow.approval_count += 1;
        
        // Auto-release if threshold reached
        if escrow.approval_count >= state.approval_threshold {
            escrow.status = EscrowStatus::Released;
            escrow.release_time = Clock::get()?.unix_timestamp;
            let amount = escrow.amount;
            
            // Transfer SOL from escrow PDA to researcher
            **ctx.accounts.escrow.to_account_info().try_borrow_mut_lamports()? -= amount;
            **ctx.accounts.researcher.try_borrow_mut_lamports()? += amount;
            
            emit!(BountyReleased {
                vuln_id: escrow.vuln_id,
                researcher: escrow.researcher,
                amount,
            });
        }
        
        Ok(())
    }

    /// Raise dispute for bounty payment
    pub fn raise_dispute(ctx: Context<RaiseDispute>) -> Result<()> {
        let state = &ctx.accounts.state;
        let escrow = &mut ctx.accounts.escrow;
        
        require!(state.approvers.contains(&ctx.accounts.approver.key()), CustomError::NotApprover);
        require!(!escrow.is_disputed, CustomError::AlreadyDisputed);
        require!(escrow.status == EscrowStatus::Deposited, CustomError::InvalidStatus);
        
        escrow.is_disputed = true;
        
        emit!(DisputeRaised {
            vuln_id: escrow.vuln_id,
            disputer: ctx.accounts.approver.key(),
        });
        
        Ok(())
    }

    /// Resolve dispute (approve or refund)
    pub fn resolve_dispute(ctx: Context<ResolveDispute>, approve: bool) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        require!(escrow.is_disputed, CustomError::NoActiveDispute);
        escrow.is_disputed = false;
        
        if approve {
            // Release to researcher
            escrow.status = EscrowStatus::Released;
            escrow.release_time = Clock::get()?.unix_timestamp;
            let amount = escrow.amount;
            
            **ctx.accounts.escrow.to_account_info().try_borrow_mut_lamports()? -= amount;
            **ctx.accounts.researcher.try_borrow_mut_lamports()? += amount;
            
            emit!(BountyReleased {
                vuln_id: escrow.vuln_id,
                researcher: escrow.researcher,
                amount,
            });
        } else {
            // Refund to registry
            let amount = escrow.amount;
            escrow.status = EscrowStatus::Refunded;
            **ctx.accounts.escrow.to_account_info().try_borrow_mut_lamports()? -= amount;
            **ctx.accounts.registry.try_borrow_mut_lamports()? += amount;
            emit!(BountyRefunded {
                vuln_id: escrow.vuln_id,
                researcher: escrow.researcher,
                amount,
            });
        }
        emit!(DisputeResolved {
            vuln_id: escrow.vuln_id,
            approved: approve,
        });
        Ok(())
    }

    /// Emergency refund after timeout
    pub fn emergency_refund(ctx: Context<EmergencyRefund>) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        require!(escrow.status == EscrowStatus::Deposited, CustomError::InvalidStatus);
        let now = Clock::get()?.unix_timestamp;
        require!(now >= escrow.deposit_time + 180 * 24 * 60 * 60, CustomError::TimeoutNotReached); // 180 days
        let amount = escrow.amount;
        escrow.status = EscrowStatus::Refunded;
        **ctx.accounts.escrow.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.researcher.try_borrow_mut_lamports()? += amount;
        emit!(BountyRefunded {
            vuln_id: escrow.vuln_id,
            researcher: escrow.researcher,
            amount,
        });
        Ok(())
    }

    /// Add or remove approver (admin only)
    pub fn add_approver(ctx: Context<UpdateApprover>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        let approver = ctx.accounts.approver.key();
        require!(!state.approvers.contains(&approver), CustomError::AlreadyApprover);
        state.approvers.push(approver);
        emit!(ApproverAdded { approver });
        Ok(())
    }
    pub fn remove_approver(ctx: Context<UpdateApprover>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        let approver = ctx.accounts.approver.key();
        require!(state.approvers.contains(&approver), CustomError::NotApprover);
        state.approvers.retain(|a| *a != approver);
        emit!(ApproverRemoved { approver });
        Ok(())
    }
    /// Set vulnerability registry address (admin only)
    pub fn set_registry(ctx: Context<SetRegistry>, registry: Pubkey) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.vulnerability_registry = registry;
        Ok(())
    }
    /// Pause/unpause contract (admin only)
    pub fn pause(ctx: Context<PauseUnpause>, pause: bool) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.paused = pause;
        Ok(())
    }
    /// Emergency withdraw (admin only, paused)
    pub fn emergency_withdraw(ctx: Context<EmergencyWithdraw>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        require!(state.paused, CustomError::NotPaused);
        let escrow = &ctx.accounts.escrow;
        let amount = escrow.amount;
        **escrow.to_account_info().try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.admin.try_borrow_mut_lamports()? += amount;
        Ok(())
    }
}

// State for the program (admin, registry, approvers, pause)
#[account]
pub struct BountyEscrowState {
    pub admin: Pubkey,
    pub vulnerability_registry: Pubkey,
    pub approvers: Vec<Pubkey>,
    pub paused: bool,
    pub approval_threshold: u8,
    pub total_escrowed: u64,
    pub bump: u8,
}

// PDA account for each escrow
#[account]
pub struct EscrowAccount {
    pub vuln_id: u64,
    pub researcher: Pubkey,
    pub amount: u64,
    pub deposit_time: i64,
    pub release_time: i64,
    pub status: EscrowStatus,
    pub approval_count: u8,
    pub is_disputed: bool,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum EscrowStatus {
    Deposited,
    Released,
    Refunded,
}

// Instruction Contexts
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + std::mem::size_of::<BountyEscrowState>() + 32 * 10, // Extra space for approvers vector
        seeds = [b"escrow_state"],
        bump
    )]
    pub state: Account<'info, BountyEscrowState>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(vuln_id: u64)]
pub struct DepositBounty<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(init, payer = payer, space = 8 + std::mem::size_of::<EscrowAccount>(), seeds = [b"escrow", &vuln_id.to_le_bytes()], bump)]
    pub escrow: Account<'info, EscrowAccount>,
    /// CHECK: Researcher is validated off-chain
    pub researcher: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ReleaseBounty<'info> {
    #[account(mut, seeds = [b"escrow_state"], bump = state.bump)]
    pub state: Account<'info, BountyEscrowState>,
    #[account(mut)]
    pub escrow: Account<'info, EscrowAccount>,
    #[account(mut)]
    pub researcher: Signer<'info>,
    /// CHECK: Registry program validation
    pub registry: UncheckedAccount<'info>,
}

// Approval record for multi-sig
#[account]
pub struct ApprovalRecord {
    pub vuln_id: u64,
    pub approver: Pubkey,
    pub timestamp: i64,
    pub bump: u8,
}

#[derive(Accounts)]
#[instruction(vuln_id: u64)]
pub struct ApproveBountyRelease<'info> {
    #[account(seeds = [b"escrow_state"], bump = state.bump)]
    pub state: Account<'info, BountyEscrowState>,
    #[account(mut, seeds = [b"escrow", &vuln_id.to_le_bytes()], bump = escrow.bump)]
    pub escrow: Account<'info, EscrowAccount>,
    #[account(
        init,
        payer = approver,
        space = 8 + std::mem::size_of::<ApprovalRecord>(),
        seeds = [b"approval", &vuln_id.to_le_bytes(), approver.key().as_ref()],
        bump
    )]
    pub approval: Account<'info, ApprovalRecord>,
    #[account(mut)]
    pub researcher: Signer<'info>,
    #[account(mut)]
    pub approver: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RaiseDispute<'info> {
    #[account(seeds = [b"escrow_state"], bump = state.bump)]
    pub state: Account<'info, BountyEscrowState>,
    #[account(mut)]
    pub escrow: Account<'info, EscrowAccount>,
    pub approver: Signer<'info>,
}

#[derive(Accounts)]
pub struct ResolveDispute<'info> {
    #[account(mut)]
    pub escrow: Account<'info, EscrowAccount>,
    #[account(mut)]
    pub researcher: Signer<'info>,
    #[account(mut)]
    pub registry: Signer<'info>,
}

#[derive(Accounts)]
pub struct EmergencyRefund<'info> {
    #[account(mut)]
    pub escrow: Account<'info, EscrowAccount>,
    #[account(mut)]
    pub researcher: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateApprover<'info> {
    #[account(mut, has_one = admin)]
    pub state: Account<'info, BountyEscrowState>,
    pub admin: Signer<'info>,
    /// CHECK: Approver is validated off-chain
    pub approver: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct SetRegistry<'info> {
    #[account(mut, has_one = admin)]
    pub state: Account<'info, BountyEscrowState>,
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct PauseUnpause<'info> {
    #[account(mut, has_one = admin)]
    pub state: Account<'info, BountyEscrowState>,
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct EmergencyWithdraw<'info> {
    #[account(mut, has_one = admin)]
    pub state: Account<'info, BountyEscrowState>,
    pub admin: Signer<'info>,
    #[account(mut)]
    pub escrow: Account<'info, EscrowAccount>,
}

// Events
#[event]
pub struct BountyDeposited {
    pub vuln_id: u64,
    pub researcher: Pubkey,
    pub amount: u64,
}

#[event]
pub struct BountyReleased {
    pub vuln_id: u64,
    pub researcher: Pubkey,
    pub amount: u64,
}

#[event]
pub struct BountyRefunded {
    pub vuln_id: u64,
    pub researcher: Pubkey,
    pub amount: u64,
}

#[event]
pub struct DisputeResolved {
    pub vuln_id: u64,
    pub approved: bool,
}

#[event]
pub struct ApproverAdded {
    pub approver: Pubkey,
}

#[event]
pub struct ApproverRemoved {
    pub approver: Pubkey,
}

#[event]
pub struct DisputeRaised {
    pub vuln_id: u64,
    pub disputer: Pubkey,
}

// Custom error codes
#[error_code]
pub enum CustomError {
    #[msg("Amount must be greater than 0")]
    InvalidAmount,
    #[msg("Escrow already exists")]
    EscrowExists,
    #[msg("Invalid escrow status")]
    InvalidStatus,
    #[msg("Escrow is disputed")]
    Disputed,
    #[msg("No active dispute")]
    NoActiveDispute,
    #[msg("Timeout not reached")]
    TimeoutNotReached,
    #[msg("Already an approver")]
    AlreadyApprover,
    #[msg("Not an approver")]
    NotApprover,
    #[msg("Contract is not paused")]
    NotPaused,
    #[msg("Already approved")]
    AlreadyApproved,
    #[msg("Already disputed")]
    AlreadyDisputed,
    #[msg("Unauthorized registry")]
    UnauthorizedRegistry,
}
