import { Card, CardContent, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1",
  "#a4de6c", "#d0ed57", "#ffc0cb", "#ffbb28", "#00C49F"
];

interface SalesItem {
  specification: string;
  sale_quantity: number | string;
}
interface ChartDataItem {
  [key: string]: string | number | undefined;
  specification: string;
  sale_quantity: number;
}

// 傳入後端查詢的前10名銷售資料
const ProductSalesPieChart = ({ data }: { data: SalesItem[] }) => {
  const chartData: ChartDataItem[] = data.map(item => ({
    ...item,
    sale_quantity: Number(item.sale_quantity)
  }));
  return (
    <Card sx={{ height: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          前10商品銷售比例
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="sale_quantity"
              nameKey="specification"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ name, percent }: { name?: string; percent?: number }) =>
                `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`
              }
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => {
                const payload = props.payload as ChartDataItem;
                const percent = (
                  (payload.sale_quantity /
                    chartData.reduce((sum, i) => sum + i.sale_quantity, 0)) *
                  100
                ).toFixed(1);
                return [`${percent}% (${Number(value).toLocaleString()})`, name];
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ProductSalesPieChart;
