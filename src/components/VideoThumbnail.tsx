'use client';

import { useState, useEffect, useRef } from 'react';

interface VideoThumbnailProps {
  videoUrl?: string;
  style?: React.CSSProperties;
}

export default function VideoThumbnail({ videoUrl, style }: VideoThumbnailProps) {
  const [thumbnailSrc, setThumbnailSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!videoUrl) {
      setIsLoading(false);
      return;
    }

    const generateThumbnail = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (!video || !canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw first frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to base64 image
      const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setThumbnailSrc(thumbnailDataUrl);
      setIsLoading(false);
    };

    const handleLoadedData = () => {
      // Seek to first frame and generate thumbnail
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    };

    const handleSeeked = () => {
      generateThumbnail();
    };

    const handleError = () => {
      setIsLoading(false);
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('seeked', handleSeeked);
      video.addEventListener('error', handleError);
      
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('seeked', handleSeeked);
        video.removeEventListener('error', handleError);
      };
    }
  }, [videoUrl]);

  if (!videoUrl) {
    return (
      <div style={{
        ...style,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '12px'
      }}>
        No Video
      </div>
    );
  }

  return (
    <div style={style}>
      {thumbnailSrc ? (
        <img 
          src={thumbnailSrc}
          alt="Video thumbnail"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          background: isLoading ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '12px'
        }}>
          {isLoading ? '📸 Loading...' : 'No Preview'}
        </div>
      )}
      
      {/* Hidden video and canvas for thumbnail generation */}
      <video
        ref={videoRef}
        src={videoUrl}
        style={{ display: 'none' }}
        muted
        preload="metadata"
        crossOrigin="anonymous"
      />
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
    </div>
  );
}