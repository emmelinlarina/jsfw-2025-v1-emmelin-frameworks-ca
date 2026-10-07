import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";
import styles from "./Header.module.css";

function Header() {
  const { cartCount } = useCart();

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.homeLink}>
        SHOPPING STORE
      </Link>
      <nav className={styles.nav}>
        <Link to="/contact" className={styles.link}>
          Contact
        </Link>
        <Link to="/cart" className={styles.cart}>
          <i className="fa-solid fa-shopping-cart" aria-hidden="true"></i>
          Cart ({cartCount})
        </Link>
      </nav>
    </header>
  );
}

export default Header;
