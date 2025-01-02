import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/img/svg/logo.svg";
import { FaAlignRight, FaUserCircle } from "react-icons/fa";

export default class Navbar extends Component {
  state = {
    isOpen: false,
    isProfileMenuOpen: false,
  };

  handleToggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  handleProfileClick = () => {
    this.setState((prevState) => ({
      isProfileMenuOpen: !prevState.isProfileMenuOpen,
    }));
  };

  handleLogout = () => {
    // Clear token and navigate to login
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    window.location.href = "/login";
  };

  render() {
    return (
      <nav className="navbar">
        <div className="nav-center">
          <div className="nav-header">
            {/* App logo */}
            <Link to="/">
              <img src={Logo} alt="Reach Resort" />
            </Link>
            {/* Navbar toggle button */}
            <button
              type="button"
              className="nav-btn"
              onClick={this.handleToggle}
            >
              <FaAlignRight className="nav-icon" />
            </button>
          </div>
          {/* Navbar links */}
          <ul
            className={this.state.isOpen ? "nav-links show-nav" : "nav-links"}
          >
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/rooms">Rooms</Link>
            </li>
            <li>
              <Link to="/about-us">About Us</Link>
            </li>
            <li>
              <Link to="/contact-us">Contact Us</Link>
            </li>
            {!localStorage.getItem("token") && (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>

          {/* Always show profile icon */}
          <div className="user-profile">
            <FaUserCircle
              size={40} // Adjust size
              color="var(--primaryColor)" // Adjust color
              onClick={this.handleProfileClick}
            />
            {this.state.isProfileMenuOpen && (
              <div className="profile-dropdown">
                {localStorage.getItem("token") ? (
                  <>
                    <Link to="/profile">View Profile</Link>
                    <button onClick={this.handleLogout}>Logout</button>
                  </>
                ) : (
                  <Link to="/login">Login</Link>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  }
}
