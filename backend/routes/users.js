const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/users/staff
// @desc    Get all maintenance staff members (for assignment dropdown)
// @access  Private (Admin, Staff)
router.get('/staff', protect, async (req, res) => {
  try {
    const staff = await User.find({ role: 'staff' }).select('name email department phone').sort({ name: 1 });
    res.status(200).json({
      success: true,
      data: staff
    });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching staff members.'
    });
  }
});

// @route   GET /api/users
// @desc    Get all users (with optional role filter)
// @access  Private (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { role, search } = req.query;
    let query = {};

    if (role && role !== 'All') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
        { registrationNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users.'
    });
  }
});

// @route   PUT /api/users/:id/role
// @desc    Update user role or department
// @access  Private (Admin only)
router.put('/:id/role', protect, authorize('admin'), async (req, res) => {
  try {
    const { role, department } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    if (role && ['student', 'staff', 'admin'].includes(role)) {
      user.role = role;
    }

    if (department) {
      user.department = department;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user role.'
    });
  }
});

module.exports = router;

