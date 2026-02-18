import "./App.css";
import SideNav from "./component/SideNav/SideNav";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ScrollUp from "./component/ScrollUp";

// Lazy load pages
const Home = lazy(() => import("./pages/Home/Home"));
const ManufactorDocument = lazy(() =>
  import("./pages/Documents/ManufactorDocument/ManufactorDocument")
);
const ProductDocument = lazy(() =>
  import("./pages/Documents/ProductDocument/ProductDocument")
);
const BrandDocument = lazy(() =>
  import("./pages/Documents/BrandDocument/BrandDocument")
);
const SizeDocument = lazy(() =>
  import("./pages/Documents/SizeDocument/SizeDocument")
);
const TypeDocument = lazy(() =>
  import("./pages/Documents/TypeDocument/TypeDocument")
);
const ColorDocument = lazy(() =>
  import("./pages/Documents/ColorDocument/ColorDocument")
);
const ManufactorRestock = lazy(() =>
  import("./pages/Daily/ManufactorRestock/ManufactorRestock")
);
const ProductSale = lazy(() =>
  import("./pages/Daily/ProductSale/ProductSale")
);
const StockSearch = lazy(() =>
  import("./pages/Stock/StockSearch/StockSearch")
);
const StockHistory = lazy(() =>
  import("./pages/Stock/StockHistory/StockHistory")
);
const StockSafe = lazy(() => import("./pages/Stock/StockSafe/StockSafe"));
const ProductSaleCalculate = lazy(() =>
  import("./pages/Report/ProductSaleCalculate/ProdurctSaleCalculate")
);
const SaleRanking = lazy(() =>
  import("./pages/Report/SaleRanking/SaleRanking")
);
const RestockCalculate = lazy(() =>
  import("./pages/Report/RestockCalculate/RestockCalculate")
);
const SaleCalculate = lazy(() =>
  import("./pages/Report/SaleCalculate/SaleCalculate")
);

function App() {
  return (
    <BrowserRouter>
      <ScrollUp />
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
      <div className="app">
        <SideNav />

        <Suspense fallback={<div className="page-loading">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/documents/manufactor" element={<ManufactorDocument />} />
            <Route path="/documents/product" element={<ProductDocument />} />
            <Route path="/documents/brand" element={<BrandDocument />} />
            <Route path="/documents/size" element={<SizeDocument />} />
            <Route path="/documents/type" element={<TypeDocument />} />
            <Route path="/documents/color" element={<ColorDocument />} />

            <Route path="/daily/manufactorRestock" element={<ManufactorRestock />} />
            <Route path="/daily/productSale" element={<ProductSale />} />

            <Route path="/stock/stockSearch" element={<StockSearch />} />
            <Route path="/stock/stockHistory" element={<StockHistory />} />
            <Route path="/stock/stockSafe" element={<StockSafe />} />

            <Route path="/report/productSaleCalculate" element={<ProductSaleCalculate />} />
            <Route path="/report/saleRanking" element={<SaleRanking />} />
            <Route path="/report/restockCalculate" element={<RestockCalculate />} />
            <Route path="/report/saleCalculate" element={<SaleCalculate />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
