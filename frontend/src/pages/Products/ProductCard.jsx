import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import { useSelector } from "react-redux";

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const isUser = userInfo && !userInfo.isAdmin;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
      <div className="max-w-sm relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition duration-300">
        <section className="relative">
          <Link to={`/product/${p._id}`}>
            {/* Brand Badge */}
            <span className="absolute bottom-3 right-3 bg-pink-100 text-pink-700 text-xs font-medium px-3 py-1 rounded-full shadow-sm">
              {p?.brand}
            </span>
            {/* Product Image */}
            <img
              className="cursor-pointer w-full h-[170px] object-cover rounded-t-2xl"
              src={p.image}
              alt={p.name}
            />
          </Link>
  
          {/* Wishlist Icon */}
          <div className="absolute top-2 right-2">
            <HeartIcon product={p} />
          </div>
        </section>
  
        <div className="p-5">
          {/* Name & Price */}
          <div className="flex justify-between items-center mb-2">
            <h5 className="text-lg font-semibold text-gray-800 truncate">
              {p?.name}
            </h5>
            <p className="text-pink-600 font-bold text-sm">
              {p?.price?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </p>
          </div>
  
          {/* Description */}
          <p className="text-sm text-gray-500 mb-4 line-clamp-2">
            {p?.description?.substring(0, 60)}...
          </p>
  
          {/* CTA & Cart */}
          <section className="flex justify-between items-center">
            <Link
              to={`/product/${p._id}`}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded-full transition"
            >
              Read More
              <svg
                className="w-3.5 h-3.5 ml-2"
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

          {isUser ? (
            <button
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition"
              onClick={() => addToCartHandler(p, 1)}
            >
              <AiOutlineShoppingCart size={22} className="text-pink-600" />
            </button>
            ) : (<p ></p>)}
          </section>
        </div>
      </div>
    );
};

export default ProductCard;

