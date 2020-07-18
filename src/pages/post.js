import { withRouter, useRouter } from "next/router";
import Layout from "../components/Layout";

const Post = ({ router }) => {
  const { query } = useRouter();
  console.log(query);
  return (
    <Layout>
      <h3>Issue</h3>
      <p> Lorem ipsum</p>
      <small>By Vince.</small>
    </Layout>
  );
};

export default Post;
