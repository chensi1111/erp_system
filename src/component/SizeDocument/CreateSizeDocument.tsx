import style from "./CreateSizeDocument.module.css";
import { useState } from "react";
import dayjs from "dayjs";
import classNames from "classnames";
import axios, { type ApiError } from '../../api/axios'
import { toast } from "react-toastify";
const CreateSizeDocument=({onClose,onSuccess,}: {onClose: () => void;onSuccess: () => void;})=> {
  const [size_id, setSize_id] = useState('');
  const create_date = dayjs().format('YYYY/MM/DD')
  const [size_name, setSize_name] = useState('');
  const [sizes, setSizes] = useState(Array(10).fill(""));
  const [remark, setRemark] = useState('');
  const [errorCode,setErrorCode]=useState('');
  const handleChange = (index: number, value: string) => {
    const newSizes = [...sizes];
    newSizes[index] = value;
    setSizes(newSizes);
  };
  function sizesToString(sizes: string[]) {
    return sizes.filter(Boolean).join(',');
  }
  const handleCreate = async () => {
    setErrorCode('')
    try {
      const response = await axios.post('/api/size/create', {size_id,size_name,size_list:sizesToString(sizes),remark});
      if(response.data.code=='000') {
        toast.success('尺寸新增成功');
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
        <div className={style.title}>新增尺寸</div>
        <div className={style.allInputs}>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>尺寸編號</div>
              <input type="text" className={classNames(style.input,(errorCode=='101'||errorCode=='002') && style.error)} value={size_id} onChange={(e)=>setSize_id(e.target.value)} maxLength={5}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>建檔日期</div>
              <input type="text" className={classNames(style.input,style.disable)} value={create_date} readOnly/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>尺寸名稱</div>
              <input type="text" className={classNames(style.input,(errorCode=='102'||errorCode=='004') && style.error)} value={size_name} onChange={(e)=>setSize_name(e.target.value)} maxLength={20}/>
            </div>
          </div>
          <div className={style.sizesInputContainer}>
            <div className={style.inputTitle}>尺碼</div>
            {sizes.map((value, i) => (
            <input
              key={i}
              value={value}
              onChange={(e) => handleChange(i, e.target.value)}
              className={style.sizeInput}
              maxLength={4}
           />
          ))}
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

export default CreateSizeDocument;
