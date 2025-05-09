import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import { FaRegCommentDots, FaPenFancy, FaStar } from "react-icons/fa";

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading } = useGetTopProductsQuery();

  const [activeTab, setActiveTab] = useState(1);

  if (isLoading) {
    return <Loader />;
  }

  const tabs = [
    { id: 1, label: "Write Your Review", icon: <FaPenFancy className="mr-2" /> },
    { id: 2, label: "All Reviews", icon: <FaRegCommentDots className="mr-2" /> },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-10 text-gray-800">
      {/* Tabs Navigation */}
      <section className="flex lg:flex-col gap-4 text-lg font-semibold">
        {tabs.map(({ id, label, icon }) => (
          <div
            key={id}
            onClick={() => setActiveTab(id)}
            className={`cursor-pointer flex items-center px-4 py-2 rounded-lg transition ${
              activeTab === id
                ? "bg-pink-600 text-white shadow-lg scale-105"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            {icon} {label}
          </div>
        ))}
      </section>

      {/* Tab Content */}
      <section className="flex-1">
        {/* Write Review */}
        {activeTab === 1 && (
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-pink-100">
            {userInfo ? (
              <form onSubmit={submitHandler} className="space-y-6">
                <div>
                  <label htmlFor="rating" className="block text-xl mb-2 font-medium">
                    Your Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-pink-300"
                  >
                    <option value="">Select...</option>
                    <option value="1">⭐ Inferior</option>
                    <option value="2">⭐⭐ Decent</option>
                    <option value="3">⭐⭐⭐ Great</option>
                    <option value="4">⭐⭐⭐⭐ Excellent</option>
                    <option value="5">⭐⭐⭐⭐⭐ Exceptional</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="comment" className="block text-xl mb-2 font-medium">
                    Your Comment
                  </label>
                  <textarea
                    id="comment"
                    rows="3"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-pink-300"
                    placeholder="Share your thoughts..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition w-full text-lg shadow-md disabled:opacity-70"
                >
                  {loadingProductReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <p className="text-gray-600 text-lg">
                Please{" "}
                <Link to="/login" className="text-pink-600 underline hover:text-pink-800">
                  sign in
                </Link>{" "}
                to write a review.
              </p>
            )}
          </div>
        )}

        {/* All Reviews */}
        {activeTab === 2 && (
          <div className="space-y-6">
            {product.reviews.length === 0 ? (
              <p className="text-gray-500 text-lg">No reviews yet. Be the first to share your experience!</p>
            ) : (
              product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white p-5 rounded-2xl shadow border border-gray-100 transition hover:shadow-md"
                >
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
                    <strong className="text-pink-700">{review.name}</strong>
                    <span>{review.createdAt.substring(0, 10)}</span>
                  </div>
                  <Ratings value={review.rating} />
                  <p className="mt-3 text-gray-700">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductTabs;
