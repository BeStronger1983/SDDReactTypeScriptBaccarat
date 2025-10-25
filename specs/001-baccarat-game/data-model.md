# 資料模型：百家樂遊戲

**專案**: 百家樂遊戲  
**日期**: 2025-10-25  
**目的**: 定義遊戲系統的核心資料結構和型別

## 核心實體

### 1. Card（撲克牌）

**描述**: 代表一張撲克牌

**屬性**:
```typescript
interface Card {
  suit: Suit;        // 花色
  rank: Rank;        // 點數
}

type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
```

**驗證規則**:
- suit 必須是四種花色之一
- rank 必須是 A-K 其中之一

**業務規則**:
- A = 1 點
- 2-9 = 面值點數
- 10, J, Q, K = 0 點

---

### 2. Shoe（牌靴）

**描述**: 包含 8 副撲克牌的虛擬牌靴

**屬性**:
```typescript
interface Shoe {
  cards: Card[];           // 剩餘的牌
  dealtCount: number;      // 已發出的牌數量
  totalCards: number;      // 總牌數（固定 416）
  needsShuffle: boolean;   // 是否需要重新洗牌
}
```

**驗證規則**:
- totalCards 固定為 416（8 副 × 52 張）
- dealtCount ≤ totalCards
- needsShuffle = true when cards.length < 52

**狀態轉換**:
```
初始化 → 洗牌 → 發牌 → [牌數 < 52] → 重新洗牌 → 發牌 → ...
```

---

### 3. Hand（手牌）

**描述**: 莊家或閒家的手牌

**屬性**:
```typescript
interface Hand {
  cards: Card[];      // 手牌（2-3 張）
  score: number;      // 點數總和（個位數）
  isNatural: boolean; // 是否為天生勝（8 或 9 點）
}
```

**驗證規則**:
- cards.length ∈ {2, 3}
- score ∈ [0, 9]
- isNatural = true when cards.length === 2 && score ∈ {8, 9}

**計算邏輯**:
```typescript
function calculateScore(cards: Card[]): number {
  const total = cards.reduce((sum, card) => sum + getCardValue(card), 0);
  return total % 10; // 取個位數
}
```

---

### 4. Bet（下注）

**描述**: 玩家的下注紀錄

**屬性**:
```typescript
interface Bet {
  player: number;   // 閒家投注金額
  banker: number;   // 莊家投注金額
  tie: number;      // 和局投注金額
}
```

**驗證規則**:
- 所有金額 ≥ 0
- 所有金額必須是有效籌碼面額的整數倍（10, 50, 100, 500, 1000）
- 總投注金額 ≤ 玩家餘額

**業務規則**:
- 允許同時對多個區域下注
- 下注金額必須 > 0 才能參與該區域的結算

---

### 5. GameResult（遊戲結果）

**描述**: 單局遊戲的完整結果

**屬性**:
```typescript
interface GameResult {
  id: string;                 // 唯一識別碼（UUID）
  timestamp: string;          // ISO 8601 時間戳記
  outcome: GameOutcome;       // 結果（莊勝/閒勝/和局）
  playerHand: Hand;           // 閒家手牌
  bankerHand: Hand;           // 莊家手牌
  bets: Bet;                  // 下注金額
  payout: number;             // 總獲利（可為負數）
}

type GameOutcome = 'player' | 'banker' | 'tie';
```

**計算邏輯**:
```typescript
function determineOutcome(playerScore: number, bankerScore: number): GameOutcome {
  if (playerScore > bankerScore) return 'player';
  if (bankerScore > playerScore) return 'banker';
  return 'tie';
}
```

---

### 6. GameState（遊戲狀態）

**描述**: 遊戲的完整狀態

**屬性**:
```typescript
interface GameState {
  phase: GamePhase;           // 當前階段
  shoe: Shoe;                 // 牌靴
  playerHand: Hand;           // 閒家手牌
  bankerHand: Hand;           // 莊家手牌
  currentBets: Bet;           // 當前下注
  timer: number;              // 倒數計時（秒）
  balance: number;            // 玩家餘額
  history: GameResult[];      // 歷史紀錄（最多 10 筆）
  lastResult: GameResult | null;  // 上一局結果
}

type GamePhase = 
  | 'betting'       // 下注階段
  | 'dealing'       // 發牌階段
  | 'drawing'       // 補牌階段（如需要）
  | 'calculating'   // 計算階段
  | 'result';       // 顯示結果階段
```

**狀態轉換圖**:
```
betting → [確認下注] → dealing → [發完 4 張牌] → drawing → [補牌完成] → calculating → [計算完成] → result → [開始新局] → betting
```

**驗證規則**:
- balance ≥ 0（歸零時自動重置為 10,000）
- history.length ≤ 10
- phase 轉換必須遵循狀態機規則

---

### 7. PlayerAccount（玩家帳戶）

**描述**: 玩家帳戶資訊（儲存於 localStorage）

