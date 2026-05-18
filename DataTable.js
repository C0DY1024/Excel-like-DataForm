import { isWithinRange } from "./utils.js";
export class DataTable {
  static MODES = { ACTIVE: "ACTIVE", EDITING: "EDITING" };
  constructor(data) {
    this.data = data;
    this.cursor = { row: 0, col: 0 };
    this.mode = DataTable.MODES.ACTIVE;
    this.originalValue = "";
  }
  moveTo(row, col) {
    if (isWithinRange(row, col, this.data.length, this.data[0].length)) {
      this.cursor = { row, col };
      return true;
    }
    return false;
  }
  setMode(mode) {
    if (mode === DataTable.MODES.EDITING) {
      this.originalValue = this.data[this.cursor.row][this.cursor.col];
    }
    this.mode = mode;
  }
  saveCell(row, col, value) {
    this.data[row][col] = value ?? this.data[row][col] ?? "";
  }
}
