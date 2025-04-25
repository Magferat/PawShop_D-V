
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../../redux/features/shop/shopSlice";

import Loader from "../../components/Loader";
import ProductCard from "./ProductCard";

const Shop = () => {
  const dispatch = useDispatch();
  const { categories, products, checked, radio } = useSelector(
    (state) => state.shop
  );

  const categoriesQuery = useFetchCategoriesQuery();
  const [priceFilter, setPriceFilter] = useState("");

  const filteredProductsQuery = useGetFilteredProductsQuery({
    checked,
    radio,
  });

  useEffect(() => {
    if (!categoriesQuery.isLoading) {
      dispatch(setCategories(categoriesQuery.data));
    }
  }, [categoriesQuery.data, dispatch]);

  useEffect(() => {
    if (!checked.length || !radio.length) {
      if (!filteredProductsQuery.isLoading) {
        const filteredProducts = filteredProductsQuery.data.filter((product) =>
          product.price.toString().includes(priceFilter) ||
          product.price === parseInt(priceFilter, 10)
        );
        dispatch(setProducts(filteredProducts));
      }
    }
  }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

  const handleBrandClick = (brand) => {
    const productsByBrand = filteredProductsQuery.data?.filter(
      (product) => product.brand === brand
    );
    dispatch(setProducts(productsByBrand));
  };

  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);
    dispatch(setChecked(updatedChecked));
  };

  const uniqueBrands = [
    ...Array.from(
      new Set(
        filteredProductsQuery.data
          ?.map((product) => product.brand)
          .filter((brand) => brand !== undefined)
      )
    ),
  ];

  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <aside className="bg-yellow-50 border border-yellow-200 rounded-2xl shadow p-6 w-full md:w-[260px] sticky top-4 h-fit">
          <h2 className="text-lg font-bold mb-4 text-center text-green-700">
            Filter by Categories
          </h2>
          {categories?.map((c) => (
            <div key={c._id} className="mb-3">
              <label className="flex items-center space-x-2 text-gray-700">
                <input
                  type="checkbox"
                  onChange={(e) => handleCheck(e.target.checked, c._id)}
                  className="w-4 h-4 text-green-500 focus:ring-green-300 rounded"
                />
                <span className="text-sm">{c.name}</span>
              </label>
            </div>
          ))}
  
          <h2 className="text-lg font-bold mb-4 mt-6 text-center text-green-700">
            Filter by Brands
          </h2>
          {uniqueBrands?.map((brand) => (
            <div key={brand} className="mb-3">
              <label className="flex items-center space-x-2 text-gray-700">
                <input
                  type="radio"
                  name="brand"
                  onChange={() => handleBrandClick(brand)}
                  className="w-4 h-4 text-green-500 focus:ring-green-300 rounded"
                />
                <span className="text-sm">{brand}</span>
              </label>
            </div>
          ))}
  
          <h2 className="text-lg font-bold mb-4 mt-6 text-center text-green-700">
            Filter by Price
          </h2>
          <input
            type="text"
            placeholder="Enter Price"
            value={priceFilter}
            onChange={handlePriceChange}
            className="w-full px-3 py-2 border border-yellow-300 rounded-lg text-sm focus:ring-2 focus:ring-green-300 focus:outline-none bg-white"
          />
  
          <button
            className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition"
            onClick={() => window.location.reload()}
          >
            Reset Filters
          </button>
        </aside>
  
        {/* Products */}
        <main className="flex-1">
          <h2 className="text-2xl font-bold text-green-700 mb-6">
            {products?.length} Products
          </h2>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length === 0 ? (
              <Loader />
            ) : (
              products.map((p) => (
                <div key={p._id} className="w-full">
                  <ProductCard p={p} />
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );  
  

};

export default Shop;
