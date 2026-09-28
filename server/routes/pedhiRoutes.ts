import { Router, Response } from 'express';
import { Pedhi } from '../models/Pedhi.js';
import { User } from '../models/User.js';
import { optionalAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

// List all Pedhis for the current user's organization
router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    let query: any = {};
    if (req.user?.organizationId) {
      query.organizationId = req.user.organizationId;
    }
    const pedhis = await Pedhi.find(query).sort({ createdAt: 1 });
    res.json({ success: true, pedhis });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single Pedhi details
router.get('/:id', async (req: any, res: Response) => {
  try {
    const pedhi = await Pedhi.findById(req.params.id);
    if (!pedhi) {
      return res.status(404).json({ success: false, message: 'Pedhi not found' });
    }
    res.json({ success: true, pedhi });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create new Pedhi (business unit)
router.post('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { name, businessType, tagline, contactDetails, bankDetails, settings } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Pedhi name is required' });
    }

    let orgId = req.user?.organizationId;
    if (!orgId) {
      const existingPedhi = await Pedhi.findOne({});
      if (existingPedhi) {
        orgId = existingPedhi.organizationId.toString();
      }
    }

    const newPedhi = await Pedhi.create({
      organizationId: orgId,
      name,
      businessType: businessType || 'General Business',
      tagline: tagline || '',
      contactDetails: contactDetails || {},
      bankDetails: bankDetails || {},
      settings: settings || {
        currency: 'INR',
        dateFormat: 'DD/MM/YYYY',
        invoicePrefix: `${name.substring(0, 3).toUpperCase()}/`,
        invoiceNextNumber: 101,
        stateCode: '24'
      }
    });

    // If there is an authenticated user, automatically grant them Super Admin/Pedhi Admin role on this new pedhi
    if (req.user?.id) {
      await User.findByIdAndUpdate(req.user.id, {
        $push: {
          pedhis: {
            pedhiId: newPedhi._id,
            role: 'Super Admin'
          }
        }
      });
    }

    res.status(201).json({ success: true, pedhi: newPedhi });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Pedhi
router.put('/:id', async (req: any, res: Response) => {
  try {
    const { name, businessType, tagline, contactDetails, bankDetails, settings } = req.body;

    const updated = await Pedhi.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...(name && { name }),
          ...(businessType && { businessType }),
          ...(tagline !== undefined && { tagline }),
          ...(contactDetails && { contactDetails }),
          ...(bankDetails && { bankDetails }),
          ...(settings && { settings })
        }
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Pedhi not found' });
    }

    res.json({ success: true, pedhi: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
