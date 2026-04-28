import { Card, CardContent, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1",
  "#a4de6c", "#d0ed57", "#ffc0cb", "#ffbb28", "#00C49F"
];

interface SalesItem {
  brand?: string;
  sale_quantity: number | string;
}
interface MergedBrand {
  [key: string]: string | number;
  brand: string;
  sale_quantity: number;
}

// 傳入後端查詢的前10名銷售資料
const BrandSalesPieChart = ({ data }: { data: SalesItem[] }) => {
  const productInfoRelation = useSelector((state: RootState) => state.productInfoRelation);
  // 合併相同品牌並轉換品牌名稱
  const mergedData: MergedBrand[] = Object.values(
    data.reduce<Record<string, MergedBrand>>((acc, item) => {
      const brandId = item.brand ?? '';
      const brandName =
        productInfoRelation.brandList.find(b => b.brand_id === brandId)?.brand_name ||
        brandId;

      if (!acc[brandName]) {
        acc[brandName] = { brand: brandName, sale_quantity: 0 };
      }
      acc[brandName].sale_quantity += Number(item.sale_quantity) || 0;
      return acc;
    }, {})
  );
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
                const payload = props.payload as MergedBrand;
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

export default BrandSalesPieChart;
