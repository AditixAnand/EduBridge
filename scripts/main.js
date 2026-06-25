// Check if user is logged in
function checkAuthState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    let currentUser = null;
    try {
        currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    } catch (error) {
        currentUser = null;
    }

    // Derive admin from server-authoritative role when present. Do not trust a raw localStorage flag.
    const isAdmin = isLoggedIn && !!(currentUser && currentUser.role === 'admin');
    const authButtons = document.getElementById('authButtons');
    const navLinks = document.querySelector('.nav-links');
    
    if (isLoggedIn) {
        // Hide auth buttons
        if (authButtons) {
            authButtons.style.display = 'none';
        }
        
        // Remove any duplicate auth buttons
        const allAuthLinks = document.querySelectorAll('.nav-links li:has(a[href="login.html"])');
        allAuthLinks.forEach(link => {
            if (link !== authButtons) {
                link.remove();
            }
        });
        
        // Create profile section if it doesn't exist
        if (!document.getElementById('profileSection')) {
            const profileSection = document.createElement('li');
            profileSection.className = 'profile-section';
            profileSection.id = 'profileSection';
            
            profileSection.innerHTML = `
                <div class="profile-button" id="profileButton">
                    <div class="avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <span class="username">${localStorage.getItem('username') || 'User'}</span>
                    <div class="profile-dropdown">
                        <ul>
                            <li>
                                <a href="profile.html">
                                    <i class="fas fa-user-circle"></i>
                                    Profile
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <i class="fas fa-cog"></i>
                                    Settings
                                </a>
                            </li>
                            <li>
                                <a href="#">
                                    <i class="fas fa-book"></i>
                                    My Courses
                                </a>
                            </li>
                            <li class="divider"></li>
                            <li>
                                <a href="#" id="logoutButton">
                                    <i class="fas fa-sign-out-alt"></i>
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            `;
            
            navLinks.appendChild(profileSection);
            
            // Add event listeners for the new profile section (guard nodes)
            const profileButton = document.getElementById('profileButton');
            const logoutButton = document.getElementById('logoutButton');
            if (profileButton) {
                profileButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    profileButton.classList.toggle('active');
                });

                // Close dropdown when clicking outside
                document.addEventListener('click', function() {
                    profileButton.classList.remove('active');
                });
            }

            if (logoutButton) {
                logoutButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    const auth = new Auth();
                    auth.logout();
                    window.location.href = 'index.html';
                });
            }
        }

        updateProfileAdminLink(isAdmin);
    } else {
        // Show auth buttons
        if (authButtons) {
            authButtons.style.display = 'block';
        }
        
        // Remove profile section if it exists
        const profileSection = document.getElementById('profileSection');
        if (profileSection) {
            profileSection.remove();
        }
    }

    updateAdminNavLink(isAdmin);
}

function updateAdminNavLink(isAdmin) {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) {
        return;
    }

    const existing = document.getElementById('adminNavLink');
    if (!isAdmin && existing) {
        existing.remove();
        return;
    }

    if (isAdmin && !existing) {
        const adminNav = document.createElement('li');
        adminNav.id = 'adminNavLink';
        adminNav.innerHTML = `
            <a href="admin.html">
                <i class="fas fa-shield-alt"></i>
                Admin
            </a>
        `;

        const themeSelector = document.getElementById('themeSelector');
        const themeItem = themeSelector ? themeSelector.closest('li') : null;
        if (themeItem) {
            navLinks.insertBefore(adminNav, themeItem);
        } else {
            navLinks.appendChild(adminNav);
        }
    }
}

function updateProfileAdminLink(isAdmin) {
    const dropdown = document.querySelector('#profileSection .profile-dropdown ul');
    if (!dropdown) {
        return;
    }

    const existing = document.getElementById('profileAdminLink');
    if (!isAdmin && existing) {
        existing.remove();
        return;
    }

    if (isAdmin && !existing) {
        const adminItem = document.createElement('li');
        adminItem.id = 'profileAdminLink';
        adminItem.innerHTML = `
            <a href="admin.html">
                <i class="fas fa-shield-alt"></i>
                Admin Dashboard
            </a>
        `;

        const divider = dropdown.querySelector('.divider');
        if (divider) {
            dropdown.insertBefore(adminItem, divider);
        } else {
            dropdown.appendChild(adminItem);
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuthState();
});

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const primaryNavigation = document.getElementById('primaryNavigation');

    if (!navToggle || !primaryNavigation) {
        return;
    }

    navToggle.addEventListener('click', function() {
        const isExpanded = primaryNavigation.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', String(isExpanded));
    });

    primaryNavigation.addEventListener('click', function(event) {
        if (event.target.closest('a')) {
            primaryNavigation.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            primaryNavigation.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    });
});

