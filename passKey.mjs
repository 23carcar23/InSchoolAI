// import express from 'express';
// import { createClient } from 'redis';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';

// const app = express();
// const PORT = 3000;

// // Enable CORS to allow frontend access - update with your actual frontend URL
// app.use(cors({
//   // This should match your frontend URL exactly
//   // If you're testing locally with a file:// URL, you might need to use a local server
//   origin: ['http://127.0.0.1:5500', 'http://localhost:5500'], // Add all possible origins
//   credentials: true
// }));

// // Add cookie parser middleware
// app.use(cookieParser());

// // Create Redis client
// const client = createClient({
//   username: 'default',
//   password: 'jARJxqK6qWLuv5CkVJoY5Ku96jISF69x',
//   socket: {
//     host: 'redis-17469.c273.us-east-1-2.ec2.redns.redis-cloud.com',
//     port: 17469
//   }
// });

// // Handle Redis connection errors
// client.on('error', (err) => console.error('❌ Redis Error:', err));

// // Connect to Redis
// await client.connect();

// // Function to generate a password
// function generatePassword() {
//   return Math.floor(10000 + Math.random() * 90000).toString(); // Generate 5-digit password
// }

// // Function to check if a password exists in Redis
// async function checkPasswordExists(password) {
//   const exists = await client.get(`password:${password}`);
//   return exists !== null;
// }

// // API route to get or generate a password
// app.get('/generate-password', async (req, res) => {
//   try {
//     let password;
//     let isNewPassword = false;
    
//     // Check if user already has a password in their cookie
//     if (req.cookies.userPassword) {
//       console.log('Using existing password from cookie:', req.cookies.userPassword);
//       password = req.cookies.userPassword;
//       // Verify this password still exists in Redis
//       const exists = await checkPasswordExists(password);
//       if (!exists) {
//         console.log('Password in cookie no longer exists in Redis, generating new one');
//         password = generatePassword();
//         isNewPassword = true;
//       }
//     } else {
//       // Generate a new password
//       password = generatePassword();
//       isNewPassword = true;
//       console.log('Generated new password:', password);
//     }

//     // If this is a new password, store it in Redis
//     if (isNewPassword) {
//       // Store in Redis with a namespace
//       await client.set(`password:${password}`, 'true');
//       console.log('Stored new password in Redis:', password);
//       // Set TTL for 24 hours
//       await client.expire(`password:${password}`, 60 * 60 * 24);
//     }

//     // Always set/refresh the cookie
//     res.cookie('userPassword', password, {
//       maxAge: 1000 * 60 * 60 * 24, // 24 hours
//       httpOnly: false, // Changed to false - now accessible via JavaScript
//       // In development, secure should be false if not using HTTPS
//       secure: false, // Set to true in production with HTTPS
//       sameSite: 'lax' // 'lax' for better cross-site compatibility
//     });

//     // Return the password (new or existing)
//     res.json({ password });
//   } catch (error) {
//     console.error('❌ Error generating password:', error);
//     res.status(500).json({ error: 'Failed to generate password' });
//   }
// });

// // API route to check if a password exists
// app.get('/check-password/:password', async (req, res) => {
//   try {
//     const exists = await checkPasswordExists(req.params.password);
//     res.json({ exists });
//   } catch (error) {
//     console.error('❌ Error checking password:', error);
//     res.status(500).json({ error: 'Failed to check password' });
//   }
// });

// // Optional route to clear a password (for testing)
// app.get('/clear-password', (req, res) => {
//   if (req.cookies.userPassword) {
//     const oldPassword = req.cookies.userPassword;
//     // Clear the cookie
//     res.clearCookie('userPassword');
//     res.json({ message: `Password ${oldPassword} removed from cookie` });
//   } else {
//     res.json({ message: 'No password found in cookie' });
//   }
// });

// // Start Express server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

////////////////////////////////////// for register/login


const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');


const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Atlas Connection Configuration
const MONGODB_URI = 'mongodb+srv://23carcar23:C6hvfBpWhq1nTHAM@cluster0.lwlvk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// Replace the above URI with your actual MongoDB Atlas connection string
// Example: 'mongodb+srv://myuser:mypassword@cluster0.mongodb.net/myapp?retryWrites=true&w=majority'

// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Could not connect to MongoDB Atlas:', err));

// User Model Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

// Routes
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [
                { email },
                { username }
            ]
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                message: existingUser.email === email 
                    ? 'Email already in use' 
                    : 'Username already taken'
            });
        }
        
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        
        // Save user to the database
        await newUser.save();
        
        res.status(201).json({ 
            message: 'User registered successfully',
            userId: newUser._id
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Serve the registration page
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Serve the login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'teacherLogin.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



