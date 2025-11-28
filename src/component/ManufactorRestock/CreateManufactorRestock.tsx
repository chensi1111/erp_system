import style from "./CreateManufactorRestock.module.css";
import { useState,useRef,useEffect } from "react";
import classNames from "classnames";
import axios from '../../api/axios'
import { toast } from "react-toastify";
import { useSelector,useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { addNewProduct } from "../../store/restockList"
import { getProductFormat } from "../../utils/productInfoMap";
interface productIdList{
  product_id:""
}
interface StockQty {
  size:string,
  available_quantity:string
}
interface RestockDetail {
  total_quantity:number;
  total_price:number;
  product_name:string;
  manufactor:string;
  brand:string;
  size:string;
  color:string;
  product_type1:string;
  product_type2:string;
  product_type3:string;
  product_type4:string;
  size_list:string,
  stock_qty:StockQty[];
}
const CreateManufactorRestock=({onClose}: {onClose: () => void})=> {
  const dispatch = useDispatch()
  const productInfoRelation = useSelector((state: RootState) => state.productInfoRelation);
  const restockList = useSelector((state: RootState) =>state.restockList)
  const [detail,setDetail] = useState<RestockDetail>({
    total_quantity:0,
    total_price:0,
    product_name:'',
    manufactor:'',
    brand:'',
    size:'',
    color:'',
    product_type1:'',
    product_type2:'',
    product_type3:'',
    product_type4:'',
    size_list:'',
    stock_qty:[]
  })
  const [product_id, setProductId] = useState('');
  const [specification, setSpecification] = useState('')
  const [productIdList, setProductIdList] =useState<productIdList[]>([])
  const [sizeList, setSizeList] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<{ size: string; all_quantity: string,available_quantity:string,reserved_quantity:String,safe_stock:string }[]>(
    Array.from({ length: 10 }, (_, index) => ({ size: sizeList[index] || "", all_quantity: "",available_quantity: "",reserved_quantity: "",safe_stock:"" }))
  );
  const [price,setPrice] = useState('')
  const productIdDebounceRef = useRef<number | null>(null);
  const specificationDebounceRef = useRef<number | null>(null);
  const clearProductInfo = () =>{
    setDetail({
      total_quantity:0,
      total_price:0,
      product_name:'',
      manufactor:'',
      brand:'',
      size:'',
      color:'',
      product_type1:'',
      product_type2:'',
      product_type3:'',
      product_type4:'',
      size_list:'',
      stock_qty:[]
    })
    setSizeList([])
    setPrice('')
  }
  const getProductId = async() => {
    try {
      const response = await axios.post('/api/restock/specification',{specification})
      if(response.data.code==='000'){
        setProductIdList(response.data.data)
      }
    } catch (error) {
      toast.error('無此商品型號')
      setProductIdList([])
    }
  }
  const getProductInfo = async() => {
    try {
      const response = await axios.post('/api/restock/productInfo',{specification,product_id})
      if(response.data.code==='000'){
        const info = response.data.data
        setDetail({
          ...info,
          stock_qty: info.stock_qty ?? []
        });
        setPrice(info.purchase_price)
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
  const total_quantity = quantities.reduce((sum, item) => { const qty = parseInt(item.all_quantity); return sum + (isNaN(qty) ? 0 : qty); }, 0);
  const handleCreate = async () => {
    if(!detail) return
    const data = {
      product_id,
      specification,
      quantities,
      price,
      total_price:Number(price) * total_quantity,
      total_quantity,
      product_name:detail.product_name,
      manufactor:getProductFormat('manufactor',detail.manufactor,productInfoRelation),
      brand:getProductFormat('brand',detail.brand,productInfoRelation),
      size:getProductFormat('size',detail.size,productInfoRelation),
      color:getProductFormat('color',detail.color,productInfoRelation),
      type1:getProductFormat('type',detail.product_type1,productInfoRelation)||'',
      type2:getProductFormat('type',detail.product_type2,productInfoRelation)||'',
      type3:getProductFormat('type',detail.product_type3,productInfoRelation)||'',
      type4:getProductFormat('type',detail.product_type4,productInfoRelation)||'',
      sizeList:detail.size_list
    }
    dispatch(addNewProduct(data))
    onClose()
  }
  useEffect(() => {
    if(!specification) {
      clearProductInfo()
      setProductId('')
      return
    }
    if (specificationDebounceRef.current) clearTimeout(specificationDebounceRef.current);

    specificationDebounceRef.current = setTimeout(() => {
      setProductId('')
      clearProductInfo()
      getProductId();
    }, 1000);

    return () => {
      if (specificationDebounceRef.current) clearTimeout(specificationDebounceRef.current);
    };
  }, [specification]);
   useEffect(() => {
    if(!specification||!product_id) return
    if (productIdDebounceRef.current) clearTimeout(productIdDebounceRef.current);

    productIdDebounceRef.current = setTimeout(() => {
      getProductInfo();
    }, 1000);

    return () => {
      if (productIdDebounceRef.current) clearTimeout(productIdDebounceRef.current);
    };
  }, [product_id]);
  useEffect(() => {
    setQuantities(Array.from({ length: 10 }, (_, index) => ({ size: sizeList[index] || "", all_quantity: "",available_quantity:"",reserved_quantity:"",safe_stock:"" })));
  }, [sizeList]);
  return (
    <div className={style.wrapper}>
      <div className={style.container} onClick={(e) => e.stopPropagation()}>
        <div className={style.title}>新增商品</div>
        <div className={style.allInputs}>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品規格</div>
                <input
                list="specification"
                className={style.input}
                value={specification}
                onChange={(e)=>setSpecification(e.target.value)}
                />
                <datalist id="specification">
                  {restockList.productList.map((item) => (
                    <option key={item.specification} value={item.specification} />
                 ))}
              </datalist>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品型號</div>
                <input
                list="product_id"
                className={classNames(style.input,!specification && style.disable)}
                value={product_id}
                onChange={(e)=>setProductId(e.target.value)}
                />
                <datalist id="product_id">
                  {productIdList.map((item) => (
                    <option key={item.product_id} value={item.product_id} />
                 ))}
              </datalist>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品名稱</div>
              <input type="text" className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1} value={detail.product_name}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>廠商</div>
              <input type="text" value={getProductFormat('manufactor',detail.manufactor,productInfoRelation)} className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>品牌</div>
              <input type="text" value={getProductFormat('brand',detail.brand,productInfoRelation)} className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>尺碼</div>
              <input type="text" value={getProductFormat('size',detail.size,productInfoRelation)} className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>顏色</div>
              <input type="text" value={getProductFormat('color',detail.color,productInfoRelation)} className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別1</div>
              <input type="text" value={getProductFormat('type',detail.product_type1,productInfoRelation)||''} className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別2</div>
              <input type="text" value={getProductFormat('type',detail.product_type2,productInfoRelation)||''} className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別3</div>
              <input type="text" value={getProductFormat('type',detail.product_type3,productInfoRelation)||''} className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別4</div>
              <input type="text" value={getProductFormat('type',detail.product_type4,productInfoRelation)||''} className={classNames(style.input,style.readOnly)} readOnly tabIndex={-1}/>
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
                          value={quantities[index].all_quantity}
                          placeholder={'餘 '+(detail.stock_qty[index]?.available_quantity || '0')}
                          onChange={(e) => {
                            const newQuantities = [...quantities];
                            newQuantities[index].all_quantity = e.target.value;
                            newQuantities[index].available_quantity = e.target.value;
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
              <div className={style.inputTitle}>進價</div>
              <input type="text" className={classNames(style.input,!product_id && style.disable)} value={price} onChange={(e)=>setPrice(e.target.value)}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>總計</div>
              <input type="text" className={classNames(style.input,style.readOnly)} value={Number(price)*total_quantity} readOnly tabIndex={-1}/>
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

export default CreateManufactorRestock;
