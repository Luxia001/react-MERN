import "./NewPlace.css";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import React, { useContext } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

export const NewPlace = () => {
  const auth = useContext(AuthContext);
  const { loading, err, sendReq, clearErr } = useHttpClient();

  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
      image: {
        value: null,
        isValid: false,
      },
    },
    false
  );

  const history = useHistory();
  const palceSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("title", formState.inputs.title.value);
      formData.append("description", formState.inputs.description.value);
      formData.append("address", formState.inputs.address.value);
      formData.append("creator", auth.userId);
      formData.append("image", formState.inputs.image.value);
      await sendReq("http://localhost:5000/api/places", "POST", formData);
      history.push("/");
    } catch (error) {}
  };

  return (
    <React.Fragment>
      <ErrorModal
        error={err}
        onClear={clearErr}
      ></ErrorModal>

      <div>
        <form
          className="place-form"
          onSubmit={palceSubmitHandler}
        >
          {loading && <LoadingSpinner asOverlay></LoadingSpinner>}
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please input"
            onInput={inputHandler}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please input least 5 characters"
            onInput={inputHandler}
          />
          <Input
            id="address"
            element="input"
            label="Address"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please input "
            onInput={inputHandler}
          />
          <ImageUpload
            id="image"
            onInput={inputHandler}
            errorText="provide image"
          ></ImageUpload>
          <Button
            type="submit"
            disabled={!formState.isValid}
          >
            ADD Place
          </Button>
        </form>
      </div>
    </React.Fragment>
  );
};
