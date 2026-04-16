import style from "./ProductDocument.module.css";
import { useState, useEffect, useRef } from "react";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import Pagination from "@mui/material/Pagination";
import { useDispatch } from "react-redux";
// store
import { getProductInfoRelation } from "../../../store/productInfoRelationSlice";
// component
import CreateProductDocument from "../../../component/ProductDocument/CreateProductDocument";
import ShowProductDocument from "../../../component/ProductDocument/ShowProductDocument";
// icon
import plus from "../../../assets/icons/plusIcon.svg"
import arrowDropUp from "../../../assets/icons/arrowDropUp.svg"
import arrowDropDown from "../../../assets/icons/arrowDropDown.svg"
interface Product {
  product_id: string;
  product_name: string;
  specification: string;
}
interface ProductDetail {
  product_id: string;
  product_name:  string;
  specification: string;
  create_date: string;
  manufactor:string;
  brand:string;
  size:string;
  color:string;
  product_type1:string;
  product_type2:string;
  product_type3:string;
  product_type4:string;
  recommended_price:number;
  purchase_price:number;
  last_cost:number;
  cumulative_cost:number;
  cumulative_in_quantity:number;
  remark: string;
}
function ProductDocument() {
  const dispatch = useDispatch();
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
  const [openCreate, setOpenCreate] = useState(false);
  const [specification, setSpecification] = useState("");
  const [openShow, setOpenShow] = useState(false);
  const [data, setDate] = useState<Product[]>([]);
  const [type, setType] = useState(false);
  const [detail, setDetail] = useState<ProductDetail>(
    {
      product_id: "",
      product_name:  "",
      specification: "",
      create_date: "",
      manufactor:"",
      brand:"",
      size:"",
      color:"",
      product_type1:"",
      product_type2:"",
      product_type3:"",
      product_type4:"",
      recommended_price:0,
      purchase_price:0,
      last_cost:0,
      remark: "",
      cumulative_cost:0,
    cumulative_in_quantity:0
    }
  );
  const handleCreateOpen = (specification:string) =>{
    setSpecification(specification)
    setOpenCreate(true)
  }
  const debounceRef = useRef<number | null>(null);
  const getList = async () => {
    try {
      const res = await axios.post("/api/product/list", {
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
  const getDetail = async (
    specification: string,
    product_id: string,
    type: boolean
  ) => {
    setType(type);
    try {
      const res = await axios.post("/api/product/detail", {
        specification,
        product_id,
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
  const handleDelete = async (specification: string) => {
    try {
      const res = await axios.post("/api/product/delete", { specification });
      if (res.data.code === "000") {
        toast.success("刪除成功");
        const updateData = data.filter(
          (item) => item.specification !== specification
        );
        if (updateData.length === 0 && page > 1) {
          setPage(page - 1);
        }
        getList();
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
    } else if(searchType === "product_name") {
      setFilter({
        product_id: "",
        specification: "",
        product_name: value,
        manufactor:""
      });
    } else if(searchType === "manufactor") {
      setFilter({
        product_id: "",
        specification: "",
        product_name: "",
        manufactor: value
      });
    }
  };
  const handleSetSearchType = (value: string) => {
    setSearchType(value);
    setFilter({ product_id: "", specification: "", product_name: "", manufactor: "" });
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
  }, [filter]);

  useEffect(() => {
    getList();
  }, [page, sort]);
  useEffect(() => {
    createProductInfos();
  }, []);
  return (
    <div className={style.container}>
      {openCreate && (
        <CreateProductDocument
          Specification={specification}
          onClose={() => setOpenCreate(false)}
          onSuccess={() => {
            setOpenCreate(false);
            getList();
          }}
        />
      )}
      {openShow && (
        <ShowProductDocument
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
        <div className={style.title}>商品基本資料</div>
                <div className={style.button} onClick={() => handleCreateOpen("")}>
          <img src={plus} alt="plus"/>
          新增商品
        </div>
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
              <th>商品名稱</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {data.map((m) => (
              <tr key={m.specification}>
                <td>{m.product_id}</td>
                <td>{m.specification}</td>
                <td>{m.product_name}</td>
                <td className={style.actions}>
                  <button
                    className={style.detailBtn}
                    onClick={() =>
                      getDetail(m.specification, m.product_id, false)
                    }
                  >
                    詳細
                  </button>
                  <button
                    className={style.editBtn}
                    onClick={() =>
                      getDetail(m.specification, m.product_id, true)
                    }
                  >
                    編輯
                  </button>
                    <button
                    className={style.addBtn}
                    onClick={() => handleCreateOpen(m.specification)}
                  >
                    增加規格
                  </button>
                  <button
                    className={style.deleteBtn}
                    onClick={() => handleDelete(m.specification)}
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

export default ProductDocument;
