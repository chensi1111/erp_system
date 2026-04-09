import style from "./StockHistory.module.css";
import { useState, useEffect, useRef } from "react";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
// component
import ShowStockHistory from "../../../component/StockHistory/ShowStockHistory";
// mui
import Pagination from "@mui/material/Pagination";
// icon
import arrowDropUp from "../../../assets/icons/arrowDropUp.svg"
import arrowDropDown from "../../../assets/icons/arrowDropDown.svg"
// utils
import { HistoryTypeMap } from "../../../utils/map";
interface Stock {
  product_id: string;
  specification: string;
  product_name: string;
  change_type: number;
  change_number: string;
  total_quantity: number;
}
interface Quantities {
  size: string;
  available_quantity: string;
  safe_stock: string;
  quantity: string;
}
interface StockDetail {
  product_id: string;
  specification: string;
  product_name: string;
  change_type: number;
  change_number: string;
  total_quantity: number;
  price: number;
  prepaid_price: number;
  remaining_price: number;
  create_date: string;
  quantities: Quantities[];
}
const ChangeTypeClassMap: Record<number, string> = {
  10: "restockType",
  0: "saleType",
  4: "orderType",
  6: "orderType",
  2: "refundType",
  8: "refundType",
  12: "refundType",
  1: "cancelType",
  3: "cancelType",
  5: "cancelType",
  7: "cancelType",
  9: "cancelType",
  11: "cancelType",
  13: "cancelType",
};
function StockHistory() {
  const [sort, setSort] = useState<"ASC" | "DESC">("DESC");
  const [searchType, setSearchType] = useState("change_number");
  const [filter, setFilter] = useState({
    change_number: "",
    product_id: "",
    specification:"",
    manufactor: "",
    change_type: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openShow, setOpenShow] = useState(false);
  const [data, setDate] = useState<Stock[]>([]);
  const [detail, setDetail] = useState<StockDetail>({
    product_id: "",
    specification: "",
    product_name: "",
    change_type: 0,
    change_number: "",
    total_quantity: 0,
    create_date: "",
    quantities: [],
    price: 0,
    prepaid_price: 0,
    remaining_price: 0,
  });
  const debounceRef = useRef<number | null>(null);
  const getList = async () => {
    try {
      const res = await axios.post("/api/stock/history", {
        page,
        pageSize: 10,
        filter,
        sort,
      });
      setDate(res.data.data.list);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const getDetail = async (change_number: string, change_type: number) => {
    try {
      const res = await axios.post("/api/stock/history_detail", {
        change_number,
        change_type,
      });
      if (res.data.code === "000") {
        setDetail(res.data.data);
        setOpenShow(true);
      }
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };

  const handleSetFilter = (value: string) => {
    if (searchType === "change_number") {
      setFilter({
        change_number: value,
        product_id: "",
        specification:"",
        manufactor: "",
        change_type: "",
      });
    } else if (searchType === "product_id") {
      setFilter({
        change_number: "",
        product_id: value,
        specification:"",
        manufactor: "",
        change_type: "",
      });
    } else if (searchType === "specification") {
      setFilter({
        change_number: "",
        product_id: "",
        specification:value,
        manufactor: "",
        change_type: "",
      });
    } else if (searchType === "change_type") {
      setFilter({
        change_number: "",
        product_id: "",
        specification:"",
        manufactor: "",
        change_type: value,
      });
    } else if (searchType === "manufactor") {
      setFilter({
        change_number: "",
        product_id: "",
        specification:"",
        manufactor: value,
        change_type: "",
      });
  };
}
  const handleSetSearchType = (value: string) => {
    setSearchType(value);
    setFilter({ change_number: "", product_id: "",specification:"", change_type: "", manufactor: "" });
  };
  const formattedQuantity = (type: number, value: number | string) => {
    if (type === 4 || type === 5 || type === 8) {
      return "";
    } else if (
      type === 0 ||
      type === 11 ||
      type === 6 ||
      type === 12 ||
      type === 3
    ) {
      return `- ${value}`;
    } else {
      return `+ ${value}`;
    }
  };
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      getList();
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [filter]);

  useEffect(() => {
    getList();
  }, [page, sort]);

  return (
    <div className={style.container}>
      {openShow && (
        <ShowStockHistory onClose={() => setOpenShow(false)} detail={detail} />
      )}
      <div className={style.topContainer}>
        <div className={style.title}>庫存記錄</div>
      </div>
      <div className={style.searchContainer}>
        <select
          value={searchType}
          onChange={(e) => handleSetSearchType(e.target.value)}
          className={style.searchSelect}
        >
          <option value="change_number">庫存單號</option>
          <option value="product_id">商品型號</option>
          <option value="specification">商品規格</option>
          <option value="manufactor">廠商編號</option>
          <option value="change_type">類型</option>
        </select>
        {searchType === "change_number" && (
          <input
            type="text"
            placeholder="搜尋關鍵字"
            value={filter.change_number}
            className={style.searchInput}
            onChange={(e) => handleSetFilter(e.target.value)}
          />
        )}
        {searchType === "product_id" && (
          <input
            type="text"
            placeholder="搜尋關鍵字"
            value={filter.product_id}
            className={style.searchInput}
            onChange={(e) => handleSetFilter(e.target.value)}
          />
        )}
        {searchType === "specification" && (
          <input
            type="text"
            placeholder="搜尋關鍵字"
            value={filter.specification}
            className={style.searchInput}
            onChange={(e) => handleSetFilter(e.target.value)}
          />
        )}
        {searchType === "manufactor" && (
          <input
            type="text"
            placeholder="搜尋關鍵字"
            value={filter.manufactor}
            className={style.searchInput}
            onChange={(e) => handleSetFilter(e.target.value)}
          />
        )}
        {searchType === "change_type" && (
          <input
            type="text"
            placeholder="搜尋關鍵字"
            value={filter.change_type}
            className={style.searchInput}
            onChange={(e) => handleSetFilter(e.target.value)}
          />
        )}
      </div>
      <div className={style.tableContainer}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>
                <span>庫存單號</span>
                {sort === "ASC" ? (
                  <img src={arrowDropUp} alt="arrowUp"
                    onClick={() => setSort("DESC")}
                    className={style.icon}
                  />
                ) : (
                  <img src={arrowDropDown} alt="arrowDown"
                    onClick={() => setSort("ASC")}
                    className={style.icon}
                  />
                )}
              </th>
              <th>商品型號</th>
              <th>商品規格</th>
              <th>商品名稱</th>
              <th>類型</th>
              <th>變更量</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => (
              <tr key={`${m.change_number}-${m.change_type}`}>
                <td>{m.change_number}</td>
                <td>{m.product_id}</td>
                <td>{m.specification}</td>
                <td>{m.product_name}</td>
                <td className={style[ChangeTypeClassMap[m.change_type]]}>
                  {HistoryTypeMap[m.change_type]}
                </td>
                <td>{formattedQuantity(m.change_type, m.total_quantity)}</td>
                <td className={style.actions}>
                  <button
                    className={style.detailBtn}
                    onClick={() => getDetail(m.change_number, m.change_type)}
                  >
                    詳細
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{ textAlign: "center", padding: "20px 0" }}
                >
                  查無資料
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {data.length > 0 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, val) => setPage(val)}
          siblingCount={0}
          boundaryCount={1}
          sx={{
            ul: {
              whiteSpace: "nowrap",
              display: "flex",
              flexWrap: "nowrap",
              justifyContent: "center",
            },
          }}
        />
      )}
    </div>
  );
}


export default StockHistory
