import React from 'react';
import './Footer.css';
import { Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p className="footer-text">
                    Streaks Crafted by <strong>Roshan Reddy</strong>
                </p>
                <div className="footer-links">
                    <span>© {new Date().getFullYear()} StreakCounter</span>
                </div>
            </div>
        </footer>
    );
}
