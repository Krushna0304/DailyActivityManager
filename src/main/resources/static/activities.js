// Global activities array
let activities = [];

// DOM elements
const activityForm = document.getElementById('activityForm');
const activityNameInput = document.getElementById('activityName');
const activityList = document.getElementById('activityList');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadActivities();
    activityForm.addEventListener('submit', handleAddActivity);
    activityNameInput.addEventListener('input', hideMessages);
});

// Load activities from backend
async function loadActivities() {
    const userId = localStorage.getItem('userId');
    console.log('Loaded userId from localStorage:', userId);
    if (!userId) {
        showError('User not logged in. Please log in first.');
        // Redirect to login page if needed
         window.location.href = 'index.html';
        return;
    }

    try {
        const res = await fetch(`http://localhost:8082/api/activities?userId=${userId}`);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();

        // Map API data to local activities array format
        // Adjusting for your backend Activity entity structure
        activities = data.map(act => ({
            id: act.id,
            name: act.activityName, // Backend uses 'activityName' field
            createdAt: act.createdAt || new Date().toISOString(),
            totalSessions: act.totalSessions || 0,
            totalMinutes: act.totalMinutes || 0,
            userId: act.user ? act.user.id : userId // Backend has nested user object
        }));

        renderActivities();
    } catch (err) {
        console.error('Error loading activities:', err);
        showError('Failed to load activities. Please try again.');
    }
}

// Render activities UI
function renderActivities() {
    activityList.innerHTML = '';

    if (activities.length === 0) {
        activityList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <div class="empty-state-text">No activities yet</div>
                <div class="empty-state-subtext">Add your first activity to get started</div>
            </div>
        `;
        return;
    }

    activities.forEach(activity => {
        const li = document.createElement('li');
        li.className = 'activity-item';
        li.setAttribute('data-activity-id', activity.id);
        li.innerHTML = `
            <div class="activity-info">
                <div class="activity-name">${escapeHtml(activity.name)}</div>
                <input type="text" class="edit-input" value="${escapeHtml(activity.name)}">
                <div class="activity-meta">
                    <span>Created: ${formatDate(activity.createdAt)}</span>
                    <span>${activity.totalSessions} sessions</span>
                    <span>${activity.totalMinutes} minutes total</span>
                </div>
            </div>
            <div class="activity-actions">
                <button class="btn-edit" onclick="editActivity(${activity.id})">Edit</button>
                <button class="btn-delete" onclick="deleteActivity(${activity.id})">Delete</button>
            </div>
            <div class="edit-actions">
                <button class="btn-save" onclick="saveActivity(${activity.id})">Save</button>
                <button class="btn-cancel" onclick="cancelEdit(${activity.id})">Cancel</button>
            </div>
        `;
        activityList.appendChild(li);
    });
}

// Add new activity
async function handleAddActivity(e) {
    e.preventDefault();
    const activityName = activityNameInput.value.trim();

    if (!activityName) {
        showError('Please enter an activity name');
        return;
    }

    // Prevent duplicates (case-insensitive)
    if (activities.some(act => act.name.toLowerCase() === activityName.toLowerCase())) {
        showError('An activity with this name already exists');
        return;
    }

    const button = activityForm.querySelector('button');
    button.classList.add('loading');
    button.disabled = true;

    try {
        const userId = localStorage.getItem('userId');

        // Create request body matching your backend Activity entity
        const requestBody = {
            activityName: activityName,
            user: {
                id: Number(userId) // Convert userId to number explicitly
            }
        };

        const res = await fetch("http://localhost:8082/api/activities", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!res.ok) {
            const errorData = await res.text();
            throw new Error(`Failed to add activity: ${errorData}`);
        }

        const newActivity = await res.json();

        // Add new activity to local array
        activities.unshift({
            id: newActivity.id,
            name: newActivity.activityName,
            createdAt: newActivity.createdAt,
            totalSessions: newActivity.totalSessions || 0,
            totalMinutes: newActivity.totalMinutes || 0,
            userId: newActivity.user ? newActivity.user.id : userId
        });

        renderActivities();
        activityForm.reset();
        showSuccess(`"${activityName}" added successfully!`);
    } catch (err) {
        console.error('Error adding activity:', err);
        showError(err.message || 'Failed to add activity. Please try again.');
    } finally {
        button.classList.remove('loading');
        button.disabled = false;
    }
}

// Edit activity
function editActivity(id) {
    const item = findActivityElement(id);
    if (item) {
        item.classList.add('editing');
        const input = item.querySelector('.edit-input');
        input.focus();
        input.select();
    }
}

// Save edited activity (client-side only since backend doesn't support PUT)
async function saveActivity(id) {
    const item = findActivityElement(id);
    if (!item) return;

    const input = item.querySelector('.edit-input');
    const newName = input.value.trim();

    if (!newName) {
        showError('Activity name cannot be empty');
        return;
    }

    // Check for duplicates (excluding current activity)
    if (activities.some(a => a.id !== id && a.name.toLowerCase() === newName.toLowerCase())) {
        showError('An activity with this name already exists');
        return;
    }

    // Since backend doesn't have PUT endpoint, we'll update locally only
    // In a real application, you'd want to add PUT endpoint to your controller
    const activity = activities.find(a => a.id === id);
    if (activity) {
        const oldName = activity.name;
        activity.name = newName;
        renderActivities();
        showSuccess(`"${oldName}" renamed to "${newName}" (Note: Changes are local only - backend update endpoint needed)`);

        // Optional: You could implement this by deleting and re-creating the activity
        // But that would change the ID, so we'll keep it client-side only for now
    }
}

// Cancel edit
function cancelEdit(id) {
    const item = findActivityElement(id);
    const activity = activities.find(a => a.id === id);
    if (item && activity) {
        item.classList.remove('editing');
        item.querySelector('.edit-input').value = activity.name;
    }
}

// Delete activity (client-side only since backend doesn't support DELETE)
async function deleteActivity(id) {
    const activity = activities.find(a => a.id === id);
    if (!activity) return;

    if (!confirm(`Are you sure you want to delete "${activity.name}"? This action cannot be undone. (Note: This will only remove from local view - backend delete endpoint needed)`)) {
        return;
    }

    // Since backend doesn't have DELETE endpoint, we'll remove locally only
    // In a real application, you'd want to add DELETE endpoint to your controller
    activities = activities.filter(a => a.id !== id);
    renderActivities();
    showSuccess(`"${activity.name}" deleted successfully (Note: Deleted locally only - backend delete endpoint needed)`);
}

// Helper functions
function findActivityElement(id) {
    return document.querySelector(`[data-activity-id="${id}"]`);
}

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (err) {
        return 'Invalid Date';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showSuccess(message) {
    hideMessages();
    successMessage.textContent = message;
    successMessage.classList.add('show');
    setTimeout(() => successMessage.classList.remove('show'), 5000);
}

function showError(message) {
    hideMessages();
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    setTimeout(() => errorMessage.classList.remove('show'), 5000);
}

function hideMessages() {
    successMessage.classList.remove('show');
    errorMessage.classList.remove('show');
}

// Handle Enter & Escape in edit inputs
document.addEventListener('keydown', e => {
    if (!e.target.classList.contains('edit-input')) return;

    const item = e.target.closest('.activity-item');
    if (!item) return;

    if (e.key === 'Enter') {
        e.preventDefault();
        item.querySelector('.btn-save').click();
    } else if (e.key === 'Escape') {
        e.preventDefault();
        item.querySelector('.btn-cancel').click();
    }
});