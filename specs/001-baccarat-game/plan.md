# 實作計畫：百家樂遊戲

**分支**: `001-baccarat-game` | **日期**: 2025-10-25 | **規格書**: [spec.md](./spec.md)  
**輸入**: 功能規格來自 `/specs/001-baccarat-game/spec.md`  
**技術堆疊**: ReactJS + TypeScript（依據使用者指定）

## 摘要

建立一個使用 React 和 TypeScript 開發的單人百家樂遊戲，採用純客戶端架構。遊戲包含完整的下注、發牌、補牌和結算流程，使用 localStorage 管理玩家餘額和歷史紀錄。核心重點為遊戲邏輯正確性、流暢的動畫體驗，以及符合標準百家樂規則的補牌機制。

## 技術背景

**語言/版本**: TypeScript 5.x + React 18.x  
**主要相依套件**: 
- React 18.x（UI 框架）
- TypeScript 5.x（型別安全）
- Vite（建置工具與開發伺服器）
- Vitest + React Testing Library（測試框架）
- Framer Motion 或 React Spring（動畫庫）

**儲存方案**: 瀏覽器 localStorage（玩家餘額、遊戲狀態、歷史紀錄）  
**測試框架**: Vitest（單元測試） + React Testing Library（元件測試） + Playwright（E2E 測試）  
**目標平台**: 現代瀏覽器（Chrome 90+, Firefox 88+, Safari 14+），桌面環境  
**專案類型**: 單頁應用程式（SPA）  
**效能目標**: 
- 60 FPS 動畫流暢度
- 初始載入時間 < 2 秒
- 互動回應時間 < 100ms

**約束條件**: 
- 純客戶端實作，無後端伺服器
- 使用 Math.random() 進行洗牌（娛樂性質）
- 最低解析度支援 1024x768
- 不支援行動裝置（本版本）

**規模/範圍**: 
- 單一遊戲功能
- 5 個使用者故事
- 35 項功能需求
- 約 15-20 個 React 元件

## 憲法檢查

*閘門：必須在 Phase 0 研究前通過。Phase 1 設計後重新檢查。*

### I. 程式碼品質卓越

- [x] **TypeScript 嚴格模式**: 專案將使用 TypeScript strict mode，tsconfig.json 中啟用所有嚴格檢查
- [x] **型別安全**: 禁止使用 `any`，所有類型必須明確定義
- [x] **程式碼審查**: 所有 PR 需要至少一位審查者批准
- [x] **Linting & 格式化**: 配置 ESLint + Prettier，pre-commit hook 強制執行
- [x] **文檔化**: 所有公開 API 和複雜邏輯使用 JSDoc 註解
- [x] **簡潔程式碼**: 函式保持單一職責，Cyclomatic complexity ≤ 10
- [x] **版本控制**: 遵循 Conventional Commits 規範

### II. 全面測試標準（不可妥協）

- [x] **測試覆蓋率**: 目標 80% 整體覆蓋率，遊戲邏輯（補牌規則、結算）需達 95%
- [x] **測試金字塔**: 單元測試為主（70%），整合測試（20%），E2E 測試（10%）
- [x] **TDD 工作流**: 先寫測試 → 測試失敗 → 實作 → 測試通過 → 重構
- [x] **測試品質**: 測試獨立、可重現、快速執行
- [x] **關鍵路徑測試**: 
  - 補牌邏輯（所有規則分支）
  - 賠率計算（莊/閒/和局）
  - 餘額管理（扣款、加款、歸零重置）
  - localStorage 持久化

### III. 使用者體驗一致性

- [x] **設計系統**: 建立統一的 UI 元件庫（Button, Card, ChipSelector 等）
- [x] **無障礙性**: 基本鍵盤導航支援，語意化 HTML
- [x] **響應式設計**: 支援桌面解析度 1024x768+
- [x] **效能回饋**: 所有使用者操作提供即時視覺回饋（< 100ms）
- [x] **錯誤處理**: 友善的錯誤訊息（餘額不足、無效操作）
- [ ] **國際化**: 本版本僅支援繁體中文，未來可擴充（DEFERRED）

### IV. 效能需求

- [x] **初始載入**: FCP < 1.5s, LCP < 2.5s（透過 code splitting 和 lazy loading）
- [x] **互動性**: FID < 100ms
- [x] **Bundle 大小**: 初始 bundle < 200KB gzipped（使用 Vite 的 tree shaking）
- [x] **渲染效能**: 60 FPS 動畫（使用 requestAnimationFrame 或動畫庫）
- [x] **記憶體管理**: 無記憶體洩漏（清理 useEffect 訂閱和計時器）
- [x] **API 回應時間**: N/A（無後端 API）

### V. 文檔語言標準

- [x] **規格書**: 使用繁體中文 ✓（spec.md 已符合）
- [x] **計畫書**: 使用繁體中文 ✓（本文件）
- [x] **程式碼註解**: 英文 JSDoc，保持國際協作能力
- [x] **Commit 訊息**: 英文 Conventional Commits 格式

