const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/stats/dashboard
// @desc    Get dashboard metrics and statistics
// @access  Private (Admin & Staff)
router.get('/dashboard', protect, async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingCount = await Complaint.countDocuments({ status: 'Pending' });
    const inProgressCount = await Complaint.countDocuments({ status: 'In Progress' });
    const resolvedCount = await Complaint.countDocuments({ status: 'Resolved' });
    const rejectedCount = await Complaint.countDocuments({ status: 'Rejected' });

    // Category distribution
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Priority distribution
    const priorityStats = await Complaint.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Total counts of users by role
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalStaff = await User.countDocuments({ role: 'staff' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    // Staff workload
    const staffWorkload = await Complaint.aggregate([
      { $match: { assignedTo: { $ne: null } } },
      { $group: { _id: '$assignedTo', count: { $sum: 1 }, activeCount: { $sum: { $cond: [{ $in: ['$status', ['Pending', 'In Progress']] }, 1, 0] } } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'staff' } },
      { $unwind: '$staff' },
      { $project: { staffId: '$_id', staffName: '$staff.name', department: '$staff.department', totalAssigned: '$count', activeTasks: '$activeCount' } }
    ]);

    // Average resolution time (in hours) for resolved complaints
    const resolutionMetrics = await Complaint.aggregate([
      { $match: { status: 'Resolved', resolvedAt: { $ne: null } } },
      {
        $project: {
          durationHours: {
            $divide: [{ $subtract: ['$resolvedAt', '$createdAt'] }, 1000 * 60 * 60]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgHours: { $avg: '$durationHours' }
        }
      }
    ]);

    const avgResolutionHours = resolutionMetrics.length > 0
      ? Math.round(resolutionMetrics[0].avgHours * 10) / 10
      : 0;

    res.status(200).json({
      success: true,
      data: {
        summary: {
          total: totalComplaints,
          pending: pendingCount,
          inProgress: inProgressCount,
          resolved: resolvedCount,
          rejected: rejectedCount,
          avgResolutionHours
        },
        users: {
          students: totalStudents,
          staff: totalStaff,
          admins: totalAdmins
        },
        categoryBreakdown: categoryStats.map(item => ({ category: item._id, count: item.count })),
        priorityBreakdown: priorityStats.map(item => ({ priority: item._id, count: item.count })),
        staffWorkload
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error computing dashboard statistics.'
    });
  }
});

module.exports = router;

