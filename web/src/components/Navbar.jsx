import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router';

export default function Navbar() {
  return (
    <BootstrapNavbar bg="white" expand="md" className="shadow-sm">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/">
          FlashCards
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto"></Nav>
        <Nav>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="primary">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Nav>
      </BootstrapNavbar.Collapse>
    </Container>
    </BootstrapNavbar >
  );
}
