// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
// import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

// import {
//   setCategories,
//   setProducts,
//   setChecked,
// } from "../redux/features/shop/shopSlice";
// import Loader from "../components/Loader";
// import ProductCard from "./Products/ProductCard";

// const Shop = () => {
//   const dispatch = useDispatch();
//   const { categories, products, checked, radio } = useSelector(
//     (state) => state.shop
//   );

//   const categoriesQuery = useFetchCategoriesQuery();
//   const [priceFilter, setPriceFilter] = useState("");

//   const filteredProductsQuery = useGetFilteredProductsQuery({
//     checked,
//     radio,
//   });

//   useEffect(() => {
//     if (!categoriesQuery.isLoading) {
//       dispatch(setCategories(categoriesQuery.data));
//     }
//   }, [categoriesQuery.data, dispatch]);

//   useEffect(() => {
//     if (!checked.length || !radio.length) {
//       if (!filteredProductsQuery.isLoading) {
//         // Filter products based on both checked categories and price filter
//         const filteredProducts = filteredProductsQuery.data.filter(
//           (product) => {
//             // Check if the product price includes the entered price filter value
//             return (
//               product.price.toString().includes(priceFilter) ||
//               product.price === parseInt(priceFilter, 10)
//             );
//           }
//         );

//         dispatch(setProducts(filteredProducts));
//       }
//     }
//   }, [checked, radio, filteredProductsQuery.data, dispatch, priceFilter]);

//   const handleBrandClick = (brand) => {
//     const productsByBrand = filteredProductsQuery.data?.filter(
//       (product) => product.brand === brand
//     );
//     dispatch(setProducts(productsByBrand));
//   };

//   const handleCheck = (value, id) => {
//     const updatedChecked = value
//       ? [...checked, id]
//       : checked.filter((c) => c !== id);
//     dispatch(setChecked(updatedChecked));
//   };

//   // Add "All Brands" option to uniqueBrands
//   const uniqueBrands = [
//     ...Array.from(
//       new Set(
//         filteredProductsQuery.data
//           ?.map((product) => product.brand)
//           .filter((brand) => brand !== undefined)
//       )
//     ),
//   ];

//   const handlePriceChange = (e) => {
//     // Update the price filter state when the user types in the input filed
//     setPriceFilter(e.target.value);
//   };

//   return (
//     <>
//       <div className="container mx-auto">
//         <div className="flex md:flex-row">
//           <div className="bg-[#151515] p-3 mt-2 mb-2">
//             <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
//               Filter by Categories
//             </h2>

//             <div className="p-5 w-[15rem]">
//               {categories?.map((c) => (
//                 <div key={c._id} className="mb-2">
//                   <div className="flex ietms-center mr-4">
//                     <input
//                       type="checkbox"
//                       id="red-checkbox"
//                       onChange={(e) => handleCheck(e.target.checked, c._id)}
//                       className="w-4 h-4 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//                     />

//                     <label
//                       htmlFor="pink-checkbox"
//                       className="ml-2 text-sm font-medium text-white dark:text-gray-300"
//                     >
//                       {c.name}
//                     </label>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
//               Filter by Brands
//             </h2>

//             <div className="p-5">
//               {uniqueBrands?.map((brand) => (
//                 <>
//                   <div className="flex items-enter mr-4 mb-5">
//                     <input
//                       type="radio"
//                       id={brand}
//                       name="brand"
//                       onChange={() => handleBrandClick(brand)}
//                       className="w-4 h-4 text-pink-400 bg-gray-100 border-gray-300 focus:ring-pink-500 dark:focus:ring-pink-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//                     />

//                     <label
//                       htmlFor="pink-radio"
//                       className="ml-2 text-sm font-medium text-white dark:text-gray-300"
//                     >
//                       {brand}
//                     </label>
//                   </div>
//                 </>
//               ))}
//             </div>

//             <h2 className="h4 text-center py-2 bg-black rounded-full mb-2">
//               Filer by Price
//             </h2>

//             <div className="p-5 w-[15rem]">
//               <input
//                 type="text"
//                 placeholder="Enter Price"
//                 value={priceFilter}
//                 onChange={handlePriceChange}
//                 className="w-full px-3 py-2 placeholder-gray-400 border rounded-lg focus:outline-none focus:ring focus:border-pink-300"
//               />
//             </div>

//             <div className="p-5 pt-0">
//               <button
//                 className="w-full border my-4"
//                 onClick={() => window.location.reload()}
//               >
//                 Reset
//               </button>
//             </div>
//           </div>

//           <div className="p-3">
//             <h2 className="h4 text-center mb-2">{products?.length} Products</h2>
//             <div className="flex flex-wrap">
//               {products.length === 0 ? (
//                 <Loader />
//               ) : (
//                 products?.map((p) => (
//                   <div className="p-3" key={p._id}>
//                     <ProductCard p={p} />
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Shop;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";

import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";

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
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 w-full md:w-[260px] sticky top-4 h-fit">
          <h2 className="text-lg font-semibold mb-4 text-center text-gray-700">
            Filter by Categories
          </h2>
          {categories?.map((c) => (
            <div key={c._id} className="mb-3">
              <label className="flex items-center space-x-2 text-gray-600">
                <input
                  type="checkbox"
                  onChange={(e) => handleCheck(e.target.checked, c._id)}
                  className="w-4 h-4 text-pink-500 focus:ring-pink-400"
                />
                <span className="text-sm">{c.name}</span>
              </label>
            </div>
          ))}
  
          <h2 className="text-lg font-semibold mb-4 mt-6 text-center text-gray-700">
            Filter by Brands
          </h2>
          {uniqueBrands?.map((brand) => (
            <div key={brand} className="mb-3">
              <label className="flex items-center space-x-2 text-gray-600">
                <input
                  type="radio"
                  name="brand"
                  onChange={() => handleBrandClick(brand)}
                  className="w-4 h-4 text-pink-500 focus:ring-pink-400"
                />
                <span className="text-sm">{brand}</span>
              </label>
            </div>
          ))}
  
          <h2 className="text-lg font-semibold mb-4 mt-6 text-center text-gray-700">
            Filter by Price
          </h2>
          <input
            type="text"
            placeholder="Enter Price"
            value={priceFilter}
            onChange={handlePriceChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-300 focus:outline-none"
          />
  
          <button
            className="w-full mt-6 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition"
            onClick={() => window.location.reload()}
          >
            Reset Filters
          </button>
        </div>
  
        {/* Products */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
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
        </div>
      </div>
    </div>
  );
  

};

export default Shop;
