import { Link } from "react-router-dom";
import { useState } from "react";
import type { Product } from "../types/product";
import { useCart } from "../context/useCart";
import styles from "./ProductCard.module.css";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const hasDiscount = product.discountedPrice < product.price;

  const discountPercentage = Math.round(
    ((product.price - product.discountedPrice) / product.price) * 100,
  );

  return (
    <article className={styles.wrapper}>
      <Link to={`/product/${product.id}`} className={styles.card}>
        {hasDiscount && (
          <span className={styles.discountBadge}>{discountPercentage}%</span>
        )}

        <img
          src={product.image.url}
          alt={product.image.alt || product.title}
          className={styles.image}
        />

        <div className={styles.content}>
          <h2>{product.title}</h2>

          <div className={styles.buttonContainer}>
            <div className={styles.priceBox}>
              {hasDiscount ? (
                <>
                  <span className={styles.discountedPrice}>
                    {product.discountedPrice} kr
                  </span>
                  <span className={styles.originalPrice}>
                    {product.price} kr
                  </span>
                </>
              ) : (
                <span className={styles.discountedPrice}>
                  {product.price} kr
                </span>
              )}
            </div>

            <button
              className={styles.addButton}
              onClick={(e) => {
                e.preventDefault();
                addToCart(product);
                setAdded(true);

                setTimeout(() => setAdded(false), 1400);
              }}
            >
              {added ? "Added!" : "Add to Cart"}
            </button>

            <div className={styles.footer}>
              <div className={styles.tags}>
                {product.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className={styles.ratingBox}>
                {" "}
                {product.rating.toFixed(1)} ★
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
