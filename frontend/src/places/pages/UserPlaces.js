import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { PlaceList } from "../components/PlaceList";
import { useHttpClient } from "../../shared/hooks/http-hook";
import React, { useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";

export const UserPlaces = () => {
  const { loading, err, sendReq, clearErr } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState();
  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const resData = await sendReq(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );
        setLoadedPlaces(resData.places);
      } catch (error) {}
    };
    fetchPlaces();
  }, [sendReq, userId]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces((prev) =>
      prev.filter((place) => place.id !== deletedPlaceId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal
        error={err}
        onClear={clearErr}
      ></ErrorModal>
      {loading && (
        <div className="center">
          <LoadingSpinner></LoadingSpinner>
        </div>
      )}
      {!loading && loadedPlaces && (
        <PlaceList
          items={loadedPlaces}
          onDeletePlace={placeDeletedHandler}
        ></PlaceList>
      )}
    </React.Fragment>
  );
};
