import style from "./SaleCalculate.module.css";
import { useState,useEffect,useRef } from "react";
import axios, { type ApiError } from '../../../api/axios'
import {toast} from 'react-toastify'
import dayjs, { Dayjs } from "dayjs";
import 'dayjs/locale/zh-tw';
// component
import ShowSaleCalculate from "../../../component/SaleCalculate/ShowSaleCalculate";
// mui
import Pagination from '@mui/material/Pagination';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// icon
import arrowDropUp from "../../../assets/icons/arrowDropUp.svg"
import arrowDropDown from "../../../assets/icons/arrowDropDown.svg"
interface Report {
  manufactor:string,
  manufactor_name:string,
  order_quantity:number,
  order_amount:number,
  sale_quantity:number,
  sale_amount:number
}
interface Summary {
  total_sale_volume: number,
  total_sale_amount: number,
  total_order_volume: number,
  total_order_amount: number
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
  const [summary,setSummary] = useState<Summary>({
    total_sale_volume: 0,
    total_sale_amount: 0,
    total_order_volume: 0,
    total_order_amount: 0
  })
  const [openShow,setOpenShow] = useState(false);
  const [data, setData] = useState<Report[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [manufactorInfo,setManufactorInfo] = useState({
    manufactor:"",
    manufactor_name:"",
    order_quantity:0,
    order_amount:0,
    sale_quantity:0,
    sale_amount:0
  })
  const debounceRef = useRef<number | null>(null);
  const getList = async () => {
    try {
      const res = await axios.post('/api/report/sale_list',{page,pageSize:10,filter,sort,selectedDate:selectedDate?.format("YYYY-MM")});
      setData(res.data.data.list);
      setTotalPages(res.data.data.totalPages);
      setSummary(res.data.data.summary)
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const getDetail = async (info: Report) => {
    const {manufactor,manufactor_name,order_quantity,order_amount,sale_quantity,sale_amount} =info
        setOpenShow(true);
        setManufactorInfo({
          manufactor,
          manufactor_name,
          order_quantity,
          order_amount,
          sale_quantity,
          sale_amount
        })
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
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setData([])
   getList();
  }, [page,sort,selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={style.container}>
      {openShow && <ShowSaleCalculate 
      onClose={() => setOpenShow(false)} manufactorInfo={manufactorInfo} selectedDate={selectedDate} />}
      <div className={style.topContainer}>
        <div className={style.title}>廠商銷貨總表</div>
      </div>
      <div className={style.allSearch}>
        <div className={style.searchContainer}>
        <select value={searchType} onChange={(e)=>handleSetSearchType(e.target.value)} className={style.searchSelect}>
          <option value="manufactor">廠商編號</option>
          <option value="manufactor_name">廠商名稱</option>
        </select>
        {searchType==='manufactor' && <input type="text" placeholder="搜尋關鍵字" value={filter.manufactor} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
        {searchType==='manufactor_name' && <input type="text" placeholder="搜尋關鍵字" value={filter.manufactor_name} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
      </div>
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
      </div>
    <div className={style.infos}>
          <div className={style.info}>
            <div className={style.infoTitle}>總銷貨量</div>
            <div className={style.infoValue}>{summary.total_sale_volume}</div>
          </div>
          <div className={style.info}>
            <div className={style.infoTitle}>總銷貨額</div>
            <div className={style.infoValue}>$ {summary.total_sale_amount}</div>
          </div>
          <div className={style.info}>
            <div className={style.infoTitle}>訂貨中數量</div>
            <div className={style.infoValue}>{summary.total_order_volume}</div>
          </div>
          <div className={style.info}>
            <div className={style.infoTitle}>訂貨中金額</div>
            <div className={style.infoValue}>$ {summary.total_order_amount}</div>
          </div>
      </div>
       <div className={style.tableContainer}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>
                <span>廠商編號</span>
                {sort === 'ASC' ? (
                  <img src={arrowDropUp} alt="arrowUp" onClick={() => setSort('DESC')} className={style.icon} />
                ) : (
                 <img src={arrowDropDown} alt="arrowDown" onClick={() => setSort('ASC')} className={style.icon} />
                )}
              </th>
              <th>廠商名稱</th>
              <th>訂貨中數量</th>
              <th>訂貨中金額</th>
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
                <td>{m.order_quantity}</td>
                <td>$ {m.order_amount}</td>
                <td>{m.sale_quantity}</td>
                <td>$ {m.sale_amount}</td>
                <td className={style.actions}>
                  <button className={style.detailBtn} onClick={() => getDetail(m)}>
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