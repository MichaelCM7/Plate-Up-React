import React, { useState, useEffect } from 'react';
import '../styles/RecipeView.css'; // Import your CSS styles for this component
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import useLocation and useNavigate
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai'; // For favorite/unfavorite icon

const RecipeView = () => {
    const location = useLocation(); // Hook to access navigation state
    const navigate = useNavigate(); // Hook to navigate programmatically

    // Initial state for recipeData, will be updated from location.state
    const [recipeData, setRecipeData] = useState({
        id: null,
        title: 'Loading Recipe...',
        image: '', // Placeholder for image
        readyInMinutes: null,
        servings: null,
        extendedIngredients: [], // Spoonacular's detailed ingredients
        analyzedInstructions: [] // Spoonacular's detailed instructions
    });

    const [currentServings, setCurrentServings] = useState(4); // Default servings, will be updated from recipeData
    const [isFavorite, setIsFavorite] = useState(false);

    // Load recipe data from navigation state and check favorite status from localStorage
    useEffect(() => {
        if (location.state && location.state.recipeData) {
            const receivedRecipe = location.state.recipeData;

            // Set the recipe data
            setRecipeData({
                id: receivedRecipe.id,
                title: receivedRecipe.title,
                image: receivedRecipe.image,
                readyInMinutes: receivedRecipe.readyInMinutes,
                servings: receivedRecipe.servings,
                extendedIngredients: receivedRecipe.extendedIngredients || [],
                analyzedInstructions: receivedRecipe.analyzedInstructions || []
            });

            // Set current servings to the recipe's default servings
            setCurrentServings(receivedRecipe.servings || 4); // Fallback to 4 if not provided

            // Check if this recipe is already in favorites from localStorage
            try {
                const storedFavourites = JSON.parse(localStorage.getItem('userFavourites') || '[]');
                const foundInFavorites = storedFavourites.some(fav => fav.id === receivedRecipe.id);
                setIsFavorite(foundInFavorites);
            } catch (e) {
                console.error("Failed to check favorite status from local storage:", e);
            }
        }
    }, [location.state]);

    // Base servings for ingredient calculation (use the loaded recipe's servings or a default)
    const baseServings = recipeData.servings || 4;

    const toggleFavorite = () => {
        const newIsFavorite = !isFavorite;
        setIsFavorite(newIsFavorite);

        // Update localStorage
        let currentFavouritesArray = JSON.parse(localStorage.getItem('userFavourites') || '[]');
        if (newIsFavorite) {
            // Add to favorites
            if (!currentFavouritesArray.some(fav => fav.id === recipeData.id)) {
                currentFavouritesArray.push({
                    id: recipeData.id,
                    title: recipeData.title,
                    image: recipeData.image,
                    readyInMinutes: recipeData.readyInMinutes,
                    servings: recipeData.servings
                });
            }
        } else {
            // Remove from favorites
            currentFavouritesArray = currentFavouritesArray.filter(fav => fav.id !== recipeData.id);
        }
        localStorage.setItem('userFavourites', JSON.stringify(currentFavouritesArray));
    };

    const increaseServings = () => {
        setCurrentServings(prev => prev + 1);
    };

    const decreaseServings = () => {
        if (currentServings > 1) {
            setCurrentServings(prev => prev - 1);
        }
    };

    const addToPlan = () => {
        // Navigate to meal planner, passing the recipe data
        navigate('/meal-planner', { state: { recipeToAdd: recipeData } });
    };

    const getAdjustedAmount = (originalAmount) => {
        if (originalAmount === null || originalAmount === undefined) return '';
        return (originalAmount * currentServings / baseServings).toFixed(2);
    };

    const formatAmount = (amount) => {
        const num = parseFloat(amount);
        // Display as integer if it's a whole number, otherwise with decimals
        return num % 1 === 0 ? num.toString() : num.toString();
    };

    return (
        <div>
            {/* Header */}
            <header className="header">
                <div className="nav-container">
                    <div className="logo">
                        <img src="/icons/Logo.png" alt="Logo" className="logo-img" style={{ height: '38px', width: '38px' }} />
                        PLATE UP
                    </div>
                    <nav>
                        <ul className="nav-links">
                            <li><Link to="/Home">Home</Link></li>
                            <li><Link to="/All-Recipes" className="active">Recipes</Link></li> {/* Updated path */}
                            <li><Link to="/Meal-Planner">Meal Plans</Link></li>
                            <li><Link to="/Favourites">Favourites</Link></li>
                            <li><Link to="/About-Us-User">About</Link></li> {/* Updated path */}
                        </ul>
                    </nav>
                    <div className="auth-buttons">
                        <Link to="/" className="btn-signin">Log Out</Link> {/* Updated path */}
                        <Link to="/Profile" className="btn-started">Profile</Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="main-container">
                {/* Back Link */}
                <Link to="/All-Recipes" className="back-link"> {/* Updated path */}
                    ← Back to Recipes
                </Link>

                {/* Recipe Header Card */}
                <div className="recipe-header-card">
                    <div className="recipe-image">
                        {recipeData.image ? (
                            <img src={recipeData.image} alt={recipeData.title} />
                        ) : (
                            <span>🥗</span> // Fallback if no image
                        )}
                    </div>
                    <div className="recipe-details">
                        <div className="recipe-title-section">
                            <div>
                                <h1 className="recipe-title">{recipeData.title}</h1>
                                {/* Removed Calories display as per previous requests */}
                                {recipeData.readyInMinutes && (
                                    <div className="recipe-meta">Ready in: {recipeData.readyInMinutes} min</div>
                                )}
                            </div>
                            <button
                                className="favorite-btn"
                                onClick={toggleFavorite}
                                aria-label="Toggle favorite"
                            >
                                {isFavorite ? <AiFillHeart /> : <AiOutlineHeart />}
                            </button>
                        </div>

                        <div className="servings-section">
                            <div className="servings-title">Adjust Servings</div>
                            <div className="servings-control">
                                <button className="servings-btn" onClick={decreaseServings}>-</button>
                                <div className="servings-display">
                                    <span>{currentServings}</span> Servings
                                </div>
                                <button className="servings-btn" onClick={increaseServings}>+</button>
                            </div>
                            <button className="add-to-plan-btn" onClick={addToPlan}>Add to Meal Plan</button>
                        </div>
                    </div>
                </div>

                {/* Ingredients Section */}
                <section className="ingredients-section">
                    <div className="ingredients-header">
                        <h2 className="ingredients-title">Ingredients</h2>
                        <div className="ingredients-adjust">Adjust for <span>{currentServings}</span> servings</div>
                    </div>

                    <ul className="ingredients-list">
                        {recipeData.extendedIngredients.length > 0 ? (
                            recipeData.extendedIngredients.map((ingredient, index) => (
                                <li key={index} className="ingredient-item">
                                    <span className="ingredient-amount">
                                        {formatAmount(getAdjustedAmount(ingredient.amount))} {ingredient.unit}
                                    </span>
                                    <span className="ingredient-name">{ingredient.name}</span>
                                </li>
                            ))
                        ) : (
                            <p>No ingredients available for this recipe.</p>
                        )}
                    </ul>

                    <button className="add-to-plan-btn" onClick={addToPlan}>Add to Meal Plan</button>
                </section>

                {/* Instructions Section */}
                <section className="instructions-section">
                    <h2 className="instructions-title">Instructions</h2>
                    <div className="cooking-guide">Step-by-step cooking guide</div>

                    <ol className="instructions-list">
                        {recipeData.analyzedInstructions && recipeData.analyzedInstructions.length > 0 &&
                            recipeData.analyzedInstructions[0].steps.length > 0 ? (
                            recipeData.analyzedInstructions[0].steps.map((step, index) => (
                                <li key={index} className="instruction-step">
                                    {step.step}
                                </li>
                            ))
                        ) : (
                            <p>No detailed instructions available for this recipe.</p>
                        )}
                    </ol>
                </section>
            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-container">
                    <div>
                        <div className="footer-brand">
                            <img src="/icons/Logo.png" alt="Logo" className="logo-img" style={{ height: '38px', width: '38px' }} />
                            PLATE UP
                        </div>
                        <p className="footer-description">
                            Simplify your healthy eating through personalized meal planning, nutritious recipe discovery, and organized shopping lists.
                        </p>
                    </div>
                    <div className="footer-section">
                        <h3>Features</h3>
                        <ul className="footer-links">
                            <li><Link to="/All-Recipes" style={{ textDecoration: 'none', color: '#a0aec0' }}>Recipe Search</Link></li> {/* Updated path */}
                            <li><Link to="/Meal-Planner" style={{ textDecoration: 'none', color: '#a0aec0' }}>Meal Planning</Link></li>
                            <li><Link to="/Shopping-list" style={{ textDecoration: 'none', color: '#a0aec0' }}>Shopping Lists</Link></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Support</h3>
                        <ul className="footer-links">
                            <li><a href="mailto:example@gmail.com">Email: example@gmail.com</a></li> {/* Changed to mailto */}
                            <li><a href="tel:+254712345678">Call: 0712 345 678</a></li> {/* Changed to tel */}
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

export default RecipeView;
