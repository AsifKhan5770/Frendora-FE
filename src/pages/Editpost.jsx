import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

let EditPost = () => {
  let [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
  });

  let { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    let fetchData = async () => {
      try {
        let res = await fetch(`http://localhost:3001/api/posts/${id}`);
        let post = await res.json();
        setFormData(post); // ✅ directly populate formData
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchData();
  }, [id]);

  // ✅ Handle input change
  let handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Handle form submit
  let handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res = await fetch(`http://localhost:3001/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ post updated successfully!");
        navigate("/posts"); // redirect back to list
      } else {
        alert("❌ Failed to update post");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error while updating post");
    }
  };

  return (
    <>
      <div className="container-fluid mt-5 pt-4">
        <h2 className="text-center">Edit Post</h2>
        {formData ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Post Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Author</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <button type="submit" className="btn btn-pink">
              Update post
            </button>
          </form>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

export default EditPost;
