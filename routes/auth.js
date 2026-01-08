const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const container = require('../db');

// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required' 
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email format' 
            });
        }

        // Check if user already exists
        const query = {
            query: "SELECT * FROM c WHERE c.email = @email AND c.type = 'user'",
            parameters: [{ name: "@email", value: email }]
        };

        const { resources: existingUsers } = await container.items.query(query).fetchAll();

        if (existingUsers.length > 0) {
            return res.status(409).json({ 
                success: false, 
                message: 'User with this email already exists' 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user object
        const newUser = {
            id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'user',
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // Save to database
        const { resource: createdUser } = await container.items.create(newUser);

        // Remove password from response
        const { password: _, ...userResponse } = createdUser;

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: userResponse
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error registering user',
            error: error.message 
        });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }

        // Find user by email
        const query = {
            query: "SELECT * FROM c WHERE c.email = @email AND c.type = 'user'",
            parameters: [{ name: "@email", value: email.toLowerCase() }]
        };

        const { resources: users } = await container.items.query(query).fetchAll();

        if (users.length === 0) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        const user = users[0];

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
        }

        // Remove password from response
        const { password: _, ...userResponse } = user;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: userResponse
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error logging in',
            error: error.message 
        });
    }
});

module.exports = router;
