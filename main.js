//Default Data表格///
const ROWS = 30;
const COLS = 50;
const data = Array.from({ length: ROWS }, () =>
  Array.from({ length: COLS }, () => ""),
);
// console.log(data);
const MODE = {
  ACTIVE: "active",
  EDITING: "editing",
};
export class DataTable {
  constructor(container, data) {
    this.container = container;
    this.data = data;
    this.cells = [];
    this.state = {
      cursor: { row: 0, col: 0 },
      activeCell: { row: 0, col: 0 },
      mode: MODE.ACTIVE,
    };
  }

  init() {
    this.renderTable();
    this.bindEvents();
    const { row, col } = this.state.cursor;
    this.moveTo(row, col);
  }

  ///綁定事件
  bindEvents() {
    const editor = document.getElementById("excel-editor");
    this.container.addEventListener("click", () => editor.focus());
    editor.addEventListener("input", (e) => {
      if (editor.value.length > 0) {
        this.switchMode(MODE.EDITING);
        const { row, col } = this.state.cursor;
        const td = this.getCell(row, col);
        if (td) {
          this.showEditer(td);
          td.textContent = editor.value;
        }
      }
    });

    // 按下 Enter 完成輸入
    editor.addEventListener("keydown", (e) => {
      const { row, col } = this.state.cursor;
      const td = this.getCell(row, col);
      if (e.key === "Enter") {
        if (this.state.mode === MODE.ACTIVE) {
          this.switchMode(MODE.EDITING);
          this.showEditer(td);

          return;
        }
        if (this.state.mode === MODE.EDITING) {
          this.saveCell(row, col);
          editor.value = "";
          editor.classList.remove("active");
          this.moveTo(row + 1, col);
          editor.focus();
          return;
        }
      }
      if (e.key.startsWith("Arrow")) {
        if (this.state.mode === MODE.ACTIVE)
          switch (e.key) {
            case "ArrowUp":
              this.moveTo(row - 1, col);
              break;
            case "ArrowDown":
              this.moveTo(row + 1, col);
              break;
            case "ArrowLeft":
              this.moveTo(row, col - 1);
              break;
            case "ArrowRight":
              this.moveTo(row, col + 1);

              break;
            default:
              break;
          }
      }
      if (e.key === "Escape") {
        td.textContent = this.data[row][col];
        editor.value = "";
        editor.classList.remove("active");
        editor.focus();
        return;
      }
    });

    //////點擊
    this.container.addEventListener("click", (event) => {
      const td = event.target.closest("td");
      if (!td) return;
      const row = parseInt(td.dataset.row);
      const col = parseInt(td.dataset.col);
      const { row: oldRow, col: oldCol } = this.state.cursor;
      ///點同意格進入編輯
      if (oldRow === row && oldCol === col) {
        this.switchMode(MODE.EDITING);
        this.showEditer(td);

        return;
      }
      if (this.state.mode === MODE.EDITING) {
        this.switchMode(MODE.ACTIVE);
        this.saveCell(oldRow, oldCol); // 儲存資料
        editor.value = "";
        editor.classList.remove("active");
        this.moveTo(row, col);
        editor.focus();
        return;
      }
      this.moveTo(row, col);
      setTimeout(() => editor.focus(), 0);
    });
  }
  ///切換模式
  switchMode(nextMode) {
    const { row, col } = this.state.cursor;
    if (nextMode === MODE.EDITING) {
      this.state.mode = MODE.EDITING;
    } else if (nextMode === MODE.ACTIVE) {
      if (this.state.mode === MODE.EDITING) {
        this.saveCell(row, col);
      }
      this.state.mode = MODE.ACTIVE;
    }
  }
  ///找到格子(dom)
  getCell(row, col) {
    return this.cells?.[row]?.[col] || null;
  }
  ///儲存格子內容
  saveCell(row, col) {
    const td = this.getCell(row, col);
    if (td) {
      this.data[row][col] = td.textContent;
      console.log(this.data);
    }
  }
  showEditer(td) {
    const editor = document.getElementById("excel-editor");
    const rect = td.getBoundingClientRect();
    editor.classList.add("active");
    editor.style.top = rect.top + "px";
    editor.style.left = rect.left + "px";
    editor.style.width = rect.width + "px";
    editor.style.height = rect.height + "px";
    editor.focus();
  }
  //渲染被選取的格子
  renderActive(row, col) {
    const td = this.getCell(row, col);
    if (!td) return;
    td.classList.add("activeCell");
    this.state.cursor = { row, col };
  }
  ///清除格子的css
  clearStyle(row, col) {
    const td = this.getCell(row, col);
    if (!td) return;
    td.classList.remove("activeCell");
  }
  ////移動游標至格子
  // moveCursor(row, col) {
  //   const td = this.getCell(row, col);
  //   const range = document.createRange();
  //   const selection = window.getSelection();
  //   range.selectNodeContents(td);
  //   range.collapse(false);
  //   selection.removeAllRanges();
  //   selection.addRange(range);
  // }

