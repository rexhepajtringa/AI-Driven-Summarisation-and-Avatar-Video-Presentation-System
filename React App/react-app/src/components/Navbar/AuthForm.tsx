import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies from "js-cookie"; // Import js-cookie

interface AuthFormProps {
  isSignUp: boolean; // True for Sign Up, False for Login
  onLoginSuccess?: () => void; // Optional function that will be called on successful login
}

const AuthForm: React.FC<AuthFormProps> = ({ isSignUp, onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const endpoint = isSignUp
      ? "http://localhost:8765/USER-MANAGEMENT-SERVICE/api/v1/auth/register"
      : "http://localhost:8765/USER-MANAGEMENT-SERVICE/api/v1/auth/login";

    const payload = isSignUp
      ? JSON.stringify({ username, email, password })
      : JSON.stringify({ username, password });

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      if (!response.ok) {
        throw new Error("Failed to complete request");
      }

      const data = await response.json(); // Parse JSON response

      // Set cookies for token and user ID
      Cookies.set("token", data.token, { expires: 10 }); // Expires in 1 day
      Cookies.set("userId", data.userId.toString(), { expires: 10 }); // Make sure userId is a string

      setSuccess(isSignUp ? "Sign-up success" : "Login success");

      // Call the onLoginSuccess callback after 2 seconds if login was successful
      if (!isSignUp && onLoginSuccess) {
        setTimeout(() => {
          onLoginSuccess();
        }, 2000);
      }
    } catch (error) {
      setError("Failed to complete the operation.");
    }
  };

  return (
    <Container fluid>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title className="text-center">
                {isSignUp ? "Sign Up" : "Log In"}
              </Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Form.Group>

                {isSignUp && (
                  <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" type="submit">
                  {isSignUp ? "Sign Up" : "Log In"}
                </Button>
              </Form>
              {error && <div className="alert alert-danger mt-3">{error}</div>}
              {success && (
                <div className="alert alert-success mt-3">{success}</div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthForm;
