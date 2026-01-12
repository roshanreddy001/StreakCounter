import React from 'react';
import Navbar from '../components/Navbar';
import { Card } from '../components/ui/Card';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './About.css';

export default function About() {
    return (
        <>
            <Navbar />
            <div className="about-container">
                <Link to="/" className="back-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                    <ArrowLeft size={20} /> Back to Dashboard
                </Link>

                <h1 className="about-title">Why StreakCounter?</h1>

                <Card className="about-card">
                    <p className="about-text">
                        This isn't just a todo list. It's a <strong>Vibe Check</strong>.
                        Standard tools are boring. We wanted something that feels alive,
                        celebrates your wins with fire animations, and keeps you motivated
                        with AI that actually gets you.
                    </p>
                    <p className="about-text">
                        Built with React to be fast, responsive, and aesthetically pleasing.
                    </p>
                </Card>

                <div className="about-footer" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p>Created by Roshan Reddy</p>
                    <p>© 2026</p>
                </div>
            </div>
        </>
    );
}
