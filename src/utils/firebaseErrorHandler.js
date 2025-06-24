export const handleFirebaseError = (error) => {
  console.error('Firebase Error:', error);
  
  switch (error.code) {
    case 'PERMISSION_DENIED':
      return 'Access denied. Please make sure you are logged in and have the necessary permissions.';
    
    case 'auth/user-not-found':
      return 'User not found. Please check your email or sign up.';
    
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    
    case 'auth/email-already-in-use':
      return 'Email is already registered. Please login or use a different email.';
    
    case 'auth/invalid-email':
      return 'Invalid email address. Please check your email format.';
    
    case 'auth/weak-password':
      return 'Password is too weak. Please use a stronger password.';
    
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    
    case 'auth/operation-not-allowed':
      return 'Operation not allowed. Please contact support.';
    
    default:
      return 'An error occurred. Please try again later.';
  }
}; 