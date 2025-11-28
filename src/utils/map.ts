export const PayTypeMap: Record<number, string> = {
  0: "現金",
  1: "信用卡",
  2: "信金券",
};

export const SaleTypeMap: Record<number, string> = {
  0: "銷貨",
  1: "退貨",
  2: "訂貨",
  3: "取貨",
  4: "退訂",
  5: "取消"
};
export const TransactionTypeMap: Record<number, string> = {
  0: "現場",
};
export const RestockTypeMap: Record<number, string> = {
  0: "買斷",
  1: "寄賣"
};
export const HistoryTypeMap : Record<number, string> = {
  0: "前台銷貨",
  1: "前台銷貨取消",
  2: "前台退貨",
  3: "前台退貨取消",
  4: "前台訂貨",
  5: "前台訂貨取消",
  6: "前台取貨",
  7: "前台取貨取消",
  8: "前台退訂",
  9: "前台退訂取消",
  10: "廠商進貨",
  11: "廠商進貨取消",
  12: "廠商退貨",
  13: "廠商退貨取消",
};