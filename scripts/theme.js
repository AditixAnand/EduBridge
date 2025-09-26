class Theme {
    constructor() {
        this.themeButton = document.getElementById('themeButton');
        this.themeSelector = document.getElementById('themeSelector');
        this.themeOptions = document.querySelectorAll('.theme-option');
        this.currentTheme = localStorage.getItem('theme') || 'light';
    }

    init() {
        // Set initial theme
        this.setTheme(this.currentTheme);

        // Add event listeners
        this.themeButton.addEventListener('click', () => {
            this.themeSelector.classList.toggle('active');
        });

        this.themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.getAttribute('data-theme');
                this.setTheme(theme);
                this.themeSelector.classList.remove('active');
            });
        });

        // Close theme selector when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.themeSelector.contains(e.target) && !this.themeButton.contains(e.target)) {
                this.themeSelector.classList.remove('active');
            }
        });
    }

    setTheme(theme) {
        // Update theme in localStorage
        localStorage.setItem('theme', theme);
        this.currentTheme = theme;

        // Update theme button icon
        const icon = this.themeButton.querySelector('i');
        icon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';

        // Update theme options
        this.themeOptions.forEach(option => {
            const optionIcon = option.querySelector('i');
            if (option.getAttribute('data-theme') === theme) {
                option.classList.add('active');
                optionIcon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
            } else {
                option.classList.remove('active');
                optionIcon.className = theme === 'light' ? 'far fa-sun' : 'far fa-moon';
            }
        });

        // Update CSS variables
        const root = document.documentElement;
        if (theme === 'dark') {
            root.style.setProperty('--bg-color', '#1a1a1a');
            root.style.setProperty('--text-color', '#ffffff');
            root.style.setProperty('--primary-color', '#4a90e2');
            root.style.setProperty('--secondary-color', '#2c3e50');
            root.style.setProperty('--card-bg', '#2d2d2d');
            root.style.setProperty('--border-color', '#404040');
            root.style.setProperty('--hover-color', '#3d3d3d');
        } else {
            root.style.setProperty('--bg-color', '#ffffff');
            root.style.setProperty('--text-color', '#333333');
            root.style.setProperty('--primary-color', '#4a90e2');
            root.style.setProperty('--secondary-color', '#2c3e50');
            root.style.setProperty('--card-bg', '#f5f5f5');
            root.style.setProperty('--border-color', '#e0e0e0');
            root.style.setProperty('--hover-color', '#f0f0f0');
        }
    }
} 