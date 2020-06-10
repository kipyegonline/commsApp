import React, { useState } from "react";
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText,
  Card,
} from "reactstrap";
import Layout from "../components/Layout";

const AddStats = (props) => {
  const [classv, setClassv] = useState("Select Victim class");

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <Layout title="Add statsistsics">
      <Form style={formStyle} onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="selectClass">Select Victim class</Label>
          <ClassSelect getValue={setClassv} selected={classv} />
        </FormGroup>

        <FormGroup>
          <Label for="fatalities">Fatalities</Label>
          <Input type="text" name="fatalities" id="fatalities" placeholder="" />
        </FormGroup>
        <FormGroup>
          <Label for="seriousInjuries">Seriously Injured</Label>
          <Input
            type="text"
            name="seriousInjuries"
            id="seriousInjuries"
            placeholder=""
          />
        </FormGroup>

        <FormGroup>
          <Label for="slightInjuries">Slightly Injured</Label>
          <Input
            type="text"
            name="slightInjuries"
            id="slightInjuries"
            placeholder=""
          />
        </FormGroup>

        <FormGroup>
          <Label for="notes">Text Area</Label>
          <Input
            type="textarea"
            cols={50}
            rows={3}
            className="mb-3"
            name="text"
            id="notes"
          />
        </FormGroup>

        <Button className="blue lighten-2 btn-block">Submit</Button>
      </Form>
    </Layout>
  );
};
const ClassSelect = ({ getValue, selected }) => (
  <select
    id="selectClass"
    className="form-control"
    onChange={(e) =>
      e.target.value === "Select Victim class" ? null : getValue(e.target.value)
    }
    value={selected}
  >
    <option>Select Victim class</option>
    {addClass.map((clas) => (
      <option key={clas.id} value={clas.name}>
        {clas.name}
      </option>
    ))}
  </select>
);

const formStyle = {
  maxWidth: 600,
  background: "#fff",
  padding: "2rem",
  margin: "1rem auto",
  border: "1px solid yellow",
  zIndex: 10,
};
const addClass = [
  { id: 1, name: "pedestrians" },
  { id: 2, name: "drivers" },
  { id: 3, name: "passengers" },
  { id: 4, name: "Pillion pass" },
  { id: 5, name: "pedal Cyclist" },
  { id: 6, name: "Motor cyclists" },
];

export default AddStats;
