import style from "./ColorDocument.module.css";
import { FaPlus } from "react-icons/fa6";
import CreateColorDocument from "../../../component/ColorDocument/CreateColorDocument";
import ShowColorDocument from "../../../component/ColorDocument/ShowColorDocument";
import { useState,useEffect,useRef } from "react";
import axios from '../../../api/axios'
import {toast} from 'react-toastify'
import Pagination from '@mui/material/Pagination';
import { IoIosArrowDropup ,IoIosArrowDropdown   } from "react-icons/io"; 
interface Color {
  color_id: string;
  color_name:  string;
}
interface ColorDetail {
  color_id: string;
  color_name:  string;
  create_date: string;
  remark: string;
}
function ColorDocument() {
  const [sort, setSort] = useState<'ASC' | 'DESC'>('DESC');
  const [searchType, setSearchType] = useState('color_id');
  const [filter, setFilter] = useState({
    color_id: '',
    color_name: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openCreate,setOpenCreate] = useState(false);
  const [openShow,setOpenShow] = useState(false);
  const [data, setDate] = useState<Color[]>([]);
  const [type, setType] = useState(false);
  const [detail, setDetail] = useState<ColorDetail>(
    {
      color_id: "",
      color_name:  "",
      create_date: "",
      remark: "",
    }
  );
  const debounceRef = useRef<number | null>(null);
  const getList = async () => {
    try {
      const res = await axios.post('/api/color/list',{page,pageSize:10,filter,sort});
      setDate(res.data.data.list);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const getDetail = async (color_id:string,type:boolean) => {
    setType(type)
    try {
      const res = await axios.post('/api/color/detail',{color_id});
      if(res.data.code==='000'){
        setDetail(res.data.data);
        setOpenShow(true);
      }
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const handleDelete = async (color_id:string) => {
    try {
      const res = await axios.post('/api/color/delete',{color_id});
      if(res.data.code==='000'){
        toast.success('刪除成功');
        const updateData = data.filter(item => item.color_id !== color_id);
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
    if(searchType==='color_id'){
      setFilter({
        color_id: value,
        color_name: '',
      })
    }else{
      setFilter({
        color_id: '',
        color_name: value,
      })
    }
  }
  const handleSetSearchType = (value:string) => {
    setSearchType(value);
    setFilter({ color_id: '', color_name: '' });
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
      {openCreate && <CreateColorDocument 
      onClose={() => setOpenCreate(false)} 
      onSuccess={() => {
        setOpenCreate(false);
        getList(); 
      }}/>}
      {openShow && <ShowColorDocument 
      onClose={() => setOpenShow(false)} detail={detail} type={type} onSuccess={()=>{setOpenShow(false);getList()}} />}
      <div className={style.topContainer}>
        <div className={style.title}>顏色基本資料</div>
        <div className={style.button} onClick={()=>setOpenCreate(true)}><FaPlus/>新增顏色</div>
      </div>
      <div className={style.searchContainer}>
        <select value={searchType} onChange={(e)=>handleSetSearchType(e.target.value)} className={style.searchSelect}>
          <option value="color_id">顏色編號</option>
          <option value="color_name">顏色名稱</option>
        </select>
        {searchType==='color_id' && <input type="text" placeholder="搜尋關鍵字" value={filter.color_id} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
        {searchType==='color_name' && <input type="text" placeholder="搜尋關鍵字" value={filter.color_name} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
      </div>
       <div className={style.tableContainer}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>
                <span>顏色編號</span>
                {sort === 'ASC' ? (
                  <IoIosArrowDropup onClick={() => setSort('DESC')} className={style.icon} />
                ) : (
                 <IoIosArrowDropdown onClick={() => setSort('ASC')} className={style.icon} />
                )}
              </th>
              <th>顏色名稱</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => (
              <tr key={m.color_id}>
                <td>{m.color_id}</td>
                <td>{m.color_name}</td>
                <td className={style.actions}>
                  <button className={style.detailBtn} onClick={() => getDetail(m.color_id,false)}>
                    詳細
                  </button>
                  <button className={style.editBtn} onClick={() => getDetail(m.color_id,true)}>
                    編輯
                  </button>
                  <button className={style.deleteBtn} onClick={()=>handleDelete(m.color_id)}>
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

export default ColorDocument;