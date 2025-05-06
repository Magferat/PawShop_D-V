// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { FaTrash } from "react-icons/fa";
// // import { addToCart, removeFromCart } from "../../redux/features/cart/cartSlice";
// import {
//     useGetCartQuery,
//     useAddToCartMutation,
//     useRemoveFromCartMutation
// } from "../../redux/features/cart/cartApiSlice";


// const Cart = () => {
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     // const { data: cart, refetch } = useGetCartQuery();
//     // // const { cartItems } = cart;
//     const { data: cart, refetch } = useGetCartQuery();
//     const [addToCart] = useAddToCartMutation();
//     const [removeFromCart] = useRemoveFromCartMutation();

//     const cartItems = cart?.cartItems || [];
//     const addToCartHandler = async (product, qty) => {
//         const clampedQty = Math.max(1, Math.min(qty, product.countInStock));
//         await addToCart({
//             product: product.product || product._id,
//             qty: clampedQty,
//             name: product.name,
//             image: product.image,
//             price: product.price,
//         });
//         refetch();
//     };
//     const removeFromCartHandler = async (productId) => {
//         await removeFromCart(productId);
//         refetch();
//     };


//     // const addToCartHandler = (product, qty) => {
//     //     const clampedQty = Math.max(1, Math.min(qty, product.countInStock));
//     //     dispatch(addToCart({ ...product, qty: clampedQty }));

//     // };

//     // const removeFromCartHandler = (id) => {
//     //     dispatch(removeFromCart(id));
//     // };

//     const checkoutHandler = () => {
//         navigate("/login?redirect=/shipping");
//     };


//     return (
//         <>
//             <div className="container flex justify-around items-start flex wrap mx-auto mt-8">
//                 {cartItems.length === 0 ? (
//                     <div>
//                         Your cart is empty <Link to="/productshop"> <strong className="text-green-800"> Go To Shop</strong></Link>
//                     </div>
//                 ) : (
//                     <>
//                         <div className="flex flex-col w-[90%]">
//                             <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>

//                             {cartItems.map((item) => (
//                                 <div key={item._id} className="flex items-enter mb-[1rem] pb-2">
//                                     <div className="w-[5rem] h-[5rem]">
//                                         <img
//                                             src={item.image}
//                                             alt={item.name}
//                                             className="w-full h-full object-cover rounded-sm"
//                                         />
//                                     </div>

//                                     <div className="flex-1 ml-4">
//                                         <Link to={`/product/${item._id}`} className="text-pink-500">
//                                             {item.name}
//                                         </Link>

//                                         <div className="mt-2 text-green">{item.brand}</div>
//                                         <div className="mt-2 text-green-800 font-bold">
//                                             {item.price} BDT
//                                         </div>

//                                     </div>


//                                     <div className="w-50">
//                                         <button
//                                             className="border px-3 py-1 text-xl font-bold bg-green-200 hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                                             onClick={() => addToCartHandler(item, item.qty - 1)}
//                                             disabled={item.qty <= 1}
//                                         >
//                                             −
//                                         </button>
//                                         <span className="text-xl text-green-900 font-semibold w-10 px-3 text-center">
//                                             {item.qty}
//                                         </span>
//                                         <button
//                                             className="border px-3 py-1 text-xl font-bold bg-green-200 hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                                             onClick={() => addToCartHandler(item, item.qty + 1)}
//                                             disabled={item.qty >= item.countInStock}
//                                         >
//                                             +
//                                         </button>



//                                     </div>

//                                     <div>
//                                         <button
//                                             className="text-red-500 mr-[5rem]"
//                                             onClick={() => removeFromCartHandler(item._id)}
//                                         >
//                                             <FaTrash className="ml-[1rem] mt-[.5rem]" />
//                                         </button>
//                                     </div>
//                                 </div>
//                             ))}

//                             <div className="mt-8 w-[40rem]">
//                                 <div className="p-4 rounded-lg">
//                                     <h2 className="text-xl font-semibold mb-2">
//                                         Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
//                                     </h2>

//                                     <div className="text-2xl font-bold">
//                                         {" "}
//                                         {cartItems
//                                             .reduce((acc, item) => acc + item.qty * item.price, 0)
//                                             .toFixed(2)} BDT
//                                     </div>

//                                     <button
//                                         className="bg-pink-500 mt-4 py-2 px-4 rounded-full text-lg w-full"
//                                         disabled={cartItems.length === 0}
//                                         onClick={checkoutHandler}
//                                     >
//                                         Proceed To Checkout
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </>
//     );
// };

// export default Cart;

