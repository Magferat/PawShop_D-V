// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { saveShippingAddress } from "../../redux/features/cart/cartSlice";

// const Shipping = () => {
//     const cart = useSelector((state) => state.cart);
//     const { shippingAddress } = cart;

//     const [address, setAddress] = useState(shippingAddress.address || "");
//     const [city, setCity] = useState(shippingAddress.city || "");
//     const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
//     const [country, setCountry] = useState(shippingAddress.country || "");

//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const submitHandler = (e) => {
//         e.preventDefault();
//         console.log(address, city, postalCode, country);
//         dispatch(saveShippingAddress({ address, city, postalCode, country }));
//         navigate("/place-order");
//     };

//     useEffect(() => {
//         if (!shippingAddress.address) {
//             navigate("/shipping");
//         }
//     }, [navigate, shippingAddress]);

//     return (
//         <div className="container mx-auto mt-5 my-10">
//             <div className="mt-[2rem] flex justify-around items-center flex-wrap">
//                 <form onSubmit={submitHandler} className="w-[40rem]">
//                     <h1 className="text-2xl font-semibold mb-4">Shipping</h1>
//                     <div className="mb-4">
//                         <label className="block text-white mb-2">Address</label>
//                         <input
//                             type="text"
//                             className="w-full p-2 border rounded-sm"
//                             placeholder="Enter address"
//                             value={address}
//                             required
//                             onChange={(e) => setAddress(e.target.value)}
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-white mb-2">City</label>
//                         <input
//                             type="text"
//                             className="w-full p-2 border rounded-sm"
//                             placeholder="Enter city"
//                             value={city}
//                             required
//                             onChange={(e) => setCity(e.target.value)}
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-white mb-2">Postal Code</label>
//                         <input
//                             type="text"
//                             className="w-full p-2 border rounded-sm"
//                             placeholder="Enter postal code"
//                             value={postalCode}
//                             required
//                             onChange={(e) => setPostalCode(e.target.value)}
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <label className="block text-white mb-2">Country</label>
//                         <input
//                             type="text"
//                             className="w-full p-2 border rounded-sm"
//                             placeholder="Enter country"
//                             value={country}
//                             required
//                             onChange={(e) => setCountry(e.target.value)}
//                         />
//                     </div>

//                     <button
//                         className="bg-pink-500 text-white py-2 px-4 rounded-full text-lg w-full"
//                         type="submit"
//                     >
//                         Continue
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Shipping;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../../redux/features/Cart/cartSlice";
import { Link } from "react-router-dom";

const Shipping = () => {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const [address, setAddress] = useState(shippingAddress.address || "");
    const [city, setCity] = useState(shippingAddress.city || "");
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || "");
    const [country, setCountry] = useState(shippingAddress.country || "");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        console.log(address, city, postalCode, country);
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        navigate("/place-order");
    };

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate("/shipping");
        }
    }, [navigate, shippingAddress]);

    return (
        <div
            className=" bg-[url('../../../../uploads/kiki.jpg')] 
            bg-contain bg-no-repeat bg-right h-screen w-full"
        >
            <div className="font-serif text-2xl container mt-5 my-10">
                <div>
                    <h1><Link to="/cart" className="text-orange-700  underline  underline-offset-4 ml-32"><strong> {"<<"} Go Back</strong></Link></h1>
                </div>
                <div className="mt-2 flex justify-around items-center flex-wrap">

                    <form onSubmit={submitHandler} className="w-[40rem] mr-64">
                        <h1 className="text-5xl font-extrabold text-center mb-4 text-orange-700 drop-shadow-lg">
                            Shipping
                        </h1>
                        <div className="mb-4">
                            <label className="block text-black mb-2">Address</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-sm"
                                placeholder="Enter address"
                                value={address}
                                required
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-black mb-2">City</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-sm"
                                placeholder="Enter city"
                                value={city}
                                required
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-black mb-2">Postal Code</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-sm"
                                placeholder="Enter postal code"
                                value={postalCode}
                                required
                                onChange={(e) => setPostalCode(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-black mb-2">Country</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-sm"
                                placeholder="Enter country"
                                value={country}
                                required
                                onChange={(e) => setCountry(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-center items-center">  {/* or any other height */}
                            <button
                                className="bg-orange-600  hover:bg-red-600 text-white  mt-3 py-2 px-4 text-xl w-75
                            "
                                type="submit"
                            >
                                Continue {">>"}
                            </button>
                        </div>
                    </form>
                </div>
            </div></div>
    );
};

export default Shipping;
