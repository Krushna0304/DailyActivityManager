// Global variables
let activityChart;

async function loadDashboard() {
    const userId = localStorage.getItem('userId');
    try {
        const res = await fetch(`http://43.204.36.150:8080/api/logs/summary?userId=${userId}&range=daily`);
        if (!res.ok) throw new Error('Failed to load dashboard data');
        const data = await res.json();

        // Summary
        let summaryHtml = '<h3>Today\'s Summary</h3><ul>';
        Object.entries(data.summary).forEach(([activity, minutes]) => {
            summaryHtml += `<li>${activity}: ${minutes} min</li>`;
        });
        summaryHtml += '</ul>';
        document.getElementById('summary').innerHTML = summaryHtml;

        // Streaks
        let streakHtml = '<h3>Streaks</h3><ul>';
        Object.entries(data.streaks).forEach(([activity, streak]) => {
            streakHtml += `<li>${activity}: ${streak} days</li>`;
        });
        streakHtml += '</ul>';
        document.getElementById('streaks').innerHTML = streakHtml;

        // Update chart
        updateChart(data.summary);
    } catch (err) {
        console.error('Error loading dashboard:', err);
    }
}

function updateChart(summaryData) {
    const ctx = document.getElementById('activityChart').getContext('2d');

    if (activityChart) {
        activityChart.destroy();
    }

    activityChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(summaryData),
            datasets: [{
                data: Object.values(summaryData),
                backgroundColor: [
                    '#ff6b6b',
                    '#4ecdc4',
                    '#45b7d1',
                    '#f7b731',
                    '#5f27cd',
                    '#a8e6cf'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

async function loadActivitiesForLogForm() {
    const userId = localStorage.getItem('userId');
    try {
        const res = await fetch(`http://43.204.36.150:8080/api/activities?userId=${userId}`);
        if (!res.ok) throw new Error('Failed to load activities');
        const activities = await res.json();

        const select = document.getElementById('activitySelect');
        select.innerHTML = '<option value="">Select an activity...</option>';
        activities.forEach(act => {
            const option = document.createElement('option');
            option.value = act.id;
            option.textContent = act.activityName;
            select.appendChild(option);
        });
    } catch (err) {
        console.error('Error loading activities:', err);
        document.getElementById('logError').textContent = 'Failed to load activities';
    }
}

async function handleLogFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const errorDiv = document.getElementById('logError');
    const successDiv = document.getElementById('logSuccess');

    try {
        const userId = localStorage.getItem('userId');
        const activityId = document.getElementById('activitySelect').value;
        const duration = document.getElementById('duration').value;
        const notes = document.getElementById('notes').value;
        const date = new Date().toISOString().split('T')[0];

        if (!activityId || !duration) {
            errorDiv.textContent = 'Please fill in all required fields';
            errorDiv.classList.add('show');
            return;
        }

        const res = await fetch('http://43.204.36.150:8080/api/logs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: Number(userId),
                activityId: Number(activityId),
                date: date,
                duration: Number(duration),
                notes: notes || ''
            })
        });

        if (!res.ok) throw new Error('Failed to log activity');

        // Clear form and show success message
        form.reset();
        successDiv.textContent = 'Activity logged successfully!';
        successDiv.classList.add('show');
        errorDiv.classList.remove('show');

        // Refresh dashboard
        await loadDashboard();
    } catch (err) {
        console.error('Error logging activity:', err);
        errorDiv.textContent = 'Failed to log activity. Please try again.';
        errorDiv.classList.add('show');
        successDiv.classList.remove('show');
    }
}

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', async () => {
    if (!localStorage.getItem('userId')) {
        window.location.href = 'index.html';
        return;
    }

    await loadActivitiesForLogForm();
    await loadDashboard();

    // Add event listeners
    document.getElementById('logForm').addEventListener('submit', handleLogFormSubmit);
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('userId');
        window.location.href = 'index.html';
    });

    // Clear messages on input
    ['activitySelect', 'duration', 'notes'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            document.getElementById('logError').classList.remove('show');
            document.getElementById('logSuccess').classList.remove('show');
        });
    });
});
