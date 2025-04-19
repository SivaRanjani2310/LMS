import "./Menu.css";
import { Link, useLocation } from "react-router-dom";

const Menu = ({ Icon, Title, Address }) => {
  const location = useLocation();
  const isActive = Address && location.pathname.startsWith(Address);
  return (
    <li className={isActive ? "active" : ""}>
      <Link to={Address || "#"}>
        {Icon}
        <span className="text">{Title}</span>
      </Link>
    </li>
  );
};

export default Menu;
