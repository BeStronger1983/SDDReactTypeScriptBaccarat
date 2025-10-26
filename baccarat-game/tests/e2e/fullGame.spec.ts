import { test, expect } from '@playwright/test';

/**
 * E2E 測試：完整遊戲流程
 * 從進入遊戲到結算完成
 */

test.describe('完整遊戲流程', () => {
  test.beforeEach(async ({ page }) => {
    // 清除 localStorage 以確保測試環境乾淨
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.clear();
    });
    await page.reload();
  });

  test('應該能完成一局完整的遊戲', async ({ page }) => {
    // 步驟 1: 進入遊戲
    await page.goto('/');

    // 驗證初始餘額顯示
    await expect(page.getByText(/餘額/)).toBeVisible();
    await expect(page.getByText(/10,000/)).toBeVisible();

    // 步驟 2: 選擇籌碼
    const chip100 = page.getByRole('button', { name: /100/ });
    await expect(chip100).toBeVisible();
    await chip100.click();

    // 驗證籌碼被選中
    await expect(chip100).toHaveAttribute('data-selected', 'true');

    // 步驟 3: 在閒家下注
    const playerArea = page.getByTestId('betting-area-player');
    await expect(playerArea).toBeVisible();
    await playerArea.click();

    // 驗證下注金額顯示
    await expect(page.getByText(/閒家.*100/)).toBeVisible();

    // 驗證確認下注按鈕可用
    const confirmButton = page.getByRole('button', { name: /確認下注/ });
    await expect(confirmButton).toBeEnabled();

    // 步驟 4: 確認下注
    await confirmButton.click();

    // 驗證進入發牌階段
    await expect(page.getByText(/發牌中/)).toBeVisible();

    // 步驟 5: 等待發牌動畫完成
    // 牌應該依序發出：閒家第1張、莊家第1張、閒家第2張、莊家第2張
    const playerCards = page.getByTestId('player-hand').locator('[data-testid^="card-"]');
    const bankerCards = page.getByTestId('banker-hand').locator('[data-testid^="card-"]');

    // 等待至少兩張牌發出
    await expect(playerCards).toHaveCount(2, { timeout: 10000 });
    await expect(bankerCards).toHaveCount(2, { timeout: 10000 });

    // 步驟 6: 等待可能的補牌
    // 根據規則，可能會補第3張牌
    await page.waitForTimeout(3000);

    // 步驟 7: 驗證結果顯示
    const resultDisplay = page.getByTestId('result-display');
    await expect(resultDisplay).toBeVisible({ timeout: 15000 });

    // 結果應該是莊家、閒家或和局
    const resultText = await resultDisplay.textContent();
    expect(resultText).toMatch(/(莊家勝|閒家勝|和局)/);

    // 步驟 8: 驗證點數顯示
    const playerScore = page.getByTestId('player-score');
    const bankerScore = page.getByTestId('banker-score');
    await expect(playerScore).toBeVisible();
    await expect(bankerScore).toBeVisible();

    // 點數應該在 0-9 之間
    const playerScoreText = await playerScore.textContent();
    const bankerScoreText = await bankerScore.textContent();
    const playerScoreNum = parseInt(playerScoreText || '0');
    const bankerScoreNum = parseInt(bankerScoreText || '0');
    expect(playerScoreNum).toBeGreaterThanOrEqual(0);
    expect(playerScoreNum).toBeLessThanOrEqual(9);
    expect(bankerScoreNum).toBeGreaterThanOrEqual(0);
    expect(bankerScoreNum).toBeLessThanOrEqual(9);

    // 步驟 9: 驗證餘額更新
    const balanceAfter = await page.getByTestId('balance-amount').textContent();
    const balanceNum = parseInt(balanceAfter?.replace(/,/g, '') || '0');

    // 根據結果，餘額應該改變
    if (resultText?.includes('閒家勝')) {
      // 閒家勝：獲得 100 * 1 = 100 獎金，總共 +100
      expect(balanceNum).toBe(10100);
    } else if (resultText?.includes('莊家勝')) {
      // 莊家勝：沒下注，損失 0
      expect(balanceNum).toBe(9900);
    } else {
      // 和局：退還本金
      expect(balanceNum).toBe(10000);
    }

    // 步驟 10: 驗證可以開始新一局
    const newRoundButton = page.getByRole('button', { name: /新一局/ });
    await expect(newRoundButton).toBeVisible();
    await expect(newRoundButton).toBeEnabled();
  });

  test('應該能連續進行多局遊戲', async ({ page }) => {
    await page.goto('/');

    // 進行 3 局遊戲
    for (let round = 1; round <= 3; round++) {
      // 選擇籌碼並下注
      await page.getByRole('button', { name: /50/ }).click();
      await page.getByTestId('betting-area-banker').click();
      await page.getByRole('button', { name: /確認下注/ }).click();

      // 等待結果
      await expect(page.getByTestId('result-display')).toBeVisible({ timeout: 15000 });

      // 開始新一局（最後一局不需要）
      if (round < 3) {
        await page.getByRole('button', { name: /新一局/ }).click();
        // 等待遊戲重置
        await expect(page.getByText(/下注階段/)).toBeVisible();
      }
    }

    // 驗證餘額有變化（不管輸贏）
    const finalBalance = await page.getByTestId('balance-amount').textContent();
    expect(finalBalance).not.toBeNull();
  });

  test('應該在倒數計時結束後自動開始發牌', async ({ page }) => {
    await page.goto('/');

    // 快速下注
    await page.getByRole('button', { name: /100/ }).click();
    await page.getByTestId('betting-area-player').click();
    await page.getByRole('button', { name: /確認下注/ }).click();

    // 不點擊任何東西，等待倒數計時
    const timer = page.getByTestId('bet-timer');
    await expect(timer).toBeVisible();

    // 等待計時器倒數到 0
    await expect(page.getByText(/發牌中/)).toBeVisible({ timeout: 20000 });
  });

  test('應該在餘額不足時禁用確認下注按鈕', async ({ page }) => {
    await page.goto('/');

    // 設定餘額為 50
    await page.evaluate(() => {
      localStorage.setItem('baccarat_balance', '50');
    });
    await page.reload();

    // 嘗試下注 100
    await page.getByRole('button', { name: /100/ }).click();
    await page.getByTestId('betting-area-player').click();

    // 確認下注按鈕應該被禁用
    const confirmButton = page.getByRole('button', { name: /確認下注/ });
    await expect(confirmButton).toBeDisabled();

    // 應該顯示錯誤訊息
    await expect(page.getByText(/餘額不足/)).toBeVisible();
  });

  test('應該能正確顯示多張補牌', async ({ page }) => {
    await page.goto('/');

    // 下注並開始遊戲
    await page.getByRole('button', { name: /100/ }).click();
    await page.getByTestId('betting-area-banker').click();
    await page.getByRole('button', { name: /確認下注/ }).click();

    // 等待發牌完成
    await page.waitForTimeout(5000);

    // 檢查是否有補牌（最多3張）
    const playerCards = page.getByTestId('player-hand').locator('[data-testid^="card-"]');
    const bankerCards = page.getByTestId('banker-hand').locator('[data-testid^="card-"]');

    const playerCount = await playerCards.count();
    const bankerCount = await bankerCards.count();

    // 每手牌應該有 2-3 張
    expect(playerCount).toBeGreaterThanOrEqual(2);
    expect(playerCount).toBeLessThanOrEqual(3);
    expect(bankerCount).toBeGreaterThanOrEqual(2);
    expect(bankerCount).toBeLessThanOrEqual(3);

    // 驗證所有牌都正確顯示
    for (let i = 0; i < playerCount; i++) {
      await expect(playerCards.nth(i)).toBeVisible();
    }
    for (let i = 0; i < bankerCount; i++) {
      await expect(bankerCards.nth(i)).toBeVisible();
    }
  });

  test('應該能正確持久化餘額到 localStorage', async ({ page }) => {
    await page.goto('/');

    // 進行一局遊戲
    await page.getByRole('button', { name: /100/ }).click();
    await page.getByTestId('betting-area-player').click();
    await page.getByRole('button', { name: /確認下注/ }).click();

    // 等待結果
    await expect(page.getByTestId('result-display')).toBeVisible({ timeout: 15000 });

    // 獲取當前餘額
    const balanceText = await page.getByTestId('balance-amount').textContent();
    const currentBalance = parseInt(balanceText?.replace(/,/g, '') || '0');

    // 重新載入頁面
    await page.reload();

    // 驗證餘額保持一致
    await expect(page.getByTestId('balance-amount')).toContainText(currentBalance.toLocaleString());

    // 驗證 localStorage 中的值
    const storedBalance = await page.evaluate(() => {
      return localStorage.getItem('baccarat_balance');
    });
    expect(parseInt(storedBalance || '0')).toBe(currentBalance);
  });

  test('應該在重置餘額後回到初始金額', async ({ page }) => {
    await page.goto('/');

    // 進行一局遊戲改變餘額
    await page.getByRole('button', { name: /100/ }).click();
    await page.getByTestId('betting-area-banker').click();
    await page.getByRole('button', { name: /確認下注/ }).click();
    await expect(page.getByTestId('result-display')).toBeVisible({ timeout: 15000 });

    // 點擊重置餘額按鈕
    const resetButton = page.getByRole('button', { name: /重置餘額/ });
    await expect(resetButton).toBeVisible();
    await resetButton.click();

    // 驗證餘額回到 10000
    await expect(page.getByTestId('balance-amount')).toContainText('10,000');
  });
});
