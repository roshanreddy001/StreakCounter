import React, { useMemo, useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { Award, Zap, Target, Flame, Lock, CheckCircle, Sparkles, Plus } from 'lucide-react';
import { generateBadgeDetails } from '../services/gemini';
import { getUserData, saveUserData } from '../utils/storage';
import './Achievements.css';

const INITIAL_BADGES = [
    {
        id: 'starter',
        name: 'Getting Started',
        description: 'Maintain a 3-day streak on any task',
        icon: Zap,
        requiredStreak: 3,
        color: '#F59E0B'
    },
    {
        id: 'consistent',
        name: 'Consistent',
        description: 'Reach a 7-day streak on any task',
        icon: Target,
        requiredStreak: 7,
        color: '#3B82F6'
    },
    {
        id: 'focused',
        name: 'Focused',
        description: 'Keep the momentum for 14 days',
        icon: Award,
        requiredStreak: 14,
        color: '#8B5CF6'
    },
    {
        id: 'unstoppable',
        name: 'Unstoppable',
        description: 'Achieve a legendary 30-day streak',
        icon: Flame,
        requiredStreak: 30,
        color: '#EF4444'
    }
];

export default function Achievements() {
    const { tasks } = useTasks();
    const { user } = useAuth();
    const [badges, setBadges] = useState(INITIAL_BADGES);
    const [isGenerating, setIsGenerating] = useState(false);

    // MAX STREAK
    const maxStreak = useMemo(() => {
        if (!tasks || tasks.length === 0) return 0;
        return Math.max(...tasks.map(t => t.streak || 0));
    }, [tasks]);

    // LOAD SAVED BADGES (User Scoped)
    useEffect(() => {
        if (!user) return;

        const savedBadges = getUserData('achievements', user); // Using 'achievements' as baseKey key
        // Note: Legacy key was 'generated_badges' global. We ignore it now for correct scoping.

        if (savedBadges && Array.isArray(savedBadges)) {
            // Re-attach icons
            const processed = savedBadges.map(b => ({
                ...b,
                icon: Sparkles,
                color: '#10B981',
                isGenerated: true
            }));
            setBadges([...INITIAL_BADGES, ...processed]);
        } else {
            setBadges(INITIAL_BADGES);
        }
    }, [user]);

    const unlockedCount = badges.filter(b => maxStreak >= b.requiredStreak).length;

    const handleGenerateBadge = async () => {
        if (!user) return;
        setIsGenerating(true);
        try {
            const existingNames = badges.map(b => b.name);
            const newBadgeData = await generateBadgeDetails(existingNames);

            const newBadge = {
                id: `gen_${Date.now()}`,
                name: newBadgeData.name,
                description: newBadgeData.description,
                requiredStreak: newBadgeData.requiredStreak,
                icon: Sparkles,
                color: '#10B981',
                isGenerated: true
            };

            const updatedBadges = [...badges, newBadge];
            setBadges(updatedBadges);

            // Save ONLY custom badges to localStorage
            const customBadges = updatedBadges.filter(b => b.isGenerated);
            saveUserData('achievements', user, customBadges);

        } catch (error) {
            console.error("Failed to generate badge", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="achievements-container">
            <header className="achievements-header">
                <h1>Achievements</h1>
                <p>Unlock badges by maintaining consistency in your tasks.</p>
                <button
                    className="generate-btn"
                    onClick={handleGenerateBadge}
                    disabled={isGenerating}
                >
                    {isGenerating ? (
                        <>Generating... <Sparkles className="spin" size={16} /></>
                    ) : (
                        <>Generate New Badge <Plus size={16} /></>
                    )}
                </button>
            </header>

            <div className="stats-overview">
                <div className="stat-card">
                    <span className="stat-value">{maxStreak}</span>
                    <span className="stat-label">Best Streak</span>
                </div>
                <div className="stat-card">
                    <span className="stat-value">{unlockedCount} / {badges.length}</span>
                    <span className="stat-label">Badges Unlocked</span>
                </div>
            </div>

            <div className="badges-grid">
                {badges.map((badge, index) => {
                    const isUnlocked = maxStreak >= badge.requiredStreak;
                    const Icon = badge.icon;
                    const progress = Math.min(100, (maxStreak / badge.requiredStreak) * 100);

                    return (
                        <div
                            key={badge.id}
                            className={`badge-card ${isUnlocked ? 'unlocked' : 'locked'} ${badge.isGenerated ? 'generated-badge' : ''}`}
                            style={{ animationDelay: `${index * 60}ms` }}
                        >
                            <div className={`status-badge ${isUnlocked ? 'unlocked' : 'locked'}`}>
                                {isUnlocked ? (
                                    <><CheckCircle size={12} style={{ marginRight: '4px', verticalAlign: 'text-top' }} /> Unlocked</>
                                ) : (
                                    <><Lock size={12} style={{ marginRight: '4px', verticalAlign: 'text-top' }} /> Locked</>
                                )}
                            </div>

                            <div className="badge-icon-wrapper">
                                <Icon size={40} />
                            </div>

                            <h3 className="badge-name">{badge.name}</h3>
                            <p className="badge-description">{badge.description}</p>

                            <div className="progress-indicator">
                                <span className="progress-text">
                                    {isUnlocked
                                        ? "Completed"
                                        : `${maxStreak}/${badge.requiredStreak} Days`
                                    }
                                </span>
                                <div className="progress-bar-bg">
                                    <div
                                        className="progress-bar-fill"
                                        style={{
                                            width: `${progress}%`,
                                            background: isUnlocked ? `linear-gradient(90deg, ${badge.color}, ${badge.color}dd)` : undefined
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
