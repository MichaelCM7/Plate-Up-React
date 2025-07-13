import React, { useState, useEffect } from 'react';
import '../styles/ShoppingList.css';
import { Link } from 'react-router-dom';

const ShoppingList = () => {
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        try {
            const storedMealPlans = localStorage.getItem('mealPlans');
            if (storedMealPlans) {
                const mealPlans = JSON.parse(storedMealPlans);
                const collectedIngredients = {}; // Use an object to aggregate ingredients by a unique key

                // Helper function to format quantity for display
                const formatQuantity = (amount, unit) => {
                    if (amount === null || amount === undefined) return unit || '';
                    // Format amount to avoid trailing .00 if it's an integer
                    const formattedAmount = Number.isInteger(amount) ? amount.toString() : amount.toFixed(2);
                    if (!unit) return formattedAmount;
                    return `${formattedAmount} ${unit}`;
                };

                // Iterate through each day and meal type in the meal plan
                Object.values(mealPlans).forEach(dayPlan => {
                    ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
                        const meal = dayPlan[mealType];
                        if (meal && meal.extendedIngredients) {
                            meal.extendedIngredients.forEach(ing => {
                                // Prefer nameClean for a cleaner ingredient name, fallback to name
                                const ingredientName = (ing.nameClean || ing.name).toLowerCase();
                                // Create a unique key for basic de-duplication.
                                // Note: This de-duplicates only if name and original string are identical.
                                // It does NOT sum quantities for different units or slightly different descriptions.
                                const key = ing.original ? ing.original.toLowerCase() : `${ingredientName}-${ing.amount || ''}-${ing.unit || ''}`;

                                if (!collectedIngredients[key]) {
                                    // If this exact ingredient (by key) hasn't been added yet, add it
                                    collectedIngredients[key] = {
                                        name: ingredientName.charAt(0).toUpperCase() + ingredientName.slice(1), // Capitalize first letter
                                        quantity: formatQuantity(ing.amount, ing.unit) || ing.original || '', // Use formatted quantity or original string as fallback
                                        checked: false // Initialize as unchecked
                                    };
                                }
                                // If the ingredient already exists (by key), we don't sum quantities with this simple approach,
                                // we just ensure it's listed once if its original string is identical.
                            });
                        }
                    });
                });

                // Convert the aggregated object back into an array for the state
                const finalIngredients = Object.values(collectedIngredients).map((ing, index) => ({
                    id: index + 1, // Assign a unique ID
                    name: ing.name,
                    quantity: ing.quantity,
                    checked: false
                }));

                setIngredients(finalIngredients);
            }
        } catch (e) {
            console.error("Failed to load meal plans or parse ingredients from local storage:", e);
            setIngredients([]); // Reset if there's an error
        }
    }, []); // Empty dependency array means this effect runs once after the initial render

    const toggleIngredient = (id) => {
        setIngredients(prevIngredients =>
            prevIngredients.map(ingredient =>
                ingredient.id === id
                    ? { ...ingredient, checked: !ingredient.checked }
                    : ingredient
            )
        );
    };

    const clearCheckedItems = () => {
        setIngredients(prevIngredients => prevIngredients.filter(ingredient => !ingredient.checked));
    };

    // This function remains available for manually adding new items if needed
    const addNewItem = (name, quantity) => {
        if (name.trim() && quantity.trim()) {
            const newItem = {
                id: ingredients.length > 0 ? Math.max(...ingredients.map(i => i.id)) + 1 : 1,
                name: name.trim(),
                quantity: quantity.trim(),
                checked: false
            };
            setIngredients(prevIngredients => [...prevIngredients, newItem]);
        }
    };

    return (
        <div>
            <header className="header">
                <div className="nav-container">
                    <div className="logo" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> {/* Added flex properties */}
                        <Link to="/HomePage_SignedIn" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <div style={{ display: 'flex'}}>
                              <img className="logo-icon" src="/icons/Logo.png" alt="" style={{ height: '38px', width: '38px', justifyContent: 'center', background: 'none', alignContent: 'center', marginTop: '15px' }} />
                              <div style={{marginLeft: '10px', marginTop: '20px'}}>PLATE UP</div>
                            </div>
                        </Link>
                    </div>
                    <nav>
                        <ul className="nav-links">
                            <li><Link to="/Home">Home</Link></li>
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

            <main>
                <div>
                    <p className="title">Shopping List</p>
                </div>

                <div className="ingredients-box">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2>Ingredients</h2>
                        {ingredients.some(item => item.checked) && (
                            <button
                                onClick={clearCheckedItems}
                                style={{
                                    padding: '5px 10px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                            >
                                Clear Checked
                            </button>
                        )}
                    </div>

                    <ul className="ingredients-list">
                        {ingredients.length > 0 ? (
                            ingredients.map((ingredient) => (
                                <li
                                    key={ingredient.id}
                                    style={{
                                        textDecoration: ingredient.checked ? 'line-through' : 'none',
                                        opacity: ingredient.checked ? 0.6 : 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => toggleIngredient(ingredient.id)}
                                >
                                    <input
                                        type="checkbox"
                                        checked={ingredient.checked}
                                        onChange={() => toggleIngredient(ingredient.id)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <span style={{ flex: 1 }}>{ingredient.name}</span>
                                    <span>{ingredient.quantity}</span>
                                </li>
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', color: '#555' }}>No ingredients in your meal plan. Add some meals to see your shopping list!</p>
                        )}
                    </ul>
                </div>

                <div>
                    <Link to="/meal-planner" className="back-button">Back to Meal Planner</Link>
                </div>
            </main>

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
                    <p>© 2025 Plate Up. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default ShoppingList;
