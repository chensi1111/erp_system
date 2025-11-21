import style from "./ManufactorRestockTable.module.css";
import { useState } from "react";
import dayjs from "dayjs";
import classNames from "classnames";
import axios from '../../api/axios'
import { toast } from "react-toastify";
import { useSelector,useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import CreateManufactorRestock from "./CreateManufactorRestock";
import ShowManufactorRestock from "./ShowManufactorRestock";
import { getProductList,getManufactor,clearProducts,deleteProduct } from "../../store/restockList"
const ManufactorRestockTable=({onClose,onSuccess,}: {onClose: () => void;onSuccess: () => void;})=> {
  const dispatch = useDispatch()
  const productInfoRelation = useSelector((state: RootState) => state.productInfoRelation);
  const restockList = useSelector((state: RootState) => state.restockList);
  const [isCreate, setIsCreate] = useState(false)
  const [transaction, setTransaction] = useState('買斷')
  const [manufactor,setManufactor] = useState('')
  const [openCreate,setOpenCreate] = useState(false)
  const [openShow,setOpenShow] = useState(false)
  const [detail,setDetail] = useState<any>(null)

  const [date,setDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [remark, setRemark] = useState('');
  const [errorCode,setErrorCode]=useState('');
  const getProductFormat = ( id: string) => {
    return productInfoRelation.manufactorList.find(item => item.manufactor_id === id)?.manufactor_name || '';
};
  const addOne = async() => {
    try {
      const response = await axios.post('/api/restock/productList', {manufactor});
      if(response.data.code=='000') {
        dispatch(getProductList(response.data.data))
        dispatch(getManufactor(manufactor))
        setOpenCreate(true)
      } 
    }catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  } 
  const handleCreate = async () => {
    if(isCreate) return
    setIsCreate(true)
    setErrorCode('')
    const data = {
      transaction,
      manufactor,
      date,
      remark,
      productList:restockList.list
    }
    try {
      const response = await axios.post('/api/restock/create', {...data});
      if(response.data.code=='000') {
        toast.success('進貨成功');
        dispatch(clearProducts())
        onSuccess();
      } 
    }catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
      setErrorCode(err.response?.data?.code);
    }finally{
      setIsCreate(false)
    }
  }
  const formattedQuantity = (quantities: any[]) => {
  return (
    <div className={style.sizeBadges}>
      {quantities
        .filter(q => Number(q.all_quantity) > 0)
        .map((q, idx) => (
          <span key={idx} className={style.badge}>
            {q.size} : {q.all_quantity}
          </span>
        ))
      }
    </div>
  );
};
  const handleClose = () => {
    dispatch(clearProducts())
    onClose()
  }
  const handleDetail = (detail:any) => {
    setDetail(detail)
    setOpenShow(true)
  }
  return (
    <div className={style.wrapper}>
      <div className={style.container} onClick={(e) => e.stopPropagation()}>
        <div className={style.title}>新增進貨</div>
        <div className={style.allInputs}>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>交易方式</div>
                <select className={style.select} value={transaction} onChange={(e)=>setTransaction(e.target.value)}>  
                  <option value="買斷">買斷</option>
                  <option value="寄賣">寄賣</option>
                </select>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>進貨日期</div>
              <input type="date" className={classNames(style.input)} value={date} onChange={(e)=>setDate(e.target.value)}/>
            </div>
          </div>
          <div className={style.selectContainer}>
              <div className={style.inputTitle}>廠商</div>
                <input
                list="manufactors"
                className={style.input}
                value={manufactor}
                onChange={(e)=>setManufactor(e.target.value)}
                maxLength={5}
                />
                <datalist id="manufactors">
                  {productInfoRelation.manufactorList.map((item) => (
                    <option key={item.manufactor_id} value={item.manufactor_id} />
                 ))}
              </datalist>
              <input type="text" disabled className={style.selectName} value={getProductFormat(manufactor)}></input>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>備註</div>
              <textarea value={remark} onChange={(e)=>setRemark(e.target.value)} className={classNames(style.textarea,errorCode=='012' && style.error)}></textarea>
            </div>
          </div>
        </div>
          <div className={style.topContainer}>
            <div className={style.optionButtons}>
              <div className={style.option} onClick={()=>addOne()}>新增商品</div>
              <div className={style.option} onClick={()=>dispatch(clearProducts())}>刪除全部</div>
            </div>
            <div className={style.infos}>
              <div className={style.info}>總數量 : <span>{restockList.all_quantity}</span></div>
              <div className={style.info}>總金額 : <span>$ {restockList.all_price}</span></div>
            </div>
          </div>

          <div className={style.tableContainer}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>商品型號</th>
              <th>商品規格</th>
              <th>數量</th>
              <th>價格</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {restockList.list.map((m,index) => (
              <tr key={index}>
                <td>{m.product_id}</td>
                <td>{m.specification}</td>
                <td>{m.total_quantity}<br/>{formattedQuantity(m.quantities)}</td>
                <td>$ {m.total_price}</td>
                <td>
                  <div className={style.actions}>
                  <button className={style.detailBtn} onClick={()=>handleDetail(m)}>
                    詳細
                  </button>
                  <button className={style.deleteBtn} onClick={()=>dispatch(deleteProduct(index))}>
                    刪除
                  </button>
                  </div>
                </td>
              </tr>
            ))}
            {restockList.list.length===0 && <tr>
              <td colSpan={5} style={{textAlign:'center',padding:'20px 0'}}>資料為空</td>
            </tr>}
          </tbody>
        </table>
      </div>
        
        <div className={style.buttons}>
            <div className={classNames(style.button,style.cancel)} onClick={()=>handleClose()}>取消</div>
            <div className={style.button} onClick={()=>handleCreate()}>完成</div>
        </div>
      </div>
      {openCreate && <CreateManufactorRestock 
      onClose={() => setOpenCreate(false)} />}
      {openShow && <ShowManufactorRestock 
      onClose={() => setOpenShow(false)} detail={detail} />}
    </div>
  );
}

export default ManufactorRestockTable;
