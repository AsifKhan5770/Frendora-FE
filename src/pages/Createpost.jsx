import { useState } from "react";

let Createpost = () => {
  let [formData, setFormData] = useState({ title: "", description: "", author: "" });

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
      let res = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ Post added successfully!");
        setFormData({ title: "", description: "", author: "" }); // reset form
      } else {
        alert("❌ Failed to add post");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Error while adding post");
    }
  };

  return (
    <div className="container mt-5 pt-4 d-flex justify-content-center">
      <div className="card post-card shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-center mb-4 text-pink">
            Create New Post
          </h3>

          <form onSubmit={handleSubmit}>
            {/* Post Name */}
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

            {/* Description */}
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                rows="3"
                required
              ></textarea>
            </div>

            {/* Tags */}
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

            {/* Submit */}
            <div className="d-grid">
              <button type="submit" className="btn btn-pink">
                🚀 Add Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Createpost;