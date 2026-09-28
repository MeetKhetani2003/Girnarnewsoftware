import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Organization } from '../models/Organization.js';
import { Pedhi } from '../models/Pedhi.js';
import { User } from '../models/User.js';
import { Customer } from '../models/Customer.js';
import { Product } from '../models/Product.js';
import { Invoice } from '../models/Invoice.js';
import { Transaction } from '../models/Transaction.js';
import { Order } from '../models/Order.js';
import { Supplier } from '../models/Supplier.js';
import { StockTransfer } from '../models/StockTransfer.js';

const router = Router();

export async function runInitialSeedIfNeeded() {
  try {
    const pedhiCount = await Pedhi.countDocuments();
    // Check if the 4 pedhis are present
    const hasGirnar = await Pedhi.findOne({ name: /Girnarshilp/i });
    const hasArvind = await Pedhi.findOne({ name: /ArvindRamjibhai/i });
    if (pedhiCount >= 4 && hasGirnar && hasArvind) {
      console.log('[Seed] Required 4 pedhis already configured. Skipping auto-seed.');
      return;
    }

    console.log('[Seed] Seeding specialized 4-Pedhi Shilp & Kala enterprise ecosystem...');
    await performSeed();
  } catch (error: any) {
    console.error('[Seed Error] Failed to run initial seed:', error.message);
  }
}

