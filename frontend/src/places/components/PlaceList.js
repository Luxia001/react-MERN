import Button from "../../shared/components/FormElements/Button";
import { Card } from "../../shared/components/UIElement/Card";
import { PlaceItem } from "./PlaceItem";
import "./PlaceList.css";
export const PlaceList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card style={{ padding: "20px" }}>
          <h1>No place found</h1>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map((place) => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator}
          coordinates={place.location}
          onDelete={props.onDeletePlace}
        ></PlaceItem>
      ))}
    </ul>
  );
};
