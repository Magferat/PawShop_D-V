import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import Ratings from "../Products/Ratings";
import {
  useGetPublicUserProfileQuery,
  useCreateUserReviewMutation,
  useDeleteUserReviewMutation,
} from "../../redux/api/usersApiSlice";

const OwnerDetails = () => {
  const { id: ownerId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetPublicUserProfileQuery(ownerId);

  const [createUserReview, { isLoading: loadingReview }] = useCreateUserReviewMutation();
  const [deleteUserReview] = useDeleteUserReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createUserReview({ userId: ownerId, rating, comment }).unwrap();
      toast.success("Review added!");
      setRating(0);
      setComment("");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  const deleteHandler = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete your review?")) {
      try {
        await deleteUserReview({ userId: ownerId, reviewId }).unwrap();
        toast.success("Review deleted.");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.message);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <Link to="/petshop" className="text-blue-500 font-medium hover:underline mb-4 block">
        ← Back to Pet Listings
      </Link>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.message}</Message>
      ) : (
        <>
          <div className="mb-6 flex items-center">
            {/* Display owner image */}
            {user.image ? (
              <img
                src={user.image}
                alt={user.username}
                className="w-24 h-24 rounded-full object-cover mr-4"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mr-4">
                <span className="text-white text-xl">{user.username[0]}</span>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Owner Details</h1>
              <p className="text-lg text-gray-600">Name: {user.username}</p>
              <p className="text-lg text-gray-600">Email: {user.email}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl text-black font-semibold mb-4">Owner Reviews</h2>
            {user.reviews.length === 0 ? (
              <p className="text-black">No reviews yet.</p>
            ) : (
              user.reviews.map((review) => (
                <div key={review._id} className="text-black bg-gray-100 p-4 rounded-lg mb-3">
                  <div className="text-black flex justify-between items-center">
                    <strong className="text-black">{review.name}</strong>
                    <span className="text-black text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-black my-2">{review.comment}</p>
                  <Ratings className="text-black" value={review.rating} />

                  {userInfo && review.user === userInfo._id && (
                    <button
                      onClick={() => deleteHandler(review._id)}
                      className="text-red-600 mt-2 text-sm hover:underline"
                    >
                      Delete Review
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>
            {userInfo ? (
              user.reviews.find((r) => r.user === userInfo._id) ? (
                <Message variant="info">You have already reviewed this owner.</Message>
              ) : (
                <form onSubmit={submitHandler}>
                  <div className="mb-4">
                    <label htmlFor="rating" className="text-black block mb-2 font-medium">
                      Rating
                    </label>
                    <select
                      id="rating"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full p-2 border rounded text-black"
                      required
                    >
                      <option value="">Select...</option>
                      <option value="1">1 - Inferior</option>
                      <option value="2">2 - Decent</option>
                      <option value="3">3 - Great</option>
                      <option value="4">4 - Excellent</option>
                      <option value="5">5 - Exceptional</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="comment" className="text-black block mb-2 font-medium">
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="4"
                      required
                      className="w-full p-2 border rounded text-black"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loadingReview}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Submit Review
                  </button>
                </form>
              )
            ) : (
              <p>
                Please <Link to="/login" className="text-blue-500 underline">login</Link> to write a review.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OwnerDetails;
