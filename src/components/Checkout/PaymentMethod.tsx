"use client";

import React from "react";

interface PaymentMethodProps {
  orderViaWhatsAppHref: string | null;
}

const PaymentMethod = ({ orderViaWhatsAppHref }: PaymentMethodProps) => {
  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Payment — Bank transfer</h3>
      </div>

      <div className="p-4 sm:p-8.5 space-y-5">
        <p className="text-dark text-custom-sm">
          Pay via bank transfer. After placing your order you will see bank
          details and can upload your receipt or send it via WhatsApp.
        </p>

        {orderViaWhatsAppHref && (
          <p className="text-dark text-custom-sm">
            You can also{" "}
            <a
              href={orderViaWhatsAppHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green font-medium hover:underline"
            >
              order via WhatsApp
            </a>{" "}
            and send your receipt there, then click Place order below.
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;
