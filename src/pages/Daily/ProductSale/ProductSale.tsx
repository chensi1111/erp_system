import style from "./ProductSale.module.css";
import { FaPlus } from "react-icons/fa6";
import { formattedDate } from "../../../utils/formattedTime";
import { SaleTypeMap } from "../../../utils/map";
import CreateProductSale from "../../../component/ProductOperation/ProductSale/CreateProductSale";
import ShowProductSale from "../../../component/ProductOperation/ProductSale/ShowProductSale";
import CreateProductOrder from "../../../component/ProductOperation/ProductOrder/CreateProductOrder";
import ShowProductOrder from "../../../component/ProductOperation/ProductOrder/ShowProductOrder";
import ShowOrderList from "../../../component/ProductOperation/ProductOrder/ShowOrderList";
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
  paid_date:string,
  handing_fee:number;
  quantities:[{
    size:string,
    quantity:string
  }];
  type:number,
  amount:number;
}
interface Summary {
  total_prepaid_qty:string,
  total_prepaid:string,
  total_refund_prepaid_qty:string,
  total_refund_prepaid:string,
  total_remaining_qty:string,
  total_remaining:string,
  total_sale_qty:string,
  total_paid:string,
  total_return_qty:string,
  total_return:string,
  total_handing_fee:string,
  net_cost:string,
  end_of_day_balance:string,
  net_gross_profit:string,
  net_gross_profit_percentage:string,
}
interface SaleDetail {
  transaction:number,
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
  average_cost:number,
  product_type1:string,
  product_type2:string,
  product_type3:string,
  product_type4:string,
  remark: string,
  paid_at:string
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
  const [type,setType] = useState(0);
  const [openCreate,setOpenCreate] = useState(false);
  const [openOrder,setOpenOrder] = useState(false);
  const [openShow,setOpenShow] = useState(false);
  const [openShowOrder,setOpenShowOrder] = useState(false);
  const [openOrderList,setOpenOrderList] = useState(false)
  const [data, setDate] = useState<Sale[]>([]);
  const [summary,setSummary] = useState<Summary>({
    total_prepaid_qty:'0',
    total_prepaid:'0',
    total_refund_prepaid_qty:'0',
    total_refund_prepaid:'0',
    total_remaining_qty:'0',
    total_remaining:'0',
    total_sale_qty:'0',
    total_paid:'0',
    total_return_qty:'0',
    total_return:'0',
    total_handing_fee:'0',
    net_cost:'0',
    end_of_day_balance:'0',
    net_gross_profit:'0',
    net_gross_profit_percentage:'0',
  });
  const [detail, setDetail] = useState<SaleDetail>({
    transaction:0,
    order_no:'',
    create_date:'',
    product_id:'',
    specification:'',
    product_name:'',
    manufactor:'',
    brand:'',
    size:'',
    color:'',
    size_list:'',
    quantities:[{
      size:'',
      quantity:''
    }],
    total_quantity:0,
    price:0,
    average_cost:0,
    product_type1:'',
    product_type2:'',
    product_type3:'',
    product_type4:'',
    remark: '',
    paid_at:''
  });
  const debounceRef = useRef<number | null>(null);
  const checkToday = (dateString: string) => {
    return dayjs(dateString).isSame(dayjs(), 'day');
  }
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
  const handleCreate =(type:number) =>{
    setType(type);
    setOpenCreate(true);
  }
  const handleOrder =(type:number) =>{
    setType(type);
    setOpenOrder(true);
  }
  
