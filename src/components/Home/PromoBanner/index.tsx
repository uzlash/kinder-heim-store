import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/formatPrice";

function discountPercent(product: Product): number | null {
  if (!product.price || product.price <= 0) return null;
  const p = product.price;
  const d = product.discountedPrice ?? p;
  if (d >= p) return null;
  return Math.round((1 - d / p) * 100);
}

export interface PromoBannerProps {
  bigCard?: Product | null;
  mediumCard1?: Product | null;
  mediumCard2?: Product | null;
  brand?: string;
}

function PromoBanner({ bigCard, mediumCard1, mediumCard2, brand }: PromoBannerProps) {
  const hasAny = bigCard || mediumCard1 || mediumCard2;
  const brandPrefix = brand ? `/${brand}` : "";

  if (!hasAny) return null;

  const bigImg = bigCard?.imgs?.previews?.[0] ?? bigCard?.imgs?.thumbnails?.[0];
  const med1Img = mediumCard1?.imgs?.previews?.[0] ?? mediumCard1?.imgs?.thumbnails?.[0];
  const med2Img = mediumCard2?.imgs?.previews?.[0] ?? mediumCard2?.imgs?.thumbnails?.[0];

  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {bigCard && (
          <div className="relative z-1 overflow-hidden rounded-lg bg-[#F5F5F7] py-12.5 lg:py-17.5 xl:py-22.5 px-4 sm:px-7.5 lg:px-14 xl:px-19 mb-7.5">
            <div className="max-w-[550px] w-full">
              <span className="block font-medium text-xl text-dark mb-3">
                {bigCard.title}
              </span>
              {discountPercent(bigCard) != null && (
                <h2 className="font-bold text-xl lg:text-heading-4 xl:text-heading-3 text-dark mb-5">
                  UP TO {discountPercent(bigCard)}% OFF
                </h2>
              )}
              <p className="text-dark">
                From ₦{formatPrice(bigCard.discountedPrice)}
                {bigCard.price > bigCard.discountedPrice && (
                  <span className="line-through ml-1">₦{formatPrice(bigCard.price)}</span>
                )}
              </p>
              <Link
                href={`${brandPrefix}/shop-details/${bigCard.slug ?? "#"}`}
                className="inline-flex font-medium text-custom-sm text-white bg-blue py-[11px] px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
              >
                Buy Now
              </Link>
            </div>
            {bigImg && (
              <Image
                src={bigImg}
                alt={bigCard.title}
                className="absolute bottom-0 right-4 lg:right-26 -z-1"
                width={274}
                height={350}
              />
            )}
          </div>
        )}

        <div className="grid gap-7.5 grid-cols-1 lg:grid-cols-2">
          {mediumCard1 && (
            <div className="relative z-1 overflow-hidden rounded-lg bg-[#DBF4F3] py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10">
              {med1Img && (
                <Image
                  src={med1Img}
                  alt={mediumCard1.title}
                  className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-10 -z-1"
                  width={241}
                  height={241}
                />
              )}
              <div className="text-right">
                <span className="block text-lg text-dark mb-1.5">
                  {mediumCard1.title}
                </span>
                {discountPercent(mediumCard1) != null && (
                  <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                    Up to {discountPercent(mediumCard1)}% off
                  </h2>
                )}
                <p className="font-semibold text-custom-1 text-teal">
                  ₦{formatPrice(mediumCard1.discountedPrice)}
                </p>
                <Link
                  href={`${brandPrefix}/shop-details/${mediumCard1.slug ?? "#"}`}
                  className="inline-flex font-medium text-custom-sm text-white bg-teal py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-teal-dark mt-9"
                >
                  Grab Now
                </Link>
              </div>
            </div>
          )}

          {mediumCard2 && (
            <div className="relative z-1 overflow-hidden rounded-lg bg-[#FFECE1] py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10">
              {med2Img && (
                <Image
                  src={med2Img}
                  alt={mediumCard2.title}
                  className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-8.5 -z-1"
                  width={200}
                  height={200}
                />
              )}
              <div>
                <span className="block text-lg text-dark mb-1.5">
                  {mediumCard2.title}
                </span>
                {discountPercent(mediumCard2) != null && (
                  <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                    Up to <span className="text-orange">{discountPercent(mediumCard2)}%</span> off
                  </h2>
                )}
                <p className="max-w-[285px] text-custom-sm text-dark">
                  ₦{formatPrice(mediumCard2.discountedPrice)}
                  {mediumCard2.price > mediumCard2.discountedPrice && (
                    <span className="line-through ml-1">₦{formatPrice(mediumCard2.price)}</span>
                  )}
                </p>
                <Link
                  href={`${brandPrefix}/shop-details/${mediumCard2.slug ?? "#"}`}
                  className="inline-flex font-medium text-custom-sm text-white bg-orange py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-orange-dark mt-7.5"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default PromoBanner;
