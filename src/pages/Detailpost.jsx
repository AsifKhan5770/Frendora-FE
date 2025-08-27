import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { authenticatedFetch } from '../utils/api';
import MediaCarousel from '../components/MediaCarousel';

let DetailPost = () => {
  const [data, setData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await authenticatedFetch(`http://localhost:3001/api/posts/${id}`);
        const post = await res.json();
        setData(post);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: "2rem",
      }}
    >
      {data ? (
        <div className="card shadow-lg w-100" style={{ maxWidth: "900px" }}>
          {data.media && data.media.length > 0 && (
            <div className="card-img-top">
              <MediaCarousel media={data.media} isDetail={true} />
            </div>
          )}
          <div className="card-body">
            <h1 className="card-title text-pink mb-3">{data.title}</h1>
            <h6 className="card-subtitle mb-3 text-muted">
              By <strong>{data.author}</strong>
            </h6>
            <p className="card-text">{data.description}</p>
            <div className="mt-4">
              <Link to="/" className="btn text-pink">
                ← Back to Posts
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center">Loading...</p>
      )}
    </div>
  );
};

export default DetailPost;
