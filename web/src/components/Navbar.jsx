import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Navbar as BootstrapNavbar, Nav, Container, Button, Overlay, Popover } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { GiCardRandom } from "react-icons/gi";

export default function Navbar() {
  const [showCategories, setShowCategories] = useState(false);
  const target = React.useRef(null);

  // Temporary categories array - will be replaced with API data later
  const categories = [
    "Mathematics",
    "Science",
    "History",
    "Languages",
    "Computer Science",
    "Geography",
    "Literature"
  ];


  return (
    <BootstrapNavbar bg="white" expand="md" className="shadow-sm">
      <Container className='justify-content-start'>
        <BootstrapNavbar.Brand as={Link} to="/">
         ⚡ FlashCards ⚡
        </BootstrapNavbar.Brand>

        <div className='d-flex justify-content-end ms-auto'>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="primary">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton >
              <UserButton.MenuItems>
                <UserButton.Link label='Manage Decks' labelIcon={<GiCardRandom size={'25px'}/>} href="/manage"/>

              </UserButton.MenuItems>

            </UserButton>
          </SignedIn>
        </div>
      </Container>
    </BootstrapNavbar>
  );
}
