import { dataService, Product } from "@/lib/dataService";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import Pagination from "./Pagination";

const PRODUCT_PER_PAGE = 8;

const ProductList = async ({
  categoryId,
  limit,
  searchParams,
}: {
  categoryId: string;
  limit?: number;
  searchParams?: any;
}) => {

  let products: Product[] = [];
  
  if (searchParams?.name) {
    // Search products by name
    const searchResult = await dataService.searchProducts(searchParams.name);
    products = searchResult.items;
  } else if (categoryId === "1") {
    // All products
    const result = await dataService.getProducts(limit);
    products = result.items;
  } else {
    // Products by category
    const result = await dataService.getProductsByCategory(categoryId, limit);
    products = result.items;
  }

  // Apply filters
  if (searchParams?.min || searchParams?.max) {
    products = products.filter(product => {
      const price = product.price.discountedPrice || product.price.price;
      const min = searchParams?.min ? parseFloat(searchParams.min) : 0;
      const max = searchParams?.max ? parseFloat(searchParams.max) : 999999;
      return price >= min && price <= max;
    });
  }

  // Apply sorting
  if (searchParams?.sort) {
    const [sortType, sortBy] = searchParams.sort.split(" ");
    products.sort((a, b) => {
      let aValue, bValue;
      if (sortBy === "price") {
        aValue = a.price.discountedPrice || a.price.price;
        bValue = b.price.discountedPrice || b.price.price;
      } else if (sortBy === "name") {
        aValue = a.name;
        bValue = b.name;
      } else {
        return 0;
      }
      
      if (sortType === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  // Pagination simulation
  const page = searchParams?.page ? parseInt(searchParams.page) : 0;
  const startIndex = page * PRODUCT_PER_PAGE;
  const endIndex = startIndex + PRODUCT_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, endIndex);

  const res = {
    items: paginatedProducts,
    currentPage: page,
    hasPrev: () => page > 0,
    hasNext: () => endIndex < products.length
  };

  return (
    <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
      {res.items.map((product: Product) => (
        <Link
          href={"/" + product.slug}
          className="w-full flex flex-col gap-4 sm:w-[45%] lg:w-[22%]"
          key={product._id}
        >
          <div className="relative w-full h-80">
            <Image
              src={product.media?.mainMedia?.image?.url || "/product.png"}
              alt=""
              fill
              sizes="25vw"
              className="absolute object-cover rounded-md z-10 hover:opacity-0 transition-opacity easy duration-500"
            />
            {product.media?.items && (
              <Image
                src={product.media?.items[1]?.image?.url || "/product.png"}
                alt=""
                fill
                sizes="25vw"
                className="absolute object-cover rounded-md"
              />
            )}
          </div>
          <div className="flex justify-between">
            <span className="font-medium">{product.name}</span>
            <span className="font-semibold">${product.price?.discountedPrice || product.price?.price}</span>
          </div>
          <div className="text-sm text-gray-500">
            {product.description}
          </div>
          <button className="rounded-2xl ring-1 ring-lama text-lama w-max py-2 px-4 text-xs hover:bg-lama hover:text-white">
            Add to Cart
          </button>
        </Link>
      ))}
      {searchParams?.cat || searchParams?.name ? (
        <Pagination
          currentPage={res.currentPage || 0}
          hasPrev={res.hasPrev()}
          hasNext={res.hasNext()}
        />
      ) : null}
    </div>
  );
};

export default ProductList;
