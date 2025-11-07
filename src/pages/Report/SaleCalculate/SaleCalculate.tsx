import style from "./SaleCalculate.module.css";
import ShowSaleCalculate from "../../../component/SaleCalculate/ShowSaleCalculate";
import { useState,useEffect,useRef } from "react";
import axios from '../../../api/axios'
import {toast} from 'react-toastify'
import Pagination from '@mui/material/Pagination';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TextField,
} from "@mui/material";
import { IoIosArrowDropup ,IoIosArrowDropdown   } from "react-icons/io";
import { useDispatch } from "react-redux";
import {getProductInfoRelation} from "../../../store/productInfoRelationSlice"
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
function SaleCalculate() {
  const dispatch = useDispatch()
  const [sort, setSort] = useState<'ASC' | 'DESC'>('DESC');
  const [searchType, setSearchType] = useState('product_id');
  const [filter, setFilter] = useState({
    product_id: '',
    specification:"",
    product_name: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSale, setTotalSale] = useState('')
  const [totalQuantity, setTotalQuantity] = useState('')
  const [totalProfit, setTotalProfit] = useState('')
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
  const debounceRef = useRef<number | null>(null);
  const getList = async () => {
    try {
      const res = await axios.post('/api/report/list',{page,pageSize:10,filter,sort,rangeType,customRange});
      setData(res.data.data.list);
      setTotalPages(res.data.data.totalPages);
      setTotalSale(res.data.data.summary.total_sales_amount);
      setTotalProfit(res.data.data.summary.total_profit);
      setTotalQuantity(res.data.data.summary.total_sales_volume);
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
  const handleSetFilter = (value:string) => {
    if(searchType==='product_id'){
      setFilter({
        product_id: value,
        specification:'',
        product_name: '',
      })
    }else if (searchType==='specification'){
      setFilter({
        product_id: '',
        specification:value,
        product_name: '',
      })
    }else{
      setFilter({
        product_id: '',
        specification:'',
        product_name: value,
      })
    }
  }
  const handleSetSearchType = (value:string) => {
    setSearchType(value);
    setFilter({ product_id: '',specification: '', product_name: '' });
  }
  const createProductInfos=async()=>{
    const response = await axios.post('/api/product/info');
    if(response.data.code=='000') {
      dispatch(getProductInfoRelation(response.data.data))
    }
  }
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      getList();
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filter]);

  useEffect(() => {
    setData([])
    if(rangeType==='custom' && (!customRange.start || !customRange.end)){
      return
    }
   getList();
  }, [page,sort,rangeType,customRange]);
  useEffect(() => {
    createProductInfos()
  },[])
  return (
    <div className={style.container}>
      {openShow && <ShowSaleCalculate 
      onClose={() => setOpenShow(false)} detail={detail} rangeType={rangeType} customRange={customRange} />}
      <div className={style.topContainer}>
        <div className={style.title}>商品銷售總表</div>
      </div>
      <div className={style.searchContainer}>
        <select value={searchType} onChange={(e)=>handleSetSearchType(e.target.value)} className={style.searchSelect}>
          <option value="product_id">商品編號</option>
          <option value="specification">商品規格</option>
          <option value="product_name">商品名稱</option>
        </select>
        {searchType==='product_id' && <input type="text" placeholder="搜尋關鍵字" value={filter.product_id} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
        {searchType==='specification' && <input type="text" placeholder="搜尋關鍵字" value={filter.specification} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
        {searchType==='product_name' && <input type="text" placeholder="搜尋關鍵字" value={filter.product_name} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
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
        <div className={style.infoContainer}>
          <div className={style.infoItem}><span>總銷量:</span>{totalQuantity}</div>
          <div className={style.infoItem}><span>總銷售額:</span>$ {totalSale}</div>
          <div className={style.infoItem}><span>毛利:</span>$ {totalProfit}</div>
        </div>
    </div>
       <div className={style.tableContainer}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>
                <span>商品編號</span>
                {sort === 'ASC' ? (
                  <IoIosArrowDropup onClick={() => setSort('DESC')} className={style.icon} />
                ) : (
                 <IoIosArrowDropdown onClick={() => setSort('ASC')} className={style.icon} />
                )}
              </th>
              <th>商品規格</th>
              <th>商品名稱</th>
              <th>總銷量</th>
              <th>總銷售額</th>
              <th>毛利</th>
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
                <td>$ {m.total_sales}</td>
                <td>$ {m.total_profit}</td>
                <td className={style.actions}>
                  <button className={style.detailBtn} onClick={() => getDetail(m.specification)}>
                    詳細
                  </button>
                </td>
              </tr>
            ))}
            {data.length===0 && <tr>
              <td colSpan={7} style={{textAlign:'center',padding:'20px 0'}}>查無資料</td>
            </tr>}
          </tbody>
        </table>
      </div>
      {data.length >0 && <Pagination count={totalPages} page={page} onChange={(_, val) => setPage(val)} siblingCount={0} boundaryCount={1} sx={{ul: {whiteSpace: 'nowrap', display: 'flex', flexWrap: 'nowrap', justifyContent: 'center' }}}/>}
    </div>
  )   
}

export default SaleCalculate;