import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_DECKS_BY_USER_ID } from "../Queries/DeckQueries";
import { Tab, Nav, Container, Row, Col, Card } from "react-bootstrap";
import DeckManager from "../components/manage/DeckManager";
import Loader from "../components/Loader";
import { useAuth } from "@clerk/clerk-react";

export default function ManageDecks() {
  const [activeTab, setActiveTab] = useState("decks");
  const { userId } = useAuth();

  const { loading, error, data } = useQuery(GET_DECKS_BY_USER_ID);

  if (loading) return <div><Loader progress={75}/></div>;
  if (error) return <div>Error: {error.message}</div>;

  const userDecks = data?.userDecks?.filter((deck: any) => deck.userId === userId);

  return (
    <Container className="mt-5">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="mb-4">Manage Your Content</h2>
          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k || "decks")}>
            <Row>
              <Col sm={12}>
                <Tab.Content>
                  <Tab.Pane eventKey="decks">
                    <DeckManager decks={userDecks} />
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Card.Body>
      </Card>
    </Container>
  );
}
