import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import App from "./App";
import AboutUsSignedIn from "./pages/AboutUs_S";
import AboutUs from "./pages/AboutUs";
import Favourites from "./pages/Favourites";
import HomePage from "./pages/HomePage";
import MealPlanner from "./pages/MealPlanner";
import Profile from "./pages/Profile";
import Quiz from "./pages/Quiz";
import Recipes_S from "./pages/Recipe_S";
import Recipes from "./pages/Recipes";
import RecipeView from "./pages/RecipeView";
import ShoppingList from "./pages/ShoppingList";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route index element={<App />} />
          <Route path="/About-Us-User" element={<AboutUsSignedIn />} />
          <Route path="/About-Us" element={<AboutUs />} />
          <Route path="/Favourites" element={<Favourites />} />
          <Route path="/Home" element={<HomePage />} />
          <Route path="/Meal-Planner" element={<MealPlanner />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/Quiz" element={<Quiz />} />
          <Route path="/All-Recipes" element={<Recipes_S />} />
          <Route path="/Recipes" element={<Recipes />} />
          <Route path="/My-Recipes" element={<RecipeView />} />
          <Route path="/Shopping-List" element={<ShoppingList />} />
          <Route path="/Sign-In" element={<SignIn />} />
          <Route path="/Sign-Up" element={<SignUp />} />
          <Route path="/View-Recipe/:id" element={<RecipeView />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
