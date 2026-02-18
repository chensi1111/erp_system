import style from "./Home.module.css";
import classNames from "classnames";
import axios from "../../api/axios"
import {toast} from 'react-toastify'
import { useState,useEffect } from "react";
import SalesProfitChart from "../../component/DashBoard/SalesProfitChart";
function Home() {
  const [isReady,setIsReady] = useState(false)
  const [kpiData,setKpiData] = useState({
    thisMonth:{
      month:'',
      sale:{
        total_sale_volume:0,
        total_sale_amount:0,
        total_refund_volume:0,
        total_refund_amount:0
      },
      restock:{
        total_restock_volume:0,
        total_restock_amount:0
      }
    },
    lastMonth:{
      month:'',
      sale:{
        total_sale_volume:0,
        total_sale_amount:0,
        total_refund_volume:0,
        total_refund_amount:0
      },
      restock:{
        total_restock_volume:0,
        total_restock_amount:0
      }
    }
  })
  const getKPIList = async () => {
    try {
      const res = await axios.post('/api/dashboard/list');
      setKpiData(res.data.data);
      setIsReady(true)
    } catch (error) {
      const err = error as any;
      setIsReady(false)
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const calculateDifferent = (thisMonth: number, lastMonth: number) => {
    if (lastMonth == 0){
      return 'N/A'
    } ; 
    const diff = ((thisMonth - lastMonth) / lastMonth) * 100;
      return diff.toFixed(2); 
  };
  useEffect(()=>{
    getKPIList()
  },[])
  return (
    <div className={style.container}>
      <div className={style.title}>ERP 儀錶板</div>
      <div className={style.subTitle}>本月KPI</div>
      {isReady && <div className={style.kpiContainer}>
        <div className={style.kpiBox}>
          <div className={style.boxTitle}>銷貨</div>
          <div className={style.item}>
            <div className={style.itemTitle}>數量</div>
            <div className={style.detailBox}>
              <div className={style.detail}>{kpiData.thisMonth.sale.total_sale_volume}</div>
              <div className={classNames(style.detail,style.lastMonth,Number(calculateDifferent(kpiData.thisMonth.sale.total_sale_volume,kpiData.lastMonth.sale.total_sale_volume)) > 0 && style.add)}>
                {calculateDifferent(kpiData.thisMonth.sale.total_sale_volume,kpiData.lastMonth.sale.total_sale_volume)+' %'}
              </div>
            </div>
          </div>
           <div className={style.item}>
            <div className={style.itemTitle}>金額</div>
            <div className={style.detailBox}>
              <div className={style.detail}>{'$ '+kpiData.thisMonth.sale.total_sale_amount}</div>
              <div className={classNames(style.detail,style.lastMonth,Number(calculateDifferent(kpiData.thisMonth.sale.total_sale_amount,kpiData.lastMonth.sale.total_sale_amount)) > 0 && style.add)}>
                {calculateDifferent(kpiData.thisMonth.sale.total_sale_amount,kpiData.lastMonth.sale.total_sale_amount)+' %'}
              </div>
            </div>
          </div>
        </div>
        <div className={style.kpiBox}>
          <div className={style.boxTitle}>退貨</div>
          <div className={style.item}>
            <div className={style.itemTitle}>數量</div>
            <div className={style.detailBox}>
              <div className={style.detail}>{kpiData.thisMonth.sale.total_refund_volume}</div>
              <div className={classNames(style.detail,style.lastMonth,Number(calculateDifferent(kpiData.thisMonth.sale.total_refund_volume,kpiData.lastMonth.sale.total_refund_volume)) > 0 && style.add)}>
                {calculateDifferent(kpiData.thisMonth.sale.total_refund_volume,kpiData.lastMonth.sale.total_refund_volume)+' %'}
              </div>
            </div>
          </div>
          <div className={style.item}>
            <div className={style.itemTitle}>金額</div>
            <div className={style.detailBox}>
              <div className={style.detail}>{'$ '+kpiData.thisMonth.sale.total_refund_amount}</div>
              <div className={classNames(style.detail,style.lastMonth,Number(calculateDifferent(kpiData.thisMonth.sale.total_refund_amount,kpiData.lastMonth.sale.total_refund_amount)) > 0 && style.add)}>
                {calculateDifferent(kpiData.thisMonth.sale.total_refund_amount,kpiData.lastMonth.sale.total_refund_amount)+' %'}
              </div>
            </div>
          </div>
        </div>
        <div className={style.kpiBox}>
          <div className={style.boxTitle}>進貨</div>
          <div className={style.item}>
            <div className={style.itemTitle}>數量</div>
            <div className={style.detailBox}>
              <div className={style.detail}>{kpiData.thisMonth.restock.total_restock_volume}</div>
              <div className={classNames(style.detail,style.lastMonth,Number(calculateDifferent(kpiData.thisMonth.restock.total_restock_volume,kpiData.lastMonth.restock.total_restock_volume)) > 0 && style.add)}>
                {calculateDifferent(kpiData.thisMonth.restock.total_restock_volume,kpiData.lastMonth.restock.total_restock_volume)+' %'}
              </div>
            </div>
          </div>
          <div className={style.item}>
            <div className={style.itemTitle}>金額</div>
            <div className={style.detailBox}>
              <div className={style.detail}>{'$ '+kpiData.thisMonth.restock.total_restock_amount}</div>
              <div className={classNames(style.detail,style.lastMonth,Number(calculateDifferent(kpiData.thisMonth.restock.total_restock_amount,kpiData.lastMonth.restock.total_restock_amount)) > 0 && style.add)}>
                {calculateDifferent(kpiData.thisMonth.restock.total_restock_volume,kpiData.lastMonth.restock.total_restock_volume)+' %'}
              </div>
            </div>
          </div>
        </div>
        <div className={style.kpiBox}>
          <div className={style.boxTitle}>進貨</div>
          <div className={style.item}>
            <div className={style.itemTitle}>數量</div>
            <div className={style.detailBox}>
              <div className={style.detail}>{kpiData.thisMonth.restock.total_restock_volume}</div>
              <div className={classNames(style.detail,style.lastMonth,Number(calculateDifferent(kpiData.thisMonth.restock.total_restock_volume,kpiData.lastMonth.restock.total_restock_volume)) > 0 && style.add)}>
                {calculateDifferent(kpiData.thisMonth.restock.total_restock_volume,kpiData.lastMonth.restock.total_restock_volume)+' %'}
              </div>
            </div>
          </div>
          <div className={style.item}>
            <div className={style.itemTitle}>金額</div>
            <div className={style.detailBox}>
              <div className={style.detail}>{'$ '+kpiData.thisMonth.restock.total_restock_amount}</div>
              <div className={classNames(style.detail,style.lastMonth,Number(calculateDifferent(kpiData.thisMonth.restock.total_restock_amount,kpiData.lastMonth.restock.total_restock_amount)) > 0 && style.add)}>
                {calculateDifferent(kpiData.thisMonth.restock.total_restock_volume,kpiData.lastMonth.restock.total_restock_volume)+' %'}
              </div>
            </div>
          </div>
        </div>
        
      </div>}
      <SalesProfitChart></SalesProfitChart>
    </div>
  );
}

export default Home;
