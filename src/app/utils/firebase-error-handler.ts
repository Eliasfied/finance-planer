export class FirebaseErrorHandler {
  static handleAuthError(error: any): Error {
    console.log(error.code);
    switch (error.code) {
      // Login errors
      case 'auth/invalid-credential':
        return new Error('Invalid email address or password');

      // Google auth errors
      case 'auth/popup-closed-by-user':
        return new Error('Google sign in was cancelled');
      case 'auth/popup-blocked':
        return new Error('Pop-up was blocked by the browser. Please allow pop-ups for this site');
      case 'auth/cancelled-popup-request':
        return new Error('Another sign in is in progress');

      // Registration errors
      case 'auth/email-already-in-use':
        return new Error('An account with this email already exists');
      case 'auth/weak-password':
        return new Error('Password should be at least 6 characters');

      // General errors
      case 'auth/network-request-failed':
        return new Error('Network error. Please check your connection');
      case 'auth/too-many-requests':
        return new Error('Too many attempts. Please try again later');
      case 'auth/internal-error':
        return new Error('An internal error occurred. Please try again');

      // Default error
      default:
        return new Error('An unexpected error occurred');
    }
  }
} 