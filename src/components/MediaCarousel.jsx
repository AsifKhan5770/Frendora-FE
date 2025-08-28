import React, { useEffect, useRef } from 'react';
import { getUploadUrl } from '../utils/api';

const MediaCarousel = ({ media, postId, isDetail = false }) => {
  const carouselRef = useRef(null);

  useEffect(() => {
    // Initialize Bootstrap carousel with a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (carouselRef.current && window.bootstrap) {
        try {
          const carousel = new window.bootstrap.Carousel(carouselRef.current, {
            interval: 5000, // Auto-play every 5 seconds
            wrap: true, // Loop through slides
            pause: 'hover' // Pause on hover
          });

          return () => {
            // Cleanup carousel on unmount
            if (carousel) {
              carousel.dispose();
            }
          };
        } catch (error) {
          console.log('Carousel initialization error:', error);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [media]);

  if (!media || media.length === 0) {
    return null;
  }

  const carouselId = isDetail ? 'detail-carousel' : `carousel-${postId}`;

  return (
    <div className={`carousel slide ${isDetail ? '' : 'h-100'}`} 
         id={carouselId} 
         ref={carouselRef}
         data-bs-ride="carousel">
      
      <div className={`carousel-inner ${isDetail ? '' : 'h-100'}`}>
        {media.map((item, index) => (
          <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''} ${isDetail ? '' : 'h-100'}`}>
            {item.mimetype.startsWith('image/') ? (
                             <img 
                 src={getUploadUrl(item.filename)} 
                 alt={item.originalName}
                 className={`d-block w-100 ${isDetail ? '' : 'h-100'}`}
                 style={{ 
                   objectFit: 'contain',
                   backgroundColor: '#f8f9fa'
                 }}
               />
            ) : (
                             <video 
                 src={getUploadUrl(item.filename)} 
                 className={`d-block w-100 ${isDetail ? '' : 'h-100'}`}
                 style={{ 
                   objectFit: 'contain',
                   backgroundColor: '#f8f9fa'
                 }}
                 muted={!isDetail}
                 loop={!isDetail}
                 controls={isDetail}
               />
            )}
            
            {isDetail && (
              <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded">
                <small>{item.originalName}</small>
              </div>
            )}
          </div>
        ))}
      </div>

      {media.length > 1 && (
        <>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target={`#${carouselId}`}
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target={`#${carouselId}`}
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
          
          <div className="carousel-indicators">
            {media.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target={`#${carouselId}`}
                data-bs-slide-to={index}
                className={index === 0 ? 'active' : ''}
                aria-current={index === 0 ? 'true' : 'false'}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MediaCarousel;
