import React from "react";
import { Link } from "react-router-dom";
import '../styles/AboutUs.css'; 

function AboutUsSignedIn() {
  return (
    <div style={{backgroundColor: '#f8fffe'}}>
      {/* Header */}
      <header className="header">
        <div className="nav-container">
          <div className="logo">
            <Link to="/Home" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <img
                src="/icons/Logo.png"
                alt="Logo"
                className="logo-img"
                style={{ height: "38px", width: "38px" }}
              />
              PLATE UP
            </Link>
          </div>
          <nav>
            <ul className="nav-links">
              <li><Link to="/Home">Home</Link></li>
              <li><Link to="/All-Recipes">Recipes</Link></li>
              <li><Link to="/Meal-Planner">Meal Plans</Link></li>
              <li><Link to="/Favourites">Favourites</Link></li>
              <li><Link to="/About-Us-User" className="active">About</Link></li>
            </ul>
          </nav>
          <div className="auth-buttons">
            <Link to="/" className="btn-signin">Log Out</Link>
            <Link to="/Profile" className="btn-started">Profile</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content" >
        <h1>About Us</h1>
        <p className="about-intro">
          At <span className="brand">Plate Up</span>, we believe that nourishing your body should be simple, empowering, and joyful. Our platform is designed to help you discover delicious recipes, prep smarter, and build sustainable habits that fit your unique lifestyle.
        </p>

        <h2 className="about-green">Our Mission</h2>
        <p>
          To simplify healthy eating and meal prepping by offering personalized, practical, and inspiring solutions that support your goals—whether you’re cooking for one or a whole family.
        </p>

        <h2 className="about-green">Our Vision</h2>
        <p>
          We envision a world where preparing nutritious meals is second nature—a world where everyone feels confident in the kitchen, inspired by food, and supported in their wellness journey.
        </p>

        <div className="about-story">
          <h3>Our Story</h3>
          <p>
            The idea for <span className="brand">Plate Up</span> started with a common frustration: eating well shouldn’t feel like a chore. Too often, busy schedules, limiting options, or lack of inspiration get in the way of healthy choices. We knew there had to be a better way.
          </p>
          <p>
            So, a passionate team of nutrition experts, cooks, and creatives came together with one shared goal—to remove the stress from meal prepping and make wholesome eating something to look forward to. From its start as a small project, this vision has evolved into a trusted resource for thousands of people looking to eat better, waste less, and save time.
          </p>
        </div>

        <h2 className="values-title">Our Values</h2>
        <div className="values">
          <div className="value-card">
            <img src="/icons/triangle-icon.png" alt="Simplicity" className="value-icon" />
            <h4>Simplicity</h4>
            <p>We make healthy eating easy, accessible, and stress-free for everyone.</p>
          </div>
          <div className="value-card">
            <img src="/icons/scale.png" alt="Balance" className="value-icon" />
            <h4>Balance</h4>
            <p>Our platform encourages balanced nutrition and sustainable habits.</p>
          </div>
          <div className="value-card">
            <img src="/icons/trend-up-icon.png" alt="Inspiration" className="trend" />
            <h4>Inspiration</h4>
            <p>We provide creative ideas and tools to keep you motivated in the kitchen.</p>
          </div>
          <div className="value-card">
            <img src="/icons/black-heart.png" alt="Support" className="value-icon" />
            <h4>Support</h4>
            <p>Enjoy a supportive community and expert guidance every step of the way.</p>
          </div>
        </div>

        <div className="about-join">
          <h3>Join Us</h3>
          <p>
            Whether you’re new to meal prepping or a seasoned home chef, <span className="brand">Plate Up</span> is here to help you take the guesswork out of healthy eating. Start your journey today and discover how delicious balance can be.
          </p>
          <Link to="/Sign-Up">
            <button className="btn btn-getstarted">Get Started Today</button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div>
            <div className="footer-brand">
              <Link to="/Home" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <img
                  src="/icons/Logo.png"
                  alt="Logo"
                  className="logo-img"
                  style={{ height: "38px", width: "38px" }}
                />
                PLATE UP
              </Link>
            </div>
            <p className="footer-description">
              Simplify your healthy eating through personalized meal planning, nutritious recipe discovery, and organized shopping lists.
            </p>
          </div>
          <div className="footer-section">
            <h3>Features</h3>
            <ul className="footer-links">
              <li><Link to="/All-Recipes" style={{ textDecoration: "none", color: "#a0aec0" }}>Recipe Search</Link></li>
              <li><Link to="/Meal-Planner" style={{ textDecoration: "none", color: "#a0aec0" }}>Meal Planning</Link></li>
              <li><Link to="/Shopping-List" style={{ textDecoration: "none", color: "#a0aec0" }}>Shopping Lists</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Support</h3>
            <ul className="footer-links">
              {/* These are external links and should remain <a> tags with appropriate hrefs */}
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
}

export default AboutUsSignedIn;