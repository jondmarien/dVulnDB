use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        create_metadata_accounts_v3, mpl_token_metadata::types::{DataV2, Creator},
        CreateMetadataAccountsV3, Metadata,
    },
    token::{mint_to, Mint, MintTo, Token, TokenAccount},
};

declare_id!("HsxZ1cg5H1zvvdyngaLTrB9DZ1YFrEAFMNR21fKCzioW");

#[program]
pub mod reputation_nft {
    use super::*;

    /// Initialize the reputation NFT program
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.admin = ctx.accounts.admin.key();
        state.vulnerability_registry = Pubkey::default();
        state.total_nfts = 0;
        state.bump = *ctx.bumps.get("state").unwrap();
        Ok(())
    }

    /// Mint reputation NFT for new researcher
    pub fn mint_reputation_nft(
        ctx: Context<MintReputationNFT>,
        researcher: Pubkey,
    ) -> Result<()> {
        let state = &mut ctx.accounts.state;
        
        // Check if researcher already has an NFT
        require!(
            ctx.accounts.researcher_nft.data_is_empty(),
            CustomError::NFTAlreadyExists
        );

        let token_id = state.total_nfts + 1;
        state.total_nfts = token_id;

        // Initialize researcher NFT data
        let researcher_nft = &mut ctx.accounts.researcher_nft;
        researcher_nft.token_id = token_id;
        researcher_nft.researcher = researcher;
        researcher_nft.reputation_score = 0;
        researcher_nft.vulnerabilities_found = 0;
        researcher_nft.total_earnings = 0;
        researcher_nft.last_update = Clock::get()?.unix_timestamp;
        researcher_nft.level = ReputationLevel::Novice;
        researcher_nft.specializations = Vec::new();
        researcher_nft.critical_finds = Vec::new();
        researcher_nft.bump = *ctx.bumps.get("researcher_nft").unwrap();

        // Mint NFT token
        let cpi_accounts = MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.state.to_account_info(),
        };
        let seeds = &[b"reputation_state".as_ref(), &[state.bump]];
        let signer = &[&seeds[..]];
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        mint_to(cpi_ctx, 1)?;

        // Create metadata
        let data_v2 = DataV2 {
            name: format!("Security Researcher #{}", token_id),
            symbol: "SECR".to_string(),
            uri: generate_metadata_uri(researcher_nft),
            seller_fee_basis_points: 0,
            creators: Some(vec![Creator {
                address: state.key(),
                verified: true,
                share: 100,
            }]),
            collection: None,
            uses: None,
        };

        let metadata_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMetadataAccountsV3 {
                payer: ctx.accounts.payer.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                metadata: ctx.accounts.metadata.to_account_info(),
                mint_authority: ctx.accounts.state.to_account_info(),
                update_authority: ctx.accounts.state.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
            signer,
        );

        create_metadata_accounts_v3(metadata_ctx, data_v2, true, true, None)?;

        emit!(ReputationNFTMinted {
            token_id,
            researcher,
            mint: ctx.accounts.mint.key(),
        });

        Ok(())
    }

    /// Update reputation score and metadata
    pub fn update_reputation(
        ctx: Context<UpdateReputation>,
        score_increase: u64,
        earnings: u64,
        is_critical: bool,
        vulnerability_id: u64,
    ) -> Result<()> {
        let researcher_nft = &mut ctx.accounts.researcher_nft;

        // Update stats
        researcher_nft.reputation_score += score_increase;
        researcher_nft.vulnerabilities_found += 1;
        researcher_nft.total_earnings += earnings;
        researcher_nft.last_update = Clock::get()?.unix_timestamp;

        // Record critical finds
        if is_critical {
            researcher_nft.critical_finds.push(vulnerability_id);
            emit!(CriticalFindRecorded {
                token_id: researcher_nft.token_id,
                vulnerability_id,
            });
        }

        // Update level
        let new_level = calculate_level(researcher_nft.reputation_score);
        if new_level != researcher_nft.level {
            researcher_nft.level = new_level;
        }

        // Update NFT metadata to reflect new stats
        // In a full implementation, this would update the metadata account
        // For now, we emit the event to indicate the update

        emit!(ReputationUpdated {
            token_id: researcher_nft.token_id,
            researcher: researcher_nft.researcher,
            new_score: researcher_nft.reputation_score,
            new_level,
        });

        Ok(())
    }

    /// Add specialization to researcher
    pub fn add_specialization(
        ctx: Context<AddSpecialization>,
        specialization: String,
    ) -> Result<()> {
        let researcher_nft = &mut ctx.accounts.researcher_nft;
        
        // Check if specialization already exists
        require!(
            !researcher_nft.specializations.contains(&specialization),
            CustomError::SpecializationExists
        );

        researcher_nft.specializations.push(specialization.clone());

        emit!(SpecializationAdded {
            token_id: researcher_nft.token_id,
            specialization,
        });

        Ok(())
    }

    /// Set vulnerability registry address (admin only)
    pub fn set_vulnerability_registry(
        ctx: Context<SetVulnerabilityRegistry>,
        registry: Pubkey,
    ) -> Result<()> {
        let state = &mut ctx.accounts.state;
        state.vulnerability_registry = registry;
        Ok(())
    }
}

