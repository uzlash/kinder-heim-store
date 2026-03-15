"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

import { ModalProvider } from "../context/QuickViewModalContext";
import { AddToCartModalProvider } from "../context/AddToCartModalContext";
import { CartModalProvider } from "../context/CartSidebarModalContext";
import { ReduxProvider } from "@/redux/provider";
import QuickViewModal from "@/components/Common/QuickViewModal";
import AddToCartModal from "@/components/Common/AddToCartModal";
import CartSidebarModal from "@/components/Common/CartSidebarModal";
import { PreviewSliderProvider } from "../context/PreviewSliderContext";
import PreviewSliderModal from "@/components/Common/PreviewSlider";

import ScrollToTop from "@/components/Common/ScrollToTop";
import PreLoader from "@/components/Common/PreLoader";
import SessionProvider from "@/components/Providers/SessionProvider";
import { BrandProvider } from "../context/BrandContext";
import { SiteSettingsProvider } from "../context/SiteSettingsContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body>
        {loading ? (
          <PreLoader />
        ) : (
          <>
            <SessionProvider>
              <BrandProvider>
                <SiteSettingsProvider>
                <ReduxProvider>
                  <CartModalProvider>
                    <ModalProvider>
                      <AddToCartModalProvider>
                        <PreviewSliderProvider>
                          {!isLandingPage && <Header />}
                          {children}

                          <QuickViewModal />
                          <AddToCartModal />
                          <CartSidebarModal />
                          <PreviewSliderModal />
                          {!isLandingPage && <Footer />}
                        </PreviewSliderProvider>
                      </AddToCartModalProvider>
                    </ModalProvider>
                  </CartModalProvider>
                </ReduxProvider>
                </SiteSettingsProvider>
              </BrandProvider>
            </SessionProvider>
            <ScrollToTop />
          </>
        )}
      </body>
    </html>
  );
}
