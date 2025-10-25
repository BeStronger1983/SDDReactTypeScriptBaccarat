# 任務清單：百家樂遊戲

**輸入**: 設計文件來自 `/specs/001-baccarat-game/`  
**前置需求**: plan.md, spec.md, research.md, data-model.md, contracts/

**測試策略**: 遵循憲法的 TDD 要求，所有任務按照「測試先行」原則執行

**組織方式**: 任務按使用者故事分組，使每個故事可以獨立實作和測試

## 格式說明：`[ID] [P?] [Story] 描述`

- **[P]**: 可並行執行（不同檔案，無相依性）
- **[Story]**: 任務所屬的使用者故事（例如：US1, US2, US3）
- 包含確切的檔案路徑

## 路徑規範

**專案類型**: 單一 React 應用程式  
**路徑結構**:
- 原始碼: `src/`
- 測試: `tests/`
- 設定檔: 專案根目錄

---

## Phase 1: 專案設定（共享基礎設施）

**目的**: 專案初始化和基本結構建立

- [X] T001 使用 Vite 建立 React + TypeScript 專案 `npm create vite@latest baccarat-game -- --template react-ts`
- [X] T002 安裝核心相依套件：react, react-dom, framer-motion
- [X] T003 [P] 安裝開發工具：typescript, eslint, prettier, vitest, @testing-library/react, playwright
- [X] T004 [P] 配置 TypeScript (tsconfig.json) - 啟用 strict mode 及所有嚴格檢查
- [ ] T005 [P] 配置 ESLint (.eslintrc.json) - 禁止 any 類型
- [ ] T006 [P] 配置 Prettier (.prettierrc)
- [ ] T007 [P] 配置 Vitest (vitest.config.ts) - 設定覆蓋率目標 80%
- [ ] T008 [P] 設定 Playwright (playwright.config.ts) - E2E 測試配置
- [ ] T009 建立目錄結構：src/{components,hooks,services,types,utils,constants,styles}
- [ ] T010 建立測試目錄結構：tests/{unit,integration,e2e}
- [ ] T011 [P] 複製型別定義：將 specs/001-baccarat-game/contracts/types.ts 複製到 src/types/game.ts
- [ ] T012 [P] 設定 Git hooks (husky) - pre-commit 執行 lint + type-check + test
- [ ] T013 [P] 配置 package.json scripts：dev, build, test, lint, format, type-check

**檢查點**: ✅ 專案結構完成，開發環境就緒

---

## Phase 2: 基礎建設（阻塞性前置需求）

**目的**: 所有使用者故事都依賴的核心基礎設施

**⚠️ 關鍵**: 在此階段完成前，不能開始任何使用者故事的工作

### 常數與配置

- [ ] T014 [P] 定義遊戲常數 src/constants/gameConfig.ts（籌碼面額、牌靴配置、計時器設定）
- [ ] T015 [P] 定義賠率常數 src/constants/payoutRates.ts（閒家 1:1、莊家 1:0.95、和局 1:8）

### 工具函式（TDD）

- [ ] T016 [P] **測試**: 洗牌演算法測試 tests/unit/shuffle.test.ts - 驗證 Fisher-Yates 正確性和均勻分布
- [ ] T017 [P] **實作**: Fisher-Yates 洗牌演算法 src/utils/shuffle.ts
- [ ] T018 [P] **測試**: 牌面工具測試 tests/unit/cardUtils.test.ts - 驗證牌值計算、點數總和
- [ ] T019 [P] **實作**: 牌面工具函式 src/utils/cardUtils.ts（getCardValue, calculateScore）
- [ ] T020 [P] **測試**: 驗證函式測試 tests/unit/validators.test.ts - 驗證下注金額、籌碼面額、餘額檢查
- [ ] T021 [P] **實作**: 驗證函式 src/utils/validators.ts（validateBetAmount, validateBalance）

### 核心遊戲邏輯（TDD）

