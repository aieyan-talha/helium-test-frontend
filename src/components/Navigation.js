import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useAuthContext } from "../hooks/use-auth";
import { logoutUser } from "../utils";

export const Navigation = () => {
  const { userData, setUserData } = useAuthContext();

  return (
    <Navbar className="navbar-grey">
      <Container>
        <Navbar.Brand href="/" className="navbar-brand-font">
          Helium Test
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home" className="navbar-link">
              Home
            </Nav.Link>
            <Nav.Link href="#link" className="navbar-link">
              Link
            </Nav.Link>
          </Nav>
          <Nav className="justify-content-end">
            <Navbar.Text className="navbar-username">
              {userData?.name}
            </Navbar.Text>
            <Nav.Link
              className="navbar-link"
              onClick={() => {
                logoutUser();
                setUserData(null);
              }}
            >
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
