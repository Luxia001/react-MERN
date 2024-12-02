import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import React, { Suspense, useCallback, useEffect, useState } from "react";
// import { Users } from "./user/pages/Users";
// import { NewPlace } from "./places/pages/NewPlace";
// import { UserPlaces } from "./places/pages/UserPlaces";
// import UpdatePlace from "./places/pages/UpdatePlace";
// import Auth from "./user/pages/Auth";
import { Course } from "./listCourse/pages/Course";
import { Redirect, Switch } from "react-router-dom/cjs/react-router-dom.min";
import { MainNavigation } from "./shared/components/Navigation/MainNavigation";
import { PageTest } from "./test/page/pageTest";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import LoadingSpinner from "./shared/components/UIElement/LoadingSpinner";

const Users = React.lazy(() => import("./user/pages/Users"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const Auth = React.lazy(() => import("./user/pages/Auth"));

function App() {
  const { token, tokenExpDate, userId, login, logout } = useAuth();
  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route
          path="/"
          exact
        >
          <Users></Users>
        </Route>
        <Route
          path="/:userId/places"
          exact
        >
          <UserPlaces></UserPlaces>
        </Route>
        <Route
          path="/places/new"
          exact
        >
          <NewPlace></NewPlace>
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace></UpdatePlace>
        </Route>
        <Route path="/list-course">
          <Course></Course>
        </Route>
        <Route path="/test">
          <PageTest></PageTest>
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route
          path="/:userId/places"
          exact
        >
          <UserPlaces></UserPlaces>
        </Route>
        <Route path="/auth">
          <Auth></Auth>
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation></MainNavigation>
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner></LoadingSpinner>
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