// Program state
#[account]
pub struct ReputationState {
    pub admin: Pubkey,
    pub vulnerability_registry: Pubkey,
    pub total_nfts: u64,
    pub bump: u8,
}

// Researcher NFT data
#[account]
pub struct ResearcherNFT {
    pub token_id: u64,
    pub researcher: Pubkey,
    pub reputation_score: u64,
    pub vulnerabilities_found: u64,
    pub total_earnings: u64,
    pub last_update: i64,
    pub level: ReputationLevel,
    pub specializations: Vec<String>,
    pub critical_finds: Vec<u64>,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum ReputationLevel {
    Novice,      // 0-100 points
    Researcher,  // 101-500 points
    Expert,      // 501-1500 points
    Elite,       // 1501-5000 points
    Legendary,   // 5000+ points
}

// Instruction contexts
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + std::mem::size_of::<ReputationState>(),
        seeds = [b"reputation_state"],
        bump
    )]
    pub state: Account<'info, ReputationState>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(researcher: Pubkey)]
pub struct MintReputationNFT<'info> {
    #[account(mut, seeds = [b"reputation_state"], bump = state.bump)]
    pub state: Account<'info, ReputationState>,
    #[account(
        init,
        payer = payer,
        space = 8 + std::mem::size_of::<ResearcherNFT>() + 32 * 10 + 32 * 20, // Extra space for vectors
        seeds = [b"researcher_nft", researcher.as_ref()],
        bump
    )]
    pub researcher_nft: Account<'info, ResearcherNFT>,
    #[account(
        init,
        payer = payer,
        mint::decimals = 0,
        mint::authority = state,
        seeds = [b"mint", researcher.as_ref()],
        bump
    )]
    pub mint: Account<'info, Mint>,
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = researcher,
    )]
    pub token_account: Account<'info, TokenAccount>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub token_metadata_program: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct UpdateReputation<'info> {
    #[account(
        seeds = [b"reputation_state"],
        bump = state.bump,
        constraint = state.vulnerability_registry == *registry.key @ CustomError::UnauthorizedRegistry
    )]
    pub state: Account<'info, ReputationState>,
    #[account(
        mut,
        seeds = [b"researcher_nft", researcher_nft.researcher.as_ref()],
        bump = researcher_nft.bump
    )]
    pub researcher_nft: Account<'info, ResearcherNFT>,
    /// CHECK: Registry program validation
    pub registry: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct AddSpecialization<'info> {
    #[account(
        seeds = [b"reputation_state"],
        bump = state.bump,
        constraint = state.vulnerability_registry == *registry.key @ CustomError::UnauthorizedRegistry
    )]
    pub state: Account<'info, ReputationState>,
    #[account(
        mut,
        seeds = [b"researcher_nft", researcher_nft.researcher.as_ref()],
        bump = researcher_nft.bump
    )]
    pub researcher_nft: Account<'info, ResearcherNFT>,
    /// CHECK: Registry program validation
    pub registry: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct SetVulnerabilityRegistry<'info> {
    #[account(mut, seeds = [b"reputation_state"], bump = state.bump, has_one = admin)]
    pub state: Account<'info, ReputationState>,
    pub admin: Signer<'info>,
}

// Events
#[event]
pub struct ReputationNFTMinted {
    pub token_id: u64,
    pub researcher: Pubkey,
    pub mint: Pubkey,
}

#[event]
pub struct ReputationUpdated {
    pub token_id: u64,
    pub researcher: Pubkey,
    pub new_score: u64,
    pub new_level: ReputationLevel,
}

#[event]
pub struct CriticalFindRecorded {
    pub token_id: u64,
    pub vulnerability_id: u64,
}

#[event]
pub struct SpecializationAdded {
    pub token_id: u64,
    pub specialization: String,
}

// Helper functions
fn calculate_level(score: u64) -> ReputationLevel {
    match score {
        5000.. => ReputationLevel::Legendary,
        1501..=4999 => ReputationLevel::Elite,
        501..=1500 => ReputationLevel::Expert,
        101..=500 => ReputationLevel::Researcher,
        _ => ReputationLevel::Novice,
    }
}

fn generate_metadata_uri(researcher_nft: &ResearcherNFT) -> String {
    // In a real implementation, this would generate a proper metadata URI
    // For now, return a placeholder
    format!("https://api.dvulndb.com/metadata/{}", researcher_nft.token_id)
}

// Custom error codes
#[error_code]
pub enum CustomError {
    #[msg("NFT already exists for this researcher")]
    NFTAlreadyExists,
    #[msg("Specialization already exists")]
    SpecializationExists,
    #[msg("Unauthorized registry")]
    UnauthorizedRegistry,
}