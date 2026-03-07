export type Product = {
  title: string;
  description?: string;
  reviews: number;
  price: number;
  discountedPrice: number;
  id: string | number;
  slug?: string;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
  colors?: Array<{ name: string; value: string }>;
  sizes?: string[];
  colorVariants?: Array<{ color: { name: string; value: string }; sizes: string[] }>;
  productOfMonth?: boolean;
  policy?: string;
  deliveryInfo?: string;
  /** Available quantity (from Sanity inventory). Used to cap cart quantity. */
  stock?: number;
};
