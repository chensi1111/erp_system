import style from "./CreateTypeDocument.module.css";
import { useState } from "react";
import dayjs from "dayjs";
import classNames from "classnames";
import axios from '../../api/axios'
import { toast } from "react-toastify";
const CreateTypeDocument=({onClose,onSuccess,}: {onClose: () => void;onSuccess: () => void;})=> {
  const [type_id, setType_id] = useState('');
  const [create_date, setCreate_date] = useState(dayjs().format('YYYY-MM-DD'));
  const [type_name, setType_name] = useState('');
  const [remark, setRemark] = useState('');
  const [errorCode,setErrorCode]=useState('');
  const handleCreate = async () => {
    setErrorCode('')
    try {
      const response = await axios.post('/api/type/create', {type_id,create_date,type_name,remark});
      if(response.data.code=='000') {
        toast.success('類別新增成功');
        onSuccess();
      } 
    }catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
      setErrorCode(err.response?.data?.code);
    }
  }
  return (
    <div
      className={style.wrapper}
      onClick={() => onClose()}
    >
      <div className={style.container} onClick={(e) => e.stopPropagation()}>
        <div className={style.title}>新增類別</div>
        <div className={style.allInputs}>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別編號</div>
              <input type="text" className={classNames(style.input,(errorCode=='101'||errorCode=='002') && style.error)} value={type_id} onChange={(e)=>setType_id(e.target.value)}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>建檔日期</div>
              <input type="date" className={style.input} value={create_date} onChange={(e)=>setCreate_date(e.target.value)}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別名稱</div>
              <input type="text" className={classNames(style.input,(errorCode=='102'||errorCode=='004') && style.error)} value={type_name} onChange={(e)=>setType_name(e.target.value)}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>備註</div>
              <textarea value={remark} onChange={(e)=>setRemark(e.target.value)} className={classNames(style.textarea,errorCode=='012' && style.error)}></textarea>
            </div>
          </div>
        </div>
        <div className={style.buttons}>
            <div className={classNames(style.button,style.cancel)} onClick={()=>onClose()}>取消</div>
            <div className={style.button} onClick={()=>handleCreate()}>新增</div>
        </div>
      </div>
    </div>
  );
}

export default CreateTypeDocument;
