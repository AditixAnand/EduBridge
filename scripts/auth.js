// User Authentication Functions
class Auth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    }

    // Register a new user
    register(userData) {
        // Check if user already exists
        if (this.users.some(user => user.email === userData.email)) {
            return { success: false, message: 'Email already registered' };
        }

        // Validate password
        if (userData.password !== userData.confirmPassword) {
            return { success: false, message: 'Passwords do not match' };
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email,
            password: userData.password,
            interests: userData.interests,
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));

        return { success: true, message: 'Registration successful' };
    }

    // Login user
    login(email, password) {
        const user = this.users.find(user => user.email === email && user.password === password);
        
        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }

        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', user.name);

        return { success: true, message: 'Login successful' };
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialize auth instance
const auth = new Auth();

// Handle login form submission
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = this.email.value;
    const password = this.password.value;

    const result = auth.login(email, password);
    
    if (result.success) {
        showMessage('success', result.message);
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        showMessage('error', result.message);
    }
});

// Handle registration form submission
document.getElementById('registerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const userData = {
        name: this.name.value,
        email: this.email.value,
        password: this.password.value,
        confirmPassword: this.confirmPassword.value,
        interests: Array.from(this.interests.selectedOptions).map(option => option.value)
    };

    const result = auth.register(userData);
    
    if (result.success) {
        showMessage('success', result.message);
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    } else {
        showMessage('error', result.message);
    }
});

// Show message to user
function showMessage(type, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = message;

    const form = document.querySelector('.auth-form');
    form.insertAdjacentElement('beforebegin', messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
} 