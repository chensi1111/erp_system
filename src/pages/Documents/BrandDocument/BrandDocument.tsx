import style from "./BrandDocument.module.css";
import { FaPlus } from "react-icons/fa6";
import CreateBrandDocument from "../../../component/BrandDocument/CreateBrandDocument";
import ShowBrandDocument from "../../../component/BrandDocument/ShowBrandDocument";
import { useState,useEffect,useRef } from "react";
import axios from '../../../api/axios'
import {toast} from 'react-toastify'
import Pagination from '@mui/material/Pagination';
import { IoIosArrowDropup ,IoIosArrowDropdown   } from "react-icons/io"; 
interface Brand {
  brand_id: string;
  brand_name:  string;
}
interface BrandDetail {
  brand_id: string;
  brand_name:  string;
  create_date: string;
  remark: string;
}
function BrandDocument() {
  const [sort, setSort] = useState<'ASC' | 'DESC'>('DESC');
  const [searchType, setSearchType] = useState('brand_id');
  const [filter, setFilter] = useState({
    brand_id: '',
    brand_name: '',
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openCreate,setOpenCreate] = useState(false);
  const [openShow,setOpenShow] = useState(false);
  const [data, setDate] = useState<Brand[]>([]);
  const [type, setType] = useState(false);
  const [detail, setDetail] = useState<BrandDetail>(
    {
      brand_id: "",
      brand_name:  "",
      create_date: "",
      remark: "",
    }
  );
  const debounceRef = useRef<number | null>(null);
  const getList = async () => {
    try {
      const res = await axios.post('/api/brand/list',{page,pageSize:10,filter,sort});
      setDate(res.data.data.list);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const getDetail = async (brand_id:string,type:boolean) => {
    setType(type)
    try {
      const res = await axios.post('/api/brand/detail',{brand_id});
      if(res.data.code==='000'){
        setDetail(res.data.data);
        setOpenShow(true);
      }
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const handleDelete = async (brand_id:string) => {
    try {
      const res = await axios.post('/api/brand/delete',{brand_id});
      if(res.data.code==='000'){
        toast.success('刪除成功');
        const updateData = data.filter(item => item.brand_id !== brand_id);
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
    if(searchType==='brand_id'){
      setFilter({
        brand_id: value,
        brand_name: '',
      })
    }else{
      setFilter({
        brand_id: '',
        brand_name: value,
      })
    }
  }
  const handleSetSearchType = (value:string) => {
    setSearchType(value);
    setFilter({ brand_id: '', brand_name: '' });
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
      {openCreate && <CreateBrandDocument 
      onClose={() => setOpenCreate(false)} 
      onSuccess={() => {
        setOpenCreate(false);
        getList(); 
      }}/>}
      {openShow && <ShowBrandDocument 
      onClose={() => setOpenShow(false)} detail={detail} type={type} onSuccess={()=>{setOpenShow(false);getList()}} />}
      <div className={style.topContainer}>
        <div className={style.title}>品牌基本資料</div>
        <div className={style.button} onClick={()=>setOpenCreate(true)}><FaPlus/>新增品牌</div>
      </div>
      <div className={style.searchContainer}>
        <select value={searchType} onChange={(e)=>handleSetSearchType(e.target.value)} className={style.searchSelect}>
          <option value="brand_id">品牌編號</option>
          <option value="brand_name">品牌名稱</option>
        </select>
        {searchType==='brand_id' && <input type="text" placeholder="搜尋關鍵字" value={filter.brand_id} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
        {searchType==='brand_name' && <input type="text" placeholder="搜尋關鍵字" value={filter.brand_name} className={style.searchInput} onChange={(e)=>handleSetFilter(e.target.value)}/>}
      </div>
       <div className={style.tableContainer}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>
                <span>品牌編號</span>
                {sort === 'ASC' ? (
                  <IoIosArrowDropup onClick={() => setSort('DESC')} className={style.icon} />
                ) : (
                 <IoIosArrowDropdown onClick={() => setSort('ASC')} className={style.icon} />
                )}
              </th>
              <th>品牌名稱</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => (
              <tr key={m.brand_id}>
                <td>{m.brand_id}</td>
                <td>{m.brand_name}</td>
                <td className={style.actions}>
                  <button className={style.detailBtn} onClick={() => getDetail(m.brand_id,false)}>
                    詳細
                  </button>
                  <button className={style.editBtn} onClick={() => getDetail(m.brand_id,true)}>
                    編輯
                  </button>
                  <button className={style.deleteBtn} onClick={()=>handleDelete(m.brand_id)}>
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

export default BrandDocument;