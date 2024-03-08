use anchor_lang::prelude::*;

// 定義智能合約的ID
declare_id!("9KHoG32S9i4RWc5Qp4z3EDLDfwiQ3uZHQSdubyLsAJF");

#[program]
pub mod my_program {
    use super::*;

    // 初始化函數，設定計數器的初始值
    pub fn initialize(ctx: Context<Initialize>, value: u64) -> Result<()> {
        let my_counter = &mut ctx.accounts.my_counter;
        my_counter.value = value;
        my_counter.bump = ctx.bumps.my_counter;
        msg!("value: {}", my_counter.value);

        Ok(())
    }

    // 加上一個偶數的函數
    pub fn add_even(ctx: Context<AddEven>, value: u64) -> Result<()> {
        // 需求檢查：確保輸入的值是偶數
        require!(value % 2 == 0, ErrorCode::ValueIsNotEven);
        let my_counter = &mut ctx.accounts.my_counter;
        my_counter.value = my_counter.value.checked_add(value).unwrap();
        msg!("value: {}", my_counter.value);

        Ok(())
    }

    // 減去一個奇數的函數
    pub fn minus_odd(ctx: Context<MinusOdd>, value: u64) -> Result<()> {
        // 需求檢查：確保輸入的值是奇數
        require!(value % 2 == 1, ErrorCode::ValueIsNotOdd);
        let my_counter = &mut ctx.accounts.my_counter;
        my_counter.value = my_counter.value.checked_sub(value).unwrap();
        msg!("value: {}", my_counter.value);

        Ok(())
    }

    // 乘以一個偶數的函數
    pub fn times_even(ctx: Context<TimesEven>, value: u64) -> Result<()> {
        // 需求檢查：確保輸入的值是偶數
        require!(value % 2 == 0, ErrorCode::ValueIsNotEven);
        let my_counter = &mut ctx.accounts.my_counter;
        my_counter.value = my_counter.value.checked_mul(value).unwrap();
        msg!("value: {}", my_counter.value);

        Ok(())
    }

    // 關閉計數器的函數
    pub fn close(_ctx: Context<Close>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    // 初始化計數器所需的空間大小定義
    #[account(init_if_needed, payer = user, seeds = [b"my-counter", user.key().as_ref()], bump, space = 8 + MyCounter::MAX_SIZE)]
    pub my_counter: Account<'info, MyCounter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AddEven<'info> {
    #[account(mut, seeds = [b"my-counter", user.key().as_ref()], bump)]
    pub my_counter: Account<'info, MyCounter>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct MinusOdd<'info> {
    #[account(mut, seeds = [b"my-counter", user.key().as_ref()], bump)]
    pub my_counter: Account<'info, MyCounter>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct TimesEven<'info> {
    #[account(mut, seeds = [b"my-counter", user.key().as_ref()], bump)]
    pub my_counter: Account<'info, MyCounter>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct Close<'info> {
    #[account(mut, seeds = [b"my-counter", user.key().as_ref()], bump, close = user)]
    pub my_counter: Account<'info, MyCounter>,
    #[account(mut)]
    pub user: Signer<'info>,
}

// 定義計數器結構體
#[account]
pub struct MyCounter {
    pub value: u64,
    pub bump: u8,
}

// 定義錯誤代碼
#[error_code]
pub enum ErrorCode {
    #[msg("value is not even")]
    ValueIsNotEven,
    #[msg("value is not odd")]
    ValueIsNotOdd,
}

impl MyCounter {
    // 定義計數器最大空間大小
    const MAX_SIZE: usize = 8 + 1; // u64型態值的空間加上一個u8型態的bump
}
