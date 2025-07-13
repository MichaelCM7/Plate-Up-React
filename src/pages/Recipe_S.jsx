import React, { useState, useEffect, useCallback } from 'react';
import '../styles/Recipe.css';
import { Link, useNavigate } from 'react-router-dom';
import { RiSearchLine } from 'react-icons/ri';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';

const Recipe_S = () => {
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');
    const [dietFilter, setDietFilter] = useState('');
    const [selectedCuisine, setSelectedCuisine] = useState('');
    const [maxReadyTime, setMaxReadyTime] = useState('');
    const [minServings, setMinServings] = useState('');
    const [selectedIntolerances, setSelectedIntolerances] = useState([]);

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // State to keep track of favorited recipes (for UI feedback)
    const [favoritedRecipes, setFavoritedRecipes] = useState({});

    // Spoonacular API key
    const SPOONACULAR_API_KEY = '5e4e856e5b354ae1b55eacedc0c8ad37'; // Ensure your actual key is here

    // Load favorited recipes from localStorage on initial mount
    useEffect(() => {
        try {
            const storedFavourites = localStorage.getItem('userFavourites');
            if (storedFavourites) {
                const parsedFavourites = JSON.parse(storedFavourites);
                // Convert array of favorite recipe objects into a map for quick lookup by ID
                const favMap = parsedFavourites.reduce((acc, recipe) => {
                    acc[recipe.id] = true;
                    return acc;
                }, {});
                setFavoritedRecipes(favMap);
            }
        } catch (e) {
            console.error("Failed to load favorited recipes from local storage:", e);
        }
    }, []);

    // Fetch recipes from Spoonacular API
    const fetchRecipes = useCallback(async () => {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
            apiKey: SPOONACULAR_API_KEY,
            query: searchInput,
            number: 20,
            addRecipeInformation: true,
            instructionsRequired: true,
            fillIngredients: true
        });

        if (dietFilter) {
            queryParams.append('diet', dietFilter);
        }
        if (selectedCuisine) {
            queryParams.append('cuisine', selectedCuisine);
        }
        if (maxReadyTime) {
            queryParams.append('maxReadyTime', maxReadyTime);
        }
        if (minServings) {
            queryParams.append('minServings', minServings);
        }
        if (selectedIntolerances.length > 0) {
            queryParams.append('intolerances', selectedIntolerances.join(','));
        }

        try {
            const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?${queryParams.toString()}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch recipes.');
            }
            const data = await response.json();
            setRecipes(data.results);
        } catch (err) {
            console.error("Error fetching recipes:", err);
            setError("Failed to load recipes. Please check your API key or try again later.");
        } finally {
            setLoading(false);
        }
    }, [searchInput, dietFilter, selectedCuisine, maxReadyTime, minServings, selectedIntolerances]);

    useEffect(() => {
        const handler = setTimeout(() => {
            fetchRecipes();
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [fetchRecipes]);

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handleDietFilterChange = (e) => {
        setDietFilter(e.target.value);
    };

    const handleCuisineChange = (e) => {
        setSelectedCuisine(e.target.value);
    };

    const handleMaxReadyTimeChange = (e) => {
        setMaxReadyTime(e.target.value);
    };

    const handleMinServingsChange = (e) => {
        setMinServings(e.target.value);
    };

    const handleIntoleranceChange = (e) => {
        const { value, checked } = e.target;
        if (value === 'none') {
            setSelectedIntolerances(checked ? ['none'] : []);
            if (checked) {
                setDietFilter('');
            }
        } else {
            setSelectedIntolerances((prev) => {
                const newIntolerances = checked
                    ? [...prev.filter(item => item !== 'none'), value]
                    : prev.filter((item) => item !== value);
                return newIntolerances.length === 0 ? ['none'] : newIntolerances;
            });
        }
    };

    const handleViewRecipe = (recipe) => {
        // This is where the full recipe object is passed to the /view-recipe route
        navigate('/View-Recipe/:id', { state: { recipeData: recipe } });
    };

    const handleAddToPlan = (recipe) => {
        navigate('/meal-planner', { state: { recipeToAdd: recipe } });
    };

    const handleToggleFavorite = (recipe) => {
        const isCurrentlyFavorited = favoritedRecipes[recipe.id];
        const newFavoritedState = {
            ...favoritedRecipes,
            [recipe.id]: !isCurrentlyFavorited
        };
        setFavoritedRecipes(newFavoritedState);

        let currentFavouritesArray = JSON.parse(localStorage.getItem('userFavourites') || '[]');
        if (!isCurrentlyFavorited) {
            if (!currentFavouritesArray.some(fav => fav.id === recipe.id)) {
                currentFavouritesArray.push({
                    id: recipe.id,
                    title: recipe.title,
                    image: recipe.image,
                    readyInMinutes: recipe.readyInMinutes,
                    servings: recipe.servings
                });
            }
        } else {
            currentFavouritesArray = currentFavouritesArray.filter(fav => fav.id !== recipe.id);
        }
        localStorage.setItem('userFavourites', JSON.stringify(currentFavouritesArray));

        console.log(`Toggling favorite for recipe ID: ${recipe.id}. New state: ${!isCurrentlyFavorited}`);
    };

    const allDietaryRestrictions = [
        { label: 'None', value: 'none', type: 'special' },
        { label: 'Vegetarian', value: 'vegetarian', type: 'diet' },
        { label: 'Vegan', value: 'vegan', type: 'diet' },
        { label: 'Gluten-free', value: 'gluten', type: 'intolerance' },
        { label: 'Keto', value: 'ketogenic', type: 'diet' },
        { label: 'Paleo', value: 'paleo', type: 'diet' },
        { label: 'Dairy-free', value: 'dairy', type: 'intolerance' },
        { label: 'Nut-free', value: 'peanut,tree nut', type: 'intolerance' }
    ];

    return (
        <div style={{ backgroundColor: 'white' }}>
            {/* Header */}
            <header className="header">
                <div className="nav-container">
                    <div className="logo">
                        <img
                            src="/icons/Logo.png"
                            alt="Logo"
                            className="logo-img"
                            style={{ height: '38px', width: '38px' }}
                        />
                        PLATE UP
                    </div>
                    <nav>
                        <ul className="nav-links">
                            <li><Link to="/Home">Home</Link></li>
                            <li><Link to="#" className="active">Recipes</Link></li>
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

            {/* Main Content */}
            <main className="main-container">
                {/* Hero Section */}
                <section className="hero-section">
                    <h1>Explore Nutritious Recipes</h1>
                    <p>Discover recipes that suit your dietary preferences and nutritional goals.</p>
                </section>

                {/* Search and Filters Section */}
                <section className="search-filters-section">
                    <div className="search-input-container">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search for recipes..."
                            value={searchInput}
                            onChange={handleSearchChange}
                        />
                    </div>

                    <div className="filters-container">
                        <div className="top_filters">
                            <select
                                className="filter-select"
                                value={maxReadyTime}
                                onChange={handleMaxReadyTimeChange}
                            >
                                <option value="">Time to Cook</option>
                                <option value="30">Under 30 min</option>
                                <option value="60">30-60 min</option>
                                <option value="120">1-2 hours</option>
                                <option value="240">2+ hours</option>
                            </select>

                            <select
                                className="filter-select"
                                value={selectedCuisine}
                                onChange={handleCuisineChange}
                            >
                                <option value="">Cuisine</option>
                                <option value="Italian">Italian</option>
                                <option value="Mexican">Mexican</option>
                                <option value="Asian">Asian</option>
                                <option value="Mediterranean">Mediterranean</option>
                                <option value="American">American</option>
                                <option value="Indian">Indian</option>
                                <option value="Middle Eastern">Middle Eastern</option>
                                <option value="French">French</option>
                                <option value="Thai">Thai</option>
                                <option value="Japanese">Japanese</option>
                            </select>

                            <select
                                className="filter-select"
                                value={minServings}
                                onChange={handleMinServingsChange}
                            >
                                <option value="">Number of Servings</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                                <option value="5">5+</option>
                            </select>
                        </div>

                        {/* Dietary Restrictions - Checkboxes */}
                        <div className="dietary-restrictions-checkboxes">
                            <h4>Dietary Restrictions:</h4>
                            {allDietaryRestrictions.map((restriction) => (
                                <div key={restriction.value}>
                                    <input
                                        type="checkbox"
                                        id={`diet-${restriction.value}`}
                                        value={restriction.value}
                                        checked={selectedIntolerances.includes(restriction.value)}
                                        onChange={handleIntoleranceChange}
                                        disabled={restriction.value !== 'none' && selectedIntolerances.includes('none')}
                                    />
                                    <label htmlFor={`diet-${restriction.value}`}>
                                        {restriction.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Recipes Grid */}
                <section className="recipes-grid" id="recipesGrid">
                    {loading && <p>Loading recipes...</p>}
                    {error && <p className="error-message">{error}</p>}
                    {!loading && !error && recipes.length === 0 ? (
                        <p>No recipes found. Try a different search or filter.</p>
                    ) : (
                        recipes.map((recipe) => (
                            <div key={recipe.id} className="recipe-card">
                                <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                                <div className="recipe-content">
                                    <div className="recipe-header">
                                        <h4 className="recipe-title">{recipe.title}</h4>
                                        {/* Favorite Button */}
                                        <button
                                            className="favorite-btn"
                                            onClick={() => handleToggleFavorite(recipe)}
                                            aria-label="Add to favorites"
                                        >
                                            {favoritedRecipes[recipe.id] ? <AiFillHeart /> : <AiOutlineHeart />}
                                        </button>
                                    </div>
                                    <div className="recipe-stats">
                                        {recipe.readyInMinutes && <p>Ready in: {recipe.readyInMinutes} min</p>}
                                        {recipe.servings && <p>Servings: {recipe.servings}</p>}
                                    </div>
                                    <div className="recipe-buttons">
                                        <button
                                            className="btn-view"
                                            onClick={() => handleViewRecipe(recipe)}
                                        >
                                            View Recipe
                                        </button>
                                        <button
                                            className="btn-add"
                                            onClick={() => handleAddToPlan(recipe)}
                                        >
                                            Add to Plan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </section>
            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-container">
                    <div>
                        <div className="footer-brand">
                            <img
                                src="/icons/Logo.png"
                                alt="Logo"
                                className="logo-img"
                                style={{ height: '38px', width: '38px' }}
                            />
                            PLATE UP
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
                            <li><Link to="/Shopping-list" style={{ textDecoration: 'none', color: '#a0aec0' }}>Shopping Lists</Link></li>
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
                    <p>© 2025 PLATE UP. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Recipe_S;
