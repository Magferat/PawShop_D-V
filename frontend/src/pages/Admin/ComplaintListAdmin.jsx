import { useGetAllComplaintsQuery, useDeleteComplaintMutation } from "../../redux/api/complaintApiSlice";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ComplaintListAdmin = () => {
    const { data: complaints, isLoading, refetch } = useGetAllComplaintsQuery();
    const [deleteComplaint] = useDeleteComplaintMutation();

    const handleDelete = async (id) => {
        if (window.confirm("Delete this complaint?")) {
            try {
                await deleteComplaint(id).unwrap();
                toast.success("Complaint deleted");
                refetch();
            } catch {
                toast.error("Failed to delete");
            }
        }
    };
    // console.log(complaints);
    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">All Complaints</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <table className="w-full border text-left">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Against</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {complaints.map((c) => (
                            <tr key={c._id} className="border-t">
                                {/* {console.log(c)} */}
                                <td>{c._id}</td>
                                <td>{c.complaintAgainst}</td>
                                <td>{c.typeOfComplaint}</td>
                                <td>{new Date(c.dateOfIncident).toLocaleDateString()}</td>
                                <td>
                                    <Link to={`/admin/complaints/${c._id}`} className="text-blue-600 mr-4">View</Link>
                                    <button onClick={() => handleDelete(c._id)} className="text-red-600">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ComplaintListAdmin;