- [ ] T022 [P] **測試**: 百家樂規則測試 tests/unit/baccaratRules.test.ts - 所有補牌規則分支（目標覆蓋率 95%+）
- [ ] T023 **實作**: 百家樂補牌規則 src/services/baccaratRules.ts（shouldPlayerDraw, shouldBankerDraw）
- [ ] T024 [P] **測試**: 賠率計算測試 tests/unit/payoutCalculator.test.ts - 三種勝負結果、多區域下注
- [ ] T025 **實作**: 賠率計算器 src/services/payoutCalculator.ts（calculatePayout, calculateTotalPayout）
- [ ] T026 [P] **測試**: 牌靴管理測試 tests/unit/cardShoe.test.ts - 初始化、發牌、洗牌觸發
- [ ] T027 **實作**: 牌靴管理 src/services/cardShoe.ts（createShoe, dealCard, needsShuffle）

### 資料持久化（TDD）

- [ ] T028 [P] **測試**: localStorage 服務測試 tests/unit/storageService.test.ts - 讀寫、驗證、錯誤處理
- [ ] T029 **實作**: localStorage 服務 src/services/storageService.ts（loadBalance, saveBalance, loadHistory, saveHistory）

### 基礎 UI 元件

- [ ] T030 [P] **測試**: Button 元件測試 tests/unit/Button.test.tsx
- [ ] T031 [P] **實作**: Button 元件 src/components/ui/Button.tsx
- [ ] T032 [P] **測試**: Card 元件測試 tests/unit/Card.test.tsx
- [ ] T033 [P] **實作**: Card 撲克牌元件 src/components/ui/Card.tsx（支援翻牌動畫）
- [ ] T034 [P] **測試**: Chip 元件測試 tests/unit/Chip.test.tsx
- [ ] T035 [P] **實作**: Chip 籌碼元件 src/components/ui/Chip.tsx（支援選中狀態）

**檢查點**: ✅ 基礎設施完成 - 使用者故事實作現在可以並行開始

---

## Phase 3: 使用者故事 1 - 基本投注與遊戲流程 (優先級：P1) 🎯 MVP

**目標**: 玩家可以下注、觀看NPC自動發牌、補牌、判定勝負，並根據結果獲得獎勵或失去投注金額

**獨立測試**: 執行一局完整遊戲（選擇籌碼 → 下注 → 發牌 → 結算），驗證獎金計算正確性

### Custom Hooks（TDD）

- [ ] T036 [P] [US1] **測試**: useLocalStorage hook 測試 tests/unit/useLocalStorage.test.ts
- [ ] T037 [P] [US1] **實作**: useLocalStorage hook src/hooks/useLocalStorage.ts
- [ ] T038 [P] [US1] **測試**: useBalance hook 測試 tests/unit/useBalance.test.ts - 扣款、加款、重置、歸零處理
- [ ] T039 [P] [US1] **實作**: useBalance hook src/hooks/useBalance.ts
- [ ] T040 [P] [US1] **測試**: useBetting hook 測試 tests/unit/useBetting.test.ts - 單區域下注、餘額驗證
- [ ] T041 [P] [US1] **實作**: useBetting hook src/hooks/useBetting.ts
- [ ] T042 [US1] **測試**: useGameState hook 測試 tests/unit/useGameState.test.ts - 遊戲狀態機、階段轉換
- [ ] T043 [US1] **實作**: useGameState hook src/hooks/useGameState.ts（整合 useReducer）

### 遊戲引擎（TDD）

- [ ] T044 [US1] **測試**: 遊戲引擎測試 tests/unit/gameEngine.test.ts - 完整遊戲流程、勝負判定
- [ ] T045 [US1] **實作**: 遊戲引擎 src/services/gameEngine.ts（executeGameRound, determineOutcome）

### 遊戲元件（TDD）

