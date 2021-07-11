import React from "react";
import UnauthenticatedRoute from "./routes/UnAuthenticatedRoute";
import PrivateRoute from "./routes/PrivateRoutes";
import { Switch } from "react-router-dom";
import Home from "./containers/Home";
import NotFound from "./containers/NotFound";
import NewNote from "./containers/NewNote";
import SingleNote from "./containers/SingleNote";
import Settings from "./containers/Setting";

import { useAppContext } from "./libs/context-libs";
import { Login } from "./containers";

export default function Routes() {
  const { isAuthenticated } = useAppContext();

  return (
    <Switch>
      <UnauthenticatedRoute exact path="/auth">
        <Login />
      </UnauthenticatedRoute>
      <PrivateRoute
        isAuthenticated={isAuthenticated}
        component={Settings}
        path="/settings"
      />
      <PrivateRoute
        isAuthenticated={isAuthenticated}
        component={SingleNote}
        path="/notes/:id"
      />
      <PrivateRoute
        isAuthenticated={isAuthenticated}
        component={NewNote}
        path="/notes/new"
      />
      <PrivateRoute
        isAuthenticated={isAuthenticated}
        component={Home}
        path="/"
      />
      <PrivateRoute isAuthenticated={isAuthenticated} component={NotFound} />
    </Switch>
  );
}
