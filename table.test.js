import { expect, test } from "vitest";
import { getColLabel, isWithinRange } from "./main.js";
test("驗證 Excel 欄位名稱轉換是否正確", () => {
  expect(getColLabel(0)).toBe("A");
  expect(getColLabel(25)).toBe("Z");
  expect(getColLabel(26)).toBe("AA");
});
test("檢查是否在邊界之內", () => {
  expect(isWithinRange(0, 0, 30, 50)).toBe(true);
  expect(isWithinRange(0, -1, 30, 50)).toBe(false);
  expect(isWithinRange(31, 0, 30, 50)).toBe(false);
  expect(isWithinRange(20, 30, 30, 50)).toBe(true);
});
