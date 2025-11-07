import { Card, CardContent, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1",
  "#a4de6c", "#d0ed57", "#ffc0cb", "#ffbb28", "#00C49F"
];

// 傳入後端查詢的前10名銷售資料
const ProductSalesPieChart = ({ data }:any) => {
  const chartData = data.map((item:any) => ({
  ...item,
  total_quantity: Number(item.total_quantity)
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
              dataKey="total_quantity"
              nameKey="product_name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ name, percent }:any) =>
                `${name}: ${(percent * 100).toFixed(1)}%`
              }
            >
              {data.map((_:any, index:any) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => {
                const percent = (
                  (props.payload.total_quantity /
                    chartData.reduce((sum:any, i:any) => sum + i.total_quantity, 0)) *
                  100
                ).toFixed(1);
                return [`${percent}% (${value.toLocaleString()})`, name];
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
