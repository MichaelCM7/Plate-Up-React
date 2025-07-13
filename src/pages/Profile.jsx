import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { useAuth } from '../context/AuthContext'; // Import your AuthContext
import { db } from '../firebaseConfig'; // Import Firestore instance
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore functions

import '../styles/Profile.css'; // Import your specific styles for the Profile page

const Profile = () => {
    const { currentUser, loading: authLoading, logout } = useAuth(); // Get currentUser, authLoading, and logout from context
    const [userProfileData, setUserProfileData] = useState(null); // State for additional Firestore data
    const [dbLoading, setDbLoading] = useState(true); // Loading state for DB fetch
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate hook

    useEffect(() => {
        // If AuthContext is still loading, wait
        if (authLoading) {
            return;
        }

        // If no user is logged in after auth context loads, redirect to public home/login
        if (!currentUser) {
            navigate('/index'); // Redirect to your public homepage/login page
            return;
        }

        // User is logged in, now fetch their specific profile data from Firestore
        const fetchUserProfile = async () => {
            setDbLoading(true);
            setError(null);
            try {
                // Assuming you store user data in a 'users' collection with UID as doc ID
                const userDocRef = doc(db, "users", currentUser.uid);
                const docSnap = await getDoc(userDocRef);

                if (docSnap.exists()) {
                    setUserProfileData(docSnap.data());
                    console.log("User profile data from Firestore:", docSnap.data());
                } else {
                    // Document does not exist for this user, fallback to basic auth data
                    setUserProfileData({
                        firstName: currentUser.displayName?.split(' ')[0] || '',
                        lastName: currentUser.displayName?.split(' ')[1] || '',
                        email: currentUser.email,
                        preferences: [], // Default empty array for preferences
                        role: 'Standard Member' // default role
                    });
                    console.warn("No additional profile document found in Firestore for user:", currentUser.uid);
                }
            } catch (err) {
                console.error("Error fetching user profile from Firestore:", err);
                setError("Failed to load your profile data.");
            } finally {
                setDbLoading(false);
            }
        };

        fetchUserProfile();

    }, [currentUser, authLoading, navigate]); // Depend on currentUser, authLoading, and navigate

    const handleSignOut = async () => {
        try {
            await logout(); // Use the logout function from context
            alert("Successfully logged out!");
            // Redirection will happen via useEffect after currentUser becomes null
        } catch (error) {
            console.error("Error signing out:", error.message);
            alert("Failed to sign out.");
        }
    };

    // --- Render Logic ---
    if (authLoading || dbLoading) {
        return (
            <div className="profile-container">
                <p>Loading profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-container">
                <p className="error-message">{error}</p>
                <Link to="/index">Go to Home/Login</Link>
            </div>
        );
    }

    // If currentUser is null after loading, means not logged in
    if (!currentUser) {
        return (
            <div className="profile-container">
                <p>You need to be logged in to view this page.</p>
                <Link to="/index">Log In</Link>
            </div>
        );
    }

    // If we reach here, currentUser exists and profile data (or basic fallback) is loaded
    const displayFirstName = userProfileData?.firstName || currentUser.displayName?.split(' ')[0] || '';
    const displayLastName = userProfileData?.lastName || currentUser.displayName?.split(' ')[1] || '';
    const displayEmail = userProfileData?.email || currentUser.email || 'N/A';
    const displayUsername = userProfileData?.username || currentUser.displayName || displayEmail.split('@')[0];
    const displayRole = userProfileData?.role || 'Standard Member';
    const displayPreferences = userProfileData?.preferences || [];

    // Get initials from first name and last name, or email if names are not available
    const getInitials = () => {
        if (displayFirstName && displayLastName) {
            return `${displayFirstName[0]}${displayLastName[0]}`.toUpperCase();
        }
        if (displayUsername) {
            return displayUsername[0].toUpperCase();
        }
        return '';
    };

    return (
        <div>
            {/* Header */}
            <header className="header">
                <div className="nav-container">
                    <div className="logo">
                        <Link to="/HomePage_SignedIn" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img src="/icons/Logo.png" alt="Logo" className="logo-img" style={{height: '38px', width: '38px'}} />
                            <span>PLATE UP</span>
                        </Link>
                    </div>
                    <nav>
                        <ul className="nav-links">
                            <li><Link to="/HomePage_SignedIn">Home</Link></li>
                            <li><Link to="/recipe">Recipes</Link></li>
                            <li><Link to="/Meal-Planner">Meal Plans</Link></li>
                            <li><Link to="/Favourites">Favourites</Link></li>
                            <li><Link to="/AboutUs-S">About</Link></li>
                        </ul>
                    </nav>
                    <div className="auth-buttons">
                        <button onClick={handleSignOut} className="btn-signin">Log Out</button>
                        <Link to="/Profile" className="btn-started active">Profile</Link> {/* Profile is active on this page */}
                    </div>
                </div>
            </header>

            {/* Profile Main */}
            <main className="profile-main">
                <h1 className="profile-title">Profile</h1>
                <div className="profile-card">
                    <div className="profile-picture-section">
                        <div className="profile-initials-wrapper" title="Online">
                            {/* Render photoURL if available, otherwise initials */}
                            {currentUser.photoURL ? (
                                <img src={currentUser.photoURL} alt="Profile" className="profile-avatar-img" />
                            ) : (
                                <div className="profile-initials">{getInitials()}</div>
                            )}
                        </div>
                        <div className="profile-user-details">
                            <span className="profile-user-name">{displayUsername}</span>
                            <span className="profile-user-role">{displayRole}</span>
                        </div>
                    </div>
                    <div className="profile-info-section">
                        <h2>Welcome, <span className="profile-highlight">{displayFirstName || 'User'}</span></h2>
                        <div className="profile-info-list">
                            <div><strong>First Name</strong> {displayFirstName || 'N/A'}</div>
                            <div><strong>Last Name</strong> {displayLastName || 'N/A'}</div>
                            <div><strong>Email</strong> {displayEmail}</div>
                        </div>
                        <h2>Dietary Preferences</h2>
                        <div className="profile-preferences-list">
                            {displayPreferences.length > 0 ? (
                                displayPreferences.map((pref, index) => (
                                    <span key={index} className="preference-tag">{pref}</span>
                                ))
                            ) : (
                                <p>No preferences set. Go to "Edit Profile" to add some!</p>
                            )}
                        </div>
                        <Link to="/edit-profile" className="btn btn-edit-profile">Edit Profile</Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-container">
                    <div>
                        <div className="footer-brand">
                            <Link to="/HomePage_SignedIn" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <img src="/icons/Logo.png" alt="Logo" className="logo-img" style={{height: '38px', width: '38px'}} />
                                <span>PLATE UP</span>
                            </Link>
                        </div>
                        <p className="footer-description">
                            Simplify your healthy eating through personalized meal planning, nutritious recipe discovery, and organized shopping lists.
                        </p>
                    </div>
                    <div className="footer-section">
                        <h3>Features</h3>
                        <ul className="footer-links">
                            <li>
                                <Link to="/recipe" style={{textDecoration: 'none', color: '#a0aec0'}}>
                                    Recipe Search
                                </Link>
                            </li>
                            <li>
                                <Link to="/Meal-Planner" style={{textDecoration: 'none', color: '#a0aec0'}}>
                                    Meal Planning
                                </Link>
                            </li>
                            <li>
                                <Link to="/Shopping-list" style={{textDecoration: 'none', color: '#a0aec0'}}>
                                    Shopping Lists
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Support</h3>
                        <ul className="footer-links">
                            <li><a href="mailto:example@gmail.com">Email: example@gmail.com</a></li>
                            <li><a href="tel:+254715340778">Call: 0715 340 778</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2025 Plate Up. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Profile;