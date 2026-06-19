const defaultQuizData = {
    webdev: {
        title: 'Web Development Quiz',
        questions: [
            {
                question: 'What does HTML stand for?',
                options: [
                    'Hyper Text Markup Language',
                    'High Tech Modern Language',
                    'Hyper Transfer Markup Language',
                    'Home Tool Markup Language'
                ],
                correct: 0,
                topic: 'HTML'
            },
            {
                question: 'Which of these is not a JavaScript framework?',
                options: [
                    'React',
                    'Angular',
                    'Vue',
                    'Django'
                ],
                correct: 3,
                topic: 'JavaScript'
            },
            {
                question: 'What is the purpose of CSS?',
                options: [
                    'To create dynamic web pages',
                    'To style and layout web pages',
                    'To handle server-side operations',
                    'To manage databases'
                ],
                correct: 1,
                topic: 'CSS'
            },
            {
                question: 'Which CSS property controls the text size?',
                options: [
                    'font-style',
                    'text-size',
                    'font-size',
                    'text-style'
                ],
                correct: 2,
                topic: 'CSS'
            },
            {
                question: 'Which HTML element is used to define important text?',
                options: [
                    '<important>',
                    '<strong>',
                    '<i>',
                    '<b>'
                ],
                correct: 1,
                topic: 'HTML'
            },
            {
                question: 'How do you write "Hello World" in an alert box in JavaScript?',
                options: [
                    'msgBox("Hello World");',
                    'alert("Hello World");',
                    'alertBox("Hello World");',
                    'msg("Hello World");'
                ],
                correct: 1,
                topic: 'JavaScript'
            }
        ]
    },
    ai: {
        title: 'AI & ML Quiz',
        questions: [
            {
                question: 'What is Machine Learning?',
                options: [
                    'A type of computer hardware',
                    'A programming language',
                    'A subset of AI that enables systems to learn from data',
                    'A database management system'
                ],
                correct: 2,
                topic: 'Machine Learning'
            },
            {
                question: 'Which of these is not a type of machine learning?',
                options: [
                    'Supervised Learning',
                    'Unsupervised Learning',
                    'Reinforcement Learning',
                    'Static Learning'
                ],
                correct: 3,
                topic: 'Machine Learning'
            },
            {
                question: 'What is the purpose of neural networks?',
                options: [
                    'To store data',
                    'To process and analyze complex patterns',
                    'To create web pages',
                    'To manage databases'
                ],
                correct: 1,
                topic: 'Deep Learning'
            },
            {
                question: 'What is the main characteristic of unsupervised learning?',
                options: [
                    'Using labeled training data',
                    'Using unlabeled data to find hidden patterns',
                    'Learning through trial and error',
                    'Having a human supervisor check the results'
                ],
                correct: 1,
                topic: 'Machine Learning'
            },
            {
                question: 'Which of the following is a common activation function in Deep Learning?',
                options: [
                    'ReLU',
                    'Gradient Descent',
                    'Backpropagation',
                    'Linear Regression'
                ],
                correct: 0,
                topic: 'Deep Learning'
            }
        ]
    },
    career: {
        title: 'Career Development Quiz',
        questions: [
            {
                question: 'What is the first step in career planning?',
                options: [
                    'Applying for jobs',
                    'Self-assessment',
                    'Writing a resume',
                    'Networking'
                ],
                correct: 1,
                topic: 'Career Planning'
            },
            {
                question: 'Which of these is not a soft skill?',
                options: [
                    'Communication',
                    'Teamwork',
                    'Programming',
                    'Problem-solving'
                ],
                correct: 2,
                topic: 'Soft Skills'
            },
            {
                question: 'What is the purpose of a cover letter?',
                options: [
                    'To list all your skills',
                    'To introduce yourself and explain why you are a good fit',
                    'To provide references',
                    'To request a salary'
                ],
                correct: 1,
                topic: 'Job Search'
            },
            {
                question: 'What is the best length for a professional resume for a recent graduate?',
                options: [
                    '1 page',
                    '3 pages',
                    '5 pages',
                    'As long as possible'
                ],
                correct: 0,
                topic: 'Job Search'
            },
            {
                question: 'Which soft skill involves the ability to adapt to new conditions and changes?',
                options: [
                    'Empathy',
                    'Flexibility',
                    'Leadership',
                    'Time Management'
                ],
                correct: 1,
                topic: 'Soft Skills'
            }
        ]
    }
};
