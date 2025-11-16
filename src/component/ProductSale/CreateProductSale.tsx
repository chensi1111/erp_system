import style from "./CreateProductSale.module.css";
import { useState,useRef,useEffect } from "react";
import dayjs from "dayjs";
import classNames from "classnames";
import axios from '../../api/axios'
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
interface specificationList{
  specification:""
}
const CreateProductSale=({onClose,onSuccess,}: {onClose: () => void;onSuccess: () => void;})=> {
  const productInfoRelation = useSelector((state: RootState) => state.productInfoRelation);
  const [isCreate,setIsCreate] = useState(false)
  const [product_id, setProduct_id] = useState('');
  const [product_name, setProduct_name] = useState('');
  const [specification, setSpecification] = useState('')
  const [specificationList, setSpecificationList] =useState<specificationList[]>([])
  const [transaction, setTransaction] = useState('現場')
  const [manufactor_id,setManufactorId] = useState('')
  const [brand_id,setBrandId] = useState('')
  const [size_id,setSizeId] = useState('')
  const [sizeList, setSizeList] = useState<string[]>([]);
  const [rawSizeList, setRawSizeList] = useState('')
  const [color_id,setColorId] = useState('')
  const [quantities, setQuantities] = useState<{ size: string; quantity: string }[]>(
    Array.from({ length: 10 }, (_, index) => ({ size: sizeList[index] || "", quantity: "" }))
  );
  const [product_type1,setProductType1] = useState('')
  const [product_type2,setProductType2] = useState('')
  const [product_type3,setProductType3] = useState('')
  const [product_type4,setProductType4] = useState('')
  const [recommended_price,setRecommendedPrice] = useState('')
  const [handing_fee,setHandingFee] = useState(0)
  const [last_cost,setLastCost] = useState('')
  const [average_cost,setAverageCost] = useState('')
  const create_date = dayjs().format('YYYY/MM/DD')
  const [remark, setRemark] = useState('');
  const [errorCode,setErrorCode]=useState('');
  const productIdDebounceRef = useRef<number | null>(null);
  const specificationDebounceRef = useRef<number | null>(null);
  const getProductFormat = (type: 'manufactor' | 'brand' | 'size' | 'color' | 'type', id: string) => {
  switch (type) {
    case 'manufactor':
      return productInfoRelation.manufactorList.find(item => item.manufactor_id === id)?.manufactor_name || '';
    case 'brand':
      return productInfoRelation.brandList.find(item => item.brand_id === id)?.brand_name || '';
    case 'size':
      return productInfoRelation.sizeList.find(item => item.size_id === id)?.size_name || '';
    case 'color':
      return productInfoRelation.colorList.find(item => item.color_id === id)?.color_name || '';
    case 'type':
      return productInfoRelation.typeList.find(item => item.type_id === id)?.type_name || '';
    default:
      return '';
  }
};
  const clearProductInfo = () =>{
    setProduct_name('')
    setManufactorId('')
    setBrandId('')
    setSizeId('')
    setColorId('')
    setProductType1('')
    setProductType2('')
    setProductType3('')
    setProductType4('')
    setRecommendedPrice('')
    setLastCost('')
    setAverageCost('')
    setSizeList([]);
    setRawSizeList('')
    setHandingFee(0)
  }
  const getSpecification = async() => {
    try {
      const response = await axios.post('/api/sale/specification',{product_id})
      if(response.data.code==='000'){
        setSpecificationList(response.data.data)
      }
    } catch (error) {
      toast.error('無此商品型號')
      setSpecificationList([])
    }
  }
  const getProductInfo = async() => {
    try {
      const response = await axios.post('/api/sale/productInfo',{specification})
      if(response.data.code==='000'){
        const info = response.data.data
        setProduct_name(info.product_name)
        setManufactorId(info.manufactor)
        setBrandId(info.brand)
        setSizeId(info.size)
        setColorId(info.color)
        setProductType1(info.product_type1)
        setProductType2(info.product_type2)
        setProductType3(info.product_type3)
        setProductType4(info.product_type4)
        setRecommendedPrice(info.recommended_price)
        setLastCost(info.last_cost)
        setAverageCost(info.average_cost)
        setRawSizeList(info.size_list)
        if (info.size_list) {
          const list = info.size_list.split(',').slice(0, 10); // 最多10個
          setSizeList(list);
        }
     } 
    } catch (error) {
      toast.error('無此商品規格')
      clearProductInfo()
    }
 
  }
  const total_quantity = quantities.reduce((sum, item) => {
    const qty = parseInt(item.quantity);
    return sum + (isNaN(qty) ? 0 : qty);
  }, 0);
  const handleCreate = async () => {
    if(isCreate) return 
    setIsCreate(true)
    setErrorCode('')
    const filteredQuantities = quantities.filter(q => q.size.trim() !== "")
    const data = {
      transaction,
      product_id,
      specification,
      product_name,
      quantities:filteredQuantities,
      price:recommended_price,
      remark,
      total_quantity,
      size_list:rawSizeList,
      handing_fee
    }
    try {
      const response = await axios.post('/api/sale/create', {...data});
      if(response.data.code=='000') {
        toast.success('進貨成功');
        onSuccess();
      } 
    }catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
      setErrorCode(err.response?.data?.code);
    }finally{
      setIsCreate(false)
    }
  }
  const calculateProfit =()=>{
    return ((Number(recommended_price) - Number(average_cost))*Number(total_quantity)) - Number(handing_fee)
  }
   useEffect(() => {
    if(!specification) return
    if (specificationDebounceRef.current) clearTimeout(specificationDebounceRef.current);

    specificationDebounceRef.current = setTimeout(() => {
      getProductInfo();
    }, 1000);

    return () => {
      if (specificationDebounceRef.current) clearTimeout(specificationDebounceRef.current);
    };
  }, [specification]);
  useEffect(() => {
    clearProductInfo()
    setSpecification('')
    if(!product_id){
      setSpecificationList([])
      return
    } 
    if (productIdDebounceRef.current) clearTimeout(productIdDebounceRef.current);

    productIdDebounceRef.current = setTimeout(() => {
      getSpecification();
    }, 1000);

    return () => {
      if (productIdDebounceRef.current) clearTimeout(productIdDebounceRef.current);
    };

  },[product_id])
  useEffect(() => {
    setQuantities(Array.from({ length: 10 }, (_, index) => ({ size: sizeList[index] || "", quantity: "" })));
  }, [sizeList]);
  return (
    <div className={style.wrapper}>
      <div className={style.container} onClick={(e) => e.stopPropagation()}>
        <div className={style.title}>新增銷貨</div>
        <div className={style.allInputs}>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>交易方式</div>
                <select className={style.select} value={transaction} onChange={(e)=>setTransaction(e.target.value)}>  
                  <option value="現場">現場</option>
                  <option value="網路">網路</option>
                </select>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>銷貨日期</div>
              <input type="text" className={classNames(style.input,style.disable)} value={create_date} readOnly/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品型號</div>
              <input type="text" className={style.input} value={product_id} onChange={(e)=>setProduct_id(e.target.value)}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品規格</div>
              <select className={classNames(style.select,specificationList.length==0 && style.disable)} value={specification} onChange={(e)=>setSpecification(e.target.value)}>
                <option value={''}></option>
                {specificationList.map((item) => (
                  <option key={item.specification} value={item.specification}>
                    {item.specification}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品名稱</div>
              <input type="text" className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1} value={product_name}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>廠商</div>
              <input type="text" value={getProductFormat('manufactor',manufactor_id)} className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>品牌</div>
              <input type="text" value={getProductFormat('brand',brand_id)} className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>尺碼</div>
              <input type="text" value={getProductFormat('size',size_id)} className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>顏色</div>
              <input type="text" value={getProductFormat('color',color_id)} className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別1</div>
              <input type="text" value={getProductFormat('type',product_type1)||''} className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別2</div>
              <input type="text" value={getProductFormat('type',product_type2)||''} className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別3</div>
              <input type="text" value={getProductFormat('type',product_type3)||''} className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別4</div>
              <input type="text" value={getProductFormat('type',product_type4)||''} className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1}/>
            </div>
          </div>
          {sizeList.length!==0 && <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>尺碼數量</div>
              <table>
                <thead>
                  <tr>
                     {Array.from({ length: 10 }).map((_, index) => (
                      <th key={index} className={classNames(!sizeList[index] && style.hideInput)}>
                        {sizeList[index] || `欄位 ${index + 1}`}
                      </th>
                    ))}
                 </tr>
                </thead>
                <tbody>
                  <tr>
                     {Array.from({ length: 10 }).map((_, index) => (
                      <td key={index} className={classNames(!sizeList[index] && style.hideInput)}>
                        <input type="text" 
                          value={quantities[index].quantity}
                          onChange={(e) => {
                            const newQuantities = [...quantities];
                            newQuantities[index].quantity = e.target.value;
                            setQuantities(newQuantities);
                          }}
                          maxLength={3}
                        />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>}
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>售價</div>
              <input type="text" className={classNames(style.input,!specification && style.disable)} value={recommended_price} onChange={(e)=>setRecommendedPrice(e.target.value)}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>最近進價</div>
              <input type="text" className={classNames(style.input,style.readOnly)} value={"$ "+last_cost} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>平均進價</div>
              <input type="text" className={classNames(style.input,style.readOnly)} value={"$ "+average_cost} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>總計</div>
              <input type="text" className={classNames(style.input,style.readOnly)} value={"$ "+Number(recommended_price)*total_quantity} readOnly tabIndex={-1}/>
            </div>
          </div>
          {transaction ==='網路' && <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>手續費</div>
              <input type="text" className={classNames(style.input,!specification && style.disable)} value={handing_fee} onChange={(e)=>setHandingFee(Number(e.target.value))}/>
            </div>
          </div>}
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>預計獲利</div>
              <input type="text" className={classNames(style.input,style.readOnly)} value={"$ "+calculateProfit()} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>備註</div>
              <textarea value={remark} onChange={(e)=>setRemark(e.target.value)} className={classNames(style.textarea,errorCode=='012' && style.error,!specification && style.disable)}></textarea>
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

export default CreateProductSale;
