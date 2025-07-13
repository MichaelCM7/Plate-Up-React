import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, db } from '../firebaseConfig'; // Ensure db is imported if you're setting user profiles during signup/login
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    onAuthStateChanged,
    updateProfile, // Import updateProfile if you want to set displayName/photoURL directly
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Import Firestore functions

// Create the context for authentication
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // To track if auth state is being loaded

  // Firebase Authentication functions
  const signup = async (email, password, additionalData = {}) => { // Added additionalData for flexibility
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Optionally update user's profile with display name or photo URL
        if (additionalData.displayName || additionalData.photoURL) {
            await updateProfile(user, {
                displayName: additionalData.displayName || null,
                photoURL: additionalData.photoURL || null
            });
        }

        // Store additional user data in Firestore
        // This is crucial for the Profile.jsx to retrieve full profile details
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            createdAt: new Date(),
            ...additionalData // Spread any additional data passed during signup
        }, { merge: true }); // Use merge: true to avoid overwriting if doc already exists

        setCurrentUser(user); // Update currentUser with potentially updated display name
        return userCredential;
    } catch (error) {
        throw error; // Re-throw to be handled by the component calling signup
    }
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // Effect to listen for authentication state changes
  useEffect(() => {
    // onAuthStateChanged returns an unsubscribe function
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // user will be null if logged out, or a user object if logged in
      setLoading(false); // Auth state has been loaded
    });

    // Cleanup subscription on component unmount
    return unsubscribe;
  }, []); // Empty dependency array means this runs once on mount

  // Value to provide to consumers of this context
  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    loading // Expose loading state
  };

  // Render the AuthContext provider with the value
  // If loading is true, we don't render children to avoid showing UI before auth state is known
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};