import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authenticatedFetch, getUploadUrl } from '../utils/api';
import config from '../config/config';

let EditPost = () => {
  let [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
    media: [],
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [existingMediaToKeep, setExistingMediaToKeep] = useState([]); // Track existing media to keep

  let { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    let fetchData = async () => {
      try {
        let res = await authenticatedFetch(`posts/${id}`);
        let post = await res.json();
        setFormData(post);
        if (post.media && post.media.length > 0) {
          const existingPreviews = post.media.map(media => ({
            file: null,
            preview: getUploadUrl(media.filename),
            type: media.mimetype.startsWith('image/') ? 'image' : 'video',
            originalName: media.originalName,
            filename: media.filename, // Store filename to identify existing media
            mimetype: media.mimetype,
            size: media.size
          }));
          setFilePreviews(existingPreviews);
          setExistingMediaToKeep([...post.media]); // Initially keep all existing media
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
          type: file.type.startsWith('image/') ? 'image' : 'video',
          originalName: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove file from selection (either new or existing)
  const removeFile = (index) => {
    const previewToRemove = filePreviews[index];
    
    if (previewToRemove.file) {
      // Removing a newly selected file
      setSelectedFiles(prev => prev.filter(file => file !== previewToRemove.file));
    } else {
      // Removing an existing file - remove from existingMediaToKeep
      setExistingMediaToKeep(prev => prev.filter(media => media.filename !== previewToRemove.filename));
    }
    
    // Remove from previews
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

      // Append existing media that should be kept
      existingMediaToKeep.forEach(media => {
        formDataToSend.append('existingMedia', JSON.stringify(media));
      });

      let res = await fetch(`${config.API_BASE_URL}/posts/${id}`, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formDataToSend,
      });

      if (res.ok) {
        alert("✅ post updated successfully!");
        navigate("/"); // redirect back to list
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
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h2 className="text-center mb-4">✏️ Edit</h2>
            
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
                              <small className="text-muted">{preview.originalName}</small>
                              {!preview.file && (
                                <small className="text-muted d-block">(Existing file)</small>
                              )}
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

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-success btn-lg">
                    💾 Update Post
                  </button>
                </div>
              </form>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPost;
