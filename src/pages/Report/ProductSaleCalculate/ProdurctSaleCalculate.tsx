import style from "./ProductSaleCalculate.module.css";
import { useState, useEffect, useRef } from "react";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
// component
import ShowSaleCalculate from "../../../component/ProductSaleCalculate/ShowProductSaleCalculate";
// mui
import Pagination from "@mui/material/Pagination";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  TextField,
} from "@mui/material";
// icon
import arrowDropUp from "../../../assets/icons/arrowDropUp.svg"
import arrowDropDown from "../../../assets/icons/arrowDropDown.svg"
// utils
import { getGrossProfit } from "../../../utils/calculate";
interface Report {
  product_id: string;
  specification: string;
  sale_quantity: number;
  sale_amount: number;
  refund_quantity: number;
  refund_amount: number;
  ordering_quantity: number;
  order_amount: number;
  return_order_quantity: number;
  return_order_amount: number;
  gross_profit: number;
}
interface ReportDetail {
  product_id: string;
  product_name: string;
  specification: string;
  manufactor: string;
  brand: string;
  size: string;
  color: string;
  product_type1: string;
  product_type2: string;
  product_type3: string;
  product_type4: string;
  sale_quantity: number,
  refund_quantity: number,
  ordering_quantity: number,
  return_order_quantity:number,
  sale_amount: number,
  refund_amount: number,
  ordering_amount: number,
  return_order_amount: number
}
function SaleCalculate() {
  const [sort, setSort] = useState<"ASC" | "DESC">("DESC");
  const [searchType, setSearchType] = useState("product_id");
  const [filter, setFilter] = useState({
    product_id: "",
    specification: "",
    product_name: "",
    manufactor:""
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openShow, setOpenShow] = useState(false);
  const [data, setData] = useState<Report[]>([]);
  const [rangeType, setRangeType] = useState("today"); // today | 7days | month | custom
  const [customRange, setCustomRange] = useState({
    start: "",
    end: "",
  });
  const [detail, setDetail] = useState<ReportDetail>({
    product_id: "",
    product_name: "",
    specification: "",
    manufactor: "",
    brand: "",
    size: "",
    color: "",
    product_type1: "",
    product_type2: "",
    product_type3: "",
    product_type4: "",
    sale_quantity: 0,
    refund_quantity: 0,
    ordering_quantity: 0,
    return_order_quantity:0,
    sale_amount: 0,
    refund_amount: 0,
    ordering_amount: 0,
    return_order_amount: 0
  });
  const [summary, setSummary] = useState({
    sale_quantity: 0,
    refund_quantity: 0,
    ordering_quantity: 0,
    return_order_quantity: 0,
    sale_amount: 0,
    refund_amount: 0,
    order_amount: 0,
    return_order_amount: 0,
    gross_profit:0
  });
  const debounceRef = useRef<number | null>(null);
  const getList = async () => {
    try {
      const res = await axios.post("/api/report/list", {
        page,
        pageSize: 10,
        filter,
        sort,
        rangeType,
        customRange,
      });
      setData(res.data.data.list);
      setTotalPages(res.data.data.totalPages);
      setSummary(res.data.data.summary);
    } catch (error) {
      const err = error as any;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const getDetail = async (specification: string) => {
    try {
      const res = await axios.post("/api/report/detail", {
        specification,
        rangeType,
        customRange,
      });
      if (res.data.code === "000") {
        setDetail(res.data.data.list);
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
        specification: "",
        product_name: "",
        manufactor:""
      });
    } else if (searchType === "specification") {
      setFilter({
        product_id: "",
        specification: value,
        product_name: "",
        manufactor:""
      });
    } else if (searchType === "product_name") {
      setFilter({
        product_id: "",
        specification: "",
        product_name: value,
        manufactor:""
      });
    } else{
      setFilter({
        product_id: "",
        specification: "",
        product_name: "",
        manufactor:value
      });
    }
  };
  const handleSetSearchType = (value: string) => {
    setSearchType(value);
    setFilter({ product_id: "", specification: "", product_name: "", manufactor: "" });
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
    setData([]);
    if (rangeType === "custom" && (!customRange.start || !customRange.end)) {
      return;
    }
    getList();
  }, [page, sort, rangeType, customRange]);
  return (
    <div className={style.container}>
      {openShow && (
        <ShowSaleCalculate
          onClose={() => setOpenShow(false)}
          detail={detail}
          rangeType={rangeType}
          customRange={customRange}
        />
      )}
      <div className={style.topContainer}>
        <div className={style.title}>商品銷售總表</div>
      </div>
      <div className={style.searchContainer}>
        <select
          value={searchType}
          onChange={(e) => handleSetSearchType(e.target.value)}
          className={style.searchSelect}
        >
          <option value="product_id">商品編號</option>
          <option value="specification">商品規格</option>
          <option value="product_name">商品名稱</option>
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
      <div className={style.dateContainer}>
        <Box display="flex" alignItems="center" gap={2}>
          <FormControl size="small">
            <InputLabel>日期範圍</InputLabel>
            <Select
              value={rangeType}
              label="日期範圍"
              onChange={(e) => setRangeType(e.target.value)}
              sx={{ minWidth: 150, backgroundColor: "white" }}
            >
              <MenuItem value="today">今日</MenuItem>
              <MenuItem value="7days">一周</MenuItem>
              <MenuItem value="1month">一個月</MenuItem>
              <MenuItem value="custom">自訂範圍</MenuItem>
            </Select>
          </FormControl>

          {rangeType === "custom" && (
            <>
              <TextField
                size="small"
                type="date"
                value={customRange.start}
                sx={{ backgroundColor: "white" }}
                onChange={(e) => {
                  const newStart = e.target.value;
                  // 如果 end 比新的 start 早，就重置 end
                  setCustomRange((prev) => ({
                    start: newStart,
                    end: prev.end && prev.end <= newStart ? "" : prev.end,
                  }));
                }}
              />
              <TextField
                size="small"
                type="date"
                value={customRange.end}
                sx={{ backgroundColor: "white" }}
                onChange={(e) =>
                  setCustomRange({ ...customRange, end: e.target.value })
                }
                slotProps={{
                  htmlInput: {
                    min: customRange.start
                      ? new Date(
                          new Date(customRange.start).getTime() +
                            24 * 60 * 60 * 1000
                        )
                          .toISOString()
                          .split("T")[0]
                      : undefined,
                  },
                }}
              />
            </>
          )}
        </Box>
      </div>
      <div className={style.infos}>
        <div className={style.info}>
          <div className={style.infoTitle}>銷貨數 / 額</div>
          <div className={style.infoValue}>
            {summary.sale_quantity} / $ {summary.sale_amount}
          </div>
        </div>
        <div className={style.info}>
          <div className={style.infoTitle}>退貨數 / 額</div>
          <div className={style.infoValue}>
            {summary.refund_quantity} / $ {summary.refund_amount}
          </div>
        </div>
        <div className={style.info}>
          <div className={style.infoTitle}>訂貨中 / 額</div>
          <div className={style.infoValue}>
            {summary.ordering_quantity} / $ {summary.order_amount}
          </div>
        </div>
        <div className={style.info}>
          <div className={style.infoTitle}>退訂數 / 額</div>
          <div className={style.infoValue}>
            {summary.return_order_quantity} / ${" "}
            {summary.return_order_amount}
          </div>
        </div>
        <div className={style.info}>
          <div className={style.infoTitle}>毛利</div>
          <div className={style.infoValue}>$ {summary.gross_profit}</div>
        </div>
        <div className={style.info}>
          <div className={style.infoTitle}>毛利率</div>
          <div className={style.infoValue}>{((summary.gross_profit) / (summary.sale_amount - summary.refund_amount)*100).toFixed(2)}%</div>
        </div>
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
              <th>商品規格</th>
              <th>銷售量 / 額</th>
              <th>退貨量 / 額</th>
              <th>訂貨中 / 額</th>
              <th>退訂量 / 額</th>
              <th>毛利</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => (
              <tr key={m.specification}>
                <td>{m.product_id}</td>
                <td>{m.specification}</td>
                <td>
                  {m.sale_quantity} / $ {m.sale_amount}
                </td>
                <td>
                  {m.refund_quantity} / $ {m.refund_amount}
                </td>
                <td>
                  {m.ordering_quantity} / $ {m.order_amount}
                </td>
                <td>
                  {m.return_order_quantity} / $ {m.return_order_amount}
                </td>
                <td>$ {getGrossProfit(m)}</td>
                <td className={style.actions}>
                  <button
                    className={style.detailBtn}
                    onClick={() => getDetail(m.specification)}
                  >
                    詳細
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={8}
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

export default SaleCalculate;
