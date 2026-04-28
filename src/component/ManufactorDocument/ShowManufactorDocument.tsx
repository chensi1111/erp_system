import style from "./ShowManufactorDocument.module.css";
import classNames from "classnames";
import { useState } from "react";
import axios, { type ApiError } from "../../api/axios";
import { toast } from "react-toastify";
import { formattedTime } from "../../utils/formattedTime";
interface ManufactorDetail {
  manufactor_id: string;
  manufactor_name:  string;
  unified_number: string;
  create_date: string;
  contact_person: string;
  phone: string;
  email: string;
  tax_rate: number;
  discount: number;
  ticket_period: number;
  remark: string;
}
interface ShowManufactorDocumentProps {
  onClose: () => void;
  onSuccess: () => void;
  detail: ManufactorDetail;
  type: boolean;
}

const ShowManufactorDocument=({ onClose,onSuccess, detail,type }: ShowManufactorDocumentProps)=> {
  const [isEditing, setIsEditing] = useState(type);
  const [formData, setFormData] = useState<ManufactorDetail>(detail);
  const title=detail.manufactor_name;
  const handleChange = (key: keyof ManufactorDetail, value: string | number) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  const handleSave = async () => {
    try {
      const response = await axios.post('/api/manufactor/update', {...formData});
      if(response.data.code=='000') {
        onSuccess()
        toast.success('更新成功');
      } 
    }catch (error) {
      const err = error as ApiError;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  }

  return (
    <div className={style.wrapper}>
      <div className={style.container} onClick={(e) => e.stopPropagation()}>
        <div className={style.title}>{title}</div>
        <div className={style.allInputs}>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>廠商編號</div>
              <input type="text" className={style.input} value={formData.manufactor_id} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>統一編號</div>
              <input type="text" className={classNames(style.input,isEditing && style.edit)} value={formData.unified_number} onChange={(e) => handleChange("unified_number", e.target.value)} maxLength={8}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>建檔時間</div>
              <input type="text" className={style.input} value={formattedTime(formData.create_date)} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>廠商名稱</div>
              <input type="text" className={classNames(style.input,isEditing && style.edit)} value={formData.manufactor_name} onChange={(e) => handleChange("manufactor_name", e.target.value)} maxLength={20}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>聯絡人</div>
              <input type="text" className={classNames(style.input,isEditing && style.edit)} value={formData.contact_person} onChange={(e) => handleChange("contact_person", e.target.value)} maxLength={10}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>電話</div>
              <input type="text" className={classNames(style.input,isEditing && style.edit)} value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} maxLength={20}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>Email</div>
              <input type="text" className={classNames(style.input,isEditing && style.edit)} value={formData.email} onChange={(e) => handleChange("email", e.target.value)}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>稅率</div>
              <input type="text" className={classNames(style.input,isEditing && style.edit)} value={formData.tax_rate} onChange={(e) => handleChange("tax_rate", e.target.value)}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>折扣</div>
              <input type="text" className={classNames(style.input,isEditing && style.edit)} value={formData.discount} onChange={(e) => handleChange("discount", e.target.value)}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>票期</div>
              <input type="text" className={classNames(style.input,isEditing && style.edit)} value={formData.ticket_period} onChange={(e) => handleChange("ticket_period", e.target.value)}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>備註</div>
              <textarea value={formData.remark} onChange={(e) => handleChange("remark", e.target.value)} className={classNames(style.textarea,isEditing && style.edit)} maxLength={100}></textarea>
            </div>
          </div>
          {!isEditing && <div className={style.buttons}>
            <div className={classNames(style.button,style.cancel)} onClick={()=>onClose()}>關閉</div>
            <div className={style.button} onClick={() => setIsEditing(true)}>編輯</div>
          </div>}
          {isEditing && <div className={style.buttons}>
            <div className={classNames(style.button,style.cancel)} onClick={()=>setIsEditing(false)}>取消</div>
            <div className={style.button} onClick={() => handleSave()}>完成</div>
          </div>}
        </div>
      </div>
    </div>
  );
}

export default ShowManufactorDocument;
