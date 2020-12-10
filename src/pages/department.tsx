import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Layout, { useAuth } from "../components/Layout";
import PostsTable from "../components/posts/postTable";

function Department() {
  const [userId, setUserId] = React.useState({});
  const [posts, setPosts] = React.useState([]);
  //const { uuid, userdept } = userId;

  const fetchData = async (id, uuid) => {
    try {
      const { data } = await axios.get(`/departments/${id}/${uuid}`);
      if (data) {
        setPosts(data);
      }
    } catch (error) {
      console.log("dept", error.message);
    }
  };
  React.useEffect(() => {
    setUserId(useAuth());
    const { uuid, userdept } = useAuth();
    fetchData("deptsposts", userdept);
  }, []);

  console.log("pppp", posts);
  return (
    <Layout>
      <PostsTable posts={posts} setTicks={(f) => f} userId={0} />
    </Layout>
  );
}
export default Department;
