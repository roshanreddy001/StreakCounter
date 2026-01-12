import React from 'react';
import { Moon, Sun, Sparkles, LogOut, BarChart2, Trophy, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
    const { isDark, toggleTheme } = useTheme();
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-brand">
                <Sparkles size={24} />
                <span>StreakCounter</span>
            </Link>

            <div className="navbar-actions">
                <Link to="/achievements" className="nav-link icon-link" title="Achievements">
                    <Trophy size={20} />
                    <span className="mobile-hidden">Badges</span>
                </Link>
                <Link to="/history" className="nav-link icon-link" title="History">
                    <Calendar size={20} />
                    <span className="mobile-hidden">History</span>
                </Link>
                <Link to="/insights" className="nav-link icon-link" title="Insights">
                    <BarChart2 size={20} />
                    <span className="mobile-hidden">Insights</span>
                </Link>
                <Link to="/about" className="nav-link">
                    About Project
                </Link>
                <button
                    onClick={toggleTheme}
                    className="theme-toggle"
                    aria-label="Toggle theme"
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                {user && (
                    <button
                        onClick={handleLogout}
                        className="theme-toggle"
                        aria-label="Logout"
                        title="Sign Out"
                    >
                        <LogOut size={20} />
                    </button>
                )}
            </div>
        </nav>
    );
}
