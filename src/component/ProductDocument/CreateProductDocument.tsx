import style from "./CreateProductDocument.module.css";
import { useState,useEffect } from "react";
import dayjs from "dayjs";
import classNames from "classnames";
import axios from '../../api/axios'
import { toast } from "react-toastify";
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
const CreateProductDocument=({onClose,onSuccess,}: {onClose: () => void;onSuccess: () => void;})=> {
  const [product_id, setProduct_id] = useState('');
  const [specification, setSpecification] = useState('');
  const [create_date, setCreate_date] = useState(dayjs().format('YYYY-MM-DD'));
  const [product_name, setProduct_name] = useState('');
  const [manufactor, setManufactor] = useState('');
  const [manufactorName, setManufactorName] = useState('');
  const [brand, setBrand] = useState('');
  const [brandName,setBrandName] = useState('');
  const [size, setSize] = useState('');
  const [sizeName,setSizeName] = useState('');
  const [product_type1, setProductType1] = useState('');
  const [product_type2, setProductType2] = useState('');
  const [product_type3, setProductType3] = useState('');
  const [product_type4, setProductType4] = useState('');
  const [type1Name,setType1Name] = useState('')
  const [type2Name,setType2Name] = useState('')
  const [type3Name,setType3Name] = useState('')
  const [type4Name,setType4Name] = useState('')
  const [price, setPrice] = useState('');
  const [sale_price, setSalePrice] = useState('');
  const [remark, setRemark] = useState('');
  const [errorCode,setErrorCode]=useState('');
  const [manufactorList,setManufactorList]=useState<manufactorList[]>([]);
  const [brandList,setBrandList]=useState<brandList[]>([]);
  const [sizeList,setSizeList]=useState<sizeList[]>([]);
  const [typeList,setTypeList]=useState<typeList[]>([]);
  const handleCreate = async () => {
    setErrorCode('')
    const priceNum =Number(price)
    const salePriceNum =sale_price ? Number(sale_price) : null
    try {
      const response = await axios.post('/api/product/create', {product_id,specification,create_date,product_name,manufactor,brand,size,product_type1,product_type2,product_type3,product_type4,price:priceNum,sale_price:salePriceNum,remark});
      if(response.data.code=='000') {
        toast.success('商品新增成功');
        onSuccess();
      } 
    }catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
      setErrorCode(err.response?.data?.code);
    }
  }
  const createProductInfos=async()=>{
    const response = await axios.post('/api/product/info');
    if(response.data.code=='000') {
      setManufactorList(response.data.data.manufactorList);
      setBrandList(response.data.data.brandList);
      setSizeList(response.data.data.sizeList);
      setTypeList(response.data.data.typeList);
    }
  }
  const handleChange = (type:string,value:string) =>{
    if(type==='manufactor'){
      setManufactor(value)
      const found = manufactorList.find(item => item.manufactor_id === value);
      setManufactorName(found ? found.manufactor_name : '');
    }else if(type==='brand'){
      setBrand(value)
      const found = brandList.find(item => item.brand_id === value);
      setBrandName(found ? found.brand_name : '');
    }else if(type==='size'){
      setSize(value)
      const found = sizeList.find(item => item.size_id === value);
      setSizeName(found ? found.size_name : '');
    }else if(type==='type1'){
      setProductType1(value)
      const found = typeList.find(item => item.type_id === value);
      setType1Name(found ? found.type_name : '');
    }else if(type==='type2'){
      setProductType2(value)
      const found = typeList.find(item => item.type_id === value);
      setType2Name(found ? found.type_name : '');
    }else if(type==='type3'){
      setProductType3(value)
      const found = typeList.find(item => item.type_id === value);
      setType3Name(found ? found.type_name : '');
    }else if(type==='type4'){
      setProductType4(value)
      const found = typeList.find(item => item.type_id === value);
      setType4Name(found ? found.type_name : '');
    }
  }
  useEffect(()=>{
    createProductInfos();
  },[]);
  return (
    <div
      className={style.wrapper}
      onClick={() => onClose()}
    >
      <div className={style.container} onClick={(e) => e.stopPropagation()}>
        <div className={style.title}>新增商品</div>
        <div className={style.allInputs}>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品編號</div>
              <input type="text" className={classNames(style.input,(errorCode=='101'||errorCode=='002') && style.error)} value={product_id} onChange={(e)=>setProduct_id(e.target.value)}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>品名規格</div>
              <input type="text" className={classNames(style.input,errorCode=='003' && style.error)} value={specification} onChange={(e)=>setSpecification(e.target.value)}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>建檔日期</div>
              <input type="date" className={style.input} value={create_date} onChange={(e)=>setCreate_date(e.target.value)}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品名稱</div>
              <input type="text" className={classNames(style.input,(errorCode=='102'||errorCode=='004') && style.error)} value={product_name} onChange={(e)=>setProduct_name(e.target.value)}/>
            </div>
          </div>
          <div className={style.selectContainer}>
              <div className={style.inputTitle}>廠商</div>
                <input
                list="manufactors"
                className={style.input}
                value={manufactor}
                onChange={(e)=>handleChange('manufactor',e.target.value)}
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
                className={style.input}
                value={brand}
                onChange={(e)=>handleChange('brand',e.target.value)}
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
                className={style.input}
                value={size}
                onChange={(e)=>handleChange('size',e.target.value)}
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
                className={style.input}
                value={product_type1}
                onChange={(e)=>handleChange('type1',e.target.value)}
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
                className={style.input}
                value={product_type2}
                onChange={(e)=>handleChange('type2',e.target.value)}
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
                className={style.input}
                value={product_type3}
                onChange={(e)=>handleChange('type3',e.target.value)}
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
                className={style.input}
                value={product_type4}
                onChange={(e)=>handleChange('type4',e.target.value)}
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
              <input type="text" className={classNames(style.input)} value={price} onChange={(e)=>setPrice(e.target.value)}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>特價</div>
              <input type="text" className={classNames(style.input)} value={sale_price} onChange={(e)=>setSalePrice(e.target.value)}/>
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

export default CreateProductDocument;
