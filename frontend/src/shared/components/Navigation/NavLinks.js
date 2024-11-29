import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import "./NavLinks.css";
import { useContext } from "react";
import { AuthContext } from "../../context/auth-context";
export const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  return (
    <ul className="nav-links">
      <li>
        <NavLink
          to="/"
          exact
        >
          All Users
        </NavLink>
      </li>
      {/* <li>
        <NavLink to="/list-course">CourseCourse</NavLink>
      </li> */}
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>My place</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">Add place</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">Authenticate</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>Logout</button>
        </li>
      )}
    </ul>
  );
};
