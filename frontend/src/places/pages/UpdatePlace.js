import "./NewPlace.css";

import React, { useContext, useEffect, useState } from "react";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { Card } from "../../shared/components/UIElement/Card";
import { useHttpClient } from "../../shared/hooks/http-hook";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";

function UpdatePlace() {
  const auth = useContext(AuthContext);
  const { loading, err, sendReq, clearErr } = useHttpClient();
  const [loadedPlaces, setLoadedPlaces] = useState();
  const placeId = useParams().placeId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const resData = await sendReq(
          `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`
        );
        setLoadedPlaces(resData.place);
        setFormData(
          {
            title: {
              value: resData.place.title,
              isValid: true,
            },
            description: {
              value: resData.place.description,
              isValid: true,
            },
          },
          true
        );
      } catch (error) {}
    };
    fetchPlace();
  }, [sendReq, placeId, setFormData]);

  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await sendReq(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        "PATCH",
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      history.push("/" + auth.userId + "/places");
    } catch (error) {}
  };

  if (loading) {
    return (
      <div className="center">
        <LoadingSpinner></LoadingSpinner>
      </div>
    );
  }
  if (!loadedPlaces && !err) {
    return <div>UPdate not found!</div>;
  }

  return (
    <React.Fragment>
      <ErrorModal
        error={err}
        onClear={clearErr}
      ></ErrorModal>
      {!loading && loadedPlaces && (
        <form
          className="place-form"
          onSubmit={placeUpdateSubmitHandler}
        >
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="please input"
            onInput={inputHandler}
            initalValue={loadedPlaces.title}
            initalValid={true}
          ></Input>
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="please input less min 5 characters"
            onInput={inputHandler}
            initalValue={loadedPlaces.description}
            initalValid={true}
          ></Input>
          <Button
            type="submit"
            disabled={!formState.isValid}
          >
            Update place
          </Button>
        </form>
      )}
    </React.Fragment>
  );
}

export default UpdatePlace;
