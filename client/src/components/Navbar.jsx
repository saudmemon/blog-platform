import { Link, NavLink } from 'react-router-dom';
import { Plus } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <Link to="/" className="nav-logo">NexusBlog</Link>
                <div className="nav-links">
                    <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Explore</NavLink>
                </div>
                <Link to="/create" className="btn-create btn-icon">
                    <Plus size={18} />
                    <span>Write Post</span>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
