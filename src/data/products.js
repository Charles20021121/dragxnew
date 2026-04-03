import { generateSlug } from "@/lib/utils";

async function fetchProducts() {
  const res = await fetch('/api/products');
  const data = await res.json();
  return data;
}

export async function getProductsByCategory(category) {
  const products = await fetchProducts();
  return products
    .filter(product => product.categories === category)
    .map(product => ({
      ...product,
      get slug() {
        return generateSlug(this.name);
      },
      images: [product.image, ...product.additionalImages]
    }));
}

export async function getAllProducts() {
  const products = await fetchProducts();
  return products.map(product => ({
    ...product,
    get slug() {
      return generateSlug(this.name);
    },
    images: [product.image, ...product.additionalImages]
  }));
}

export const androidProducts = [
  {
    id: 1,
    name: "10 Inch Android Player",
    categories: "android",
    image: "https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/slfrg9tkismliphc6brl.webp",
    buy: "https://www.amazon.com",
    specifications: "Specifications of the product",
    get slug() {
      return generateSlug(this.name);
    }
  },
  {
    id: 2,
    name: "9 Inch Android Player",
    categories: "android",
    image: "https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/bgw9ezkplypkpl13ytk3.webp",
    buy: "https://www.amazon.com",
    specifications: "Specifications of the product",
    get slug() {
      return generateSlug(this.name);
    }
  },
  {
    id: 3,
    name: "7 Inch Android Player",
    categories: "android",
    image: "https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/yn4yehu7iamawkuvap98.webp",
    buy: "https://www.amazon.com",
    specifications: "Specifications of the product",
    get slug() {
      return generateSlug(this.name);
    }
  },
  {
    id: 4,
    name: "12 Inch Android Player",
    categories: "android",
    image: "https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/yn4yehu7iamawkuvap98.webp",
    buy: "https://www.amazon.com",
    specifications: "Specifications of the product",
    get slug() {
      return generateSlug(this.name);
    }
  },
  {
    id: 5,
    name: "15 Inch Android Player",
    categories: "android",
    image: "https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/yn4yehu7iamawkuvap98.webp",
    buy: "https://www.amazon.com",
    specifications: "Specifications of the product",
    get slug() {
      return generateSlug(this.name);
    }
  }
];

export const ambientProducts = [
  {
    id: 1,
    name: "Universal Ambient Light Rainbow",
    categories: "ambient",
    image: "https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/bgw9ezkplypkpl13ytk3.webp",
    buy: "https://www.amazon.com",
    specifications: "Specifications of the product",
    get slug() {
      return generateSlug(this.name);
    }
  },
  {
    id: 2,
    name: "Ambient Light RGB Universal Fullset",
    categories: "ambient",
    image: "https://pub-332f16c726da4f048f11221d7baacb53.r2.dev/dragx/dragx/bgw9ezkplypkpl13ytk3.webp",
    buy: "https://www.amazon.com",
    specifications: "Specifications of the product",
    get slug() {
      return generateSlug(this.name);
    }
  }
]; 