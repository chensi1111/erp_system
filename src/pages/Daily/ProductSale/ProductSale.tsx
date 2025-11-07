import style from "./ProductSale.module.css";
import { FaPlus } from "react-icons/fa6";
import CreateProductSale from "../../../component/ProductSale/CreateProductSale";
import ShowProductSale from "../../../component/ProductSale/ShowProductSale";
import { useState,useEffect,useRef } from "react";
import axios from '../../../api/axios'
import {toast} from 'react-toastify'
import Pagination from '@mui/material/Pagination';
import { IoIosArrowDropup ,IoIosArrowDropdown   } from "react-icons/io"; 
import { Switch, FormControlLabel } from '@mui/material';
import { useDispatch } from "react-redux";
import { getProductInfoRelation } from "../../../store/productInfoRelationSlice";
import { getSafeStockCount } from "../../../store/safeStcokSlice";
interface Sale {
  sale_id: string;
  transaction:  string;
}
interface SaleDetail {
  transaction:string,
  sale_id:string,
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
  price:string,
  product_type1:string,
  product_type2:string,
  product_type3:string,
  product_type4:string,
  remark: string,
}
function ProductSale() {
  const dispatch = useDispatch()
  const [isToday, setIsToday] = useState(true);
  const [sort, setSort] = useState<'ASC' | 'DESC'>('DESC');
  const [searchType, setSearchType] = useState('sale_id');
  const [filter, setFilter] = useState({
    sale_id: '',
    transaction: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openCreate,setOpenCreate] = useState(false);
  const [openShow,setOpenShow] = useState(false);
  const [data, setDate] = useState<Sale[]>([]);
  const [detail, setDetail] = useState<SaleDetail>(
    {
      transaction:"",
      sale_id:"",
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
      const res = await axios.post('/api/sale/list',{page,pageSize:10,filter,sort,isToday});
      setDate(res.data.data.list);
      setTotalPages(res.data.data.totalPages);
      const countRes = await axios.post('/api/stock/safe_count');
      dispatch(getSafeStockCount(countRes.data.data.total));
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const getDetail = async (sale_id:string) => {
    try {
      const res = await axios.post('/api/sale/detail',{sale_id});
      if(res.data.code==='000'){
        setDetail(res.data.data);
        setOpenShow(true);
      }
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const handleDelete = async (sale_id:string) => {
    try {
      const res = await axios.post('/api/sale/delete',{sale_id});
      if(res.data.code==='000'){
        toast.success('作廢成功');
        const updateData = data.filter(item => item.sale_id !== sale_id);
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
    if(searchType==='sale_id'){
      setFilter({
        sale_id: value,
        transaction: '',
      })
    }else{
      setFilter({
        sale_id: '',
        transaction: value,
      })
    }
  }
  const handleSetSearchType = (value:string) => {
    setSearchType(value);
    setFilter({ sale_id: '', transaction: '' });
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
  }, [page,sort,isToday]);
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
      {openShow && <ShowProductSale 
      onClose={() => setOpenShow(false)} detail={detail} />}
      <div className={style.topContainer}>
        <div className={style.title}>前台銷貨</div>
        <div className={style.button} onClick={()=>setOpenCreate(true)}><FaPlus/>新增銷貨</div>
      </div>
      <div className={style.searchContainer}>
        <select value={searchType} onChange={(e)=>handleSetSearchType(e.target.value)} className={style.searchSelect}>
          <option value="sale_id">銷貨單號</option>
          <option value="transaction">交易類型</option>
        </select>
        {searchType==='sale_id' && <input type="text" placeholder="搜尋關鍵字" value={filter.sale_id} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
        {searchType==='transaction' && <input type="text" placeholder="搜尋關鍵字" value={filter.transaction} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
      </div>
       <FormControlLabel
        control={
        <Switch
          checked={isToday}
          onChange={(e) => setIsToday(e.target.checked)}
        />
        }
        label={isToday ? '今日銷貨' : '全部銷貨'}
      />
       <div className={style.tableContainer}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>
                <span>銷貨單號</span>
                {sort === 'ASC' ? (
                  <IoIosArrowDropup onClick={() => setSort('DESC')} className={style.icon} />
                ) : (
                 <IoIosArrowDropdown onClick={() => setSort('ASC')} className={style.icon} />
                )}
              </th>
              <th>交易類型</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => (
              <tr key={m.sale_id}>
                <td>{m.sale_id}</td>
                <td>{m.transaction}</td>
                <td className={style.actions}>
                  <button className={style.detailBtn} onClick={() => getDetail(m.sale_id)}>
                    詳細
                  </button>
                  <button className={style.deleteBtn} onClick={()=>handleDelete(m.sale_id)}>
                    作廢
                  </button>
                </td>
              </tr>
            ))}
            {data.length===0 && <tr>
              <td colSpan={3} style={{textAlign:'center',padding:'20px 0'}}>查無資料</td>
            </tr>}
          </tbody>
        </table>
      </div>
      {data.length >0 && <Pagination count={totalPages} page={page} onChange={(_, val) => setPage(val)} siblingCount={0} boundaryCount={1} sx={{ul: {whiteSpace: 'nowrap', display: 'flex', flexWrap: 'nowrap', justifyContent: 'center' }}}/>}
    </div>
  )   
}

export default ProductSale;