一個運用原生JavaScript實作的互動式表格元件，具備類似 Excel 的操作體驗，包括鍵盤導航、編輯模式切換與資料儲存機制。

## 專案亮點
* **零框架依賴**：100% 原生 JavaScript，不使用 React/Vue。
- **高效渲染**：利用 `DocumentFragment` 減少瀏覽器重繪次數。
- **狀態驅動**：實作簡單的有限狀態機 (FSM) 管理編輯與選取模式。
- **流暢導航**：完整的鍵盤操作支持（方向鍵、Enter、Esc）。

---

## 技術細節

### 核心架構
我將 UI 與數據分離，透過一個 `DataTable` 類別來管理：
- **State**: 追蹤當前游標位置 (`cursor`) 與模式 (`mode`)。
- **Event Delegation**: 在父容器綁定事件，處理 1500 個單元格的互動。

## 未來擴充方向:
- 格子內容超出時隱藏(保持所有格子的大小一致)
- Undo / Redo 機制
- 複製 / 貼上功能
- 公式計算（如 =A1+B1）
- 多選操作
- React 版本重構

## 透過RENDER部屬:
- https://excel-like-dataform.onrender.com
