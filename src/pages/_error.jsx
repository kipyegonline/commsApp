import React from "react";
import { Row, Col } from "reactstrap";
import Layout from "../components/Layout";

export default ({ location }) => (
  <Layout>
    <Row className="my-4">
      <Col className="bg-light p-4" md="12">
        <p className="text-center text-danger">Err finding that resource</p>
      </Col>
    </Row>
  </Layout>
);
