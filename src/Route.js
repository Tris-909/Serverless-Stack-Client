import React from "react";
import { Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import Signup from "./containers/SignUp";
import NewNote from "./containers/NewNote";
import SingleNote from "./containers/SingleNote";
import Settings from "./containers/Setting";
import AuthenticatedRoute from "./components/AuthenticatedRoute/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnAuthenticatedRoute/UnAuthenticatedRoute";
import NavBar from "./components/NavBar/NavBar";
import { Login } from "./containers";

export default function Routes() {
  return (
    <Switch>
      <UnauthenticatedRoute exact path="/login">
        <Login />
      </UnauthenticatedRoute>
      <UnauthenticatedRoute exact path="/signup">
        <Signup />
      </UnauthenticatedRoute>
      <NavBar>
        <AuthenticatedRoute exact path="/settings">
          <Settings />
        </AuthenticatedRoute>
        <AuthenticatedRoute path="/notes/:id">
          <SingleNote />
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path="/notes/new">
          <NewNote />
        </AuthenticatedRoute>
        <AuthenticatedRoute exact path="/">
          <Home />
        </AuthenticatedRoute>
        <AuthenticatedRoute>
          <NotFound />
        </AuthenticatedRoute>
      </NavBar>
    </Switch>
  );
}
