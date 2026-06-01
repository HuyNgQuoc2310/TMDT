import { useEffect, useMemo, useState } from "react";
import productService from "../services/productService";
import { categories as seedCategories, products as seedProducts } from "../data/catalog";

export function useCatalog() {
  const [products, setProducts] = useState(seedProducts);
  const [categories, setCategories] = useState(seedCategories);
  const [source, setSource] = useState("fallback");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadCatalog() {
      try {
        const [productData, categoryData] = await Promise.all([
          productService.getProducts(),
          productService.getCategories(),
        ]);

        if (mounted) {
          setProducts(productData);
          setCategories(categoryData);
          setSource("api");
        }
      } catch {
        if (mounted) {
          setProducts(seedProducts);
          setCategories(seedCategories);
          setSource("fallback");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadCatalog();
    return () => {
      mounted = false;
    };
  }, []);

  const categoryById = useMemo(
    () => new Map(categories.map((category) => [category.id, category])),
    [categories]
  );

  return { products, categories, categoryById, source, loading };
}
