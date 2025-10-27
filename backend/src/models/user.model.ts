/**
 * User Model
 * Defines the User interface and validation functions
 */

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  lastLogin: Date;
}

/**
 * Validates user data
 * @param user - User object to validate
 * @returns true if valid, throws error otherwise
 */
export function validateUser(user: Partial<User>): boolean {
  if (!user.uid || typeof user.uid !== 'string' || user.uid.trim() === '') {
    throw new Error('User ID is required and must be a non-empty string');
  }

  if (!user.email || typeof user.email !== 'string' || user.email.trim() === '') {
    throw new Error('Email is required and must be a non-empty string');
  }

  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    throw new Error('Email must be a valid email address');
  }

  if (user.displayName !== undefined && typeof user.displayName !== 'string') {
    throw new Error('Display name must be a string');
  }

  if (user.photoURL !== undefined && typeof user.photoURL !== 'string') {
    throw new Error('Photo URL must be a string');
  }

  if (!user.createdAt || !(user.createdAt instanceof Date)) {
    throw new Error('Created at must be a valid Date');
  }

  if (!user.lastLogin || !(user.lastLogin instanceof Date)) {
    throw new Error('Last login must be a valid Date');
  }

  return true;
}

/**
 * Creates a new User object with default values
 * @param uid - User ID from Firebase Auth
 * @param email - User email
 * @param displayName - Optional display name
 * @param photoURL - Optional photo URL
 * @returns User object
 */
export function createUser(
  uid: string,
  email: string,
  displayName?: string,
  photoURL?: string
): User {
  const now = new Date();
  return {
    uid,
    email,
    displayName,
    photoURL,
    createdAt: now,
    lastLogin: now,
  };
}
