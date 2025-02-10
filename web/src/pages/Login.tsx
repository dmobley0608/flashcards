import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import {useMutation} from '@apollo/client';
import {LOGIN} from '../Queries/UserQueries';
import { useNavigate } from 'react-router';






export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signIn, {loading}] = useMutation(LOGIN);
  const nav = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await signIn({
        variables: {
            email,
            password
        }
    })
    console.log(response)
    if (response.data){
        localStorage.setItem('token', response.data.login)
        nav('/')
    }else{
        alert('Invalid credentials')
    }

  };

  if (loading) return <p>Loading...</p>;

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100">
        <Col xs={12} md={6} lg={4} className="mx-auto">
          <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mt-4">
              Sign in
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
