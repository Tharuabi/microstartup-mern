const mongoose = require('mongoose');
const Project = require('./models/Project');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/microstartup', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkData() {
  try {
    console.log('🗄️  DATABASE STORAGE LOCATION:');
    console.log('   Database: microstartup');
    console.log('   Collection: projects');
    console.log('   Connection: mongodb://localhost:27017/microstartup');
    console.log('   Backend API: http://localhost:5000/api/projects\n');

    // Count total projects
    const totalProjects = await Project.countDocuments();
    console.log(`📊 Total projects in database: ${totalProjects}`);

    // Get sample projects
    const sampleProjects = await Project.find().limit(5);
    console.log('\n📋 Sample projects:');
    sampleProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} (${project.category}) - ₹${project.price.toLocaleString('en-IN')}`);
      console.log(`   Rating: ${project.rating} | Views: ${project.views} | Trending: ${project.trending}`);
      console.log(`   ID: ${project._id}`);
    });

    // Get trending projects
    const trendingProjects = await Project.find({ trending: true });
    console.log(`\n🔥 Trending projects: ${trendingProjects.length}`);
    trendingProjects.forEach(project => {
      console.log(`- ${project.title} (Rating: ${project.rating})`);
    });

    // Get categories
    const categories = await Project.distinct('category');
    console.log(`\n📂 Categories: ${categories.join(', ')}`);

    // Get price statistics
    const priceStats = await Project.aggregate([
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          totalValue: { $sum: '$price' }
        }
      }
    ]);

    if (priceStats.length > 0) {
      const stats = priceStats[0];
      console.log(`\n💰 Price Statistics:`);
      console.log(`   Average Price: ₹${Math.round(stats.avgPrice).toLocaleString('en-IN')}`);
      console.log(`   Min Price: ₹${stats.minPrice.toLocaleString('en-IN')}`);
      console.log(`   Max Price: ₹${stats.maxPrice.toLocaleString('en-IN')}`);
      console.log(`   Total Value: ₹${Math.round(stats.totalValue).toLocaleString('en-IN')}`);
    }

    console.log('\n🚀 HOW TO ADD NEW PROJECTS:');
    console.log('   1. Frontend: Visit http://localhost:5174/add-project');
    console.log('   2. Backend API: POST http://localhost:5000/api/projects');
    console.log('   3. Database: Projects stored in microstartup.projects collection');
    console.log('   4. Image Storage: /backend/uploads/ folder');
    console.log('   5. Auto-generated fields: views=0, rating=0, trending=false, dateAdded=now');

    console.log('\n📝 PROJECT SCHEMA FIELDS:');
    console.log('   - title (required)');
    console.log('   - shortDescription (required)');
    console.log('   - longDescription (optional)');
    console.log('   - category (required)');
    console.log('   - techStack (array)');
    console.log('   - price (required, number)');
    console.log('   - imageUrl (from uploaded file)');
    console.log('   - githubUrl (optional)');
    console.log('   - demoUrl (optional)');
    console.log('   - externalLink (optional)');
    console.log('   - views (default: 0)');
    console.log('   - rating (default: 0)');
    console.log('   - trending (default: false)');
    console.log('   - dateAdded (auto-generated)');
    console.log('   - createdAt, updatedAt (timestamps)');

    mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  } catch (error) {
    console.error('Error checking data:', error);
    mongoose.connection.close();
  }
}

// Run the check
checkData(); 