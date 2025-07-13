import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/AboutUs.css'; 

const AboutUs = () => {
  const values = [
    {
      id: 1,
      icon: '/icons/triangle-icon.png',
      title: 'Simplicity',
      description: 'We make healthy eating easy, accessible, and stress-free for everyone.',
      className: 'value-icon'
    },
    {
      id: 2,
      icon: '/icons/scale.png',
      title: 'Balance',
      description: 'Our platform encourages balanced nutrition and sustainable habits.',
      className: 'value-icon'
    },
    {
      id: 3,
      icon: '/icons/trend-up-icon.png',
      title: 'Inspiration',
      description: 'We provide creative ideas and tools to keep you motivated in the kitchen.',
      className: 'trend'
    },
    {
      id: 4,
      icon: '/icons/black-heart.png',
      title: 'Support',
      description: 'Enjoy a supportive community and expert guidance every step of the way.',
      className: 'value-icon'
    }
  ];


  return (
    <div style={{backgroundColor:'#f8fffe'}}>
      {/* Header */}
      <header className="header">
        <div className="nav-container">
          <div className="logo">
            {/* Logo linking to the public home page */}
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src="/icons/Logo.png" alt="Logo" className="logo-img" style={{height: '38px', width: '38px'}} />
              PLATE UP
            </Link>
          </div>
          <nav>
            <ul className="nav-links">
              {/* Home link */}
              <li><Link to="/">Home</Link></li> 
              {/* Recipes link */}
              <li><Link to="/Recipes">Recipes</Link></li> 
              {/* About link should be active on this page */}
              <li><Link to="/About-Us" className="active">About</Link></li> 
            </ul>
          </nav>
          <div className="auth-buttons">
            <Link to="/Sign-In" className="btn-signin">Sign In</Link>
            <Link to="/Sign-Up" className="btn-started">Get Started</Link> {/* Changed from Sign-up to /signup */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <h1>About Us</h1>
        <p className="about-intro">
          At <span className="brand">Plate Up</span>, we believe that nourishing your body should be simple, empowering, and joyful. Our platform is designed to help you discover delicious recipes, prep smarter, and build sustainable habits that fit your unique lifestyle.
        </p>

        <h2 className="about-green">Our Mission</h2>
        <p>
          To simplify healthy eating and meal prepping by offering personalized, practical, and inspiring solutions that support your goals—whether you're cooking for one or a whole family.
        </p>

        <h2 className="about-green">Our Vision</h2>
        <p>
          We envision a world where preparing nutritious meals is second nature—a world where everyone feels confident in the kitchen, inspired by food, and supported in their wellness journey.
        </p>

        <div className="about-story">
          <h3>Our Story</h3>
          <p>
            The idea for <span className="brand">Plate Up</span> started with a common frustration: eating well shouldn't feel like a chore. Too often, busy schedules, limiting options, or lack of inspiration get in the way of healthy choices. We knew there had to be a better way.
          </p>
          <p>
            So, a passionate team of nutrition experts, cooks, and creatives came together with one shared goal—to remove the stress from meal prepping and make wholesome eating something to look forward to. From its start as a small project, this vision has evolved into a trusted resource for thousands of people looking to eat better, waste less, and save time.
          </p>
        </div>

        <h2 className="values-title">Our Values</h2>
        <div className="values">
          {values.map((value) => (
            <div key={value.id} className="value-card">
              <img 
                src={value.icon} 
                alt={value.title} 
                className={value.className}
              />
              <h4>{value.title}</h4>
              <p>{value.description}</p>
            </div>
          ))}
        </div>

        <div className="about-join">
          <h3>Join Us</h3>
          <p>
            Whether you're new to meal prepping or a seasoned home chef, <span className="brand">Plate Up</span> is here to help you take the guesswork out of healthy eating. Start your journey today and discover how delicious balance can be.
          </p>
          {/* Replaced button with Link directly around it, removed onClick */}
          <Link to="/signup"> {/* Changed from /Sign-up to /signup */}
            <button className="btn btn-getstarted">
              Get Started Today
            </button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div>
            <div className="footer-brand">
              {/* Footer logo linking to public home page */}
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <img src="/icons/Logo.png" alt="Logo" className="logo-img" style={{height: '38px', width: '38px'}} />
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
              {/* Changed to Link with correct 'to' prop and proper list item structure */}
              <li>
                <Link to="/Recipes" style={{textDecoration: 'none', color: '#a0aec0'}}>
                  Recipe Search
                </Link>
              </li>
              <li>
                {/* Meal Planning for public users leads to signin */}
                <Link to="/Sign-In" style={{textDecoration: 'none', color: '#a0aec0'}}>
                  Meal Planning
                </Link>
              </li>
              <li>
                {/* Shopping Lists for public users leads to signin */}
                <Link to="/Sign-In" style={{textDecoration: 'none', color: '#a0aec0'}}>
                  Shopping Lists
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Support</h3>
            <ul className="footer-links">
              {/* External links should remain <a> tags with appropriate hrefs */}
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

export default AboutUs;