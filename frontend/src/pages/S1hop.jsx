import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetFilteredProductsQuery,
} from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";
import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import ProductCard from "./Products/ProductCard";

const S1hop = () => {
  const dispatch = useDispatch();
  const { categories, checked, products } = useSelector((state) => state.shop);

  const [priceFilter, setPriceFilter] = useState("");
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState(""); // <-- New brand state

  const { data: productData = [], isLoading:  loadingProducts } = useGetFilteredProductsQuery({
    checked,
    radio: [],
  });

  const { data: categoryData = [], isLoading: loadingCategories } = useFetchCategoriesQuery();

  useEffect(() => {
    if (!loadingCategories && categoryData) {
      dispatch(setCategories(categoryData));
    }
  }, [categoryData, loadingCategories, dispatch]);

  useEffect(() => {
    if (!loadingProducts && productData) {
      let filtered = [...productData];

      if (checked.length) {
        filtered = filtered.filter((p) => checked.includes(p.category));
      }

      if (brand) {
        filtered = filtered.filter((p) => p.brand === brand);
      }

      if (priceFilter) {
        filtered = filtered.filter(
          (p) =>
            p.price.toString().includes(priceFilter) ||
            p.price === parseInt(priceFilter, 10)
        );
      }

      if (search.trim()) {
        filtered = filtered.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Avoid unnecessary dispatches to prevent infinite loop
      dispatch(setProducts(filtered));
    }
  }, [checked, brand, priceFilter, search, productData, loadingProducts, dispatch]);

  const handleCheck = (checkedState, id) => {
    const updated = checkedState ? [...checked, id] : checked.filter((c) => c !== id);
    dispatch(setChecked(updated));
  };

  const handleBrandClick = (brand) => {
    const byBrand = productData?.filter((p) => p.brand === brand);
    dispatch(setProducts(byBrand));
  };

  const uniqueBrands = [...new Set(productData?.map((p) => p.brand).filter(Boolean))];

  return (
    <div className="flex w-full min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="bg-[#e5f0dc] p-4 w-[220px] min-h-screen shadow-md space-y-4">
        <h2 className="text-lg text-black font-bold text-center mb-4">Filter By</h2>

        <div>
          <h3 className="font-semibold mb-2 text-black">Categories</h3>
          {categories?.map((c) => (
            <button
              key={c._id}
              onClick={() => handleCheck(!checked.includes(c._id), c._id)}
              className={`text-black w-full mb-2 py-2 rounded-full font-semibold ${
                checked.includes(c._id) ? "bg-green-600 text-black" : "bg-green-200"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div>
          <h3 className="text-black font-semibold mt-6 mb-2">Brands</h3>
          {uniqueBrands.map((brand) => (
            <button
              key={brand}
              onClick={() => handleBrandClick(brand)}
              className="text-black w-full mb-2 py-2 rounded-full bg-green-200 hover:bg-green-300 font-semibold"
            >
              {brand}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-black font-semibold mb-2">Filter by Price</h3>
          <input
            type="text"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            placeholder="Enter price"
            className="text-black w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring focus:ring-green-300"
          />
        </div>

        <button
          onClick={() => window.location.reload()}
          className="text-black mt-4 w-full bg-red-200 hover:bg-red-300 py-2 rounded-full"
        >
          Reset Filters
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Search Bar */}
        <div className="mb-6 flex items-center justify-center">
          <input
            type="text"
            placeholder="🔍 Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="text-black w-full max-w-2xl px-6 py-3 border-2 border-orange-400 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-lg"
          />
        </div>

        {/* Product Grid */}
        <h2 className="text-2xl text-black font-bold mb-6">Essentials Shop</h2>
        {loadingProducts ? (
          <Loader />
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products?.map((p) => (
              <div key={p._id} className="bg-lightskin shadow-md rounded-lg overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-black font-semibold text-md">{p.name}</h3>
                  <p className="text-black text-sm text-black-600">BDT {p.price}</p>
                  <div className="flex flex-col gap-2 mt-4">

                  <button
                    className="p-2 rounded-full"
                    onClick={() => addToCartHandler(p, 1)}
                  >
                    <AiOutlineShoppingCart size={25} color="black" />
                  </button>
                  
                    <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-pink-700 rounded-lg hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800"
          >
            View Details
            <svg
              className="w-3.5 h-3.5 ml-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default S1hop;
