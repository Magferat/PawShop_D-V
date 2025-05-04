import { useParams } from "react-router-dom";

import { useGetComplaintByIdQuery, useDeleteComplaintMutation } from "../../redux/api/complaintApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


const ComplaintDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    // console.log(id);
    const { data: complaint, isLoading, refetch } = useGetComplaintByIdQuery(id);
    // console.log(complaint);
    const [deleteComplaint] = useDeleteComplaintMutation();

    const handleDelete = async (id) => {
        if (window.confirm("Delete this complaint?")) {
            try {
                await deleteComplaint(id).unwrap();
                toast.success("Complaint deleted");
                // refetch();
                navigate("/");
                //  "/admin/complaints"

            } catch {
                toast.error("Failed to delete");
            }
        }
    };
    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Complaint Details</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="bg-white p-4 rounded shadow">
                    <p><strong>Complaint Against:</strong> {complaint.complaintAgainst}</p>
                    <p><strong>Order ID:</strong> {complaint.orderId || "N/A"}</p>
                    <p><strong>Username:</strong> {complaint.username || "N/A"}</p>
                    <p><strong>Type:</strong> {complaint.typeOfComplaint}</p>
                    <p><strong>Date of Incident:</strong> {new Date(complaint.dateOfIncident).toLocaleDateString()}</p>
                    <p><strong>Description:</strong> {complaint.description}</p>
                    <button onClick={() => handleDelete(complaint._id)} className="text-red-600">Delete</button>
                </div>
            )}
        </div>
    );
};

export default ComplaintDetails;
