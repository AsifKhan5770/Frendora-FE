import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

let Detailposts = () => {
  let [data, setData] = useState(null);
  let { id } = useParams();  // 👈 this must give you "68a2c404b4c689e82d3ddca9"

  useEffect(() => {
    if (!id) return; // avoid fetch with undefined
    let fetchData = async () => {
      try {
        let res = await fetch(`http://localhost:3001/api/posts/${id}`);
        let post = await res.json();
        setData(post);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <>
      <h1>Detail posts</h1>
      {data ? (
        <ul key={data._id}>
          <li>{data.title}</li>
          <li>{data.description}</li>
          <li>{data.author}</li>
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};

export default Detailposts;