// Check auth state periodically
setInterval(checkAuthState, 1000);

// Chatbot functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatbotContainer = document.getElementById('chatbotContainer');
    const chatbotButton = document.getElementById('chatbotButton');
    const closeChatbot = document.getElementById('closeChatbot');
    const sendBtn = document.getElementById('sendBtn');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotMessages = document.getElementById('chatbotMessages');

    // Guard: only wire chatbot behavior if required nodes exist
    if (chatbotContainer && chatbotButton && closeChatbot && sendBtn && chatbotInput && chatbotMessages) {
        // Toggle chatbot visibility
        chatbotButton.addEventListener('click', () => {
            chatbotContainer.classList.add('show');
        });

        closeChatbot.addEventListener('click', () => {
            chatbotContainer.classList.remove('show');
        });

        // Send message
        function sendMessage() {
            const message = chatbotInput.value.trim();
            if (message) {
                // Add user message
                const userMessage = document.createElement('div');
                userMessage.className = 'message user-message';
                userMessage.textContent = message;
                chatbotMessages.appendChild(userMessage);

                // Clear input
                chatbotInput.value = '';

                // Scroll to bottom
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

                // Simulate bot response (replace with actual API call)
                setTimeout(() => {
                    const botMessage = document.createElement('div');
                    botMessage.className = 'message bot-message';
                    botMessage.textContent = 'I am a simple chatbot. For full functionality, please implement the backend API.';
                    chatbotMessages.appendChild(botMessage);
                    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                }, 1000);
            }
        }

        // Send message on button click or Enter key
        sendBtn.addEventListener('click', sendMessage);
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});

