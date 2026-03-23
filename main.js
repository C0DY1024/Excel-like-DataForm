const app = document.getElementById("app");

//Default Data表格///
const ROWS = 30;
const COLS = 50;
const data = Array.from({ length: ROWS }, () =>
  Array.from({ length: COLS }, () => ""),
);
console.log(data);
const MODE = {
  ACTIVE: "active",
  EDITING: "editing",
};
class DataTable {
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
    this.container.addEventListener("mousedown", (event) => {
      const td = event.target.closest("td");
      if (!td) return;
      event.preventDefault();
      const row = parseInt(td.dataset.row);
      const col = parseInt(td.dataset.col);
      if (this.state.mode === MODE.EDITING) {
        this.moveTo(row, col);
        return;
      }

      if (this.state.mode === MODE.ACTIVE) {
        if (this.state.cursor.row === row && this.state.cursor.col === col) {
          this.switchMode(MODE.EDITING);
        } else {
          this.moveTo(row, col);
        }
      }
    });

    this.container.addEventListener("keydown", (event) => {
      const { mode } = this.state;
      if (event.key === "Enter") {
        event.preventDefault();
        if (mode === MODE.ACTIVE) {
          this.switchMode(MODE.EDITING);
        } else if (mode === MODE.EDITING) {
          this.switchMode(MODE.ACTIVE);
          let { row, col } = this.state.cursor;
          this.moveTo(row + 1, col);
        }
        return;
      }
      ///上下左右控制
      if (event.key.startsWith("Arrow")) {
        if (this.state.mode === MODE.EDITING) return;
        let { row, col } = this.state.cursor;
        event.preventDefault();

        if (event.key === "ArrowUp") row--;
        if (event.key === "ArrowDown") row++;
        if (event.key === "ArrowRight") col++;
        if (event.key === "ArrowLeft") col--;
        this.moveTo(row, col);
      }
      ///輸入直接進編輯
      if (mode === MODE.ACTIVE && event.key.length === 1) {
        const { row, col } = this.state.cursor;
        const td = this.getCell(row, col);

        this.switchMode(MODE.EDITING);
        td.textContent = event.key;
        this.moveCursor(row, col);

        event.preventDefault();
        return;
      }
      ///esc跳出編輯
      if (event.key === "Escape" && mode === MODE.EDITING) {
        const { row, col } = this.state.cursor;
        const td = this.getCell(row, col);
        td.textContent = this.data[row][col];
        this.switchMode(MODE.ACTIVE);
        return;
      }
    });
  }
  ///切換模式
  switchMode(nextMode) {
    const { row, col } = this.state.cursor;
    const td = this.getCell(row, col);
    if (!td) return;

    if (nextMode === MODE.EDITING) {
      this.state.mode = MODE.EDITING;
      this.renderEditing(row, col);
    } else if (nextMode === MODE.ACTIVE) {
      if (this.state.mode === MODE.EDITING) {
        this.saveCell(row, col);
      }
      this.state.mode = MODE.ACTIVE;
      const { row: oldRow, col: oldCol } = this.state.activeCell;
      this.clearStyle(oldRow, oldCol);
      this.renderActive(row, col);
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
  ///渲染編輯中的格子
  renderEditing(row, col) {
    const td = this.getCell(row, col);
    if (!td) return;
    td.classList.add("is-editing");
    td.contentEditable = true;
    this.moveCursor(row, col);
    td.focus();
  }
  //渲染被選取的格子
  renderActive(row, col) {
    const td = this.getCell(row, col);
    if (!td) return;

    td.classList.add("activeCell");
    td.focus();

    this.state.activeCell = { row, col };
  }
  ///清除格子的css
  clearStyle(row, col) {
    const td = this.getCell(row, col);
    if (!td) return;
    td.classList.remove(
      "ring-2",
      "ring-blue-500",
      "z-10",
      "relative",
      "is-editing",
      "ring-2",
      "ring-blue-500",
      "activeCell",
    );
    td.contentEditable = false;
    td.blur();
  }
  ////移動游標至格子
  moveCursor(row, col) {
    const td = this.getCell(row, col);
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(td);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  ///重新定位格子
  moveTo(row, col) {
    const maxRow = this.data.length;
    const maxCol = this.data[0].length;
    if (row < 0 || row >= maxRow || col < 0 || col >= maxCol) return;

    if (this.state.mode === MODE.EDITING) {
      this.switchMode(MODE.ACTIVE);
    }

    this.state.cursor = { row, col };
    const { row: oldRow, col: oldCol } = this.state.activeCell;
    this.clearStyle(oldRow, oldCol);
    this.renderActive(row, col);
  }
  //取得欄標籤
  getColLabel(col) {
    let label = "";
    col += 1;
    while (col > 0) {
      col--;
      label = String.fromCharCode(65 + (col % 26)) + label;
      col = Math.floor(col / 26);
    }
    return label;
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
      th.textContent = this.getColLabel(col);
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
        td.tabIndex = 0;
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

const dataTable = new DataTable(app, data);
dataTable.init();