  const getDetail = async (order_no:string,type:number) => {
    try {
      const res = await axios.post('/api/sale/detail',{order_no,type});
      if(res.data.code==='000'){
        setDetail(res.data.data);
        if(type===0||type===1){
          setOpenShow(true);
        }else if(type===2||type===3){
          setOpenShowOrder(true);
        }
      }
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const handleDelete = async (order_no:string,type:number) => {
    if(type===0){
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
    }else if(type===2){
      try {
      const res = await axios.post('/api/sale/delete_order',{order_no,type:5});
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
    }else if(type===3){
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
  const getProfit = (data:any) => {
    if(data.type ===0 || data.type === 3){
      return `$ ${(data.price - data.average_cost) * data.total_quantity}`
    }else if (data.type === 1){
      return `$ -${((data.price - data.average_cost) * data.total_quantity)}`
    }else{
      return ""
    }
  }
  const getPrepaid = (data:any) => {
    if(data.type === 2){
      return `$ ${data.amount}`
    }else if(data.type === 4){
      return `$ -${data.amount}`
    }else{
      ''
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
      }}
      type={type}
      />}
      {openOrder && <CreateProductOrder 
      onClose={() => setOpenOrder(false)} 
      onSuccess={() => {
        setOpenOrder(false);
        getList(); 
      }}
      type={type}/>}
      {openShow && <ShowProductSale 
      onClose={() => setOpenShow(false)} detail={detail} />}
      {openShowOrder && <ShowProductOrder 
      onClose={() => setOpenShowOrder(false)} 
      detail={detail}
      onSuccess={() => {
        setOpenShowOrder(false);
        getList(); 
      }} />}
      {openOrderList && <ShowOrderList 
      onClose={() => setOpenOrderList(false)} 
      onSuccess={() => {
        setOpenOrderList(false);
        getList(); 
      }} />}
      <div className={style.topContainer}>
        <div className={style.title}>前台作業</div>
        <div className={style.buttons}>
          <div className={classNames(style.button,style.order)} onClick={()=>setOpenOrderList(true)} ><FaPlus/>顯示訂貨</div>
          <div className={style.button} onClick={()=>handleOrder(2)}><FaPlus/>新增訂貨</div>
          <div className={style.button} onClick={()=>handleCreate(0)}><FaPlus/>新增銷貨</div>
          <div className={classNames(style.button,style.refund)} onClick={()=>handleCreate(1)}><FaPlus/>新增退貨</div>
        </div>
      </div>
      <div className={style.allSearch}>
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
      <div className={style.timeContainer}>
        <FormControlLabel
          control={
          <Switch checked={showOneDay} onChange={(e) => setShowOneDay(e.target.checked)}/>
        }
        label={showOneDay ? '顯示單日' : '顯示整月'}
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
      {!showOneDay && <LocalizationProvider dateAdapter={AdapterDayjs}  adapterLocale="zh-tw">
        <DatePicker
        label="選擇年月"
        value={selectedDate}
        onChange={(newValue) => {
          if(!newValue) return
          setSelectedDate(newValue);
        }}
        maxDate={currentYear}
        openTo="month"
        views={['year', 'month']}
        yearsOrder="desc"
        format="YYYY/MM"
      />
      </LocalizationProvider>}
        </div>
      </div>
      <div className={style.infos}>
        <div className={style.info}>
          <div className={style.infoTitle}>總筆數</div>
          <div className={style.infoValue}>{total}</div>
        </div>
        <div className={style.info}>
          <div className={style.infoTitle}>銷貨數 / 額</div>
          <div className={style.infoValue}>{summary.total_sale_qty} / $ {summary.total_paid}</div>
        </div>
        <div className={style.info}>
          <div className={style.infoTitle}>退貨數 / 額</div>
          <div className={style.infoValue}>{summary.total_return_qty} / $ {summary.total_return}</div>
        </div>
        <div className={style.info}>
          <div className={style.infoTitle}>訂貨數 / 額</div>
          <div className={style.infoValue}>{summary.total_prepaid_qty} / $ {summary.total_prepaid}</div>
        </div>
        <div className={style.info}>
          <div className={style.infoTitle}>退訂數 / 額</div>
          <div className={style.infoValue}>{summary.total_refund_prepaid_qty} / $ {summary.total_refund_prepaid}</div>
        </div>
        <div className={style.info}>
          <div className={style.infoTitle}>取貨數 / 額</div>
          <div className={style.infoValue}>{summary.total_remaining_qty} / $ {summary.total_remaining}</div>
        </div>
        <div className={style.info}>
          <div className={style.infoTitle}>總成本</div>
          <div className={style.infoValue}>$ {summary.net_cost}</div>
        </div>
        <div className={style.info}>
          <div className={style.infoTitle}>結餘</div>
          <div className={style.infoValue}>$ {summary.end_of_day_balance}</div>
        </div>
        <div className={style.info}>
          <div className={style.infoTitle}>毛利</div>
          <div className={style.infoValue}>$ {summary.net_gross_profit}</div>
        </div>
        <div className={style.info}>
          <div className={style.infoTitle}>毛利率</div>
          <div className={style.infoValue}>{(summary.net_gross_profit_percentage)}%</div>
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
              <th>毛利</th>
              <th>日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => (
              <tr key={`${m.order_no}-${m.type}`}>
                <td>{m.order_no}</td>
                <td className={classNames(m.type===0 && style.saleType,(m.type===2||m.type===3) && style.orderType,(m.type===1||m.type===4) && style.refundType)}>{SaleTypeMap[m.type]}</td>
                <td>{m.product_id}</td>
                <td>{m.specification}</td>
                <td>{m.total_quantity}<br/>{formattedQuantity(m.quantities)}</td>
                <td>$ {m.price*m.total_quantity}</td>
                <td>{getPrepaid(m)}</td>
                <td>{m.type===3 ? "$ " + m.amount : ""}</td>
                <td>{getProfit(m)}</td>    
                <td>{formattedDate(m.paid_date)}</td>                
                <td>
                  <div className={style.actions}>
                  <button className={style.detailBtn} onClick={() => getDetail(m.order_no,m.type)}>
                    詳細
                  </button>
                  {checkToday(m.paid_date) && m.type!==4 && <button className={style.deleteBtn} onClick={()=>handleDelete(m.order_no,m.type)}>
                    取消
                  </button>}
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