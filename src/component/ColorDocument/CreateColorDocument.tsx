import style from "./CreateColorDocument.module.css";
import { useState } from "react";
import dayjs from "dayjs";
import classNames from "classnames";
import axios from '../../api/axios'
import { toast } from "react-toastify";
const CreateColorDocument=({onClose,onSuccess,}: {onClose: () => void;onSuccess: () => void;})=> {
  const [color_id, setColor_id] = useState('');
  const create_date = dayjs().format('YYYY/MM/DD')
  const [color_name, setColor_name] = useState('');
  const [remark, setRemark] = useState('');
  const [errorCode,setErrorCode]=useState('');
  const handleCreate = async () => {
    setErrorCode('')
    try {
      const response = await axios.post('/api/color/create', {color_id,color_name,remark});
      if(response.data.code=='000') {
        toast.success('顏色新增成功');
        onSuccess();
      } 
    }catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
      setErrorCode(err.response?.data?.code);
    }
  }
  return (
    <div className={style.wrapper}>
      <div className={style.container} onClick={(e) => e.stopPropagation()}>
        <div className={style.title}>新增顏色</div>
        <div className={style.allInputs}>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>顏色編號</div>
              <input type="text" className={classNames(style.input,(errorCode=='101'||errorCode=='002') && style.error)} value={color_id} onChange={(e)=>setColor_id(e.target.value)} maxLength={5}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>建檔日期</div>
              <input type="text" className={classNames(style.input,style.disable)} value={create_date} readOnly/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>顏色名稱</div>
              <input type="text" className={classNames(style.input,(errorCode=='102'||errorCode=='004') && style.error)} value={color_name} onChange={(e)=>setColor_name(e.target.value)} maxLength={20}/>
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

export default CreateColorDocument;
