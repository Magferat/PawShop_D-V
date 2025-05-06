import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const UserMenu = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md mt-6">
      <h3 className="text-xl font-semibold text-pink-600 mb-4 text-center">🔗 Quick Access</h3>
      <ul className="space-y-4">
        <li>
          <Link
            to="/profile/incoming-requests"
            className="block text-center bg-rose-200 hover:bg-rose-300 text-rose-800 font-medium py-2 px-4 rounded-lg transition"
          >
            📥 View Incoming Requests
          </Link>
        </li>
        <li>
          <Link
            to="/profile/outgoing-requests"
            className="block text-center bg-pink-200 hover:bg-pink-300 text-pink-800 font-medium py-2 px-4 rounded-lg transition"
          >
            📤 View Outgoing Requests
          </Link>
        </li>
        <li>
          <Link
            to="/my-orders"
            className="block text-center bg-fuchsia-200 hover:bg-fuchsia-300 text-fuchsia-800 font-medium py-2 px-4 rounded-lg transition"
          >
            🛍️ View Purchase History
          </Link>
        </li>

        {userInfo && !userInfo.isAdmin && (
          <>
            <li>
              <Link
                to="/complaints/mine"
                className="block text-center bg-fuchsia-200 hover:bg-fuchsia-300 text-fuchsia-800 font-medium py-2 px-4 rounded-lg transition"
              >
                📜 My Complaints
              </Link>


            </li>
            <li>
              <Link
                to="/complaints/new"
                className="block text-center bg-fuchsia-200 hover:bg-fuchsia-300 text-fuchsia-800 font-medium py-2 px-4 rounded-lg transition"
              >
                📝 File a Complaint
              </Link>
            </li></>
        )}
        {userInfo && userInfo.isAdmin && (
          <>
            <li>
              <Link
                to="/admin/complaints" className="block text-center bg-fuchsia-200 hover:bg-fuchsia-300 text-fuchsia-800 font-medium py-2 px-4 rounded-lg transition"
              >
                📂 Complaints
              </Link>




            </li></>
        )}
      </ul>
    </div>
  );
};

export default UserMenu;
