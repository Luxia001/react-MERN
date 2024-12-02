import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { Avatar } from "../../shared/components/UIElement/Avatar";
import { Card } from "../../shared/components/UIElement/Card";
import "./UserItem.css";

export const UserItem = (props) => {
  return (
    <li className="user-item">
      <Card className="user-item_content">
        <Link to={`/${props.id}/places`}>
          <div className="user-item_image">
            {props.image ? (
              <Avatar
                image={`${process.env.REACT_APP_ASSET_URL}/${props.image}`}
                alt={props.name}
                width={"auto"}
                height={"auto"}
              ></Avatar>
            ) : (
              <div className="bg-slate-300 w-[50px] h-[50px] rounded-full"></div>
            )}
          </div>
          <div className="user-item_info">
            <h2>{props.name}</h2>
            <h3>
              {props.placeCount} {props.placeCount === 1 ? "place" : "places"}{" "}
            </h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};
