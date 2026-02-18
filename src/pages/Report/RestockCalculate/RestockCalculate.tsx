import style from "./RestockCalculate.module.css";
import { useState,useEffect,useRef } from "react";
import axios from '../../../api/axios'
import {toast} from 'react-toastify'
import dayjs, { Dayjs } from "dayjs";
import 'dayjs/locale/zh-tw';
// component
import ShowRestockCalculate from "../../../component/RestockCalculate/ShowRestockCalculate";
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
  total_in_quantity: string,
  total_in_price: string,
  total_return_quantity: string,
  total_return_price: string
}
interface Summary {
  total_in_quantity: string,
  total_in_price: string,
  total_return_quantity: string,
  total_return_price: string
}

function RestockCalculate() {
  dayjs.locale('zh-tw');
  const currentYear = dayjs();
  const [sort, setSort] = useState<'ASC' | 'DESC'>('DESC');
  const [searchType, setSearchType] = useState('manufactor');
  const [filter, setFilter] = useState({
    manufactor: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [summary,setSummary] = useState<Summary>({
    total_in_quantity: '0',
    total_in_price: '0',
    total_return_quantity: '0',
    total_return_price: '0'
  });
  const [openShow,setOpenShow] = useState(false);
  const [data, setData] = useState<Report[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [manufactorInfo,setManufactorInfo] = useState({
    manufactor:"",
    manufactor_name:"",
    total_in_quantity:"",
    total_in_price:"",
    total_return_quantity:"",
    total_return_price:""
  })
  const debounceRef = useRef<number | null>(null);
  const getList = async () => {
    try {
      const res = await axios.post('/api/report/restock_list',{page,pageSize:10,filter,sort,selectedDate:selectedDate?.format("YYYY-MM")});
      setData(res.data.data.list);
      setTotalPages(res.data.data.totalPages);
      setSummary(res.data.data.summary);
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const getDetail = async (info:any) => {
    const {manufactor,manufactor_name,total_in_price,total_in_quantity,total_return_quantity,total_return_price} =info
        setOpenShow(true);
        setManufactorInfo({
          manufactor,
          manufactor_name,
          total_in_quantity,
          total_in_price,
          total_return_quantity,
          total_return_price
        })
  };
  const handleSetFilter = (value:string) => {
    if(searchType==='manufactor'){
      setFilter({
        manufactor: value,
      })
    }
  }
  const handleSetSearchType = (value:string) => {
    setSearchType(value);
    setFilter({ manufactor: '' });
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
      {openShow && <ShowRestockCalculate 
      onClose={() => setOpenShow(false)} manufactorInfo={manufactorInfo} selectedDate={selectedDate} />}
      <div className={style.topContainer}>
        <div className={style.title}>廠商進退貨總表</div>
      </div>
      <div className={style.allSearch}>
        <div className={style.searchContainer}>
        <select value={searchType} onChange={(e)=>handleSetSearchType(e.target.value)} className={style.searchSelect}>
          <option value="manufactor">廠商編號</option>
        </select>
        {searchType==='manufactor' && <input type="text" placeholder="搜尋關鍵字" value={filter.manufactor} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
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
            <div className={style.infoTitle}>總進貨量</div>
            <div className={style.infoValue}>{summary.total_in_quantity}</div>
          </div>
          <div className={style.info}>
            <div className={style.infoTitle}>總進貨額</div>
            <div className={style.infoValue}>$ {summary.total_in_price}</div>
          </div>
          <div className={style.info}>
            <div className={style.infoTitle}>總退貨量</div>
            <div className={style.infoValue}>{summary.total_return_quantity}</div>
          </div>
          <div className={style.info}>
            <div className={style.infoTitle}>總退貨額</div>
            <div className={style.infoValue}>$ {summary.total_return_price}</div>
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
              <th>總進貨量</th>
              <th>總進貨額</th>
              <th>總退貨量</th>
              <th>總退貨額</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => (
              <tr key={m.manufactor}>
                <td>{m.manufactor}</td>
                <td>{m.manufactor_name}</td>
                <td>{m.total_in_quantity}</td>
                <td>{"$ "+m.total_in_price}</td>
                <td>{m.total_return_quantity}</td>
                <td>{"$ "+m.total_return_price}</td>
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

export default RestockCalculate;