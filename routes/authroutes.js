const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Optional: include bcrypt for password security
const bcrypt = require('bcryptjs');

router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;

    // Basic validation
    if (!username || !password || !email) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    try {
        // Check if user already exists by username or email
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({ error: "User already exists. Please login using your credentials." });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({
            username,
            password: hashedPassword,
            email,
        });

        // Optionally you can store user in session here if login is automatic

        return res.render('login', { error: null });  // Make sure your login.ejs can handle `error`
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        // Set session
        req.session.user = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        // ⏳ Wait until session is saved before redirecting
        req.session.save((err) => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).json({ error: "Login session failed" });
            }

            // ✅ Now redirect to home or dashboard
            return res.redirect('/');
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    res.redirect('/');
  });
});

router.get('/delete-account', async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await User.findByIdAndDelete(req.session.user.id);
    req.session.destroy(() => {
      res.redirect('/');
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting account" });
  }
});


module.exports = router;
