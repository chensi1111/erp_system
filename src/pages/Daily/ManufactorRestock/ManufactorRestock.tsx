import style from "./ManufactorRestock.module.css";
import classNames from "classnames";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import axios, { type ApiError } from "../../../api/axios";
import { toast } from "react-toastify";
import "dayjs/locale/zh-tw";
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
// store
import { getProductInfoRelation } from "../../../store/productInfoRelationSlice";
import { getSafeStockCount } from "../../../store/safeStcokSlice";
// component
import ManufactorRestockTable from "../../../component/ManufactorRestock/ManufactorRestockTable";
import ShowManufactorRestockTable from "../../../component/ManufactorRestock/ShowManufactorRestockTable";
import type { ShowManufactorRestockTableDetail } from "../../../component/ManufactorRestock/ShowManufactorRestockTable";
// icon
import plus from "../../../assets/icons/plusIcon.svg"
import arrowDropUp from "../../../assets/icons/arrowDropUp.svg"
import arrowDropDown from "../../../assets/icons/arrowDropDown.svg"
// utils
import { formattedDate } from "../../../utils/formattedTime";
// import { checkToday } from "../../../utils/checkToday";
interface Restock {
  restock_id: string;
  manufactor: string;
  total_quantity: number;
  total_price: number;
  date: string;
  type: number;
}
interface Summary {
  total_in_quantity: number;
  total_in_price: number;
  total_out_quantity: number;
  total_out_price: number;
}

function ManufactorRestock() {
  const dispatch = useDispatch();
  const [rangeType, setRangeType] = useState("today"); // today | 7days | month | custom
  const [customRange, setCustomRange] = useState({
    start: "",
    end: "",
  });
  const [sort, setSort] = useState<"ASC" | "DESC">("DESC");
  const [searchType, setSearchType] = useState("restock_id");
  const [filter, setFilter] = useState({
    restock_id: "",
    manufactor: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [type, setType] = useState(0);
  const [openCreate, setOpenCreate] = useState(false);
  const [openShow, setOpenShow] = useState(false);
  const [data, setData] = useState<Restock[]>([]);
  const [detail, setDetail] = useState<ShowManufactorRestockTableDetail | null>(null);
  const [summary, setSummary] = useState<Summary>({
    total_in_quantity: 0,
    total_in_price: 0,
    total_out_quantity: 0,
    total_out_price: 0,
  });
  const debounceRef = useRef<number | null>(null);

  const getList = async () => {
    try {
      const res = await axios.post("/api/restock/list", {
        page,
        pageSize: 10,
        filter,
        sort,
        rangeType,
        customRange
      });
      setData(res.data.data.list);
      setSummary(res.data.data.summary);
      setTotalPages(res.data.data.totalPages);
      const countRes = await axios.post("/api/stock/safe_count");
      dispatch(getSafeStockCount(countRes.data.data.total));
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const handleCreate = (type: number) => {
    setType(type);
    setOpenCreate(true);
  };
  const handleDetail = async (restock_id: string) => {
    try {
      const res = await axios.post("/api/restock/detail", { restock_id });
      if (res.data.code === "000") {
        setDetail(res.data.data);
        setOpenShow(true);
      }
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const handleDelete = async (restock_id: string, type: number) => {
    try {
      const res = await axios.post("/api/restock/delete", { restock_id, type });
      if (res.data.code === "000") {
        toast.success("取消成功");
        const updateData = data.filter(
          (item) => item.restock_id !== restock_id
        );
        if (updateData.length === 0 && page > 1) {
          setPage(page - 1);
        }
        getList();
      }
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const handleSetFilter = (value: string) => {
    if (searchType === "restock_id") {
      setFilter({
        restock_id: value,
        manufactor: "",
      });
    } else {
      setFilter({
        restock_id: "",
        manufactor: value,
      });
    }
  };
  const handleSetSearchType = (value: string) => {
    setSearchType(value);
    setFilter({ restock_id: "", manufactor: "" });
  };
  const createProductInfos = async () => {
    const response = await axios.post("/api/product/info");
    if (response.data.code == "000") {
      dispatch(getProductInfoRelation(response.data.data));
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
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    getList();
  }, [page, sort, rangeType, customRange]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    createProductInfos();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={style.container}>
      {openCreate && (
        <ManufactorRestockTable
          onClose={() => setOpenCreate(false)}
          onSuccess={() => {
            setOpenCreate(false);
            getList();
          }}
          type={type}
        />
      )}
      {openShow && detail && (
        <ShowManufactorRestockTable
          detail={detail}
          onClose={() => setOpenShow(false)}
        />
      )}
      <div className={style.topContainer}>
        <div className={style.title}>廠商作業</div>
        <div className={style.buttons}>
          <div className={style.button} onClick={() => handleCreate(0)}>
            <img src={plus} alt="plus" />
            廠商進貨
          </div>
          <div
            className={classNames(style.button, style.refund)}
            onClick={() => handleCreate(1)}
          >
            <img src={plus} alt="plus"/>
            廠商退貨
          </div>
        </div>
      </div>
      <div className={style.allSearch}>
         <div className={style.searchContainer}>
        <select
          value={searchType}
          onChange={(e) => handleSetSearchType(e.target.value)}
          className={style.searchSelect}
        >
          <option value="restock_id">單號</option>
          <option value="manufactor">廠商代號</option>
        </select>
        {searchType === "restock_id" && (
          <input
            type="text"
            placeholder="搜尋關鍵字"
            value={filter.restock_id}
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
            <div className={style.infoTitle}>進貨數量</div>
            <div className={style.infoValue}>{summary.total_in_quantity}</div>
          </div>
          <div className={style.info}>
            <div className={style.infoTitle}>進貨金額</div>
            <div className={style.infoValue}>$ {summary.total_in_price}</div>
          </div>
          <div className={style.info}>
            <div className={style.infoTitle}>退貨數量</div>
            <div className={style.infoValue}>{summary.total_out_quantity}</div>
          </div>
          <div className={style.info}>
            <div className={style.infoTitle}>退貨金額</div>
            <div className={style.infoValue}>$ {summary.total_out_price}</div>
          </div>
          <div className={style.info}>
            <div className={style.infoTitle}>結餘金額</div>
            <div className={style.infoValue}>$ {summary.total_out_price - summary.total_in_price}</div>
          </div>
        </div>
      <div className={style.tableContainer}>
        <table className={style.table}>
          <thead>
            <tr>
              <th>
                <span>單號</span>
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
              <th>類型</th>
              <th>廠商代號</th>
              <th>總數量</th>
              <th>總金額</th>
              <th>日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => (
              <tr key={m.restock_id}>
                <td>{m.restock_id}</td>
                <td
                  className={classNames(
                    m.type === 0 && style.restock,
                    style.typeTitle
                  )}
                >
                  {m.type === 0 ? "進貨" : "退貨"}
                </td>
                <td>{m.manufactor}</td>
                <td>{m.total_quantity}</td>
                <td>$ {m.total_price}</td>
                <td>{formattedDate(m.date)}</td>
                <td className={style.actions}>
                  <button
                    className={style.detailBtn}
                    onClick={() => handleDetail(m.restock_id)}
                  >
                    詳細
                  </button>
                    <button
                      className={style.deleteBtn}
                      onClick={() => handleDelete(m.restock_id, m.type)}
                    >
                      取消
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

export default ManufactorRestock;