- [ ] T046 [P] [US1] **測試**: BettingArea 元件測試 tests/unit/BettingArea.test.tsx
- [ ] T047 [P] [US1] **實作**: BettingArea 下注區域元件 src/components/game/BettingArea.tsx（莊/閒/和局）
- [ ] T048 [P] [US1] **測試**: ChipSelector 元件測試 tests/unit/ChipSelector.test.tsx
- [ ] T049 [P] [US1] **實作**: ChipSelector 籌碼選擇器 src/components/game/ChipSelector.tsx（10/50/100/500/1000）
- [ ] T050 [P] [US1] **測試**: CardHand 元件測試 tests/unit/CardHand.test.tsx
- [ ] T051 [P] [US1] **實作**: CardHand 手牌顯示元件 src/components/game/CardHand.tsx
- [ ] T052 [P] [US1] **測試**: BetTimer 元件測試 tests/unit/BetTimer.test.tsx
- [ ] T053 [P] [US1] **實作**: BetTimer 倒數計時器 src/components/game/BetTimer.tsx（15秒倒數）
- [ ] T054 [P] [US1] **測試**: ResultDisplay 元件測試 tests/unit/ResultDisplay.test.tsx
- [ ] T055 [P] [US1] **實作**: ResultDisplay 結果顯示元件 src/components/game/ResultDisplay.tsx

### 版面元件

- [ ] T056 [P] [US1] **測試**: BalanceDisplay 元件測試 tests/unit/BalanceDisplay.test.tsx
- [ ] T057 [P] [US1] **實作**: BalanceDisplay 餘額顯示元件 src/components/layout/BalanceDisplay.tsx
- [ ] T058 [P] [US1] **測試**: Header 元件測試 tests/unit/Header.test.tsx
- [ ] T059 [P] [US1] **實作**: Header 標題元件 src/components/layout/Header.tsx

### 主遊戲元件

- [ ] T060 [US1] **測試**: GameTable 元件測試 tests/integration/GameTable.test.tsx - 完整遊戲流程整合測試
- [ ] T061 [US1] **實作**: GameTable 主遊戲桌面 src/components/game/GameTable.tsx（整合所有子元件）
- [ ] T062 [US1] **實作**: App 主元件 src/App.tsx（載入 GameTable）

### E2E 測試

- [ ] T063 [US1] **E2E 測試**: 完整遊戲流程 tests/e2e/fullGame.spec.ts - 從進入遊戲到結算完成
- [ ] T064 [US1] **E2E 測試**: 下注功能 tests/e2e/betting.spec.ts - 單區域下注、餘額不足、計時器

**檢查點**: ✅ 使用者故事 1 完成，可獨立測試並部署為 MVP

---

## Phase 4: 使用者故事 2 - 多區域同時下注 (優先級：P2)

**目標**: 玩家可以在同一局對莊家、閒家、和局同時下注，系統分別計算各區域輸贏

**獨立測試**: 在三個區域各下注不同金額，驗證每個區域獨立結算正確性

### 邏輯增強（TDD）

- [ ] T065 [P] [US2] **測試**: 多區域下注測試 tests/unit/useBetting.test.ts - 擴充測試覆蓋多區域場景
- [ ] T066 [US2] **實作**: 擴充 useBetting hook src/hooks/useBetting.ts - 支援多區域同時下注
- [ ] T067 [P] [US2] **測試**: 多區域結算測試 tests/unit/payoutCalculator.test.ts - 複雜結算場景（和局時退還本金）
- [ ] T068 [US2] **實作**: 擴充 payoutCalculator src/services/payoutCalculator.ts - 多區域結算邏輯

### UI 增強

- [ ] T069 [US2] **測試**: BettingArea 多區域測試 tests/unit/BettingArea.test.tsx - 更新測試支援多區域
- [ ] T070 [US2] **實作**: 增強 BettingArea src/components/game/BettingArea.tsx - 顯示所有區域下注金額
- [ ] T071 [US2] **測試**: ResultDisplay 多區域測試 tests/unit/ResultDisplay.test.tsx
- [ ] T072 [US2] **實作**: 增強 ResultDisplay src/components/game/ResultDisplay.tsx - 顯示各區域輸贏詳情

### E2E 測試

- [ ] T073 [US2] **E2E 測試**: 多區域下注流程 tests/e2e/multiAreaBetting.spec.ts - 同時下注三個區域

