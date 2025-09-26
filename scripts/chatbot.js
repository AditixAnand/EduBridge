// Chatbot functionality
function initializeChatbot() {
    // Chatbot Toggle
    const chatbotButton = document.getElementById("chatbotButton");
    const chatbotContainer = document.getElementById("chatbotContainer");
    const closeChatbot = document.getElementById("closeChatbot");
    const chatbotMessages = document.getElementById("chatbotMessages");
    const chatbotInput = document.getElementById("chatbotInput");
    const sendBtn = document.getElementById("sendBtn");

    // Check if all required elements exist
    if (!chatbotButton || !chatbotContainer || !closeChatbot || !chatbotMessages || !chatbotInput || !sendBtn) {
        console.error('Chatbot elements not found. Please check the template loading.');
        return;
    }

    // Initialize chatbot container
    chatbotContainer.style.display = 'none';

    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement("div");
        typingDiv.classList.add("typing-indicator");
        typingDiv.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        return typingDiv;
    }

    // Remove typing indicator
    function removeTypingIndicator(typingDiv) {
        if (typingDiv && typingDiv.parentNode) {
            typingDiv.remove();
        }
    }

    // Add bot message
    function addMessage(message, isUser) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");
        messageDiv.classList.add(isUser ? "user-message" : "bot-message");
        messageDiv.innerHTML = message;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Get current page context
    function getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('webdev')) return 'webdev';
        if (path.includes('ai')) return 'ai';
        if (path.includes('career')) return 'career';
        return 'general';
    }

    // Get response based on user input
    function getResponse(userInput, page) {
        const lowerInput = userInput.toLowerCase();
        
        // Course-related Responses
        if (lowerInput.includes('course') || lowerInput.includes('learn') || lowerInput.includes('study') || 
            lowerInput.includes('program') || lowerInput.includes('training') || lowerInput.includes('education')) {
            
            // Web Development Courses
            if (lowerInput.includes('web') || lowerInput.includes('frontend') || lowerInput.includes('backend') || 
                lowerInput.includes('full stack')) {
                if (lowerInput.includes('frontend')) return "Our Frontend Development course covers HTML, CSS, JavaScript, React, and modern web development practices. Duration: 3 months. Prerequisites: Basic computer knowledge.";
                if (lowerInput.includes('backend')) return "Our Backend Development course teaches Node.js, Express, MongoDB, and server-side programming. Duration: 3 months. Prerequisites: Basic programming knowledge.";
                if (lowerInput.includes('full stack')) return "Our Full Stack Development program combines frontend and backend technologies. You'll learn HTML, CSS, JavaScript, React, Node.js, and MongoDB. Duration: 6 months.";
                return "We offer comprehensive web development courses including Frontend, Backend, and Full Stack Development. Each course includes hands-on projects and industry-relevant curriculum.";
            }

            // AI & ML Courses
            if (lowerInput.includes('ai') || lowerInput.includes('machine learning') || lowerInput.includes('ml') || 
                lowerInput.includes('deep learning') || lowerInput.includes('data science')) {
                if (lowerInput.includes('machine learning')) return "Our Machine Learning course covers Python, data analysis, ML algorithms, and model deployment. Duration: 4 months. Prerequisites: Basic Python and mathematics.";
                if (lowerInput.includes('deep learning')) return "Our Deep Learning program focuses on neural networks, TensorFlow, PyTorch, and advanced AI concepts. Duration: 4 months. Prerequisites: Machine Learning fundamentals.";
                if (lowerInput.includes('data science')) return "Our Data Science course teaches Python, statistics, data analysis, and visualization. Duration: 3 months. Prerequisites: Basic programming knowledge.";
                return "We offer specialized courses in AI, Machine Learning, Deep Learning, and Data Science. Each program includes practical projects and industry case studies.";
            }

            // Cloud Computing Courses
            if (lowerInput.includes('cloud') || lowerInput.includes('aws') || lowerInput.includes('azure') || 
                lowerInput.includes('google cloud') || lowerInput.includes('devops')) {
                if (lowerInput.includes('aws')) return "Our AWS Certification course covers cloud computing fundamentals, services, and architecture. Duration: 3 months. Includes AWS certification preparation.";
                if (lowerInput.includes('azure')) return "Our Microsoft Azure program teaches cloud services, deployment, and management. Duration: 3 months. Includes Azure certification preparation.";
                if (lowerInput.includes('devops')) return "Our DevOps course covers CI/CD, containerization, automation, and cloud deployment. Duration: 3 months. Prerequisites: Basic Linux and programming knowledge.";
                return "We offer cloud computing courses in AWS, Azure, and DevOps. Each program includes hands-on labs and certification preparation.";
            }

            // Mobile Development Courses
            if (lowerInput.includes('mobile') || lowerInput.includes('android') || lowerInput.includes('ios') || 
                lowerInput.includes('flutter') || lowerInput.includes('react native')) {
                if (lowerInput.includes('android')) return "Our Android Development course teaches Java/Kotlin, Android Studio, and mobile app development. Duration: 3 months. Prerequisites: Basic programming knowledge.";
                if (lowerInput.includes('ios')) return "Our iOS Development program covers Swift, Xcode, and Apple's development ecosystem. Duration: 3 months. Prerequisites: Basic programming knowledge.";
                if (lowerInput.includes('flutter') || lowerInput.includes('react native')) return "Our Cross-Platform Mobile Development course teaches Flutter and React Native for building apps for both iOS and Android. Duration: 3 months.";
                return "We offer mobile development courses in Android, iOS, and cross-platform development. Each program includes app development projects and deployment.";
            }

            // Cybersecurity Courses
            if (lowerInput.includes('cyber') || lowerInput.includes('security') || lowerInput.includes('ethical hacking') || 
                lowerInput.includes('penetration testing') || lowerInput.includes('network security')) {
                if (lowerInput.includes('ethical hacking')) return "Our Ethical Hacking course covers penetration testing, vulnerability assessment, and security tools. Duration: 4 months. Prerequisites: Basic networking knowledge.";
                if (lowerInput.includes('network security')) return "Our Network Security program teaches security protocols, firewalls, and network defense strategies. Duration: 3 months. Prerequisites: Basic networking knowledge.";
                return "We offer cybersecurity courses in ethical hacking, network security, and information security. Each program includes practical labs and security tools training.";
            }

            // General Course Information
            if (lowerInput.includes('duration') || lowerInput.includes('length') || lowerInput.includes('how long')) {
                return "Our courses typically range from 3 to 6 months in duration, depending on the program. Each course includes practical projects, assignments, and industry-relevant curriculum.";
            }
            if (lowerInput.includes('fee') || lowerInput.includes('cost') || lowerInput.includes('price')) {
                return "Course fees vary based on the program and duration. We offer flexible payment options and scholarships for eligible students. Please contact our admissions team for detailed fee structure.";
            }
            if (lowerInput.includes('prerequisite') || lowerInput.includes('requirement') || lowerInput.includes('need')) {
                return "Prerequisites vary by course. Most courses require basic computer knowledge, while advanced programs may need prior programming experience. Contact our counselors for specific requirements.";
            }
            if (lowerInput.includes('certificate') || lowerInput.includes('certification')) {
                return "All our courses include a certificate of completion. Some programs also prepare you for industry certifications like AWS, Azure, or ethical hacking certifications.";
            }

            return "We offer a wide range of courses in web development, AI, cloud computing, mobile development, and cybersecurity. Each course is designed with industry requirements in mind and includes practical projects. What specific course would you like to know more about?";
        }

        // Web Development Responses
        if (lowerInput.includes('web') || lowerInput.includes('html') || lowerInput.includes('css') || 
            lowerInput.includes('javascript') || lowerInput.includes('react') || lowerInput.includes('node') || 
            lowerInput.includes('mongodb') || lowerInput.includes('express') || lowerInput.includes('full stack')) {
            if (lowerInput.includes('html')) return "HTML (HyperText Markup Language) is the standard markup language for creating web pages. It defines the structure and content of a webpage.";
            if (lowerInput.includes('css')) return "CSS (Cascading Style Sheets) is a style sheet language used for describing the presentation of a document written in HTML.";
            if (lowerInput.includes('javascript')) return "JavaScript is a programming language that enables interactive web pages. It's used for client-side scripting to create dynamic content.";
            if (lowerInput.includes('react')) return "React is a JavaScript library for building user interfaces, particularly single-page applications. It's maintained by Facebook and a community of developers.";
            if (lowerInput.includes('node')) return "Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. It allows you to run JavaScript on the server side.";
            if (lowerInput.includes('mongodb')) return "MongoDB is a NoSQL database that stores data in flexible, JSON-like documents.";
            if (lowerInput.includes('express')) return "Express is a web application framework for Node.js, designed for building web applications and APIs.";
            if (lowerInput.includes('full stack')) return "Full stack development refers to the development of both frontend (client-side) and backend (server-side) portions of a web application.";
            return "Web development is the process of building and maintaining websites. It involves frontend development (what users see) and backend development (server-side logic).";
        }

        // AI Responses
        if (lowerInput.includes('ai') || lowerInput.includes('artificial intelligence') || 
            lowerInput.includes('machine learning') || lowerInput.includes('deep learning') || 
            lowerInput.includes('neural network') || lowerInput.includes('nlp') || 
            lowerInput.includes('computer vision') || lowerInput.includes('reinforcement') || 
            lowerInput.includes('supervised') || lowerInput.includes('unsupervised')) {
            if (lowerInput.includes('machine learning')) return "Machine Learning is a subset of AI that enables systems to learn and improve from experience without being explicitly programmed.";
            if (lowerInput.includes('deep learning')) return "Deep Learning is a subset of machine learning that uses artificial neural networks to model and solve complex problems.";
            if (lowerInput.includes('neural network')) return "A neural network is a series of algorithms that attempts to recognize underlying relationships in a set of data through a process that mimics the way the human brain operates.";
            if (lowerInput.includes('nlp')) return "Natural Language Processing (NLP) is a branch of AI that helps computers understand, interpret, and manipulate human language.";
            if (lowerInput.includes('computer vision')) return "Computer Vision is a field of AI that trains computers to interpret and understand the visual world.";
            if (lowerInput.includes('reinforcement')) return "Reinforcement Learning is a type of machine learning where an agent learns to make decisions by taking actions in an environment to maximize rewards.";
            if (lowerInput.includes('supervised')) return "Supervised Learning is a type of machine learning where the model is trained on labeled data.";
            if (lowerInput.includes('unsupervised')) return "Unsupervised Learning is a type of machine learning where the model is trained on unlabeled data.";
            return "Artificial Intelligence (AI) is the simulation of human intelligence in machines that are programmed to think and learn like humans.";
        }

        // Career Responses
        if (lowerInput.includes('career') || lowerInput.includes('job') || lowerInput.includes('salary') || 
            lowerInput.includes('skills') || lowerInput.includes('start') || lowerInput.includes('begin')) {
            if (lowerInput.includes('salary')) {
                if (lowerInput.includes('web')) return "Web developer salaries vary by location and experience, but typically range from $50,000 to $120,000 per year.";
                if (lowerInput.includes('ai')) return "AI professionals typically earn between $80,000 and $150,000 per year, depending on experience and location.";
                return "Salaries vary based on role, experience, and location. Web developers typically earn $50,000-$120,000, while AI professionals earn $80,000-$150,000.";
            }
            if (lowerInput.includes('skills')) {
                if (lowerInput.includes('web')) return "For web development, you need skills in HTML, CSS, JavaScript, version control (Git), and at least one backend language. Knowledge of frameworks like React, Angular, or Vue.js is also beneficial.";
                if (lowerInput.includes('ai')) return "For AI, you need strong programming skills (Python), mathematics, statistics, machine learning algorithms, and knowledge of frameworks like TensorFlow or PyTorch.";
                return "Required skills depend on the field. Web development needs HTML, CSS, JavaScript, and frameworks. AI requires Python, math, statistics, and ML algorithms.";
            }
            if (lowerInput.includes('start') || lowerInput.includes('begin')) {
                if (lowerInput.includes('web')) return "Start by learning HTML, CSS, and JavaScript. Build projects, contribute to open source, and create a portfolio. Consider taking online courses or bootcamps.";
                if (lowerInput.includes('ai')) return "Start by learning Python, mathematics, and machine learning basics. Take online courses, work on projects, and consider pursuing a degree in computer science or related field.";
                return "To start a career in tech, begin with foundational skills, build projects, and gain practical experience through courses, bootcamps, or formal education.";
            }
            if (lowerInput.includes('options')) {
                if (lowerInput.includes('web')) return "Career options in web development include Frontend Developer, Backend Developer, Full Stack Developer, UI/UX Designer, and Web Application Developer.";
                if (lowerInput.includes('ai')) return "Career options in AI include Machine Learning Engineer, Data Scientist, AI Research Scientist, NLP Engineer, and Computer Vision Engineer.";
                return "Career options include web development roles (Frontend, Backend, Full Stack) and AI roles (ML Engineer, Data Scientist, AI Researcher).";
            }
            return "I can help you with career guidance in web development and AI fields. What would you like to know about career options, required skills, or salary ranges?";
        }

        // General Responses
        if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
            return "Hello! I'm here to help you with web development, AI, and career guidance. What would you like to know?";
        }
        if (lowerInput.includes('help')) {
            return "I can help you with questions about web development, artificial intelligence, machine learning, and career guidance. What would you like to know?";
        }
        if (lowerInput.includes('thank')) {
            return "You're welcome! Feel free to ask if you have any more questions.";
        }

        // Default response based on page context
        switch(page) {
            case 'webdev':
                return "I can help you with web development topics like HTML, CSS, JavaScript, React, Node.js, MongoDB, and Express. What would you like to know?";
            case 'ai':
                return "I can help you with AI and Machine Learning topics like neural networks, deep learning, NLP, and computer vision. What would you like to know?";
            case 'career':
                return "I can help you with career guidance in web development and AI fields. What would you like to know about career options, required skills, or salary ranges?";
            default:
                return "I can help you with questions about web development, artificial intelligence, machine learning, and career guidance. What would you like to know?";
        }
    }

    // Toggle chatbot
    chatbotButton.addEventListener("click", () => {
        chatbotContainer.style.display = 'flex';
        // Force reflow
        chatbotContainer.offsetHeight;
        chatbotContainer.classList.add("active");
        chatbotButton.style.display = "none";
    });

    closeChatbot.addEventListener("click", () => {
        chatbotContainer.classList.remove("active");
        setTimeout(() => {
            chatbotContainer.style.display = 'none';
            chatbotButton.style.display = "flex";
        }, 300);
    });

    // Handle user message and bot response
    sendBtn.addEventListener("click", () => {
        const userInput = chatbotInput.value.trim();
        if (userInput) {
            addMessage(userInput, true);
            chatbotInput.value = "";

            // Show typing indicator
            const typingIndicator = showTypingIndicator();

            // Simulate server response delay
            setTimeout(() => {
                try {
                    const page = getCurrentPage();
                    const response = getResponse(userInput, page);

                    // Remove typing indicator
                    removeTypingIndicator(typingIndicator);
                    addMessage(response, false);
                } catch (error) {
                    console.error('Error:', error);
                    removeTypingIndicator(typingIndicator);
                    addMessage("Sorry, I couldn't process your request. Please try again.", false);
                }
            }, 1000); // Simulate 1 second delay
        }
    });

    // Handle Enter key press
    chatbotInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendBtn.click();
        }
    });

    // Close chatbot when clicking outside
    document.addEventListener('click', (e) => {
        if (!chatbotContainer.contains(e.target) && 
            !chatbotButton.contains(e.target) && 
            chatbotContainer.classList.contains('active')) {
            chatbotContainer.classList.remove("active");
            setTimeout(() => {
                chatbotContainer.style.display = 'none';
                chatbotButton.style.display = "flex";
            }, 300);
        }
    });

    console.log('Chatbot initialized successfully');
}

// Initialize chatbot when the script loads
initializeChatbot(); 