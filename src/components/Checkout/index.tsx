"use client";

import React, { useState, useMemo } from "react";
import Breadcrumb from "../Common/Breadcrumb";
import Login from "./Login";
import PaymentMethod from "./PaymentMethod";
import Billing from "./Billing";
import ShippingMethod, {
  type DeliveryOption,
  DELIVERY_FEES,
  INTERSTATE_ZONES,
} from "./ShippingMethod";
import { useAppSelector } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { removeAllItemsFromCart, selectTotalPrice } from "@/redux/features/cart-slice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { formatPrice } from "@/lib/formatPrice";
import { useBrand } from "@/app/context/BrandContext";

const DEFAULT_INTERSTATE_ZONE = INTERSTATE_ZONES[0]?.value ?? "northwest";

interface CheckoutProps {
  /** HEIM brand contact phone for Order via WhatsApp. */
  contactPhoneHeim?: string | null;
  /** Kinder brand contact phone for Order via WhatsApp. Mixed cart or Kinder-only uses this. */
  contactPhoneKinder?: string | null;
}

const Checkout = ({ contactPhoneHeim, contactPhoneKinder }: CheckoutProps) => {
  const [shippingMethod, setShippingMethod] = useState<DeliveryOption>("store_pickup");
  const [interstateZone, setInterstateZone] = useState(DEFAULT_INTERSTATE_ZONE);
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const subtotal = useSelector(selectTotalPrice);
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const { brand } = useBrand();

  // Promotion: Product of the month + 2 other items = free delivery within Abuja
  const hasProductOfMonth = cartItems.some((item) => item.productOfMonth);
  const hasProductOfMonthPlusTwoOthers = hasProductOfMonth && cartItems.length >= 3;
  const freeAbujaDelivery =
    shippingMethod === "abuja" && hasProductOfMonthPlusTwoOthers;

  const shippingCost =
    shippingMethod === "store_pickup"
      ? 0
      : freeAbujaDelivery
        ? 0
        : shippingMethod === "abuja"
          ? DELIVERY_FEES.abuja
          : INTERSTATE_ZONES.find((z) => z.value === interstateZone)?.fee ?? DELIVERY_FEES.interstate;

  const total = subtotal + shippingCost;

  const orderMessage = useMemo(() => {
    const lines = cartItems.map(
      (item) =>
        `${item.title} x${item.quantity} — ₦${formatPrice((item.discountedPrice ?? item.price) * item.quantity)}`
    );
    return `Hello! I'd like to order:\n${lines.join("\n")}\n\nTotal: ₦${formatPrice(total)}`;
  }, [cartItems, total]);

  // Brand-aware Order via WhatsApp: HEIM-only → HEIM contact; mixed or Kinder-only → Kinder contact
  const orderViaWhatsAppPhone = useMemo(() => {
    const hasHeim = cartItems.some((item) => item.brandSlug === "heim");
    const hasKinder = cartItems.some((item) => item.brandSlug === "kinder");
    if (hasHeim && !hasKinder && contactPhoneHeim) return contactPhoneHeim;
    return contactPhoneKinder ?? contactPhoneHeim ?? null;
  }, [cartItems, contactPhoneHeim, contactPhoneKinder]);

  const phoneDigits = orderViaWhatsAppPhone?.replace(/\D/g, "") ?? "";
  const orderViaWhatsAppHref =
    phoneDigits && orderMessage
      ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(orderMessage)}`
      : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setOrderError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const fullName = (data.fullName as string)?.trim() || "";
    const deliveryAddress = (data.deliveryAddress as string)?.trim() || "";

    const orderData = {
      items: cartItems,
      ...(brand && { brandSlug: brand }),
      email: (data.email as string) || session?.user?.email,
      name: fullName,
      phone: data.phone,
      shippingAddress: {
        fullName,
        address1: deliveryAddress,
        address2: "",
        city: "",
        country: "Nigeria",
        postalCode: "",
      },
      billingAddress: {
        fullName,
        address1: deliveryAddress,
        address2: "",
        city: "",
        country: "Nigeria",
      },
      shippingMethod,
      ...(shippingMethod === "interstate" && { interstateZone }),
      subtotal,
      shippingCost,
      tax: 0,
      total,
      notes: data.notes,
    };

    try {
      const response = await fetch("/api/order/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        const message = result.error || "Failed to create order";
        setOrderError(message);
        toast.error(message);
        setLoading(false);
        return;
      }

      dispatch(removeAllItemsFromCart());
      toast.success("Order placed successfully!");
      router.push(
        `/order-confirmation?orderId=${result.orderId}${result.orderNumber ? `&orderNumber=${encodeURIComponent(result.orderNumber)}` : ""}&total=${encodeURIComponent(String(total))}`
      );
    } catch (error) {
      console.error(error);
      const message = "An error occurred. Please try again.";
      setOrderError(message);
      toast.error(message);
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
              type="button"
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
              <div className="lg:max-w-[670px] w-full">
                {!session && <Login />}

                <Billing />

                <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5 mt-7.5">
                  <div>
                    <label htmlFor="notes" className="block mb-2.5">
                      Delivery notes (optional)
                    </label>
                    <textarea
                      name="notes"
                      id="notes"
                      rows={3}
                      placeholder="Notes about your order, e.g. special instructions for delivery."
                      className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full p-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>
                </div>
              </div>

              <div className="max-w-[455px] w-full">
                <div className="bg-white shadow-1 rounded-[10px]">
                  <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
                    <h3 className="font-medium text-xl text-dark">Your order</h3>
                  </div>

                  <div className="px-4 sm:px-8.5 pt-4">
                    <div
                      className={`rounded-lg p-4 mb-5 border ${
                        freeAbujaDelivery
                          ? "bg-green-light-6 border-green-light-4"
                          : "bg-blue-light-5 border-blue-light-3"
                      }`}
                    >
                      {freeAbujaDelivery ? (
                        <p className="text-custom-sm font-medium text-dark">
                          You&apos;ve unlocked free Abuja delivery (Product of the Month + 2 items).
                        </p>
                      ) : (
                        <>
                          <p className="text-custom-sm font-medium text-dark mb-2">
                            Add a Product of the Month and 2 other items to get free delivery within Abuja.
                          </p>
                          <Link
                            href={brand ? `/${brand}/shop` : "/shop"}
                            className="text-custom-sm font-semibold text-blue hover:text-blue-dark hover:underline"
                          >
                            Continue shopping →
                          </Link>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <h4 className="font-medium text-dark">Product</h4>
                      <h4 className="font-medium text-dark text-right">Subtotal</h4>
                    </div>

                    {cartItems.map((item, key) => (
                      <div
                        key={key}
                        className="flex items-center justify-between py-5 border-b border-gray-3"
                      >
                        <p className="text-dark">
                          {item.title} x {item.quantity}
                        </p>
                        <p className="text-dark text-right">
                          ₦{formatPrice((item.discountedPrice ?? item.price) * item.quantity)}
                        </p>
                      </div>
                    ))}

                    <div className="flex items-center justify-between py-5 border-b border-gray-3">
                      <div>
                        <p className="text-dark">Delivery</p>
                        {freeAbujaDelivery && (
                          <p className="text-custom-sm text-green font-medium mt-0.5">
                            Free Abuja delivery (Product of the Month + 2 items)
                          </p>
                        )}
                      </div>
                      <p className="text-dark text-right">
                        ₦{formatPrice(shippingCost)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-5">
                      <p className="font-medium text-lg text-dark">Total</p>
                      <p className="font-medium text-lg text-dark text-right">
                        ₦{formatPrice(total)}
                      </p>
                    </div>
                  </div>
                </div>

                <ShippingMethod
                  selected={shippingMethod}
                  interstateZone={interstateZone}
                  onChange={setShippingMethod}
                  onInterstateZoneChange={setInterstateZone}
                />

                <PaymentMethod orderViaWhatsAppHref={orderViaWhatsAppHref} />

                {orderError && (
                  <div
                    role="alert"
                    className="mt-7.5 flex items-start gap-3 rounded-lg border border-red-light-4 bg-red-light-6 px-4 py-3 text-red text-custom-sm"
                  >
                    <svg
                      className="mt-0.5 flex-shrink-0"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        fill="currentColor"
                      />
                    </svg>
                    <p className="flex-1">{orderError}</p>
                    <button
                      type="button"
                      onClick={() => setOrderError(null)}
                      className="flex-shrink-0 rounded p-1 hover:bg-red-light-4 focus:outline-none focus:ring-2 focus:ring-red"
                      aria-label="Dismiss error"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                        <path d="M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" />
                      </svg>
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center font-medium text-white bg-blue py-3 px-6 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5 disabled:opacity-50"
                >
                  {loading ? "Processing…" : "Place order"}
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
