import style from "./SaleRanking.module.css";
import ShowSaleRanking from "../../../component/SaleRanking/ShowSaleRanking";
import { useState,useEffect } from "react";
import axios from '../../../api/axios'
import {toast} from 'react-toastify'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TextField,
} from "@mui/material";
import { useDispatch } from "react-redux";
import {getProductInfoRelation} from "../../../store/productInfoRelationSlice"
import ProductSalesPieChart from "../../../component/SaleRanking/ProductSalesPieChart";
import BrandSalesPieChart from "../../../component/SaleRanking/BrandSalesPieChart";
import ColorSalesPieChart from "../../../component/SaleRanking/ColorSalesPieChart";
import TypeSalesPieChart from "../../../component/SaleRanking/TypeSalesPieChart";
interface Report {
  product_id: string;
  product_name: string;
  specification:string;
  total_quantity:string;
  total_sales:string;
  total_profit:string;
}
interface ReportDetail {
  product_id: string,
  product_name: string,
  specification: string,
  manufactor:string,
  brand:string,
  size:string,
  color:string,
  product_type1:string,
  product_type2:string,
  product_type3:string,
  product_type4:string,
  total_quantity:string,
  total_sales:string,
  total_profit:string,
  total_cost:string,
  sizes:Sizes[],
  size_list:string
}
interface Sizes {
  size:string;
  total_quantity:string
}
function SaleRanking() {
  const dispatch = useDispatch()
  const [openShow,setOpenShow] = useState(false);
  const [data, setData] = useState<Report[]>([]);
  const [rangeType, setRangeType] = useState("today"); // today | 7days | month | custom
  const [customRange, setCustomRange] = useState({
    start: "",
    end: "",
  });
  const [detail, setDetail] = useState<ReportDetail>(
    {
      product_id: "",
      product_name:  "",
      specification: "",
      manufactor:"",
      brand:"",
      size:"",
      color:"",
      product_type1:"",
      product_type2:"",
      product_type3:"",
      product_type4:"",
      total_quantity:"",
      total_sales:"",
      total_profit:"",
      total_cost:"",
      sizes:[],
      size_list:""
    }
  );
  const getList = async () => {
    try {
      const res = await axios.post('/api/report/rank_list',{rangeType,customRange});
      setData(res.data.data.list);
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const getDetail = async (specification:string) => {
    try {
      const res = await axios.post('/api/report/detail',{specification,rangeType,customRange});
      if(res.data.code==='000'){
        setDetail(res.data.data.list);
        setOpenShow(true);
      }
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };

  const createProductInfos=async()=>{
    const response = await axios.post('/api/product/info');
    if(response.data.code=='000') {
      dispatch(getProductInfoRelation(response.data.data))
    }
  }
  useEffect(() => {
    setData([])
    if(rangeType==='custom' && (!customRange.start || !customRange.end)){
      return
    }
   getList();
  }, [rangeType,customRange]);
  useEffect(() => {
    createProductInfos()
  },[])
  return (
    <div className={style.container}>
      {openShow && <ShowSaleRanking 
      onClose={() => setOpenShow(false)} detail={detail} rangeType={rangeType} customRange={customRange} />}
      <div className={style.topContainer}>
        <div className={style.title}>商品銷售排行</div>
      </div>
      <div className={style.dateContainer}>
          <Box display="flex" alignItems="center" gap={2}>
      <FormControl size="small">
        <InputLabel>日期範圍</InputLabel>
        <Select
          value={rangeType}
          label="日期範圍"
          onChange={(e) => setRangeType(e.target.value)}
          sx={{ minWidth: 150,backgroundColor:"white" }}
        >
          <MenuItem value="today">今日</MenuItem>
          <MenuItem value="thisWeek">本周</MenuItem>
          <MenuItem value="thisMonth">本月</MenuItem>
          <MenuItem value="custom">自訂範圍</MenuItem>
        </Select>
      </FormControl>

      {rangeType === "custom" && (
        <>
          <TextField
            size="small"
            type="date"
            value={customRange.start}
            sx={{ backgroundColor:"white" }}
            onChange={(e) => {
              const newStart = e.target.value;
              // 如果 end 比新的 start 早，就重置 end
              setCustomRange((prev) => ({
                start: newStart,
                end: prev.end && prev.end <= newStart ? "" : prev.end,
              }));
            }}
          />
          <TextField
            size="small"
            type="date"
            value={customRange.end}
            sx={{ backgroundColor:"white" }}
            onChange={(e) =>
              setCustomRange({ ...customRange, end: e.target.value })
            }
            slotProps={{
             htmlInput: {
                 min: customRange.start ? new Date(new Date(customRange.start).getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
                 : undefined,
              },
           }}
          />
        </>
      )}
        </Box>
    </div>
       <div className={style.tableContainer}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>商品編號</th>
              <th>商品規格</th>
              <th>商品名稱</th>
              <th>總銷量</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => (
              <tr key={m.specification}>
                <td>{m.product_id}</td>
                <td>{m.specification}</td>
                <td>{m.product_name}</td>
                <td>{m.total_quantity}</td>
                <td className={style.actions}>
                  <button className={style.detailBtn} onClick={() => getDetail(m.specification)}>
                    詳細
                  </button>
                </td>
              </tr>
            ))}
            {data.length===0 && <tr>
              <td colSpan={5} style={{textAlign:'center',padding:'20px 0'}}>查無資料</td>
            </tr>}
          </tbody>
        </table>
      </div>
      <div className={style.pieContainer}>
        <ProductSalesPieChart data={data}/>
        <BrandSalesPieChart data={data}/>
        <ColorSalesPieChart data={data}/>
        <TypeSalesPieChart data={data}/>
      </div>
    </div>
  )   
}

export default SaleRanking;