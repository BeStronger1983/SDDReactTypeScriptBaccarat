import { test, expect } from '@playwright/test';

test.describe('下注功能 E2E 測試', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    // 等待遊戲載入完成
    await expect(page.locator('text=百家樂遊戲')).toBeVisible();
  });

  test('單區域下注 - 成功下注並開始遊戲', async ({ page }) => {
    // 選擇籌碼 (100)
    await page.click('[data-testid="chip-100"]');

    // 確認籌碼被選中
    await expect(page.locator('[data-testid="chip-100"]')).toHaveClass(/selected/);

    // 在閒家區域下注
    await page.click('[data-testid="betting-area-player"]');

    // 確認下注金額顯示正確
    await expect(page.locator('[data-testid="bet-amount-player"]')).toHaveText('100');

    // 確認餘額減少
    const balanceText = await page.locator('[data-testid="balance-display"]').textContent();
    const balance = parseInt(balanceText?.replace(/[^\d]/g, '') || '0');
    expect(balance).toBe(900);

    // 等待計時器倒數完畢或點擊確認按鈕
    await page.click('[data-testid="confirm-bet-button"]');

    // 等待遊戲開始 - 應該看到發牌階段
    await expect(page.locator('[data-testid="game-phase"]')).toHaveText(/發牌中|補牌中|結算中/);
  });

  test('多次下注同一區域 - 金額累加', async ({ page }) => {
    // 選擇籌碼 (50)
    await page.click('[data-testid="chip-50"]');

    // 第一次下注在莊家區域
    await page.click('[data-testid="betting-area-banker"]');
    await expect(page.locator('[data-testid="bet-amount-banker"]')).toHaveText('50');

    // 第二次下注在莊家區域
    await page.click('[data-testid="betting-area-banker"]');
    await expect(page.locator('[data-testid="bet-amount-banker"]')).toHaveText('100');

    // 第三次下注在莊家區域
    await page.click('[data-testid="betting-area-banker"]');
    await expect(page.locator('[data-testid="bet-amount-banker"]')).toHaveText('150');

    // 確認餘額正確減少
    const balanceText = await page.locator('[data-testid="balance-display"]').textContent();
    const balance = parseInt(balanceText?.replace(/[^\d]/g, '') || '0');
    expect(balance).toBe(850);
  });

  test('餘額不足 - 無法下注', async ({ page }) => {
    // 選擇最大籌碼 (1000)
    await page.click('[data-testid="chip-1000"]');

    // 下注第一次 - 應該成功
    await page.click('[data-testid="betting-area-tie"]');
    await expect(page.locator('[data-testid="bet-amount-tie"]')).toHaveText('1000');

    // 嘗試下注第二次 - 應該失敗（餘額為0）
    await page.click('[data-testid="betting-area-tie"]');

    // 金額不應該改變
    await expect(page.locator('[data-testid="bet-amount-tie"]')).toHaveText('1000');

    // 應該顯示錯誤訊息
    await expect(page.locator('[data-testid="error-message"]')).toContainText(
      /餘額不足|insufficient balance/i
    );
  });

  test('切換籌碼面額 - 正確更新選中狀態', async ({ page }) => {
    // 選擇籌碼 10
    await page.click('[data-testid="chip-10"]');
    await expect(page.locator('[data-testid="chip-10"]')).toHaveClass(/selected/);

    // 切換到籌碼 50
    await page.click('[data-testid="chip-50"]');
    await expect(page.locator('[data-testid="chip-50"]')).toHaveClass(/selected/);
    await expect(page.locator('[data-testid="chip-10"]')).not.toHaveClass(/selected/);

    // 切換到籌碼 500
    await page.click('[data-testid="chip-500"]');
    await expect(page.locator('[data-testid="chip-500"]')).toHaveClass(/selected/);
    await expect(page.locator('[data-testid="chip-50"]')).not.toHaveClass(/selected/);
  });

  test('計時器倒數 - 時間到自動開始遊戲', async ({ page }) => {
    // 選擇籌碼並下注
    await page.click('[data-testid="chip-100"]');
    await page.click('[data-testid="betting-area-player"]');

    // 確認計時器顯示
    const timer = page.locator('[data-testid="bet-timer"]');
    await expect(timer).toBeVisible();

    // 檢查初始時間 (應該是 15 秒或接近)
    const initialTime = await timer.textContent();
    const initialSeconds = parseInt(initialTime || '0');
    expect(initialSeconds).toBeGreaterThan(0);
    expect(initialSeconds).toBeLessThanOrEqual(15);

    // 等待 2 秒後檢查時間減少
    await page.waitForTimeout(2000);
    const currentTime = await timer.textContent();
    const currentSeconds = parseInt(currentTime || '0');
    expect(currentSeconds).toBeLessThan(initialSeconds);

    // 等待計時器倒數完畢（最多 16 秒）
    await expect(page.locator('[data-testid="game-phase"]')).toHaveText(/發牌中|補牌中|結算中/, {
      timeout: 16000,
    });
  });

  test('取消下注 - 恢復餘額', async ({ page }) => {
    // 下注
    await page.click('[data-testid="chip-100"]');
    await page.click('[data-testid="betting-area-banker"]');
    await page.click('[data-testid="betting-area-player"]');

    // 確認下注金額
    await expect(page.locator('[data-testid="bet-amount-banker"]')).toHaveText('100');
    await expect(page.locator('[data-testid="bet-amount-player"]')).toHaveText('100');

    // 確認餘額減少
    let balanceText = await page.locator('[data-testid="balance-display"]').textContent();
    let balance = parseInt(balanceText?.replace(/[^\d]/g, '') || '0');
    expect(balance).toBe(800);

    // 點擊取消按鈕
    await page.click('[data-testid="cancel-bet-button"]');

    // 確認下注金額清空
    await expect(page.locator('[data-testid="bet-amount-banker"]')).toHaveText('0');
    await expect(page.locator('[data-testid="bet-amount-player"]')).toHaveText('0');

    // 確認餘額恢復
    balanceText = await page.locator('[data-testid="balance-display"]').textContent();
    balance = parseInt(balanceText?.replace(/[^\d]/g, '') || '0');
    expect(balance).toBe(1000);
  });

  test('下注階段結束後 - 無法繼續下注', async ({ page }) => {
    // 下注並確認
    await page.click('[data-testid="chip-100"]');
    await page.click('[data-testid="betting-area-player"]');
    await page.click('[data-testid="confirm-bet-button"]');

    // 等待遊戲開始
    await expect(page.locator('[data-testid="game-phase"]')).toHaveText(/發牌中|補牌中|結算中/);

    // 嘗試選擇籌碼並下注 - 應該無效
    await page.click('[data-testid="chip-50"]');
    await page.click('[data-testid="betting-area-banker"]');

    // 確認莊家區域沒有下注金額
    const betAmount = await page.locator('[data-testid="bet-amount-banker"]').textContent();
    expect(betAmount).toBe('0');
  });

  test('複合場景 - 多區域下注、取消、重新下注', async ({ page }) => {
    // 第一輪下注
    await page.click('[data-testid="chip-100"]');
    await page.click('[data-testid="betting-area-banker"]');
    await page.click('[data-testid="betting-area-player"]');

    // 切換籌碼面額
    await page.click('[data-testid="chip-50"]');
    await page.click('[data-testid="betting-area-tie"]');

    // 確認各區域金額
    await expect(page.locator('[data-testid="bet-amount-banker"]')).toHaveText('100');
    await expect(page.locator('[data-testid="bet-amount-player"]')).toHaveText('100');
    await expect(page.locator('[data-testid="bet-amount-tie"]')).toHaveText('50');

    // 取消下注
    await page.click('[data-testid="cancel-bet-button"]');

    // 重新下注
    await page.click('[data-testid="chip-500"]');
    await page.click('[data-testid="betting-area-player"]');

    // 確認只有閒家有下注
    await expect(page.locator('[data-testid="bet-amount-banker"]')).toHaveText('0');
    await expect(page.locator('[data-testid="bet-amount-player"]')).toHaveText('500');
    await expect(page.locator('[data-testid="bet-amount-tie"]')).toHaveText('0');

    // 確認餘額正確
    const balanceText = await page.locator('[data-testid="balance-display"]').textContent();
    const balance = parseInt(balanceText?.replace(/[^\d]/g, '') || '0');
    expect(balance).toBe(500);
  });

  test('最小下注金額限制', async ({ page }) => {
    // 選擇最小籌碼 (10)
    await page.click('[data-testid="chip-10"]');

    // 下注應該成功
    await page.click('[data-testid="betting-area-banker"]');
    await expect(page.locator('[data-testid="bet-amount-banker"]')).toHaveText('10');

    // 確認可以確認下注
    const confirmButton = page.locator('[data-testid="confirm-bet-button"]');
    await expect(confirmButton).toBeEnabled();
  });

  test('沒有下注時 - 無法確認', async ({ page }) => {
    // 確認按鈕應該被禁用
    const confirmButton = page.locator('[data-testid="confirm-bet-button"]');
    await expect(confirmButton).toBeDisabled();

    // 選擇籌碼但不下注
    await page.click('[data-testid="chip-100"]');
    await expect(confirmButton).toBeDisabled();

    // 下注後應該可以確認
    await page.click('[data-testid="betting-area-player"]');
    await expect(confirmButton).toBeEnabled();
  });
});
