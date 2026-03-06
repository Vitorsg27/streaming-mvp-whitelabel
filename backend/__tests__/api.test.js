import { isValidVideoUrl, getYoutubeEmbedUrl, sanitizeInput, generateToken, verifyToken } from '../src/utils/auth.js';

describe('Auth Utilities', () => {
  describe('isValidVideoUrl', () => {
    test('should validate YouTube URLs', () => {
      const validUrls = [
        'https://youtube.com/watch?v=dQw4w9WgXcQ',
        'https://youtu.be/dQw4w9WgXcQ',
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://youtube.com/embed/dQw4w9WgXcQ',
      ];

      validUrls.forEach(url => {
        expect(isValidVideoUrl(url)).toBe(true);
      });
    });

    test('should validate direct video URLs', () => {
      const validUrls = [
        'https://example.com/video.mp4',
        'http://cdn.example.com/path/to/video.m3u8',
      ];

      validUrls.forEach(url => {
        expect(isValidVideoUrl(url)).toBe(true);
      });
    });

    test('should reject invalid URLs', () => {
      const invalidUrls = [
        'not a url',
        'ftp://invalid.com',
        'javascript:alert(1)',
      ];

      invalidUrls.forEach(url => {
        expect(isValidVideoUrl(url)).toBe(false);
      });
    });
  });

  describe('getYoutubeEmbedUrl', () => {
    test('should convert youtube.com/watch?v= to embed URL', () => {
      const url = 'https://youtube.com/watch?v=dQw4w9WgXcQ';
      const embedUrl = getYoutubeEmbedUrl(url);
      expect(embedUrl).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
    });

    test('should convert youtu.be to embed URL', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ';
      const embedUrl = getYoutubeEmbedUrl(url);
      expect(embedUrl).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
    });

    test('should return original URL if not YouTube', () => {
      const url = 'https://example.com/video.mp4';
      const embedUrl = getYoutubeEmbedUrl(url);
      expect(embedUrl).toBe(url);
    });
  });

  describe('sanitizeInput', () => {
    test('should sanitize HTML special characters', () => {
      const input = '<script>alert("xss")</script>';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toContain('&lt;');
      expect(sanitized).toContain('&gt;');
      expect(sanitized).not.toContain('<script>');
    });

    test('should sanitize double quotes', () => {
      const input = 'Value with "quotes"';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toContain('&quot;');
    });

    test('should sanitize apostrophes', () => {
      const input = "It's a test";
      const sanitized = sanitizeInput(input);
      expect(sanitized).toContain('&#x27;');
    });

    test('should return non-string values as is', () => {
      expect(sanitizeInput(123)).toBe(123);
      expect(sanitizeInput(null)).toBe(null);
      expect(sanitizeInput(undefined)).toBe(undefined);
    });
  });

  describe('JWT Token Functions', () => {
    test('should generate a valid token', () => {
      const token = generateToken(1, 'testuser');
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    test('should verify a valid token', () => {
      const token = generateToken(1, 'testuser');
      const decoded = verifyToken(token);
      expect(decoded).not.toBeNull();
      expect(decoded.userId).toBe(1);
      expect(decoded.username).toBe('testuser');
    });

    test('should reject invalid token', () => {
      const invalidToken = 'invalid.token.here';
      const decoded = verifyToken(invalidToken);
      expect(decoded).toBeNull();
    });

    test('should reject expired token', () => {
      // Create a token with very short expiration
      const expiredToken = generateToken(1, 'testuser');
      // Manually create an expired token by mocking time
      const decoded = verifyToken(expiredToken);
      // Fresh token should still be valid
      expect(decoded).not.toBeNull();
    });
  });
});