// import { Link, useNavigate } from "react-router-dom";
// import { FaTrash } from "react-icons/fa";
// import {
//     useGetCartQuery,
//     useAddToCartMutation,
//     useRemoveFromCartMutation,
// } from "../../redux/features/cart/cartApiSlice";

// const Cart = () => {
//     const navigate = useNavigate();

//     const { data: cart, refetch } = useGetCartQuery();
//     const [addToCart] = useAddToCartMutation();
//     const [removeFromCart] = useRemoveFromCartMutation();

//     const cartItems = cart?.cartItems || [];
//     // console.log(cartItems);
//     const addToCartHandler = async (product, qty) => {
//         const clampedQty = Math.max(1, Math.min(qty, product.countInStock));
//         await addToCart({
//             product: product.product || product._id, // supports both formats
//             qty: clampedQty,
//             name: product.name,
//             image: product.image,
//             price: product.price,
//         });
//         refetch();
//     };

//     const removeFromCartHandler = async (productId) => {
//         // console.log(productId)
//         await removeFromCart(productId);

//         refetch();
//     };

//     const checkoutHandler = () => {
//         navigate("/login?redirect=/shipping");
//     };

//     return (
//         <div className="container flex justify-around items-start flex wrap mx-auto mt-8">
//             {cartItems.length === 0 ? (
//                 <div>
//                     Your cart is empty{" "}
//                     <Link to="/productshop">
//                         <strong className="text-green-800"> Go To Shop</strong>
//                     </Link>
//                 </div>
//             ) : (
//                 <div className="flex flex-col w-[90%]">
//                     <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>

//                     {cartItems.map((item) => (
//                         <div key={item.product || item._id} className="flex items-enter mb-[1rem] pb-2">
//                             <div className="w-[5rem] h-[5rem]">
//                                 <img
//                                     src={item.image}
//                                     alt={item.name}
//                                     className="w-full h-full object-cover rounded-sm"
//                                 />
//                             </div>

//                             <div className="flex-1 ml-4">
//                                 <Link to={`/product/${item.product || item._id}`} className="text-pink-500">
//                                     {item.name}
//                                 </Link>
//                                 <div className="mt-2 text-green">{item.brand}</div>
//                                 <div className="mt-2 text-green-800 font-bold">
//                                     {item.price} BDT
//                                 </div>
//                             </div>

//                             <div className="w-50">
//                                 <button
//                                     className="border px-3 py-1 text-xl font-bold bg-green-200 hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                                     onClick={() => addToCartHandler(item, item.qty - 1)}
//                                     disabled={item.qty <= 1}
//                                 >
//                                     −
//                                 </button>
//                                 <span className="text-xl text-green-900 font-semibold w-10 px-3 text-center">
//                                     {item.qty}
//                                 </span>
//                                 <button
//                                     className="border px-3 py-1 text-xl font-bold bg-green-200 hover:bg-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
//                                     onClick={() => addToCartHandler(item, item.qty + 1)}
//                                     disabled={item.qty >= item.countInStock}
//                                 >
//                                     +
//                                 </button>
//                             </div>

//                             <div>
//                                 <button
//                                     className="text-red-500 mr-[5rem]"
//                                     onClick={() => removeFromCartHandler(item._id)}
//                                 >
//                                     {/* {console.log(item.product)} */}
//                                     <FaTrash className="ml-[1rem] mt-[.5rem]" />
//                                 </button>
//                             </div>
//                         </div>
//                     ))}

//                     <div className="mt-8 w-[40rem]">
//                         <div className="p-4 rounded-lg">
//                             <h2 className="text-xl font-semibold mb-2">
//                                 Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
//                             </h2>

//                             <div className="text-2xl font-bold">
//                                 {cartItems
//                                     .reduce((acc, item) => acc + item.qty * item.price, 0)
//                                     .toFixed(2)}{" "}
//                                 BDT
//                             </div>

