import "./App.css";
import SideNav from "./component/SideNav/SideNav";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import ManufactorDocument from "./pages/Documents/ManufactorDocument/ManufactorDocument";
import ProductDocument from "./pages/Documents/ProdductDocument/ProductDocument";
import BrandDocument from "./pages/Documents/BrandDocument/BrandDocument";
import SizeDocument from "./pages/Documents/SizeDocument/SizeDocument";
import TypeDocument from "./pages/Documents/TypeDocument/TypeDocument";
import ManufactorRestock from "./pages/Daily/ManufactorRestock/ManufactorRestock";
import ColorDocument from "./pages/Documents/ColorDocument/ColorDocument";
import StockSearch from "./pages/Stock/StockSearch/StockSearch";
import ProductSale from "./pages/Daily/ProductSale/ProductSale";
import StockHistory from "./pages/Stock/StockHistory/StockHistory";
function App() {
  return (
    <BrowserRouter>
    <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
      <div className="app">
        <SideNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/documents/manufactor"
            element={<ManufactorDocument />}
          />
          <Route
            path="/documents/product"
            element={<ProductDocument />}
          />
          <Route
            path="/documents/brand"
            element={<BrandDocument />}
          />
          <Route
            path="/documents/size"
            element={<SizeDocument />}
          />
          <Route
            path="/documents/type"
            element={<TypeDocument />}
          />
          <Route
            path="/documents/color"
            element={<ColorDocument />}
          />
          <Route
            path="/daily/manufactorRestock"
            element={<ManufactorRestock />}
          />
          <Route
            path="/daily/productSale"
            element={<ProductSale />}
          />
          <Route
            path="/stock/stockSearch"
            element={<StockSearch />}
          />
          <Route
            path="/stock/stockHistory"
            element={<StockHistory />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;
