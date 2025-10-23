import style from "./ShowSizeDocument.module.css";
import dayjs from "dayjs";
import classNames from "classnames";
import { useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
interface SizeDetail {
  size_id: string;
  size_name:  string;
  size_list: string;
  create_date: string;
  remark: string;
}
interface ShowSizeDocumentProps {
  onClose: () => void;
  onSuccess: () => void;
  detail: SizeDetail;
  type: boolean;
}
const formattedDate = (dateString: string) => {
  return dayjs(dateString).format('YYYY/MM/DD');
}
function stringToSizes(str: string) {
  const arr = str
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  // 若不足 10 個，用空字串補滿
  while (arr.length < 10) {
    arr.push('');
  }
  return arr;
}
 
const ShowSizeDocument=({ onClose,onSuccess, detail,type }: ShowSizeDocumentProps)=> {
  const [isEditing, setIsEditing] = useState(type);
  const [formData, setFormData] = useState<SizeDetail>(detail);
  const [sizes, setSizes] = useState<string[]>(stringToSizes(detail.size_list));
  const title=detail.size_name;
  const handleChange = (key: keyof SizeDetail, value: string | number) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  const handleSizeChange = (index: number, value: string) => {
    const cleanValue = value.trim();
    const newSizes = [...sizes];
    newSizes[index] = cleanValue;
    setSizes(newSizes);

    // 去除空字串再 join，避免多餘逗號
    const filtered = newSizes.filter(v => v !== '');
    setFormData(prev => ({
      ...prev,
      size_list: filtered.join(','),
    }));
  };
  const handleSave = async () => {
    try {
      const response = await axios.post('/api/size/update', {...formData});
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
    <div
      className={style.wrapper}
      onClick={() => onClose()}
    >
      <div className={style.container} onClick={(e) => e.stopPropagation()}>
        <div className={style.title}>{title}</div>
        <div className={style.allInputs}>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>尺寸編號</div>
              <input type="text" className={style.input} value={formData.size_id} readOnly onChange={(e) => handleChange("size_id", e.target.value)}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>建檔日期</div>
              <input type="text" className={style.input} value={formattedDate(formData.create_date)} readOnly onChange={(e) => handleChange("create_date", e.target.value)}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>尺寸名稱</div>
              <input type="text" className={classNames(style.input,isEditing && style.edit)} value={formData.size_name} onChange={(e) => handleChange("size_name", e.target.value)}/>
            </div>
          </div>
          <div className={style.sizesInputContainer}>
            <div className={style.inputTitle}>尺碼</div>
            {sizes.map((value, i) => (
            <input
              key={i}
              value={value}
              onChange={(e) => handleSizeChange(i, e.target.value)}
              className={classNames(style.sizeInput,isEditing && style.edit)}
              maxLength={4}
           />
          ))}
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>備註</div>
              <textarea value={formData.remark} onChange={(e) => handleChange("remark", e.target.value)} className={classNames(style.textarea,isEditing && style.edit)}></textarea>
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

export default ShowSizeDocument;
