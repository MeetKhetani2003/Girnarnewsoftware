import { Router, Request, Response } from 'express';
import { User } from '../models/User.js';
import { Organization } from '../models/Organization.js';
import { Pedhi } from '../models/Pedhi.js';
import { generateToken, AuthRequest, authenticate } from '../middleware/auth.js';

const router = Router();

// Register new user & org
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, mobile, email, password, orgName, pedhiName, businessType } = req.body;

    if (!name || !mobile || !password) {
      return res.status(400).json({ success: false, message: 'Name, mobile and password are required' });
    }

    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Mobile number already registered' });
    }

    // 1. Create Organization
    const organization = await Organization.create({
      name: orgName || `${name}'s Enterprises`,
      status: 'active'
    });

    // 2. Create Initial Pedhi
    const pedhi = await Pedhi.create({
      organizationId: organization._id,
      name: pedhiName || 'Main Pedhi',
      businessType: businessType || 'Wholesale & Retail',
      contactDetails: {
        mobile: mobile,
        email: email || '',
        city: 'Rajkot',
        state: 'Gujarat'
      }
    });

    // 3. Create User as Super Admin
    const user = await User.create({
      name,
      mobile,
      email,
      password,
      organizationId: organization._id,
      pedhis: [{
        pedhiId: pedhi._id,
        role: 'Super Admin'
      }],
      status: 'active'
    });

    const token = generateToken({
      id: user._id,
      name: user.name,
      mobile: user.mobile,
      organizationId: organization._id,
      pedhis: user.pedhis
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        organizationId: user.organizationId,
        pedhis: user.pedhis
      },
      currentPedhi: pedhi
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({ success: false, message: 'Mobile and password required' });
    }

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or user not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Fetch user's pedhis
    const pedhiIds = user.pedhis.map((p: any) => p.pedhiId);
    const pedhis = await Pedhi.find({ _id: { $in: pedhiIds } });

    const token = generateToken({
      id: user._id,
      name: user.name,
      mobile: user.mobile,
      organizationId: user.organizationId,
      pedhis: user.pedhis
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        organizationId: user.organizationId,
        pedhis: user.pedhis
      },
      pedhis,
      currentPedhi: pedhis[0] || null
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Demo quick-login without typing credentials
router.post('/demo-login', async (req: Request, res: Response) => {
  try {
    let user = await User.findOne({ mobile: '9876543210' });
    if (!user) {
      user = await User.findOne({});
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'No demo account available. Please seed data.' });
    }

    const pedhiIds = user.pedhis.map((p: any) => p.pedhiId);
    let pedhis = await Pedhi.find({ _id: { $in: pedhiIds } });
    if (pedhis.length === 0) {
      pedhis = await Pedhi.find({}).limit(5);
    }

    const token = generateToken({
      id: user._id,
      name: user.name,
      mobile: user.mobile,
      organizationId: user.organizationId,
      pedhis: user.pedhis
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        organizationId: user.organizationId,
        pedhis: user.pedhis
      },
      pedhis,
      currentPedhi: pedhis[0] || null
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Current User Me
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const pedhiIds = user.pedhis.map((p: any) => p.pedhiId);
    const pedhis = await Pedhi.find({ _id: { $in: pedhiIds } });

    res.json({
      success: true,
      user,
      pedhis
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
