import { useEffect, useState } from "react";
import { fetchProducts } from "../api/products";
import type { Product } from "../types/product";
import { ProductCard } from "../components/ProductCard";
import styles from "./Home.module.css";

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch {
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <main className={styles.container}>
        <p>{error}</p>
      </main>
    );
  }

  const filteredProducts = products.filter((product) => {
    const searchValue = search.toLowerCase();

    const matchesSearch =
      product.title.toLowerCase().includes(searchValue) ||
      product.description.toLowerCase().includes(searchValue) ||
      product.tags.some((tag) => tag.toLowerCase().includes(searchValue));

    const matchesSale =
      sortOption !== "sale" || product.discountedPrice < product.price;

    return matchesSearch && matchesSale;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    if (sortOption === "priceLowHigh") {
      return a.price - b.price;
    }
    if (sortOption === "priceHighLow") {
      return b.price - a.price;
    }

    if (sortOption === "sale") {
      const discountA = a.price - a.discountedPrice;
      const discountB = b.price - b.discountedPrice;
      return discountB - discountA;
    }

    return 0;
  });

  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <h1>Shop the latest products</h1>
        <p>Discover our newest arrivals and best deals</p>
      </section>

      <h2 className={styles.title}>Products</h2>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search products by name, description, or tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className={styles.sortSelect}
        >
          <option value="newest">Newest Arrivals</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
          <option value="sale">SALE</option>
        </select>
      </div>

      <p className={styles.productCount}>
        Showing {sortedProducts.length} of {products.length} products
      </p>

      {sortedProducts.length === 0 ? (
        <p className={styles.noResults}>
          No products found matching your search.
        </p>
      ) : (
        <div className={styles.productGrid}>
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}

export default Home;
