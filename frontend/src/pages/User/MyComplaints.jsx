import { useGetMyComplaintsQuery } from "../../redux/api/complaintApiSlice";

const MyComplaints = () => {
    const { data: complaints, isLoading } = useGetMyComplaintsQuery();

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">My Complaints</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <ul className="space-y-3">
                    {complaints.map((c) => (
                        <li key={c._id} className="border p-4 rounded shadow">
                            <p><strong>Type:</strong> {c.typeOfComplaint}</p>
                            <p><strong>Against:</strong> {c.complaintAgainst}</p>
                            <p><strong>Date:</strong> {new Date(c.dateOfIncident).toLocaleDateString()}</p>
                            <p><strong>Description:</strong> {c.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyComplaints;
