import style from "./CreateProductDocument.module.css";
import { useState,useEffect } from "react";
import dayjs from "dayjs";
import classNames from "classnames";
import axios from '../../api/axios'
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { getProductFormat } from "../../utils/productInfoMap";
const CreateProductDocument=({onClose,onSuccess,Specification}: {onClose: () => void;onSuccess: () => void;Specification:string})=> {
  const productInfoRelation = useSelector((state: RootState) => state.productInfoRelation);
  const [product_id, setProduct_id] = useState('');
  const [specification, setSpecification] = useState('');
  const create_date = dayjs().format('YYYY/MM/DD')
  const [product_name, setProduct_name] = useState('');
  const [manufactor, setManufactor] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [product_type1, setProductType1] = useState('');
  const [product_type2, setProductType2] = useState('');
  const [product_type3, setProductType3] = useState('');
  const [product_type4, setProductType4] = useState('');
  const [price, setPrice] = useState('');
  const [purchase, setPurchase] = useState('');
  const [remark, setRemark] = useState('');
  const [errorCode,setErrorCode]=useState('');
  const handleCreate = async () => {
    setErrorCode('')
    const priceNum =Number(price)
    const purchaseNum =Number(purchase)
    try {
      const response = await axios.post('/api/product/create', {product_id,specification,product_name,manufactor,brand,size,color,product_type1,product_type2,product_type3,product_type4,recommended_price:priceNum,purchase_price:purchaseNum,remark});
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
  const getProductInfo = async() =>{
    try {
      const res = await axios.post('/api/product/detail',{specification:Specification});
      if(res.data.code==='000'){
        const data=res.data.data
        setProduct_id(data.product_id)
        setProduct_name(data.product_name)
        setSpecification(data.specification)
        setManufactor(data.manufactor)
        setBrand(data.brand)
        setSize(data.size)
        setColor(data.color)
        setProductType1(data.product_type1)
        setProductType2(data.product_type2)
        setProductType3(data.product_type3)
        setProductType4(data.product_type4)
        setPrice(data.recommended_price)
        setRemark(data.remark)
      }
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  }
  useEffect(()=>{
    if(Specification){
      getProductInfo()
    }
  },[])
  return (
    <div className={style.wrapper}>
      <div className={style.container} onClick={(e) => e.stopPropagation()}>
        <div className={style.title}>新增商品</div>
        <div className={style.allInputs}>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品編號</div>
              <input type="text" className={classNames(style.input,(errorCode=='101'||errorCode=='002') && style.error,Specification && style.disable)} value={product_id} onChange={(e)=>setProduct_id(e.target.value)} maxLength={20}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品規格</div>
              <input type="text" className={classNames(style.input,errorCode=='003' && style.error)} value={specification} onChange={(e)=>setSpecification(e.target.value)} maxLength={20}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>建檔日期</div>
              <input type="text" className={classNames(style.input,style.disable)} value={create_date} readOnly/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品名稱</div>
              <input type="text" className={classNames(style.input,(errorCode=='102'||errorCode=='004') && style.error)} value={product_name} onChange={(e)=>setProduct_name(e.target.value)} maxLength={20}/>
            </div>
          </div>
          <div className={style.selectContainer}>
              <div className={style.inputTitle}>廠商</div>
                <input
                list="manufactors"
                className={style.input}
                value={manufactor}
                onChange={(e)=>setManufactor(e.target.value)}
                maxLength={5}
                />
                <datalist id="manufactors">
                  {productInfoRelation.manufactorList.map((item) => (
                    <option key={item.manufactor_id} value={item.manufactor_id} />
                 ))}
              </datalist>
              <input type="text" disabled className={style.selectName} value={getProductFormat('manufactor',manufactor,productInfoRelation)}></input>
          </div>
          <div className={style.selectContainer}>
              <div className={style.inputTitle}>品牌</div>
                <input
                list="brands"
                className={classNames(style.input,Specification && style.disable)}
                value={brand}
                onChange={(e)=>setBrand(e.target.value)}
                maxLength={5}
                />
                <datalist id="brands">
                  {productInfoRelation.brandList.map((item) => (
                    <option key={item.brand_id} value={item.brand_id} />
                 ))}
              </datalist>
              <input type="text" disabled className={style.selectName} value={getProductFormat('brand',brand,productInfoRelation)}></input>
          </div>
          <div className={style.selectContainer}>
              <div className={style.inputTitle}>尺碼</div>
                <input
                list="sizes"
                className={classNames(style.input,Specification && style.disable)}
                value={size}
                onChange={(e)=>setSize(e.target.value)}
                maxLength={5}
                />
                <datalist id="sizes">
                  {productInfoRelation.sizeList.map((item) => (
                    <option key={item.size_id} value={item.size_id} />
                 ))}
              </datalist>
              <input type="text" disabled className={style.selectName} value={getProductFormat('size',size,productInfoRelation)}></input>
          </div>
          <div className={style.selectContainer}>
              <div className={style.inputTitle}>顏色</div>
                <input
                list="colors"
                className={style.input}
                value={color}
                onChange={(e)=>setColor(e.target.value)}
                maxLength={5}
                />
                <datalist id="colors">
                  {productInfoRelation.colorList.map((item) => (
                    <option key={item.color_id} value={item.color_id} />
                 ))}
              </datalist>
              <input type="text" disabled className={style.selectName} value={getProductFormat('color',color,productInfoRelation)}></input>
          </div>
          <div className={style.typeContainer}>
            <div className={style.selectContainer}>
              <div className={style.inputTitle}>類別1</div>
              <input
                list="types1"
                className={classNames(style.input,Specification && style.disable)}
                value={product_type1||''}
                onChange={(e)=>setProductType1(e.target.value)}
                maxLength={5}
                />
                <datalist id="types1">
                  {productInfoRelation.typeList.map((item) => (
                    <option key={item.type_id} value={item.type_id} />
                 ))}
              </datalist>
              <input type="text" disabled className={style.selectName} value={getProductFormat('type',product_type1,productInfoRelation)}></input>
            </div>
            <div className={style.selectContainer}>
              <div className={style.inputTitle}>類別2</div>
              <input
                list="types2"
                className={classNames(style.input,Specification && style.disable)}
                value={product_type2||''}
                onChange={(e)=>setProductType2(e.target.value)}
                maxLength={5}
                />
                <datalist id="types2">
                  {productInfoRelation.typeList.map((item) => (
                    <option key={item.type_id} value={item.type_id} />
                 ))}
              </datalist>
              <input type="text" disabled className={style.selectName} value={getProductFormat('type',product_type2,productInfoRelation)}></input>
            </div>
          </div>
          <div className={style.typeContainer}>
            <div className={style.selectContainer}>
              <div className={style.inputTitle}>類別3</div>
              <input
                list="types3"
                className={classNames(style.input,Specification && style.disable)}
                value={product_type3||''}
                onChange={(e)=>setProductType3(e.target.value)}
                maxLength={5}
                />
                <datalist id="types3">
                  {productInfoRelation.typeList.map((item) => (
                    <option key={item.type_id} value={item.type_id} />
                 ))}
              </datalist>
              <input type="text" disabled className={style.selectName} value={getProductFormat('type',product_type3,productInfoRelation)}></input>
            </div>
            <div className={style.selectContainer}>
              <div className={style.inputTitle}>類別4</div>
              <input
                list="types4"
                className={classNames(style.input,Specification && style.disable)}
                value={product_type4||''}
                onChange={(e)=>setProductType4(e.target.value)}
                maxLength={5}
                />
                <datalist id="types4">
                  {productInfoRelation.typeList.map((item) => (
                    <option key={item.type_id} value={item.type_id} />
                 ))}
              </datalist>
              <input type="text" disabled className={style.selectName} value={getProductFormat('type',product_type4,productInfoRelation)}></input>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>進價</div>
              <input type="text" className={classNames(style.input)} value={purchase} onChange={(e)=>setPurchase(e.target.value)}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>建議售價</div>
              <input type="text" className={classNames(style.input)} value={price} onChange={(e)=>setPrice(e.target.value)}/>
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

export default CreateProductDocument;
