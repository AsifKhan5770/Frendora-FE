import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

let Listposts = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:3001/api/posts");
      const posts = await res.json();
      setData(posts);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearch(query);

    if (!query.trim()) {
      fetchPosts();
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3001/api/posts/search?query=${query}`
      );
      const posts = await res.json();
      setData(posts);
    } catch (err) {
      console.error("Error searching posts:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`http://localhost:3001/api/posts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
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
      <div className="container-fluid mt-5 pt-4">
        {/* Top section: Search + Button */}
        <div className="row mb-3">
          <div className="col-12 col-md-6 mb-2 mb-md-0">
            <input
              type="text"
              placeholder="Search by title or author..."
              className="form-control w-100 rounded-pill"
              value={search}
              onChange={handleSearch}
            />
          </div>
          <div className="col-12 col-md-6">
            <Link to="/create" className="btn btn-pink w-100">
              Create New Post
            </Link>
          </div>
        </div>

        {/* Cards grid */}
        <div className="row g-3">
          {[...data].reverse().map((i) => (
            <div className="col-12 col-md-6 col-lg-3" key={i._id}>
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">
                    <Link
                      className="page-link text-pink"
                      to={`/detail/${i._id}`}
                    >
                      {i.title}
                    </Link>
                  </h5>
                  <h6 className="card-subtitle mb-2 text-body-secondary text-bold">
                    By <strong>{i.author}</strong>
                  </h6>
                  <p className="card-text flex-grow-1">{i.description}</p>
                  <div className="mt-auto">
                    <Link to={`/edit/${i._id}`} className="me-2">
                      <i className="bi bi-pen" />
                    </Link>
                    <span
                      role="button"
                      style={{ cursor: "pointer", color: "red" }}
                      onClick={() => handleDelete(i._id)}
                    >
                      <i className="bi bi-trash" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Listposts;
