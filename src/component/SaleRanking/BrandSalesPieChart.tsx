import { Card, CardContent, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1",
  "#a4de6c", "#d0ed57", "#ffc0cb", "#ffbb28", "#00C49F"
];

// 傳入後端查詢的前10名銷售資料
const BrandSalesPieChart = ({ data }:any) => {
  const productInfoRelation = useSelector((state: RootState) => state.productInfoRelation);
  // 合併相同品牌並轉換品牌名稱
  const mergedData = Object.values(
    data.reduce((acc:any, item:any) => {
      const brandId = item.brand;
      const brandName =
        productInfoRelation.brandList.find(b => b.brand_id === brandId)?.brand_name ||
        brandId;

      if (!acc[brandName]) {
        acc[brandName] = { brand: brandName, sale_quantity: 0 };
      }
      acc[brandName].sale_quantity += Number(item.sale_quantity) || 0;
      return acc;
    }, {})
  ) as any;
  return (
    <Card sx={{ height: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          前10品牌銷售比例
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={mergedData}
              dataKey="sale_quantity"
              nameKey="brand"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ name, percent }:any) =>
                `${name}: ${(percent * 100).toFixed(1)}%`
              }
            >
              {mergedData.map((_:any, index:any) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => {
                const percent = (
                  (props.payload.sale_quantity /
                    mergedData.reduce((sum:any, i:any) => sum + i.sale_quantity, 0)) *
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

export default BrandSalesPieChart;
