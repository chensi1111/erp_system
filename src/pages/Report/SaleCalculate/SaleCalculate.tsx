import style from "./SaleCalculate.module.css";
import ShowSaleCalculate from "../../../component/SaleCalculate/ShowSaleCalculate";
import { useState,useEffect,useRef } from "react";
import axios from '../../../api/axios'
import {toast} from 'react-toastify'
import Pagination from '@mui/material/Pagination';
import dayjs, { Dayjs } from "dayjs";
import 'dayjs/locale/zh-tw';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IoIosArrowDropup ,IoIosArrowDropdown   } from "react-icons/io";
interface Report {
  manufactor:string,
  manufactor_name:string,
  total_quantity:string,
  total_price:string
}
interface Detail {
  restock_id:string,
  create_date:string,
  total_quantity:string,
  total_price:string
}

function SaleCalculate() {
  dayjs.locale('zh-tw');
  const currentYear = dayjs();
  const [sort, setSort] = useState<'ASC' | 'DESC'>('DESC');
  const [searchType, setSearchType] = useState('manufactor');
  const [filter, setFilter] = useState({
    manufactor: '',
    manufactor_name: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSale, setTotalSale] = useState('')
  const [totalQuantity, setTotalQuantity] = useState('')
  const [openShow,setOpenShow] = useState(false);
  const [data, setData] = useState<Report[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [detail, setDetail] = useState<Detail[]>([]);
  const [manufactorInfo,setManufactorInfo] = useState({
    manufactor:"",
    manufactor_name:"",
    total_quantity:"",
    total_price:"",
  })
  const debounceRef = useRef<number | null>(null);
  const getList = async () => {
    try {
      const res = await axios.post('/api/report/sale_list',{page,pageSize:10,filter,sort,selectedDate:selectedDate?.format("YYYY-MM")});
      setData(res.data.data.list);
      setTotalPages(res.data.data.totalPages);
      setTotalSale(res.data.data.summary.total_sale_amount);
      setTotalQuantity(res.data.data.summary.total_sale_volume);
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const getDetail = async (info:any) => {
    const {manufactor,manufactor_name,total_quantity,total_price} =info
    try {
      const res = await axios.post('/api/report/sale_detail',{manufactor});
      if(res.data.code==='000'){
        setDetail(res.data.data.list);
        setOpenShow(true);
        setManufactorInfo({
          manufactor,
          manufactor_name,
          total_quantity,
          total_price,
        })
      }
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const handleSetFilter = (value:string) => {
    if(searchType==='manufactor'){
      setFilter({
        manufactor: value,
        manufactor_name: '',
      })
    }else{
      setFilter({
        manufactor: '',
        manufactor_name: value,
      })
    }
  }
  const handleSetSearchType = (value:string) => {
    setSearchType(value);
    setFilter({ manufactor: '', manufactor_name: '' });
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
   getList();
  }, [page,sort,selectedDate]);
  return (
    <div className={style.container}>
      {openShow && <ShowSaleCalculate 
      onClose={() => setOpenShow(false)} detail={detail} manufactorInfo={manufactorInfo} selectedDate={selectedDate} />}
      <div className={style.topContainer}>
        <div className={style.title}>廠商銷貨總表</div>
      </div>
      <div className={style.searchContainer}>
        <select value={searchType} onChange={(e)=>handleSetSearchType(e.target.value)} className={style.searchSelect}>
          <option value="manufactor">廠商編號</option>
          <option value="manufactor_name">廠商名稱</option>
        </select>
        {searchType==='manufactor' && <input type="text" placeholder="搜尋關鍵字" value={filter.manufactor} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
        {searchType==='manufactor_name' && <input type="text" placeholder="搜尋關鍵字" value={filter.manufactor_name} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
      </div>
      <div className={style.dateContainer}>
    <LocalizationProvider dateAdapter={AdapterDayjs}  adapterLocale="zh-tw">
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
        sx={{ minWidth: 250 }}
      />
    </LocalizationProvider>
        <div className={style.infoContainer}>
          <div className={style.infoItem}><span>總銷貨量:</span>{totalQuantity}</div>
          <div className={style.infoItem}><span>總銷貨額:</span>$ {totalSale}</div>
        </div>
    </div>
       <div className={style.tableContainer}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>
                <span>廠商編號</span>
                {sort === 'ASC' ? (
                  <IoIosArrowDropup onClick={() => setSort('DESC')} className={style.icon} />
                ) : (
                 <IoIosArrowDropdown onClick={() => setSort('ASC')} className={style.icon} />
                )}
              </th>
              <th>廠商名稱</th>
              <th>總銷貨量</th>
              <th>總銷貨額</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => (
              <tr key={m.manufactor}>
                <td>{m.manufactor}</td>
                <td>{m.manufactor_name}</td>
                <td>{m.total_quantity}</td>
                <td>{"$ "+m.total_price}</td>
                <td className={style.actions}>
                  <button className={style.detailBtn} onClick={() => getDetail(m)}>
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
      {data.length >0 && <Pagination count={totalPages} page={page} onChange={(_, val) => setPage(val)} siblingCount={0} boundaryCount={1} sx={{ul: {whiteSpace: 'nowrap', display: 'flex', flexWrap: 'nowrap', justifyContent: 'center' }}}/>}
    </div>
  )   
}

export default SaleCalculate;