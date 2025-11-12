import style from "./ManufactorRestock.module.css";
import { FaPlus } from "react-icons/fa6";
import CreateManufactorRestock from "../../../component/ManufactorRestock/CreateManufactorRestock";
import ShowManufactorRestock from "../../../component/ManufactorRestock/ShowManufactorRestock";
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
interface Restock {
  restock_id: string;
  transaction:  string;
  create_date:string
}
interface RestockDetail {
  transaction:string,
  restock_id:string,
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
    available_quantity:string
  }],
  price:string,
  product_type1:string,
  product_type2:string,
  product_type3:string,
  product_type4:string,
  remark: string,
}
function ManufactorRestock() {
  const dispatch = useDispatch()
  const [isToday, setIsToday] = useState(true);
  const [sort, setSort] = useState<'ASC' | 'DESC'>('DESC');
  const [searchType, setSearchType] = useState('restock_id');
  const [filter, setFilter] = useState({
    restock_id: '',
    transaction: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openCreate,setOpenCreate] = useState(false);
  const [openShow,setOpenShow] = useState(false);
  const [data, setDate] = useState<Restock[]>([]);
  const [detail, setDetail] = useState<RestockDetail>(
    {
      transaction:"",
      restock_id:"",
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
        available_quantity:""
      }],
      price:"",
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
      const res = await axios.post('/api/restock/list',{page,pageSize:10,filter,sort,isToday});
      setDate(res.data.data.list);
      setTotalPages(res.data.data.totalPages);
      const countRes = await axios.post('/api/stock/safe_count');
      dispatch(getSafeStockCount(countRes.data.data.total));
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const getDetail = async (restock_id:string) => {
    try {
      const res = await axios.post('/api/restock/detail',{restock_id});
      if(res.data.code==='000'){
        setDetail(res.data.data);
        setOpenShow(true);
      }
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
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
        transaction: '',
      })
    }else{
      setFilter({
        restock_id: '',
        transaction: value,
      })
    }
  }
  const handleSetSearchType = (value:string) => {
    setSearchType(value);
    setFilter({ restock_id: '', transaction: '' });
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
      {openCreate && <CreateManufactorRestock 
      onClose={() => setOpenCreate(false)} 
      onSuccess={() => {
        setOpenCreate(false);
        getList(); 
      }}/>}
      {openShow && <ShowManufactorRestock 
      onClose={() => setOpenShow(false)} detail={detail} />}
      <div className={style.topContainer}>
        <div className={style.title}>廠商進貨</div>
        <div className={style.button} onClick={()=>setOpenCreate(true)}><FaPlus/>開始進貨</div>
      </div>
      <div className={style.searchContainer}>
        <select value={searchType} onChange={(e)=>handleSetSearchType(e.target.value)} className={style.searchSelect}>
          <option value="restock_id">進貨單號</option>
          <option value="transaction">交易類型</option>
        </select>
        {searchType==='restock_id' && <input type="text" placeholder="搜尋關鍵字" value={filter.restock_id} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
        {searchType==='transaction' && <input type="text" placeholder="搜尋關鍵字" value={filter.transaction} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
      </div>
       <FormControlLabel
        control={
        <Switch
          checked={isToday}
          onChange={(e) => setIsToday(e.target.checked)}
        />
        }
        label={isToday ? '今日進貨' : '全部進貨'}
      />
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
              <th>交易類型</th>
              <th>時間</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => (
              <tr key={m.restock_id}>
                <td>{m.restock_id}</td>
                <td>{m.transaction}</td>
                <td>{formattedDate(m.create_date)}</td>
                <td className={style.actions}>
                  <button className={style.detailBtn} onClick={() => getDetail(m.restock_id)}>
                    詳細
                  </button>
                  <button className={style.deleteBtn} onClick={()=>handleDelete(m.restock_id)}>
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

export default ManufactorRestock;