**檢查點**: ✅ 使用者故事 2 完成，可獨立測試（基於 US1 基礎）

---

## Phase 5: 使用者故事 3 - 歷史紀錄與統計顯示 (優先級：P2)

**目標**: 玩家可以查看最近10局遊戲結果，包括莊閒勝負、牌面點數

**獨立測試**: 連續進行10局以上遊戲，驗證歷史紀錄正確顯示最近10局完整資訊

### 歷史紀錄邏輯（TDD）

- [ ] T074 [P] [US3] **測試**: 歷史紀錄管理測試 tests/unit/storageService.test.ts - 新增、限制10筆、FIFO
- [ ] T075 [US3] **實作**: 擴充 storageService src/services/storageService.ts - 歷史紀錄管理函式
- [ ] T076 [P] [US3] **測試**: useGameState 歷史測試 tests/unit/useGameState.test.ts - 結算後自動更新歷史
- [ ] T077 [US3] **實作**: 擴充 useGameState src/hooks/useGameState.ts - 整合歷史紀錄更新

### UI 元件（TDD）

- [ ] T078 [P] [US3] **測試**: GameHistory 元件測試 tests/unit/GameHistory.test.tsx
- [ ] T079 [P] [US3] **實作**: GameHistory 歷史紀錄元件 src/components/game/GameHistory.tsx（顯示最近10局）
- [ ] T080 [P] [US3] **測試**: GameHistoryDetail 元件測試 tests/unit/GameHistoryDetail.test.tsx
- [ ] T081 [P] [US3] **實作**: GameHistoryDetail 詳情元件 src/components/game/GameHistoryDetail.tsx（點擊顯示詳細牌面）

### 整合

- [ ] T082 [US3] **實作**: 整合 GameHistory 到 GameTable src/components/game/GameTable.tsx

### E2E 測試

- [ ] T083 [US3] **E2E 測試**: 歷史紀錄功能 tests/e2e/history.spec.ts - 連續多局、查看詳情、FIFO 驗證

**檢查點**: ✅ 使用者故事 3 完成，可獨立測試

---

## Phase 6: 使用者故事 4 - 遊戲動畫與視覺回饋 (優先級：P3)

**目標**: 提供流暢的發牌動畫、籌碼移動動畫、結果顯示動畫

**獨立測試**: 觀察遊戲流程中各階段動畫表現（發牌、籌碼移動、結果展示）

### 動畫系統（Framer Motion）

- [ ] T084 [P] [US4] 定義動畫變體 src/constants/animations.ts（發牌、翻牌、結果顯示）
- [ ] T085 [P] [US4] **實作**: 增強 Card 元件動畫 src/components/ui/Card.tsx - 使用 Framer Motion（發牌、翻牌）
- [ ] T086 [P] [US4] **實作**: 增強 Chip 元件動畫 src/components/ui/Chip.tsx - 籌碼移動動畫
- [ ] T087 [US4] **實作**: 增強 CardHand 元件 src/components/game/CardHand.tsx - 序列動畫（每張牌間隔0.5秒）
- [ ] T088 [US4] **實作**: 增強 ResultDisplay 元件 src/components/game/ResultDisplay.tsx - 結果淡入淡出動畫
- [ ] T089 [US4] **實作**: 增強 BalanceDisplay 元件 src/components/layout/BalanceDisplay.tsx - 數字跳動效果

### 效能優化

- [ ] T090 [US4] 使用 Chrome DevTools Performance profiler 驗證 60 FPS
- [ ] T091 [US4] 優化動畫效能：使用 will-change CSS 屬性

### E2E 測試

- [ ] T092 [US4] **E2E 測試**: 動畫視覺測試 tests/e2e/animations.spec.ts - 截圖比對、流暢度驗證

**檢查點**: ✅ 使用者故事 4 完成，視覺體驗達到 60 FPS

---

## Phase 7: 使用者故事 5 - 連續多局遊戲與牌靴機制 (優先級：P3)

**目標**: 使用8副牌靴，支援連續多局遊戲，剩餘牌數 < 52 時自動洗牌

