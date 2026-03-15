"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useBrand } from "./BrandContext";

type SiteSettings = {
  contactPhone: string | null;
  contactEmail: string | null;
  address: string | null;
};

const SiteSettingsContext = createContext<SiteSettings>({
  contactPhone: null,
  contactEmail: null,
  address: null,
});

export const useSiteSettings = () => useContext(SiteSettingsContext);

export const SiteSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const { brand } = useBrand();
  const [contactPhone, setContactPhone] = useState<string | null>(null);
  const [contactEmail, setContactEmail] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!brand) {
      setContactPhone(null);
      setContactEmail(null);
      setAddress(null);
      return;
    }
    fetch(`/api/site-settings?brand=${encodeURIComponent(brand)}`)
      .then((res) => res.json())
      .then((data) => {
        setContactPhone(data?.contactPhone ?? null);
        setContactEmail(data?.contactEmail ?? null);
        setAddress(data?.address ?? null);
      })
      .catch(() => {
        setContactPhone(null);
        setContactEmail(null);
        setAddress(null);
      });
  }, [brand]);

  return (
    <SiteSettingsContext.Provider value={{ contactPhone, contactEmail, address }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};
