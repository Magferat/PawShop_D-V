import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
// import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";

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

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 mt-10 text-gray-800">
      {/* Tabs Navigation */}
      <section className="flex lg:flex-col gap-4 text-lg">
        {[
          { id: 1, label: "Write Your Review" },
          { id: 2, label: "All Reviews" },
        ].map(({ id, label }) => (
          <div
            key={id}
            onClick={() => handleTabClick(id)}
            className={`cursor-pointer px-4 py-2 rounded-lg transition ${
              activeTab === id
                ? "bg-pink-600 text-white font-semibold shadow"
                : "hover:bg-gray-200"
            }`}
          >
            {label}
          </div>
        ))}
      </section>
  
      {/* Tab Content */}
      <section className="flex-1">
        {/* Write Review */}
        {activeTab === 1 && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            {userInfo ? (
              <form onSubmit={submitHandler} className="space-y-6">
                <div>
                  <label htmlFor="rating" className="block text-xl mb-2">
                    Rating
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full p-2 border rounded-lg text-black"
                  >
                    <option value="">Select</option>
                    <option value="1">Inferior</option>
                    <option value="2">Decent</option>
                    <option value="3">Great</option>
                    <option value="4">Excellent</option>
                    <option value="5">Exceptional</option>
                  </select>
                </div>
  
                <div>
                  <label htmlFor="comment" className="block text-xl mb-2">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    rows="3"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-2 border rounded-lg text-black"
                  ></textarea>
                </div>
  
                <button
                  type="submit"
                  disabled={loadingProductReview}
                  className="bg-pink-600 text-white px-5 py-2 rounded-lg hover:bg-pink-700 transition"
                >
                  {loadingProductReview ? "Submitting..." : "Submit"}
                </button>
              </form>
            ) : (
              <p className="text-gray-600">
                Please <Link to="/login" className="text-pink-600 underline">sign in</Link> to write a review
              </p>
            )}
          </div>
        )}
  
        {/* All Reviews */}
        {activeTab === 2 && (
          <div className="space-y-6">
            {product.reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white p-4 rounded-lg shadow-sm"
                >
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <strong>{review.name}</strong>
                    <span>{review.createdAt.substring(0, 10)}</span>
                  </div>
                  <p className="my-2">{review.comment}</p>
                  <Ratings value={review.rating} />
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
