import { client } from './sanity.client'

export async function getAllProducts() {
  return client.fetch(
    `*[_type == "product" && status == "active"] | order(_createdAt desc) {
      _id,
      name,
      "slug": slug.current,
      description,
      price,
      comparePrice,
      images,
      category->{
        _id,
        name,
        "slug": slug.current
      },
      sku,
      inventory,
      colors,
      sizes,
      tags,
      featured,
      bestSeller,
      newArrival,
      status,
      reviews,
      rating
    }`
  )
}

export async function getProductBySlug(slug: string) {
  return client.fetch(
    `*[_type == "product" && slug.current == $slug][0] {
      _id,
      name,
      "slug": slug.current,
      description,
      price,
      comparePrice,
      images,
      category->{
        _id,
        name,
        "slug": slug.current
      },
      sku,
      inventory,
      colors,
      sizes,
      colorVariants,
      productOfMonth,
      policy,
      whatsappNumber,
      deliveryInfo,
      tags,
      featured,
      bestSeller,
      newArrival,
      status,
      reviews,
      rating
    }`,
    { slug }
  )
}

export async function getFeaturedProducts(limit = 8) {
  return client.fetch(
    `*[_type == "product" && featured == true && status == "active"] | order(_createdAt desc) [0...${limit}] {
      _id,
      name,
      "slug": slug.current,
      price,
      comparePrice,
      images,
      productOfMonth,
      reviews,
      rating
    }`
  )
}

export async function getBestSellerProducts(limit = 8) {
  return client.fetch(
    `*[_type == "product" && bestSeller == true && status == "active"] | order(_createdAt desc) [0...${limit}] {
      _id,
      name,
      "slug": slug.current,
      price,
      comparePrice,
      images,
      productOfMonth,
      reviews,
      rating
    }`
  )
}

export async function getNewArrivalProducts(limit = 8) {
  return client.fetch(
    `*[_type == "product" && newArrival == true && status == "active"] | order(_createdAt desc) [0...${limit}] {
      _id,
      name,
      "slug": slug.current,
      price,
      comparePrice,
      images,
      productOfMonth,
      reviews,
      rating
    }`
  )
}

export async function getProductsByCategory(categorySlug: string) {
  return client.fetch(
    `*[_type == "product" && category->slug.current == $categorySlug && status == "active"] | order(_createdAt desc) {
      _id,
      name,
      "slug": slug.current,
      price,
      comparePrice,
      images,
      category->{
        _id,
        name,
        "slug": slug.current
      },
      reviews,
      rating
    }`,
    { categorySlug }
  )
}

export async function getAllCategories() {
  return client.fetch(
    `*[_type == "category"] | order(order asc) {
      _id,
      name,
      "slug": slug.current,
      description,
      image,
      parent->{
        _id,
        name
      }
    }`
  )
}

export async function getAllColors() {
  return client.fetch(
    `array::unique(*[_type == "product" && defined(colors)].colors[].name)`
  )
}

export async function getAllSizes() {
  return client.fetch(
    `array::unique(*[_type == "product" && defined(sizes)].sizes[])`
  )
}

export async function searchProducts(query: string) {
  return client.fetch(
    `*[_type == "product" && status == "active" && (
      name match $query ||
      description match $query ||
      sku match $query
    )] | order(_createdAt desc) {
      _id,
      name,
      "slug": slug.current,
      price,
      comparePrice,
      images,
      reviews,
      rating
    }`,
    { query: `*${query}*` }
  )
}

export async function getFilteredProducts(filters: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const { category, minPrice, maxPrice, color, size, search, page = 1, limit = 20 } = filters;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  let baseQuery = `*[_type == "product" && status == "active"`;

  const params: any = {};

  if (search) {
    baseQuery += ` && (name match $search || description match $search || sku match $search)`;
    params.search = `*${search}*`;
  }

  if (category) {
    baseQuery += ` && category->slug.current == $category`;
    params.category = category;
  }

  if (minPrice !== undefined) {
    baseQuery += ` && price >= $minPrice`;
    params.minPrice = minPrice;
  }

  if (maxPrice !== undefined) {
    baseQuery += ` && price <= $maxPrice`;
    params.maxPrice = maxPrice;
  }

  if (color) {
    baseQuery += ` && $color in colors[].name`;
    params.color = color;
  }

  if (size) {
    baseQuery += ` && $size in sizes`;
    params.size = size;
  }

  baseQuery += `]`;

  const query = `{
    "products": ${baseQuery} | order(_createdAt desc) [${start}...${end}] {
      _id,
      name,
      "slug": slug.current,
      description,
      price,
      comparePrice,
      images,
      category->{
        _id,
        name,
        "slug": slug.current
      },
      sku,
      inventory,
      colors,
      sizes,
      productOfMonth,
      tags,
      featured,
      bestSeller,
      newArrival,
      status,
      reviews,
      rating
    },
    "total": count(${baseQuery})
  }`;

  return client.fetch(query, params);
}

