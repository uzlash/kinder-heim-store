"use client";
import React, { useState } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Login from "./Login";
import Shipping from "./Shipping";
import ShippingMethod from "./ShippingMethod";
import PaymentMethod from "./PaymentMethod";
import Coupon from "./Coupon";
import Billing from "./Billing";
import { useAppSelector } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { removeAllItemsFromCart, selectTotalPrice } from "@/redux/features/cart-slice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { formatPrice } from "@/lib/formatPrice";

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [loading, setLoading] = useState(false);
  
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const subtotal = useSelector(selectTotalPrice);
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();

  const shippingCost = shippingMethod === "express" ? 15 : 0;
  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const orderData = {
      items: cartItems,
      email: data.email || session?.user?.email,
      name: `${data.firstName} ${data.lastName}`,
      phone: data.phone,
      shippingAddress: {
        fullName: `${data.firstName} ${data.lastName}`,
        address1: data.address,
        address2: data.addressTwo,
        city: data.town,
        country: data.country,
        postalCode: data.postalCode, // Make sure to add this field to Billing if missing
      },
      billingAddress: {
        // Assuming same as shipping for now, or you can add separate fields
        fullName: `${data.firstName} ${data.lastName}`,
        address1: data.address,
        address2: data.addressTwo,
        city: data.town,
        country: data.country,
      },
      paymentMethod,
      shippingMethod,
      subtotal,
      shippingCost,
      tax: 0, // Calculate tax if needed
      total,
      notes: data.notes,
    };

    try {
      const response = await fetch("/api/order/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Failed to create order");
        setLoading(false);
        return;
      }

      dispatch(removeAllItemsFromCart());
      toast.success("Order placed successfully!");
      router.push(`/order-confirmation?orderId=${result.orderId}`);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Breadcrumb title={"Checkout"} pages={["checkout"]} />
        <section className="overflow-hidden py-20 bg-gray-2">
          <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 text-center">
            <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
            <p className="mb-8">Add some products to your cart to proceed to checkout.</p>
            <button
              onClick={() => router.push("/shop")}
              className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
            >
              Return to Shop
            </button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Breadcrumb title={"Checkout"} pages={["checkout"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col lg:flex-row gap-7.5 xl:gap-11">
              {/* <!-- checkout left --> */}
              <div className="lg:max-w-[670px] w-full">
                {/* <!-- login box --> */}
                {!session && <Login />}

                {/* <!-- billing details --> */}
                <Billing />

                {/* <!-- address box two --> */}
                {/* <Shipping /> */}

                {/* <!-- others note box --> */}
                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5">
                      Other Notes (optional)
                    </label>

                    <textarea
                      name="notes"
                      id="notes"
                      rows={5}
                      placeholder="Notes about your order, e.g. special notes for delivery."
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* // <!-- checkout right --> */}
              <div className="max-w-[455px] w-full">
                {/* <!-- order list box --> */}
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">
                      Your Order
                    </h3>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    {/* <!-- title --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <h4 className="font-medium text-dark">Product</h4>
                      </div>
                      <div>
                        <h4 className="font-medium text-dark text-right">
                          Subtotal
                        </h4>
                      </div>
                    </div>

                    {/* <!-- product item --> */}
                    {cartItems.map((item, key) => (
                      <div key={key} className="flex items-center justify-between py-5 border-b border-gray-3">
                        <div>
                          <p className="text-dark">{item.title} x {item.quantity}</p>
                        </div>
                        <div>
                          <p className="text-dark text-right">${formatPrice(item.discountedPrice * item.quantity)}</p>
                        </div>
                      </div>
                    ))}

                    {/* <!-- product item --> */}
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <p className="text-dark">Shipping Fee</p>
                      </div>
                      <div>
                        <p className="text-dark text-right">${formatPrice(shippingCost)}</p>
                      </div>
                    </div>

                    {/* <!-- total --> */}
                    <div className="flex items-center justify-between pt-5">
                      <div>
                        <p className="font-medium text-lg text-dark">Total</p>
                      </div>
                      <div>
                        <p className="font-medium text-lg text-dark text-right">
                          ${formatPrice(total)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <!-- coupon box --> */}
                <Coupon />

                {/* <!-- shipping box --> */}
                <ShippingMethod selected={shippingMethod} onChange={setShippingMethod} />

                {/* <!-- payment box --> */}
                <PaymentMethod selected={paymentMethod} onChange={setPaymentMethod} />

                {/* <!-- checkout button --> */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Place Order"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default Checkout;
