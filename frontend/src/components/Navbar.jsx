import { Link, NavLink } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <Link to="/" className="nav-logo" onClick={closeMenu}>NexusBlog</Link>
                
                <div className="nav-links">
                    <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Explore</NavLink>
                </div>

                <Link to="/create" className="btn-create btn-icon">
                    <Plus size={18} />
                    <span>Write Post</span>
                </Link>

                <div className="hamburger" onClick={toggleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>

            <nav className={`nav-menu-mobile ${menuOpen ? 'active' : ''}`}>
                <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} onClick={closeMenu}>
                    Explore
                </NavLink>
                <Link to="/create" className="nav-link" onClick={closeMenu}>
                    Write Post
                </Link>
            </nav>
        </nav>
    );
};

export default Navbar;