export async function getCustomerOrders(email: string) {
  return client.fetch(
    `*[_type == "order" && customerEmail == $email] | order(createdAt desc) {
      _id,
      orderNumber,
      total,
      status,
      paymentStatus,
      createdAt,
      items[] {
        productName,
        quantity,
        price,
        product->{
          "slug": slug.current,
          images
        }
      }
    }`,
    { email }
  )
}

export async function getSiteSettings() {
  return client.fetch(
    `*[_type == "siteSettings"][0] {
      storeName,
      logo,
      contactEmail,
      contactPhone,
      address,
      bankTransferDetails,
      pickupLocations,
      shippingMethods,
      taxRate,
      currency
    }`
  )
}

export async function getTestimonials() {
  return client.fetch(
    `*[_type == "testimonial"] {
      _id,
      authorName,
      authorRole,
      authorImg,
      review
    }`
  )
}

/** Homepage hero: main carousel + 2 small cards. Products are resolved. */
export async function getHomePageHero() {
  return client.fetch(
    `*[_type == "homePage"][0] {
      "heroCarousel": heroCarousel[]->{
        _id,
        name,
        "slug": slug.current,
        description,
        price,
        comparePrice,
        images,
        category->{ _id, name, "slug": slug.current },
        sku,
        inventory,
        colors,
        sizes,
        productOfMonth,
        tags,
        featured,
        bestSeller,
        newArrival,
        status,
        reviews,
        rating
      },
      "heroSmallCard1": heroSmallCard1->{
        _id,
        name,
        "slug": slug.current,
        description,
        price,
        comparePrice,
        images,
        category->{ _id, name, "slug": slug.current },
        sku,
        inventory,
        colors,
        sizes,
        productOfMonth,
        tags,
        featured,
        bestSeller,
        newArrival,
        status,
        reviews,
        rating
      },
      "heroSmallCard2": heroSmallCard2->{
        _id,
        name,
        "slug": slug.current,
        description,
        price,
        comparePrice,
        images,
        category->{ _id, name, "slug": slug.current },
        sku,
        inventory,
        colors,
        sizes,
        productOfMonth,
        tags,
        featured,
        bestSeller,
        newArrival,
        status,
        reviews,
        rating
      },
      "promoBigCard": promoBigCard->{
        _id,
        name,
        "slug": slug.current,
        description,
        price,
        comparePrice,
        images,
        category->{ _id, name, "slug": slug.current },
        sku,
        inventory,
        colors,
        sizes,
        productOfMonth,
        tags,
        featured,
        bestSeller,
        newArrival,
        status,
        reviews,
        rating
      },
      "promoMediumCard1": promoMediumCard1->{
        _id,
        name,
        "slug": slug.current,
        description,
        price,
        comparePrice,
        images,
        category->{ _id, name, "slug": slug.current },
        sku,
        inventory,
        colors,
        sizes,
        productOfMonth,
        tags,
        featured,
        bestSeller,
        newArrival,
        status,
        reviews,
        rating
      },
      "promoMediumCard2": promoMediumCard2->{
        _id,
        name,
        "slug": slug.current,
        description,
        price,
        comparePrice,
        images,
        category->{ _id, name, "slug": slug.current },
        sku,
        inventory,
        colors,
        sizes,
        productOfMonth,
        tags,
        featured,
        bestSeller,
        newArrival,
        status,
        reviews,
        rating
      },
      "countdownProduct": countdownProduct->{
        _id,
        name,
        "slug": slug.current,
        description,
        price,
        comparePrice,
        images,
        category->{ _id, name, "slug": slug.current },
        sku,
        inventory,
        colors,
        sizes,
        productOfMonth,
        tags,
        featured,
        bestSeller,
        newArrival,
        status,
        reviews,
        rating
      },
      countdownDeadline
    }`
  )
}
