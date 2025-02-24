import React, { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  src: string;
  ariaLabel?: string;
}

export const VideoPlayer = ({
  src,
  ariaLabel = "Chat video"
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleError = () => {
      console.error('Video failed to load:', src);
    };

    video.addEventListener('error', handleError);
    return () => video.removeEventListener('error', handleError);
  }, [src]);

  return (
    <div className="video-wrapper">
      <div className="video-container">
        <video
          ref={videoRef}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          aria-label={ariaLabel}
        />
      </div>

      <style jsx>{`
        .video-wrapper {
          width: 100%;
          padding: 0;
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .video-container {
          width: 100%;
          max-width: 300px;
          aspect-ratio: 16/9;
          background-color: #000;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          border-radius: 8px;
        }

        video {
          width: auto;
          height: 100%;
          max-height: 160px;
          aspect-ratio: 1/1;
          object-fit: contain;
        }

        @media (min-width: 640px) {
          .video-container {
            max-width: 280px;
          }

          video {
            max-height: 150px;
          }
        }
      `}</style>
    </div>
  );
}