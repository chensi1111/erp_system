import style from "./SideNav.module.css";
import { RiStairsFill } from "react-icons/ri";
import { IoDocumentTextOutline } from "react-icons/io5";
import { AiOutlineTransaction } from "react-icons/ai";
import { GrStorage } from "react-icons/gr";
import { TbReportAnalytics } from "react-icons/tb";
import { MdOutlineDashboard } from "react-icons/md";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import classNames from "classnames";
function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const currnetPath = location.pathname;
  const [nav1Open, setNav1Open] = useState(false);
  const [nav2Open, setNav2Open] = useState(false);
  const [nav3Open, setNav3Open] = useState(false);
  const [nav4Open, setNav4Open] = useState(false);
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
  return (
    <div className={style.container}>
      <div className={style.logoContainer}>
        <div className={style.logo}>
          <RiStairsFill />
        </div>
        <div className={style.name}>ERP System</div>
      </div>
      <List sx={{ width: "100%" }} component="nav">
        <ListItemButton onClick={()=>navigate('/')} className={classNames(currnetPath==='/' && style.activeNav)}>
          <div className={style.navLogo}>
            <MdOutlineDashboard />
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
            <IoDocumentTextOutline />
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
            <AiOutlineTransaction />
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
              <ListItemText primary="廠商進貨" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={()=>navigate('/daily/productSale')} className={classNames(currnetPath==='/daily/productSale' && style.activeNav)}>
              <ListItemText primary="前台銷貨" />
            </ListItemButton>
          </List>
        </Collapse>
        <ListItemButton  onClick={() => handleClick(3)}>
          <div className={style.navLogo}>
            <GrStorage />
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
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="庫存分類查詢" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="庫存季別查詢" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="庫存調整作業" />
            </ListItemButton>
          </List>
        </Collapse>
        <ListItemButton  onClick={() => handleClick(4)}>
          <div className={style.navLogo}>
            <TbReportAnalytics />
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
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="商品銷售總表" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="商品銷售明細" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="商品銷售統計" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary="暢滯銷排行榜" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </div>
  );
}

export default SideNav;
