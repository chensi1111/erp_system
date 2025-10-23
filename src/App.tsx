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
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App;
