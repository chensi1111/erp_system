import style from "./ShowOrderList.module.css";
import classNames from "classnames";
import { formattedDate, formattedTime } from "../../../utils/formattedTime";
import { useEffect, useState } from "react";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import Pagination from '@mui/material/Pagination';
import { IoIosArrowDropup ,IoIosArrowDropdown   } from "react-icons/io"; 


interface ShowOrderListProps {
  onClose: () => void;
  onSuccess: () => void
}
interface OrderList {
  order_no:string;
  product_id:string;
  specification:string;
  quantities:[];
  total_quantity:number;
  amount:number;
  paid_at:string;
  paid_date:string,
  total_price:number
}
const ShowOrderList = ({ onClose,onSuccess }: ShowOrderListProps) => {
  const [list,setList] = useState<OrderList[]>([])
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState<'ASC' | 'DESC'>('DESC');
  const getOrderList = async () => {
    try {
      const res = await axios.post("/api/sale/order_list",{page,pageSize:5,sort});
      if (res.data.code === "000") {
        setList(res.data.data.list)
        setTotalPages(res.data.data.totalPages);
      }
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const formattedQuantity = (quantities: any[]) => {
  return (
    <div className={style.sizeBadges}>
      {quantities
        .filter(q => Number(q.quantity) > 0)
        .map((q, idx) => (
          <span key={idx} className={style.badge}>
            {q.size} : {q.quantity}
          </span>
        ))
      }
    </div>
  );
};
  const handleComplete = async(order_no:string) =>{
    try {
      const response = await axios.post('/api/sale/order_complete', {order_no});
      if(response.data.code=='000') {
        onSuccess()
        toast.success('取貨成功');
      } 
    }catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  }
  const handleDelete = async(order_no:string) =>{
    try {
      const response = await axios.post('/api/sale/delete_order', {order_no,type:8});
      if(response.data.code=='000') {
        onSuccess()
        toast.success('退訂成功');
      } 
    }catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  }
  useEffect(() => {
    getOrderList();
  }, [page,sort]);
  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <div className={style.allInputs}>
          <div className={style.tableContainer}>
            <table className={style.table}>
              <thead>
               <tr>
                 <th>
                <span>單號</span>
                {sort === 'ASC' ? (
                  <IoIosArrowDropup onClick={() => setSort('DESC')} className={style.icon} />
                ) : (
                 <IoIosArrowDropdown onClick={() => setSort('ASC')} className={style.icon} />
                )}
                </th>
                 <th>建檔時間</th>
                 <th>付款日期</th>
                 <th>商品型號</th>
                 <th>商品規格</th>
                 <th>數量</th>
                 <th>總金額</th>
                 <th>訂金</th>
                 <th>尾款</th>
                 <th>操作</th>
                </tr>
              </thead>
              <tbody className={style.tbody}>
                {list.map((m) => (
                 <tr key={m.order_no}>
                   <td>{m.order_no}</td>
                   <td>{formattedTime(m.paid_at)}</td>
                   <td>{formattedDate(m.paid_date)}</td>
                   <td>{m.product_id}</td>
                   <td>{m.specification}</td>
                   <td>{m.total_quantity}<br/>{formattedQuantity(m.quantities)}</td>
                   <td>$ {m.total_price}</td>
                   <td>$ {m.amount}</td>
                   <td>$ {m.total_price - m.amount}</td>
                   <td>
                    <div className={style.actions}>
                        <div className={style.tableButton} onClick={()=>handleComplete(m.order_no)}>取貨</div>
                        <div className={classNames(style.tableButton,style.cancel)} onClick={()=>handleDelete(m.order_no)}>退訂</div>
                    </div>
                    </td>
                 </tr>
                ))}
                {list.length===0 && <tr>
                 <td colSpan={10} style={{textAlign:'center',padding:'20px 0'}}>查無資料</td>
                </tr>}
             </tbody>
            </table>
          </div>
          {list.length >0 && <Pagination count={totalPages} page={page} onChange={(_, val) => setPage(val)} siblingCount={0} boundaryCount={1} sx={{ul: {whiteSpace: 'nowrap', display: 'flex', flexWrap: 'nowrap', justifyContent: 'center' }}}/>}
          <div className={style.buttons}>
            <div
              className={classNames(style.button, style.cancel)}
              onClick={() => onClose()}
            >
              關閉
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowOrderList;
