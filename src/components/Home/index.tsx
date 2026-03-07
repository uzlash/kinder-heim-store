import React from "react";
import Hero from "./Hero";
import Categories from "./Categories";
import NewArrival from "./NewArrivals";
import PromoBanner from "./PromoBanner";
import type { PromoBannerProps } from "./PromoBanner";
import CounDown from "./Countdown";
import type { CounDownProps } from "./Countdown";
import BestSeller from "./BestSeller";
import Testimonials from "./Testimonials";
import Newsletter from "../Common/Newsletter";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { Testimonial } from "@/types/testimonial";

interface HomeProps {
  newArrivals: Product[];
  bestSellers: Product[];
  featured: Product[];
  categories: Category[];
  testimonials: Testimonial[];
  heroCarousel?: Product[];
  heroSmallCard1?: Product | null;
  heroSmallCard2?: Product | null;
  promoBig?: Product | null;
  promoMedium1?: Product | null;
  promoMedium2?: Product | null;
  countdownProduct?: Product | null;
  countdownDeadline?: string | null;
  brand?: string;
}

const Home = ({ newArrivals, bestSellers, featured, categories, testimonials, heroCarousel = [], heroSmallCard1 = null, heroSmallCard2 = null, promoBig = null, promoMedium1 = null, promoMedium2 = null, countdownProduct = null, countdownDeadline = null, brand }: HomeProps) => {
  return (
    <main>
      <Hero
        carouselProducts={heroCarousel}
        smallCard1={heroSmallCard1}
        smallCard2={heroSmallCard2}
        brand={brand}
      />
      <Categories categories={categories} brand={brand} />
      <NewArrival products={newArrivals} brand={brand} />
      <PromoBanner
        bigCard={promoBig}
        mediumCard1={promoMedium1}
        mediumCard2={promoMedium2}
        brand={brand}
      />
      <BestSeller products={bestSellers} brand={brand} />
      <CounDown
        product={countdownProduct}
        deadline={countdownDeadline}
        brand={brand}
      />
      <Testimonials testimonials={testimonials} />
      <Newsletter />
    </main>
  );
};

export default Home;
