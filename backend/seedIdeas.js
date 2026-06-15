const mongoose = require('mongoose');
const Idea = require('./models/Idea');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/microstartup', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dummyIdeas = [
  {
    title: 'AI-Powered Personal Chef',
    description: 'A smart kitchen assistant that creates personalized meal plans, generates shopping lists, and provides step-by-step cooking instructions based on dietary preferences and available ingredients.',
    category: 'AI Tool',
    problem: 'People struggle to plan meals, waste food, and don\'t know how to cook healthy dishes.',
    solution: 'AI analyzes dietary needs, available ingredients, and cooking skills to create personalized meal plans with detailed instructions.',
    targetMarket: 'Busy professionals, health-conscious individuals, cooking beginners',
    revenueModel: 'Subscription ($9.99/month) + Premium features ($19.99/month)',
    techStack: ['Python', 'TensorFlow', 'React Native', 'OpenAI API', 'PostgreSQL'],
    estimatedCost: 25000,
    timeline: '6-8 months',
    difficulty: 'Advanced',
    author: 'Sarah Chen',
    views: 1247,
    likes: 89,
    trending: true,
    status: 'Idea',
    tags: ['AI', 'Food', 'Health', 'Cooking', 'Personalization']
  },
  {
    title: 'Eco-Friendly Delivery Network',
    description: 'A sustainable last-mile delivery service using electric vehicles, bicycles, and local partnerships to reduce carbon footprint while providing fast, reliable delivery.',
    category: 'eCommerce',
    problem: 'Traditional delivery services contribute to pollution and traffic congestion.',
    solution: 'Green delivery network using electric vehicles, optimized routes, and local partnerships.',
    targetMarket: 'Eco-conscious consumers, small businesses, urban areas',
    revenueModel: 'Per-delivery fee + Monthly subscription for businesses',
    techStack: ['Node.js', 'React', 'MongoDB', 'Google Maps API', 'IoT sensors'],
    estimatedCost: 45000,
    timeline: '8-10 months',
    difficulty: 'Intermediate',
    author: 'Marcus Rodriguez',
    views: 892,
    likes: 67,
    trending: true,
    status: 'Idea',
    tags: ['Sustainability', 'Logistics', 'Green Tech', 'Delivery', 'Urban']
  },
  {
    title: 'Virtual Reality Therapy Platform',
    description: 'A VR-based mental health platform offering guided meditation, exposure therapy, and stress relief sessions in immersive virtual environments.',
    category: 'EdTech',
    problem: 'Mental health services are expensive, inaccessible, and many people are uncomfortable with traditional therapy.',
    solution: 'Accessible VR therapy sessions that can be done from home with professional guidance.',
    targetMarket: 'People with anxiety, depression, PTSD, stress management needs',
    revenueModel: 'Session-based pricing + Monthly subscription ($29.99/month)',
    techStack: ['Unity', 'C#', 'Oculus SDK', 'WebRTC', 'Firebase'],
    estimatedCost: 75000,
    timeline: '12-15 months',
    difficulty: 'Advanced',
    author: 'Dr. Emily Watson',
    views: 1567,
    likes: 134,
    trending: true,
    status: 'Idea',
    tags: ['Mental Health', 'VR', 'Therapy', 'Wellness', 'Healthcare']
  },
  {
    title: 'Smart Home Energy Optimizer',
    description: 'An AI system that learns household energy patterns and automatically optimizes usage to reduce bills while maintaining comfort.',
    category: 'SaaS',
    problem: 'High energy bills and inefficient home energy usage without understanding consumption patterns.',
    solution: 'AI-powered energy optimization that learns patterns and automatically adjusts settings.',
    targetMarket: 'Homeowners, property managers, energy-conscious consumers',
    revenueModel: 'Monthly subscription ($15/month) + Energy savings commission',
    techStack: ['Python', 'TensorFlow', 'IoT', 'AWS', 'React'],
    estimatedCost: 35000,
    timeline: '6-9 months',
    difficulty: 'Intermediate',
    author: 'Alex Thompson',
    views: 723,
    likes: 45,
    trending: false,
    status: 'Idea',
    tags: ['Energy', 'IoT', 'Smart Home', 'AI', 'Sustainability']
  },
  {
    title: 'Local Language Learning Exchange',
    description: 'A platform connecting native speakers with language learners for real-time conversation practice through video calls and cultural exchange.',
    category: 'App',
    problem: 'Traditional language learning apps lack real conversation practice and cultural context.',
    solution: 'Peer-to-peer language exchange platform with structured conversation topics and cultural insights.',
    targetMarket: 'Language learners, travelers, cultural enthusiasts, international students',
    revenueModel: 'Freemium + Premium features ($12.99/month) + Tutor marketplace',
    techStack: ['React Native', 'WebRTC', 'Firebase', 'Node.js', 'MongoDB'],
    estimatedCost: 28000,
    timeline: '5-7 months',
    difficulty: 'Intermediate',
    author: 'Lina Park',
    views: 945,
    likes: 78,
    trending: true,
    status: 'Idea',
    tags: ['Language', 'Education', 'Social', 'Cultural Exchange', 'Communication']
  },
  {
    title: 'Blockchain-Based Freelancer Platform',
    description: 'A decentralized freelance marketplace using smart contracts for secure payments, transparent reviews, and automated dispute resolution.',
    category: 'Web3',
    problem: 'High fees, payment delays, and lack of transparency in traditional freelance platforms.',
    solution: 'Decentralized platform with smart contracts ensuring fair payments and transparent reviews.',
    targetMarket: 'Freelancers, clients, remote workers, blockchain enthusiasts',
    revenueModel: 'Small platform fee (2%) + Premium features',
    techStack: ['Solidity', 'React', 'Ethereum', 'IPFS', 'Web3.js'],
    estimatedCost: 55000,
    timeline: '10-12 months',
    difficulty: 'Advanced',
    author: 'David Kim',
    views: 678,
    likes: 56,
    trending: false,
    status: 'Idea',
    tags: ['Blockchain', 'Freelance', 'Web3', 'Smart Contracts', 'Decentralized']
  },
  {
    title: 'Pet Health Monitoring System',
    description: 'IoT-based pet health monitoring using smart collars and mobile app to track activity, health metrics, and provide early warning signs.',
    category: 'App',
    problem: 'Pet owners struggle to monitor their pets\' health and often miss early warning signs of illness.',
    solution: 'Smart collar with sensors and AI analysis to track health metrics and alert owners to potential issues.',
    targetMarket: 'Pet owners, veterinarians, pet insurance companies',
    revenueModel: 'Hardware sales + Monthly subscription ($9.99/month)',
    techStack: ['IoT', 'React Native', 'Python', 'Machine Learning', 'AWS'],
    estimatedCost: 65000,
    timeline: '9-12 months',
    difficulty: 'Advanced',
    author: 'Dr. Sarah Johnson',
    views: 1123,
    likes: 92,
    trending: true,
    status: 'Idea',
    tags: ['Pet Care', 'IoT', 'Health', 'AI', 'Wearables']
  },
  {
    title: 'Sustainable Fashion Marketplace',
    description: 'A curated marketplace for sustainable and ethical fashion brands, with transparency tracking for materials, labor, and environmental impact.',
    category: 'eCommerce',
    problem: 'Fast fashion contributes to environmental damage and poor labor conditions, while sustainable options are hard to find.',
    solution: 'Curated marketplace with verified sustainable brands and transparent supply chain tracking.',
    targetMarket: 'Eco-conscious consumers, sustainable fashion brands, ethical shoppers',
    revenueModel: 'Commission on sales (10-15%) + Premium brand listings',
    techStack: ['React', 'Node.js', 'MongoDB', 'Blockchain', 'Stripe'],
    estimatedCost: 40000,
    timeline: '7-9 months',
    difficulty: 'Intermediate',
    author: 'Emma Wilson',
    views: 834,
    likes: 67,
    trending: false,
    status: 'Idea',
    tags: ['Fashion', 'Sustainability', 'Ethical', 'Marketplace', 'Transparency']
  },
  {
    title: 'Micro-Learning Skill Platform',
    description: 'Bite-sized learning modules for professional skills that can be completed in 5-15 minutes, perfect for busy professionals.',
    category: 'EdTech',
    problem: 'Traditional courses are too long and people struggle to find time for continuous learning.',
    solution: 'Micro-learning modules that fit into busy schedules and focus on practical skills.',
    targetMarket: 'Busy professionals, career changers, lifelong learners',
    revenueModel: 'Monthly subscription ($19.99/month) + Corporate packages',
    techStack: ['React', 'Node.js', 'MongoDB', 'Video streaming', 'Analytics'],
    estimatedCost: 32000,
    timeline: '6-8 months',
    difficulty: 'Intermediate',
    author: 'Michael Chen',
    views: 567,
    likes: 43,
    trending: false,
    status: 'Idea',
    tags: ['Education', 'Micro-learning', 'Professional Development', 'Skills', 'Online Learning']
  },
  {
    title: 'Community-Based Food Sharing',
    description: 'A platform connecting neighbors to share home-cooked meals, reduce food waste, and build community connections.',
    category: 'App',
    problem: 'Food waste, social isolation, and lack of community connection in urban areas.',
    solution: 'Peer-to-peer food sharing platform that connects neighbors and reduces waste.',
    targetMarket: 'Urban communities, food enthusiasts, environmentally conscious people',
    revenueModel: 'Freemium + Premium features ($5.99/month) + Food safety verification',
    techStack: ['React Native', 'Firebase', 'Google Maps', 'Node.js', 'MongoDB'],
    estimatedCost: 22000,
    timeline: '4-6 months',
    difficulty: 'Beginner',
    author: 'Maria Garcia',
    views: 445,
    likes: 34,
    trending: false,
    status: 'Idea',
    tags: ['Community', 'Food Sharing', 'Social', 'Sustainability', 'Local']
  }
];

async function seedIdeas() {
  try {
    // Clear existing ideas
    await Idea.deleteMany({});
    console.log('Cleared existing ideas');

    // Insert new ideas
    const ideas = await Idea.insertMany(dummyIdeas);
    console.log(`Successfully seeded ${ideas.length} startup ideas`);

    // Log some sample ideas
    console.log('\nSample startup ideas:');
    ideas.slice(0, 3).forEach(idea => {
      console.log(`- ${idea.title} (${idea.category}) - ₹${idea.estimatedCost.toLocaleString('en-IN')}`);
      console.log(`  Difficulty: ${idea.difficulty} | Timeline: ${idea.timeline}`);
    });

    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error seeding ideas:', error);
    mongoose.connection.close();
  }
}

// Run the seeding function
seedIdeas(); 