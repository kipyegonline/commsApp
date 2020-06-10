import React from "react";
import Link from "next/link";
import * as d3 from "d3";
import { Container, Jumbotron, Row, Col, Button } from "reactstrap";
import Layout from "../components/Layout";

const About = (props) => {
  console.log("props", props);
  return (
    <Layout title="about">
      <Jumbotron>
        <Row className="main">
          <Col lg="9" md="8" sm="12" className="mb-2">
            <ul>
              <li>
                <Link as={`/post`} href={`/post?title=${"Jules"}`}>
                  <a>Article 1</a>
                </Link>
              </li>
              <li>
                <Link as={`/post`} href={`/post?title=${"Sheila"}`}>
                  <a>Article 2</a>
                </Link>
              </li>
            </ul>
          </Col>
          <Col lg="3" md="4" sm="12" className="mb-2">
            Loading table
          </Col>
        </Row>
      </Jumbotron>
      <style jsx>
        {`
          .main {
            background: deepskyblue;
          }
        `}
      </style>
    </Layout>
  );
};
export default About;
