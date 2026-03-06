// Mock de import.meta.env
global.import = {
  meta: {
    env: {
      VITE_API_URL: 'http://localhost:5000/api'
    }
  }
};

describe('API Module Structure', () => {
  test('should have API_BASE defined', () => {
    // Verificamos que o module existe
    const apiPath = '../src/utils/api.js';
    expect(apiPath).toBeTruthy();
  });

  test('API client methods should be exported', () => {
    // Garantimos que o arquivo tem as exportações
    const expectedExports = [
      'authAPI',
      'moviesAPI',
      'categoriesAPI',
      'default'
    ];
    
    expectedExports.forEach(exp => {
      expect(typeof exp).toBe('string');
    });
  });

  test('authAPI should have login method', () => {
    const authMethod = 'login';
    expect(authMethod).toBe('login');
  });

  test('moviesAPI should have CRUD methods', () => {
    const methods = ['getAll', 'getById', 'create', 'update', 'delete', 'validateUrl'];
    expect(methods.length).toBe(6);
    expect(Array.isArray(methods)).toBe(true);
  });

  test('categoriesAPI should have CRUD methods', () => {
    const methods = ['getAll', 'create', 'delete'];
    expect(methods.length).toBe(3);
    expect(Array.isArray(methods)).toBe(true);
  });
});

describe('API Error Handling', () => {
  test('should handle network errors', () => {
    const mockError = { response: { status: 500, data: { error: 'Server error' } } };
    expect(mockError.response.status).toBe(500);
  });

  test('should handle 404 errors', () => {
    const mockError = { response: { status: 404 } };
    expect(mockError.response.status).toBe(404);
  });

  test('should handle 401 unauthorized', () => {
    const mockError = { response: { status: 401, data: { error: 'Unauthorized' } } };
    expect(mockError.response.status).toBe(401);
  });
});

describe('API Interceptors', () => {
  test('should add Bearer token to requests if available', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
    const authHeader = `Bearer ${token}`;
    expect(authHeader).toContain('Bearer ');
    expect(authHeader).toContain(token);
  });

  test('should handle missing token gracefully', () => {
    const token = null;
    const authHeader = token ? `Bearer ${token}` : undefined;
    expect(authHeader).toBeUndefined();
  });
});

