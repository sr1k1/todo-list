import { NavLink } from "react-router";

import styles from "./Header.module.css";

function Header({ title }) {
  return (
    <>
      <h1 className={styles.headerTitle}>{title}</h1>
      <nav className={styles.headerNav}>
        <NavLink
          to={"/"}
          className={({ isActive }) => {
            return isActive ? styles.active : styles.inactive;
          }}
        >
          Home
        </NavLink>
        <NavLink
          to={"/about"}
          className={({ isActive }) => {
            return isActive ? styles.active : styles.inactive;
          }}
        >
          About
        </NavLink>
      </nav>
    </>
  );
}

export default Header;
