import { withRouter } from "next/router";
import Layout from "../components/Layout";
const Post = ({ router }) => {
  return (
    <Layout>
      <h3>{router.query.title}</h3>
      <p> Lorem ipsum</p>
      <small>By Vince.</small>
    </Layout>
  );
};

export default withRouter(Post);
