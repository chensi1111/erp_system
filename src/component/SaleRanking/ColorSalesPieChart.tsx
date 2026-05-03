import { Card, CardContent, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1",
  "#a4de6c", "#d0ed57", "#ffc0cb", "#ffbb28", "#00C49F"
];

interface SalesItem {
  color?: string;
  sale_quantity: number | string;
}
interface MergedColor {
  [key: string]: string | number;
  color: string;
  sale_quantity: number;
}

// 傳入後端查詢的前10名銷售資料
const ColorSalesPieChart = ({ data }: { data: SalesItem[] }) => {
  const productInfoRelation = useSelector((state: RootState) => state.productInfoRelation);
  // 合併相同品牌並轉換品牌名稱
  const mergedData: MergedColor[] = Object.values(
    data.reduce<Record<string, MergedColor>>((acc, item) => {
      const colorId = item.color ?? '';
      const colorName =
        productInfoRelation.colorList.find(b => b.color_id === colorId)?.color_name ||
        colorId;

      if (!acc[colorName]) {
        acc[colorName] = { color: colorName, sale_quantity: 0 };
      }
      acc[colorName].sale_quantity += Number(item.sale_quantity) || 0;
      return acc;
    }, {})
  );
  return (
    <Card sx={{ height: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          前10顏色銷售比例
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={mergedData}
              dataKey="sale_quantity"
              nameKey="color"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ name, percent }: { name?: string; percent?: number }) =>
                `${name}: ${((percent ?? 0) * 100).toFixed(1)}%`
              }
            >
              {mergedData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => {
                const payload = props.payload as MergedColor;
                const percent = (
                  (payload.sale_quantity /
                    mergedData.reduce((sum, i) => sum + i.sale_quantity, 0)) *
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

export default ColorSalesPieChart;