// Learning Hub tab logic for index.html
function initLearningHub() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-content');
    const calendarForm = document.getElementById('calendarForm');
    const calendarEventsContainer = document.getElementById('calendarEvents');
    const clearAllEventsButton = document.getElementById('clearAllEventsBtn');
    const scheduledCount = document.getElementById('scheduledCount');
    const currentSessionPanel = document.getElementById('currentSessionPanel');

    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetId = button.getAttribute('data-tab');
                setActiveLearningTab(targetId, tabButtons, tabPanels);
            });
        });
    }

    const scheduleCourseButtons = document.querySelectorAll('.schedule-course-btn');
    if (scheduleCourseButtons.length > 0) {
        scheduleCourseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const topic = button.dataset.topic || 'Study session';
                const topicInput = document.getElementById('calendarTopic');
                if (topicInput) {
                    topicInput.value = `Study ${topic}`;
                }
                updateCurrentSessionPanel(`Current session: Study ${topic}`);
                setActiveLearningTab('calendarTab', tabButtons, tabPanels);
                const startDateInput = document.getElementById('calendarStartDate');
                if (startDateInput) {
                    startDateInput.focus();
                }
            });
        });
    }

    if (calendarForm) {
        calendarForm.addEventListener('submit', handleCalendarFormSubmit);
    }

    if (clearAllEventsButton) {
        clearAllEventsButton.addEventListener('click', () => clearAllCalendarEvents(calendarEventsContainer, scheduledCount, currentSessionPanel));
    }

    if (calendarEventsContainer) {
        calendarEventsContainer.addEventListener('click', handleCalendarEventClick);
        renderCalendarEventsOnHome(calendarEventsContainer, scheduledCount, currentSessionPanel);
    }

    function setActiveLearningTab(activeId, buttons, panels) {
        buttons.forEach(btn => {
            const tabId = btn.getAttribute('data-tab');
            const isActive = tabId === activeId;
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-selected', String(isActive));
        });

        panels.forEach(panel => {
            panel.classList.toggle('active', panel.id === activeId);
        });
    }

    function handleCalendarFormSubmit(event) {
        event.preventDefault();
        const startDateInput = document.getElementById('calendarStartDate');
        const endDateInput = document.getElementById('calendarEndDate');
        const startTimeInput = document.getElementById('calendarStartTime');
        const endTimeInput = document.getElementById('calendarEndTime');
        const topicInput = document.getElementById('calendarTopic');
        const eventsContainer = document.getElementById('calendarEvents');

        if (!startDateInput || !endDateInput || !startTimeInput || !endTimeInput || !topicInput || !eventsContainer) {
            return;
        }

        const startDate = startDateInput.value;
        const endDate = endDateInput.value;
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        const eventTopic = topicInput.value.trim();

        if (!startDate || !endDate || !startTime || !endTime || !eventTopic) {
            return;
        }

        if (endDate < startDate || (endDate === startDate && endTime <= startTime)) {
            alert('End date/time must be later than start date/time.');
            return;
        }

        const events = getStoredList('scheduledClasses');
        const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        events.push({ id, startDate, endDate, startTime, endTime, topic: eventTopic });
        localStorage.setItem('scheduledClasses', JSON.stringify(events));

        startDateInput.value = '';
        endDateInput.value = '';
        startTimeInput.value = '';
        endTimeInput.value = '';
        topicInput.value = '';
        updateCurrentSessionPanel(`Current session: ${eventTopic} from ${startDate} ${startTime} to ${endDate} ${endTime}`);
        renderCalendarEventsOnHome(eventsContainer, scheduledCount, currentSessionPanel);
    }

    function renderCalendarEventsOnHome(container, countLabel, sessionLabel) {
        const events = getStoredList('scheduledClasses');

        if (countLabel) {
            countLabel.textContent = `${events.length} session${events.length === 1 ? '' : 's'} scheduled`;
        }

        if (sessionLabel) {
            if (events.length === 0) {
                sessionLabel.textContent = 'No current session selected.';
            } else if (!sessionLabel.textContent || sessionLabel.textContent.startsWith('No current')) {
                const latest = events[events.length - 1];
                sessionLabel.textContent = `Current session: ${latest.topic} from ${latest.startDate} ${latest.startTime} to ${latest.endDate} ${latest.endTime}`;
            }
        }

        if (events.length === 0) {
            container.innerHTML = '<p class="empty-state">No sessions scheduled yet. Use the form above to create one.</p>';
            return;
        }

        container.innerHTML = events
            .sort((a, b) => `${a.startDate} ${a.startTime}`.localeCompare(`${b.startDate} ${b.startTime}`))
            .map(item => `
                <div class="calendar-event-item" data-event-id="${escapeHtml(item.id)}">
                    <div>
                        <strong>${escapeHtml(item.topic)}</strong>
                        <span>${escapeHtml(item.startDate)} ${escapeHtml(item.startTime)} → ${escapeHtml(item.endDate)} ${escapeHtml(item.endTime)}</span>
                    </div>
                    <button type="button" class="btn btn-outline btn-sm remove-event" data-event-id="${escapeHtml(item.id)}">Remove</button>
                </div>
            `).join('');
    }

    function clearAllCalendarEvents(container, countLabel, sessionLabel) {
        localStorage.setItem('scheduledClasses', JSON.stringify([]));
        if (sessionLabel) {
            sessionLabel.textContent = 'No current session selected.';
        }
        renderCalendarEventsOnHome(container, countLabel, sessionLabel);
    }

    function handleCalendarEventClick(event) {
        const button = event.target.closest('.remove-event');
        if (!button) {
            return;
        }

        const eventId = button.getAttribute('data-event-id');
        const eventsContainer = document.getElementById('calendarEvents');
        if (!eventId || !eventsContainer) {
            return;
        }

        deleteCalendarEvent(eventId, eventsContainer, scheduledCount, currentSessionPanel);
    }

    function deleteCalendarEvent(eventId, container, countLabel, sessionLabel) {
        const events = getStoredList('scheduledClasses').filter(item => item.id !== eventId);
        localStorage.setItem('scheduledClasses', JSON.stringify(events));
        renderCalendarEventsOnHome(container, countLabel, sessionLabel);
    }

    function updateCurrentSessionPanel(text) {
        if (!currentSessionPanel) {
            return;
        }
        currentSessionPanel.textContent = text;
    }

    function getStoredList(key) {
        try {
            const stored = JSON.parse(localStorage.getItem(key) || '[]');
            return Array.isArray(stored) ? stored : [];
        } catch (error) {
            return [];
        }
    }

    function escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLearningHub);
} else {
    initLearningHub();
}