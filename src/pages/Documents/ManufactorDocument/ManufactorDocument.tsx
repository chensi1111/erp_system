import style from "./ManufactorDocument.module.css";
import { FaPlus } from "react-icons/fa6";
import CreateManufactorDocument from "../../../component/ManufactorDocument/CreateManufactorDocument";
import ShowManufactorDocument from "../../../component/ManufactorDocument/ShowManufactorDocument";
import { useState,useEffect,useRef } from "react";
import axios from '../../../api/axios'
import {toast} from 'react-toastify'
import Pagination from '@mui/material/Pagination';
import { IoIosArrowDropup ,IoIosArrowDropdown   } from "react-icons/io"; 
interface Manufactor {
  manufactor_id: string;
  manufactor_name:  string;
}
interface ManufactorDetail {
  manufactor_id: string;
  manufactor_name:  string;
  unified_number: string;
  create_date: string;
  short_name: string;
  contact_person: string;
  phone: string;
  email: string;
  tax_rate: number;
  discount: number;
  ticket_period: number;
  remark: string;
}
function ManufactorDocument() {
  const [sort, setSort] = useState<'ASC' | 'DESC'>('ASC');
  const [searchType, setSearchType] = useState('manufactor_id');
  const [filter, setFilter] = useState({
    manufactor_id: '',
    manufactor_name: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openCreate,setOpenCreate] = useState(false);
  const [openShow,setOpenShow] = useState(false);
  const [data, setDate] = useState<Manufactor[]>([]);
  const [type, setType] = useState(false);
  const [detail, setDetail] = useState<ManufactorDetail>(
    {
      manufactor_id: "",
      manufactor_name:  "",
      unified_number: "",
      create_date: "",
      short_name: "",
      contact_person: "",
      phone: "",
      email: "",
      tax_rate: 0,
      discount: 0,
      ticket_period: 0,
      remark: "",
    }
  );
  const debounceRef = useRef<number | null>(null);
  const getList = async () => {
    try {
      const res = await axios.post('/api/manufactor/list',{page,pageSize:10,filter,sort});
      setDate(res.data.data.list);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const getDetail = async (manufactor_id:string,type:boolean) => {
    setType(type)
    try {
      const res = await axios.post('/api/manufactor/detail',{manufactor_id});
      if(res.data.code==='000'){
        setDetail(res.data.data);
        setOpenShow(true);
      }
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const handleDelete = async (manufactor_id:string) => {
    try {
      const res = await axios.post('/api/manufactor/delete',{manufactor_id});
      if(res.data.code==='000'){
        toast.success('刪除成功');
        const updateData = data.filter(item => item.manufactor_id !== manufactor_id);
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
    if(searchType==='manufactor_id'){
      setFilter({
        manufactor_id: value,
        manufactor_name: '',
      })
    }else{
      setFilter({
        manufactor_id: '',
        manufactor_name: value,
      })
    }
  }
  const handleSetSearchType = (value:string) => {
    setSearchType(value);
    setFilter({ manufactor_id: '', manufactor_name: '' });
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
      {openCreate && <CreateManufactorDocument 
      onClose={() => setOpenCreate(false)} 
      onSuccess={() => {
        setOpenCreate(false);
        getList(); 
      }}/>}
      {openShow && <ShowManufactorDocument 
      onClose={() => setOpenShow(false)} detail={detail} type={type} onSuccess={()=>{setOpenShow(false);getList()}} />}
      <div className={style.topContainer}>
        <div className={style.title}>廠商基本資料</div>
        <div className={style.button} onClick={()=>setOpenCreate(true)}><FaPlus/>新增廠商</div>
      </div>
      <div className={style.searchContainer}>
        <select value={searchType} onChange={(e)=>handleSetSearchType(e.target.value)} className={style.searchSelect}>
          <option value="manufactor_id">廠商編號</option>
          <option value="manufactor_name">廠商名稱</option>
        </select>
        {searchType==='manufactor_id' && <input type="text" placeholder="搜尋關鍵字" value={filter.manufactor_id} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
        {searchType==='manufactor_name' && <input type="text" placeholder="搜尋關鍵字" value={filter.manufactor_name} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
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
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => (
              <tr key={m.manufactor_id}>
                <td>{m.manufactor_id}</td>
                <td>{m.manufactor_name}</td>
                <td className={style.actions}>
                  <button className={style.detailBtn} onClick={() => getDetail(m.manufactor_id,false)}>
                    詳細
                  </button>
                  <button className={style.editBtn} onClick={() => getDetail(m.manufactor_id,true)}>
                    編輯
                  </button>
                  <button className={style.deleteBtn} onClick={()=>handleDelete(m.manufactor_id)}>
                    刪除
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

export default ManufactorDocument;