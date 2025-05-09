import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { useAddToCartMutation } from "../../redux/features/cart/cartApiSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [addToCartApi] = useAddToCartMutation();

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data || error.message);
    }
  };

  const addToCartHandler = async () => {
    try {
      await addToCartApi({ productId: product._id, qty }).unwrap();
      toast.success("Added to cart");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add to cart");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link
        to="/productshop"
        className="text-pink-600 font-semibold hover:underline mb-6 inline-block text-lg"
      >
        &larr; Back to Shop
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row gap-12 bg-pink-50 p-6 rounded-3xl shadow-lg border border-pink-100">
            {/* Image */}
            <div className="flex-shrink-0 w-full lg:w-[400px]">
              <img
                src={product.image}
                alt={product.name}
                className="rounded-2xl shadow-md w-full h-[320px] object-cover border-4 border-pink-200"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1 flex flex-col justify-between text-gray-800">
              <div>
                <h2 className="text-3xl font-extrabold mb-3 text-pink-700 tracking-wide">
                  {product.name}
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {product.description}
                </p>

                <p className="text-4xl font-extrabold text-green-600 mb-6">
                  ${product.price}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
                  <div className="space-y-3">
                    <p className="flex items-center">
                      <FaStore className="mr-2 text-yellow-600" />{" "}
                      <span className="font-semibold text-gray-700">Brand:</span>{" "}
                      {product.brand}
                    </p>
                    <p className="flex items-center">
                      <FaClock className="mr-2 text-green-500" />{" "}
                      <span className="font-semibold text-gray-700">Added:</span>{" "}
                      {moment(product.createAt).fromNow()}
                    </p>
                    <p className="flex items-center">
                      <FaStar className="mr-2 text-yellow-500" />{" "}
                      <span className="font-semibold text-gray-700">
                        Reviews:
                      </span>{" "}
                      {product.numReviews}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="flex items-center">
                      <FaStar className="mr-2 text-yellow-500" />{" "}
                      <span className="font-semibold text-gray-700">
                        Rating:
                      </span>{" "}
                      {product.rating}
                    </p>
                    <p className="flex items-center">
                      <FaShoppingCart className="mr-2 text-pink-500" />{" "}
                      <span className="font-semibold text-gray-700">
                        Quantity:
                      </span>{" "}
                      {product.quantity}
                    </p>
                    <p className="flex items-center">
                      <FaBox className="mr-2 text-green-600" />{" "}
                      <span className="font-semibold text-gray-700">
                        In Stock:
                      </span>{" "}
                      {product.countInStock}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity & Button */}
              <div className="flex items-center justify-between flex-wrap gap-4 mt-6">
                <Ratings
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />

                {product.countInStock > 0 && (
                  <div>
                    <select
                      value={qty}
                      onChange={(e) => setQty(Number(e.target.value))}
                      className="p-2 w-[6rem] border-2 border-pink-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  onClick={addToCartHandler}
                  disabled={product.countInStock === 0}
                  className={`${
                    product.countInStock === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-pink-600 hover:bg-pink-700"
                  } text-white px-6 py-2 rounded-full shadow-md transition`}
                >
                  {product.countInStock === 0 ? "Out of Stock" : "Add To Cart"}
                </button>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-12">
            <ProductTabs
              loadingProductReview={loadingProductReview}
              userInfo={userInfo}
              submitHandler={submitHandler}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              product={product}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetails;
