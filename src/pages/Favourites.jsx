import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import '../styles/Favourites.css'; // Your specific styles for Favourites page

const Favourites = () => {
    const [favourites, setFavourites] = useState([]);
    const [stats, setStats] = useState({
        totalFavourites: 0,
        totalCookTime: 0
    });

    const navigate = useNavigate();
    const location = useLocation(); // Hook to access navigation state

    // Load favourites from localStorage on initial mount
    useEffect(() => {
        try {
            const storedFavourites = localStorage.getItem('userFavourites');
            if (storedFavourites) {
                const parsedFavourites = JSON.parse(storedFavourites);
                setFavourites(parsedFavourites);
                updateStats(parsedFavourites);
            }
        } catch (e) {
            console.error("Failed to load favourites from local storage:", e);
        }
    }, []);

    // Effect to handle incoming recipe data from navigation state
    useEffect(() => {
        if (location.state && location.state.toggledRecipeId) {
            const { toggledRecipeId, isFavorited, recipeData } = location.state;

            setFavourites(prevFavourites => {
                let newFavourites;
                if (isFavorited && recipeData) {
                    // Add to favorites if it's not already there
                    if (!prevFavourites.some(fav => fav.id === toggledRecipeId)) {
                        newFavourites = [...prevFavourites, {
                            id: recipeData.id,
                            title: recipeData.title,
                            image: recipeData.image,
                            readyInMinutes: recipeData.readyInMinutes,
                            servings: recipeData.servings
                        }];
                    } else {
                        newFavourites = prevFavourites; // Recipe already exists
                    }
                } else if (!isFavorited) {
                    // Remove from favorites
                    newFavourites = prevFavourites.filter(fav => fav.id !== toggledRecipeId);
                } else {
                    newFavourites = prevFavourites; // No action needed
                }

                // Update localStorage and stats
                localStorage.setItem('userFavourites', JSON.stringify(newFavourites));
                updateStats(newFavourites);
                return newFavourites;
            });

            // Clear state to prevent re-adding on subsequent renders
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, navigate]);


    // Function to recalculate stats whenever favourites change
    const updateStats = (currentFavourites) => {
        const totalFavs = currentFavourites.length;
        const totalTime = currentFavourites.reduce((sum, recipe) => sum + (recipe.readyInMinutes || 0), 0);
        const totalHours = totalTime / 60;

        setStats({
            totalFavourites: totalFavs,
            totalCookTime: parseFloat(totalHours.toFixed(1))
        });
    };

    // Function to remove a recipe from local favourites
    const removeFavouriteLocally = (recipeId) => {
        setFavourites(prevFavourites => {
            const updatedFavourites = prevFavourites.filter(recipe => recipe.id !== recipeId);
            localStorage.setItem('userFavourites', JSON.stringify(updatedFavourites));
            updateStats(updatedFavourites);
            return updatedFavourites;
        });
    };

    // Helper for programmatic navigation (e.g., for buttons that trigger actions before navigating)
    const handleNavigation = (path) => {
        console.log(`Navigating to: ${path}`);
        navigate(path);
    };

    return (
        <div className="favourites-page">
            {/* Header */}
            <header className="header">
                <div className="nav-container">
                    <div className="logo">
                        {/* Logo linked to home page */}
                        <Link to="/HomePage_SignedIn" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img src="/icons/Logo.png" alt="Logo" className="logo-img" style={{ height: '38px', width: '38px' }} />
                            <span>PLATE UP</span>
                        </Link>
                    </div>

                    <nav>
                        <ul className="nav-links">
                            <li><Link to="/Home">Home</Link></li>
                            <li><Link to="/All-Recipes">Recipes</Link></li>
                            <li><Link to="/Meal-Planner">Meal Plans</Link></li>
                            <li><Link to="/Favourites" className="active">Favourites</Link></li>
                            <li><Link to="/About-Us-User">About</Link></li>
                        </ul>
                    </nav>

                    <div className="auth-buttons">
                        {/* Log Out button (can trigger actual logout function) */}
                        <button onClick={() => handleNavigation('/')} className="btn-signin">Log Out</button>
                        {/* Profile link */}
                        <Link to="/Profile" className="btn-started">Profile</Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="main-container">
                {/* Page Header */}
                <div className="page-header">
                    <h1>Your Favourite Recipes</h1>
                </div>

                {/* Stats Section */}
                <div className="stats-section">
                    <div className="stat-item">
                        <div className="stat-number">{stats.totalFavourites}</div>
                        <div className="stat-label">Total Favourites</div>
                    </div>
                    {/* Removed Avg Calories stat as per request */}
                    <div className="stat-item">
                        <div className="stat-number">{stats.totalCookTime}</div>
                        <div className="stat-label">Hours of Cooking</div>
                    </div>
                </div>

                {/* Favourites Grid */}
                {favourites.length > 0 ? (
                    <div className="favourites-grid">
                        {favourites.map((recipe, index) => (
                            <div key={recipe.id} className="favourite-card" style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
                                {/* Heart icon for individual recipe removal */}
                                {/* <button
                                    className="favourite-badge"
                                    onClick={() => removeFavouriteLocally(recipe.id)}
                                    aria-label="Remove from favorites"
                                >
                                    ♥
                                </button> */}
                                <div className="recipe-image">
                                    <img
                                        src={recipe.image}
                                        alt={recipe.title}
                                    />
                                </div>
                                <div className="recipe-content">
                                    <h4 className="recipe-title">{recipe.title}</h4>
                                    <div className="recipe-stats">
                                        {/* Updated to display readyInMinutes and servings */}
                                        {recipe.readyInMinutes && <p>{recipe.readyInMinutes} min</p>}
                                        {recipe.servings && <p>{recipe.servings} servings</p>}
                                    </div>
                                    <div className="recipe-buttons">
                                        <button
                                            onClick={() => navigate(`/view-recipe`, { state: { recipeData: recipe } })}
                                            className="btn-view"
                                        >
                                            View Recipe
                                        </button>
                                        <button
                                            onClick={() => removeFavouriteLocally(recipe.id)} // Use local remove function
                                            className="btn-remove"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="empty-state">
                        <div className="empty-state-icon">💔</div>
                        <h2>No Favourite Recipes Yet</h2>
                        <p>
                            Start exploring our delicious recipes and click the heart icon to save your favourites here!
                        </p>
                        <button
                            onClick={() => handleNavigation('/All-Recipes')}
                            className="btn-browse"
                        >
                            Browse Recipes
                        </button>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-container">
                    <div>
                        <div className="footer-brand">
                            {/* Logo in footer, linking to home page */}
                            <Link to="/HomePage_SignedIn" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <img src="/icons/Logo.png" alt="Logo" className="logo-img" style={{ height: '38px', width: '38px' }} />
                                <span>PLATE UP</span>
                            </Link>
                        </div>
                        <p className="footer-description">
                            Simplify your healthy eating through personalized meal planning,
                            nutritious recipe discovery, and organized shopping lists.
                        </p>
                    </div>

                    <div className="footer-section">
                        <h3>Features</h3>
                        <ul className="footer-links">
                            <li><Link to="/All-Recipes" style={{ textDecoration: 'none', color: '#a0aec0' }}>Recipe Search</Link></li>
                            <li><Link to="/Meal-Planner" style={{ textDecoration: 'none', color: '#a0aec0' }}>Meal Planning</Link></li>
                            <li><Link to="/Shopping-list" style={{ textDecoration: 'none', color: '#a0aec0' }}>Shopping Lists</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h3>Support</h3>
                        <ul className="footer-links">
                            <li><a href="mailto:example@gmail.com">Email: example@gmail.com</a></li>
                            <li><a href="tel:+254712345678">Call: 0712 345 678</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© 2025 «PLATE UP». All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Favourites;
