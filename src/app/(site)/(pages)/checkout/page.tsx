import React from "react";
import Checkout from "@/components/Checkout";
import { getSiteSettings } from "@/lib/sanity.queries";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | NextCommerce",
  description: "Complete your order",
};

const CheckoutPage = async () => {
  const siteSettings = await getSiteSettings();

  return (
    <main>
      <Checkout siteContactPhone={siteSettings?.contactPhone} />
    </main>
  );
};

export default CheckoutPage;
