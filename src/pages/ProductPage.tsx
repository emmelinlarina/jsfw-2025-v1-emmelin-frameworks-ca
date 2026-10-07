import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { fetchProductById } from "../api/products";
import type { Product } from "../types/product";
import { useCart } from "../context/useCart";
import styles from "./ProductPage.module.css";

function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;

      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch {
        setError("Failed to load product.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  const hasDiscount = product.discountedPrice < product.price;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <img
          className={styles.image}
          src={product.image.url}
          alt={product.image.alt || product.title}
          width="300"
        />

        <section className={styles.info}>
          <h1 className={styles.title}>{product.title}</h1>
          <p className={styles.description}>{product.description}</p>

          <div className={styles.priceBox}>
            {hasDiscount && (
              <span className={styles.originalPrice}>{product.price} kr</span>
            )}
            <strong className={styles.discountedPrice}>
              {product.discountedPrice} kr
            </strong>
          </div>

          <button
            className={styles.button}
            onClick={() => {
              addToCart(product);
              setAdded(true);
              setTimeout(() => setAdded(false), 1400);
            }}
          >
            {added ? "Added!" : "Add to Cart"}
          </button>

          <h2>Tags</h2>
          <div className={styles.tags}>
            {product.tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                #{tag}
              </span>
            ))}
          </div>
        </section>
      </div>

      <section className={styles.reviews}>
        <h2>Reviews</h2>

        {product.reviews.length > 0 ? (
          product.reviews.map((review) => {
            const roundedRating = Math.round(review.rating);
            const stars =
              "★".repeat(roundedRating) + "☆".repeat(5 - roundedRating);

            return (
              <article key={review.id} className={styles.review}>
                <h3>{review.username}</h3>
                <p
                  className={styles.rating}
                  aria-label={`${review.rating} out of 5 stars`}
                >
                  {stars}
                </p>
                <p>{review.description}</p>
              </article>
            );
          })
        ) : (
          <p>No reviews yet.</p>
        )}
      </section>
    </main>
  );
}

export default ProductPage;
