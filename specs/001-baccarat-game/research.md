# 技術研究：百家樂遊戲

**專案**: 百家樂遊戲  
**日期**: 2025-10-25  
**目的**: 解決技術背景中的未知項目，並為關鍵技術決策提供依據

## 研究項目總覽

本文件記錄以下技術決策的研究過程與結論：

1. 動畫庫選擇（Framer Motion vs React Spring）
2. 狀態管理方案（Context API vs Zustand vs Redux）
3. localStorage 資料結構設計
4. 洗牌演算法實作
5. 測試策略與工具鏈

---

## 1. 動畫庫選擇

### 決策：使用 Framer Motion

**理由**：
- **宣告式 API**: 更符合 React 哲學，易於維護
- **內建手勢支援**: 雖然本版本不需要，但為未來行動版預留空間
- **效能優異**: 使用 GPU 加速，能輕鬆達到 60 FPS
- **學習曲線平緩**: 文檔完善，社群活躍
- **Bundle 大小**: ~40KB gzipped，可接受範圍內

**考慮的替代方案**：
- **React Spring**: 更適合物理動畫，但對於卡牌遊戲的線性動畫來說過於複雜
- **CSS Animations**: 輕量但缺乏程式化控制，難以處理複雜的序列動畫

**實作重點**：
- 使用 `motion.div` 包裝 Card 元件實現發牌動畫
- 使用 `AnimatePresence` 處理結果顯示的進出場動畫
- 使用 `variants` 定義動畫序列（發牌 → 翻牌 → 結算）

**範例程式碼**：
```tsx
import { motion } from 'framer-motion';

const cardVariants = {
  dealing: { x: 0, y: 0, rotateY: 0 },
  dealt: { x: 100, y: 50, rotateY: 180, transition: { duration: 0.5 } }
};

<motion.div variants={cardVariants} initial="dealing" animate="dealt">
  <Card suit="hearts" rank="A" />
</motion.div>
```

---

## 2. 狀態管理方案

### 決策：React Context API + useReducer

**理由**：
- **專案規模小**: 單一遊戲功能，狀態不複雜
- **無需第三方套件**: 減少依賴，降低 bundle 大小
- **足夠靈活**: 可處理遊戲狀態、下注狀態、UI 狀態
- **易於測試**: useReducer 的純函式特性利於單元測試

**考慮的替代方案**：
- **Zustand**: 輕量且強大，但對於此專案來說是過度設計
- **Redux Toolkit**: 功能完整但過於重量級，不適合小型專案
- **Jotai/Recoil**: 原子化狀態管理，學習曲線較陡

**狀態結構設計**：
```tsx
interface GameState {
  phase: 'betting' | 'dealing' | 'calculating' | 'result';
  shoe: Card[];
  playerHand: Card[];
  bankerHand: Card[];
  bets: {
    player: number;
    banker: number;
    tie: number;
  };
  history: GameResult[];
  balance: number;
  timer: number;
}
```

**實作策略**：
- 建立 `GameContext` 和 `GameProvider`
- 使用 `useReducer` 管理遊戲狀態轉換
- 將 localStorage 同步邏輯封裝在 custom hook 中

---

## 3. localStorage 資料結構設計

### 決策：使用結構化 JSON 格式

**資料結構**：
```typescript
// Key: 'baccarat_balance'
interface BalanceData {
  amount: number;
  lastUpdated: string; // ISO 8601
}

// Key: 'baccarat_history'
interface HistoryData {
  games: Array<{
    id: string;
    timestamp: string;
    result: 'player' | 'banker' | 'tie';
    playerHand: Card[];
    bankerHand: Card[];
    playerScore: number;
    bankerScore: number;
    bets: { player: number; banker: number; tie: number };
    payout: number;
  }>;
  maxEntries: 10;
}

// Key: 'baccarat_game_state' (用於中途退出恢復)
interface GameStateData {
  phase: string;
  shoe: Card[];
  playerHand: Card[];
  bankerHand: Card[];
  bets: { player: number; banker: number; tie: number };
  savedAt: string;
}
```

**資料驗證策略**：
- 讀取時驗證資料結構完整性
- 使用 TypeScript type guards 確保型別安全
- 損壞的資料自動重置為預設值

**範例實作**：
```typescript
const STORAGE_KEYS = {
  BALANCE: 'baccarat_balance',
  HISTORY: 'baccarat_history',
  GAME_STATE: 'baccarat_game_state'
} as const;

function loadBalance(): number {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BALANCE);
    if (!data) return 10000; // 預設值
    const parsed = JSON.parse(data) as BalanceData;
    return typeof parsed.amount === 'number' ? parsed.amount : 10000;
  } catch {
    return 10000;
  }
}
```

---

## 4. 洗牌演算法實作

### 決策：Fisher-Yates Shuffle（現代版）

**理由**：
- **均勻分布**: 保證每種排列出現的機率相等
- **效能優異**: O(n) 時間複雜度
- **實作簡單**: 程式碼易於理解和測試
- **業界標準**: 廣泛應用於卡牌遊戲

