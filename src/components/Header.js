import React from "react";
import { Row, Col } from "reactstrap";

export default () => (
  <Row>
    <header>
      <h3>Customer Care Manager</h3>
    </header>

    <style jsx>
      {`
        header {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        h3 {
          font-size: 1.5rem;
          font-weight: bold;
          text-shadow: 2px 2px 10px;
          text-align: center;
          line-height: 1.6em;
        }
      `}
    </style>
  </Row>
);
