import style from "./ProductSale.module.css";
import { FaPlus } from "react-icons/fa6";
import CreateProductSale from "../../../component/ProductSale/CreateProductSale";
import ShowProductSale from "../../../component/ProductSale/ShowProductSale";
import CreateProductOrder from "../../../component/ProductOrder/CreateProductOrder";
import ShowProductOrder from "../../../component/ProductOrder/ShowProductOrder";
import { useState,useEffect,useRef } from "react";
import axios from '../../../api/axios'
import dayjs, { Dayjs } from "dayjs";
import {toast} from 'react-toastify'
import Pagination from '@mui/material/Pagination';
import { IoIosArrowDropup ,IoIosArrowDropdown   } from "react-icons/io"; 
import { Switch, FormControlLabel } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDispatch } from "react-redux";
import { getProductInfoRelation } from "../../../store/productInfoRelationSlice";
import { getSafeStockCount } from "../../../store/safeStcokSlice";
import classNames from "classnames";
interface Sale {
  order_no: string;
  prepaid_price:number;
  remaining_price:number;
  product_id:string;
  specification:string;
  total_quantity:number;
  price:number;
  average_cost:number;
  date:string,
  handing_fee:number;
  quantities:[{
    size:string,
    quantity:string
  }];
  type:string,
  amount:number;
}
interface Summary {
  total_quantity:number;
  total_paid:number;
  total_profit:number;
  total_cost:number;
  total_handing_fee:number;
  total_prepaid:number;
  total_remaining:number;
}
interface SaleDetail {
  transaction:string,
  order_no:string,
  create_date:string,
  product_id:string,
  specification:string,
  product_name:string,
  manufactor:string,
  brand:string,
  size:string,
  color:string,
  size_list:string,
  quantities:[{
    size:string,
    quantity:string
  }],
  total_quantity:number,
  price:number,
  handing_fee:number,
  average_cost:number,
  product_type1:string,
  product_type2:string,
  product_type3:string,
  product_type4:string,
  remark: string,
}
function ProductSale() {
  const dispatch = useDispatch()
  const currentYear = dayjs();
  const [showOneDay,setShowOneDay] =useState(true)
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [sort, setSort] = useState<'ASC' | 'DESC'>('DESC');
  const [searchType, setSearchType] = useState('order_no');
  const [filter, setFilter] = useState({
    order_no: '',
    product_id:'',
    specification:''
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [openCreate,setOpenCreate] = useState(false);
  const [openOrder,setOpenOrder] = useState(false);
  const [openShow,setOpenShow] = useState(false);
  const [openShowOrder,setOpenShowOrder] = useState(false);
  const [data, setDate] = useState<Sale[]>([]);
  const [summary,setSummary] = useState<Summary>({
    total_quantity:0,
    total_paid:0,
    total_profit:0,
    total_cost:0,
    total_handing_fee:0,
    total_prepaid:0,
    total_remaining:0,
  });
  const [detail, setDetail] = useState<SaleDetail>(
    {
      transaction:"",
      order_no:"",
      create_date:"",
      product_id:"",
      specification:"",
      product_name:"",
      manufactor:"",
      brand:"",
      size:"",
      color:"",
      size_list:"",
      quantities:[{
        size:"",
        quantity:""
      }],
      total_quantity:0,
      price:0,
      handing_fee:0,
      average_cost:0,
      product_type1:"",
      product_type2:"",
      product_type3:"",
      product_type4:"",
      remark: "",
    }
  );
  const debounceRef = useRef<number | null>(null);
  const getList = async () => {
    try {
      const res = await axios.post('/api/sale/list',{page,pageSize:10,filter,sort,showOneDay,selectedDate});
      setDate(res.data.data.list);
      setTotal(res.data.data.total)
      setSummary(res.data.data.summary)
      setTotalPages(res.data.data.totalPages);
      const countRes = await axios.post('/api/stock/safe_count');
      dispatch(getSafeStockCount(countRes.data.data.total));
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  
  const getDetail = async (order_no:string,type:string) => {
    try {
      const res = await axios.post('/api/sale/detail',{order_no,type});
      if(res.data.code==='000'){
        setDetail(res.data.data);
        if(type==='銷貨'){
          setOpenShow(true);
        }else if(type==='訂貨'||type==='收貨'){
          setOpenShowOrder(true);
        }
      }
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const handleDelete = async (order_no:string,type:string) => {
    if(type==='銷貨'){
      try {
      const res = await axios.post('/api/sale/delete',{order_no});
      if(res.data.code==='000'){
        toast.success('取消成功');
        const updateData = data.filter(item => item.order_no !== order_no);
        if(updateData.length ===0 && page>1){
          setPage(page-1);
        }
        getList();
      }
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
    }else if(type==='訂貨'){
      try {
      const res = await axios.post('/api/sale/delete_order',{order_no});
      if(res.data.code==='000'){
        toast.success('取消成功');
        const updateData = data.filter(item => item.order_no !== order_no);
        if(updateData.length ===0 && page>1){
          setPage(page-1);
        }
        getList();
      }
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
    }else if(type==='收貨'){
      try {
      const res = await axios.post('/api/sale/delete_pickup',{order_no});
      if(res.data.code==='000'){
        toast.success('取消成功');
        const updateData = data.filter(item => item.order_no !== order_no);
        if(updateData.length ===0 && page>1){
          setPage(page-1);
        }
        getList();
      }
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  }
}
  const handleSetFilter = (value:string) => {
    if(searchType==='order_no'){
      setFilter({
        order_no: value,
        product_id:'',
        specification:''
      })
    }else if(searchType==='product_id'){
      setFilter({
        order_no: '',
        product_id:value,
        specification:''
      })
    }else if(searchType==='specification'){
      setFilter({
        order_no: '',
        product_id:'',
        specification:value
      })
    }
  }
  const handleSetSearchType = (value:string) => {
    setSearchType(value);
    setFilter({ order_no: '',product_id:'',specification:'' });
  }
  const createProductInfos=async()=>{
    const response = await axios.post('/api/product/info');
    if(response.data.code=='000') {
      dispatch(getProductInfoRelation(response.data.data))
    }
  }
  const formattedDate = (dateString: string) => {
    return dayjs(dateString).format('YYYY/MM/DD');
  }
  const formattedQuantity = (quantities: any[]) => {
  return (
    <div className={style.sizeBadges}>
      {quantities
        .filter(q => Number(q.quantity) > 0)
        .map((q, idx) => (
          <span key={idx} className={style.badge}>
            {q.size} : {q.quantity}
          </span>
        ))
      }
    </div>
  );
};
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
   getList();
  }, [page,sort,showOneDay,selectedDate]);
  useEffect(() => {
    createProductInfos()
  },[])
  return (
    <div className={style.container}>
      {openCreate && <CreateProductSale 
      onClose={() => setOpenCreate(false)} 
      onSuccess={() => {
        setOpenCreate(false);
        getList(); 
      }}/>}
      {openOrder && <CreateProductOrder 
      onClose={() => setOpenOrder(false)} 
      onSuccess={() => {
        setOpenOrder(false);
        getList(); 
      }}/>}
      {openShow && <ShowProductSale 
      onClose={() => setOpenShow(false)} detail={detail} />}
      {openShowOrder && <ShowProductOrder 
      onClose={() => setOpenShowOrder(false)} 
      detail={detail}
      onSuccess={() => {
        setOpenShowOrder(false);
        getList(); 
      }} />}
      <div className={style.topContainer}>
        <div className={style.title}>前台銷貨</div>
        <div className={style.buttons}>
          <div className={style.button} onClick={()=>setOpenOrder(true)}><FaPlus/>新增訂貨</div>
          <div className={style.button} onClick={()=>setOpenCreate(true)}><FaPlus/>新增銷貨</div>
        </div>
      </div>
      <div className={style.searchContainer}>
        <select value={searchType} onChange={(e)=>handleSetSearchType(e.target.value)} className={style.searchSelect}>
          <option value="order_no">單號</option>
          <option value="product_id">商品型號</option>
          <option value="specification">商品規格</option>
        </select>
        {searchType==='order_no' && <input type="text" placeholder="搜尋關鍵字" value={filter.order_no} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
        {searchType==='product_id' && <input type="text" placeholder="搜尋關鍵字" value={filter.product_id} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
        {searchType==='specification' && <input type="text" placeholder="搜尋關鍵字" value={filter.specification} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
      </div>
      <div className={style.infoContainer}>
        <div className={style.timeContainer}>
        <FormControlLabel
          control={
          <Switch checked={showOneDay} onChange={(e) => setShowOneDay(e.target.checked)}/>
        }
        label={showOneDay ? '顯示單日' : '顯示全部'}
      />
       {showOneDay && <LocalizationProvider dateAdapter={AdapterDayjs}  adapterLocale="zh-tw">
        <DatePicker
          label="選擇日期"
          value={selectedDate}
          onChange={(newValue) => {
            if(!newValue) return
            setSelectedDate(newValue);
          }}
          maxDate={currentYear}
          yearsOrder="desc"
        />
      </LocalizationProvider>}
        </div>
      <div className={style.infos}>
        <div className={style.info}>總筆數 : <span>{total}</span></div>
        <div className={style.info}>總金額 : <span>$ {Number(summary.total_paid) + Number(summary.total_prepaid) + Number(summary.total_remaining)}</span></div>
        <div className={style.info}>總成本 : <span>$ {summary.total_cost}</span></div>
        <div className={style.info}>網路手續 : <span>$ {summary.total_handing_fee}</span></div>
        <div className={style.info}>銷售 : <span>$ {summary.total_paid}</span></div>
        <div className={style.info}>訂金 : <span>$ {summary.total_prepaid}</span></div>
        <div className={style.info}>尾款 : <span>$ {summary.total_remaining}</span></div>
        <div className={style.info}>毛利 : <span>$ {summary.total_profit}</span></div>
        <div className={style.info}>淨利 : <span>$ {Number(summary.total_profit) - Number(summary.total_handing_fee)}</span></div>
      </div>
      </div>
       <div className={style.tableContainer}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>
                <span>單號</span>
                {sort === 'ASC' ? (
                  <IoIosArrowDropup onClick={() => setSort('DESC')} className={style.icon} />
                ) : (
                 <IoIosArrowDropdown onClick={() => setSort('ASC')} className={style.icon} />
                )}
              </th>
              <th>狀態</th>
              <th>商品型號</th>
              <th>商品規格</th>
              <th>數量</th>
              <th>總金額</th>
              <th>訂金</th>
              <th>尾款</th>
              <th>淨利</th>
              <th>日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => (
              <tr key={`${m.order_no}-${m.type}`}>
                <td className={classNames(m.type !=='銷貨' && style.order)}>{m.order_no}</td>
                <td>{m.type}</td>
                <td>{m.product_id}</td>
                <td>{m.specification}</td>
                <td>{m.total_quantity}<br/>{formattedQuantity(m.quantities)}</td>
                <td>$ {m.price*m.total_quantity}</td>
                <td>{m.type==='訂貨' ? "$ " + m.amount : ""}</td>
                <td>{m.type==='收貨' ? "$ " + m.amount : ""}</td>
                <td>{m.type==='銷貨'
                    ? "$ " + (((m.price - m.average_cost) * m.total_quantity) - (m.handing_fee || 0))
                    : ""
                  }
                </td>    
                <td>{formattedDate(m.date)}</td>                
                <td>
                  <div className={style.actions}>
                  <button className={style.detailBtn} onClick={() => getDetail(m.order_no,m.type)}>
                    詳細
                  </button>
                  <button className={style.deleteBtn} onClick={()=>handleDelete(m.order_no,m.type)}>
                    取消
                  </button>
                  </div>
                </td>
              </tr>
            ))}
            {data.length===0 && <tr>
              <td colSpan={11} style={{textAlign:'center',padding:'20px 0'}}>查無資料</td>
            </tr>}
          </tbody>
        </table>
      </div>
      {data.length >0 && <Pagination count={totalPages} page={page} onChange={(_, val) => setPage(val)} siblingCount={0} boundaryCount={1} sx={{ul: {whiteSpace: 'nowrap', display: 'flex', flexWrap: 'nowrap', justifyContent: 'center' }}}/>}
    </div>
  )   
}

export default ProductSale;