  export const getGrossProfit = (data:any) => {
    return (Number(data.sale_amount) - Number(data.refund_amount)) - ((Number(data.sale_quantity) - Number(data.refund_quantity)) * Number(data.average_cost))
  }
  export const getGrossMargin = (data:any) => {
    const netRevenue = Math.abs(Number(data.sale_amount) - Number(data.refund_amount)); // 用絕對值
    if (netRevenue === 0) return 0;
    return ((getGrossProfit(data) / netRevenue) * 100).toFixed(2);
  }