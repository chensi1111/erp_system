import style from "./ShowProductDocument.module.css";
import dayjs from "dayjs";
import classNames from "classnames";
import { useState,useEffect } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
interface ProductDetail {
  product_id: string;
  product_name:  string;
  specification: string;
  create_date: string;
  manufactor:string;
  brand:string;
  size:string;
  product_type1:string;
  product_type2:string;
  product_type3:string;
  product_type4:string;
  price:number;
  sale_price:number;
  remark: string;
}
interface ShowProductDocumentProps {
  onClose: () => void;
  onSuccess: () => void;
  detail: ProductDetail;
  type: boolean;
}
interface manufactorList{
  manufactor_id:string,
  manufactor_name:string
}
interface brandList{
  brand_id:string,
  brand_name:string
}
interface sizeList{
  size_id:string,
  size_name:string
}
interface typeList{
  type_id:string,
  type_name:string
}
const formattedDate = (dateString: string) => {
  return dayjs(dateString).format('YYYY/MM/DD');
}

const ShowProductDocument=({ onClose,onSuccess, detail,type }: ShowProductDocumentProps)=> {
  const [isEditing, setIsEditing] = useState(type);
  const [formData, setFormData] = useState<ProductDetail>(detail);
  const [manufactorName, setManufactorName] = useState('');
  const [brandName,setBrandName] = useState('');
  const [sizeName,setSizeName] = useState('');
  const [type1Name,setType1Name] = useState('')
  const [type2Name,setType2Name] = useState('')
  const [type3Name,setType3Name] = useState('')
  const [type4Name,setType4Name] = useState('')

  const [manufactorList,setManufactorList]=useState<manufactorList[]>([]);
  const [brandList,setBrandList]=useState<brandList[]>([]);
  const [sizeList,setSizeList]=useState<sizeList[]>([]);
  const [typeList,setTypeList]=useState<typeList[]>([]);
  const title=detail.product_name;
  const handleChange = (key: keyof ProductDetail, value: string | number) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };
  const handleSave = async () => {
    try {
      const response = await axios.post('/api/prodcut/update', {...formData});
      if(response.data.code=='000') {
        onSuccess()
        toast.success('更新成功');
      } 
    }catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  }
    const handleSelectChange = (type:string,value:string) =>{
    if(type==='manufactor'){
      setFormData(prev => ({ ...prev, [type]: value }));
      const found = manufactorList.find(item => item.manufactor_id === value);
      setManufactorName(found ? found.manufactor_name : '');
    }else if(type==='brand'){
      setFormData(prev => ({ ...prev, [type]: value }));
      const found = brandList.find(item => item.brand_id === value);
      setBrandName(found ? found.brand_name : '');
    }else if(type==='size'){
      setFormData(prev => ({ ...prev, [type]: value }));
      const found = sizeList.find(item => item.size_id === value);
      setSizeName(found ? found.size_name : '');
    }else if(type==='product_type1'){
      setFormData(prev => ({ ...prev, [type]: value }));
      const found = typeList.find(item => item.type_id === value);
      setType1Name(found ? found.type_name : '');
    }else if(type==='product_type2'){
      setFormData(prev => ({ ...prev, [type]: value }));
      const found = typeList.find(item => item.type_id === value);
      setType2Name(found ? found.type_name : '');
    }else if(type==='product_type3'){
      setFormData(prev => ({ ...prev, [type]: value }));
      const found = typeList.find(item => item.type_id === value);
      setType3Name(found ? found.type_name : '');
    }else if(type==='product_type4'){
      setFormData(prev => ({ ...prev, [type]: value }));
      const found = typeList.find(item => item.type_id === value);
      setType4Name(found ? found.type_name : '');
    }
  }
  const getProductInfos=async()=>{
    const response = await axios.post('/api/product/info');
    if(response.data.code=='000') {
      setManufactorList(response.data.data.manufactorList);
      setBrandList(response.data.data.brandList);
      setSizeList(response.data.data.sizeList);
      setTypeList(response.data.data.typeList);
    }
  }
  useEffect(()=>{
    getProductInfos();
  },[]);
  useEffect(() => {
  if (formData.manufactor) {
    handleSelectChange('manufactor', formData.manufactor);
  }
  if (formData.brand) {
    handleSelectChange('brand', formData.brand);
  }
  if (formData.size) {
    handleSelectChange('size', formData.size);
  }
  if (formData.product_type1) {
    handleSelectChange('product_type1', formData.product_type1);
  }
  if (formData.product_type2) {
    handleSelectChange('product_type2', formData.product_type2);
  }
  if (formData.product_type3) {
    handleSelectChange('product_type3', formData.product_type3);
  }
  if (formData.product_type4) {
    handleSelectChange('product_type4', formData.product_type4);
  }
}, [manufactorList, brandList, sizeList, typeList]);

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
              <div className={style.inputTitle}>廠商編號</div>
              <input type="text" className={style.input} value={formData.product_id} readOnly />
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>品名規格</div>
              <input type="text" className={classNames(style.input,isEditing && style.edit)} value={formData.specification} onChange={(e)=>handleChange("specification",e.target.value)}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>建檔日期</div>
              <input type="text" className={style.input} value={formattedDate(formData.create_date)} readOnly/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品名稱</div>
              <input type="text" className={classNames(style.input,isEditing && style.edit)} value={formData.product_name} onChange={(e) => handleChange("product_name", e.target.value)}/>
            </div>
          </div>
          <div className={style.selectContainer}>
              <div className={style.inputTitle}>廠商</div>
                <input
                list="manufactors"
                className={classNames(style.input,isEditing && style.edit)}
                value={formData.manufactor}
                onChange={(e)=>handleSelectChange('manufactor',e.target.value)}
                />
                <datalist id="manufactors">
                  {manufactorList.map((item) => (
                    <option key={item.manufactor_id} value={item.manufactor_id} />
                 ))}
              </datalist>
              <input type="text" disabled className={style.selectName} value={manufactorName}></input>
          </div>
          <div className={style.selectContainer}>
              <div className={style.inputTitle}>品牌</div>
                <input
                list="brands"
                className={classNames(style.input,isEditing && style.edit)}
                value={formData.brand}
                onChange={(e)=>handleSelectChange('brand',e.target.value)}
                />
                <datalist id="brands">
                  {brandList.map((item) => (
                    <option key={item.brand_id} value={item.brand_id} />
                 ))}
              </datalist>
              <input type="text" disabled className={style.selectName} value={brandName}></input>
          </div>
          <div className={style.selectContainer}>
              <div className={style.inputTitle}>尺碼</div>
                <input
                list="sizes"
                className={classNames(style.input,isEditing && style.edit)}
                value={formData.size}
                onChange={(e)=>handleSelectChange('size',e.target.value)}
                />
                <datalist id="sizes">
                  {sizeList.map((item) => (
                    <option key={item.size_id} value={item.size_id} />
                 ))}
              </datalist>
              <input type="text" disabled className={style.selectName} value={sizeName}></input>
          </div>
          <div className={style.typeContainer}>
            <div className={style.selectContainer}>
              <div className={style.inputTitle}>類別1</div>
              <input
                list="types1"
                className={classNames(style.input,isEditing && style.edit)}
                value={formData.product_type1}
                onChange={(e)=>handleSelectChange('product_type1',e.target.value)}
                />
                <datalist id="types1">
                  {typeList.map((item) => (
                    <option key={item.type_id} value={item.type_id} />
                 ))}
              </datalist>
              <input type="text" disabled className={style.selectName} value={type1Name}></input>
            </div>
            <div className={style.selectContainer}>
              <div className={style.inputTitle}>類別2</div>
              <input
                list="types2"
                className={classNames(style.input,isEditing && style.edit)}
                value={formData.product_type2}
                onChange={(e)=>handleSelectChange('product_type2',e.target.value)}
                />
                <datalist id="types2">
                  {typeList.map((item) => (
                    <option key={item.type_id} value={item.type_id} />
                 ))}
              </datalist>
              <input type="text" disabled className={style.selectName} value={type2Name}></input>
            </div>
          </div>
          <div className={style.typeContainer}>
            <div className={style.selectContainer}>
              <div className={style.inputTitle}>類別3</div>
              <input
                list="types3"
                className={classNames(style.input,isEditing && style.edit)}
                value={formData.product_type3}
                onChange={(e)=>handleSelectChange('product_type3',e.target.value)}
                />
                <datalist id="types3">
                  {typeList.map((item) => (
                    <option key={item.type_id} value={item.type_id} />
                 ))}
              </datalist>
              <input type="text" disabled className={style.selectName} value={type3Name}></input>
            </div>
            <div className={style.selectContainer}>
              <div className={style.inputTitle}>類別4</div>
              <input
                list="types4"
                className={classNames(style.input,isEditing && style.edit)}
                value={formData.product_type4}
                onChange={(e)=>handleSelectChange('product_type4',e.target.value)}
                />
                <datalist id="types4">
                  {typeList.map((item) => (
                    <option key={item.type_id} value={item.type_id} />
                 ))}
              </datalist>
              <input type="text" disabled className={style.selectName} value={type4Name}></input>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>建議售價</div>
              <input type="text" className={classNames(style.input,isEditing && style.edit)} value={formData.price} onChange={(e)=>handleChange('price',e.target.value)}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>特價</div>
              <input type="text" className={classNames(style.input,isEditing && style.edit)} value={formData.sale_price} onChange={(e)=>handleChange('sale_price',e.target.value)}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>備註</div>
              <textarea value={formData.remark} readOnly={!isEditing} onChange={(e) => handleChange("remark", e.target.value)} className={classNames(style.textarea,isEditing && style.edit)}></textarea>
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

export default ShowProductDocument;
