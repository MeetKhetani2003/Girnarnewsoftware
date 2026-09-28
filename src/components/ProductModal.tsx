import React, { useState, useEffect } from 'react';
import { X, PackagePlus, Save, Calculator, Sparkles } from 'lucide-react';
import { Product, ProductType } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  onSuccess: (product?: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
  onSuccess,
}) => {
  const { currentPedhi } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [productType, setProductType] = useState<ProductType>('takti');
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Stone Takti');
  const [sellingPrice, setSellingPrice] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [currentStock, setCurrentStock] = useState('10');
  const [minStockAlert, setMinStockAlert] = useState('3');
  const [gstRate, setGstRate] = useState(12);
  const [hsnCode, setHsnCode] = useState('6802');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');

  // 1. Takti Specs
  const [taktiStoneType, setTaktiStoneType] = useState('Lakha Red Stone');
  const [taktiLength, setTaktiLength] = useState<number>(24);
  const [taktiWidth, setTaktiWidth] = useState<number>(18);
  const [taktiThickness, setTaktiThickness] = useState('25mm (1 Inch)');
  const [taktiWorkType, setTaktiWorkType] = useState('Deep CNC V-Carve + 24K Gold Inscription');

  // 2. Mandir Specs
  const [mandirMaterial, setMandirMaterial] = useState('Pure Sevan Wood');
  const [mandirWidth, setMandirWidth] = useState<number>(48);
  const [mandirDepth, setMandirDepth] = useState<number>(24);
  const [mandirHeight, setMandirHeight] = useState<number>(66);
  const [mandirShikhara, setMandirShikhara] = useState('3 Shikhara with Kalash');
  const [mandirCarving, setMandirCarving] = useState('Heavy Hand Carved with Elephant Base & Peacock Arch');
  const [mandirPolish, setMandirPolish] = useState('Natural Golden Sevan Wood Glossy PU');
  const [mandirHasDrawers, setMandirHasDrawers] = useState(true);
  const [mandirHasDiyaTray, setMandirHasDiyaTray] = useState(true);

  // 3. Murti Specs
  const [murtiDeity, setMurtiDeity] = useState('Radha Krishna');
  const [murtiHeight, setMurtiHeight] = useState<number>(24);
  const [murtiMarbleGrade, setMurtiMarbleGrade] = useState('Makrana Super White (Grade A)');
  const [murtiShringar, setMurtiShringar] = useState('24K Real Gold Leaf Foil (Vark) & Minakari');
  const [murtiPosture, setMurtiPosture] = useState('Standing Tribhanga with Flute');

  // Calculate Takti SqFt
  const calculatedSqFt = Number(((taktiLength * taktiWidth) / 144).toFixed(2));

  useEffect(() => {
    if (productToEdit) {
      setProductType(productToEdit.productType || 'general');
      setName(productToEdit.name || '');
      setCategory(productToEdit.category || 'General');
      setSellingPrice(productToEdit.sellingPrice?.toString() || '');
      setPurchasePrice(productToEdit.purchasePrice?.toString() || '');
      setCurrentStock(productToEdit.currentStock?.toString() || '0');
      setMinStockAlert(productToEdit.minStockAlert?.toString() || '3');
      setGstRate(productToEdit.gstRate || 12);
      setHsnCode(productToEdit.hsnCode || '6802');
      setSku(productToEdit.sku || '');
      setDescription(productToEdit.description || '');

      if (productToEdit.taktiSpecs) {
        setTaktiStoneType(productToEdit.taktiSpecs.stoneType || 'Lakha Red Stone');
        setTaktiLength(productToEdit.taktiSpecs.lengthInches || 24);
        setTaktiWidth(productToEdit.taktiSpecs.widthInches || 18);
        setTaktiThickness(productToEdit.taktiSpecs.thickness || '25mm (1 Inch)');
        setTaktiWorkType(productToEdit.taktiSpecs.workType || 'Deep CNC V-Carve + 24K Gold Inscription');
      }

      if (productToEdit.mandirSpecs) {
        setMandirMaterial(productToEdit.mandirSpecs.material || 'Pure Sevan Wood');
        setMandirWidth(productToEdit.mandirSpecs.widthInches || 48);
        setMandirDepth(productToEdit.mandirSpecs.depthInches || 24);
        setMandirHeight(productToEdit.mandirSpecs.heightInches || 66);
        setMandirShikhara(productToEdit.mandirSpecs.shikharaType || '3 Shikhara with Kalash');
        setMandirCarving(productToEdit.mandirSpecs.carvingLevel || 'Heavy Hand Carved');
        setMandirPolish(productToEdit.mandirSpecs.polishFinish || 'Natural Golden Sevan Wood Glossy PU');
        setMandirHasDrawers(productToEdit.mandirSpecs.hasDrawers ?? true);
        setMandirHasDiyaTray(productToEdit.mandirSpecs.hasDiyaTray ?? true);
      }

      if (productToEdit.murtiSpecs) {
        setMurtiDeity(productToEdit.murtiSpecs.deity || 'Radha Krishna');
        setMurtiHeight(productToEdit.murtiSpecs.heightInches || 24);
        setMurtiMarbleGrade(productToEdit.murtiSpecs.marbleGrade || 'Makrana Super White (Grade A)');
        setMurtiShringar(productToEdit.murtiSpecs.shringarWork || '24K Real Gold Leaf Foil (Vark) & Minakari');
        setMurtiPosture(productToEdit.murtiSpecs.posture || 'Standing');
      }
    } else {
      // Default based on current product type
      handleTypeSwitch('takti');
    }
    setError(null);
  }, [productToEdit, isOpen]);

  const handleTypeSwitch = (type: ProductType) => {
    setProductType(type);
    if (type === 'takti') {
      setName(`Lakha Red Stone Takti (${taktiLength}"x${taktiWidth}" = ${calculatedSqFt} Sq.Ft)`);
      setCategory('Stone Takti');
      setHsnCode('6802');
      setSellingPrice('420'); // Rate per SqFt
      setPurchasePrice('190');
      setGstRate(12);
      setSku(`TAK-LAKHA-${taktiLength}X${taktiWidth}`);
    } else if (type === 'mandir') {
      setName(`Pure Sevan Wooden Mandir (${mandirWidth}"x${mandirDepth}"x${mandirHeight}")`);
      setCategory('Sevan Wooden Mandir');
      setHsnCode('4420');
      setSellingPrice('78000');
      setPurchasePrice('42000');
      setGstRate(12);
      setSku(`MAN-SEV-${mandirWidth}X${mandirDepth}`);
    } else if (type === 'murti') {
      setName(`${murtiDeity} Marble Murty (${murtiHeight} Inch) - 24K Gold`);
      setCategory('Bhagwan Murti');
      setHsnCode('6802');
      setSellingPrice('85000');
      setPurchasePrice('48000');
      setGstRate(12);
      setSku(`MUR-${murtiDeity.substring(0, 3).toUpperCase()}-${murtiHeight}`);
    }
  };

  const handleTaktiDimChange = (len: number, wid: number, stone: string) => {
    setTaktiLength(len);
    setTaktiWidth(wid);
    setTaktiStoneType(stone);
    const sqft = Number(((len * wid) / 144).toFixed(2));
    setName(`${stone} Takti (${len}"x${wid}" = ${sqft} Sq.Ft)`);
    setSku(`TAK-${stone.substring(0, 5).toUpperCase().replace(/\s/g, '')}-${len}X${wid}`);
  };

  const handleMandirDimChange = (w: number, d: number, h: number, mat: string) => {
    setMandirWidth(w);
    setMandirDepth(d);
    setMandirHeight(h);
    setMandirMaterial(mat);
    setName(`${mat} Mandir (${w}"W x ${d}"D x ${h}"H)`);
    setCategory(mat.includes('Marble') ? 'Marble Mandir' : 'Sevan Wooden Mandir');
    setHsnCode(mat.includes('Marble') ? '6802' : '4420');
    setSku(`MAN-${mat.substring(0, 3).toUpperCase()}-${w}${d}`);
  };

  const handleMurtiChange = (deity: string, height: number, marble: string) => {
    setMurtiDeity(deity);
    setMurtiHeight(height);
    setMurtiMarbleGrade(marble);
    setName(`${deity} Marble Murty (${height} Inch)`);
    setSku(`MUR-${deity.substring(0, 3).toUpperCase()}-${height}`);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!currentPedhi?._id) return;

    setIsSubmitting(true);
    setError(null);

    const unit = productType === 'takti' ? 'SqFt' : 'Pcs';

    const payload: Partial<Product> = {
      pedhiId: currentPedhi._id,
      name: name.trim(),
      productType,
      category,
      unit,
      hsnCode: hsnCode.trim(),
      sellingPrice: Number(sellingPrice) || 0,
      purchasePrice: Number(purchasePrice) || 0,
      currentStock: Number(currentStock) || 0,
      minStockAlert: Number(minStockAlert) || 3,
      gstRate: Number(gstRate) || 12,
      sku: sku.trim(),
      description: description.trim(),
    };

    if (productType === 'takti') {
      payload.taktiSpecs = {
        stoneType: taktiStoneType,
        lengthInches: taktiLength,
        widthInches: taktiWidth,
        totalSqFt: calculatedSqFt,
        thickness: taktiThickness,
        workType: taktiWorkType,
      };
    } else if (productType === 'mandir') {
      payload.mandirSpecs = {
        material: mandirMaterial,
        widthInches: mandirWidth,
        depthInches: mandirDepth,
        heightInches: mandirHeight,
        dimensionDisplay: `${mandirWidth}"W x ${mandirDepth}"D x ${mandirHeight}"H`,
        shikharaType: mandirShikhara,
        carvingLevel: mandirCarving,
        hasDrawers: mandirHasDrawers,
        hasDiyaTray: mandirHasDiyaTray,
        polishFinish: mandirPolish,
      };
    } else if (productType === 'murti') {
      payload.murtiSpecs = {
        deity: murtiDeity,
        heightInches: murtiHeight,
        marbleGrade: murtiMarbleGrade,
        posture: murtiPosture,
        shringarWork: murtiShringar,
      };
    }

    try {
      if (productToEdit) {
        const res = await api.updateProduct(productToEdit._id, payload);
        onSuccess(res.product);
      } else {
        const res = await api.createProduct(payload);
        onSuccess(res.product);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 sticky top-0 z-10">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center">
              <PackagePlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm sm:text-base">
                {productToEdit ? 'Edit Product Item' : 'Add Item to Catalog'}
              </h3>
              <p className="text-[11px] text-slate-400">For Pedhi: {currentPedhi?.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mx-4 mt-3 p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* 3 CORE PRODUCT TYPE SELECTOR PILLS */}
          <div>
            <label className="block text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
              Select Product Category (Specialized Measurement)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleTypeSwitch('takti')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                  productType === 'takti'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-md shadow-amber-950/40'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-sm font-extrabold">1. Takti</span>
                <span className="text-[10px] mt-0.5 opacity-80">Granite / Marble (Sq.Ft)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeSwitch('mandir')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                  productType === 'mandir'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-md shadow-amber-950/40'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-sm font-extrabold">2. Mandir</span>
                <span className="text-[10px] mt-0.5 opacity-80">Sevan Wood / Marble (Size)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeSwitch('murti')}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                  productType === 'murti'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-md shadow-amber-950/40'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-sm font-extrabold">3. Bhagwan Murti</span>
                <span className="text-[10px] mt-0.5 opacity-80">Marble Idols (Inches)</span>
              </button>
            </div>
          </div>

          {/* DYNAMIC CALCULATOR & SPEC BOX BASED ON PRODUCT TYPE */}

          {/* 1. TAKTI SQUARE FEET CALCULATOR */}
          {productType === 'takti' && (
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-3.5 rounded-xl border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-amber-400 font-bold text-xs">
                  <Calculator className="w-4 h-4" />
                  <span>Square Feet (Sq.Ft) Measurement Calculator</span>
                </div>
                <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold">
                  {calculatedSqFt} Sq.Ft
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Length (Inches)</label>
                  <input
                    type="number"
                    min="1"
                    value={taktiLength}
                    onChange={(e) => handleTaktiDimChange(Number(e.target.value), taktiWidth, taktiStoneType)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-bold font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Width (Inches)</label>
                  <input
                    type="number"
                    min="1"
                    value={taktiWidth}
                    onChange={(e) => handleTaktiDimChange(taktiLength, Number(e.target.value), taktiStoneType)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-bold font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Formula (L x W / 144)</label>
                  <div className="bg-slate-900/60 border border-slate-700 rounded-lg px-2.5 py-1.5 text-amber-400 font-mono font-bold">
                    {calculatedSqFt} Sq.Ft
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Stone Material</label>
                  <select
                    value={taktiStoneType}
                    onChange={(e) => handleTaktiDimChange(taktiLength, taktiWidth, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Lakha Red Stone">Lakha Red Stone (Rajasthan)</option>
                    <option value="Black Jet Granite">Black Jet Granite</option>
                    <option value="Makrana White Marble">Makrana White Marble</option>
                    <option value="Ambaji White Marble">Ambaji White Marble</option>
                    <option value="Jhansi Red Granite">Jhansi Red Granite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Stone Thickness</label>
                  <select
                    value={taktiThickness}
                    onChange={(e) => setTaktiThickness(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="15mm">15mm</option>
                    <option value="18mm">18mm</option>
                    <option value="20mm">20mm</option>
                    <option value="25mm (1 Inch)">25mm (1 Inch)</option>
                    <option value="30mm">30mm</option>
                    <option value="2 Inch (50mm)">2 Inch (50mm)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-[10px] mb-0.5">Engraving & Border Work</label>
                <select
                  value={taktiWorkType}
                  onChange={(e) => setTaktiWorkType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Deep CNC V-Carve + 24K Gold Inscription">Deep CNC V-Carve + 24K Gold Inscription</option>
                  <option value="Hand Chiseled Nagari Script (Black & Gold)">Hand Chiseled Nagari Script (Black & Gold)</option>
                  <option value="Laser Etched Photo + Gold Letter Inscription">Laser Etched Photo + Gold Letter Inscription</option>
                  <option value="Plain Polished Edge Only">Plain Polished Edge Only</option>
                </select>
              </div>
            </div>
          )}

          {/* 2. MANDIR DIMENSIONS & SEVAN/MARBLE SPECS */}
          {productType === 'mandir' && (
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-3.5 rounded-xl border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold text-xs flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Mandir Dimensions & Architecture Specs</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {mandirWidth}"W x {mandirDepth}"D x {mandirHeight}"H
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Mandir Material</label>
                  <select
                    value={mandirMaterial}
                    onChange={(e) => handleMandirDimChange(mandirWidth, mandirDepth, mandirHeight, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="Pure Sevan Wood">Pure Sevan Wood (Traditional)</option>
                    <option value="Makrana White Marble">Makrana White Marble</option>
                    <option value="Ambaji Marble">Ambaji White Marble</option>
                    <option value="Teak Wood (Sagwan)">Teak Wood (Sagwan)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Shikhara / Dome Style</label>
                  <select
                    value={mandirShikhara}
                    onChange={(e) => setMandirShikhara(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="3 Shikhara with Kalash">3 Shikhara with Kalash</option>
                    <option value="Single Gopuram Dome">Single Gopuram Dome</option>
                    <option value="5-Tier Shikhara">5-Tier Shikhara</option>
                    <option value="Step Dome Flat Top">Step Dome Flat Top</option>
                  </select>
                </div>
              </div>

              {/* Dimensions */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Width (Inches)</label>
                  <input
                    type="number"
                    value={mandirWidth}
                    onChange={(e) => handleMandirDimChange(Number(e.target.value), mandirDepth, mandirHeight, mandirMaterial)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-bold font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Depth (Inches)</label>
                  <input
                    type="number"
                    value={mandirDepth}
                    onChange={(e) => handleMandirDimChange(mandirWidth, Number(e.target.value), mandirHeight, mandirMaterial)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-bold font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Height (Inches)</label>
                  <input
                    type="number"
                    value={mandirHeight}
                    onChange={(e) => handleMandirDimChange(mandirWidth, mandirDepth, Number(e.target.value), mandirMaterial)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-bold font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Carving Level</label>
                  <select
                    value={mandirCarving}
                    onChange={(e) => setMandirCarving(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Heavy Hand Carved with Elephant Base & Peacock Arch">
                      Heavy Hand Carved (Elephant Base & Peacock)
                    </option>
                    <option value="Medium Floral & Bell Carving">Medium Floral & Bell Carving</option>
                    <option value="Minimalist Contemporary">Minimalist Contemporary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Polish / Finish</label>
                  <select
                    value={mandirPolish}
                    onChange={(e) => setMandirPolish(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Natural Golden Sevan Wood Glossy PU">Natural Golden Sevan Wood Glossy PU</option>
                    <option value="Matte Honey Sevan Polish">Matte Honey Sevan Polish</option>
                    <option value="Pure White Mirror Buff Polish">Pure White Mirror Buff Polish</option>
                    <option value="Dark Teak Wood Finish">Dark Teak Wood Finish</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 3. BHAGWAN MURTI HEIGHT IN INCHES & DEITY SPECS */}
          {productType === 'murti' && (
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-3.5 rounded-xl border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold text-xs flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Bhagwan Marble Murty Specs</span>
                </span>
                <span className="text-[10px] text-amber-300 font-mono font-bold bg-amber-500/20 px-2 py-0.5 rounded-full">
                  Height: {murtiHeight} Inches ({((murtiHeight) / 12).toFixed(1)} Ft)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Bhagwan / Deity</label>
                  <select
                    value={murtiDeity}
                    onChange={(e) => handleMurtiChange(e.target.value, murtiHeight, murtiMarbleGrade)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="Radha Krishna">Radha Krishna</option>
                    <option value="Ganeshji">Ganeshji (Siddhivinayak)</option>
                    <option value="Shiv Parivar">Shiv Parivar / Mahadev</option>
                    <option value="Ram Darbar">Ram Darbar (with Sita & Lakshman)</option>
                    <option value="Hanumanji">Hanumanji</option>
                    <option value="Jain Tirthankara">Jain Tirthankara (Mahavira / Parshvanatha)</option>
                    <option value="Maa Ambaji / Durga">Maa Ambaji / Durga</option>
                    <option value="Lakshmi Narayan">Lakshmi Narayan</option>
                    <option value="Bal Gopal">Bal Gopal / Laddu Gopal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Murty Height (Inches)</label>
                  <select
                    value={murtiHeight}
                    onChange={(e) => handleMurtiChange(murtiDeity, Number(e.target.value), murtiMarbleGrade)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-bold font-mono focus:outline-none focus:border-amber-500"
                  >
                    <option value={9}>9 Inch (Small Mandir)</option>
                    <option value={12}>12 Inch (1.0 Ft)</option>
                    <option value={15}>15 Inch (1.25 Ft)</option>
                    <option value={18}>18 Inch (1.5 Ft)</option>
                    <option value={21}>21 Inch (1.75 Ft)</option>
                    <option value={24}>24 Inch (2.0 Ft - Popular)</option>
                    <option value={30}>30 Inch (2.5 Ft)</option>
                    <option value={36}>36 Inch (3.0 Ft - Grand)</option>
                    <option value={48}>48 Inch (4.0 Ft)</option>
                    <option value={60}>60 Inch (5.0 Ft)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Marble Grade</label>
                  <select
                    value={murtiMarbleGrade}
                    onChange={(e) => handleMurtiChange(murtiDeity, murtiHeight, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Makrana Super White (Grade A)">Makrana Super White (Grade A)</option>
                    <option value="Ambaji White Marble">Ambaji White Marble</option>
                    <option value="Vietnam White Marble">Vietnam White Marble</option>
                    <option value="Black Marble">Black Marble (Krishna / Bhairav)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-[10px] mb-0.5">Shringar / Ornamentation</label>
                  <select
                    value={murtiShringar}
                    onChange={(e) => setMurtiShringar(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="24K Real Gold Leaf Foil (Vark) & Minakari">24K Real Gold Leaf Foil (Vark)</option>
                    <option value="Multicolor Minakari Painting">Multicolor Minakari Painting</option>
                    <option value="Pure Milk White Buff Polish">Pure Milk White Buff Polish</option>
                    <option value="Antique Gold Highlights">Antique Gold Highlights</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ITEM NAME & CODE */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">Catalog Item Display Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>

          {/* PRICING & STOCK */}
          <div className="grid grid-cols-2 gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Selling Price (₹) {productType === 'takti' ? 'Per Sq.Ft' : 'Per Piece'} *
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1.5 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  required
                  min="1"
                  step="any"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-7 pr-2.5 py-1.5 text-slate-100 font-bold font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              {productType === 'takti' && sellingPrice && (
                <span className="text-[10px] text-amber-400/90 block mt-1">
                  1 Piece ({calculatedSqFt} SqFt) = ₹{(Number(sellingPrice) * calculatedSqFt).toFixed(0)}
                </span>
              )}
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Current Stock ({productType === 'takti' ? 'Sq.Ft' : 'Pcs'})</label>
              <input
                type="number"
                min="0"
                value={currentStock}
                onChange={(e) => setCurrentStock(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-bold font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-slate-400 text-[10px] mb-0.5">HSN Code</label>
              <input
                type="text"
                value={hsnCode}
                onChange={(e) => setHsnCode(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[10px] mb-0.5">GST Rate %</label>
              <select
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value={5}>5%</option>
                <option value={12}>12% (Standard Stone/Wood)</option>
                <option value={18}>18%</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 text-[10px] mb-0.5">Item SKU</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono uppercase focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center space-x-1.5 shadow-md shadow-amber-950/40 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : productToEdit ? 'Save Changes' : 'Add Item'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
