# 快速開始指南：百家樂遊戲

**專案**: 百家樂遊戲  
**日期**: 2025-10-25  
**目的**: 提供開發人員快速啟動專案的指引

## 前置需求

### 必要工具
- **Node.js**: v18.0.0 或更新版本
- **npm**: v9.0.0 或更新版本
- **Git**: 用於版本控制
- **現代瀏覽器**: Chrome 90+, Firefox 88+, 或 Safari 14+

### 建議工具
- **VS Code**: 推薦的編輯器
- **VS Code 擴充套件**:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - Error Lens

---

## 專案初始化

### 1. 建立專案

```bash
# 使用 Vite 建立 React + TypeScript 專案
npm create vite@latest baccarat-game -- --template react-ts

# 進入專案目錄
cd baccarat-game

# 安裝相依套件
npm install
```

### 2. 安裝額外套件

```bash
# 安裝動畫庫
npm install framer-motion

# 安裝開發工具
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install -D eslint eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks
npm install -D prettier
npm install -D @vitest/ui vitest
npm install -D @testing-library/react @testing-library/user-event @testing-library/jest-dom
npm install -D playwright @playwright/test
```

---

## 配置檔案設定

### TypeScript 配置 (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    
    /* Strict Mode (憲法要求) */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    
    /* Path Aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@services/*": ["./src/services/*"],
      "@types/*": ["./src/types/*"],
      "@utils/*": ["./src/utils/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### ESLint 配置 (.eslintrc.json)

```json
{
  "env": {
    "browser": true,
    "es2020": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "plugins": ["react", "@typescript-eslint"],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

### Prettier 配置 (.prettierrc)

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### Vitest 配置 (vitest.config.ts)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@services': path.resolve(__dirname, './src/services'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
});
```

### Package.json 腳本

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css}\"",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "prepare": "husky install"
  }
}
```

---

## 開發流程

### 日常開發

```bash
# 啟動開發伺服器
npm run dev

# 在另一個終端機執行測試（監視模式）
npm run test

# 執行 linter
npm run lint

# 格式化程式碼
npm run format
```

### 測試工作流

```bash
# 執行所有測試
npm run test

# 執行測試並產生覆蓋率報告
npm run test:coverage

# 開啟測試 UI（視覺化測試結果）
npm run test:ui

# 執行 E2E 測試
npm run test:e2e
```

### 建置流程

```bash
# 型別檢查
npm run type-check

# Lint 檢查
npm run lint

# 執行測試
npm run test -- --run

# 建置生產版本
npm run build

# 預覽建置結果
npm run preview
```

---

## 專案結構建立

### 建立基本目錄結構

```bash
# 在 src 目錄下建立所需資料夾
mkdir -p src/components/ui
mkdir -p src/components/game
mkdir -p src/components/layout
mkdir -p src/hooks
mkdir -p src/services
mkdir -p src/types
mkdir -p src/utils
mkdir -p src/constants
mkdir -p src/styles
mkdir -p tests/unit
mkdir -p tests/integration
mkdir -p tests/e2e
```

### 複製型別定義

```bash
# 將 contracts/types.ts 複製到 src/types/
cp specs/001-baccarat-game/contracts/types.ts src/types/game.ts
```

---

## TDD 工作流程範例

### 步驟 1: 撰寫測試

**tests/unit/baccaratRules.test.ts**
```typescript
import { describe, it, expect } from 'vitest';
import { shouldPlayerDraw, calculateScore } from '@services/baccaratRules';

describe('Baccarat Rules', () => {
  describe('calculateScore', () => {
    it('should calculate score correctly for simple cards', () => {
      const cards = [
        { suit: 'hearts', rank: '5' },
        { suit: 'diamonds', rank: '3' },
      ];
      expect(calculateScore(cards)).toBe(8);
    });

    it('should return ones digit for scores over 10', () => {
      const cards = [
        { suit: 'hearts', rank: '9' },
        { suit: 'diamonds', rank: '7' },
      ];
      expect(calculateScore(cards)).toBe(6); // 16 % 10 = 6
    });
  });

  describe('shouldPlayerDraw', () => {
    it('should return true for score 0-5', () => {
      expect(shouldPlayerDraw(5)).toBe(true);
      expect(shouldPlayerDraw(0)).toBe(true);
    });

    it('should return false for score 6-7', () => {
      expect(shouldPlayerDraw(6)).toBe(false);
      expect(shouldPlayerDraw(7)).toBe(false);
    });

    it('should return false for natural 8-9', () => {
      expect(shouldPlayerDraw(8)).toBe(false);
      expect(shouldPlayerDraw(9)).toBe(false);
    });
  });
});
```

### 步驟 2: 執行測試（應失敗）

```bash
npm run test
# ❌ 測試失敗 - 函式尚未實作
```

### 步驟 3: 實作功能

**src/services/baccaratRules.ts**
```typescript
import type { Card, Hand } from '@types/game';

export function calculateScore(cards: Card[]): number {
  const total = cards.reduce((sum, card) => sum + getCardValue(card), 0);
  return total % 10;
}

export function getCardValue(card: Card): number {
  if (card.rank === 'A') return 1;
  if (['J', 'Q', 'K'].includes(card.rank)) return 0;
  if (card.rank === '10') return 0;
  return parseInt(card.rank, 10);
}

export function shouldPlayerDraw(score: number): boolean {
  return score >= 0 && score <= 5;
}
```

### 步驟 4: 重新執行測試（應通過）

```bash
npm run test
# ✅ 所有測試通過
```

### 步驟 5: 重構（保持測試通過）

重構程式碼以提升可讀性，確保測試仍然通過。

---

## Git 工作流程

### Pre-commit Hook 設定

安裝 husky:
```bash
npm install -D husky lint-staged
npx husky install
```

**. husky/pre-commit**
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint
npm run type-check
npm run test -- --run
```

**.lintstagedrc.json**
```json
{
  "*.{ts,tsx}": [
    "eslint --fix",
    "prettier --write"
  ],
  "*.{css,md}": [
    "prettier --write"
  ]
}
```

### Commit 規範

遵循 Conventional Commits:

```bash
# 功能
git commit -m "feat: add card dealing animation"

# 修復
git commit -m "fix: correct payout calculation for tie"

# 文檔
git commit -m "docs: update quickstart guide"

# 測試
git commit -m "test: add tests for banker draw rules"

# 重構
git commit -m "refactor: simplify shuffle algorithm"
```

---

## 常見問題

### Q: 如何啟動開發環境？
```bash
npm run dev
```
瀏覽器開啟 http://localhost:5173

### Q: 如何清除 localStorage？
在瀏覽器開發者工具 Console 執行:
```javascript
localStorage.clear()
```

### Q: 如何除錯測試？
```bash
# 使用 UI 模式
npm run test:ui

# 或在測試中加入 console.log
```

### Q: 如何查看測試覆蓋率？
```bash
npm run test:coverage
# 開啟 coverage/index.html 查看報告
```

---

## 下一步

1. ✅ 完成專案初始化
2. ✅ 設定開發環境
3. ⏭ 開始實作核心邏輯（從 `baccaratRules.ts` 開始，遵循 TDD）
4. ⏭ 建立 React 元件
5. ⏭ 整合動畫
6. ⏭ E2E 測試
7. ⏭ 效能優化

---

## 參考資源

- **React 官方文檔**: https://react.dev/
- **TypeScript 手冊**: https://www.typescriptlang.org/docs/
- **Vite 指南**: https://vitejs.dev/guide/
- **Vitest 文檔**: https://vitest.dev/
- **Framer Motion**: https://www.framer.com/motion/
- **React Testing Library**: https://testing-library.com/react

---

**準備就緒！開始編碼 🚀**
