import Link from "next/link";
import React from "react";
import { Container, Row, Col } from "reactstrap";

function App() {
  return (
    <Container>
      <Row xs="2">
        <Col>Column</Col>
        <Col>Column</Col>
        <Col>Column</Col>
        <Col>Column</Col>
        <Link href="/">
          <a>Go Home</a>
        </Link>
      </Row>
      <Row xs="3">
        <Col>Column</Col>
        <Col>Column</Col>
        <Col>Column</Col>
        <Col>Column</Col>
      </Row>
      <Row xs="4">
        <Col>Column</Col>
        <Col>Column</Col>
        <Col>Column</Col>
        <Col>Column</Col>
      </Row>
      <Row xs="4">
        <Col>Column</Col>
        <Col>Column</Col>
        <Col xs="6">Column</Col>
        <Col>Column</Col>
      </Row>
      <Row xs="1" sm="2" md="4">
        <Col>Column</Col>
        <Col>Column</Col>
        <Col>Column</Col>
        <Col>Column</Col>
      </Row>
    </Container>
  );
}

export default App;
