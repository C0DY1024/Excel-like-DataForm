export function isWithinRange(row, col, maxRow, maxCol) {
  return row >= 0 && row < maxRow && col >= 0 && col < maxCol;
}
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
export function getCellAddress(row, col) {
  return `${getColLabel(col)}${row + 1}`;
}
