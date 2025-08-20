import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'

let Listposts = () => {
  let [data, setData] = useState([]);

  useEffect(() => {
    let fetchData = async () => {
      let res = await fetch("http://localhost:3001/api/posts");
      let data = await res.json();
      console.log(data);
      setData(data);
    };
    fetchData();
  }, []);

  // ✅ Delete post by id
  let handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      let res = await fetch(`http://localhost:3001/api/posts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Remove post from local state
        setData((prev) => prev.filter((item) => item._id !== id));
      } else {
        console.error("Failed to delete post");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <>
      <h1>List posts</h1>
<div className="table-responsive">
      <table className="table table-striped table-bordered table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">S. No.</th>
            <th scope="col">Post Title</th>
            <th scope="col">Description</th>
            <th scope="col">Author</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[...data].reverse().map((i, index) => (
            <tr key={i._id}>
              <th scope="row">{index + 1}</th>
              <td>
                <Link className="page-link" to={`/detail/${i._id}`}>{i.title}</Link>
              </td>
              <td>{i.description}</td>
              <td>{i.author}</td>
              <td>
                <Link to={`/edit/${i._id}`}>
                  <i className="bi bi-pen" />
                </Link> &nbsp;
                <span
                  role="button"
                  style={{ cursor: "pointer", color: "red" }}
                  onClick={() => handleDelete(i._id)}
                >
                  <i className="bi bi-trash" />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </>
  );
};
export default Listposts;
