const mongoose = require('mongoose');
const Project = require('./models/Project');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/microstartup', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const dummyProjects = [
  {
    title: "LearnSphere Online Course Hub",
    category: "EdTech",
    shortDescription: "Marketplace for instructors to sell courses and learners to enroll.",
    longDescription: "A comprehensive online learning marketplace where instructors can create and sell courses while learners can discover and enroll in quality education.",
    price: 130000,
    techStack: ["PHP", "Laravel", "MySQL", "Vue.js", "Stripe Connect"],
    imageUrl: "/src/assets/image_files/image.jpg",
    externalLink: "https://www.udemy.com/",
    views: 1678,
    rating: 4.7,
    trending: true,
    dateAdded: new Date("2023-10-18")
  },
  {
    title: "TeeDesigner Custom Apparel Tool",
    category: "eCommerce",
    shortDescription: "Online tool to design and order custom t-shirts and apparel.",
    longDescription: "An online design tool that allows users to create custom t-shirts and apparel with a drag-and-drop interface and integrated printing services.",
    price: 50000,
    techStack: ["JavaScript", "Fabric.js", "Shopify API", "Printful API"],
    imageUrl: "/src/assets/image_files/image2.jpg.jpg",
    externalLink: "https://www.customink.com/",
    views: 892,
    rating: 4.3,
    trending: false,
    dateAdded: new Date("2024-01-22")
  },
  {
    title: "GrooveStream Music Service MVP",
    category: "App",
    shortDescription: "Basic music streaming application with playlist functionality.",
    longDescription: "A music streaming application with playlist functionality, user recommendations, and social sharing features.",
    price: 70000,
    techStack: ["Kotlin", "ExoPlayer", "Firebase Firestore", "Jetpack Compose"],
    imageUrl: "/src/assets/image_files/image3.jpg",
    externalLink: "https://www.spotify.com/",
    views: 1234,
    rating: 4.5,
    trending: true,
    dateAdded: new Date("2023-11-28")
  },
  {
    title: "NoteWiz – Productivity App",
    category: "App",
    shortDescription: "Smart note-taking and organization for creative minds.",
    longDescription: "A smart note-taking application designed for creative professionals with advanced organization features and AI-powered insights.",
    price: 30000,
    techStack: ["React Native", "SQLite", "Redux"],
    imageUrl: "/src/assets/image_files/image4.jpg",
    externalLink: "https://notewiz-demo.vercel.app/",
    views: 567,
    rating: 4.2,
    trending: false,
    dateAdded: new Date("2024-02-01")
  },
  {
    title: "Premium Domain: Innovate.ai",
    category: "Domain",
    shortDescription: "High-value, brandable .ai domain for tech startups.",
    longDescription: "A premium .ai domain perfect for AI startups and tech companies looking to establish a strong brand presence.",
    price: 180000,
    techStack: ["N/A"],
    imageUrl: "/src/assets/image_files/image5.jpg",
    externalLink: "https://dan.com/buy-domain/innovate.ai",
    views: 567,
    rating: 4.3,
    trending: false,
    dateAdded: new Date("2023-08-10")
  },
  {
    title: "HyperLocal Delivery App Kit",
    category: "App",
    shortDescription: "Complete solution to connect local stores with customers.",
    longDescription: "A complete delivery app solution that connects local stores with customers, featuring real-time tracking and payment processing.",
    price: 60000,
    techStack: ["Flutter", "Firebase", "Google Maps API"],
    imageUrl: "/src/assets/image_files/image6.jpg",
    externalLink: "https://www.dunzo.com/",
    views: 1342,
    rating: 4.4,
    trending: true,
    dateAdded: new Date("2023-11-05")
  },
  {
    title: "The Hobbyist Box Subscription",
    category: "eCommerce",
    shortDescription: "Curated monthly boxes for various niche hobbies & crafts.",
    longDescription: "A subscription service delivering curated monthly boxes for various niche hobbies and crafts, with personalized recommendations.",
    price: 30000,
    techStack: ["Shopify", "Klaviyo", "Recharge"],
    imageUrl: "/src/assets/image_files/image7.jpg",
    externalLink: "https://craftsmancrate.com/",
    views: 789,
    rating: 4.2,
    trending: false,
    dateAdded: new Date("2023-07-15")
  },
  {
    title: "Polyglot AI Language Tutor",
    category: "AI Tool",
    shortDescription: "AI-powered chatbot for practicing new languages interactively.",
    longDescription: "An AI-powered language learning platform that provides interactive conversations and personalized learning paths for multiple languages.",
    price: 15000,
    techStack: ["Python", "Dialogflow", "React"],
    imageUrl: "/src/assets/image_files/image8.jpg",
    externalLink: "https://www.polyglotai.io/",
    views: 1123,
    rating: 4.7,
    trending: true,
    dateAdded: new Date("2023-12-10")
  },
  {
    title: "SecureCloud Backup SaaS",
    category: "SaaS",
    shortDescription: "Robust and secure cloud backup solution for SMBs.",
    longDescription: "A secure cloud backup solution designed for small and medium businesses with advanced encryption and automated backup scheduling.",
    price: 65000,
    techStack: ["Go", "AWS S3", "Vue.js", "Docker"],
    imageUrl: "/src/assets/image_files/image9.jpg",
    externalLink: "https://www.backblaze.com/",
    views: 876,
    rating: 4.1,
    trending: false,
    dateAdded: new Date("2023-09-01")
  },
  {
    title: "Beanly – Gourmet Coffee Subscription",
    category: "eCommerce",
    shortDescription: "Monthly delivery of ethically sourced premium coffee beans.",
    longDescription: "A premium coffee subscription service delivering ethically sourced coffee beans from around the world with personalized roast preferences.",
    price: 25000,
    techStack: ["WooCommerce", "WordPress", "Stripe"],
    imageUrl: "/src/assets/image_files/image10.jpg",
    externalLink: "https://beanbox.com/",
    views: 654,
    rating: 4.0,
    trending: false,
    dateAdded: new Date("2024-01-05")
  },
  {
    title: "Wanderlust Mobile Travel Planner",
    category: "App",
    shortDescription: "Plan, organize, and share your travel itineraries seamlessly.",
    longDescription: "A comprehensive travel planning app that helps users create, organize, and share detailed travel itineraries with real-time updates.",
    price: 55000,
    techStack: ["React Native", "Firebase Auth", "GraphQL"],
    imageUrl: "/src/assets/image_files/imag1.jpg",
    externalLink: "https://www.tripit.com/",
    views: 1456,
    rating: 4.6,
    trending: true,
    dateAdded: new Date("2024-01-10")
  },
  {
    title: "FinSavvy Personal Finance SaaS",
    category: "SaaS",
    shortDescription: "Track expenses, manage budgets, and view investment analytics.",
    longDescription: "A comprehensive personal finance management platform with expense tracking, budget management, and investment analytics.",
    price: 40000,
    techStack: ["Ruby on Rails", "PostgreSQL", "Chart.js"],
    imageUrl: "/src/assets/image_files/img2.jpg",
    externalLink: "https://www.youneedabudget.com/",
    views: 998,
    rating: 4.3,
    trending: false,
    dateAdded: new Date("2023-11-20")
  },
  {
    title: "KidSpark Educational Game Suite",
    category: "EdTech",
    shortDescription: "Interactive learning games prototype for ages 5-8.",
    longDescription: "A collection of interactive educational games designed for children aged 5-8, covering various subjects with adaptive learning algorithms.",
    price: 18000,
    techStack: ["HTML5 Canvas", "JavaScript", "Phaser.js"],
    imageUrl: "/src/assets/image_files/img3.jpg",
    externalLink: "https://kidsparkeducation.org/",
    views: 723,
    rating: 4.4,
    trending: false,
    dateAdded: new Date("2024-01-15")
  },
  {
    title: "NovaNet: Decentralized Social Platform",
    category: "Web3",
    shortDescription: "Proof of concept for a censorship-resistant Web3 social network.",
    longDescription: "A decentralized social networking platform built on blockchain technology, ensuring user privacy and censorship resistance.",
    price: 95000,
    techStack: ["IPFS", "Ethereum", "Gun.js", "Vue.js"],
    imageUrl: "/src/assets/image_files/img5.jpg",
    externalLink: "https://lens.xyz/",
    views: 1102,
    rating: 4.5,
    trending: true,
    dateAdded: new Date("2023-12-28")
  },
  {
    title: "DevVault Code Snippet Manager",
    category: "Developer Tool",
    shortDescription: "Desktop tool to organize, tag, and share code snippets.",
    longDescription: "A desktop application for developers to organize, tag, and share code snippets with syntax highlighting and search capabilities.",
    price: 12000,
    techStack: ["Electron", "React", "SQLite", "Prism.js"],
    imageUrl: "/src/assets/image_files/7740957.jpg",
    externalLink: "https://www.cacher.io/",
    views: 834,
    rating: 4.2,
    trending: false,
    dateAdded: new Date("2023-10-10")
  },
  {
    title: "Aura Smart Home Automation API",
    category: "API",
    shortDescription: "RESTful API to control and monitor smart home devices.",
    longDescription: "A comprehensive RESTful API for controlling and monitoring smart home devices with support for multiple protocols and device types.",
    price: 75000,
    techStack: ["Python", "FastAPI", "MQTT", "Docker"],
    imageUrl: "/src/assets/image_files/abstract-trifold-brochure-template-with-image_52683-39688.jpg",
    externalLink: "https://home-assistant.io/",
    views: 567,
    rating: 4.1,
    trending: false,
    dateAdded: new Date("2024-01-02")
  },
  {
    title: "The Crafted Corner Online Store",
    category: "eCommerce",
    shortDescription: "Platform for artisans to showcase and sell unique handmade items.",
    longDescription: "An online marketplace platform specifically designed for artisans to showcase and sell their unique handmade items with integrated payment processing.",
    price: 35000,
    techStack: ["Shopify Theme Dev", "Liquid", "GraphQL"],
    imageUrl: "/src/assets/image_files/hand-drawn-delicious-food-background_52683-16136.jpg",
    externalLink: "https://www.uncommongoods.com/",
    views: 912,
    rating: 4.3,
    trending: false,
    dateAdded: new Date("2023-08-25")
  },
  {
    title: "RecipeBook Community Platform",
    category: "MVP",
    shortDescription: "A community-driven platform for sharing and discovering recipes.",
    longDescription: "A community-driven platform where users can share, discover, and rate recipes with social features and personalized recommendations.",
    price: 22000,
    techStack: ["Django", "PostgreSQL", "Bootstrap"],
    imageUrl: "/src/assets/image_files/colorful-decorative-rainbow-realistic-style_52683-20037.jpg",
    externalLink: "https://www.allrecipes.com/",
    views: 678,
    rating: 4.0,
    trending: false,
    dateAdded: new Date("2023-12-18")
  },
  {
    title: "ConnectSphere Virtual Event SaaS",
    category: "SaaS",
    shortDescription: "Full-featured platform to host and manage engaging online events.",
    longDescription: "A comprehensive virtual event platform with features like live streaming, breakout rooms, networking, and analytics for event organizers.",
    price: 150000,
    techStack: ["Node.js", "WebRTC", "Socket.io", "React"],
    imageUrl: "/src/assets/image_files/dark-wall-with-spot-lights-background_52683-42962.jpg",
    externalLink: "https://hopin.com/",
    views: 1892,
    rating: 4.8,
    trending: true,
    dateAdded: new Date("2023-11-01")
  },
  {
    title: "Quill: Minimalist Blogging Platform",
    category: "Web Tool",
    shortDescription: "A simple, fast, and elegant blogging platform for writers.",
    longDescription: "A minimalist blogging platform designed for writers with a focus on simplicity, speed, and elegant typography.",
    price: 28000,
    techStack: ["Next.js", "Markdown", "Vercel", "TailwindCSS"],
    imageUrl: "/src/assets/image_files/hand-drawn-floral-decorative-elements_52683-10846.jpg",
    externalLink: "https://ghost.org/",
    views: 756,
    rating: 4.4,
    trending: false,
    dateAdded: new Date("2024-01-20")
  },
  {
    title: "TaleWeaver AI Story Generator",
    category: "AI Tool",
    shortDescription: "Generate unique story plots, characters, and dialogues using AI.",
    longDescription: "An AI-powered story generation tool that creates unique plots, characters, and dialogues for writers and content creators.",
    price: 62000,
    techStack: ["Python", "GPT-3 API", "Flask", "React"],
    imageUrl: "/src/assets/image_files/detailed-birthday-lettering_52683-58875.jpg",
    externalLink: "https://www.novelai.net/",
    views: 1345,
    rating: 4.6,
    trending: true,
    dateAdded: new Date("2023-12-05")
  },
  {
    title: "Zenith Task Management SaaS",
    category: "SaaS",
    shortDescription: "Collaborative project and task tool for modern teams.",
    longDescription: "A comprehensive task management platform designed for modern teams with features like real-time collaboration, project tracking, and team analytics.",
    price: 45000,
    techStack: ["Vue.js", "Firebase", "TailwindCSS"],
    imageUrl: "/src/assets/image_files/collection-realistic-different-clouds_52683-72313.jpg",
    externalLink: "https://asana.com/",
    views: 1567,
    rating: 4.7,
    trending: false,
    dateAdded: new Date("2023-09-20")
  },
  {
    title: "Pixel Puzzler – Indie Game",
    category: "Game",
    shortDescription: "Playable demo of a new vibrant puzzle adventure game.",
    longDescription: "A vibrant puzzle adventure game with unique mechanics and beautiful pixel art graphics. Includes level editor and multiplayer features.",
    price: 20000,
    techStack: ["Unity", "C#"],
    imageUrl: "/src/assets/image_files/marketing-strategy-landing-page_52683-3099.jpg",
    externalLink: "https://pixel-puzzler.playcurious.games/",
    views: 2341,
    rating: 4.6,
    trending: true,
    dateAdded: new Date("2023-12-01")
  },
  {
    title: "CryptoArt Minting Suite",
    category: "Web3",
    shortDescription: "User-friendly tool to create and manage NFT collections.",
    longDescription: "A comprehensive suite for creating, minting, and managing NFT collections with advanced features like batch minting and royalty distribution.",
    price: 110000,
    techStack: ["Solidity", "Next.js", "IPFS", "Hardhat"],
    imageUrl: "/src/assets/image_files/isometric-landing-page_52683-13081.jpg",
    externalLink: "https://opensea.io/",
    views: 987,
    rating: 4.5,
    trending: false,
    dateAdded: new Date("2023-10-25")
  },
  {
    title: "AI Fitness & Wellness Coach",
    category: "App",
    shortDescription: "Personalized workout and nutrition plans using AI.",
    longDescription: "An AI-powered fitness application that creates personalized workout and nutrition plans based on user goals, fitness level, and preferences.",
    price: 70000,
    techStack: ["Python", "TensorFlow", "SwiftUI"],
    imageUrl: "/src/assets/image_files/marketing-landing-page-flat-design_52683-18150.jpg",
    externalLink: "https://www.fitbod.me/",
    views: 892,
    rating: 4.9,
    trending: true,
    dateAdded: new Date("2023-11-15")
  },
  {
    title: "Artisan Goods Marketplace",
    category: "eCommerce",
    shortDescription: "Connects artisans with buyers globally.",
    longDescription: "A comprehensive marketplace platform that connects local artisans with global buyers. Features include secure payment processing, inventory management, and seller analytics.",
    price: 1500,
    techStack: ["React", "Node.js", "MongoDB"],
    imageUrl: "/src/assets/image_files/digital-marketing-landing-page-template_52683-18360.jpg",
    externalLink: "https://www.etsy.com/",
    views: 1247,
    rating: 4.8,
    trending: true,
    dateAdded: new Date("2023-10-01")
  }
];

async function seedProjects() {
  try {
    await Project.deleteMany({});
    console.log('Cleared existing projects');
    
    const projects = await Project.insertMany(dummyProjects);
    console.log(`Successfully seeded ${projects.length} projects`);
    
    // Log some sample projects
    console.log('\nSample projects:');
    projects.slice(0, 3).forEach(project => {
      console.log(`- ${project.title} (${project.category}) - ₹${project.price.toLocaleString('en-IN')}`);
    });
    
    mongoose.connection.close();
    console.log('\nDatabase connection closed');
  } catch (error) {
    console.error('Error seeding projects:', error);
    mongoose.connection.close();
  }
}

seedProjects(); 