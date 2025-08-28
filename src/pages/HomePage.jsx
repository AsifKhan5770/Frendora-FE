import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { apiFetch, isAuthenticated } from '../utils/api';
import MediaCarousel from '../components/MediaCarousel';

let HomePage = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRefs = useRef({});

  useEffect(() => {
    fetchPosts();
    // Check if user is authenticated (admin)
    setIsAdmin(isAuthenticated());
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await apiFetch("posts");
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
      const res = await apiFetch(
        `posts/search?query=${query}`
      );
      const posts = await res.json();
      setData(posts);
    } catch (err) {
      console.error("Error searching posts:", err);
    }
  };

  // Admin function to delete posts
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await apiFetch(`posts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setData((prev) => prev.filter((item) => item._id !== id));
        setOpenMenuId(null); // Close menu after deletion
      } else {
        console.error("Failed to delete post");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // Toggle menu for a specific post
  const toggleMenu = (postId) => {
    setOpenMenuId(openMenuId === postId ? null : postId);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenuId && !menuRefs.current[openMenuId]?.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  return (
    <>
      <style>
        {`
          .menu-item:hover {
            background-color: #f8f9fa !important;
          }
          .menu-item-edit:hover {
            color: #0d6efd !important;
          }
          .menu-item-delete:hover {
            background-color: #f8d7da !important;
            color: #dc3545 !important;
          }
        `}
      </style>
      {/* Hero Section */}
      <div className="container-fluid mt-5 pt-5">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              {isAdmin ? (
                <>
                  <h1 className="display-4 fw-bold mb-4" style={{ color: 'white' }}>
                    🛠️ Admin Dashboard
                  </h1>
                  <p className="lead mb-4" style={{ color: 'white' }}>
                    Manage all posts, create new content, and oversee your Frendora platform.
                  </p>
                </>
              ) : (
                <>
                  <h1 className="display-4 fw-bold" style={{ color: 'white' }}>
                    ✨ Welcome to Frendora
                  </h1>
                  <p className="lead mb-4" style={{ color: 'white' }}>
                    Discover amazing stories and experiences.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mb-5">
        {/* Search Section */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 col-md-10">
            <div className="position-relative">
              <input
                type="text"
                placeholder="Search by title, author, or description..."
                className="form-control form-control-lg rounded-pill shadow-sm px-4 py-3"
                style={{ fontSize: '1.1rem', border: '2px solid #dbdbdb', backgroundColor: '#ffffff' }}
                value={search}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        {/* Results Count */}
        {data.length > 0 && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center">
                <h3 className="h4 fw-semibold mb-0" style={{ color: '#1a1a1a' }}>
                  📚 {data.length} {data.length === 1 ? 'Post' : 'Posts'} Found
                </h3>
                {search && (
                  <button 
                    className="btn btn-sm rounded-pill px-3"
                    style={{ backgroundColor: '#fafafa', color: '#737373', border: '1px solid #dbdbdb' }}
                    onClick={() => { setSearch(''); fetchPosts(); }}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Posts Grid */}
        {data.length > 0 ? (
          <div className="row g-4">
            {[...data].reverse().map((i) => (
              <div className="col-12 col-md-6 col-lg-4" key={i._id}>
                <div className="card h-100 shadow-sm border-0 rounded-3 overflow-hidden" style={{ border: '1px solid #dbdbdb', backgroundColor: '#ffffff' }}>
                  {i.media && i.media.length > 0 && (
                    <div className="card-img-top position-relative" style={{ height: '220px', overflow: 'hidden' }}>
                      <MediaCarousel media={i.media} postId={i._id} />
                    </div>
                  )}
                  <div className="card-body d-flex flex-column p-4">
                                         <div className="mb-3">
                       <div className="d-flex justify-content-between align-items-start mb-2">
                         <h5 className="card-title fw-bold mb-0 flex-grow-1">
                           <Link
                             className="text-decoration-none"
                             to={`/detail/${i._id}`}
                             style={{ color: '#1a1a1a' }}
                           >
                             {i.title}
                           </Link>
                         </h5>
                         {/* Admin Controls - Only show if user is authenticated */}
                         {isAdmin && (
                           <div className="position-relative ms-2">
                             <button
                               className="btn btn-sm btn-outline-secondary"
                               onClick={() => toggleMenu(i._id)}
                               title="More options"
                               style={{ 
                                 minWidth: '32px', 
                                 fontSize: '18px',
                                 lineHeight: '1',
                                 padding: '4px 8px'
                               }}
                             >
                               ⋯
                             </button>
                             
                             {/* Dropdown Menu */}
                             {openMenuId === i._id && (
                               <div 
                                 ref={el => menuRefs.current[i._id] = el}
                                 className="position-absolute end-0 mt-1 bg-white border rounded shadow-lg"
                                 style={{ zIndex: 1000, minWidth: '120px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                               >
                                 <Link 
                                   to={`/edit/${i._id}`}
                                   className="d-block px-3 py-2 text-decoration-none text-dark border-bottom menu-item menu-item-edit"
                                   style={{ fontSize: '14px', transition: 'all 0.2s ease' }}
                                   onClick={() => setOpenMenuId(null)}
                                 >
                                   ✏️ Edit
                                 </Link>
                                 <button
                                   className="d-block w-100 text-start px-3 py-2 border-0 bg-transparent text-danger menu-item menu-item-delete"
                                   style={{ fontSize: '14px', transition: 'all 0.2s ease' }}
                                   onClick={() => handleDelete(i._id)}
                                 >
                                   🗑️ Delete
                                 </button>
                               </div>
                             )}
                           </div>
                         )}
                       </div>
                       <div className="d-flex align-items-center mb-2">
                         <span className="badge rounded-pill px-3 py-2 me-2" style={{ backgroundColor: '#fafafa', color: '#737373', border: '1px solid #dbdbdb' }}>
                           👤 {i.author}
                         </span>
                         <small style={{ color: '#8e8e8e' }}>
                           {new Date(i.createdAt).toLocaleDateString()}
                         </small>
                       </div>
                     </div>
                    <p className="card-text flex-grow-1 mb-3" style={{ lineHeight: '1.6', color: '#737373' }}>
                      {i.description.length > 120 
                        ? `${i.description.substring(0, 120)}...` 
                        : i.description
                      }
                    </p>
                                         <div className="mt-auto">
                       <div className="d-flex justify-content-center">
                         <Link 
                           to={`/detail/${i._id}`}
                           className="btn rounded-pill px-4 py-2 fw-semibold"
                           style={{ backgroundColor: '#0095f6', border: 'none', color: 'white' }}
                         >
                           Read More →
                         </Link>
                       </div>
                     </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="row justify-content-center">
            <div className="col-lg-6 text-center py-5">
              <div className="mb-4">
                <i className="bi bi-inbox display-1" style={{ color: '#dbdbdb' }}></i>
              </div>
              <h3 className="h4 fw-semibold mb-3" style={{ color: '#1a1a1a' }}>
                {search ? 'No posts found' : 'No posts yet'}
              </h3>
              <p className="mb-4" style={{ color: '#737373' }}>
                {search 
                  ? `No posts match your search for "${search}"`
                  : isAdmin ? 'Create your first post to get started!' : 'Be the first to create an amazing post!'
                }
              </p>
              {!search && (
                <div className="d-flex gap-3 justify-content-center">
                  {isAdmin ? (
                    <Link to="/create" className="btn btn-lg px-4 py-2 rounded-pill" style={{ backgroundColor: '#0095f6', border: 'none', color: 'white' }}>
                      Create Your First Post
                    </Link>
                  ) : (
                    <>
                      <Link to="/login" className="btn btn-lg px-4 py-2 rounded-pill" style={{ backgroundColor: '#0095f6', border: 'none', color: 'white' }}>
                        🔐 Login to Create Posts
                      </Link>
                      <Link to="/signup" className="btn btn-lg px-4 py-2 rounded-pill" style={{ backgroundColor: '#ff69b4', border: 'none', color: 'white' }}>
                        ✨ Sign Up to Join
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
