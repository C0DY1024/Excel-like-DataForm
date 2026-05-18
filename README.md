一個運用原生JavaScript實作的互動式表格元件，具備類似 Excel 的操作體驗，包括鍵盤導航、編輯模式切換與資料儲存機制。

## 專案亮點
* **零框架依賴**：100% 原生 JavaScript，不使用 React/Vue。
- **高效渲染**：利用虛擬滾動技術，監聽scroll事件即時計算可視區域。
- **狀態驅動**：實作簡單的有限狀態機 (FSM) 管理編輯與選取模式。
- **流暢導航**：完整的鍵盤操作支持(方向鍵焦點移動、Enter進入/儲存編輯、Escape放棄修改並還原舊值等)

---

## 技術細節

### 專案架構
├── index.html          # 精簡的入口 HTML，維護分離的 Editor 獨立圖層
├── main.js             # 應用程式進入點，負責全域事件綁定與生命週期協調
├── DataTable.js        # 核心邏輯、資料狀態維護、狀態機定義
├── Renderer.js         # 虛擬滾動計算、動態 DOM 生成、浮動編輯器定位
└── utils.js            # 工具函數（邊界檢查、Excel 欄位英文字母轉換演算法）

## 未來擴充方向:
- Undo / Redo 機制
- 複製 / 貼上功能
- 公式計算（如 =A1+B1）
- 多選操作
- React 版本重構

## 透過RENDER部屬:
- https://excel-like-dataform.onrender.com
