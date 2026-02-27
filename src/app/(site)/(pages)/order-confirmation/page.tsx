import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmation | NextCommerce",
  description: "Order Confirmation Page",
};

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const OrderConfirmationPage = ({ searchParams }: Props) => {
  const orderId = typeof searchParams.orderId === 'string' ? searchParams.orderId : undefined;

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
            Thank you for your order!
          </h1>
          
          <p className="text-dark-4 mb-8">
            Your order has been placed successfully. 
            {orderId && <span className="block mt-2 font-medium">Order ID: {orderId}</span>}
          </p>

          <div className="bg-gray-1 rounded-md p-6 mb-8 max-w-lg mx-auto text-left">
            <h3 className="font-medium text-lg text-dark mb-4">Payment Instructions</h3>
            <p className="text-dark-4 mb-2">
              Please transfer the total amount to the following bank account:
            </p>
            <ul className="text-dark-4 space-y-1">
              <li><strong>Bank Name:</strong> Example Bank</li>
              <li><strong>Account Name:</strong> NextCommerce Store</li>
              <li><strong>Account Number:</strong> 1234567890</li>
              <li><strong>Reference:</strong> {orderId || "Your Order ID"}</li>
            </ul>
            <p className="text-sm text-gray-500 mt-4">
              Your order will be processed once we receive the payment.
            </p>
          </div>

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
