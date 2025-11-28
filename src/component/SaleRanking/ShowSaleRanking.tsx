import style from "./ShowSaleRanking.module.css";
import classNames from "classnames";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { getProductFormat } from "../../utils/productInfoMap";

interface ReportDetail {
  product_id: string,
  product_name: string,
  specification: string,
  manufactor:string,
  brand:string,
  size:string,
  color:string,
  product_type1:string,
  product_type2:string,
  product_type3:string,
  product_type4:string,
  total_quantity:string,
  total_sales:string,
  total_profit:string,
  total_cost:string,
  sizes:Sizes[],
  size_list:string
}
interface Sizes {
  size:string;
  total_quantity:string
}
interface ShowSaleCalculateProps {
  onClose: () => void;
  detail: ReportDetail;
  customRange:{
    start:string,
    end:string
  };
  rangeType:string
}

const ShowSaleCalculate=({ onClose, detail,rangeType,customRange }: ShowSaleCalculateProps)=> {
  const productInfoRelation = useSelector((state: RootState) => state.productInfoRelation);
  const title=detail.product_name;
  const list =detail.size_list.split(',').slice(0, 10)
  const getDateRange = () =>{
    switch (rangeType) {
      case 'today':
        return '今日';
      case 'thisWeek':
        return '本周'
      case 'thisMonth':
        return '本月'
      case 'custom':
        return `${customRange.start} ~ ${customRange.end}`
    }
  }
  const getGP = () =>{
    if(!detail.total_profit || !detail.total_sales) return 0
    return ((Number(detail.total_profit) / Number(detail.total_sales)) * 100).toFixed(2) + "%"
  }

  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <div className={style.title}>{title}</div>
        <div className={style.allInputs}>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品編號</div>
              <input type="text" className={style.input} value={detail.product_id} readOnly tabIndex={-1} />
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品規格</div>
              <input type="text" className={style.input} value={detail.specification} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>商品名稱</div>
              <input type="text" className={style.input} value={detail.product_name} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>廠商</div>
              <input type="text" className={style.input} value={getProductFormat('manufactor',detail.manufactor,productInfoRelation)} readOnly tabIndex={-1} />
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>品牌</div>
              <input type="text" className={style.input}  value={getProductFormat('brand',detail.brand,productInfoRelation)} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>尺碼</div>
              <input type="text" className={style.input} value={getProductFormat('size',detail.size,productInfoRelation)} readOnly tabIndex={-1} />
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>顏色</div>
              <input type="text" className={style.input}  value={getProductFormat('color',detail.color,productInfoRelation)} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別1</div>
              <input type="text" className={style.input} value={getProductFormat('type',detail.product_type1,productInfoRelation)} readOnly tabIndex={-1}></input>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別2</div>
              <input type="text" className={style.input} value={getProductFormat('type',detail.product_type2,productInfoRelation)} readOnly tabIndex={-1}></input>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別3</div>
              <input type="text" className={style.input} value={getProductFormat('type',detail.product_type3,productInfoRelation)} readOnly tabIndex={-1}></input>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>類別4</div>
              <input type="text" className={style.input} value={getProductFormat('type',detail.product_type4,productInfoRelation)} readOnly tabIndex={-1}></input>
            </div>
          </div>
          <div className={style.singleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>日期範圍</div>
              <input type="text" className={style.input} value={getDateRange()} readOnly tabIndex={-1}/>
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
                          value={detail.sizes[index].total_quantity}
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
              <div className={style.inputTitle}>總銷量</div>
              <input type="text" className={style.input} value={detail.total_quantity} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>總成本</div>
              <input type="text" className={style.input} value={"$ "+detail.total_cost} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>總銷售額</div>
              <input type="text" className={style.input} value={"$ "+detail.total_sales} readOnly tabIndex={-1}/>
            </div>
          </div>
          <div className={style.multipleInput}>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>毛利</div>
              <input type="text" className={style.input} value={"$ "+detail.total_profit} readOnly tabIndex={-1}/>
            </div>
            <div className={style.inputContainer}>
              <div className={style.inputTitle}>毛利率</div>
              <input type="text" className={style.input} value={getGP()} readOnly tabIndex={-1}/>
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

export default ShowSaleCalculate;
