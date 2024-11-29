import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import { Card } from "../../shared/components/UIElement/Card";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import "./Auth.css";

import React, { useContext, useState } from "react";
import { useHttpClient } from "../../shared/hooks/http-hook";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

function Auth() {
  const auth = useContext(AuthContext);
  const [isLogin, setLogin] = useState(true);
  const { loading, err, sendReq, clearErr } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLogin) {
      setFormData(
        { ...formState.inputs, name: undefined, image: undefined },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            inValid: false,
          },
        },
        false
      );
    }
    setLogin((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    console.log(formState.inputs);

    if (isLogin) {
      try {
        const resData = await sendReq(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { "Content-Type": "application/json" }
        );

        auth.login(resData.userId, resData.token);
      } catch (error) {}
    } else {
      try {
        const formData = new FormData();
        formData.append("name", formState.inputs.name.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("email", formState.inputs.email.value);
        formData.append("image", formState.inputs.image.value);
        const resData = await sendReq(
          "http://localhost:5000/api/users/signup",
          "POST",
          formData
        );

        auth.login(resData.userId, resData.token);
      } catch (error) {}
    }
  };
  return (
    <React.Fragment>
      <ErrorModal
        error={err}
        onClear={clearErr}
      ></ErrorModal>
      <Card className="authentication p-5">
        {loading && <LoadingSpinner asOverlay></LoadingSpinner>}
        <h2>Login</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLogin && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Name"
              validators={[VALIDATOR_REQUIRE]}
              errorText="require"
              onInput={inputHandler}
            ></Input>
          )}
          {!isLogin && (
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText="provide image"
            ></ImageUpload>
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="please input"
            onInput={inputHandler}
          ></Input>
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="please input"
            onInput={inputHandler}
          ></Input>
          <Button
            type="submit"
            disabled={!formState.isValid}
          >
            {isLogin ? "Login" : "Signup"}
          </Button>
        </form>
        <Button
          inverse
          onClick={switchModeHandler}
        >
          switch to {isLogin ? "Signup" : "Login"}
        </Button>
      </Card>
    </React.Fragment>
  );
}

export default Auth;
