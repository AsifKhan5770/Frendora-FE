import { useState } from "react";
import { useNavigate } from "react-router-dom";

let Createpost = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
  });
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ Post added successfully!");
        setFormData({ title: "", description: "", author: "" }); // reset form
        navigate("/"); // redirect to home page
      } else {
        alert(`❌ Failed to add post: ${result.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error while adding post");
    }
  };

  return (
    <>
      <div className="container-fluid mt-5 pt-4">
        <h2 className="text-center">Create Post</h2>
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
            Create Post
          </button>
        </form>
      </div>
    </>
  );
};

export default Createpost;
