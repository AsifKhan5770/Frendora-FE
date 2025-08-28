import { useState } from "react";
import { useNavigate } from "react-router-dom";

let CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file selection
  const handleFileChange = (e) => {
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

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Creating post with:');
      console.log('- selectedFiles:', selectedFiles);
      console.log('- filePreviews:', filePreviews);
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('author', formData.author);
      
      // Append all selected files
      selectedFiles.forEach((file, index) => {
        console.log(`Appending file ${index}:`, file.name, file.size, file.type);
        formDataToSend.append('media', file);
      });

      console.log('FormData entries:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      const res = await fetch("http://localhost:3001/api/posts", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend,
      });

      const result = await res.json();

      if (res.ok) {
        // Show success message with modern styling
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3';
        successDiv.style.zIndex = '9999';
        successDiv.innerHTML = '<i class="bi bi-check-circle me-2"></i>Post created successfully!';
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
          document.body.removeChild(successDiv);
        }, 3000);
        
        setFormData({ title: "", description: "", author: "" }); // reset form
        setSelectedFiles([]);
        setFilePreviews([]);
        navigate("/posts"); // redirect to home page
      } else {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
        errorDiv.style.zIndex = '9999';
        errorDiv.innerHTML = `<i class="bi bi-exclamation-triangle me-2"></i>${result.message || "Unknown error"}`;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
          document.body.removeChild(errorDiv);
        }, 5000);
      }
    } catch (err) {
      console.error(err);
      const errorDiv = document.createElement('div');
      errorDiv.className = 'alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3';
      errorDiv.style.zIndex = '9999';
      errorDiv.innerHTML = '<i class="bi bi-exclamation-triangle me-2"></i>Error while creating post';
      document.body.appendChild(errorDiv);
      
      setTimeout(() => {
        document.body.removeChild(errorDiv);
      }, 5000);
    }
  };

  return (
    <>
      <div className="container-fluid mt-5 pt-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card glass-card shadow-lg">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="gradient-text mb-2">Create New Post</h2>
                  <p className="text-muted">Share your story with the world</p>
                </div>
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
                            style={{ 
                              height: '200px', 
                              width: '100%',
                              objectFit: 'contain',
                              backgroundColor: '#f8f9fa'
                            }}
                          />
                        ) : (
                          <video 
                            src={preview.preview} 
                            className="card-img-top" 
                            style={{ 
                              height: '200px', 
                              width: '100%',
                              objectFit: 'contain',
                              backgroundColor: '#f8f9fa'
                            }}
                            controls
                          />
                        )}
                        <div className="card-body p-2">
                          <small className="text-muted">{preview.file.name}</small>
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

          <div className="text-center">
            <button type="submit" className="btn btn-primary btn-lg px-4">
              <i className="bi bi-plus-circle me-2"></i>
              Create Post
            </button>
          </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
