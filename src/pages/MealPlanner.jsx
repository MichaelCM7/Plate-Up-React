import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/MealPlanner.css';

const MealPlanner = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Hook to access navigation state

    // Spoonacular API Key (replace with your actual key)
    const SPOONACULAR_API_KEY = '5e4e856e5b354ae1b55eacedc0c8ad37'; // IMPORTANT: Replace with your actual Spoonacular API Key

    // State to store the meal plans for the week
    const [mealPlans, setMealPlans] = useState(() => {
        // Initialize meal plans from localStorage or with default empty structure
        try {
            const storedPlans = localStorage.getItem('mealPlans');
            if (storedPlans) {
                return JSON.parse(storedPlans);
            }
        } catch (e) {
            console.error("Failed to load meal plans from local storage:", e);
        }
        // Default empty structure if no stored plans or error
        return {
            monday: { breakfast: null, lunch: null, dinner: null },
            tuesday: { breakfast: null, lunch: null, dinner: null },
            wednesday: { breakfast: null, lunch: null, dinner: null },
            thursday: { breakfast: null, lunch: null, dinner: null },
            friday: { breakfast: null, lunch: null, dinner: null },
            saturday: { breakfast: null, lunch: null, dinner: null },
            sunday: { breakfast: null, lunch: null, dinner: null }
        };
    });

    // State to manage search inputs for each meal slot
    const [searchInputs, setSearchInputs] = useState({});

    // State to keep track of the currently selected meal slot for adding recipes
    const [selectedSlot, setSelectedSlot] = useState(null); // { day: 'monday', mealType: 'breakfast' }

    // State to store filtered search suggestions for each meal slot
    const [filteredSearchSuggestions, setFilteredSearchSuggestions] = useState({});
    const [loadingSearchSuggestions, setLoadingSearchSuggestions] = useState({});

    // State to track which slot's favorites dropdown is open
    const [showFavoritesDropdownForSlot, setShowFavoritesDropdownForSlot] = useState(null); // 'day-mealType' string

    // State to store the list of favorited recipes from localStorage (basic info)
    const [favoritesListBasic, setFavoritesListBasic] = useState([]);
    // State to store full details of favorited recipes, fetched on demand
    const [favoritesListDetailed, setFavoritesListDetailed] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(false);

    // State to handle API errors for user feedback
    const [apiError, setApiError] = useState(null);

    // Debounce mechanism for search input
    const debounceTimeout = useRef(null);


    // Load basic favorites from localStorage when the component mounts
    useEffect(() => {
        try {
            const storedFavourites = localStorage.getItem('userFavourites');
            if (storedFavourites) {
                setFavoritesListBasic(JSON.parse(storedFavourites));
            }
        } catch (e) {
            console.error("Failed to load basic favorites from local storage:", e);
            setFavoritesListBasic([]);
        }
    }, []);

    // Effect to fetch detailed favorite recipe data when the dropdown is opened
    useEffect(() => {
        const fetchDetailedFavorites = async () => {
            if (showFavoritesDropdownForSlot && favoritesListBasic.length > 0) {
                setLoadingFavorites(true);
                setApiError(null); // Clear previous errors
                const detailedRecipes = [];
                for (const basicRecipe of favoritesListBasic) {
                    try {
                        const response = await fetch(`https://api.spoonacular.com/recipes/${basicRecipe.id}/information?apiKey=${SPOONACULAR_API_KEY}`);
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
                        }
                        const data = await response.json();
                        detailedRecipes.push(data);
                    } catch (error) {
                        console.error(`Error fetching details for favorite recipe ID ${basicRecipe.id}:`, error);
                        setApiError("Failed to load some favorite recipes. Please check your API key and network connection.");
                        detailedRecipes.push({ ...basicRecipe, error: true }); // Mark as error
                    }
                }
                setFavoritesListDetailed(detailedRecipes);
                setLoadingFavorites(false);
            } else if (!showFavoritesDropdownForSlot) {
                setFavoritesListDetailed([]); // Clear detailed list when dropdown closes
                setApiError(null); // Clear error when dropdown closes
            }
        };

        fetchDetailedFavorites();
    }, [showFavoritesDropdownForSlot, favoritesListBasic, SPOONACULAR_API_KEY]);


    // Effect to handle incoming recipe data from navigation state (from All-Recipes page)
    useEffect(() => {
        if (location.state && location.state.recipeToAdd && selectedSlot) {
            const { recipeToAdd } = location.state;
            const { day, mealType } = selectedSlot;

            setMealPlans(prevMealPlans => {
                const updatedMealPlans = {
                    ...prevMealPlans,
                    [day]: {
                        ...prevMealPlans[day],
                        [mealType]: {
                            id: recipeToAdd.id,
                            title: recipeToAdd.title,
                            image: recipeToAdd.image,
                            readyInMinutes: recipeToAdd.readyInMinutes,
                            servings: recipeToAdd.servings,
                            extendedIngredients: recipeToAdd.extendedIngredients || [],
                            analyzedInstructions: recipeToAdd.analyzedInstructions || []
                        }
                    }
                };
                localStorage.setItem('mealPlans', JSON.stringify(updatedMealPlans)); // Persist to localStorage
                return updatedMealPlans;
            });

            setSelectedSlot(null); // Clear selected slot after adding
            // Clear navigation state to prevent re-adding on subsequent renders
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, selectedSlot, navigate]);

    // Function to fetch search suggestions from Spoonacular API
    const fetchSearchSuggestions = useCallback(async (query, day, mealType) => {
        if (query.length < 3) { // Only search if query is at least 3 characters long
            setFilteredSearchSuggestions(prev => ({ ...prev, [`${day}-${mealType}`]: [] }));
            setLoadingSearchSuggestions(prev => ({ ...prev, [`${day}-${mealType}`]: false }));
            setApiError(null); // Clear previous errors
            return;
        }

        setLoadingSearchSuggestions(prev => ({ ...prev, [`${day}-${mealType}`]: true }));
        setApiError(null); // Clear previous errors before new fetch
        try {
            // Changed number from 5 to 3
            const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=3&apiKey=${SPOONACULAR_API_KEY}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            setFilteredSearchSuggestions(prev => ({ ...prev, [`${day}-${mealType}`]: data.results }));
        } catch (error) {
            console.error("Error fetching search suggestions:", error);
            setFilteredSearchSuggestions(prev => ({ ...prev, [`${day}-${mealType}`]: [] }));
            setApiError("Failed to fetch search results. Please check your API key and network connection.");
        } finally {
            setLoadingSearchSuggestions(prev => ({ ...prev, [`${day}-${mealType}`]: false }));
        }
    }, [SPOONACULAR_API_KEY]);

    // Handle changes in the search input fields with debouncing
    const handleSearchChange = (day, mealType, value) => {
        setSearchInputs(prev => ({
            ...prev,
            [`${day}-${mealType}`]: value
        }));

        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        debounceTimeout.current = setTimeout(() => {
            fetchSearchSuggestions(value, day, mealType);
        }, 500); // Debounce for 500ms
    };

    // Function to fetch full recipe details for a selected search suggestion
    const selectRecipeFromSearch = async (recipeId, day, mealType) => {
        setLoadingSearchSuggestions(prev => ({ ...prev, [`${day}-${mealType}`]: true }));
        setApiError(null); // Clear previous errors
        try {
            const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
            }
            const recipe = await response.json();

            setMealPlans(prevMealPlans => {
                const updatedMealPlans = {
                    ...prevMealPlans,
                    [day]: {
                        ...prevMealPlans[day],
                        [mealType]: {
                            id: recipe.id,
                            title: recipe.title,
                            image: recipe.image,
                            readyInMinutes: recipe.readyInMinutes,
                            servings: recipe.servings,
                            extendedIngredients: recipe.extendedIngredients || [],
                            analyzedInstructions: recipe.analyzedInstructions || []
                        }
                    }
                };
                localStorage.setItem('mealPlans', JSON.stringify(updatedMealPlans)); // Persist to localStorage
                return updatedMealPlans;
            });
        } catch (error) {
            console.error("Error fetching full recipe details for search selection:", error);
            setApiError("Failed to add recipe details. Please try again or check your API key.");
        } finally {
            setLoadingSearchSuggestions(prev => ({ ...prev, [`${day}-${mealType}`]: false }));
            // Clear search input and suggestions for this slot
            setSearchInputs(prev => ({ ...prev, [`${day}-${mealType}`]: '' }));
            setFilteredSearchSuggestions(prev => ({ ...prev, [`${day}-${mealType}`]: [] }));
        }
    };


    // Function to view a recipe in detail
    const handleViewRecipe = (recipe) => {
        // Navigate to the view recipe page, passing the full recipe object
        navigate('/View-Recipe/:id', { state: { recipeData: recipe } });
    };

    // Function to remove a meal from the plan
    const handleRemoveMeal = (day, mealType) => {
        setMealPlans(prev => {
            const updatedMealPlans = {
                ...prev,
                [day]: {
                    ...prev[day],
                    [mealType]: null
                }
            };
            localStorage.setItem('mealPlans', JSON.stringify(updatedMealPlans)); // Persist to localStorage
            return updatedMealPlans;
        });
    };

    // Function to browse recipes (navigates to All-Recipes page)
    const handleBrowseRecipes = (day, mealType) => {
        setSelectedSlot({ day, mealType }); // Set the slot before navigating
        const searchTerm = searchInputs[`${day}-${mealType}`] || '';
        navigate('/All-Recipes', { state: { initialSearchInput: searchTerm } }); // Pass search term
    };

    // Function to toggle the favorites dropdown for a specific slot
    const handleAddFromFavorites = (day, mealType) => {
        const slotKey = `${day}-${mealType}`;
        setSelectedSlot({ day, mealType }); // Set selected slot for favorite selection
        setShowFavoritesDropdownForSlot(showFavoritesDropdownForSlot === slotKey ? null : slotKey);
    };

    // Function to select a favorite recipe from the dropdown
    const selectFavoriteRecipe = (recipe) => {
        if (selectedSlot) { // selectedSlot is set when dropdown is opened
            const { day, mealType } = selectedSlot;
            setMealPlans(prevMealPlans => {
                const updatedMealPlans = {
                    ...prevMealPlans,
                    [day]: {
                        ...prevMealPlans[day],
                        [mealType]: {
                            id: recipe.id,
                            title: recipe.title,
                            image: recipe.image,
                            readyInMinutes: recipe.readyInMinutes,
                            servings: recipe.servings,
                            extendedIngredients: recipe.extendedIngredients || [],
                            analyzedInstructions: recipe.analyzedInstructions || []
                        }
                    }
                };
                localStorage.setItem('mealPlans', JSON.stringify(updatedMealPlans)); // Persist to localStorage
                return updatedMealPlans;
            });
            setSelectedSlot(null); // Clear selected slot
            setShowFavoritesDropdownForSlot(null); // Close the dropdown
        }
    };

    // Function to navigate to the shopping list page
    const handleGetShoppingList = () => {
        navigate('/shopping-list');
    };

    // Helper function to get meal type icons
    const getMealTypeIcon = (mealType) => {
        switch (mealType) {
            case 'breakfast': return '🍳';
            case 'lunch': return '🍽️';
            case 'dinner': return '🍛';
            default: return '🍽️';
        }
    };

    // Renders a single meal card (either filled or empty)
    const renderMealCard = (day, mealType, meal) => {
        const slotKey = `${day}-${mealType}`;
        const currentSearchSuggestions = filteredSearchSuggestions[slotKey] || [];
        const currentSearchInput = searchInputs[slotKey] || '';
        const isLoadingSearch = loadingSearchSuggestions[slotKey];

        return (
            <div key={mealType} className="meal-card">
                {meal ? (
                    <>
                        <div className="meal-image">
                            {meal.image ? (
                                <img style={{ height: '200px' }} src={meal.image} alt={meal.title} />
                            ) : (
                                <span>{getMealTypeIcon(mealType)}</span> // Fallback icon
                            )}
                        </div>
                        {/* Adjusted inline style to ensure 20px margin below the image */}
                        <div className="meal-content" style={{ marginTop: '20px' }}>
                            <div className="meal-title">{meal.title}</div>
                            {/* Display readyInMinutes and servings */}
                            <div className="meal-stats">
                                {meal.readyInMinutes && `${meal.readyInMinutes} min`}
                                {meal.servings && ` • ${meal.servings} servings`}
                            </div>
                            <div className="meal-buttons">
                                <button className="btn-view" onClick={() => handleViewRecipe(meal)}>
                                    View Recipe
                                </button>
                                <button className="btn-remove" onClick={() => handleRemoveMeal(day, mealType)}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="meal-icon">{getMealTypeIcon(mealType)}</div>
                        <div className="meal-type">Add {mealType.charAt(0).toUpperCase() + mealType.slice(1)}</div>
                        <div className="search-container">
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search for a recipe"
                                value={currentSearchInput}
                                onChange={(e) => handleSearchChange(day, mealType, e.target.value)}
                            />
                            <div className="search-icon">🔍</div>
                            {/* Search Suggestions Dropdown */}
                            {isLoadingSearch ? (
                                <div className="search-suggestions-dropdown">Loading...</div>
                            ) : (
                                currentSearchInput.length > 0 && currentSearchSuggestions.length > 0 && (
                                    <div className="search-suggestions-dropdown">
                                        {currentSearchSuggestions.map(recipe => (
                                            <div
                                                key={recipe.id}
                                                className="suggestion-item"
                                                onClick={() => selectRecipeFromSearch(recipe.id, day, mealType)}
                                            >
                                                <span>{recipe.title}</span>
                                            </div>
                                        ))}
                                    </div>
                                )
                            )}
                        </div>
                        <button className="browse-btn" onClick={() => handleBrowseRecipes(day, mealType)}>
                            Browse Recipes
                        </button>
                        <button className="add-favorites-btn" onClick={() => handleAddFromFavorites(day, mealType)}>
                            Add From Favourites
                        </button>
                        {/* Favorites Dropdown */}
                        {showFavoritesDropdownForSlot === slotKey && (
                            <div className="favorites-dropdown">
                                {loadingFavorites ? (
                                    <div>Loading favorites...</div>
                                ) : favoritesListDetailed.length > 0 ? (
                                    favoritesListDetailed.map(recipe => (
                                        <div
                                            key={recipe.id}
                                            className="dropdown-item"
                                            onClick={() => selectFavoriteRecipe(recipe)}
                                        >
                                            <span>{recipe.title}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div>No favorite recipes found.</div>
                                )}
                                <button className="dropdown-close-btn" onClick={() => setShowFavoritesDropdownForSlot(null)}>Close</button>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    };

    // Renders the section for a single day
    const renderDaySection = (day, dayData) => {
        return (
            <div key={day} className="day-section">
                <h2 className="day-title">{day.toUpperCase()}</h2>
                <div className="meals-grid">
                    {renderMealCard(day, 'breakfast', dayData.breakfast)}
                    {renderMealCard(day, 'lunch', dayData.lunch)}
                    {renderMealCard(day, 'dinner', dayData.dinner)}
                </div>
            </div>
        );
    };

    return (
        <div style={{ backgroundColor: '#f7f7f7' }}>
            {/* Header */}
            <header className="header">
                <div className="nav-container">
                    <div className="logo">
                        <Link to="/HomePage_SignedIn" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <img
                                src="/icons/Logo.png"
                                alt="Logo"
                                className="logo-img"
                                style={{ height: '38px', width: '38px' }}
                            />
                            <span>PLATE UP</span>
                        </Link>
                    </div>
                    <nav>
                        <ul className="nav-links">
                            <li><Link to="/Home">Home</Link></li>
                            <li><Link to="/All-Recipes">Recipes</Link></li>
                            <li><Link to="/Meal-Planner" className="active">Meal Plans</Link></li>
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
                {/* Page Header */}
                <div className="page-header">
                    <h1>Weekly Meal Planner</h1>
                    <button className="shopping-list-btn" onClick={handleGetShoppingList}>
                        Get Shopping List
                    </button>
                </div>

                {/* Display API Error if any */}
                {apiError && (
                    <div style={{ color: 'red', textAlign: 'center', margin: '1rem 0', padding: '0.5rem', border: '1px solid red', borderRadius: '5px', backgroundColor: '#ffe6e6' }}>
                        {apiError}
                    </div>
                )}

                {/* Days Sections */}
                {Object.entries(mealPlans).map(([day, dayData]) =>
                    renderDaySection(day, dayData)
                )}
            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-container">
                    <div>
                        <div className="footer-brand">
                            <Link to="/HomePage_SignedIn" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <img
                                    src="/icons/Logo.png"
                                    alt="Logo"
                                    className="logo-img"
                                    style={{ height: '38px', width: '38px' }}
                                />
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

export default MealPlanner;