export async function performSeed() {
  // Clear collections
  await Promise.all([
    Organization.deleteMany({}),
    Pedhi.deleteMany({}),
    User.deleteMany({}),
    Customer.deleteMany({}),
    Product.deleteMany({}),
    Invoice.deleteMany({}),
    Transaction.deleteMany({}),
    Order.deleteMany({}),
    Supplier.deleteMany({}),
    StockTransfer.deleteMany({}),
  ]);

  try {
    await Order.collection.dropIndexes();
  } catch (e) {
    // ignore
  }

  // 1. Organization
  const org = await Organization.create({
    name: 'Girnar Shilp Kala Mandir Group',
    code: 'GSKM',
    status: 'active'
  });

  // 2. The 4 Specialized Pedhis requested by user:
  // 1) Girnarshilp
  const pedhiGirnar = await Pedhi.create({
    organizationId: org._id,
    name: 'Girnarshilp',
    businessType: 'Temple Architecture, Mandirs & Mega Projects',
    tagline: 'Master Designers of Heritage Marble Mandirs & Sculptures',
    contactDetails: {
      mobile: '+91 98765 43210',
      phone: '0281-2456789',
      email: 'info@girnarshilp.com',
      address: 'Plot 101, Gondal Road, Near Aji Dam',
      city: 'Rajkot',
      state: 'Gujarat',
      pincode: '360004',
      gstNumber: '24AAACG1111F1Z1',
      panNumber: 'AAACG1111F'
    },
    bankDetails: {
      bankName: 'State Bank of India',
      accountHolder: 'Girnarshilp Enterprise',
      accountNumber: '389011112222',
      ifscCode: 'SBIN0001001',
      branch: 'Gondal Road Rajkot',
      upiId: 'girnarshilp@sbi'
    },
    settings: {
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      invoicePrefix: 'GS/',
      invoiceNextNumber: 104,
      stateCode: '24',
      termsAndConditions: '1. Handcrafted stone & wooden mandirs are custom manufactured as per drawing.\n2. 50% advance with work order, balance before transit dispatch.\n3. Subject to Rajkot jurisdiction.'
    }
  });

  // 2) ArvindRamjibhai
  const pedhiArvind = await Pedhi.create({
    organizationId: org._id,
    name: 'ArvindRamjibhai',
    businessType: 'Pure Sevan Wooden Mandir Crafting & Traditional Woodwork',
    tagline: 'Finest Pure Sevan Wood Hand-Carved Mandirs Since 1982',
    contactDetails: {
      mobile: '+91 98251 22334',
      phone: '0281-2244556',
      email: 'arvindramjibhai@gmail.com',
      address: 'Lakdi Mandi, Near Dhebar Road South',
      city: 'Rajkot',
      state: 'Gujarat',
      pincode: '360002',
      gstNumber: '24AAAR4433K1Z9',
      panNumber: 'AAAR4433K'
    },
    bankDetails: {
      bankName: 'Bank of Baroda',
      accountHolder: 'Arvind Ramjibhai Pedhi',
      accountNumber: '223300114455',
      ifscCode: 'BARB0DHEBAR',
      branch: 'Dhebar Road',
      upiId: 'arvindramjibhai@barodampay'
    },
    settings: {
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      invoicePrefix: 'AR/',
      invoiceNextNumber: 201,
      stateCode: '24',
      termsAndConditions: '1. Certified 100% seasoned Sevan wood used for all mandirs.\n2. Termite and weather resistant PU finish applied.\n3. Subject to Rajkot jurisdiction.'
    }
  });

  // 3) Jaipurshilpkala
  const pedhiJaipur = await Pedhi.create({
    organizationId: org._id,
    name: 'Jaipurshilpkala',
    businessType: 'Divine Marble Bhagwan Murtis & 24K Gold Foil Art',
    tagline: 'Divine Bhagwan Murtis Sculpted from Pure Makrana Marble',
    contactDetails: {
      mobile: '+91 94140 88990',
      phone: '0141-2601122',
      email: 'jaipurshilpkala@gmail.com',
      address: 'Murti Mohalla, Khazane Walon Ka Rasta, Kishanpole Bazar',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302001',
      gstNumber: '08AAACJ5566G1ZQ',
      panNumber: 'AAACJ5566G'
    },
    bankDetails: {
      bankName: 'HDFC Bank',
      accountHolder: 'Jaipur Shilp Kala',
      accountNumber: '50200077889900',
      ifscCode: 'HDFC0000123',
      branch: 'Kishanpole Jaipur',
      upiId: 'jaipurshilpkala@hdfc'
    },
    settings: {
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      invoicePrefix: 'JSK/',
      invoiceNextNumber: 301,
      stateCode: '08',
      termsAndConditions: '1. Real Makrana marble with natural subtle veins.\n2. 24 Karat gold leaf foil work has lifetime warranty against peeling.\n3. Subject to Jaipur jurisdiction.'
    }
  });

  // 4) Bhagvatikalamandir
  const pedhiBhagvati = await Pedhi.create({
    organizationId: org._id,
    name: 'Bhagvatikalamandir',
    businessType: 'Granite, Marble & Lakha Red Stone Takti (Plaques) & Engravings',
    tagline: 'Computerized & Hand-Carved Memorial & Temple Donor Taktis (Sq.Ft)',
    contactDetails: {
      mobile: '+91 97250 33445',
      phone: '02822-243311',
      email: 'bhagvatikalamandir@gmail.com',
      address: 'GIDC Phase 2, Near Stone Market',
      city: 'Morbi',
      state: 'Gujarat',
      pincode: '363641',
      gstNumber: '24AAACB9988H1ZV',
      panNumber: 'AAACB9988H'
    },
    bankDetails: {
      bankName: 'ICICI Bank',
      accountHolder: 'Bhagvati Kala Mandir',
      accountNumber: '012305009988',
      ifscCode: 'ICIC0000123',
      branch: 'Morbi Main',
      upiId: 'bhagvatikala@icici'
    },
    settings: {
      currency: 'INR',
      dateFormat: 'DD/MM/YYYY',
      invoicePrefix: 'BKM/',
      invoiceNextNumber: 401,
      stateCode: '24',
      termsAndConditions: '1. Takti measurements strictly in Square Feet (Length in. x Width in. / 144).\n2. Engraving text proof approved by customer on WhatsApp before carving.\n3. Subject to Morbi jurisdiction.'
    }
  });

  // 3. Admin User
  const adminUser = await User.create({
    name: 'Meet Khetani',
    mobile: '9876543210',
    email: 'meetkhetani1111@gmail.com',
    password: 'password123',
    organizationId: org._id,
    pedhis: [
      { pedhiId: pedhiGirnar._id, role: 'Super Admin' },
      { pedhiId: pedhiArvind._id, role: 'Super Admin' },
      { pedhiId: pedhiJaipur._id, role: 'Super Admin' },
      { pedhiId: pedhiBhagvati._id, role: 'Super Admin' }
    ],
    status: 'active'
  });

  // 4. Products for the 3 distinct product lines:
  // LINE 1: TAKTI (Granite, Marble, Lakha Red Stone measured in Square Feet)
  const taktiProducts = await Product.create([
    {
      pedhiId: pedhiBhagvati._id,
      name: 'Lakha Red Stone Temple Donor Takti (Sq.Ft)',
      productType: 'takti',
      category: 'Stone Takti',
      unit: 'SqFt',
      hsnCode: '6802',
      sellingPrice: 420, // Rate per Sq.Ft
      purchasePrice: 190,
      currentStock: 450, // 450 Sq.Ft in stock
      minStockAlert: 100,
      gstRate: 12,
      sku: 'TAK-LAKHA-RED',
      taktiSpecs: {
        stoneType: 'Lakha Red Stone',
        lengthInches: 24,
        widthInches: 18,
        totalSqFt: 3.0,
        thickness: '25mm (1 Inch)',
        workType: 'Deep CNC V-Carve + 24K Gold Inscription',
        engravingTextSample: 'શ્રી સોમનાથ મહાદેવ મંદિર જીર્ણોદ્ધાર દાતા પરિવાર...'
      },
      description: 'Durable Rajasthan Lakha Red stone with deep hand chiseled gold leaf text filling. 100% weather-proof for outdoor temple walls.'
    },
    {
      pedhiId: pedhiBhagvati._id,
      name: 'Black Jet Granite Memorial & Dedication Takti',
      productType: 'takti',
      category: 'Stone Takti',
      unit: 'SqFt',
      hsnCode: '6802',
      sellingPrice: 380, // Rate per SqFt
      purchasePrice: 160,
      currentStock: 680,
      minStockAlert: 150,
      gstRate: 12,
      sku: 'TAK-GRN-BLK',
      taktiSpecs: {
        stoneType: 'Black Jet Granite',
        lengthInches: 36,
        widthInches: 24,
        totalSqFt: 6.0,
        thickness: '18mm',
        workType: 'Laser Etched Photo + Gold Letter Inscription',
        engravingTextSample: 'સ્વ. શાંતિલાલ પટેલ સ્મૃતિ તકતી...'
      },
      description: 'Mirror polished absolute black granite with gold filling and photo etching.'
    },
    {
      pedhiId: pedhiBhagvati._id,
      name: 'Makrana Pure White Marble Donor Takti',
      productType: 'takti',
      category: 'Stone Takti',
      unit: 'SqFt',
      hsnCode: '6802',
      sellingPrice: 520, // Rate per SqFt
      purchasePrice: 240,
      currentStock: 280,
      minStockAlert: 80,
      gstRate: 12,
      sku: 'TAK-MAR-MAK',
      taktiSpecs: {
        stoneType: 'Makrana White Marble',
        lengthInches: 30,
        widthInches: 20,
        totalSqFt: 4.16,
        thickness: '20mm',
        workType: 'Hand Chiseled Nagari Script with Black & Gold Oil Filling',
        engravingTextSample: 'પરમ પૂજ્ય સંત શ્રી કલ્યાણદાસજી મહારાજ સ્મારક...'
      },
      description: 'Grade-A Makrana white marble plaque with traditional hand calligraphy.'
    },
    // Also available in Girnarshilp showroom
    {
      pedhiId: pedhiGirnar._id,
      name: 'Lakha Red Stone Temple Donor Takti (Sq.Ft)',
      productType: 'takti',
      category: 'Stone Takti',
      unit: 'SqFt',
      hsnCode: '6802',
      sellingPrice: 440,
      purchasePrice: 200,
      currentStock: 180,
      minStockAlert: 50,
      gstRate: 12,
      sku: 'TAK-LAKHA-GS',
      taktiSpecs: {
        stoneType: 'Lakha Red Stone',
        lengthInches: 24,
        widthInches: 18,
        totalSqFt: 3.0,
        thickness: '25mm',
        workType: 'Deep CNC V-Carve + 24K Gold Inscription'
      },
      description: 'Lakha Red stone slab with engraving options for temple donor boards.'
    }
  ]);

  // LINE 2: MANDIR (Pure Sevan Wooden Mandir & Marble Mandir)
  const mandirProducts = await Product.create([
    {
      pedhiId: pedhiArvind._id,
      name: 'Pure Sevan Wooden 3-Shikhara Mandir (48"x24"x66")',
      productType: 'mandir',
      category: 'Sevan Wooden Mandir',
      unit: 'Pcs',
      hsnCode: '4420',
      sellingPrice: 78000,
      purchasePrice: 42000,
      currentStock: 4,
      minStockAlert: 2,
      gstRate: 12,
      sku: 'MAN-SEV-4824',
      mandirSpecs: {
        material: 'Pure Sevan Wood',
        widthInches: 48,
        depthInches: 24,
        heightInches: 66,
        dimensionDisplay: '48"W x 24"D x 66"H (4ft x 2ft x 5.5ft)',
        shikharaType: '3 Shikhara with Kalash',
        carvingLevel: 'Heavy Hand Carved with Elephant Base & Peacock Arch',
        hasDrawers: true,
        hasDiyaTray: true,
        polishFinish: 'Natural Golden Sevan Wood Glossy PU'
      },
      description: '100% genuine sacred Sevan wood home mandir. Handcrafted elephant pillars, 3 shikharas with brass finials, push-out pooja thali tray and dual storage drawers.'
    },
    {
      pedhiId: pedhiArvind._id,
      name: 'Compact Sevan Wood Carved Mandir (36"x21"x54")',
      productType: 'mandir',
      category: 'Sevan Wooden Mandir',
      unit: 'Pcs',
      hsnCode: '4420',
      sellingPrice: 48000,
      purchasePrice: 26000,
      currentStock: 6,
      minStockAlert: 2,
      gstRate: 12,
      sku: 'MAN-SEV-3621',
      mandirSpecs: {
        material: 'Pure Sevan Wood',
        widthInches: 36,
        depthInches: 21,
        heightInches: 54,
        dimensionDisplay: '36"W x 21"D x 54"H (3ft x 1.75ft x 4.5ft)',
        shikharaType: 'Single Shikhara Dome',
        carvingLevel: 'Intricate Floral & Bell Carving',
        hasDrawers: true,
        hasDiyaTray: true,
        polishFinish: 'Matte Honey Sevan Polish'
      },
      description: 'Ideal modern apartment size Sevan wood mandir with bell carving and brass hardware.'
    },
    {
      pedhiId: pedhiGirnar._id,
      name: 'Makrana White Marble Hand-Carved Mandir (42"x24"x72")',
      productType: 'mandir',
      category: 'Marble Mandir',
      unit: 'Pcs',
      hsnCode: '6802',
      sellingPrice: 145000,
      purchasePrice: 85000,
      currentStock: 2,
      minStockAlert: 1,
      gstRate: 12,
      sku: 'MAN-MAR-4224',
      mandirSpecs: {
        material: 'Makrana White Marble',
        widthInches: 42,
        depthInches: 24,
        heightInches: 72,
        dimensionDisplay: '42"W x 24"D x 72"H (3.5ft x 2ft x 6ft)',
        shikharaType: 'Grand 3-Tier Shikhara',
        carvingLevel: 'Super Fine Carved Pillars & Peacock Toran',
        hasDrawers: true,
        hasDiyaTray: true,
        polishFinish: 'Pure White Mirror Buff Polish'
      },
      description: 'Spectacular Makrana white marble mandir with backlit carved jali, elephant pillars, and golden highlights.'
    }
  ]);

  // LINE 3: BHAGWAN MARBLE MURTIS (Height in Inches with Deity & Gold Leaf Art)
  const murtiProducts = await Product.create([
    {
      pedhiId: pedhiJaipur._id,
      name: 'Radha Krishna Marble Murty (24 Inch) - 24K Gold Foil',
      productType: 'murti',
      category: 'Bhagwan Murti',
      unit: 'Pcs',
      hsnCode: '6802',
      sellingPrice: 85000,
      purchasePrice: 48000,
      currentStock: 3,
      minStockAlert: 1,
      gstRate: 12,
      sku: 'MUR-RK-24',
      murtiSpecs: {
        deity: 'Radha Krishna',
        heightInches: 24,
        marbleGrade: 'Makrana Super White (Grade A)',
        posture: 'Standing Tribhanga with Flute',
        shringarWork: '24K Real Gold Leaf Foil (Vark) & Minakari Painting',
        nayanType: 'Amrut Nayan Hand Carved'
      },
      description: 'Divine Radha Krishna Jugal Jodi sculpted in pristine Makrana marble by master Jaipur artisans with real 24 karat gold ornamentation.'
    },
    {
      pedhiId: pedhiJaipur._id,
      name: 'Siddhivinayak Ganeshji Marble Murty (18 Inch)',
      productType: 'murti',
      category: 'Bhagwan Murti',
      unit: 'Pcs',
      hsnCode: '6802',
      sellingPrice: 38000,
      purchasePrice: 21000,
      currentStock: 5,
      minStockAlert: 2,
      gstRate: 12,
      sku: 'MUR-GAN-18',
      murtiSpecs: {
        deity: 'Ganeshji',
        heightInches: 18,
        marbleGrade: 'Makrana Super White (Grade A)',
        posture: 'Lalitasana on Lotus Throne',
        shringarWork: '24K Gold Crown (Mukut) & Pitambari',
        nayanType: 'Amrut Nayan Hand Carved'
      },
      description: 'Blessed Siddhivinayak Ganesha with modak and mooshak. Real gold leaf mukut and trishul.'
    },
    {
      pedhiId: pedhiJaipur._id,
      name: 'Shiv Parivar Complete Marble Murty Set (21 Inch)',
      productType: 'murti',
      category: 'Bhagwan Murti',
      unit: 'Pcs',
      hsnCode: '6802',
      sellingPrice: 92000,
      purchasePrice: 54000,
      currentStock: 2,
      minStockAlert: 1,
      gstRate: 12,
      sku: 'MUR-SHIV-21',
      murtiSpecs: {
        deity: 'Shiv Parivar',
        heightInches: 21,
        marbleGrade: 'Makrana Super White (Grade A)',
        posture: 'Mount Kailash Darbar with Nandi, Kartikeya & Ganesh',
        shringarWork: 'Antique Gold Finish & Natural Marble Buff',
        nayanType: 'Trinetra Carved'
      },
      description: 'Complete holy family with Lord Shiva, Mata Parvati, Lord Ganesha, Kartikeya, and Nandi.'
    },
    {
      pedhiId: pedhiJaipur._id,
      name: 'Maa Durga Simhavahini Marble Murty (21 Inch)',
      productType: 'murti',
      category: 'Bhagwan Murti',
      unit: 'Pcs',
      hsnCode: '6802',
      sellingPrice: 58000,
      purchasePrice: 32000,
      currentStock: 4,
      minStockAlert: 1,
      gstRate: 12,
      sku: 'MUR-DUR-21',
      murtiSpecs: {
        deity: 'Maa Ambaji / Durga',
        heightInches: 21,
        marbleGrade: 'Makrana Super White (Grade A)',
        posture: 'Ashtabhuja Riding Lion',
        shringarWork: '24K Gold Foil Work (Vark)',
        nayanType: 'Amrut Nayan'
      },
      description: 'Eight-armed Sherawali Maa with divine weapons and detailed lion mane carving.'
    },
    // Available in Girnarshilp Showroom
    {
      pedhiId: pedhiGirnar._id,
      name: 'Radha Krishna Marble Murty (18 Inch) - Gold Shringar',
      productType: 'murti',
      category: 'Bhagwan Murti',
      unit: 'Pcs',
      hsnCode: '6802',
      sellingPrice: 52000,
      purchasePrice: 30000,
      currentStock: 2,
      minStockAlert: 1,
      gstRate: 12,
      sku: 'MUR-RK-18-GS',
      murtiSpecs: {
        deity: 'Radha Krishna',
        heightInches: 18,
        marbleGrade: 'Makrana Super White (Grade A)',
        posture: 'Standing on Lotus Base',
        shringarWork: '24K Gold Foil Work (Vark)'
      },
      description: 'Hand sculpted in Jaipur, ready in Rajkot showroom.'
    }
  ]);

  // 5. Customers
  const customer1 = await Customer.create({
    pedhiId: pedhiGirnar._id,
    name: 'Somnath Mandir Trust & Nirman',
    partyType: 'Customer',
    mobile: '9825012345',
    email: 'construction@somnathtrust.org',
    city: 'Veraval',
    state: 'Gujarat',
    gstNumber: '24AABTS9901M1Z1',
    openingBalance: 120000,
    currentBalance: 165000, // Lena
    creditLimit: 500000,
    notes: 'Major temple trust buyer for Lakha Red takti and marble carvings.'
  });

  const customer2 = await Customer.create({
    pedhiId: pedhiArvind._id,
    name: 'Jain Sangh & Sthanak Vasi Mandal',
    partyType: 'Customer',
    mobile: '9898099887',
    email: 'jainsangh.rajkot@gmail.com',
    city: 'Rajkot',
    state: 'Gujarat',
    gstNumber: '24AAATJ1234E1Z0',
    openingBalance: 50000,
    currentBalance: 78000,
    creditLimit: 300000,
    notes: 'Regular order for Sevan wood Derasar mandirs and chowkis.'
  });

  const customer3 = await Customer.create({
    pedhiId: pedhiBhagvati._id,
    name: 'Shree Swaminarayan Gurukul Trust',
    partyType: 'Customer',
    mobile: '9724011223',
    city: 'Morbi',
    state: 'Gujarat',
    gstNumber: '24AABCS7788P1Z4',
    openingBalance: 25000,
    currentBalance: 42000,
    creditLimit: 250000,
    notes: 'Bulk donor taktis in Lakha Red stone with Gujarati text.'
  });

  // 6. Suppliers (Quarries, Timber traders, Karigars)
  await Supplier.create([
    {
      pedhiId: pedhiBhagvati._id,
      name: 'Lakha Red Stone Quarry Miners (Barmer)',
      category: 'Stone Quarry',
      mobile: '9414122334',
      city: 'Barmer',
      address: 'Industrial Mining Zone, Lakha Village',
      gstNumber: '08AAICL1234C1Z2',
      openingBalance: 45000,
      currentBalance: 75000, // We owe them (Dena)
      materialSupplied: 'Rough Lakha Red Granite Slabs 20mm & 25mm thickness'
    },
    {
      pedhiId: pedhiArvind._id,
      name: 'Gir Forest Sevan Wood Timber Merchants',
      category: 'Sevan Timber',
      mobile: '9825544332',
      city: 'Junagadh',
      address: 'Timber Yard, Near Station Road',
      gstNumber: '24AAATS5544B1Z5',
      openingBalance: 30000,
      currentBalance: 52000,
      materialSupplied: 'Seasoned Grade-A Pure Sevan Wood Logs and Planks'
    },
    {
      pedhiId: pedhiJaipur._id,
      name: 'Makrana Marble Mines & Blocks (Nagaur)',
      category: 'Makrana Marble',
      mobile: '9414033221',
      city: 'Makrana',
      address: 'Mine Plot 45, Dungri Range',
      gstNumber: '08AABCM9988D1Z9',
      openingBalance: 80000,
      currentBalance: 120000,
      materialSupplied: 'First Quality Flawless White Makrana Marble Blocks'
    },
    {
      pedhiId: pedhiJaipur._id,
      name: 'Ustad Ramkishan Master Murtikar Studio',
      category: 'Karigar / Artisan',
      mobile: '9829011223',
      city: 'Jaipur',
      address: 'Kishanpole Murti Gali',
      openingBalance: 20000,
      currentBalance: 35000,
      materialSupplied: 'Master deity facial carving, Amrut Nayan art & 24K gold foil application'
    }
  ]);

  // 7. Orders Management (Custom Mandir, Murti & Takti Bookings)
  const order1 = await Order.create({
    pedhiId: pedhiGirnar._id,
    orderNumber: 'ORD-GS-501',
    orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    deliveryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    customerId: customer1._id,
    customerName: customer1.name,
    customerMobile: customer1.mobile,
    productType: 'mandir',
    title: 'Custom Makrana Marble Mandir (5ft x 2.5ft x 7ft)',
    specsSummary: '60"W x 30"D x 84"H with 3 Shikhara, Carved Pillars & Peacock Toran',
    customDetails: {
      stoneOrWoodType: 'Makrana Super White Marble',
      dimensionsText: '60"W x 30"D x 84"H',
      shikharaOrDome: 'Grand 3-Tier Shikhara with Kalash',
      goldWorkOrFinish: 'Gold Leaf Shringar on Toran & Pillars'
    },
    totalAmount: 185000,
    advancePaid: 90000,
    balanceDue: 95000,
    status: 'Carving & Carpentry',
    assignedKarigar: 'Artisan Workshop Team B',
    notes: 'To be shipped with special wooden crate packaging to Somnath site.'
  });

  const order2 = await Order.create({
    pedhiId: pedhiBhagvati._id,
    orderNumber: 'ORD-BKM-204',
    orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    customerId: customer3._id,
    customerName: customer3.name,
    customerMobile: customer3.mobile,
    productType: 'takti',
    title: 'Lakha Red Granite Donor Takti (36" x 24" = 6.0 Sq.Ft)',
    specsSummary: '6.0 Sq.Ft Lakha Red Stone with 24K Gold Inscription',
    customDetails: {
      stoneOrWoodType: 'Lakha Red Stone',
      dimensionsText: '36" x 24"',
      calculatedSqFt: 6.0,
      engravingText: 'શ્રી સ્વામિનારાયણ ગુરુકુલ મોરબી નૂતન સત્સંગ ભવન દાતા શ્રી હરજીવનભાઈ પટેલ...'
    },
    totalAmount: 2520, // 6 Sq.Ft x ₹420
    advancePaid: 1500,
    balanceDue: 1020,
    status: 'Shringar & Polish',
    assignedKarigar: 'CNC Engraving Dept',
    notes: 'Text proof verified and approved on WhatsApp.'
  });

  const order3 = await Order.create({
    pedhiId: pedhiJaipur._id,
    orderNumber: 'ORD-JSK-109',
    orderDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    deliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    customerId: customer2._id,
    customerName: customer2.name,
    customerMobile: customer2.mobile,
    productType: 'murti',
    title: 'Bhagwan Mahavira Swami Marble Idol (21 Inch)',
    specsSummary: '21" Makrana Grade-A Padmasana posture with Amrut Nayan',
    customDetails: {
      stoneOrWoodType: 'Makrana White Marble',
      heightInches: 21,
      deityName: 'Lord Mahavira Swami',
      goldWorkOrFinish: 'Pure Polished Milk White without color'
    },
    totalAmount: 64000,
    advancePaid: 30000,
    balanceDue: 34000,
    status: 'Shringar & Polish',
    assignedKarigar: 'Ustad Ramkishan Studio',
    notes: 'Padmasana posture on lion throne.'
  });

  // 8. Stock Transfer Record
  await StockTransfer.create({
    fromPedhiId: pedhiJaipur._id,
    fromPedhiName: 'Jaipurshilpkala',
    toPedhiId: pedhiGirnar._id,
    toPedhiName: 'Girnarshilp',
    productId: murtiProducts[0]._id,
    productName: 'Radha Krishna Marble Murty (24 Inch) - 24K Gold Foil',
    quantity: 1,
    unit: 'Pcs',
    productType: 'murti',
    transferNumber: 'TRF/2026/012',
    status: 'Received',
    vehicleNumber: 'RJ-14-GA-8822',
    transferDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    receivedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    notes: 'Transferred for VIP temple client inspection in Rajkot showroom.'
  });

  // 9. Invoices
  await Invoice.create({
    pedhiId: pedhiBhagvati._id,
    invoiceNumber: 'BKM/401',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    customerId: customer1._id,
    customerName: customer1.name,
    customerMobile: customer1.mobile,
    customerAddress: 'Prabhas Patan, Somnath Temple Complex',
    customerGst: customer1.gstNumber,
    isInterstate: false,
    items: [
      {
        productId: taktiProducts[0]._id,
        name: 'Lakha Red Stone Temple Donor Takti (24"x18" = 3.0 Sq.Ft)',
        category: 'Stone Takti',
        unit: 'SqFt',
        quantity: 30, // 10 taktis of 3 SqFt each = 30 Sq.Ft total
        rate: 420,
        discountPercent: 0,
        taxableAmount: 12600,
        gstRate: 12,
        cgstAmount: 756,
        sgstAmount: 756,
        igstAmount: 0,
        total: 14112
      }
    ],
    subtotal: 12600,
    discountTotal: 0,
    totalCgst: 756,
    totalSgst: 756,
    totalIgst: 0,
    roundOff: 0,
    grandTotal: 14112,
    paymentMode: 'Bank Transfer',
    paymentStatus: 'Paid',
    amountPaid: 14112,
    balanceDue: 0,
    notes: '10 pieces Lakha red stone engraved donor taktis delivered to site.'
  });

  await Invoice.create({
    pedhiId: pedhiArvind._id,
    invoiceNumber: 'AR/201',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    customerId: customer2._id,
    customerName: customer2.name,
    customerMobile: customer2.mobile,
    customerAddress: 'Lakdi Mandi, Rajkot',
    customerGst: customer2.gstNumber,
    isInterstate: false,
    items: [
      {
        productId: mandirProducts[0]._id,
        name: 'Pure Sevan Wooden 3-Shikhara Mandir (48"x24"x66")',
        category: 'Sevan Wooden Mandir',
        unit: 'Pcs',
        quantity: 1,
        rate: 78000,
        discountPercent: 0,
        taxableAmount: 78000,
        gstRate: 12,
        cgstAmount: 4680,
        sgstAmount: 4680,
        igstAmount: 0,
        total: 87360
      }
    ],
    subtotal: 78000,
    discountTotal: 0,
    totalCgst: 4680,
    totalSgst: 4680,
    totalIgst: 0,
    roundOff: 0,
    grandTotal: 87360,
    paymentMode: 'Credit',
    paymentStatus: 'Partial',
    amountPaid: 50000,
    balanceDue: 37360,
    notes: 'Advance of ₹50,000 received via RTGS. Balance on home installation.'
  });

  // 10. Transactions
  await Transaction.create([
    {
      pedhiId: pedhiBhagvati._id,
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      type: 'PAYMENT_IN',
      amount: 14112,
      customerId: customer1._id,
      partyName: customer1.name,
      paymentMode: 'Bank Transfer',
      referenceNumber: 'RTGS-SOM99281',
      category: 'Customer Payment',
      notes: 'Full payment for Lakha Red takti invoice #401'
    },
    {
      pedhiId: pedhiArvind._id,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      type: 'PAYMENT_IN',
      amount: 50000,
      customerId: customer2._id,
      partyName: customer2.name,
      paymentMode: 'UPI',
      referenceNumber: 'UPI-SEV-8812',
      category: 'Customer Advance',
      notes: 'Advance for Sevan wooden mandir #201'
    }
  ]);

  console.log('[Seed] 4-Pedhi Shilp & Kala system seeded successfully!');
}

router.post('/reset-and-seed', async (req: Request, res: Response) => {
  try {
    await performSeed();
    res.json({ success: true, message: 'Database seeded with Girnarshilp, ArvindRamjibhai, Jaipurshilpkala & Bhagvatikalamandir data.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
