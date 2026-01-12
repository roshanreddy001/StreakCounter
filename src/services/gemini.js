/**
 * GEMINI API REMOVED
 * Now serving purely offline motivational quotes.
 */

const MOTIVATION_QUOTES = [
    "Stay consistent! You're doing great.",
    "Small steps every day lead to big results.",
    "Keep this streak alive! You got this.",
    "Consistency is the key to success.",
    "Another day, another victory. Keep going!",
    "You are building a powerful habit.",
    "Don't break the chain! You're on fire.",
    "Success is the sum of small efforts repeated day in and day out.",
    "The secret of your future is hidden in your daily routine.",
    "It’s not about being the best. It’s about being better than you were yesterday.",
    "Action is the foundational key to all success.",
    "Don't wait. The time will never be just right.",
    "Dream big and dare to fail.",
    "Hard work beats talent when talent doesn't work hard.",
    "Focus on being productive instead of busy.",
    "You don’t have to be great to start, but you have to start to be great.",
    "Amateurs sit and wait for inspiration, the rest of us just get up and go to work.",
    "Your limitation—it’s only your imagination.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it.",
    "Success doesn’t just find you. You have to go out and get it.",
    "The harder you work for something, the greater you’ll feel when you achieve it.",
    "Dream bigger. Do bigger.",
    "Don’t stop when you’re tired. Stop when you’re done.",
    "Wake up with determination. Go to bed with satisfaction.",
    "Do something today that your future self will thank you for.",
    "Little things make big days.",
    "It’s going to be hard, but hard does not mean impossible.",
    "Don’t wait for opportunity. Create it.",
    "Sometimes later becomes never. Do it now.",
    "The key to success is to start before you are ready.",
    "Believe you can and you’re halfway there.",
    "Don't let yesterday take up too much of today.",
    "You are capable of amazing things.",
    "Be the energy you want to attract.",
    "Hustle in silence and let your success make the noise.",
    "Motivation is what gets you started. Habit is what keeps you going.",
    "A river cuts through rock, not because of its power, but because of its persistence.",
    "Everything you’ve ever wanted is on the other side of fear.",
    "Opportunities don't happen, you create them.",
    "Don't watch the clock; do what it does. Keep going.",
    "The future depends on what you do today.",
    "Start where you are. Use what you have. Do what you can.",
    "If you fell down yesterday, stand up today.",
    "Strive for progress, not perfection.",
    "There are no shortcuts to any place worth going.",
    "Discipline is the bridge between goals and accomplishment.",
    "Setting goals is the first step in turning the invisible into the visible.",
    "Your only limit is your mind.",
    "Make today so awesome yesterday gets jealous.",
    "One day or day one. You decide.",
    "Quality is not an act, it is a habit."
];

// Returns a random quote
function getRandomQuote() {
    return MOTIVATION_QUOTES[Math.floor(Math.random() * MOTIVATION_QUOTES.length)];
}

export async function getMotivation(streakCount, taskCount) {
    // Simulate async delay slightly for UI feel if needed, or return instant
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(getRandomQuote());
        }, 500); // 500ms delay for "loading" effect
    });
}

export async function generateBadgeDetails(existingNames = []) {
    // Fallback template logic since API is removed
    const getFallbackBadge = () => {
        const templates = [
            { name: "Early Bird", description: "Completed tasks before 8AM 5 times", requiredStreak: 5 },
            { name: "Night Owl", description: "Late night grinding 3 days in a row", requiredStreak: 10 },
            { name: "Weekend Warrior", description: "Kept the streak alive all weekend", requiredStreak: 12 },
            { name: "Marathoner", description: "40 days of pure focus", requiredStreak: 40 },
            { name: "Centurion", description: "The road to 100 begins here", requiredStreak: 50 },
            { name: "Unstoppable Force", description: "Nothing can stop you now", requiredStreak: 25 },
            { name: "Habit Master", description: "Consistency is your middle name", requiredStreak: 21 },
            { name: "Iron Will", description: "Discipline of steel", requiredStreak: 60 },
            { name: "Task Slayer", description: "Crushing goals daily", requiredStreak: 15 },
            { name: "Morning Star", description: "Rising up to the challenge", requiredStreak: 8 }
        ];
        // Filter out existing ones
        const available = templates.filter(t => !existingNames.includes(t.name));
        // Return a random available one, or just random if all taken
        if (available.length > 0) {
            return available[Math.floor(Math.random() * available.length)];
        }
        return templates[Math.floor(Math.random() * templates.length)];
    };

    return new Promise(resolve => {
        setTimeout(() => {
            resolve(getFallbackBadge());
        }, 800);
    });
}
