import React from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Grid, Container, Divider } from "@material-ui/core";
import * as postactions from "../redux/posts/actions";
import Layout, { useAuth } from "../components/Layout";
import FetchDepts from "../lib/api/depts";

const Home = () => {
  const dispatch = useDispatch();

  const fetchLaravel = (id) => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        dispatch(postactions.addPosts(res.data));
      })
      .catch((error) => error);
  };
  React.useEffect(() => {
    if (!useAuth()) return;
    const { uuid, userdept } = useAuth();
    if (uuid) {
      fetchLaravel(uuid);
      FetchDepts("/departments/fetchdepts/true", dispatch);
    }
  }, []);

  return (
    <Layout title="Home">
      <Grid container justify="space-evenly" alignItems="flex-start">
        <Grid item>Users</Grid>
        <Divider orientation="vertical" />
        <Grid item>Departments</Grid>
        <Divider orientation="vertical" />
        <Grid item>Issues</Grid>
      </Grid>

      <style jsx>{``}</style>
    </Layout>
  );
};

export default Home;
/*
export const getStaticProps = async () => {
  try {
    const res = await fetch(`/posts/20`);

    const posts = await res.json();
    return { props: { posts } };
  } catch (error) {
    return {};
  }
};*/

// cv

const skills = [
  {
    language: "JavaScript",
    libraries: [
      "React js",
      "jQuery",
      "Redux",
      "Next Js",
      "TypeScript",
      "D3 js",
      "CSS in JS",
      "Unit Testing (jest,Enzyme and Cypress)",
    ],
  },
  { language: "Python", libraries: ["Python", "Pandas"] },
  { language: "PHP", libraries: ["PHP core", "MySql"] },
  {
    language: "C#",
    libraries: [
      "I am currently learning C#, static and strongly typed object oriented language or call it mother of Typescript",
    ],
  },
];

console.log(
  "%cHello there, \n why are you here? \n Anyway,since you're here, my name is Vincent Kipyegon, a front end react  web developer with over 3 years of experience in front end web development. I enjoy building interfaces with javascript,backend stuff with php and Mysql and data analysis with python. \n \
    Get in touch %cvince.kipyegon11@gmail.com",
  "font-family:cursive;font-size:1rem;",
  "font-weight:bold; font-family:cursive;font-size:1rem;"
);
for (let i = 0; i < skills.length; i++) {
  console.log(
    `%c${skills[i].language} \n `,
    "font-weight:bold; font-size:1rem;border-bottom:1px solid purple; color:purple; font-family:cursive;"
  );
  let lib = skills[i].libraries;
  //console.table(lib);
  //libraries
  for (let j = 0; j < lib.length; j++) {
    if (j < 1) {
      console.log(
        "%cLibrarie(s): ",
        "font-style:italic; font-weight:bold; margin-left:.35rem"
      );
    }

    console.log(`%c${j + 1}. ${lib[j]}`, "margin-left:.5rem");
  }
  //css frameworks
}
