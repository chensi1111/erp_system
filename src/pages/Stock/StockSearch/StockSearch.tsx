import style from "./StockSearch.module.css";
import ShowStockSearch from "../../../component/StockSearch/ShowStockSearch";
import { useState, useEffect, useRef } from "react";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import arrowDropUp from "../../../assets/icons/arrowDropUp.svg"
import arrowDropDown from "../../../assets/icons/arrowDropDown.svg"

interface Stock {
  product_id: string;
  specification: string;
  product_name: string;
  stock_qty: Stock_qty[];
}
interface Stock_qty {
  size: string;
  all_quantity: string;
  available_quantity: string;
  reserved_quantity: string;
  safe_stock: string;
}
interface StockDetail {
  product_id: string;
  product_name: string;
  specification: string;
  stock_qty: Stock_qty[];
  last_in_date: string;
  last_out_date: string;
}
function StockSearch() {
  const [sort, setSort] = useState<"ASC" | "DESC">("DESC");
  const [searchType, setSearchType] = useState("product_id");
  const [filter, setFilter] = useState({
    product_id: "",
    product_name: "",
    specification: "",
    manufactor: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openShow, setOpenShow] = useState(false);
  const [data, setDate] = useState<Stock[]>([]);
  const [type, setType] = useState(false);
  const [detail, setDetail] = useState<StockDetail>({
    product_id: "",
    product_name: "",
    specification: "",
    stock_qty: [],
    last_in_date: "",
    last_out_date: "",
  });
  const getTotalNumber = (list: any) => {
    return list.reduce((total: any, item: any) => {
      const qty = parseInt(item.all_quantity, 10);
      return total + (isNaN(qty) ? 0 : qty);
    }, 0);
  };
  const debounceRef = useRef<number | null>(null);
  const getList = async () => {
    try {
      const res = await axios.post("/api/stock/list", {
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
  const getDetail = async (specification: string, type: boolean) => {
    setType(type);
    try {
      const res = await axios.post("/api/stock/detail", { specification });
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
    if (searchType === "product_id") {
      setFilter({
        product_id: value,
        product_name: "",
        specification: "",
        manufactor: "",
      });
    } else if (searchType === "specification") {
      setFilter({
        product_id: "",
        product_name: "",
        specification: value,
        manufactor: "",
      });
    } else if (searchType === "manufactor") {
      setFilter({
        product_id: "",
        product_name: "",
        specification: "",
        manufactor: value,
      });
    } else if (searchType === "product_name") {
      setFilter({
        product_id: "",
        product_name: value,
        specification: "",
        manufactor: "",
      });
    }
  };
  const handleSetSearchType = (value: string) => {
    setSearchType(value);
    setFilter({ product_id: "", product_name: "", specification: "", manufactor: "" });
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
        <ShowStockSearch
          onClose={() => setOpenShow(false)}
          detail={detail}
          type={type}
          onSuccess={() => {
            setOpenShow(false);
            getList();
          }}
        />
      )}
      <div className={style.topContainer}>
        <div className={style.title}>庫存查詢</div>
      </div>
      <div className={style.searchContainer}>
        <select
          value={searchType}
          onChange={(e) => handleSetSearchType(e.target.value)}
          className={style.searchSelect}
        >
          <option value="product_id">商品編號</option>
          <option value="product_name">商品名稱</option>
          <option value="specification">商品規格</option>
          <option value="manufactor">廠商編號</option>
        </select>
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
        {searchType === "product_name" && (
          <input
            type="text"
            placeholder="搜尋關鍵字"
            value={filter.product_name}
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
      </div>
      <div className={style.tableContainer}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>
                <span>商品編號</span>
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
              <th>商品名稱</th>
              <th>商品規格</th>
              <th>庫存量</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => (
              <tr key={m.specification}>
                <td>{m.product_id}</td>
                <td>{m.product_name}</td>
                <td>{m.specification}</td>
                <td>{getTotalNumber(m.stock_qty)}</td>
                <td className={style.actions}>
                  <button
                    className={style.detailBtn}
                    onClick={() => getDetail(m.specification, false)}
                  >
                    詳細
                  </button>
                  <button
                    className={style.editBtn}
                    onClick={() => getDetail(m.specification, true)}
                  >
                    編輯
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={5}
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

export default StockSearch;
