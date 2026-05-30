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