**獨立測試**: 連續進行多局遊戲，觀察牌靴剩餘張數變化，驗證洗牌觸發時機

### 牌靴機制增強（TDD）

- [ ] T093 [P] [US5] **測試**: 持久化牌靴測試 tests/unit/cardShoe.test.ts - 連續多局、洗牌觸發、狀態持久化
- [ ] T094 [US5] **實作**: 擴充 cardShoe src/services/cardShoe.ts - 持久化當前牌靴狀態、洗牌動畫觸發
- [ ] T095 [P] [US5] **測試**: 牌靴狀態儲存測試 tests/unit/storageService.test.ts
- [ ] T096 [US5] **實作**: 擴充 storageService src/services/storageService.ts - 儲存/載入牌靴狀態
- [ ] T097 [P] [US5] **測試**: useGameState 牌靴測試 tests/unit/useGameState.test.ts
- [ ] T098 [US5] **實作**: 擴充 useGameState src/hooks/useGameState.ts - 整合牌靴持久化

### UI 增強

- [ ] T099 [P] [US5] **測試**: ShoeIndicator 元件測試 tests/unit/ShoeIndicator.test.tsx
- [ ] T100 [P] [US5] **實作**: ShoeIndicator 牌靴指示器 src/components/game/ShoeIndicator.tsx（顯示剩餘牌數、洗牌提示）
- [ ] T101 [US5] **實作**: 整合 ShoeIndicator 到 GameTable src/components/game/GameTable.tsx

### E2E 測試

- [ ] T102 [US5] **E2E 測試**: 牌靴機制測試 tests/e2e/shoe.spec.ts - 連續50局、洗牌觸發驗證

**檢查點**: ✅ 使用者故事 5 完成，牌靴機制完整運作

---

## Phase 8: 打磨與跨領域關注

**目的**: 最終優化、文檔、部署準備

### 樣式與視覺

- [ ] T103 [P] 建立全域樣式 src/styles/global.css（顏色系統、字體、間距）
- [ ] T104 [P] 建立動畫樣式 src/styles/animations.css
- [ ] T105 響應式設計優化（確保 1024x768+ 解析度支援）

### 錯誤處理與日誌

- [ ] T106 [P] 實作全域錯誤邊界 src/components/ErrorBoundary.tsx
- [ ] T107 [P] 增強錯誤處理：所有 try-catch 區塊提供友善訊息

### 測試覆蓋率達標

- [ ] T108 執行 `npm run test:coverage` 驗證整體覆蓋率 ≥ 80%
- [ ] T109 執行 `npm run test:coverage` 驗證遊戲邏輯覆蓋率 ≥ 95%
- [ ] T110 補充缺失的測試案例直到達標

### 效能優化

- [ ] T111 實作 code splitting（使用 React.lazy）
- [ ] T112 執行 Vite build 驗證 bundle 大小 < 200KB gzipped
- [ ] T113 使用 Lighthouse 驗證效能指標（FCP < 1.5s, LCP < 2.5s, FID < 100ms）

### 無障礙性

- [ ] T114 [P] 新增鍵盤導航支援（Tab, Enter, Escape）
- [ ] T115 [P] 新增 ARIA 標籤到互動元件
- [ ] T116 使用 axe-core 執行無障礙性掃描

### 文檔

- [ ] T117 [P] 撰寫 README.md（專案說明、安裝步驟、執行指令）
- [ ] T118 [P] 撰寫 CONTRIBUTING.md（貢獻指南、程式碼規範）
- [ ] T119 [P] 確保所有公開 API 都有 JSDoc 註解

### CI/CD

- [ ] T120 設定 GitHub Actions workflow (.github/workflows/ci.yml) - lint + test + build
- [ ] T121 設定部署到 Vercel 或 Netlify
- [ ] T122 設定 Playwright CI 環境

### 最終驗證

- [ ] T123 完整 E2E 測試執行（所有使用者故事）
- [ ] T124 跨瀏覽器測試（Chrome, Firefox, Safari）
- [ ] T125 效能測試：確認無記憶體洩漏（連續100局測試）

