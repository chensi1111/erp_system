import style from "./TypeDocument.module.css";
import { useState,useEffect,useRef } from "react";
import axios, { type ApiError } from '../../../api/axios'
import {toast} from 'react-toastify'
import Pagination from '@mui/material/Pagination';
// component
import CreateTypeDocument from "../../../component/TypeDocument/CreateTypeDocument";
import ShowTypeDocument from "../../../component/TypeDocument/ShowTypeDocument";
// icon
import plus from "../../../assets/icons/plusIcon.svg"
import arrowDropUp from "../../../assets/icons/arrowDropUp.svg"
import arrowDropDown from "../../../assets/icons/arrowDropDown.svg"
interface Type {
  type_id: string;
  type_name:  string;
}
interface TypeDetail {
  type_id: string;
  type_name:  string;
  create_date: string;
  remark: string;
}
function TypeDocument() {
  const [sort, setSort] = useState<'ASC' | 'DESC'>('DESC');
  const [searchType, setSearchType] = useState('type_id');
  const [filter, setFilter] = useState({
    type_id: '',
    type_name: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openCreate,setOpenCreate] = useState(false);
  const [openShow,setOpenShow] = useState(false);
  const [data, setDate] = useState<Type[]>([]);
  const [type, setType] = useState(false);
  const [detail, setDetail] = useState<TypeDetail>(
    {
      type_id: "",
      type_name:  "",
      create_date: "",
      remark: "",
    }
  );
  const debounceRef = useRef<number | null>(null);
  const getList = async () => {
    try {
      const res = await axios.post('/api/type/list',{page,pageSize:10,filter,sort});
      setDate(res.data.data.list);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const getDetail = async (type_id:string,type:boolean) => {
    setType(type)
    try {
      const res = await axios.post('/api/type/detail',{type_id});
      if(res.data.code==='000'){
        setDetail(res.data.data);
        setOpenShow(true);
      }
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const handleDelete = async (type_id:string) => {
    try {
      const res = await axios.post('/api/type/delete',{type_id});
      if(res.data.code==='000'){
        toast.success('刪除成功');
        const updateData = data.filter(item => item.type_id !== type_id);
        if(updateData.length ===0 && page>1){
          setPage(page-1);
        }
        getList();
      }
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  }
  const handleSetFilter = (value:string) => {
    if(searchType==='type_id'){
      setFilter({
        type_id: value,
        type_name: '',
      })
    }else{
      setFilter({
        type_id: '',
        type_name: value,
      })
    }
  }
  const handleSetSearchType = (value:string) => {
    setSearchType(value);
    setFilter({ type_id: '', type_name: '' });
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
   getList();
  }, [page,sort]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={style.container}>
      {openCreate && <CreateTypeDocument 
      onClose={() => setOpenCreate(false)} 
      onSuccess={() => {
        setOpenCreate(false);
        getList(); 
      }}/>}
      {openShow && <ShowTypeDocument 
      onClose={() => setOpenShow(false)} detail={detail} type={type} onSuccess={()=>{setOpenShow(false);getList()}} />}
      <div className={style.topContainer}>
        <div className={style.title}>類別基本資料</div>
        <div className={style.button} onClick={()=>setOpenCreate(true)}><img src={plus} alt="plus"/>新增類別</div>
      </div>
      <div className={style.searchContainer}>
        <select value={searchType} onChange={(e)=>handleSetSearchType(e.target.value)} className={style.searchSelect}>
          <option value="type_id">類別編號</option>
          <option value="type_name">類別名稱</option>
        </select>
        {searchType==='type_id' && <input type="text" placeholder="搜尋關鍵字" value={filter.type_id} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
        {searchType==='type_name' && <input type="text" placeholder="搜尋關鍵字" value={filter.type_name} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
      </div>
       <div className={style.tableContainer}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>
                <span>類別編號</span>
                {sort === 'ASC' ? (
                  <img src={arrowDropUp} alt="arrowUp" onClick={() => setSort('DESC')} className={style.icon} />
                ) : (
                 <img src={arrowDropDown} alt="arrowDown" onClick={() => setSort('ASC')} className={style.icon} />
                )}
              </th>
              <th>類別名稱</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => (
              <tr key={m.type_id}>
                <td>{m.type_id}</td>
                <td>{m.type_name}</td>
                <td className={style.actions}>
                  <button className={style.detailBtn} onClick={() => getDetail(m.type_id,false)}>
                    詳細
                  </button>
                  <button className={style.editBtn} onClick={() => getDetail(m.type_id,true)}>
                    編輯
                  </button>
                  <button className={style.deleteBtn} onClick={()=>handleDelete(m.type_id)}>
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

export default TypeDocument;