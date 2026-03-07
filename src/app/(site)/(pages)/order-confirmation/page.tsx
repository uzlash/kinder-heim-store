import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { getSiteSettings } from "@/lib/sanity.queries";
import ReceiptSection from "@/components/OrderConfirmation/ReceiptSection";
import { formatPrice } from "@/lib/formatPrice";

export const metadata: Metadata = {
  title: "Order Confirmation | NextCommerce",
  description: "Order Confirmation Page",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const OrderConfirmationPage = async ({ searchParams }: Props) => {
  const [params, siteSettings] = await Promise.all([
    searchParams,
    getSiteSettings(),
  ]);
  const orderId = typeof params.orderId === "string" ? params.orderId : undefined;
  const orderNumber = typeof params.orderNumber === "string" ? decodeURIComponent(params.orderNumber) : undefined;
  const totalParam = typeof params.total === "string" ? params.total : undefined;
  const total = totalParam != null && !Number.isNaN(Number(totalParam)) ? Number(totalParam) : undefined;
  const reference = orderNumber || orderId || "Your Order ID";

  return (
    <section className="overflow-hidden py-20 bg-gray-2">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="bg-white shadow-1 rounded-[10px] p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-dark mb-4">
            Order successful
          </h1>
          
          <p className="text-dark-4 mb-8">
            Thank you for your order. It has been placed successfully.
            {(orderNumber || orderId) && (
              <span className="block mt-2 font-medium">
                {orderNumber ? `Order number: ${orderNumber}` : `Order ID: ${orderId}`}
              </span>
            )}
          </p>

          <div className="bg-gray-1 rounded-md p-6 mb-8 max-w-lg mx-auto text-left">
            <h3 className="font-medium text-lg text-dark mb-4">Payment instructions</h3>
            {total != null && (
              <p className="text-dark font-medium mb-2">
                Total amount to pay: ₦{formatPrice(total)}
              </p>
            )}
            <p className="text-dark-4 mb-2">
              Please transfer the total amount to the following bank account and use your order as reference:
            </p>
            <ul className="text-dark-4 space-y-1">
              <li><strong>Account name:</strong> Kinder/HEIM Footwear and Kitchenware</li>
              <li><strong>Bank:</strong> Access Bank</li>
              <li><strong>Account number:</strong> 2211750643</li>
              <li><strong>Reference:</strong> {reference}</li>
            </ul>
            <p className="text-custom-sm text-dark-4 mt-4">
              Your order will be processed once payment is received. Submit your receipt below or via WhatsApp.
            </p>
          </div>

          {orderId && (
            <ReceiptSection
              orderId={orderId}
              orderNumber={orderNumber}
              siteContactPhone={siteSettings?.contactPhone}
            />
          )}

          <div className="flex justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex font-medium text-white bg-blue py-3 px-7 rounded-md ease-out duration-200 hover:bg-blue-dark"
            >
              Continue Shopping
            </Link>
            
            <Link
              href="/my-account"
              className="inline-flex font-medium text-dark border border-gray-3 py-3 px-7 rounded-md ease-out duration-200 hover:bg-gray-1"
            >
              View Order History
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderConfirmationPage;