### 安全性與合規性（簡化版，純客戶端遊戲）

- [x] **資料保護**: localStorage 資料無敏感資訊（僅餘額和遊戲歷史）
- [x] **輸入驗證**: 所有使用者輸入驗證（下注金額、籌碼選擇）
- [x] **審計日誌**: 遊戲歷史紀錄儲存於 localStorage（最近 10 局）
- [x] **相依套件安全**: 使用 `npm audit` 定期掃描

### 開發流程與品質閘門

- [x] **本地開發**: Pre-commit hooks（lint + type-check + unit tests）
- [x] **Pull Request**: 測試通過 + 程式碼審查 + 無衝突
- [x] **CI/CD**: GitHub Actions 執行 lint + test + build
- [x] **部署閘門**: 本版本為純客戶端，部署至靜態託管（Vercel/Netlify）

**檢查結果**: ✅ 通過所有必要檢查（1 項延後至未來版本）

## 專案結構

### 文檔（此功能）

```text
specs/001-baccarat-game/
├── spec.md              # 功能規格書
├── plan.md              # 本文件（實作計畫）
├── research.md          # Phase 0 輸出（技術研究）
├── data-model.md        # Phase 1 輸出（資料模型）
├── quickstart.md        # Phase 1 輸出（快速開始指南）
├── contracts/           # Phase 1 輸出（型別定義）
│   └── types.ts         # TypeScript 介面定義
├── checklists/          # 品質檢查表
│   └── requirements.md  # 需求檢查表
└── tasks.md             # Phase 2 輸出（任務清單，由 /speckit.tasks 產生）
```

### 原始碼（專案根目錄）

```text
baccarat-game/                    # 專案根目錄
├── public/                       # 靜態資源
│   ├── cards/                    # 撲克牌圖片
│   ├── chips/                    # 籌碼圖片
│   └── table-bg.png              # 桌面背景
├── src/
│   ├── components/               # React 元件
│   │   ├── ui/                   # 通用 UI 元件
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx          # 撲克牌元件
│   │   │   └── Chip.tsx          # 籌碼元件
│   │   ├── game/                 # 遊戲專屬元件
│   │   │   ├── GameTable.tsx     # 遊戲桌面
│   │   │   ├── BettingArea.tsx   # 下注區域
│   │   │   ├── ChipSelector.tsx  # 籌碼選擇器
│   │   │   ├── CardHand.tsx      # 牌面顯示
│   │   │   ├── GameHistory.tsx   # 歷史紀錄
│   │   │   ├── BetTimer.tsx      # 下注倒數計時
│   │   │   └── ResultDisplay.tsx # 結果顯示
│   │   └── layout/               # 版面元件
│   │       ├── Header.tsx
│   │       └── BalanceDisplay.tsx
│   ├── hooks/                    # Custom React Hooks
│   │   ├── useGameState.ts       # 遊戲狀態管理
│   │   ├── useBalance.ts         # 餘額管理
│   │   ├── useBetting.ts         # 下注邏輯
│   │   └── useLocalStorage.ts    # localStorage 封裝
│   ├── services/                 # 業務邏輯服務
│   │   ├── gameEngine.ts         # 遊戲引擎（核心邏輯）
│   │   ├── cardShoe.ts           # 牌靴管理
│   │   ├── baccaratRules.ts      # 百家樂規則（補牌、計分）
│   │   ├── payoutCalculator.ts   # 賠率計算
│   │   └── storageService.ts     # 資料持久化
│   ├── types/                    # TypeScript 型別定義
│   │   ├── game.ts               # 遊戲相關型別
│   │   ├── card.ts               # 撲克牌型別
│   │   └── betting.ts            # 下注型別
│   ├── utils/                    # 工具函式
│   │   ├── cardUtils.ts          # 牌面工具
│   │   ├── shuffle.ts            # 洗牌演算法
│   │   └── validators.ts         # 驗證函式
│   ├── constants/                # 常數定義
│   │   ├── gameConfig.ts         # 遊戲配置
│   │   └── payoutRates.ts        # 賠率常數
│   ├── styles/                   # 樣式
│   │   ├── global.css
│   │   └── animations.css        # 動畫樣式
│   ├── App.tsx                   # 主應用程式元件
│   ├── main.tsx                  # 應用程式入口
│   └── vite-env.d.ts
├── tests/                        # 測試檔案
│   ├── unit/                     # 單元測試
│   │   ├── baccaratRules.test.ts
│   │   ├── payoutCalculator.test.ts
│   │   ├── cardShoe.test.ts
│   │   └── validators.test.ts
│   ├── integration/              # 整合測試
│   │   ├── gameFlow.test.tsx
│   │   └── localStorage.test.ts
│   └── e2e/                      # E2E 測試
│       ├── fullGame.spec.ts
│       └── betting.spec.ts
├── .eslintrc.json                # ESLint 配置
├── .prettierrc                   # Prettier 配置
├── tsconfig.json                 # TypeScript 配置
├── vite.config.ts                # Vite 配置
├── vitest.config.ts              # Vitest 配置
├── package.json
└── README.md
```