  ///重新定位格子
  moveTo(row, col) {
    const maxRow = this.data.length;
    const maxCol = this.data[0].length;
    if (!isWithinRange(row, col, maxRow, maxCol)) return;
    const { row: oldRow, col: oldCol } = this.state.cursor;
    if (this.state.mode === MODE.EDITING) {
      this.switchMode(MODE.ACTIVE);
    }
    this.clearStyle(oldRow, oldCol);
    this.state.cursor = { row, col };
    this.renderActive(row, col);
  }
  ///渲染表格
  renderTable() {
    this.container.innerHTML = "";
    const table = document.createElement("table");

    table.className =
      "border-collapse table-fixed select-none text-sm min-w-max";

    const fragment = document.createDocumentFragment();
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");

    const cornerTh = document.createElement("th");
    cornerTh.className = "border border-gray-300 bg-gray-100 w-12 h-10";
    headRow.appendChild(cornerTh);

    for (let col = 0; col < this.data[0].length; col++) {
      const th = document.createElement("th");
      th.className =
        "border border-gray-300 bg-gray-100 font-normal text-center w-[100px] h-10";
      th.textContent = getColLabel(col);
      headRow.appendChild(th);
    }
    thead.appendChild(headRow);
    table.appendChild(thead);

    this.data.forEach((dataRows, i) => {
      const tr = document.createElement("tr");
      const rowHeader = document.createElement("th");
      rowHeader.textContent = i + 1;
      rowHeader.className =
        "border border-gray-300 bg-gray-100 font-normal text-center w-12 h-10";
      tr.appendChild(rowHeader);

      dataRows.forEach((cellData, j) => {
        const td = document.createElement("td");
        if (!this.cells[i]) this.cells[i] = [];
        this.cells[i][j] = td;
        td.className =
          "border border-gray-300 px-2 w-[100px] h-10 focus:outline-none overflow-hidden whitespace-nowrap";
        td.dataset.row = i;
        td.dataset.col = j;
        td.textContent = cellData;
        tr.appendChild(td);
      });
      fragment.appendChild(tr);
    });
    table.appendChild(fragment);
    this.container.appendChild(table);
  }
}
///是否超出邊界
export function isWithinRange(row, col, maxRow, maxCol) {
  return row >= 0 && row < maxRow && col >= 0 && col < maxCol;
}
////標籤欄位命名
export function getColLabel(col) {
  let label = "";
  col += 1;
  while (col > 0) {
    col--;
    label = String.fromCharCode(65 + (col % 26)) + label;
    col = Math.floor(col / 26);
  }
  return label;
}

if (typeof document !== "undefined") {
  const app = document.getElementById("app");
  const dataTable = new DataTable(app, data);
  dataTable.init();
  const readme = document.getElementById("readme-overlay");
  const closeBtn = document.getElementById("close-readme");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      readme.classList.add("hidden");
      dataTable.moveTo(0, 0);
      const editor = document.getElementById("excel-editor");
      if (editor) editor.focus();
    });
  }
  readme.addEventListener("click", (e) => {
    if (e.target === readme) {
      readme.classList.add("hidden");
      dataTable.moveTo(0, 0);
    }
  });
}
