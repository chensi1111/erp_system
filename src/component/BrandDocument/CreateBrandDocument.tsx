import style from "./CreateBrandDocument.module.css";
import { useState } from "react";
import dayjs from "dayjs";
import classNames from "classnames";
import axios, { type ApiError } from '../../api/axios'
import { toast } from "react-toastify";
const CreateBrandDocument=({onClose,onSuccess,}: {onClose: () => void;onSuccess: () => void;})=> {
  const [brand_id, setBrand_id] = useState('');
  const create_date = dayjs().format('YYYY/MM/DD')
  const [brand_name, setBrand_name] = useState('');
  const [remark, setRemark] = useState('');
  const [errorCode,setErrorCode]=useState('');
  const handleCreate = async () => {
    setErrorCode('')
    try {
      const response = await axios.post('/api/brand/create', {brand_id,brand_name,remark});
      if(response.data.code=='000') {
        toast.success('品牌新增成功');
        onSuccess();
      } 
    }catch (error) {
      const err = error as ApiError;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
      setErrorCode(err.response?.data?.code ?? '');
    }
  }
  return (
    <div className={style.wrapper}>
      <div className={style.container} onClick={(e) => e.stopPropagation()}>
        <div className={style.title}>新增品牌</div>
        <div className={style.allInputs}>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>品牌編號</div>
              <input type="text" className={classNames(style.input,(errorCode=='101'||errorCode=='002') && style.error)} value={brand_id} onChange={(e)=>setBrand_id(e.target.value)} maxLength={5}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>建檔日期</div>
              <input type="text" className={classNames(style.input,style.disable)} value={create_date} readOnly/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>品牌名稱</div>
              <input type="text" className={classNames(style.input,(errorCode=='102'||errorCode=='004') && style.error)} value={brand_name} onChange={(e)=>setBrand_name(e.target.value)} maxLength={20}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>備註</div>
              <textarea value={remark} onChange={(e)=>setRemark(e.target.value)} className={classNames(style.textarea,errorCode=='012' && style.error)} maxLength={100}></textarea>
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

export default CreateBrandDocument;
