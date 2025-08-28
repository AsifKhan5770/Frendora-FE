import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from '../utils/api';
import MediaCarousel from '../components/MediaCarousel';

let HomePage = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPosts();
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

  return (
    <>
      {/* Hero Section */}
      <div className="container-fluid py-5 mt-5">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-4 fw-bold mb-4" style={{ color: 'white' }}>
                ✨ Welcome to Frendora
              </h1>
              <p className="lead mb-4" style={{ color: 'white' }}>
                Discover amazing stories, share your experiences, and connect with creators from around the world.
              </p>
              <div className="d-flex justify-content-center">
                <Link to="/create" className="btn btn-lg px-4 py-3 me-3 rounded-pill fw-semibold" style={{ backgroundColor: '#ff69b4', border: 'none', color: 'white' }}>
                  📝 Create Post
                </Link>
                <Link to="/posts" className="btn btn-lg px-4 py-3 rounded-pill fw-semibold" style={{ backgroundColor: '#ff69b4', border: 'none', color: 'white' }}>
                  🔍 Browse All
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        {/* Search Section */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 col-md-10">
            <div className="text-center mb-4">
              <h2 className="h3 fw-bold mb-3" style={{ color: 'white' }}>🔍 Search Posts</h2>
              <p style={{ color: 'white' }}>Find exactly what you're looking for</p>
            </div>
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
                      <h5 className="card-title fw-bold mb-2">
                        <Link
                          className="text-decoration-none"
                          to={`/detail/${i._id}`}
                          style={{ color: '#1a1a1a' }}
                        >
                          {i.title}
                        </Link>
                      </h5>
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
                  : 'Be the first to create an amazing post!'
                }
              </p>
              {!search && (
                <Link to="/create" className="btn btn-lg px-4 py-2 rounded-pill" style={{ backgroundColor: '#0095f6', border: 'none', color: 'white' }}>
                  Create Your First Post
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
