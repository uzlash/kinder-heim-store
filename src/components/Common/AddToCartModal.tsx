"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAddToCartModal } from "@/app/context/AddToCartModalContext";
import { addItemToCart } from "@/redux/features/cart-slice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { formatPrice } from "@/lib/formatPrice";

const AddToCartModal = () => {
  const { isOpen, product, close } = useAddToCartModal();
  const dispatch = useDispatch<AppDispatch>();
  const [activeColorKey, setActiveColorKey] = useState(0);
  const [activeSize, setActiveSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Only use variants with a resolved color (guard against null refs)
  const variantsWithColor = product?.colorVariants?.filter((v) => v?.color) ?? [];
  const colorOptions = variantsWithColor.map((v) => v.color);
  const availableSizes = variantsWithColor[activeColorKey]?.sizes ?? [];
  const selectedColorName = colorOptions[activeColorKey]?.name ?? undefined;

  useEffect(() => {
    if (isOpen) {
      setActiveColorKey(0);
      setActiveSize("");
      setQuantity(1);
    }
  }, [isOpen, product?.id]);

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        ...product,
        quantity,
        color: selectedColorName,
        size: activeSize || undefined,
      })
    );
    close();
  };

  const hasOptions = colorOptions.length > 0;
  const needsSize = availableSizes.length > 0;
  const canAdd = !needsSize || activeSize.length > 0;

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-dark/60"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start gap-4 mb-5">
            <div className="flex gap-4 flex-1 min-w-0">
              {product.imgs?.previews?.[0] && (
                <div className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-1">
                  <Image
                    src={product.imgs.previews[0]}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-dark truncate">{product.title}</h3>
                <p className="text-lg font-medium text-dark mt-1">
                  ₦{formatPrice(product.discountedPrice)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-dark-4 hover:bg-gray-2 hover:text-dark"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <p className="text-custom-sm font-medium text-dark-4 mb-3">
            Choose color and size before adding to cart
          </p>

          {hasOptions ? (
            <>
              {colorOptions.length > 0 && (
                <div className="mb-4">
                  <label className="block text-custom-sm font-medium text-dark mb-2">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((color, key) => (
                      <label
                        key={key}
                        className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 transition-colors ${
                          activeColorKey === key ? "border-blue bg-blue/5" : "border-gray-3 hover:border-gray-4"
                        }`}
                      >
                        <input
                          type="radio"
                          name="modal-color"
                          className="sr-only"
                          checked={activeColorKey === key}
                          onChange={() => {
                            setActiveColorKey(key);
                            setActiveSize("");
                          }}
                        />
                        <span
                          className="w-4 h-4 rounded-full border border-gray-3 flex-shrink-0"
                          style={{ backgroundColor: color?.value ?? "#eee" }}
                        />
                        <span className="text-custom-sm text-dark">{color?.name ?? "—"}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {availableSizes.length > 0 && (
                <div className="mb-4">
                  <label className="block text-custom-sm font-medium text-dark mb-2">Size</label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <label
                        key={size}
                        className={`cursor-pointer px-3 py-1.5 rounded-md border-2 text-custom-sm font-medium transition-colors ${
                          activeSize === size ? "border-blue bg-blue text-white" : "border-gray-3 hover:border-gray-4 text-dark"
                        }`}
                      >
                        <input
                          type="radio"
                          name="modal-size"
                          className="sr-only"
                          checked={activeSize === size}
                          onChange={() => setActiveSize(size)}
                        />
                        {size}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-custom-sm text-dark-4 mb-4">No color or size options for this product.</p>
          )}

          <div className="mb-5">
            <label className="block text-custom-sm font-medium text-dark mb-2">Quantity</label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="w-9 h-9 rounded-md border border-gray-3 flex items-center justify-center text-dark hover:bg-gray-2"
              >
                −
              </button>
              <span className="w-12 text-center font-medium text-dark">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="w-9 h-9 rounded-md border border-gray-3 flex items-center justify-center text-dark hover:bg-gray-2"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!canAdd}
            className="w-full py-3 px-4 rounded-md font-medium text-white bg-blue hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {!canAdd && needsSize ? "Choose a size" : "Add to cart"}
        </button>
      </div>
    </div>
  );
};

export default AddToCartModal;
