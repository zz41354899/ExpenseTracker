# 記帳小工具 💰

一個使用 React 和 Tailwind CSS 建立的簡單記帳工具，可以讓您輕鬆記錄日常支出。

## 功能特色

- ✅ 新增支出項目（名稱與金額）
- ✅ 顯示所有記帳項目清單
- ✅ 刪除特定記帳項目
- ✅ 使用 localStorage 永久儲存資料
- ✅ 響應式設計，支援各種裝置
- ✅ 簡潔美觀的使用者介面
- ✅ 即時計算總支出金額

## 安裝與執行

### 安裝依賴
```bash
npm install
```

### 開發模式
```bash
npm run dev
```

### 建置生產版本
```bash
npm run build
```

### 預覽生產版本
```bash
npm run preview
```

## 元件使用方式

您可以將 `ExpenseTracker` 元件直接匯入到其他 React 專案中使用：

```jsx
import ExpenseTracker from './ExpenseTracker';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <ExpenseTracker />
      </div>
    </div>
  );
}
```

## 技術規格

- **React**: ^18.2.0
- **Tailwind CSS**: ^3.3.0
- **Vite**: ^4.4.5
- **資料儲存**: localStorage

## 專案結構

```
ExpenseTracker/
├── index.html              # HTML 模板
├── main.jsx                # React 應用程式入口點
├── ExpenseTracker.jsx      # 主要記帳元件
├── index.css               # 樣式文件
├── package.json            # 專案依賴與設定
├── vite.config.js          # Vite 配置
├── tailwind.config.js      # Tailwind CSS 配置
├── postcss.config.js       # PostCSS 配置
└── README.md               # 說明文件
```

## 瀏覽器支援

支援所有現代瀏覽器，包括：
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 授權

MIT License 