const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Complaint = require('./models/Complaint');

dotenv.config();

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart_campus_db';

const seedData = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('[Seed] Connected to MongoDB for seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Complaint.deleteMany({});
    console.log('[Seed] Cleared existing Users and Complaints.');

    // Create Users
    const admin = await User.create({
      name: 'Dr. Ramesh Sharma',
      email: 'admin@lpu.in',
      password: 'password123',
      role: 'admin',
      department: 'Campus Administration & DevOps Lead',
      phone: '+91-9876543210',
      registrationNumber: 'FAC-8891'
    });

    const staffNetwork = await User.create({
      name: 'Sunil Kumar (Network Lead)',
      email: 'sunil.network@lpu.in',
      password: 'password123',
      role: 'staff',
      department: 'Campus Wi-Fi & IT Infrastructure',
      phone: '+91-9876543211',
      registrationNumber: 'STF-1022'
    });

    const staffElectrical = await User.create({
      name: 'Rajesh Verma (Electrical & AC)',
      email: 'rajesh.maintenance@lpu.in',
      password: 'password123',
      role: 'staff',
      department: 'Electrical Maintenance & HVAC',
      phone: '+91-9876543212',
      registrationNumber: 'STF-1023'
    });

    const staffLab = await User.create({
      name: 'Priya Mehta (Lab Systems)',
      email: 'priya.lab@lpu.in',
      password: 'password123',
      role: 'staff',
      department: 'Computer Science Laboratories',
      phone: '+91-9876543213',
      registrationNumber: 'STF-1024'
    });

    const studentAarav = await User.create({
      name: 'Aarav Patel',
      email: 'aarav.student@lpu.in',
      password: 'password123',
      role: 'student',
      department: 'School of Computer Science & Engineering',
      phone: '+91-9876543214',
      registrationNumber: '12104523'
    });

    const studentAnanya = await User.create({
      name: 'Ananya Gupta',
      email: 'ananya.student@lpu.in',
      password: 'password123',
      role: 'student',
      department: 'Information Technology',
      phone: '+91-9876543215',
      registrationNumber: '12108912'
    });

    console.log('[Seed] Created default users (Admin, Staff, Students).');

    // Create Initial Complaints
    const complaintsData = [
      {
        ticketId: 'CMP-20261031-0001',
        title: 'High-speed Wi-Fi dropping frequently in Central Library',
        description: 'The Wi-Fi access point AP-LIB-3F is dropping connection every 5-10 minutes. Students are unable to access research papers and portals.',
        category: 'Wi-Fi / Internet',
        priority: 'High',
        status: 'In Progress',
        location: {
          building: 'Central Library Block 38',
          roomOrArea: '3rd Floor Study Hall'
        },
        submittedBy: studentAarav._id,
        assignedTo: staffNetwork._id,
        remarks: [
          {
            user: staffNetwork._id,
            userName: staffNetwork.name,
            userRole: staffNetwork.role,
            comment: 'Checked router channel congestion. Access point rebooted; firmware upgrade scheduled tonight.',
            createdAt: new Date(Date.now() - 2 * 3600 * 1000)
          }
        ]
      },
      {
        ticketId: 'CMP-20261031-0002',
        title: 'Ceiling Projector HDMI port broken in Classroom 34-402',
        description: 'The wall HDMI panel and projector cable are damaged. Professors are facing issues projecting presentation slides during INT333 lectures.',
        category: 'Classroom & Projector',
        priority: 'Urgent',
        status: 'In Progress',
        location: {
          building: 'Block 34 (Academic Complex)',
          roomOrArea: 'Lecture Hall 402'
        },
        submittedBy: studentAnanya._id,
        assignedTo: staffLab._id,
        remarks: [
          {
            user: staffLab._id,
            userName: staffLab.name,
            userRole: staffLab.role,
            comment: 'Replacement HDMI cable and transceiver requisition placed with department store.',
            createdAt: new Date(Date.now() - 5 * 3600 * 1000)
          }
        ]
      },
      {
        ticketId: 'CMP-20261031-0003',
        title: 'Water cooler dispensing warm water in Hostel 5',
        description: 'The 2nd floor water purification and chiller unit is not cooling properly.',
        category: 'Sanitation & Water',
        priority: 'Medium',
        status: 'Resolved',
        location: {
          building: 'Hostel 5 (Boys Wing B)',
          roomOrArea: '2nd Floor Water Station'
        },
        submittedBy: studentAarav._id,
        assignedTo: staffElectrical._id,
        resolutionRemarks: 'Cleaned compressor coils and refilled refrigerant gas. Chilling unit restored to 12°C normal operation.',
        resolvedAt: new Date(Date.now() - 12 * 3600 * 1000),
        remarks: [
          {
            user: staffElectrical._id,
            userName: staffElectrical.name,
            userRole: staffElectrical.role,
            comment: 'Refrigerant topped up and thermostat calibrated. Issue resolved.',
            createdAt: new Date(Date.now() - 12 * 3600 * 1000)
          }
        ]
      },
      {
        ticketId: 'CMP-20261031-0004',
        title: 'Switch socket sparking near workstation 14 in DevOps Lab',
        description: 'Workstation 14 wall outlet creates sparks when laptops are plugged in. Safety hazard, needs immediate inspection.',
        category: 'Electricity & Power',
        priority: 'Urgent',
        status: 'Pending',
        location: {
          building: 'Block 36 (DevOps Center of Excellence)',
          roomOrArea: 'Lab 602 Workstation 14'
        },
        submittedBy: studentAnanya._id,
        assignedTo: null,
        remarks: []
      },
      {
        ticketId: 'CMP-20261031-0005',
        title: 'Ubuntu dual-boot grub menu crashing on PC 22',
        description: 'PC 22 in INT333 Lab boots straight into Windows and does not show Ubuntu Linux option needed for Puppet and Docker lab assignments.',
        category: 'Laboratory Equipment',
        priority: 'Medium',
        status: 'Pending',
        location: {
          building: 'Block 34',
          roomOrArea: 'Lab 205 (Linux & Cloud Lab)'
        },
        submittedBy: studentAarav._id,
        assignedTo: null,
        remarks: []
      }
    ];

    for (const comp of complaintsData) {
      await Complaint.create(comp);
    }

    console.log(`[Seed] Seeded ${complaintsData.length} initial complaints successfully.`);
    console.log('\n=============================================');
    console.log('✅ SEEDING COMPLETE! Login Credentials:');
    console.log('Admin:       admin@lpu.in             / password123');
    console.log('Staff (Net): sunil.network@lpu.in     / password123');
    console.log('Staff (Ele): rajesh.maintenance@lpu.in / password123');
    console.log('Student 1:   aarav.student@lpu.in     / password123');
    console.log('Student 2:   ananya.student@lpu.in    / password123');
    console.log('=============================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;

