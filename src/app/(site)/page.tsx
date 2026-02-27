import Home from "@/components/Home";
import { Metadata } from "next";
import { getNewArrivalProducts, getBestSellerProducts, getFeaturedProducts, getAllCategories, getTestimonials, getHomePageHero } from "@/lib/sanity.queries";
import { sanityProductsToProducts, sanityCategoriesToCategories, sanityTestimonialsToTestimonials, sanityProductToProduct } from "@/lib/sanityHelpers";

export const metadata: Metadata = {
  title: "NextCommerce | Nextjs E-commerce template",
  description: "This is Home for NextCommerce Template",
};

export const revalidate = 60;

export default async function HomePage() {
  const [newArrivals, bestSellers, featured, categories, testimonials, heroData] = await Promise.all([
    getNewArrivalProducts(8),
    getBestSellerProducts(6),
    getFeaturedProducts(8),
    getAllCategories(),
    getTestimonials(),
    getHomePageHero(),
  ]);

  const newArrivalProducts = sanityProductsToProducts(newArrivals || []);
  const bestSellerProducts = sanityProductsToProducts(bestSellers || []);
  const featuredProducts = sanityProductsToProducts(featured || []);
  const allCategories = sanityCategoriesToCategories(categories || []);
  const allTestimonials = sanityTestimonialsToTestimonials(testimonials || []);

  const heroCarousel = (heroData?.heroCarousel || []).filter(Boolean).map(sanityProductToProduct);
  const heroSmallCard1 = heroData?.heroSmallCard1 ? sanityProductToProduct(heroData.heroSmallCard1) : null;
  const heroSmallCard2 = heroData?.heroSmallCard2 ? sanityProductToProduct(heroData.heroSmallCard2) : null;

  const promoBig = heroData?.promoBigCard ? sanityProductToProduct(heroData.promoBigCard) : null;
  const promoMedium1 = heroData?.promoMediumCard1 ? sanityProductToProduct(heroData.promoMediumCard1) : null;
  const promoMedium2 = heroData?.promoMediumCard2 ? sanityProductToProduct(heroData.promoMediumCard2) : null;
  const countdownProduct = heroData?.countdownProduct ? sanityProductToProduct(heroData.countdownProduct) : null;
  const countdownDeadline = heroData?.countdownDeadline ?? null;

  return (
    <>
      <Home 
        newArrivals={newArrivalProducts}
        bestSellers={bestSellerProducts}
        featured={featuredProducts}
        categories={allCategories}
        testimonials={allTestimonials}
        heroCarousel={heroCarousel}
        heroSmallCard1={heroSmallCard1}
        heroSmallCard2={heroSmallCard2}
        promoBig={promoBig}
        promoMedium1={promoMedium1}
        promoMedium2={promoMedium2}
        countdownProduct={countdownProduct}
        countdownDeadline={countdownDeadline}
      />
    </>
  );
}
