export interface ProfitCalcData {
  sale_amount: number | string;
  refund_amount: number | string;
  sale_quantity: number | string;
  refund_quantity: number | string;
  average_cost?: number | string;
}

export const getGrossProfit = (data: ProfitCalcData) => {
  return (Number(data.sale_amount) - Number(data.refund_amount)) - ((Number(data.sale_quantity) - Number(data.refund_quantity)) * Number(data.average_cost))
}
export const getGrossMargin = (data: ProfitCalcData) => {
  const netRevenue = Math.abs(Number(data.sale_amount) - Number(data.refund_amount)); // 用絕對值
  if (netRevenue === 0) return 0;
  return ((getGrossProfit(data) / netRevenue) * 100).toFixed(2);
}