**屬性**:
```typescript
interface PlayerAccount {
  balance: number;            // 當前餘額
  lastUpdated: string;        // 最後更新時間（ISO 8601）
  gamesPlayed: number;        // 總遊戲局數
  totalWagered: number;       // 累計投注金額
  totalPayout: number;        // 累計獲利
}
```

**驗證規則**:
- balance ≥ 0
- gamesPlayed ≥ 0
- 所有金額欄位必須是有限數字

**業務規則**:
- balance 歸零時自動重置為 10,000
- 每次結算後更新 lastUpdated

---

## 資料關係

```
PlayerAccount (1) ─── (1) GameState
                              │
                              ├─── (1) Shoe ─── (*) Card
                              ├─── (1) Hand ─── (*) Card
                              ├─── (1) Hand ─── (*) Card
                              ├─── (1) Bet
                              └─── (0..10) GameResult ─── (1) Hand
                                                      └─── (1) Hand
```

---

## localStorage 資料結構

### Key: `baccarat_balance`
```typescript
interface StoredBalance {
  amount: number;
  lastUpdated: string;
}
```

### Key: `baccarat_history`
```typescript
interface StoredHistory {
  games: GameResult[];
  maxEntries: 10;
}
```

### Key: `baccarat_game_state`
```typescript
interface StoredGameState {
  phase: GamePhase;
  shoe: Shoe;
  playerHand: Hand;
  bankerHand: Hand;
  currentBets: Bet;
  savedAt: string;
}
```

---

## 型別衛士（Type Guards）

```typescript
function isValidCard(obj: any): obj is Card {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    ['hearts', 'diamonds', 'clubs', 'spades'].includes(obj.suit) &&
    ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'].includes(obj.rank)
  );
}

function isValidBet(obj: any): obj is Bet {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.player === 'number' && obj.player >= 0 &&
    typeof obj.banker === 'number' && obj.banker >= 0 &&
    typeof obj.tie === 'number' && obj.tie >= 0
  );
}

function isValidGameResult(obj: any): obj is GameResult {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.timestamp === 'string' &&
    ['player', 'banker', 'tie'].includes(obj.outcome) &&
    typeof obj.payout === 'number' &&
    isValidBet(obj.bets)
  );
}
```

---

## 資料驗證

所有從 localStorage 讀取的資料都必須經過驗證：

```typescript
function loadBalanceFromStorage(): number {
  try {
    const data = localStorage.getItem('baccarat_balance');
    if (!data) return 10000;
    
    const parsed = JSON.parse(data) as StoredBalance;
    if (typeof parsed.amount !== 'number' || parsed.amount < 0) {
      return 10000;
    }
    
    return parsed.amount;
  } catch (error) {
    console.error('Failed to load balance:', error);
    return 10000;
  }
}

function loadHistoryFromStorage(): GameResult[] {
  try {
    const data = localStorage.getItem('baccarat_history');
    if (!data) return [];
    
    const parsed = JSON.parse(data) as StoredHistory;
    if (!Array.isArray(parsed.games)) return [];
    
    return parsed.games
      .filter(isValidGameResult)
      .slice(0, 10); // 確保不超過 10 筆
  } catch (error) {
    console.error('Failed to load history:', error);
    return [];
  }
}
```

---

## 資料流

### 1. 遊戲初始化流程
```
載入 localStorage → 驗證資料 → 初始化 GameState → 建立新牌靴 → 進入 betting 階段
```

### 2. 下注流程
```
選擇籌碼 → 驗證餘額 → 更新 currentBets → 扣除餘額 → 等待確認
```

### 3. 發牌流程
```
鎖定下注 → 從 shoe 發 4 張牌 → 計算點數 → 判定是否補牌 → 發第 3 張（如需要） → 計算最終點數
```

### 4. 結算流程
```
判定結果 → 計算獲利 → 更新餘額 → 儲存至 localStorage → 新增至 history → 顯示結果
```

### 5. 餘額歸零流程
```
檢查餘額 → [if balance <= 0] → 重置為 10,000 → 顯示通知 → 儲存至 localStorage
```

---

## 效能考量

### 資料大小估算
- 單張 Card: ~50 bytes
- 單局 GameResult: ~500 bytes
- 10 局歷史: ~5KB
- 完整 GameState: ~10KB
- **總計 localStorage 用量**: < 20KB（遠低於 5MB 限制）

### 優化策略
- 歷史紀錄限制 10 筆，自動移除最舊紀錄
- 不儲存完整牌靴狀態（416 張牌），僅在遊戲中途退出時儲存
- 使用 sessionStorage 存放暫時性資料（如動畫狀態）

---

## 總結

資料模型已完整定義，涵蓋：
- ✅ 7 個核心實體（Card, Shoe, Hand, Bet, GameResult, GameState, PlayerAccount）
- ✅ 3 個 localStorage 結構
- ✅ 完整的型別定義和驗證邏輯
- ✅ 狀態轉換規則
- ✅ 資料流程圖

下一步：建立 TypeScript 型別定義檔案（contracts/types.ts）。
