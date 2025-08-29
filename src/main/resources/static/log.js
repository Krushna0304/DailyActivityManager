// You can add a log form to dashboard.html and implement similar logic to activities.js for logging activities.
// For now, this file is a placeholder for future logging functionality.
// This file enables logging activities from other pages if needed.
// Example: You can import and use these functions in dashboard.js or other scripts.

export async function logActivity({ userId, activityId, duration, notes, date }) {
    const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user: { id: userId },
            activity: { id: activityId },
            date,
            duration,
            notes
        })
    });
    return res.ok;
}

// Usage example (in another JS file):
// import { logActivity } from './log.js';
// logActivity({ userId, activityId, duration, notes, date });
