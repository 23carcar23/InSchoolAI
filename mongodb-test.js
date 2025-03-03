const mongoose = require('mongoose');
// MongoDB connection string
const mongoURI = 'mongodb+srv://23carcar23:C6hvfBpWhq1nTHAM@cluster0.lwlvk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// Define a schema that includes password
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String, // Added password field to the schema
  createdAt: {
    type: Date,
    default: Date.now
  }
});

async function testMongoDBConnection(name, email, password) {
  console.log('Attempting to connect to MongoDB...');
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connection successful!');
    // Create a model from our schema
    // If the collection doesn't exist, it will be created
    const User = mongoose.model('User', userSchema);
    // Create a new user document
    const newUser = new User({
      name: name,
      email: email,
      password: password
    });
    // Save the document to the database
    const savedUser = await newUser.save();
    console.log('✅ Added new user to database:', savedUser);
    // Check if we can perform a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    // Query the users collection to verify our data was added
    const users = await User.find();
    console.log('Users in database:', users);
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed successfully.');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
}

// Run the test
testMongoDBConnection("bob", "bob@123", "j");