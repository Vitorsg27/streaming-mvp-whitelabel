import React from 'react';

export function VideoPlayer({ url, title }) {
  // Check if it's a YouTube embed URL
  const isYouTube = url?.includes('youtube.com/embed');

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden shadow-lg">
      {isYouTube ? (
        <iframe
          width="100%"
          height="600"
          src={url}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <video
          width="100%"
          height="600"
          controls
          controlsList="nodownload"
          className="w-full"
        >
          <source src={url} type="video/mp4" />
          Seu navegador não suporta vídeo HTML5.
        </video>
      )}
    </div>
  );
}
