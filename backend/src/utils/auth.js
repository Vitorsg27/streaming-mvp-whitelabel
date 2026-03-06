import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

export function generateToken(userId, username, role = 'user') {
  return jwt.sign(
    { userId, username, role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function isValidVideoUrl(url) {
  // Check if it's a YouTube URL
  const youtubeRegex = /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/|youtu\.be\//;
  // Or any valid URL
  const urlRegex = /^(https?:\/\/)([a-zA-Z0-9-_.]+)+([.:][a-zA-Z0-9\-.]+)*\/?(.*)?$/;
  
  return youtubeRegex.test(url) || urlRegex.test(url);
}

export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function getYoutubeEmbedUrl(url) {
  let videoId = null;

  // youtube.com/watch?v=ID
  const match1 = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (match1) videoId = match1[1];

  // youtube.com/embed/ID
  const match2 = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (match2) videoId = match2[1];

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return url; // Return original URL if not YouTube
}
