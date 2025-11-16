export function JWTdecodePermissions(token: string): string[] {
  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);
    return payload.scope ? payload.scope.split(' ') : [];
  } catch (e) {
    console.error('Failed to decode JWT token:', e);
    return [];
  }
}