**實作程式碼**：
```typescript
/**
 * Fisher-Yates shuffle algorithm
 * @param array - Array to shuffle (will be modified in-place)
 * @returns The shuffled array
 */
function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Create a new 8-deck shoe (416 cards) and shuffle it
 */
function createShuffledShoe(): Card[] {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
  const ranks: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  const cards: Card[] = [];
  for (let deck = 0; deck < 8; deck++) {
    for (const suit of suits) {
      for (const rank of ranks) {
        cards.push({ suit, rank });
      }
    }
  }
  
  return shuffle(cards);
}
```

**測試策略**：
- 統計測試：執行 10,000 次洗牌，驗證分布均勻性
- 單元測試：確保陣列長度不變、元素不丟失

---

## 5. 測試策略與工具鏈

### 決策：Vitest + React Testing Library + Playwright

**單元測試：Vitest**
- **理由**: 
  - 與 Vite 完美整合
  - 速度極快（使用 ESM）
  - API 與 Jest 相容，易於遷移
  - 內建程式碼覆蓋率報告
  
**元件測試：React Testing Library**
- **理由**:
  - 鼓勵測試使用者行為而非實作細節
  - 與 Vitest 整合良好
  - 業界標準，文檔豐富

**E2E 測試：Playwright**
- **理由**:
  - 支援多瀏覽器測試（Chrome, Firefox, Safari）
  - 內建截圖和影片錄製功能
  - 強大的選擇器和等待機制
  - 比 Cypress 更快且更穩定

**測試覆蓋率目標**：
- 遊戲邏輯（baccaratRules, payoutCalculator）: **95%+**
- 工具函式（shuffle, validators）: **90%+**
- React 元件: **80%+**
- E2E 關鍵流程: **100% 覆蓋核心使用者旅程**

**測試組織**：
```text
tests/
├── unit/
│   ├── baccaratRules.test.ts      # 補牌規則測試（所有分支）
│   ├── payoutCalculator.test.ts   # 賠率計算測試
│   ├── cardShoe.test.ts            # 牌靴管理測試
│   └── validators.test.ts          # 驗證函式測試
├── integration/
│   ├── gameFlow.test.tsx           # 完整遊戲流程測試
│   └── localStorage.test.ts        # 資料持久化測試
└── e2e/
    ├── fullGame.spec.ts            # 完整遊戲 E2E
    └── betting.spec.ts             # 下注功能 E2E
```

**範例測試**：
```typescript
// unit/baccaratRules.test.ts
describe('Baccarat Draw Rules', () => {
  describe('Player draw rules', () => {
    it('should draw when player has 0-5', () => {
      expect(shouldPlayerDraw(5)).toBe(true);
      expect(shouldPlayerDraw(3)).toBe(true);
    });
    
    it('should stand when player has 6-7', () => {
      expect(shouldPlayerDraw(6)).toBe(false);
      expect(shouldPlayerDraw(7)).toBe(false);
    });
    
    it('should stand when player has natural (8-9)', () => {
      expect(shouldPlayerDraw(8)).toBe(false);
      expect(shouldPlayerDraw(9)).toBe(false);
    });
  });
  
  describe('Banker draw rules with player third card', () => {
    it('should draw when banker=3 and player third card is not 8', () => {
      expect(shouldBankerDraw(3, 7)).toBe(true);
      expect(shouldBankerDraw(3, 8)).toBe(false);
    });
    
    // ... 更多測試案例
  });
});
```

---

## 技術風險與緩解策略

### 風險 1: 動畫效能問題
**緩解**:
- 使用 Chrome DevTools Performance profiler 監控
- 限制同時進行的動畫數量
- 使用 `will-change` CSS 屬性提示瀏覽器優化

### 風險 2: localStorage 配額限制
**緩解**:
- 歷史紀錄限制 10 筆，資料量極小（< 10KB）
- 實作錯誤處理，配額滿時清除最舊資料

### 風險 3: 跨瀏覽器相容性
**緩解**:
- 使用 Playwright 測試 Chrome, Firefox, Safari
- Vite 自動處理 polyfill
- 避免使用實驗性 API

---

## 相依套件清單

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^10.16.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "@vitest/ui": "^1.0.0",
    "eslint": "^8.45.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-react": "^7.33.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "playwright": "^1.40.0",
    "prettier": "^3.0.0",
    "typescript": "^5.2.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@testing-library/jest-dom": "^6.1.0"
  }
}
```

---

## 結論

所有關鍵技術決策已完成研究並記錄。選擇的技術堆疊（React + TypeScript + Vite + Framer Motion）能夠滿足：
- ✅ 60 FPS 動畫效能
- ✅ < 2 秒初始載入時間
- ✅ 80%+ 測試覆蓋率
- ✅ TypeScript 嚴格模式型別安全
- ✅ 小於 200KB gzipped bundle 大小

下一步：進入 Phase 1 設計階段，建立資料模型和型別定義。