//                             <button
//                                 className="bg-pink-500 mt-4 py-2 px-4 rounded-full text-lg w-full"
//                                 disabled={cartItems.length === 0}
//                                 onClick={checkoutHandler}
//                             >
//                                 Proceed To Checkout
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Cart;
import { Link, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import {
    useGetCartQuery,
    useAddToCartMutation,
    useRemoveFromCartMutation,
    useUpdateQtyMutation,
} from "../../redux/features/cart/cartApiSlice";
const Cart = () => {
    const navigate = useNavigate();

    const { data: cart, refetch } = useGetCartQuery();
    const [addToCart] = useAddToCartMutation();
    const [updateQty] = useUpdateQtyMutation();
    const [removeFromCart] = useRemoveFromCartMutation();

    const cartItems = cart?.cartItems || [];
    console.log(cartItems)
    // const addToCartHandler = async (product, qty) => {
    //     const clampedQty = Math.max(1, Math.min(qty, product.countInStock));
    //     await addToCart({
    //         productId: product._id,
    //         qty: clampedQty
    //     });
    //     refetch();
    // };
    const updateQuantityHandler = async (product, newQty) => {
        if (newQty < 1 || newQty > product.countInStock) return;

        await updateQty({
            productId: product._id,
            qty: newQty
        });

        refetch();
    };


    const removeFromCartHandler = async (productId) => {
        await removeFromCart(productId);
        refetch();
    };

    const checkoutHandler = () => {
        navigate("/login?redirect=/shipping");
    };


    return (

        <>
            {cartItems.length === 0 ? (
                <div
                    className="bg-[url('https://res.cloudinary.com/dtzk3edsz/image/upload/v1746558111/my-neighbor-totoro-uhd-4k-wallpaper_li5j1m.jpg')] bg-cover bg-center bg-no-repeat h-screen w-full
                    "
                >
                    <div className="text-3xl pt-32 ml-80 pl-64">
                        Your cart is empty{" "}
                        <br />
                        <br />
                        {/* <br /> */}
                        <Link to="/productshop">
                            <strong className="text-5xl font-extrabold text-center text-orange-700 drop-shadow-lg">{"   "}Go To Shop {" >>> "}</strong>
                        </Link>
                    </div>
                </div>
            ) : (
                <div
                    className=" bg-[url('../../../../uploads/jiji-cat-qvepdqdxnijrn5rq.jpg')] 
            bg-contain bg-no-repeat bg-right h-screen w-full"
                >
                    <div className="font-serif container flex justify-around text-xl items-start flex-wrap">
                        <div className="flex flex-col w-[80%]">
                            <h1 className="text-5xl font-extrabold text-center my-4 text-orange-700 drop-shadow-lg">Shopping Cart</h1>

                            {cartItems.map((item) => (
                                <div key={item.product._id || item._id} className="flex items-center mb-4 pb-2">
                                    {/* <div key={item.product || item._id} className="flex items-center mb-4 pb-2"> */}
                                    {/* {console.log("here", item.product)} */}
                                    <div className="w-[5rem] h-[5rem]">
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover rounded-sm"
                                        />
                                    </div>

                                    <div className="flex-1 ml-4">
                                        <Link to={`/product/${item.product._id}`} className="text-[#6b1f2d] font-bold">
                                            {item.product.name}
                                        </Link>
                                        <div className="mt-2 text-[#9c1a33]">{item.product.brand}</div>
                                        <div className="mt-2 text-[#4e4842] ">{item.product.price} BDT</div>
                                    </div>

                                    <div className="w-50 flex items-center">
                                        <button
                                            className="border px-3 py-1 text-[#6b1f2d] font-bold text-xl bg-sky-200 hover:bg-sky-300 disabled:opacity-50 
                                    disabled:bg-green-100
                                    disabled:cursor-not-allowed"
                                            onClick={() => updateQuantityHandler(item.product, item.qty - 1)}
                                            disabled={item.qty <= 1}
                                        >
                                            −
                                        </button>
                                        <span className="text-[#6b1f2d] font-bold text-3xl px-3">{item.qty}</span>
                                        <button
                                            className="border px-3 py-1 text-[#6b1f2d] font-bold text-xl bg-sky-200 hover:bg-sky-300 disabled:opacity-50 
                                    disabled:bg-green-100
                                    disabled:cursor-not-allowed"
                                            onClick={() => updateQuantityHandler(item.product, item.qty + 1)}
                                            disabled={item.qty >= item.product.countInStock}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div>
                                        <button
                                            className="text-red-500 mr-[5rem]"
                                            onClick={() => removeFromCartHandler(item.product._id)}
                                        >
                                            <FaTrash className="ml-[1rem] mt-[.5rem]" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className="mt-8 w-[40rem]">
                                <div className="p-4 rounded-lg">
                                    <h2 className="text-xl text-[#6b1f2d] font-bold mb-2">
                                        Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})


                                    </h2>
                                    <div className="text-2xl text-[#6b1f2d] font-bold">
                                        ({cartItems.reduce((acc, item) => acc + item.qty * (item.product?.price || 0), 0).toFixed(2)
                                        }){" "}
                                        BDT
                                    </div>
                                    <button
                                        className="bg-orange-600 hover:bg-rose-600 mt-4 py-2 px-4 rounded text-lg text-white font-bold w-80 
                                        mx-auto block transition-colors duration-300"
                                        disabled={cartItems.length === 0}
                                        onClick={checkoutHandler}
                                    >
                                        Proceed To Checkout {">>"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )} </>
        // </div >
    );
};

export default Cart;
