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
                topic: 'HTML basics',
                explanation: 'HTML is the markup language used to structure web pages. Review tags, elements, and document structure.'
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
                topic: 'JavaScript frameworks',
                explanation: 'Django is a Python web framework, while React, Angular, and Vue are commonly used JavaScript frameworks.'
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
                topic: 'CSS styling',
                explanation: 'CSS controls the visual presentation of web pages, including layout, colors, spacing, and typography.'
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
                topic: 'Machine learning basics',
                explanation: 'Machine learning is a part of AI where systems learn patterns from data and improve predictions or decisions.'
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
                topic: 'Types of learning',
                explanation: 'The common machine learning types are supervised, unsupervised, and reinforcement learning.'
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
                topic: 'Neural networks',
                explanation: 'Neural networks are used to model complex patterns in data, especially for tasks like vision, text, and prediction.'
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
                topic: 'Career planning',
                explanation: 'Career planning starts with self-assessment so goals, strengths, and learning needs are clear.'
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
                topic: 'Soft skills',
                explanation: 'Programming is a technical skill. Communication, teamwork, and problem-solving are soft skills.'
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
                topic: 'Job applications',
                explanation: 'A cover letter introduces you and connects your experience to the role you want.'
            }
        ]
    }
};
