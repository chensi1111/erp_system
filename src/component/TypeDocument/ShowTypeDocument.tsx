import style from "./ShowTypeDocument.module.css";
import classNames from "classnames";
import { useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { formattedTime } from "../../utils/formattedTime";
interface TypeDetail {
  type_id: string;
  type_name:  string;
  create_date: string;
  remark: string;
}
interface ShowTypeDocumentProps {
  onClose: () => void;
  onSuccess: () => void;
  detail: TypeDetail;
  type: boolean;
}

const ShowTypeDocument=({ onClose,onSuccess, detail,type }: ShowTypeDocumentProps)=> {
  const [isEditing, setIsEditing] = useState(type);
  const [formData, setFormData] = useState<TypeDetail>(detail);
  const title=detail.type_name;
  const handleChange = (key: keyof TypeDetail, value: string | number) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  const handleSave = async () => {
    try {
      const response = await axios.post('/api/type/update', {...formData});
      if(response.data.code=='000') {
        onSuccess()
        toast.success('更新成功');
      } 
    }catch (error) {
      const err = error as any;
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
              <div className={style.inputTitle}>類別編號</div>
              <input type="text" className={style.input} value={formData.type_id} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>建檔時間</div>
              <input type="text" className={style.input} value={formattedTime(formData.create_date)} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別名稱</div>
              <input type="text" className={classNames(style.input,isEditing && style.edit)} value={formData.type_name} onChange={(e) => handleChange("type_name", e.target.value)} maxLength={20}/>
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

export default ShowTypeDocument;
