import React from "react";
import { Row, Col } from "reactstrap";
import { useSelector } from "react-redux";
import AddUser from "../components/users/addUsers";
import Layout from "../components/Layout";
import departmentReducer from "../redux/departments/departmentReducer";

function Users() {
  const { departments } = useSelector((state) => ({
    departments: state.departments.departments,
  }));
  console.log(departments, "def");
  return (
    <Layout>
      <Row>
        <Col className="mb-5">
          <p>Please add users</p>
          <AddUser depts={departments} />
        </Col>
      </Row>
    </Layout>
  );
}
export default Users;
