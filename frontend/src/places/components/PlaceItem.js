import React, { useContext, useState } from "react";
import Button from "../../shared/components/FormElements/Button";
import { Card } from "../../shared/components/UIElement/Card";
import "./PlaceItem.css";
import Modal from "../../shared/components/UIElement/Modal";
import Map from "../../shared/components/UIElement/Map";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";

export const PlaceItem = (props) => {
  const { loading, err, sendReq, clearErr } = useHttpClient();
  const auth = useContext(AuthContext);
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };
  const cancleDeleteHandler = () => {
    setShowConfirmModal(false);
  };
  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendReq(
        `${process.env.REACT_APP_BACKEND_URL}/places/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onDelete(props.id);
    } catch (error) {}
  };
  return (
    <React.Fragment>
      <ErrorModal
        error={err}
        onClear={clearErr}
      ></ErrorModal>
      <Modal
        show={showMap}
        onCancle={closeMapHandler}
        header={props.address}
        contentClass="palce-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          {!true ? (
            <Map
              center={props.coordinates}
              zoom={16}
            ></Map>
          ) : (
            <h1 className="bg-red-500 text-white w-[100px] h-[100px]">Map</h1>
          )}
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancle={cancleDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button
              inverse
              onClick={cancleDeleteHandler}
            >
              Cancle
            </Button>
            <Button
              danger
              onClick={confirmDeleteHandler}
            >
              Delete
            </Button>
          </React.Fragment>
        }
      >
        <p>delete ?</p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {loading && <LoadingSpinner asOverlay></LoadingSpinner>}
          <div className="place-item__image">
            <img
              src={`http://localhost:5000/${props.image}`}
              alt=""
            />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button
              inverse
              onClick={openMapHandler}
            >
              View
            </Button>
            {auth.userId === props.creatorId && (
              <Button to={`/places/${props.id}`}>Edit</Button>
            )}
            {auth.userId === props.creatorId && (
              <Button
                danger
                onClick={showDeleteWarningHandler}
              >
                Delete
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};
