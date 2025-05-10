import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
    <>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Link
          to="/"
          className="text-pink-700 font-semibold hover:underline mb-4 inline-block"
        >
          &larr; Go Back
        </Link>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.message}
          </Message>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Image */}
              <div className="flex-shrink-0 w-full lg:w-[400px]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="rounded-xl shadow-md w-full h-[300px] object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 flex flex-col justify-between text-gray-800">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                  <p className="text-gray-500 mb-4">{product.description}</p>

                  <p className="text-4xl font-extrabold text-green-700 mb-6">
                    ${product.price}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 text-sm mb-6">
                    <div>
                      <p className="flex items-center mb-3">
                        <FaStore className="mr-2 text-pink-600" /> Brand: {product.brand}
                      </p>
                      <p className="flex items-center mb-3">
                        <FaClock className="mr-2 text-green-500" /> Added:{" "}
                        {moment(product.createAt).fromNow()}
                      </p>
                      <p className="flex items-center mb-3">
                        <FaStar className="mr-2 text-yellow-500" /> Reviews: {product.numReviews}
                      </p>
                    </div>
                    <div>
                      <p className="flex items-center mb-3">
                        <FaStar className="mr-2 text-yellow-500" /> Rating: {rating}
                      </p>
                      <p className="flex items-center mb-3">
                        <FaShoppingCart className="mr-2 text-pink-500" /> Quantity: {product.quantity}
                      </p>
                      <p className="flex items-center mb-3">
                        <FaBox className="mr-2 text-green-600" /> In Stock:{" "}
                        {product.countInStock}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4">
                  <Ratings
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />

                  {product.countInStock > 0 && (
                    <div>
                      <select
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                        className="p-2 w-[6rem] border border-gray-300 rounded-lg text-gray-700"
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
                    className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg transition"
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>

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
    </>
  );

};

export default ProductDetails;
