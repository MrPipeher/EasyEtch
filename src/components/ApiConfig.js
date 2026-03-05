// src/components/ApiConfig.js
import { FIREBASE_AUTH } from './FirebaseConfig';

// Your Cloudflare Tunnel URL
export const SERVER_URL = 'https://server5001.acserver.org'; 

export const apiFetch = async (endpoint, options = {}) => {
  const url = `${SERVER_URL}${endpoint}`;
  
  // Grab the current logged-in user
  const user = FIREBASE_AUTH.currentUser;
  
  if (!user) {
    throw new Error('You must be logged in to do this.');
  }

  // Get their secure, temporary Firebase ID Token
  const idToken = await user.getIdToken();

  const headers = {
    'Content-Type': 'application/json',
    // Send the token as a Bearer Authorization header
    'Authorization': `Bearer ${idToken}`,
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Something went wrong');
  }

  return data;
};