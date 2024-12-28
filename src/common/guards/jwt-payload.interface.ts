export interface JwtPayload {
    id: number;  // User's ID
    username: string;  // User's username (or any other data you encoded in the token)
    exp: number;  // Expiration time (in seconds)
  }
  