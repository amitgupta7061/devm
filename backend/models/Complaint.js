const mongoose = require('mongoose');

const remarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    enum: ['student', 'staff', 'admin'],
    required: true
  },
  comment: {
    type: String,
    required: [true, 'Remark content cannot be empty'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const complaintSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a complaint title'],
    trim: true,
    maxlength: 120
  },
  description: {
    type: String,
    required: [true, 'Please describe the issue in detail'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'Wi-Fi / Internet',
      'Laboratory Equipment',
      'Classroom & Projector',
      'Electricity & Power',
      'Hostel & Maintenance',
      'Sanitation & Water',
      'Security & Access',
      'Other'
    ],
    default: 'Other'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Pending'
  },
  location: {
    building: {
      type: String,
      required: [true, 'Building or Block name is required'],
      trim: true
    },
    roomOrArea: {
      type: String,
      required: [true, 'Room or Area identifier is required'],
      trim: true
    }
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  resolutionRemarks: {
    type: String,
    default: ''
  },
  remarks: [remarkSchema],
  resolvedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-generate ticketId before saving
complaintSchema.pre('save', async function (next) {
  this.updatedAt = Date.now();
  if (!this.ticketId) {
    const count = await this.constructor.countDocuments();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    this.ticketId = `CMP-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);