**檢查點**: ✅ 專案就緒，可進入生產環境

---

## 相依性與執行順序

### 使用者故事完成順序

```
Phase 1 (Setup) → Phase 2 (Foundational)
                          ↓
                    Phase 3 (US1 - P1) 🎯 MVP
                          ↓
                 ┌────────┴────────┐
                 ↓                 ↓
         Phase 4 (US2 - P2)  Phase 5 (US3 - P2)
                 ↓                 ↓
                 └────────┬────────┘
                          ↓
                 ┌────────┴────────┐
                 ↓                 ↓
         Phase 6 (US4 - P3)  Phase 7 (US5 - P3)
                 ↓                 ↓
                 └────────┬────────┘
                          ↓
                    Phase 8 (Polish)
```

### 並行執行機會

**Phase 2 完成後，可並行執行**:
- T036-T059（US1 的 hooks 和元件可並行開發）

**Phase 3 完成後，可並行執行**:
- Phase 4 (US2) 和 Phase 5 (US3) - 無相依性
- Phase 6 (US4) 和 Phase 7 (US5) - 無相依性

**Phase 8 內部可並行**:
- T103-T107（樣式、錯誤處理）
- T114-T116（無障礙性）
- T117-T119（文檔）

---

## 實作策略

### MVP 範圍（最小可行產品）

**僅實作 Phase 1 + Phase 2 + Phase 3 (US1)**

這將提供：
- ✅ 完整的一局遊戲流程
- ✅ 下注、發牌、補牌、結算
- ✅ 正確的賠率計算
- ✅ 餘額管理
- ✅ 基本視覺回饋

**預估時間**: 5-7 天

### 漸進式交付

1. **Sprint 1** (5-7 天): Phase 1 + 2 + 3 → MVP 可部署
2. **Sprint 2** (3-4 天): Phase 4 + 5 → 多區域下注 + 歷史紀錄
3. **Sprint 3** (3-4 天): Phase 6 + 7 → 動畫 + 牌靴機制
4. **Sprint 4** (2-3 天): Phase 8 → 打磨與優化

**總預估**: 13-18 天（單人全職開發）

---

## 任務統計

**總任務數**: 125 個任務
- Phase 1 (Setup): 13 個任務
- Phase 2 (Foundational): 22 個任務
- Phase 3 (US1 - MVP): 29 個任務
- Phase 4 (US2): 9 個任務
- Phase 5 (US3): 10 個任務
- Phase 6 (US4): 9 個任務
- Phase 7 (US5): 10 個任務
- Phase 8 (Polish): 23 個任務

**測試任務比例**: 約 50% （TDD 原則）
**並行機會**: 60+ 個任務標記為 [P]
**獨立測試點**: 5 個使用者故事各自獨立可測試

---

## 驗收標準

### 每個使用者故事的獨立測試標準

**US1**: 執行一局完整遊戲，從下注到結算，驗證獎金計算 ✅

**US2**: 在三個區域下注不同金額，驗證每個區域獨立結算 ✅

**US3**: 連續10局以上，驗證歷史紀錄顯示正確 ✅

**US4**: 觀察動畫流暢度，使用 Performance profiler 驗證 60 FPS ✅

**US5**: 連續50局，驗證牌靴洗牌觸發時機正確 ✅

### 整體品質標準

- ✅ 測試覆蓋率：整體 ≥ 80%，遊戲邏輯 ≥ 95%
- ✅ 效能：FCP < 1.5s, LCP < 2.5s, FID < 100ms, 60 FPS 動畫
- ✅ Bundle 大小：< 200KB gzipped
- ✅ 無障礙性：基本鍵盤導航、ARIA 標籤
- ✅ 跨瀏覽器：Chrome, Firefox, Safari 通過 E2E 測試
- ✅ TypeScript：strict mode，無 any 類型
- ✅ 程式碼品質：通過 ESLint 和 Prettier 檢查

---

**任務清單完成日期**: 2025-10-25  
**下一步**: 開始執行 Phase 1 (Setup)，遵循 TDD 工作流程
