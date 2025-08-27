import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authenticatedFetch } from '../utils/api';

let EditPost = () => {
  let [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    media: [],
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);

  let { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    let fetchData = async () => {
      try {
        let res = await authenticatedFetch(`http://localhost:3001/api/posts/${id}`);
        let post = await res.json();
        setFormData(post); // ✅ directly populate formData
        if (post.media && post.media.length > 0) {
          const existingPreviews = post.media.map(media => ({
            file: null,
            preview: `http://localhost:3001/uploads/${media.filename}`,
            type: media.mimetype.startsWith('image/') ? 'image' : 'video',
            originalName: media.originalName
          }));
          setFilePreviews(existingPreviews);
        }
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

  // Handle file selection
  let handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    if (validFiles.length + selectedFiles.length > 5) {
      alert('Maximum 5 files allowed!');
      return;
    }
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
    
    // Create previews for new files
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreviews(prev => [...prev, {
          file: file,
          preview: reader.result,
          type: file.type.startsWith('image/') ? 'image' : 'video'
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove file from selection
  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // ✅ Handle form submit
  let handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('author', formData.author);
      
      // Append all selected files
      selectedFiles.forEach(file => {
        formDataToSend.append('media', file);
      });

      let res = await fetch(`http://localhost:3001/api/posts/${id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend,
      });

      if (res.ok) {
        alert("✅ post updated successfully!");
        navigate("/posts"); // redirect back to list
      } else {
        const errorData = await res.json();
        console.error('Update failed:', errorData);
        alert(`❌ Failed to update post: ${errorData.message || 'Unknown error'}`);
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

            <div className="mb-3">
              <label className="form-label">Media Files (Optional - Max 5 files)</label>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
                className="form-control"
              />
              <small className="text-muted">Supported: Images and Videos (Max 10MB each)</small>
              
              {filePreviews.length > 0 && (
                <div className="mt-3">
                  <h6>Selected Files:</h6>
                  <div className="row">
                    {filePreviews.map((preview, index) => (
                      <div key={index} className="col-md-3 mb-2 position-relative">
                        <div className="card">
                          {preview.type === 'image' ? (
                            <img 
                              src={preview.preview} 
                              alt={`Preview ${index + 1}`} 
                              className="card-img-top" 
                              style={{ height: '150px', objectFit: 'cover' }}
                            />
                          ) : (
                            <video 
                              src={preview.preview} 
                              className="card-img-top" 
                              style={{ height: '150px', objectFit: 'cover' }}
                              controls
                            />
                          )}
                          <div className="card-body p-2">
                            <small className="text-muted">{preview.originalName || preview.file?.name}</small>
                          </div>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                            onClick={() => removeFile(index)}
                            style={{ zIndex: 1 }}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
