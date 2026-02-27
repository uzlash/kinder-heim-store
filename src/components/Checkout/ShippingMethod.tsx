import React, { useState } from "react";
import Image from "next/image";

interface ShippingMethodProps {
  selected: string;
  onChange: (value: string) => void;
}

const ShippingMethod = ({ selected, onChange }: ShippingMethodProps) => {
  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Shipping Method</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-4">
          <label
            htmlFor="standard"
            className="flex cursor-pointer select-none items-center gap-3.5"
          >
            <div className="relative">
              <input
                type="radio"
                name="shippingMethod"
                id="standard"
                className="sr-only"
                checked={selected === "standard"}
                onChange={() => onChange("standard")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  selected === "standard"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>
            Standard Shipping (Free)
          </label>

          <label
            htmlFor="express"
            className="flex cursor-pointer select-none items-center gap-3.5"
          >
            <div className="relative">
              <input
                type="radio"
                name="shippingMethod"
                id="express"
                className="sr-only"
                checked={selected === "express"}
                onChange={() => onChange("express")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  selected === "express"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div className="rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none">
              <div className="flex items-center">
                <div className="border-l border-gray-4 pl-4">
                  <p className="font-semibold text-dark">$15.00</p>
                  <p className="text-custom-xs">Express Shipping</p>
                </div>
              </div>
            </div>
          </label>

          <label
            htmlFor="pickup"
            className="flex cursor-pointer select-none items-center gap-3.5"
          >
            <div className="relative">
              <input
                type="radio"
                name="shippingMethod"
                id="pickup"
                className="sr-only"
                checked={selected === "pickup"}
                onChange={() => onChange("pickup")}
              />
              <div
                className={`flex h-4 w-4 items-center justify-center rounded-full ${
                  selected === "pickup"
                    ? "border-4 border-blue"
                    : "border border-gray-4"
                }`}
              ></div>
            </div>

            <div className="rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 hover:bg-gray-2 hover:border-transparent hover:shadow-none">
              <div className="flex items-center">
                <div className="border-l border-gray-4 pl-4">
                  <p className="font-semibold text-dark">Free</p>
                  <p className="text-custom-xs">Pickup in Person</p>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ShippingMethod;
