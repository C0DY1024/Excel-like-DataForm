import { getColLabel, getCellAddress } from "./utils.js";
import { DataTable } from "./DataTable.js";

export class Renderer {
  constructor(container, dataTable) {
    this.container = container;
    this.table = dataTable;
    this.rowHeight = 40;

    //初始化
    this.container.innerHTML = `
  <div id="viewport" class="w-full h-screen overflow-auto relative border border-gray-400">
    <!-- 標題列：移除 left-0，只保留 top-0 -->
    <div id="header-row" class="sticky top-0 flex flex-row bg-gray-100 z-20 w-max">
      <!-- 左上角格子：必須設為 sticky left-0 並給更高 z-index，才能在雙向捲動時都擋住內容 -->
      <div class="w-[40px] h-[40px] flex-shrink-0 border border-gray-300 bg-gray-200 sticky left-0 z-30"></div>
      
      ${Array.from({ length: 50 })
        .map(
          (_, i) => `
          <div class="w-[100px] h-[40px] flex-shrink-0 border border-gray-300 text-center font-bold flex items-center justify-center text-sm bg-gray-100">
            ${getColLabel(i)}
          </div>
        `,
        )
        .join("")}
    </div>

    <div id="phantom" class="absolute left-0 top-0 z-[-1]"></div>
    <div id="content" class="absolute left-0 top-0"></div>
  </div>
`;

    ///獲取 DOM 節點
    this.editor = document.getElementById("excel-editor");
    this.editorWrapper = document.getElementById("editor-wrapper");
    this.viewport = this.container.querySelector("#viewport");
    this.content = this.container.querySelector("#content");
    this.phantom = this.container.querySelector("#phantom");

    //////設定 style
    const totalWidth = 50 * 100 + 40;
    const totalHeight = this.table.data.length * this.rowHeight;

    this.phantom.style.width = `${totalWidth}px`;
    this.phantom.style.height = `${totalHeight}px`;

    //綁定事件並觸發
    this.viewport.addEventListener("scroll", () => this.render());
    this.render();
  }

  render() {
    const startIndex = Math.floor(this.viewport.scrollTop / this.rowHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(this.viewport.clientHeight / this.rowHeight) + 1,
      this.table.data.length,
    );

    this.content.innerHTML = "";
    for (let i = startIndex; i < endIndex; i++) {
      this.content.appendChild(this.createRow(i));
    }

    //加上40偏移量避免被擋
    const yOffset = startIndex * this.rowHeight + 40;
    this.content.style.transform = `translateY(${yOffset}px)`;
  }
  createRow(rowIndex) {
    const tr = document.createElement("div");
    // 移除 w-full，讓它由內容撐開
    tr.className = "flex flex-row h-[40px]";
    const rowHeader = document.createElement("div");
    // 加入 sticky left-0，讓序號欄固定
    rowHeader.className =
      "w-[40px] h-[40px] flex-shrink-0 flex items-center justify-center bg-gray-100 border border-gray-300 text-sm font-bold sticky left-0 z-10";
    rowHeader.textContent = rowIndex + 1;
    tr.appendChild(rowHeader);

    this.table.data[rowIndex].forEach((cellData, colIndex) => {
      const td = document.createElement("div");
      // 加入 cell-content 類別
      td.className =
        "w-[100px] h-[40px] flex-shrink-0 border border-gray-300 px-2 flex items-center text-sm cell-content";

      td.dataset.row = rowIndex;
      td.dataset.col = colIndex;
      td.textContent = cellData;

      if (
        this.table.cursor.row === rowIndex &&
        this.table.cursor.col === colIndex
      ) {
        td.classList.add("border-2", "border-blue-500", "bg-blue-50");
      }
      tr.appendChild(td);
    });

    return tr;
  }

  getCell(row, col) {
    return this.content.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  }

  exitEditing() {
    if (!this.editor) return;
    this.table.saveCell(
      this.table.cursor.row,
      this.table.cursor.col,
      this.editor.value,
    );

    this.table.setMode(DataTable.MODES.ACTIVE);
    this.editor.classList.remove("active");
    this.editorWrapper.classList.remove("active");
    this.editor.value = "";
  }

  showEditor(row, col) {
    if (!this.editorWrapper) return;

    this.ensureVisible(row, col);
    this.render();

    setTimeout(() => {
      const cell = this.getCell(row, col);
      if (!cell) return;

      const rect = cell.getBoundingClientRect();

      this.editorWrapper.style.top = rect.top + "px";
      this.editorWrapper.style.left = rect.left + "px";
      this.editorWrapper.style.width = rect.width + "px";
      this.editorWrapper.style.height = rect.height + "px";

      if (this.editor.value !== this.table.data[row][col]) {
        this.editor.value = this.table.data[row][col] || "";
      }

      this.editorWrapper.classList.add("active");
      this.editor.focus();

      document.getElementById("editor-label").textContent =
        `${getCellAddress(row, col)}`;
    }, 10);
  }

  ensureVisible(row, col) {
    const rowHeight = this.rowHeight;
    const colWidth = 100; //格子寬度
    const rowHeaderWidth = 40; ///左側欄寬度

    ////垂直方向檢查
    const top = row * rowHeight + 40; //+40避開頂部標題
    const viewportTop = this.viewport.scrollTop;
    const viewportHeight = this.viewport.clientHeight;
    const headerHeight = 40;

    if (top < viewportTop + headerHeight) {
      this.viewport.scrollTop = top - headerHeight;
    } else if (top + rowHeight > viewportTop + viewportHeight) {
      this.viewport.scrollTop = top + rowHeight - viewportHeight;
    }

    ///水平方向檢查
    const left = col * colWidth + rowHeaderWidth;
    const viewportLeft = this.viewport.scrollLeft;
    const viewportWidth = this.viewport.clientWidth;

    if (left < viewportLeft + rowHeaderWidth) {
      this.viewport.scrollLeft = left - rowHeaderWidth;
    } else if (left + colWidth > viewportLeft + viewportWidth) {
      this.viewport.scrollLeft = left + colWidth - viewportWidth;
    }
  }
}
