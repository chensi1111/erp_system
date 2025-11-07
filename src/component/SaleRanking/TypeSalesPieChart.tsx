import { Card, CardContent, Typography } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
  "#ffc0cb",
  "#ffbb28",
  "#00C49F",
];

const TypeSalesPieChart = ({ data }:any) => {
  const productInfoRelation = useSelector(
    (state: RootState) => state.productInfoRelation
  );
  // 加總各 type 的銷售量
  const mergedData = Object.values(
    data.reduce((acc:any, item:any) => {
      const quantity = Number(item.total_quantity) || 0;

      // 取出所有有值的類別 ID
      const typeIds = [
        item.product_type1,
        item.product_type2,
        item.product_type3,
        item.product_type4,
      ].filter(Boolean); // 去除空字串

      typeIds.forEach((typeId) => {
        const typeName =
          productInfoRelation.typeList.find((t) => t.type_id === typeId)
            ?.type_name || typeId;

        if (!acc[typeName]) {
          acc[typeName] = { type: typeName, total_quantity: 0 };
        }
        acc[typeName].total_quantity += quantity;
      });

      return acc;
    }, {})
  ) as any;
  return (
    <Card sx={{ height: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          前10類別銷售比例
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={mergedData}
              dataKey="total_quantity"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ name, percent }:any) =>
                `${name}: ${(percent * 100).toFixed(1)}%`
              }
            >
              {mergedData.map((_:any, index:any) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => {
                const percent = (
                  (props.payload.total_quantity /
                    mergedData.reduce((sum:any, i:any) => sum + i.total_quantity, 0)) *
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

export default TypeSalesPieChart;
