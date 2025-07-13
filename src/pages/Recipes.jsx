import React, { useState, useEffect } from 'react';
import '../styles/Recipe.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

//For searchbar icon
import {RiSearchLine} from 'react-icons/ri';

const Recipes = () => {

    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState('');
    const [dietFilter, setDietFilter] = useState('');
    const [recipes, setRecipes] = useState([]); //To hold fetched recipe data

    //States for API calls
    //True when fetching data , false otherwise
    const [loading , setLoading] = useState(true);
    //null if no error, otherwise will hold error message
    const [error , setError] = useState(null);

    // Spoonacular API Key
    const SPOONACULAR_API_KEY = '5e4e856e5b354ae1b55eacedc0c8ad37';

    const fetchRecipes = async () => {
        setLoading(true);
        setError(null);

        try {
            let apiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${SPOONACULAR_API_KEY}&number=10`;

            if (searchInput) {
                apiUrl += `&query=${searchInput}`;
            }
            if (dietFilter) {
                apiUrl += `&diet=${dietFilter}`;
            }

            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                setRecipes(data.results);
            } else {
                setRecipes([]);
                setError("No recipes found matching your criteria.");
            }
        } catch (err) {
            console.error("Failed to fetch recipes:", err);
            setError("Failed to load recipes. Please check your internet connection or try again later.");
            setRecipes([]);
        } finally {
            setLoading(false);
        }
    };
    
    // To call fetchRecipes on initial load and when filters change
    useEffect(() => {
        fetchRecipes();
    }, [searchInput, dietFilter]); // Re-run when searchInput or dietFilter changes

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handleDietChange = (e) => {
        setDietFilter(e.target.value);
    };

    const handleSearchSubmit = () => {
        fetchRecipes(); // Trigger search when icon is clicked or Enter is pressed
    };

    return (
        <div style={{backgroundColor: '#f7f7f7'}}>
            {/* Header */}
            <header className="header">
                <div className="nav-container">
                    <div className="logo">
                        <img 
                            src="/icons/Logo.png" 
                            alt="Logo" 
                            className="logo-img" 
                            style={{height: '38px', width: '38px'}}
                        />
                        PLATE UP
                    </div>
                    <nav>
                        <ul className="nav-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="#" className="active">Recipes</Link></li>
                            <li><Link to="/About-Us">About</Link></li>
                        </ul>
                    </nav>
                    <div className="auth-buttons">
                        <Link to ="/Sign-In" className="btn-signin">Sign In</Link>
                        <Link to ="/Sign-Up" className="btn-started">Get Started</Link>
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

                {/* Search Section */}
                <section className="search-section" style={{display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center', marginBottom: '20px'}}>
                    <div className='search-box'>
                        <input 
                        type="text" 
                        className="search-input" 
                        placeholder="Search for recipes..." 
                        value={searchInput}
                        onChange={handleSearchChange}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter'){
                                handleSearchSubmit();
                            }
                        }}
                        />
                        <RiSearchLine className="search-icon" onClick={handleSearchSubmit}/>
                        
                    </div>

                    <select 
                        className="filter-select" 
                        value={dietFilter}
                        onChange={handleDietChange}
                    >
                        <option value="">Diet Type</option>
                        <option value="vegetarian">Vegetarian</option>
                        <option value="vegan">Vegan</option>
                        <option value="ketogenic">Keto</option>
                        <option value="paleo">Paleo</option>
                        <option value="glutenFree">Gluten-Free</option>
                        <option value="lowFODMAP">Low-Carb</option> 
                        {/* Note: Spoonacular uses 'lowFODMAP' for what might be broadly considered low-carb, 
                           you might want to check their documentation for a more precise match or
                           add a custom mapping if "low-carb" is a distinct filter in Spoonacular. */}
                    </select>
                </section>

                {/* Recipes Grid */}
                <section className="recipes-grid" id="recipesGrid">
                    {loading && <p>Loading delicious recipes...</p>}
                    {error && <p className="error-message">Error: {error}</p>}

                    {!loading && !error && recipes.length === 0 && (
                        <p>No recipes found. Please try adjusting your search or filters.</p>
                    )}

                    {!loading && !error && recipes.length > 0 && (
                        recipes.map((recipe) => (
                            <div key={recipe.id} className="recipe-card">
                                {/* Display Recipe Image */}
                                {recipe.image && (
                                    <img
                                        src={recipe.image}
                                        alt={recipe.title}
                                        className="recipe-image"
                                    />
                                )}
                                {/* Display Recipe Name */}
                                <h3>{recipe.title}</h3>
                                {/* Spoonacular's complexSearch doesn't directly return 'strCategory', 
                                    you might need to fetch detailed recipe info for categories if needed. */}
                                {/* <p>Category: {recipe.strCategory}</p> */}

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
                                style={{height: '38px', width: '38px'}}
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
                            <Link to style={{textDecoration: 'none', color: '#a0aec0'}} href="/pages/recipe.html">
                                <p>Recipe Search</p>
                            </Link>
                            <Link to style={{textDecoration: 'none', color: '#a0aec0'}} href="/pages/signin.html">
                                <p>Meal Planning</p>
                            </Link>
                            <Link to style={{textDecoration: 'none', color: '#a0aec0'}} href="/pages/signin.html">
                                <p>Shopping Lists</p>
                            </Link>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Support</h3>
                        <ul className="footer-links">
                            <li><a href="#">Email: example@gmail.com</a></li>
                            <li><a href="#">Call: 0715 340 778</a></li>
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

export default Recipes;