import React, { useState, useEffect } from 'react';
import '../styles/HomepageSignedIn.css';
import { Link, useNavigate } from "react-router-dom";

const SignedInHomepage = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    // Spoonacular API Key (replace with your actual key if needed for fetching recipe details)
    const SPOONACULAR_API_KEY = 'YOUR_SPOONACULAR_API_KEY'; // IMPORTANT: Replace with your actual Spoonacular API Key

    // State for dynamic data
    const [todaysMeals, setTodaysMeals] = useState({
        breakfast: null,
        lunch: null,
        dinner: null
    });
    const [recentFavorites, setRecentFavorites] = useState([]);
    const [quickStats, setQuickStats] = useState({
        savedRecipes: 0,
        mealsPlanned: 0,
        completedMeals: 0, // Placeholder, as this requires more complex tracking
        streakDays: 0 // Placeholder, as this requires more complex tracking
    });
    const [recommendedRecipes, setRecommendedRecipes] = useState([]); // State for recommended recipes - this will now remain empty
    const [loadingRecommended, setLoadingRecommended] = useState(false); // Loading state for recommended recipes
    const [apiError, setApiError] = useState(null); // State for API errors

    // Function to get today's day name (e.g., "monday")
    const getTodayDayName = () => {
        const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const today = new Date();
        return days[today.getDay()];
    };

    // Effect to load meal plans and favorites from localStorage
    useEffect(() => {
        try {
            // Load Meal Plans
            const storedMealPlans = localStorage.getItem('mealPlans');
            let parsedMealPlans = {};
            if (storedMealPlans) {
                parsedMealPlans = JSON.parse(storedMealPlans);
            }

            const todayDay = getTodayDayName();
            const currentTodaysMeals = parsedMealPlans[todayDay] || { breakfast: null, lunch: null, dinner: null };
            setTodaysMeals(currentTodaysMeals);

            // Calculate meals planned
            let plannedCount = 0;
            Object.values(parsedMealPlans).forEach(dayPlan => {
                if (dayPlan.breakfast) plannedCount++;
                if (dayPlan.lunch) plannedCount++;
                if (dayPlan.dinner) plannedCount++;
            });

            // Load Favorites
            const storedFavorites = localStorage.getItem('userFavourites');
            let parsedFavorites = [];
            if (storedFavorites) {
                parsedFavorites = JSON.parse(storedFavorites);
            }
            // Limit to a few recent favorites for display on homepage
            setRecentFavorites(parsedFavorites.slice(0, 4)); // Display up to 4 recent favorites

            // Update Quick Stats
            setQuickStats(prevStats => ({
                ...prevStats,
                savedRecipes: parsedFavorites.length,
                mealsPlanned: plannedCount
            }));

        } catch (e) {
            console.error("Failed to load data from local storage:", e);
            setApiError("Failed to load some data. Please ensure your browser supports local storage.");
        }
    }, []);

    // Effect to fetch recommended recipes (this section is now removed as per user request)
    // The state and loading state for recommended recipes will remain but won't be populated
    useEffect(() => {
        // This effect is now empty as the recommended section is removed.
        // You could remove the recommendedRecipes state and loadingRecommended state if they are not used elsewhere.
        setLoadingRecommended(false);
    }, []);


    // Helper function to get meal type icons (reused from MealPlanner)
    const getMealTypeIcon = (mealType) => {
        switch (mealType) {
            case 'breakfast': return '🍳';
            case 'lunch': return '🍽️';
            case 'dinner': return '🍛';
            default: return '🍽️';
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/All-Recipes?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleViewRecipe = async (recipe) => {
        // If the recipe object is already detailed (e.g., from meal plan), use it directly
        // Otherwise, fetch full details if only ID is available (e.g., from basic favorites list)
        if (recipe && recipe.id && !recipe.extendedIngredients) {
            setApiError(null); // Clear previous errors
            try {
                const response = await fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${SPOONACULAR_API_KEY}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
                }
                const detailedRecipe = await response.json();
                navigate('/View-Recipe/:id', { state: { recipeData: detailedRecipe } });
            } catch (error) {
                console.error("Error fetching full recipe details:", error);
                setApiError("Failed to load recipe details. Please try again or check your API key.");
            }
        } else if (recipe) {
            navigate('/View-Recipe/:id', { state: { recipeData: recipe } });
        }
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    const getTodaysDate = () => {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return today.toLocaleDateString('en-US', options);
    };

    return (
        <div className="signed-in-homepage">
            {/* Header */}
            <header className="header">
                <div className="nav-container">
                    <div className="logo">
                        <Link to="/HomePage_SignedIn" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img src="/icons/Logo.png" alt="Logo" className="logo-img" style={{ height: '38px', width: '38px' }} />
                            <span>PLATE UP</span>
                        </Link>
                    </div>
                    <nav>
                        <ul className="nav-links">
                            <li><Link to="/HomePage_SignedIn" className="active">Home</Link></li>
                            <li><Link to="/All-Recipes">Recipes</Link></li>
                            <li><Link to="/Meal-Planner">Meal Plans</Link></li>
                            <li><Link to="/Favourites">Favourites</Link></li>
                            <li><Link to="/About-Us-User">About</Link></li>
                        </ul>
                    </nav>
                    <div className="auth-buttons">
                        <Link to="/" className="btn-signin">Log Out</Link>
                        <Link to="/Profile" className="btn-started">Profile</Link>
                    </div>
                </div>
            </header>

            {/* Main Dashboard Content */}
            <main className="main-content">
                {/* Welcome Section */}
                <div className="welcome-section">
                    <h1 className="welcome-title" style={{ textAlign: 'center' }}>
                        Welcome back!👋
                    </h1>
                    <p className="welcome-subtitle">
                        {getTodaysDate()} • <Link style={{color: '#40e0d0', textDecoration: 'none'}} to="/All-Recipes">Ready to plan your healthy meals?</Link>
                    </p>
                </div>

                {/* Display API Error if any */}
                {apiError && (
                    <div style={{ color: 'red', textAlign: 'center', margin: '1rem 0', padding: '0.5rem', border: '1px solid red', borderRadius: '5px', backgroundColor: '#ffe6e6' }}>
                        {apiError}
                    </div>
                )}

                {/* Quick Stats */}
                <div className="quick-stats">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-number">{quickStats.savedRecipes}</div>
                            <div className="stat-label">Saved Recipes</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{quickStats.mealsPlanned}</div>
                            <div className="stat-label">Meals Planned</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{quickStats.completedMeals}</div>
                            <div className="stat-label">Completed Meals</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-number">{quickStats.streakDays}</div>
                            <div className="stat-label">Day Streak</div>
                        </div>
                    </div>
                </div>

                {/* Today's Meals */}
                <div className="section">
                    <div className="section-header">
                        <h2 className="section-title">Today's Meals</h2>
                        <Link to="/Meal-Planner" className="section-link">
                            View Full Plan →
                        </Link>
                    </div>
                    <div className="meals-grid" style={{ backgroundColor: '#f7f7f7' }}>
                        {Object.entries(todaysMeals).map(([mealType, meal]) => (
                            <div key={mealType} className="meal-card">
                                {meal ? (
                                    <>
                                        <div className="meal-info">
                                            <div className="meal-icon">
                                                {meal.image ? (
                                                    <img src={meal.image} alt={meal.title} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                                                ) : (
                                                    getMealTypeIcon(mealType)
                                                )}
                                            </div>
                                            <div>
                                                <div className="meal-type">{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</div>
                                                <div className="meal-title">{meal.title}</div>
                                                <div className="meal-calories">
                                                    {meal.readyInMinutes && `${meal.readyInMinutes} min`}
                                                    {meal.servings && ` • ${meal.servings} servings`}
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleViewRecipe(meal)}
                                            className="meal-button"
                                        >
                                            View Recipe
                                        </button>
                                    </>
                                ) : (
                                    <div className="empty-meal-slot">
                                        <div className="meal-icon">{getMealTypeIcon(mealType)}</div>
                                        <div className="meal-type">No {mealType} planned</div>
                                        <Link to="/Meal-Planner" className="add-meal-button">Add Meal</Link>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Favorites */}
                <div className="section">
                    <div className="section-header">
                        <h2 className="section-title">Recent Favorites</h2>
                        <Link to="/Favourites" className="section-link">
                            View All →
                        </Link>
                    </div>
                    <div className="favorites-grid" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '1rem' }}>
                        {recentFavorites.length > 0 ? (
                            recentFavorites.map((recipe, index) => (
                                <div key={index} className="favorite-card" onClick={() => handleViewRecipe(recipe)}>
                                    <div className="favorite-info">
                                        <div className="favorite-icon">
                                            {recipe.image ? (
                                                <img src={recipe.image} alt={recipe.title} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                                            ) : (
                                                '❤️' // Fallback icon for favorites
                                            )}
                                        </div>
                                        <div>
                                            <div className="favorite-title">{recipe.title}</div>
                                            <div className="favorite-calories">
                                                {recipe.readyInMinutes && `${recipe.readyInMinutes} min`}
                                                {recipe.servings && ` • ${recipe.servings} servings`}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', color: '#555', width: '100%' }}>No recent favorites. Add some recipes to your favorites!</p>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="section">
                    <h2 className="section-title">Quick Actions</h2>
                    <div className="actions-grid" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '1rem' }}>
                        <div className="action-link" onClick={() => handleNavigate('/Meal-Planner')}>
                            <div className="action-card">
                                <div className="action-icon">📅</div>
                                <div className="action-title">Plan This Week</div>
                            </div>
                        </div>
                        <div className="action-link" onClick={() => handleNavigate('/All-Recipes')}>
                            <div className="action-card">
                                <div className="action-icon">🔍</div>
                                <div className="action-title">Find Recipes</div>
                            </div>
                        </div>
                        <div className="action-link" onClick={() => handleNavigate('/Shopping-List')}>
                            <div className="action-card">
                                <div className="action-icon">🛒</div>
                                <div className="action-title">Shopping List</div>
                            </div>
                        </div>
                        <div className="action-link" onClick={() => handleNavigate('/Favourites')}>
                            <div className="action-card">
                                <div className="action-icon">❤️</div>
                                <div className="action-title">My Favorites</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-container">
                    <div>
                        <div className="footer-brand">
                            <Link to="/HomePage_SignedIn" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <img src="/icons/Logo.png" alt="Logo" className="logo-img" style={{ height: '38px', width: '38px' }} />
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
                            <li><Link to="/All-Recipes" style={{ textDecoration: 'none', color: '#a0aec0' }}>Recipe Search</Link></li>
                            <li><Link to="/Meal-Planner" style={{ textDecoration: 'none', color: '#a0aec0' }}>Meal Planning</Link></li>
                            <li><Link to="/Shopping-List" style={{ textDecoration: 'none', color: '#a0aec0' }}>Shopping Lists</Link></li>
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

export default SignedInHomepage;
