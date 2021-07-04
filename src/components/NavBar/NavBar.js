import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { LinkContainer } from "react-router-bootstrap";
import { useAppContext } from "../../libs/context-libs";
import { useHistory } from "react-router-dom";
import { Auth } from "aws-amplify";

const NavBar = () => {
  const { isAuthenticated, setIsAuthenticated } = useAppContext();
  const history = useHistory();

  const handlerLogOut = async () => {
    await Auth.signOut();
    history.push("/login");
    setIsAuthenticated(false);
  };

  return (
    <Navbar collapseOnSelect bg="light" expand="md" className="mb-3">
      <LinkContainer to="/">
        <Navbar.Brand className="font-weight-bold text-muted">
          Scratch
        </Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <Nav activeKey={window.location.pathname}>
          {isAuthenticated ? (
            <>
              <LinkContainer to="/settings">
                <Nav.Link>Settings</Nav.Link>
              </LinkContainer>
              <Nav.Link onClick={handlerLogOut}>Log Out</Nav.Link>
            </>
          ) : (
            <>
              <LinkContainer to="/signup">
                <Nav.Link>Signup</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/login">
                <Nav.Link>Login</Nav.Link>
              </LinkContainer>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavBar;
