import style from "./CreateManufactorDocument.module.css";
import { useState } from "react";
import dayjs from "dayjs";
import classNames from "classnames";
import axios, { type ApiError } from '../../api/axios'
import { toast } from "react-toastify";
const CreateManufactorDocument=({onClose,onSuccess,}: {onClose: () => void;onSuccess: () => void;})=> {
  const [manufactor_id, setManufactor_id] = useState('');
  const [unified_number, setUnified_number] = useState('');
  const create_date = dayjs().format('YYYY/MM/DD')
  const [manufactor_name, setManufactor_name] = useState('');
  const [contact_person, setContact_person] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [tax_rate, setTax_rate] = useState('');
  const [discount, setDiscount] = useState('');
  const [ticket_period, setTicket_period] = useState('');
  const [remark, setRemark] = useState('');
  const [errorCode,setErrorCode]=useState('');
  const handleCreate = async () => {
    setErrorCode('')
    try {
      const response = await axios.post('/api/manufactor/create', {manufactor_id,unified_number,manufactor_name,contact_person,phone,email,tax_rate,discount,ticket_period,remark});
      if(response.data.code=='000') {
        console.log('Manufactor created successfully',response.data);
        toast.success('廠商新增成功');
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
        <div className={style.title}>新增廠商</div>
        <div className={style.allInputs}>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>廠商編號</div>
              <input type="text" className={classNames(style.input,(errorCode=='101'||errorCode=='002') && style.error)} value={manufactor_id} onChange={(e)=>setManufactor_id(e.target.value)} maxLength={5}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>統一編號</div>
              <input type="text" className={classNames(style.input,errorCode=='003' && style.error)} value={unified_number} onChange={(e)=>setUnified_number(e.target.value)} maxLength={8}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>建檔日期</div>
              <input type="text" className={classNames(style.input,style.disable)} value={create_date} readOnly/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>廠商名稱</div>
              <input type="text" className={classNames(style.input,(errorCode=='102'||errorCode=='004') && style.error)} value={manufactor_name} onChange={(e)=>setManufactor_name(e.target.value)} maxLength={20}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>聯絡人</div>
              <input type="text" className={classNames(style.input,errorCode=='006' && style.error)} value={contact_person} onChange={(e)=>setContact_person(e.target.value)} maxLength={10}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>電話</div>
              <input type="text" className={classNames(style.input,errorCode=='008' && style.error)} value={phone} onChange={(e)=>setPhone(e.target.value)} maxLength={20}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>Email</div>
              <input type="text" className={classNames(style.input,errorCode=='007' && style.error)} value={email} onChange={(e)=>setEmail(e.target.value)}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>稅率</div>
              <input type="text" className={classNames(style.input,errorCode=='009' && style.error)} value={tax_rate} onChange={(e)=>setTax_rate(e.target.value)}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>折扣</div>
              <input type="text" className={classNames(style.input,errorCode=='010' && style.error)} value={discount} onChange={(e)=>setDiscount(e.target.value)}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>票期</div>
              <input type="text" className={classNames(style.input,errorCode=='011' && style.error)} value={ticket_period} onChange={(e)=>setTicket_period(e.target.value)}/>
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

export default CreateManufactorDocument;
