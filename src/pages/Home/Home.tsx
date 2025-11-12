import style from "./Home.module.css";
import classNames from "classnames";
import axios from "../../api/axios"
import {toast} from 'react-toastify'
import { useState,useEffect } from "react";
import { useSelector,useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { getSafeStockCount } from "../../store/safeStcokSlice";
function Home() {
  const dispatch = useDispatch()
  const safeStock = useSelector((state: RootState) => state.safeStock);
  const [kpiData,setKpiData] = useState<any>('')
  const thisMonth = kpiData?.thisMonth ?? {};
  const lastMonth = kpiData?.lastMonth ?? {};
  const getKPIList = async () => {
    try {
      const res = await axios.post('/api/dashboard/list');
      setKpiData(res.data.data);
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const calculateDifferent = (thisMonth: number, lastMonth: number) => {
    if (lastMonth === 0) return 0; 
    const diff = ((thisMonth - lastMonth) / lastMonth) * 100;
      return diff.toFixed(2); 
  };
  const getInterestRate = (profit:number,cost:number) => {
    return ((profit / cost) * 100).toFixed(2)
  }
  const getCount = async () => {
    try {
      const res = await axios.post('/api/stock/safe_count');
      dispatch(getSafeStockCount(res.data.data.total));
    } catch (error) {
      console.log(error)
  };
}
  useEffect(()=>{
    getKPIList(),getCount()
  },[])
  return (
    <div className={style.container}>
      <div className={style.title}>ERP 儀錶板</div>
      <div className={style.subTitle}>本月KPI</div>
      {kpiData && thisMonth && lastMonth &&<div className={style.kpiContainer}>
        <div className={style.kpiBox}>
          <div className={style.boxTitle}>銷貨</div>
          <div className={style.item}>
            <div className={style.itemTitle}>數量</div>
            <div className={style.detailBox}>
              <div className={style.detail}>{thisMonth.sale.total_sale_volume}</div>
              <div className={classNames(style.detail,style.lastMonth,Number(calculateDifferent(thisMonth.sale.total_sale_volume,lastMonth.sale.total_sale_volume)) > 0 && style.add)}>
                {calculateDifferent(thisMonth.sale.total_sale_volume,lastMonth.sale.total_sale_volume)+' %'}
              </div>
            </div>
          </div>
           <div className={style.item}>
            <div className={style.itemTitle}>金額</div>
            <div className={style.detailBox}>
              <div className={style.detail}>{'$ '+thisMonth.sale.total_sale_amount}</div>
              <div className={classNames(style.detail,style.lastMonth,Number(calculateDifferent(thisMonth.sale.total_sale_amount,lastMonth.sale.total_sale_amount)) > 0 && style.add)}>
                {calculateDifferent(thisMonth.sale.total_sale_amount,lastMonth.sale.total_sale_amount)+' %'}
              </div>
            </div>
          </div>
        </div>
        <div className={style.kpiBox}>
          <div className={style.boxTitle}>進貨</div>
          <div className={style.item}>
            <div className={style.itemTitle}>數量</div>
            <div className={style.detailBox}>
              <div className={style.detail}>{thisMonth.restock.total_restock_volume}</div>
              <div className={classNames(style.detail,style.lastMonth,Number(calculateDifferent(thisMonth.restock.total_restock_volume,lastMonth.restock.total_restock_volume)) > 0 && style.add)}>
                {calculateDifferent(thisMonth.restock.total_restock_volume,lastMonth.restock.total_restock_volume)+' %'}
              </div>
            </div>
          </div>
          <div className={style.item}>
            <div className={style.itemTitle}>金額</div>
            <div className={style.detailBox}>
              <div className={style.detail}>{'$ '+thisMonth.restock.total_restock_amount}</div>
              <div className={classNames(style.detail,style.lastMonth,Number(calculateDifferent(thisMonth.restock.total_restock_amount,lastMonth.restock.total_restock_amount)) > 0 && style.add)}>
                {calculateDifferent(thisMonth.restock.total_restock_volume,lastMonth.restock.total_restock_volume)+' %'}
              </div>
            </div>
          </div>
        </div>
        <div className={style.kpiBox}>
          <div className={style.boxTitle}>網路手續</div>
          <div className={style.item}>
            <div className={style.itemTitle}>金額</div>
            <div className={style.detailBox}>
              <div className={style.detail}>{'$ '+thisMonth.sale.total_fee}</div>
              <div className={classNames(style.detail,style.lastMonth,Number(calculateDifferent(thisMonth.sale.total_fee,lastMonth.sale.total_fee)) > 0 && style.add)}>
                {calculateDifferent(thisMonth.sale.total_fee,lastMonth.sale.total_fee)+' %'}
              </div>
            </div>
          </div>
        </div>
        <div className={style.kpiBox}>
          <div className={style.boxTitle}>毛利</div>
          <div className={style.item}>
            <div className={style.itemTitle}>數值</div>
            <div className={style.detailBox}>
              <div className={style.detail}>{'$ '+thisMonth.sale.total_profit}</div>
              <div className={classNames(style.detail,style.lastMonth,Number(calculateDifferent(thisMonth.sale.total_profit,lastMonth.sale.total_profit)) > 0 && style.add)}>
                {calculateDifferent(thisMonth.sale.total_profit,lastMonth.sale.total_profit)+' %'}
              </div>
            </div>
          </div>
           <div className={style.item}>
            <div className={style.itemTitle}>利率</div>
            <div className={style.detailBox}>
              <div className={style.detail}>{getInterestRate(thisMonth.sale.total_profit,thisMonth.sale.total_sale_amount)+' %'}</div>
              <div className={classNames(style.detail,style.lastMonth,Number(calculateDifferent(Number(getInterestRate(thisMonth.sale.total_profit,thisMonth.sale.total_sale_amount)),Number(getInterestRate(lastMonth.sale.total_profit,lastMonth.sale.total_sale_amount)))) > 0 && style.add)}>
                {calculateDifferent(Number(getInterestRate(thisMonth.sale.total_profit,thisMonth.sale.total_sale_amount)),Number(getInterestRate(lastMonth.sale.total_profit,lastMonth.sale.total_sale_amount)))+' %'}
              </div>
            </div>
          </div>
        </div>
        <div className={style.kpiBox}>
          <div className={style.boxTitle}>淨利</div>
          <div className={style.item}>
            <div className={style.itemTitle}>數值</div>
            <div className={style.detailBox}>
              <div className={style.detail}>{'$ '+(thisMonth.sale.total_profit - thisMonth.sale.total_fee)}</div>
              <div className={classNames(style.detail,style.lastMonth,Number(calculateDifferent(thisMonth.sale.total_profit - thisMonth.sale.total_fee,lastMonth.sale.total_profit - lastMonth.sale.total_fee)) > 0 && style.add)}>
                {calculateDifferent(thisMonth.sale.total_profit - thisMonth.sale.total_fee,lastMonth.sale.total_profit - lastMonth.sale.total_fee)+' %'}
              </div>
            </div>
          </div>
           <div className={style.item}>
            <div className={style.itemTitle}>利率</div>
            <div className={style.detailBox}>
              <div className={style.detail}>{getInterestRate(thisMonth.sale.total_profit - thisMonth.sale.total_fee,thisMonth.sale.total_sale_amount)+' %'}</div>
              <div className={classNames(style.detail,style.lastMonth,Number(calculateDifferent(Number(getInterestRate(thisMonth.sale.total_profit - thisMonth.sale.total_fee,thisMonth.sale.total_sale_amount)),Number(getInterestRate(lastMonth.sale.total_profit - lastMonth.sale.total_fee,lastMonth.sale.total_sale_amount)))) > 0 && style.add)}>
                {calculateDifferent(Number(getInterestRate(thisMonth.sale.total_profit - thisMonth.sale.total_fee,thisMonth.sale.total_sale_amount)),Number(getInterestRate(lastMonth.sale.total_profit - lastMonth.sale.total_fee,lastMonth.sale.total_sale_amount)))+' %'}
              </div>
            </div>
          </div>
        </div>
        <div className={style.kpiBox}>
          <div className={style.boxTitle}>低庫存</div>
          <div className={style.item}>
            <div className={style.itemTitle}>數量</div>
            <div className={style.detailBox}>
              <div className={style.detail}>{safeStock.lowSafeStockCount}</div>
            </div>
          </div>
        </div>
      </div>}
    </div>
  );
}

export default Home;