---

## Phase 0: 大綱與研究

**狀態**: ✅ 完成

**產出文件**:
- ✅ [research.md](./research.md) - 技術研究與決策記錄

**研究項目總結**:
1. **動畫庫選擇**: Framer Motion（宣告式 API，效能優異，40KB gzipped）
2. **狀態管理**: React Context API + useReducer（輕量，無第三方依賴）
3. **localStorage 結構**: 結構化 JSON 格式，包含餘額、歷史、遊戲狀態
4. **洗牌演算法**: Fisher-Yates Shuffle（O(n)，均勻分布）
5. **測試工具鏈**: Vitest + React Testing Library + Playwright

---

## Phase 1: 設計與契約

**狀態**: ✅ 完成

**產出文件**:
- ✅ [data-model.md](./data-model.md) - 完整資料模型定義
- ✅ [contracts/types.ts](./contracts/types.ts) - TypeScript 型別定義
- ✅ [quickstart.md](./quickstart.md) - 開發快速啟動指南

**設計產出總結**:
- **7 個核心實體**: Card, Shoe, Hand, Bet, GameResult, GameState, PlayerAccount
- **5 個遊戲階段**: betting → dealing → drawing → calculating → result
- **3 個 localStorage 結構**: balance, history, game_state
- **完整型別定義**: 280 行 TypeScript 介面和型別衛士

---

## Phase 2: 任務分解

**狀態**: ⏸ 待執行

下一步執行 `/speckit.tasks` 命令產生 `tasks.md`。

---

## 實作順序建議

基於 TDD 原則和相依性，建議按以下順序實作：

### 第一階段：核心邏輯（無 UI）
1. **型別定義** (src/types/game.ts)
2. **常數定義** (src/constants/)
3. **工具函式** (src/utils/)
   - shuffle.ts（洗牌演算法）
   - cardUtils.ts（牌面工具）
   - validators.ts（驗證函式）
4. **遊戲規則** (src/services/)
   - baccaratRules.ts（補牌規則、計分）
   - payoutCalculator.ts（賠率計算）
   - cardShoe.ts（牌靴管理）
5. **資料持久化** (src/services/storageService.ts)

### 第二階段：React 整合
6. **Custom Hooks** (src/hooks/)
   - useLocalStorage.ts
   - useBalance.ts
   - useBetting.ts
   - useGameState.ts（整合所有邏輯）
7. **UI 元件** (src/components/ui/)
   - Button.tsx
   - Card.tsx
   - Chip.tsx
8. **遊戲元件** (src/components/game/)
   - BettingArea.tsx
   - ChipSelector.tsx
   - CardHand.tsx
   - BetTimer.tsx
   - ResultDisplay.tsx
   - GameHistory.tsx
9. **主元件** (src/components/game/GameTable.tsx)

### 第三階段：整合與優化
10. **動畫整合**（Framer Motion）
11. **E2E 測試**
12. **效能優化**（code splitting, lazy loading）
13. **部署設定**

---

## 關鍵里程碑

| 里程碑 | 完成標準 | 預估時間 |
|--------|----------|----------|
| M1: 核心邏輯完成 | 所有 services 測試通過，覆蓋率 95%+ | 2-3 天 |
| M2: React 整合完成 | 基本 UI 可互動，無動畫 | 3-4 天 |
| M3: 動畫與視覺完成 | 發牌動畫流暢，60 FPS | 2-3 天 |
| M4: 測試與優化完成 | E2E 測試通過，bundle < 200KB | 1-2 天 |
| M5: 部署就緒 | CI/CD 設定完成，部署至 Vercel/Netlify | 1 天 |

**總預估**: 9-13 天（單人全職開發）

---

## 風險與緩解

| 風險 | 影響 | 機率 | 緩解策略 |
|------|------|------|----------|
| 動畫效能不達標 | 高 | 中 | 使用 Chrome DevTools 持續監控，限制同時動畫數量 |
| 補牌規則實作錯誤 | 高 | 低 | TDD 確保所有分支測試覆蓋，人工驗證標準百家樂規則 |
| localStorage 資料損壞 | 中 | 低 | 完整的型別衛士和錯誤處理，損壞時自動重置 |
| Bundle 大小超標 | 中 | 低 | Vite tree-shaking，code splitting，避免不必要的依賴 |

---

## 下一步行動

1. ✅ 憲法檢查通過
2. ✅ Phase 0 研究完成
3. ✅ Phase 1 設計完成
4. ⏭ **執行 `/speckit.tasks`** 產生詳細任務清單
5. ⏭ 開始實作（遵循 TDD 工作流程）

---

**計畫完成日期**: 2025-10-25  
**下次更新**: 執行 `/speckit.tasks` 後
