/**
 * 百家樂遊戲引擎
 *
 * 處理完整的遊戲回合執行，包括發牌、補牌、判定勝負和計算賠付
 */

import type { Shoe, Bet, Hand, Card, GameOutcome } from '@/types/game';
import { dealCard } from '@/services/cardShoe';
import { shouldPlayerDraw, shouldBankerDraw } from '@/services/baccaratRules';
import { calculateTotalPayout } from '@/services/payoutCalculator';
import { calculateScore, getCardValue } from '@/utils/cardUtils';

/**
 * 遊戲回合結果
 */
export interface GameRoundResult {
  playerHand: Hand;
  bankerHand: Hand;
  outcome: GameOutcome;
  payout: number;
  shoe: Shoe;
}

/**
 * 判定遊戲勝負
 *
 * 根據莊家和閒家的點數決定勝負結果
 *
 * @param playerHand - 閒家的手牌
 * @param bankerHand - 莊家的手牌
 * @returns 遊戲結果：'player'（閒家贏）、'banker'（莊家贏）或 'tie'（和局）
 *
 * @example
 * determineOutcome({ cards: [], score: 8, isNatural: true }, { cards: [], score: 7, isNatural: false })
 * // 返回 'player'
 */
export function determineOutcome(playerHand: Hand, bankerHand: Hand): GameOutcome {
  if (playerHand.score > bankerHand.score) {
    return 'player';
  }

  if (bankerHand.score > playerHand.score) {
    return 'banker';
  }

  return 'tie';
}

/**
 * 創建手牌對象
 *
 * 根據牌組計算分數並判定是否為天牌
 *
 * @param cards - 牌組
 * @returns 完整的手牌對象
 */
function createHand(cards: Card[]): Hand {
  const score = calculateScore(cards);
  const isNatural = cards.length === 2 && (score === 8 || score === 9);

  return {
    cards,
    score,
    isNatural,
  };
}

/**
 * 執行完整的遊戲回合
 *
 * 執行標準百家樂遊戲流程：
 * 1. 發四張初始牌（閒-莊-閒-莊）
 * 2. 檢查天牌（8或9點），如有則結束
 * 3. 根據規則決定是否補第三張牌
 * 4. 判定勝負
 * 5. 計算賠付
 *
 * @param shoe - 當前的牌靴
 * @param bets - 玩家的投注
 * @returns 遊戲回合結果，包含雙方手牌、勝負、賠付和更新後的牌靴
 *
 * @example
 * const shoe = createShoe();
 * const bets = { player: 100, banker: 0, tie: 0 };
 * const result = executeGameRound(shoe, bets);
 * console.log(result.outcome); // 'player', 'banker', or 'tie'
 * console.log(result.payout); // 計算後的賠付金額
 */
export function executeGameRound(shoe: Shoe, bets: Bet): GameRoundResult {
  let currentShoe = shoe;
  const playerCards: Card[] = [];
  const bankerCards: Card[] = [];

  // 步驟 1: 發四張初始牌（閒-莊-閒-莊）
  // 第一張給閒家
  let dealResult = dealCard(currentShoe);
  playerCards.push(dealResult.card);
  currentShoe = dealResult.shoe;

  // 第二張給莊家
  dealResult = dealCard(currentShoe);
  bankerCards.push(dealResult.card);
  currentShoe = dealResult.shoe;

  // 第三張給閒家
  dealResult = dealCard(currentShoe);
  playerCards.push(dealResult.card);
  currentShoe = dealResult.shoe;

  // 第四張給莊家
  dealResult = dealCard(currentShoe);
  bankerCards.push(dealResult.card);
  currentShoe = dealResult.shoe;

  // 計算初始分數
  let playerHand = createHand(playerCards);
  let bankerHand = createHand(bankerCards);

  // 步驟 2: 檢查天牌（任一方有8或9點則立即結束）
  if (playerHand.isNatural || bankerHand.isNatural) {
    const outcome = determineOutcome(playerHand, bankerHand);
    const payout = calculateTotalPayout(bets, outcome);

    return {
      playerHand,
      bankerHand,
      outcome,
      payout,
      shoe: currentShoe,
    };
  }

  // 步驟 3: 根據規則補第三張牌
  let playerThirdCardValue: number | null = null;

  // 閒家補牌判定
  if (shouldPlayerDraw(playerHand.score)) {
    dealResult = dealCard(currentShoe);
    playerCards.push(dealResult.card);
    currentShoe = dealResult.shoe;
    playerThirdCardValue = getCardValue(dealResult.card);
    playerHand = createHand(playerCards);
  }

  // 莊家補牌判定
  if (shouldBankerDraw(bankerHand.score, playerThirdCardValue)) {
    dealResult = dealCard(currentShoe);
    bankerCards.push(dealResult.card);
    currentShoe = dealResult.shoe;
    bankerHand = createHand(bankerCards);
  }

  // 步驟 4: 判定勝負
  const outcome = determineOutcome(playerHand, bankerHand);

  // 步驟 5: 計算賠付
  const payout = calculateTotalPayout(bets, outcome);

  return {
    playerHand,
    bankerHand,
    outcome,
    payout,
    shoe: currentShoe,
  };
}
