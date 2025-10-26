/**
 * GameTable 遊戲桌元件
 *
 * 整合所有遊戲元件，提供完整的百家樂遊戲體驗
 * 包括：
 * - 籌碼選擇
 * - 下注區域
 * - 發牌動畫
 * - 結果顯示
 * - 餘額管理
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { ChipSelector } from './ChipSelector';
import { BettingArea } from './BettingArea';
import { CardHand } from './CardHand';
import { ResultDisplay } from './ResultDisplay';
import { BetTimer } from './BetTimer';
import { Button } from '@/components/ui/Button';
import { useGameState } from '@/hooks/useGameState';
import { useBalance } from '@/hooks/useBalance';
import { useBetting, type BetArea } from '@/hooks/useBetting';
import { createShoe } from '@/services/cardShoe';
import { executeGameRound } from '@/services/gameEngine';
import type { ChipValue, Shoe } from '@/types/game';
import './GameTable.css';

const INITIAL_BALANCE = 10000;
const BET_TIME = 30; // 30 秒下注時間

interface BetHistory {
  area: BetArea;
  amount: number;
}

/**
 * GameTable 遊戲桌元件
 */
/* eslint-disable complexity, max-lines-per-function */
export const GameTable: React.FC = () => {
  // 遊戲狀態
  const {
    phase,
    playerHand,
    bankerHand,
    timer,
    lastResult,
    startDealing,
    completeDealing,
    completeDrawing,
    startNewRound,
    setPlayerHand,
    setBankerHand,
    setTimer,
    decrementTimer,
    calculateResult,
  } = useGameState();

  // 餘額管理
  const { balance, debit, credit, canAfford } = useBalance(INITIAL_BALANCE);

  // 下注管理
  const { bets, totalBet, placeBet, clearBets } = useBetting();

  // 選中的籌碼
  const [selectedChip, setSelectedChip] = useState<ChipValue>(100);

  // 牌靴
  const [shoe, setShoe] = useState<Shoe>(() => createShoe());

  // 下注歷史（用於撤銷）
  const [betHistory, setBetHistory] = useState<BetHistory[]>([]);

  // 是否顯示總下注金額
  const showTotalBet = totalBet > 0;

  // 初始化計時器
  useEffect(() => {
    if (phase === 'betting' && timer === 0) {
      setTimer(BET_TIME);
    }
  }, [phase, timer, setTimer]);

  // 倒數計時器
  useEffect(() => {
    if (phase !== 'betting' || timer <= 0) return;

    const interval = setInterval(() => {
      decrementTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, timer, decrementTimer]);

  // 計時器歸零自動發牌
  useEffect(() => {
    if (phase === 'betting' && timer === 0 && totalBet > 0) {
      handleDeal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timer, totalBet]);

  // 處理下注
  const handleBet = useCallback(
    (area: BetArea, amount: number) => {
      if (phase !== 'betting') return;

      const success = placeBet(area, amount, canAfford);
      if (success) {
        // 扣除餘額（下注時立即扣除）
        debit(amount);
        // 記錄下注歷史
        setBetHistory((prev) => [...prev, { area, amount }]);
      }
    },
    [phase, placeBet, canAfford, debit]
  );

  // 處理籌碼選擇
  const handleChipSelect = useCallback((value: ChipValue) => {
    setSelectedChip(value);
  }, []);

  // 處理清除下注
  const handleClearBets = useCallback(() => {
    // 退還下注金額
    credit(totalBet);
    clearBets();
    setBetHistory([]);
  }, [clearBets, credit, totalBet]);

  // 處理撤銷
  const handleUndo = useCallback(() => {
    if (betHistory.length === 0) return;

    const lastBet = betHistory[betHistory.length - 1];
    if (!lastBet) return;

    // 退還金額
    credit(lastBet.amount);
    // 從下注中扣除
    placeBet(lastBet.area, -lastBet.amount);
    // 移除歷史記錄
    setBetHistory((prev) => prev.slice(0, -1));
  }, [betHistory, credit, placeBet]);

  // 處理發牌
  const handleDeal = useCallback(() => {
    if (phase !== 'betting' || totalBet === 0) return;

    // 開始發牌
    startDealing();

    // 執行遊戲回合
    setTimeout(() => {
      const result = executeGameRound(shoe, bets);

      // 更新牌靴
      setShoe(result.shoe);

      // 設定手牌
      setPlayerHand(result.playerHand.cards);
      setBankerHand(result.bankerHand.cards);

      // 完成發牌，進入補牌階段
      completeDealing();

      // 發牌動畫完成後顯示結果
      setTimeout(() => {
        // 完成補牌，進入計算階段
        completeDrawing();

        // 稍微延遲後計算結果
        setTimeout(() => {
          // 計算結果並更新餘額
          calculateResult(result.outcome, result.payout, bets);

          // 返還贏的注碼（本金）+ 賠付金額
          // 根據結果決定哪個區域贏了
          let principalReturn = 0;
          if (result.outcome === 'player') {
            principalReturn = bets.player;
          } else if (result.outcome === 'banker') {
            principalReturn = bets.banker;
          } else if (result.outcome === 'tie') {
            // 和局時，閒家和莊家的注碼退回，和局贏
            principalReturn = bets.player + bets.banker + bets.tie;
          }

          // credit 本金 + 賠付
          const totalReturn = principalReturn + result.payout;
          if (totalReturn > 0) {
            credit(totalReturn);
          }
        }, 100);
      }, 2000); // 2秒發牌動畫
    }, 100);
  }, [
    phase,
    totalBet,
    startDealing,
    completeDealing,
    completeDrawing,
    shoe,
    bets,
    setPlayerHand,
    setBankerHand,
    calculateResult,
    credit,
  ]);

  // 處理新一輪
  const handleNewRound = useCallback(() => {
    startNewRound();
    clearBets();
    setBetHistory([]);
    setTimer(BET_TIME);
  }, [startNewRound, clearBets, setTimer]);

  // 是否禁用籌碼（餘額不足或不在下注階段）
  const isChipDisabled = useCallback(
    (chipValue: ChipValue): boolean => {
      return phase !== 'betting' || !canAfford(chipValue);
    },
    [phase, canAfford]
  );

  return (
    <div className="game-table" data-testid="game-table" data-phase={phase}>
      {/* 標題列 */}
      <Header balance={balance} formatBalanceWithCommas title="百家樂" />

      {/* 左側欄位 - 籌碼和計時器 */}
      <div className="left-column">
        {/* 籌碼選擇器 */}
        <div className="game-section chip-section">
          <ChipSelector
            selectedValue={selectedChip}
            onSelect={handleChipSelect}
            disabled={phase !== 'betting'}
            isChipDisabled={isChipDisabled}
          />
        </div>

        {/* 計時器（僅在下注階段顯示） */}
        {phase === 'betting' && timer > 0 && (
          <div className="game-section timer-section">
            <BetTimer seconds={timer} onTimeUp={handleDeal} label="下注時間" showProgress />
          </div>
        )}
      </div>

      {/* 中間欄位 - 牌面和結果 */}
      <div className="center-column">
        {/* 牌面顯示區域 */}
        <div className="game-section hands-section">
          <div className="hand-container">
            <CardHand hand={playerHand} label="閒家" type="player" />
          </div>
          <div className="hand-container">
            <CardHand hand={bankerHand} label="莊家" type="banker" />
          </div>
        </div>

        {/* 結果顯示 */}
        {phase === 'result' && lastResult && (
          <div className="game-section result-section">
            <ResultDisplay
              outcome={lastResult.outcome}
              playerScore={lastResult.playerHand.score}
              bankerScore={lastResult.bankerHand.score}
              playerNatural={lastResult.playerHand.isNatural}
              bankerNatural={lastResult.bankerHand.isNatural}
              winAmount={lastResult.payout}
            />
          </div>
        )}
      </div>

      {/* 右側欄位 - 下注區域 */}
      <div className="right-column">
        <div className="game-section betting-section" data-testid="betting-area">
          <div className="betting-areas">
            <BettingArea
              type="player"
              amount={bets.player}
              onBet={(chipValue) => handleBet('player', chipValue)}
              chipValue={selectedChip}
              disabled={phase !== 'betting' || isChipDisabled(selectedChip)}
            />
            <BettingArea
              type="banker"
              amount={bets.banker}
              onBet={(chipValue) => handleBet('banker', chipValue)}
              chipValue={selectedChip}
              disabled={phase !== 'betting' || isChipDisabled(selectedChip)}
            />
            <BettingArea
              type="tie"
              amount={bets.tie}
              onBet={(chipValue) => handleBet('tie', chipValue)}
              chipValue={selectedChip}
              disabled={phase !== 'betting' || isChipDisabled(selectedChip)}
            />
          </div>

          {/* 總下注金額 */}
          {showTotalBet && (
            <div className="total-bet" data-testid="total-bet">
              總下注：{totalBet}
            </div>
          )}
        </div>
      </div>

      {/* 控制按鈕 */}
      <div className="controls-area">
        <div className="game-section controls-section">
          {phase === 'betting' && (
            <>
              <Button
                variant="primary"
                onClick={handleDeal}
                disabled={totalBet === 0}
                aria-label="發牌"
              >
                發牌
              </Button>
              <Button
                variant="secondary"
                onClick={handleClearBets}
                disabled={totalBet === 0}
                aria-label="清除下注"
              >
                清除
              </Button>
              <Button
                variant="secondary"
                onClick={handleUndo}
                disabled={betHistory.length === 0}
                aria-label="撤銷"
              >
                撤銷
              </Button>
            </>
          )}

          {phase === 'result' && (
            <Button variant="primary" onClick={handleNewRound} aria-label="開始新一輪">
              開始新一輪
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
