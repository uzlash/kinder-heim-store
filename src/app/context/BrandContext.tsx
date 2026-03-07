"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Brand = "heim" | "kinder" | null;

interface BrandContextType {
  brand: Brand;
  isHeim: boolean;
  isKinder: boolean;
}

const BrandContext = createContext<BrandContextType>({
  brand: null,
  isHeim: false,
  isKinder: false,
});

export const useBrand = () => useContext(BrandContext);

export const BrandProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [brand, setBrand] = useState<Brand>(null);

  useEffect(() => {
    if (!pathname) return;

    // 1) If URL has an explicit brand segment, use it and persist it
    if (pathname.startsWith("/heim")) {
      setBrand("heim");
      if (typeof window !== "undefined") {
        window.localStorage.setItem("activeBrand", "heim");
      }
      return;
    }

    if (pathname.startsWith("/kinder")) {
      setBrand("kinder");
      if (typeof window !== "undefined") {
        window.localStorage.setItem("activeBrand", "kinder");
      }
      return;
    }

    // 2) For non-branded routes (e.g. /my-account, /signin), fall back to last active brand
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("activeBrand") as Brand | null;
      if (stored === "heim" || stored === "kinder") {
        setBrand(stored);
      } else {
        setBrand(null);
      }
    } else {
      setBrand(null);
    }
  }, [pathname]);

  const isHeim = brand === "heim";
  const isKinder = brand === "kinder";

  return (
    <BrandContext.Provider value={{ brand, isHeim, isKinder }}>
      {children}
    </BrandContext.Provider>
  );
};
