import { useEffect, useState } from "react";
import axios from "../../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import style from "./SalesProfitChart.module.css";

const SalesProfitChart = () => {
  const [data, setData] = useState([]);
  const currentYear = new Date().getFullYear();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post("/api/dashboard/year");
        const chartData = res.data.data.map((item: any) => ({
          month: item.month.slice(-2),
          sales: Number(item.sale.total_sale_amount),
          profit: Number(item.sale.total_profit),
          salesAmount: Number(item.sale.total_sale_volume),
          restockAmount: Number(item.restock.total_restock_volume),
          handingFee:Number(item.sale.total_fee),
          handingFeeCount:Number(item.sale.fee_count),
          netProfit:Number(item.sale.total_profit) - Number(item.sale.total_fee),
        }));
        setData(chartData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
    <div className={style.chartContainer}>
      <div className={style.chart}>
        <div className={style.year}>{currentYear}</div>
        <div className={style.chartTitle}>銷售額 VS 毛利</div>
        <ResponsiveContainer height={350}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#8884d8"
              strokeWidth={2}
              name="銷售額"
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#82ca9d"
              strokeWidth={2}
              name="毛利"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className={style.chart}>
        <div className={style.year}>{currentYear}</div>
        <div className={style.chartTitle}>銷售量 VS 進貨量</div>
        <ResponsiveContainer height={350}>
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="salesAmount"
              stroke="#8884d8"
              strokeWidth={2}
              name="銷售量"
            />
            <Line
              type="monotone"
              dataKey="restockAmount"
              stroke="#82ca9d"
              strokeWidth={2}
              name="進貨量"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
    </>
  );
};

export default SalesProfitChart;
