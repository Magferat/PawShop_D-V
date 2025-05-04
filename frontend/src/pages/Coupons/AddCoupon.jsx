import React, { useState } from "react";
import { useCreateCouponMutation } from "../../redux/api/couponApiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddCoupon = () => {
  const [templateCode, setTemplateCode] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [pointCost, setPointCost] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();
  const [createCoupon, { isLoading }] = useCreateCouponMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createCoupon({
        templateCode,
        discountValue,
        pointCost,
        description,
      }).unwrap();

      toast.success("Coupon created successfully");
      navigate("/admin/addcoupon"); // or clear form if staying on page
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create coupon");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl text-black font-semibold mb-4">Add New Coupon</h2>
      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label className="block mb-1 text-black font-medium">Template Code</label>
          <input
            type="text"
            className="text-black w-full border p-2 rounded"
            value={templateCode}
            onChange={(e) => setTemplateCode(e.target.value)}
            placeholder="e.g 25-OFF-VET"
          />
        </div>

        <div>
          <label className="text-black block mb-1 font-medium">Discount Value</label>
          <input
            type="number"
            className="text-black w-full border p-2 rounded"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-black block mb-1 font-medium">Point Cost</label>
          <input
            type="number"
            className="text-black w-full border p-2 rounded"
            value={pointCost}
            onChange={(e) => setPointCost(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-black block mb-1 font-medium">Description</label>
          <textarea
            className="text-black w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {isLoading ? "Creating..." : "Create Coupon"}
        </button>
      </form>
    </div>
  );
};

export default AddCoupon;
