import style from "./ShowManufactorRestock.module.css";
import dayjs from "dayjs";
import classNames from "classnames";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
interface RestockDetail {
  transaction:string,
  restock_id:string,
  create_date:string,
  product_id:string,
  specification:string,
  product_name:string,
  manufactor:string,
  brand:string,
  size:string,
  color:string,
  size_list:string,
  quantities:[{
    size:string,
    quantity:string
  }],
  price:string,
  product_type1:string,
  product_type2:string,
  product_type3:string,
  product_type4:string,
  remark: string,
}
interface ShowManufactorRestockProps {
  onClose: () => void;
  detail: RestockDetail;
}
const formattedDate = (dateString: string) => {
  return dayjs(dateString).format('YYYY/MM/DD HH:mm:ss');
}


const ShowManufactorRestock=({ onClose, detail }: ShowManufactorRestockProps)=> {
  const productInfoRelation = useSelector((state: RootState) => state.productInfoRelation);
  const title=detail.restock_id;
  const list =detail.size_list.split(',').slice(0, 10)
  const totalQuantity = detail.quantities.reduce((sum, item) => {
    const qty = parseInt(item.quantity);
    return sum + (isNaN(qty) ? 0 : qty);
  }, 0);
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

  return (
    <div className={style.wrapper}>
      <div className={style.container} onClick={(e) => e.stopPropagation()}>
        <div className={style.title}>{title}</div>
        <div className={style.allInputs}>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>進貨單號</div>
              <input type="text" className={style.input} readOnly tabIndex={-1} value={detail.restock_id}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>交易方式</div>
                <select className={classNames(style.select,style.hideSelect)} value={detail.transaction} tabIndex={-1}>  
                  <option value="買斷">買斷</option>
                  <option value="寄賣">寄賣</option>
                </select>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>進貨日期</div>
              <input type="text" className={style.input} readOnly tabIndex={-1} value={formattedDate(detail.create_date)}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品型號</div>
              <input type="text" className={style.input} readOnly tabIndex={-1} value={detail.product_id}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品規格</div>
              <input type="text" className={style.input} readOnly tabIndex={-1} value={detail.specification}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品名稱</div>
              <input type="text" className={style.input} readOnly tabIndex={-1} value={detail.product_name}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>廠商</div>
              <input type="text" value={getProductFormat('manufactor',detail.manufactor)} className={style.input} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>品牌</div>
              <input type="text" value={getProductFormat('brand',detail.brand)} className={style.input} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>尺碼</div>
              <input type="text" value={getProductFormat('size',detail.size)} className={style.input} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>顏色</div>
              <input type="text" value={getProductFormat('color',detail.color)} className={style.input} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別1</div>
              <input type="text" value={getProductFormat('type',detail.product_type1)||''} className={style.input} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別2</div>
              <input type="text" value={getProductFormat('type',detail.product_type2)||''} className={style.input} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別3</div>
              <input type="text" value={getProductFormat('type',detail.product_type3)||''} className={style.input} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別4</div>
              <input type="text" value={getProductFormat('type',detail.product_type4)||''} className={style.input} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>尺碼數量</div>
              <table>
                <thead>
                  <tr>
                     {Array.from({ length: 10 }).map((_, index) => (
                      <th key={index} className={classNames(!list[index] && style.hideInput)}>
                        {list[index]}
                      </th>
                    ))}
                 </tr>
                </thead>
                <tbody>
                  <tr>
                     {Array.from({ length: 10 }).map((_, index) => (
                      <td key={index} className={classNames(!list[index] && style.hideInput)}>
                        <input type="text"
                          className={classNames(style.input)} 
                          value={detail.quantities[index].quantity}
                          readOnly tabIndex={-1}
                        />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>進價</div>
              <input type="text" className={classNames(style.input)} value={"$ "+detail.price} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>總計</div>
              <input type="text" className={style.input} value={"$ "+Number(detail.price)*totalQuantity} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>備註</div>
              <textarea value={detail.remark} className={classNames(style.textarea)} readOnly tabIndex={-1}></textarea>
            </div>
          </div>
          <div className={style.buttons}>
            <div className={classNames(style.button,style.cancel)} onClick={()=>onClose()}>關閉</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowManufactorRestock;
