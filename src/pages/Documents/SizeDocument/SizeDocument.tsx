import style from "./SizeDocument.module.css";
import { useState, useEffect, useRef } from "react";
import axios, { type ApiError } from "../../../api/axios";
import { toast } from "react-toastify";
import Pagination from "@mui/material/Pagination";
// component
import CreateSizeDocument from "../../../component/SizeDocument/CreateSizeDocument";
import ShowSizeDocument from "../../../component/SizeDocument/ShowSizeDocument";
// icon
import plus from "../../../assets/icons/plusIcon.svg"
import arrowDropUp from "../../../assets/icons/arrowDropUp.svg"
import arrowDropDown from "../../../assets/icons/arrowDropDown.svg"
interface Size {
  size_id: string;
  size_name: string;
  size_list: string;
}
interface SizeDetail {
  size_id: string;
  size_name: string;
  size_list: string;
  create_date: string;
  remark: string;
}
function SizeDocument() {
  const [sort, setSort] = useState<"ASC" | "DESC">("DESC");
  const [searchType, setSearchType] = useState("size_id");
  const [filter, setFilter] = useState({
    size_id: "",
    size_name: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openCreate, setOpenCreate] = useState(false);
  const [openShow, setOpenShow] = useState(false);
  const [data, setDate] = useState<Size[]>([]);
  const [type, setType] = useState(false);
  const [detail, setDetail] = useState<SizeDetail>({
    size_id: "",
    size_name: "",
    size_list: "",
    create_date: "",
    remark: "",
  });
  const debounceRef = useRef<number | null>(null);
  const getList = async () => {
    try {
      const res = await axios.post("/api/size/list", {
        page,
        pageSize: 10,
        filter,
        sort,
      });
      setDate(res.data.data.list);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const getDetail = async (size_id: string, type: boolean) => {
    setType(type);
    try {
      const res = await axios.post("/api/size/detail", { size_id });
      if (res.data.code === "000") {
        setDetail(res.data.data);
        setOpenShow(true);
      }
    } catch (error) {
      const err = error as ApiError;
      toast.error(err.response?.data?.msg || "伺服器錯誤");
    }
  };
  const handleDelete = async (size_id: string) => {
    try {
      const res = await axios.post("/api/size/delete", { size_id });
      if (res.data.code === "000") {
        toast.success("刪除成功");
        const updateData = data.filter((item) => item.size_id !== size_id);
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
    if (searchType === "size_id") {
      setFilter({
        size_id: value,
        size_name: "",
      });
    } else {
      setFilter({
        size_id: "",
        size_name: value,
      });
    }
  };
  const handleSetSearchType = (value: string) => {
    setSearchType(value);
    setFilter({ size_id: "", size_name: "" });
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
  }, [page, sort]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={style.container}>
      {openCreate && (
        <CreateSizeDocument
          onClose={() => setOpenCreate(false)}
          onSuccess={() => {
            setOpenCreate(false);
            getList();
          }}
        />
      )}
      {openShow && (
        <ShowSizeDocument
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
        <div className={style.title}>尺寸基本資料</div>
        <div className={style.button} onClick={() => setOpenCreate(true)}>
          <img src={plus} alt="plus"/>
          新增尺寸
        </div>
      </div>
      <div className={style.searchContainer}>
        <select
          value={searchType}
          onChange={(e) => handleSetSearchType(e.target.value)}
          className={style.searchSelect}
        >
          <option value="size_id">尺寸編號</option>
          <option value="size_name">尺寸名稱</option>
        </select>
        {searchType === "size_id" && (
          <input
            type="text"
            placeholder="搜尋關鍵字"
            value={filter.size_id}
            className={style.searchInput}
            onChange={(e) => handleSetFilter(e.target.value)}
          />
        )}
        {searchType === "size_name" && (
          <input
            type="text"
            placeholder="搜尋關鍵字"
            value={filter.size_name}
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
                <span>尺寸編號</span>
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
              <th>尺寸名稱</th>
              <th>尺碼</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => (
              <tr key={m.size_id}>
                <td>{m.size_id}</td>
                <td>{m.size_name}</td>
                <td>{m.size_list}</td>
                <td className={style.actions}>
                  <button
                    className={style.detailBtn}
                    onClick={() => getDetail(m.size_id, false)}
                  >
                    詳細
                  </button>
                  <button
                    className={style.editBtn}
                    onClick={() => getDetail(m.size_id, true)}
                  >
                    編輯
                  </button>
                  <button
                    className={style.deleteBtn}
                    onClick={() => handleDelete(m.size_id)}
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={4}
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

export default SizeDocument;
