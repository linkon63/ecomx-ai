import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

// Edge-compatible token verification using jose
export async function verifyTokenEdge(token: string): Promise<JWTPayload | null> {
  try {
    console.log('verifyTokenEdge - JWT_SECRET:', JWT_SECRET);
    console.log('verifyTokenEdge - token length:', token.length);
    
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    
    console.log('verifyTokenEdge - success, payload:', payload);
    
    // Validate that the payload has the required properties
    if (payload && typeof payload === 'object' && 
        'userId' in payload && 'email' in payload && 'role' in payload) {
      return {
        userId: payload.userId as string,
        email: payload.email as string,
        role: payload.role as string
      };
    }
    
    return null;
  } catch (error) {
    console.log('verifyTokenEdge - error:', error);
    return null;
  }
}
