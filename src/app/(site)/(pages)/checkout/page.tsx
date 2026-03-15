import React from "react";
import Checkout from "@/components/Checkout";
import { getSiteSettings } from "@/lib/sanity.queries";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | NextCommerce",
  description: "Complete your order",
};

const CheckoutPage = async () => {
  const [heimSettings, kinderSettings] = await Promise.all([
    getSiteSettings("heim"),
    getSiteSettings("kinder"),
  ]);

  return (
    <main>
      <Checkout
        contactPhoneHeim={heimSettings?.contactPhone ?? null}
        contactPhoneKinder={kinderSettings?.contactPhone ?? null}
      />
    </main>
  );
};

export default CheckoutPage;
