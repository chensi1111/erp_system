import style from "./StockHistory.module.css";
import ShowStockHistory from "../../../component/StockHistory/ShowStockHistory";
import { useState,useEffect,useRef } from "react";
import axios from '../../../api/axios'
import {toast} from 'react-toastify'
import Pagination from '@mui/material/Pagination';
import { IoIosArrowDropup ,IoIosArrowDropdown   } from "react-icons/io";
import classNames from "classnames";
interface Quantities {
    size:string,
    quantity:string,
    safe_stock:string
} 
interface Stock {
  product_id: string;
  specification: string;
  product_name:string;
  change_type:string,
  change_number:string,
  total_quantity:number
  }
interface StockDetail {
  product_id: string;
  specification: string;
  product_name:string;
  change_type:string,
  change_number:string,
  total_quantity:number,
  create_date:string,
  quantities:Quantities[];
}
function StockHistory() {
  const [sort, setSort] = useState<'ASC' | 'DESC'>('DESC');
  const [searchType, setSearchType] = useState('change_number');
  const [filter, setFilter] = useState({
    change_number: '',
    product_name: '',
    change_type:""
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openShow,setOpenShow] = useState(false);
  const [data, setDate] = useState<Stock[]>([]);
  const [detail, setDetail] = useState<StockDetail>(
    {
      product_id: '',
      specification: '',
      product_name:'',
      change_type:'',
      change_number:'',
      total_quantity:0,
      create_date:'',
      quantities:[]
    }
  );
  const debounceRef = useRef<number | null>(null);
  const getList = async () => {
    try {
      const res = await axios.post('/api/stock/history',{page,pageSize:10,filter,sort});
      setDate(res.data.data.list);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const getDetail = async (change_number:string,change_type:string) => {
    try {
      const res = await axios.post('/api/stock/history_detail',{change_number,change_type});
      if(res.data.code==='000'){
        setDetail(res.data.data);
        setOpenShow(true);
      }
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  
  const handleSetFilter = (value:string) => {
    if(searchType==='change_number'){
      setFilter({
        change_number: value,
        product_name: '',
        change_type:""
      })
    }else if(searchType==='product_name'){
      setFilter({
        change_number: '',
        product_name: value,
        change_type:""
      })
    }else {
      setFilter({
        change_number: '',
        product_name: '',
        change_type:value
      })
    }
  }
  const handleSetSearchType = (value:string) => {
    setSearchType(value);
    setFilter({ change_number: '', product_name: '',change_type:"" });
  }
  const formattedQuantity = (type:string,value:number|string) => {
    if(type==='訂貨'||type==='訂貨取消'){
      return ''
    }else if(type==='銷貨'|| type ==='進貨取消' || type==='收貨'){
      return `- ${value}`
    }else {
      return `+ ${value}`
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
  }, [page,sort]);

  return (
    <div className={style.container}>
      {openShow && <ShowStockHistory 
      onClose={() => setOpenShow(false)} detail={detail}/>}
      <div className={style.topContainer}>
        <div className={style.title}>庫存記錄</div>
      </div>
      <div className={style.searchContainer}>
        <select value={searchType} onChange={(e)=>handleSetSearchType(e.target.value)} className={style.searchSelect}>
          <option value="change_number">庫存單號</option>
          <option value="product_name">商品名稱</option>
          <option value="change_type">類型</option>
        </select>
        {searchType==='change_number' && <input type="text" placeholder="搜尋關鍵字" value={filter.change_number} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
        {searchType==='product_name' && <input type="text" placeholder="搜尋關鍵字" value={filter.product_name} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
        {searchType==='change_type' && <input type="text" placeholder="搜尋關鍵字" value={filter.change_type} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
      </div>
       <div className={style.tableContainer}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>
                <span>庫存單號</span>
                {sort === 'ASC' ? (
                  <IoIosArrowDropup onClick={() => setSort('DESC')} className={style.icon} />
                ) : (
                 <IoIosArrowDropdown onClick={() => setSort('ASC')} className={style.icon} />
                )}
              </th>
              <th>商品型號</th>
              <th>商品規格</th>
              <th>商品名稱</th>
              <th>類型</th>
              <th>變更量</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => (
              <tr key={`${m.change_number}-${m.change_type}`}>
                <td>{m.change_number}</td>
                <td>{m.product_id}</td>
                <td>{m.specification}</td>
                <td>{m.product_name}</td>
                <td className={classNames(m.change_type==='進貨' && style.restockType,m.change_type==='銷貨' && style.saleType,(m.change_type==='訂貨'||m.change_type==='收貨') && style.orderType,(m.change_type==='銷貨取消'||m.change_type==='進貨取消'||m.change_type==='訂貨取消'||m.change_type==='收貨取消') && style.cancelType)}>{m.change_type}</td>
                <td>{formattedQuantity(m.change_type,m.total_quantity)}</td>
                <td className={style.actions}>
                  <button className={style.detailBtn} onClick={() => getDetail(m.change_number,m.change_type)}>
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

export default StockHistory;