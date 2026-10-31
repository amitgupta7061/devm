const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/complaints
// @desc    Submit a new complaint
// @access  Private (Students, Admins)
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, category, priority, location } = req.body;

    if (!title || !description || !category || !location || !location.building || !location.roomOrArea) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, category, and complete location details (building and room).'
      });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority: priority || 'Medium',
      location: {
        building: location.building,
        roomOrArea: location.roomOrArea
      },
      submittedBy: req.user._id,
      status: 'Pending'
    });

    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('submittedBy', 'name email department registrationNumber')
      .populate('assignedTo', 'name email department phone');

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully.',
      data: populatedComplaint
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting complaint.'
    });
  }
});

// @route   GET /api/complaints
// @desc    Get complaints list (filtered by role)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, category, priority, search } = req.query;
    let query = {};

    // Role-based filtering
    if (req.user.role === 'student') {
      query.submittedBy = req.user._id;
    } else if (req.user.role === 'staff') {
      // Staff sees complaints assigned to them
      query.assignedTo = req.user._id;
    }
    // Admin sees all complaints by default

    // Additional query filters
    if (status && status !== 'All') {
      query.status = status;
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (priority && priority !== 'All') {
      query.priority = priority;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { ticketId: { $regex: search, $options: 'i' } },
        { 'location.building': { $regex: search, $options: 'i' } },
        { 'location.roomOrArea': { $regex: search, $options: 'i' } }
      ];
    }

    const complaints = await Complaint.find(query)
      .populate('submittedBy', 'name email department registrationNumber')
      .populate('assignedTo', 'name email department phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching complaints.'
    });
  }
});

// @route   GET /api/complaints/:id
// @desc    Get single complaint details
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('submittedBy', 'name email department phone registrationNumber')
      .populate('assignedTo', 'name email department phone');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.'
      });
    }

    // Role access check
    if (
      req.user.role === 'student' &&
      complaint.submittedBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this complaint.'
      });
    }

    res.status(200).json({
      success: true,
      data: complaint
    });
  } catch (error) {
    console.error('Get complaint details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving complaint details.'
    });
  }
});

// @route   PUT /api/complaints/:id
// @desc    Update complaint (Admin: assign, priority, status; Staff: status, remarks)
// @access  Private (Admin, Staff)
router.put('/:id', protect, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.'
      });
    }

    const { status, priority, assignedTo, resolutionRemarks, newRemark } = req.body;

    // Staff restrictions: can only update complaints assigned to them
    if (req.user.role === 'staff') {
      if (!complaint.assignedTo || complaint.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You can only update complaints that are assigned to you.'
        });
      }

      if (status) {
        complaint.status = status;
        if (status === 'Resolved') {
          complaint.resolvedAt = Date.now();
        }
      }

      if (resolutionRemarks !== undefined) {
        complaint.resolutionRemarks = resolutionRemarks;
      }
    }

    // Admin privileges: full control
    if (req.user.role === 'admin') {
      if (status) {
        complaint.status = status;
        if (status === 'Resolved' && !complaint.resolvedAt) {
          complaint.resolvedAt = Date.now();
        } else if (status !== 'Resolved') {
          complaint.resolvedAt = null;
        }
      }

      if (priority) {
        complaint.priority = priority;
      }

      if (assignedTo !== undefined) {
        complaint.assignedTo = assignedTo || null;
        // If assigned and still pending, automatically set to In Progress if desired or keep pending
        if (assignedTo && complaint.status === 'Pending') {
          complaint.status = 'In Progress';
        }
      }

      if (resolutionRemarks !== undefined) {
        complaint.resolutionRemarks = resolutionRemarks;
      }
    }

    // Append new remark if provided by any involved party
    if (newRemark && newRemark.trim()) {
      complaint.remarks.push({
        user: req.user._id,
        userName: req.user.name,
        userRole: req.user.role,
        comment: newRemark.trim(),
        createdAt: new Date()
      });
    }

    await complaint.save();

    const updated = await Complaint.findById(complaint._id)
      .populate('submittedBy', 'name email department registrationNumber')
      .populate('assignedTo', 'name email department phone');

    res.status(200).json({
      success: true,
      message: 'Complaint updated successfully.',
      data: updated
    });
  } catch (error) {
    console.error('Update complaint error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating complaint.'
    });
  }
});

// @route   DELETE /api/complaints/:id
// @desc    Delete complaint
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found.'
      });
    }

    await complaint.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully.'
    });
  } catch (error) {
    console.error('Delete complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting complaint.'
    });
  }
});

module.exports = router;

