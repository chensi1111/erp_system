import style from "./ProductOrder.module.css";
import { FaPlus } from "react-icons/fa6";
import CreateProductOrder from "../../../component/ProductOrder/CreateProductOrder";
import ShowProductOrder from "../../../component/ProductOrder/ShowProductOrder";
import { useState,useEffect,useRef } from "react";
import axios from '../../../api/axios'
import dayjs from "dayjs";
import {toast} from 'react-toastify'
import Pagination from '@mui/material/Pagination';
import { IoIosArrowDropup ,IoIosArrowDropdown   } from "react-icons/io"; 
import { Switch, FormControlLabel } from '@mui/material';
import { useDispatch } from "react-redux";
import { getProductInfoRelation } from "../../../store/productInfoRelationSlice";
import { getSafeStockCount } from "../../../store/safeStcokSlice";
interface Order {
  order_id: string;
  product_id:  string;
  create_date:string
}
interface OrderDetail {
  product_id:string,
  order_id:string,
  create_date:string,
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
  price:string,
  prepaid_price:string,
  remaining_price:string,
  product_type1:string,
  product_type2:string,
  product_type3:string,
  product_type4:string,
  remark: string,
}
function ProductOrder() {
  const dispatch = useDispatch()
  const [isToday, setIsToday] = useState(true);
  const [sort, setSort] = useState<'ASC' | 'DESC'>('DESC');
  const [searchType, setSearchType] = useState('order_id');
  const [filter, setFilter] = useState({
    order_id: '',
    product_id: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openCreate,setOpenCreate] = useState(false);
  const [openShow,setOpenShow] = useState(false);
  const [data, setDate] = useState<Order[]>([]);
  const [detail, setDetail] = useState<OrderDetail>(
    {
      product_id:"",
      order_id:"",
      create_date:"",
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
      price:"",
      prepaid_price:"",
      remaining_price:"",
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
      const res = await axios.post('/api/order/list',{page,pageSize:10,filter,sort,isToday});
      setDate(res.data.data.list);
      setTotalPages(res.data.data.totalPages);
      const countRes = await axios.post('/api/stock/safe_count');
      dispatch(getSafeStockCount(countRes.data.data.total));
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const getDetail = async (order_id:string) => {
    try {
      const res = await axios.post('/api/order/detail',{order_id});
      if(res.data.code==='000'){
        setDetail(res.data.data);
        setOpenShow(true);
      }
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const handleDelete = async (order_id:string) => {
    try {
      const res = await axios.post('/api/order/delete',{order_id});
      if(res.data.code==='000'){
        toast.success('取消成功');
        const updateData = data.filter(item => item.order_id !== order_id);
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
  const handleSetFilter = (value:string) => {
    if(searchType==='order_id'){
      setFilter({
        order_id: value,
        product_id: '',
      })
    }else{
      setFilter({
        order_id: '',
        product_id: value,
      })
    }
  }
  const handleSetSearchType = (value:string) => {
    setSearchType(value);
    setFilter({ order_id: '', product_id: '' });
  }
  const createProductInfos=async()=>{
    const response = await axios.post('/api/product/info');
    if(response.data.code=='000') {
      dispatch(getProductInfoRelation(response.data.data))
    }
  }
   const formattedDate = (dateString: string) => {
      return dayjs(dateString).format('YYYY/MM/DD HH:mm:ss');
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
  }, [page,sort,isToday]);
  useEffect(() => {
    createProductInfos()
  },[])
  return (
    <div className={style.container}>
      {openCreate && <CreateProductOrder 
      onClose={() => setOpenCreate(false)} 
      onSuccess={() => {
        setOpenCreate(false);
        getList(); 
      }}/>}
      {openShow && <ShowProductOrder 
      onClose={() => 
      setOpenShow(false)}
      detail={detail}
      onSuccess={() => {
        setOpenShow(false);
        getList(); 
      }}/>}
      <div className={style.topContainer}>
        <div className={style.title}>前台訂貨</div>
        <div className={style.button} onClick={()=>setOpenCreate(true)}><FaPlus/>新增訂貨</div>
      </div>
      <div className={style.searchContainer}>
        <select value={searchType} onChange={(e)=>handleSetSearchType(e.target.value)} className={style.searchSelect}>
          <option value="order_id">訂貨單號</option>
          <option value="product_id">商品編號</option>
        </select>
        {searchType==='order_id' && <input type="text" placeholder="搜尋關鍵字" value={filter.order_id} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
        {searchType==='product_id' && <input type="text" placeholder="搜尋關鍵字" value={filter.product_id} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
      </div>
       <FormControlLabel
        control={
        <Switch
          checked={isToday}
          onChange={(e) => setIsToday(e.target.checked)}
        />
        }
        label={isToday ? '今日訂貨' : '全部訂貨'}
      />
       <div className={style.tableContainer}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>
                <span>訂貨單號</span>
                {sort === 'ASC' ? (
                  <IoIosArrowDropup onClick={() => setSort('DESC')} className={style.icon} />
                ) : (
                 <IoIosArrowDropdown onClick={() => setSort('ASC')} className={style.icon} />
                )}
              </th>
              <th>商品編號</th>
              <th>時間</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => (
              <tr key={m.order_id}>
                <td>{m.order_id}</td>
                <td>{m.product_id}</td>
                <td>{formattedDate(m.create_date)}</td>
                <td className={style.actions}>
                  <button className={style.detailBtn} onClick={() => getDetail(m.order_id)}>
                    詳細
                  </button>
                  <button className={style.deleteBtn} onClick={()=>handleDelete(m.order_id)}>
                    取消
                  </button>
                </td>
              </tr>
            ))}
            {data.length===0 && <tr>
              <td colSpan={4} style={{textAlign:'center',padding:'20px 0'}}>查無資料</td>
            </tr>}
          </tbody>
        </table>
      </div>
      {data.length >0 && <Pagination count={totalPages} page={page} onChange={(_, val) => setPage(val)} siblingCount={0} boundaryCount={1} sx={{ul: {whiteSpace: 'nowrap', display: 'flex', flexWrap: 'nowrap', justifyContent: 'center' }}}/>}
    </div>
  )   
}

export default ProductOrder;