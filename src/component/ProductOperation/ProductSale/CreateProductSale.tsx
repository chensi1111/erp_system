import style from "./CreateProductSale.module.css";
import { useState,useRef,useEffect } from "react";
import dayjs from "dayjs";
import classNames from "classnames";
import axios, { type ApiError } from '../../../api/axios'
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
// utils
import { TransactionTypeMap } from "../../../utils/map";
import { getProductFormat } from "../../../utils/productInfoMap";
interface specificationList{
  specification:""
}
interface productInfo{
  product_name:string,
  manufactor:string,
  brand:string,
  size:string,
  color:string,
  product_type1:string,
  product_type2:string,
  product_type3:string,
  product_type4:string,
  recommended_price:string,
  last_cost:number,
  cumulative_cost:number,
  cumulative_in_quantity:number,
  size_list:string,
  stock_qty:{size:string,available_quantity:number}[]
}
const CreateProductSale=({onClose,onSuccess,type}: {onClose: () => void;onSuccess: () => void;type:number})=> {
  const productInfoRelation = useSelector((state: RootState) => state.productInfoRelation);
  const isAutoSetProductId = useRef(false);
  const [isCreate,setIsCreate] = useState(false)
  const [product_id, setProduct_id] = useState('');
  const [specification, setSpecification] = useState('')
  const [specificationList, setSpecificationList] =useState<specificationList[]>([])
  const [info, setInfo] = useState<productInfo>({
    product_name: "",
    manufactor: "",
    brand: "",
    size: "",
    color: "",
    product_type1: "",
    product_type2: "",
    product_type3: "",
    product_type4: "",
    recommended_price: "",
    last_cost: 0,
    cumulative_cost: 0,
    cumulative_in_quantity: 0,
    size_list: "",
    stock_qty: []
  });
  const transaction = 0
  const [pay, setPay] = useState(0)
  const [sizeList, setSizeList] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<{ size: string; quantity: string }[]>(
    Array.from({ length: 10 }, (_, index) => ({ size: sizeList[index] || "", quantity: "" }))
  );
  const [date,setDate] = useState(dayjs().format('YYYY-MM-DD'))
  const [remark, setRemark] = useState('');
  const [errorCode,setErrorCode]=useState('');
  const productIdDebounceRef = useRef<number | null>(null);
  const specificationDebounceRef = useRef<number | null>(null);

const setRecommendedPrice = (price: string) => {
  setInfo(prev => ({
    ...prev,
    recommended_price: price
  }));
};
const getAverageCost = (cumulative_cost:number,total_quantity:number) => {
  if(total_quantity===0) return 0;
  return (cumulative_cost/total_quantity).toFixed(2);
}
  const clearProductInfo = () =>{
    setInfo({
      product_name: "",
      manufactor: "",
      brand: "",
      size: "",
      color: "",
      product_type1: "",
      product_type2: "",
      product_type3: "",
      product_type4: "",
      recommended_price: "",
      last_cost: 0,
      cumulative_cost: 0,
      cumulative_in_quantity: 0,
      size_list: "",
      stock_qty: []
    })
    setSizeList([]);
  }
  const getSpecification = async() => {
    try {
      const response = await axios.post('/api/sale/specification',{product_id})
      if(response.data.code==='000'){
        setSpecificationList(response.data.data)
      }
    } catch {
      toast.error('無此商品型號')
      setSpecificationList([])
    }
  }
  const getProductInfo = async() => {
    try {
      const response = await axios.post('/api/sale/productInfo',{specification})
      if(response.data.code==='000'){
        const info = response.data.data
        setInfo(info)
        isAutoSetProductId.current = true
        setProduct_id(info.product_id)
        if (info.size_list) {
          const list = info.size_list.split(',').slice(0, 10); // 最多10個
          setSizeList(list);
        }
     } 
    } catch {
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
      product_name:info.product_name,
      quantities:filteredQuantities,
      price:info.recommended_price,
      remark,
      total_quantity,
      size_list:info.size_list,
      date,
      isComplete:true,
      type,
      pay
    }
    try {
      const response = await axios.post('/api/sale/create', {...data});
      if(response.data.code=='000') {
        toast.success('銷貨成功');
        onSuccess();
      } 
    }catch (error) {
      const err = error as ApiError;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
      setErrorCode(err.response?.data?.code ?? '');
    }finally{
      setIsCreate(false)
    }
  }
  const calculateProfit =()=>{
    return ((Number(info.recommended_price) - Number(getAverageCost(info.cumulative_cost,info.cumulative_in_quantity)))*Number(total_quantity))
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
  }, [specification]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isAutoSetProductId.current) {
      isAutoSetProductId.current = false
      return
    }
    clearProductInfo()
    setSpecification('')
    if(!product_id){
      setSpecificationList([])
      return
    } 
    if (productIdDebounceRef.current)
      clearTimeout(productIdDebounceRef.current);
    productIdDebounceRef.current = setTimeout(() => {
      getSpecification();
    }, 1000);
    return () => {
      if (productIdDebounceRef.current)
        clearTimeout(productIdDebounceRef.current);
    };
  },[product_id]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    setQuantities(Array.from({ length: 10 }, (_, index) => ({ size: sizeList[index] || "", quantity: "" })));
  }, [sizeList]);
  return (
    <div className={style.wrapper}>
      <div className={style.container} onClick={(e) => e.stopPropagation()}>
        <div className={style.title}>{type === 0 ? '新增銷貨':'新增退貨'}</div>
        <div className={style.allInputs}>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>交易方式</div>
                <input type="text" className={classNames(style.input,style.readOnly)} value={TransactionTypeMap[transaction]} readOnly/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>{type === 0 ? '付款方式':'退款方式'}</div>
                <select className={style.select} value={pay} onChange={(e)=>setPay(Number(e.target.value))}>  
                  <option value="0">現金</option>
                  <option value="1">刷卡</option>
                  {type ===0 && <option value="2">現金券</option>}
                </select>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>{type === 0 ? '銷貨日期':'退貨日期'}</div>
              <input type="date" className={classNames(style.input)} value={date} onChange={(e)=>setDate(e.target.value)}/>
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
              <input
                list="specification-list"
                className={style.select}
                value={specification}
                onChange={(e) => setSpecification(e.target.value)}
              />
              <datalist id="specification-list">
                {specificationList.map((item) => (
                  <option
                    key={item.specification}
                    value={item.specification}
                  />
                ))}
              </datalist>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品名稱</div>
              <input type="text" className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1} value={info.product_name}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>廠商</div>
              <input type="text" value={getProductFormat('manufactor',info.manufactor,productInfoRelation)} className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>品牌</div>
              <input type="text" value={getProductFormat('brand',info.brand,productInfoRelation)} className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>尺碼</div>
              <input type="text" value={getProductFormat('size',info.size,productInfoRelation)} className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>顏色</div>
              <input type="text" value={getProductFormat('color',info.color,productInfoRelation)} className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別1</div>
              <input type="text" value={getProductFormat('type',info.product_type1,productInfoRelation)||''} className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別2</div>
              <input type="text" value={getProductFormat('type',info.product_type2,productInfoRelation)||''} className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別3</div>
              <input type="text" value={getProductFormat('type',info.product_type3,productInfoRelation)||''} className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別4</div>
              <input type="text" value={getProductFormat('type',info.product_type4,productInfoRelation)||''} className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1}/>
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
                          placeholder={'餘 '+(info?.stock_qty[index]?.available_quantity || '0')}
                          onChange={(e) => {
                            if (!/^\d*$/.test(e.target.value)) return;
                            const newQuantities = [...quantities];
                            newQuantities[index].quantity = e.target.value;
                            setQuantities(newQuantities);
                          }}
                          maxLength={3}
                          className={style.sizeInput}
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
              <div className={style.inputTitle}>價格</div>
              <input type="text" className={classNames(style.input,!specification && style.disable)} value={info.recommended_price} onChange={(e)=>setRecommendedPrice(e.target.value)}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>最近進價</div>
              <input type="text" className={classNames(style.input,style.readOnly)} value={"$ "+info.last_cost} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>平均進價</div>
              <input type="text" className={classNames(style.input,style.readOnly)} value={"$ "+getAverageCost(info.cumulative_cost,info.cumulative_in_quantity)} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>總計</div>
              <input type="text" className={classNames(style.input,style.readOnly)} value={"$ "+Number(info.recommended_price)*total_quantity} readOnly tabIndex={-1}/>
            </div>
          </div>
          {type === 0 && <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>預計獲利</div>
              <input type="text" className={classNames(style.input,style.readOnly)} value={"$ "+calculateProfit()} readOnly tabIndex={-1}/>
            </div>
          </div>}
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
