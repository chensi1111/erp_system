import style from "./ShowColorDocument.module.css";
import dayjs from "dayjs";
import classNames from "classnames";
import { useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
interface ColorDetail {
  color_id: string;
  color_name:  string;
  create_date: string;
  remark: string;
}
interface ShowColorDocumentProps {
  onClose: () => void;
  onSuccess: () => void;
  detail: ColorDetail;
  type: boolean;
}
const formattedDate = (dateString: string) => {
  return dayjs(dateString).format('YYYY/MM/DD HH:mm:ss');
}

const ShowColorDocument=({ onClose,onSuccess, detail,type }: ShowColorDocumentProps)=> {
  const [isEditing, setIsEditing] = useState(type);
  const [formData, setFormData] = useState<ColorDetail>(detail);
  const title=detail.color_name;
  const handleChange = (key: keyof ColorDetail, value: string | number) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  const handleSave = async () => {
    try {
      const response = await axios.post('/api/color/update', {...formData});
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
              <div className={style.inputTitle}>顏色編號</div>
              <input type="text" className={style.input} value={formData.color_id} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>建檔時間</div>
              <input type="text" className={style.input} value={formattedDate(formData.create_date)} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>顏色名稱</div>
              <input type="text" className={classNames(style.input,isEditing && style.edit)} value={formData.color_name} onChange={(e) => handleChange("color_name", e.target.value)} maxLength={20}/>
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

export default ShowColorDocument;
