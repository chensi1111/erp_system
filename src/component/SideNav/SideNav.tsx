import style from "./SideNav.module.css";
import { useState,useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { useDispatch,useSelector } from "react-redux";
import classNames from "classnames";
import axios from '../../api/axios'
// store
import type { RootState } from "../../store/store";
import { getSafeStockCount } from "../../store/safeStcokSlice";
// mui
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
function SideNav() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();
  const currnetPath = location.pathname;
  const [nav1Open, setNav1Open] = useState(false);
  const [nav2Open, setNav2Open] = useState(false);
  const [nav3Open, setNav3Open] = useState(false);
  const [nav4Open, setNav4Open] = useState(false);
  const safeStock = useSelector((state: RootState) => state.safeStock);
  const handleClick = (nav:number) => {
    switch (nav) {
      case 1:
        setNav1Open(!nav1Open);
        break;
      case 2:
        setNav2Open(!nav2Open);
        break;
      case 3:
        setNav3Open(!nav3Open);
        break;
      case 4:
        setNav4Open(!nav4Open);
        break;
      default:
        break;
    }
  };
  const getCount = async () => {
    try {
      const res = await axios.post('/api/stock/safe_count');
      dispatch(getSafeStockCount(res.data.data.total));
    } catch (error) {
      console.log(error)
  };
}
  useEffect(()=>{
    getCount()
  },[])
  return (
    <div className={style.container}>
      <div className={style.logoContainer}>
        <div className={style.logo}>
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M15 3H21V21H3V15H7V11H11V7H15V3Z"></path></svg>
        </div>
        <div className={style.name}>ERP System</div>
      </div>
      <List sx={{ width: "100%" }} component="nav">
        <ListItemButton onClick={()=>navigate('/')} className={classNames(currnetPath==='/' && style.activeNav)}>
          <div className={style.navLogo}>
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M19 5v2h-4V5h4M9 5v6H5V5h4m10 8v6h-4v-6h4M9 17v2H5v-2h4M21 3h-8v6h8V3zM11 3H3v10h8V3zm10 8h-8v10h8V11zm-10 4H3v6h8v-6z"></path></svg>
          </div>
          <ListItemText
            primary="儀錶板"
            sx={{
              "& .MuiListItemText-primary": {
                fontSize: "18px",
                letterSpacing: "3px",
              },
            }}
          />
        </ListItemButton>
        <ListItemButton  onClick={() => handleClick(1)}>
          <div className={style.navLogo}>
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linejoin="round" stroke-width="32" d="M416 221.25V416a48 48 0 0 1-48 48H144a48 48 0 0 1-48-48V96a48 48 0 0 1 48-48h98.75a32 32 0 0 1 22.62 9.37l141.26 141.26a32 32 0 0 1 9.37 22.62z"></path><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 56v120a32 32 0 0 0 32 32h120m-232 80h160m-160 80h160"></path></svg>
          </div>
          <ListItemText
            primary="資料增修"
            sx={{
              "& .MuiListItemText-primary": {
                fontSize: "18px",
                letterSpacing: "3px",
              },
            }}
          />
          {nav1Open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={nav1Open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>navigate('/documents/manufactor')} className={classNames(currnetPath==='/documents/manufactor' && style.activeNav)}>
              <ListItemText primary="廠商資料增修"/>
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>navigate('/documents/product')} className={classNames(currnetPath==='/documents/product' && style.activeNav)}>
              <ListItemText primary="商品資料增修"/>
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>navigate('/documents/size')} className={classNames(currnetPath==='/documents/size' && style.activeNav)}>
              <ListItemText primary="尺寸對照資料增修"/>
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>navigate('/documents/type')} className={classNames(currnetPath==='/documents/type' && style.activeNav)}>
              <ListItemText primary="類別對照資料增修"/>
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>navigate('/documents/brand')} className={classNames(currnetPath==='/documents/brand' && style.activeNav)}>
              <ListItemText primary="品牌對照資料增修"/>
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>navigate('/documents/color')} className={classNames(currnetPath==='/documents/color' && style.activeNav)}>
              <ListItemText primary="顏色對照資料增修"/>
            </ListItemButton>
          </List>
        </Collapse>
        <ListItemButton  onClick={() => handleClick(2)}>
          <div className={style.navLogo}>
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M668.6 320c0-4.4-3.6-8-8-8h-54.5c-3 0-5.8 1.7-7.1 4.4l-84.7 168.8H511l-84.7-168.8a8 8 0 0 0-7.1-4.4h-55.7c-1.3 0-2.6.3-3.8 1-3.9 2.1-5.3 7-3.2 10.8l103.9 191.6h-57c-4.4 0-8 3.6-8 8v27.1c0 4.4 3.6 8 8 8h76v39h-76c-4.4 0-8 3.6-8 8v27.1c0 4.4 3.6 8 8 8h76V704c0 4.4 3.6 8 8 8h49.9c4.4 0 8-3.6 8-8v-63.5h76.3c4.4 0 8-3.6 8-8v-27.1c0-4.4-3.6-8-8-8h-76.3v-39h76.3c4.4 0 8-3.6 8-8v-27.1c0-4.4-3.6-8-8-8H564l103.7-191.6c.5-1.1.9-2.4.9-3.7zM157.9 504.2a352.7 352.7 0 0 1 103.5-242.4c32.5-32.5 70.3-58.1 112.4-75.9 43.6-18.4 89.9-27.8 137.6-27.8 47.8 0 94.1 9.3 137.6 27.8 42.1 17.8 79.9 43.4 112.4 75.9 10 10 19.3 20.5 27.9 31.4l-50 39.1a8 8 0 0 0 3 14.1l156.8 38.3c5 1.2 9.9-2.6 9.9-7.7l.8-161.5c0-6.7-7.7-10.5-12.9-6.3l-47.8 37.4C770.7 146.3 648.6 82 511.5 82 277 82 86.3 270.1 82 503.8a8 8 0 0 0 8 8.2h60c4.3 0 7.8-3.5 7.9-7.8zM934 512h-60c-4.3 0-7.9 3.5-8 7.8a352.7 352.7 0 0 1-103.5 242.4 352.57 352.57 0 0 1-112.4 75.9c-43.6 18.4-89.9 27.8-137.6 27.8s-94.1-9.3-137.6-27.8a352.57 352.57 0 0 1-112.4-75.9c-10-10-19.3-20.5-27.9-31.4l49.9-39.1a8 8 0 0 0-3-14.1l-156.8-38.3c-5-1.2-9.9 2.6-9.9 7.7l-.8 161.7c0 6.7 7.7 10.5 12.9 6.3l47.8-37.4C253.3 877.7 375.4 942 512.5 942 747 942 937.7 753.9 942 520.2a8 8 0 0 0-8-8.2z"></path></svg>
          </div>
          <ListItemText
            primary="日常交易作業"
            sx={{
              "& .MuiListItemText-primary": {
                fontSize: "18px",
                letterSpacing: "3px",
              },
            }}
          />
          {nav2Open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={nav2Open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>navigate('/daily/manufactorRestock')} className={classNames(currnetPath==='/daily/manufactorRestock' && style.activeNav)}>
              <ListItemText primary="廠商進退貨" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>navigate('/daily/productSale')} className={classNames(currnetPath==='/daily/productSale' && style.activeNav)}>
              <ListItemText primary="前台作業" />
            </ListItemButton>
          </List>
        </Collapse>
        <ListItemButton  onClick={() => handleClick(3)}>
          <div className={style.navLogo}>
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-width="2" d="M2,5.07692308 C2,5.07692308 3.66666667,2 12,2 C20.3333333,2 22,5.07692308 22,5.07692308 L22,18.9230769 C22,18.9230769 20.3333333,22 12,22 C3.66666667,22 2,18.9230769 2,18.9230769 L2,5.07692308 Z M2,13 C2,13 5.33333333,16 12,16 C18.6666667,16 22,13 22,13 M2,7 C2,7 5.33333333,10 12,10 C18.6666667,10 22,7 22,7"></path></svg>
          </div>
          <ListItemText
            primary="庫存管理作業"
            sx={{
              "& .MuiListItemText-primary": {
                fontSize: "18px",
                letterSpacing: "3px",
              },
            }}
          />
          {nav3Open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={nav3Open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>navigate('/stock/stockSearch')} className={classNames(currnetPath==='/stock/stockSearch' && style.activeNav)}>
              <ListItemText primary="庫存查詢"/>
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>navigate('/stock/stockHistory')} className={classNames(currnetPath==='/stock/stockHistory' && style.activeNav)}>
              <ListItemText primary="庫存記錄" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>navigate('/stock/stockSafe')} className={classNames(currnetPath==='/stock/stockSafe' && style.activeNav)}>
              <ListItemText primary="安全庫存" />
              {safeStock.lowSafeStockCount > 0 && <span className={style.stockCount}>{safeStock.lowSafeStockCount}</span>}
            </ListItemButton>
          </List>
        </Collapse>
        <ListItemButton  onClick={() => handleClick(4)}>
          <div className={style.navLogo}>
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path><path d="M9 17v-5"></path><path d="M12 17v-1"></path><path d="M15 17v-3"></path></svg>
          </div>
          <ListItemText
            primary="統計報表作業"
            sx={{
              "& .MuiListItemText-primary": {
                fontSize: "18px",
                letterSpacing: "3px",
              },
            }}
          />
          {nav4Open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={nav4Open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>navigate('/report/productSaleCalculate')} className={classNames(currnetPath==='/report/productSaleCalculate' && style.activeNav)}>
              <ListItemText primary="商品銷售總表" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>navigate('/report/saleRanking')} className={classNames(currnetPath==='/report/saleRanking' && style.activeNav)}>
              <ListItemText primary="商品銷售排行" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>navigate('/report/restockCalculate')} className={classNames(currnetPath==='/report/restockCalculate' && style.activeNav)}>
              <ListItemText primary="廠商進貨總表" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>navigate('/report/saleCalculate')} className={classNames(currnetPath==='/report/saleCalculate' && style.activeNav)}>
              <ListItemText primary="廠商銷貨總表" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </div>
  );
}

export default SideNav;
