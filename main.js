import { DataTable } from "./DataTable.js";
import { Renderer } from "./Renderer.js";
import { Welcome } from "./Welcome.js";
const table = new DataTable(
  Array.from({ length: 1000 }, () => Array(50).fill("")),
);

const renderer = new Renderer(document.getElementById("app"), table);
const editor = document.getElementById("excel-editor");
const welcomeModal = new Welcome();
editor.addEventListener("input", (e) => {
  const { row, col } = table.cursor;

  if (table.mode !== DataTable.MODES.EDITING) {
    table.setMode(DataTable.MODES.EDITING);
    renderer.showEditor(row, col);
  }
  table.data[row][col] = editor.value;
  const td = renderer.getCell(row, col);
  if (td) td.textContent = editor.value;
});
editor.addEventListener("keydown", (e) => {
  const { row, col } = table.cursor;
  if (e.key === "Enter") {
    if (table.mode === DataTable.MODES.ACTIVE) {
      table.originalValue = table.data[row][col];
      table.setMode(DataTable.MODES.EDITING);
      renderer.showEditor(row, col);
    } else {
      renderer.exitEditing();
      table.moveTo(row + 1, col);
      renderer.render();
      editor.focus();
    }
  }
  if (e.key === "Escape") {
    const { row, col } = table.cursor;
    table.data[row][col] = table.originalValue;
    editor.classList.remove("active");
    renderer.editorWrapper.classList.remove("active");
    table.setMode(DataTable.MODES.ACTIVE);
    renderer.render();
    editor.focus();
  }

  if (e.key.startsWith("Arrow")) {
    if (table.mode === DataTable.MODES.ACTIVE)
      switch (e.key) {
        case "ArrowUp":
          table.moveTo(row - 1, col);
          break;
        case "ArrowDown":
          table.moveTo(row + 1, col);
          break;
        case "ArrowLeft":
          table.moveTo(row, col - 1);
          break;
        case "ArrowRight":
          table.moveTo(row, col + 1);
          break;
        default:
          break;
      }

    renderer.render();
  }
});

window.addEventListener("click", (e) => {
  const td = e.target.closest("div");
  if (!td) return;

  const row = parseInt(td.dataset.row);
  const col = parseInt(td.dataset.col);
  console.log(`成功,此格子是${row},${col}`);
  const { row: oldRow, col: oldCol } = table.cursor;

  ///點同意格進入編輯

  if (oldRow === row && oldCol === col) {
    table.setMode(DataTable.MODES.EDITING);
    renderer.showEditor(row, col);
    return;
  }

  if (table.mode === DataTable.MODES.EDITING) {
    table.setMode(DataTable.MODES.ACTIVE);
    table.saveCell(oldRow, oldCol, editor.value);
    editor.value = "";
    editor.classList.remove("active");
    table.moveTo(row, col);
    renderer.render();
    editor.focus();
    return;
  }
  table.moveTo(row, col);
  renderer.render();
  setTimeout(() => editor.focus(), 0);
});
editor.focus();
