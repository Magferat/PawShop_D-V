import { useState } from "react";
import { useCreateComplaintMutation } from "../../redux/api/complaintApiSlice";
import { toast } from "react-toastify";

const ComplaintForm = () => {
    const [complaintAgainst, setComplaintAgainst] = useState("product");
    const [orderId, setOrderId] = useState("");
    const [email, setEmail] = useState("");
    const [typeOfComplaint, setTypeOfComplaint] = useState("");
    const [dateOfIncident, setDateOfIncident] = useState("");
    const [description, setDescription] = useState("");

    const [createComplaint, { isLoading }] = useCreateComplaintMutation();

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await createComplaint({
                complaintAgainst,
                orderId: complaintAgainst === "product" ? orderId : undefined,
                email: complaintAgainst === "user" ? email : undefined,
                typeOfComplaint,
                dateOfIncident,
                description,
            }).unwrap();
            toast.success("Complaint submitted successfully");
        } catch (err) {
            toast.error(err?.data?.message || "Failed to submit complaint");
        }
    };

    return (
        <form onSubmit={submitHandler} className="max-w-md mx-auto space-y-4 p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold">Submit a Complaint</h2>

            <select
                value={complaintAgainst}
                onChange={(e) => setComplaintAgainst(e.target.value)}
                className="w-full border p-2 rounded"
            >
                <option value="product">Product</option>
                <option value="user">User</option>
            </select>

            {complaintAgainst === "product" && (
                <input
                    type="text"
                    placeholder="Order ID"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
            )}

            {complaintAgainst === "user" && (
                <input
                    type="text"
                    placeholder="Email of complaint against"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
            )}

            <input
                type="text"
                placeholder="Type of Complaint"
                value={typeOfComplaint}
                onChange={(e) => setTypeOfComplaint(e.target.value)}
                className="w-full border p-2 rounded"
                required
            />

            <input
                type="date"
                value={dateOfIncident}
                onChange={(e) => setDateOfIncident(e.target.value)}
                className="w-full border p-2 rounded"
                required
            />

            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border p-2 rounded"
                required
            />

            <button type="submit" disabled={isLoading} className="bg-blue-500 text-white py-2 px-4 rounded">
                {isLoading ? "Submitting..." : "Submit Complaint"}
            </button>
        </form>
    );
};

export default ComplaintForm;
