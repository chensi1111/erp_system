import style from "./ManufactorRestock.module.css";
import { FaPlus } from "react-icons/fa6";
import ManufactorRestockTable from "../../../component/ManufactorRestock/ManufactorRestockTable";
import ShowManufactorRestockTable from "../../../component/ManufactorRestock/ShowManufactorRestockTable";
import { useState,useEffect,useRef } from "react";
import axios from '../../../api/axios'
import {toast} from 'react-toastify'
import Pagination from '@mui/material/Pagination';
import { IoIosArrowDropup ,IoIosArrowDropdown   } from "react-icons/io"; 
import dayjs, { Dayjs } from "dayjs";
import 'dayjs/locale/zh-tw';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Switch, FormControlLabel } from '@mui/material';
import { useDispatch } from "react-redux";
import { getProductInfoRelation } from "../../../store/productInfoRelationSlice";
import { getSafeStockCount } from "../../../store/safeStcokSlice";
interface Restock {
  restock_id: string;
  manufactor:string;
  total_quantity:number;
  total_price:number;
  date:string
}
const formattedDate = (dateString: string) => {
  return dayjs(dateString).format('YYYY/MM/DD');
}
function ManufactorRestock() {
  const dispatch = useDispatch()
  const currentYear = dayjs();
  const [showOneDay,setShowOneDay] =useState(true)
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [sort, setSort] = useState<'ASC' | 'DESC'>('DESC');
  const [searchType, setSearchType] = useState('restock_id');
  const [filter, setFilter] = useState({
    restock_id: '',
    manufactor:''
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openCreate,setOpenCreate] = useState(false);
  const [openShow,setOpenShow] = useState(false);
  const [data, setData] = useState<Restock[]>([]);
  const [detail, setDetail] = useState<any>(null)
  const [total_quantity, setTotalQuantity] =useState(0)
  const [total_price, setTotalPrice] =useState(0)
  const debounceRef = useRef<number | null>(null);
  const getList = async () => {
    try {
      const res = await axios.post('/api/restock/list',{page,pageSize:10,filter,sort,showOneDay,selectedDate});
      setData(res.data.data.list);
      setTotalQuantity(res.data.data.total_quantity_sum)
      setTotalPrice(res.data.data.total_price_sum)
      setTotalPages(res.data.data.totalPages);
      const countRes = await axios.post('/api/stock/safe_count');
      dispatch(getSafeStockCount(countRes.data.data.total));
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const handleDetail = async (restock_id:string) => {
    try {
      const res = await axios.post('/api/restock/detail',{restock_id});
      if(res.data.code==='000'){
        setDetail(res.data.data)
        setOpenShow(true)
      }
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  }
  const handleDelete = async (restock_id:string) => {
    try {
      const res = await axios.post('/api/restock/delete',{restock_id});
      if(res.data.code==='000'){
        toast.success('取消成功');
        const updateData = data.filter(item => item.restock_id !== restock_id);
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
    if(searchType==='restock_id'){
      setFilter({
        restock_id: value,
        manufactor:''
      })
    }else{
      setFilter({
        restock_id: '',
        manufactor:value
      })
    }
  }
  const handleSetSearchType = (value:string) => {
    setSearchType(value);
    setFilter({ restock_id: '',manufactor:''});
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
   getList();
  }, [page,sort,showOneDay,selectedDate]);
  useEffect(() => {
    createProductInfos()
  },[])
  return (
    <div className={style.container}>
      {openCreate && <ManufactorRestockTable 
      onClose={() => setOpenCreate(false)} 
      onSuccess={() => {
        setOpenCreate(false);
        getList(); 
      }}/>}
      {openShow && <ShowManufactorRestockTable
      detail={detail} 
      onClose={() => setOpenShow(false)} 
      />}
      <div className={style.topContainer}>
        <div className={style.title}>廠商進貨</div>
        <div className={style.button} onClick={()=>setOpenCreate(true)}><FaPlus/>開始進貨</div>
      </div>
      <div className={style.searchContainer}>
        <select value={searchType} onChange={(e)=>handleSetSearchType(e.target.value)} className={style.searchSelect}>
          <option value="restock_id">進貨單號</option>
          <option value="manufactor">廠商代號</option>
        </select>
        {searchType==='restock_id' && <input type="text" placeholder="搜尋關鍵字" value={filter.restock_id} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
        {searchType==='manufactor' && <input type="text" placeholder="搜尋關鍵字" value={filter.manufactor} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
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
          label="選擇年月"
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
        <div className={style.info}>總數量 : <span>{total_quantity}</span></div>
        <div className={style.info}>總金額 : <span>$ {total_price}</span></div>
      </div>
      </div>
       <div className={style.tableContainer}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>
                <span>進貨單號</span>
                {sort === 'ASC' ? (
                  <IoIosArrowDropup onClick={() => setSort('DESC')} className={style.icon} />
                ) : (
                 <IoIosArrowDropdown onClick={() => setSort('ASC')} className={style.icon} />
                )}
              </th>
              <th>廠商代號</th>
              <th>總數量</th>
              <th>總金額</th>
              <th>日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => (
              <tr key={m.restock_id}>
                <td>{m.restock_id}</td>
                <td>{m.manufactor}</td>
                <td>{m.total_quantity}</td>
                <td>$ {m.total_price}</td>
                <td>{formattedDate(m.date)}</td>
                <td className={style.actions}>
                  <button className={style.detailBtn} onClick={()=>handleDetail(m.restock_id)}>
                    詳細
                  </button>
                  <button className={style.deleteBtn} onClick={()=>handleDelete(m.restock_id)}>
                    退貨
                  </button>
                </td>
              </tr>
            ))}
            {data.length===0 && <tr>
              <td colSpan={6} style={{textAlign:'center',padding:'20px 0'}}>查無資料</td>
            </tr>}
          </tbody>
        </table>
      </div>
      {data.length >0 && <Pagination count={totalPages} page={page} onChange={(_, val) => setPage(val)} siblingCount={0} boundaryCount={1} sx={{ul: {whiteSpace: 'nowrap', display: 'flex', flexWrap: 'nowrap', justifyContent: 'center' }}}/>}
    </div>
  )   
}

export default ManufactorRestock;