
// Theme Initialization
const currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', (e) => {
        const button = e.currentTarget;
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        const { top, left, width, height } = button.getBoundingClientRect();
        const x = left + width / 2;
        const y = top + height / 2;
        const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
        const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
        const maxRadius = Math.hypot(
          Math.max(x, viewportWidth - x),
          Math.max(y, viewportHeight - y)
        );

        const applyTheme = () => {
          const nextTheme = isDark ? 'light' : 'dark';
          document.documentElement.setAttribute('data-theme', nextTheme);
          localStorage.setItem('theme', nextTheme);
        };

        if (typeof document.startViewTransition !== 'function') {
          applyTheme();
          return;
        }

        const transition = document.startViewTransition(() => {
          applyTheme();
        });

        transition.ready.then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${maxRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 400,
              easing: 'ease-in-out',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        });
      });
    }
});

// Check if user is logged in
function checkAuthState() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
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
            
            // Add event listeners for the new profile section
            const profileButton = document.getElementById('profileButton');
            const logoutButton = document.getElementById('logoutButton');
            
            profileButton.addEventListener('click', function(e) {
                e.stopPropagation();
                profileButton.classList.toggle('active');
            });
            
            logoutButton.addEventListener('click', function(e) {
                e.preventDefault();
                const auth = new Auth();
                auth.logout();
                window.location.href = 'index.html';
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', function() {
                profileButton.classList.remove('active');
            });
        }
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
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    checkAuthState();
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

    // Toggle chatbot visibility
    if (chatbotButton && chatbotContainer) {
        chatbotButton.addEventListener('click', () => {
            chatbotContainer.classList.add('show');
        });
    }

    if (closeChatbot && chatbotContainer) {
        closeChatbot.addEventListener('click', () => {
            chatbotContainer.classList.remove('show');
        });
    }

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
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }
    
    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
}); 