import React, { useState, useEffect } from 'react';
import { Search, PackagePlus, AlertTriangle, ChevronRight, Edit3, ArrowUpDown } from 'lucide-react';
import { Product } from '../types/index.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface InventoryViewProps {
  onOpenCreateProduct: () => void;
  onOpenEditProduct: (product: Product) => void;
  onOpenAdjustStock: (product: Product) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  onOpenCreateProduct,
  onOpenEditProduct,
  onOpenAdjustStock,
}) => {
  const { currentPedhi } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadProducts = async () => {
    if (!currentPedhi?._id) return;
    setIsLoading(true);
    try {
      const res = await api.getProducts(currentPedhi._id, {
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: search || undefined,
        lowStockOnly: lowStockOnly || undefined,
      });
      setProducts(res.products || []);
      if (res.categories?.length) {
        setCategories(res.categories);
      }
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [currentPedhi, selectedCategory, search, lowStockOnly]);

  const totalItemsCount = products.length;
  const lowStockCount = products.filter((p) => p.currentStock <= p.minStockAlert).length;

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100">Inventory & Stock</h2>
          <p className="text-xs text-slate-400">Products, stone materials & GST catalog</p>
        </div>
        <button
          onClick={onOpenCreateProduct}
          className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs shadow-md shadow-amber-950/40 cursor-pointer"
        >
          <PackagePlus className="w-4 h-4" />
          <span>+ Add Item</span>
        </button>
      </div>

      {/* Low Stock Warning Banner (if any) */}
      {lowStockCount > 0 && (
        <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-amber-300 font-semibold">
              {lowStockCount} items have reached low stock threshold
            </span>
          </div>
          <button
            onClick={() => setLowStockOnly(!lowStockOnly)}
            className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
              lowStockOnly
                ? 'bg-amber-500 text-slate-950'
                : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
            }`}
          >
            {lowStockOnly ? 'Show All' : 'Filter Low'}
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search items by name, category, SKU, HSN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Category Pills (horizontal scrollable) */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Products List */}
      <div className="space-y-2">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading stock items...</div>
        ) : products.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-400">
            No items found. Click "+ Add Item" to add products to your stock catalog.
          </div>
        ) : (
          products.map((p) => {
            const isLowStock = p.currentStock <= p.minStockAlert;

            return (
              <div
                key={p._id}
                className="bg-slate-900/70 hover:bg-slate-800/80 border border-slate-800/80 rounded-xl p-3.5 transition-all flex flex-col space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-slate-100 text-sm">{p.name}</h3>
                      {p.sku && (
                        <span className="font-mono text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded border border-slate-700">
                          {p.sku}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                      <span className="text-amber-400/90 font-medium">{p.category}</span>
                      <span>•</span>
                      <span>HSN: {p.hsnCode || '6802'}</span>
                      <span>•</span>
                      <span>GST: {p.gstRate}%</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black font-mono text-slate-100">
                      ₹{p.sellingPrice.toLocaleString('en-IN')}{' '}
                      <span className="text-[10px] text-slate-400 font-normal">/{p.unit}</span>
                    </div>
                    {p.purchasePrice > 0 && (
                      <span className="text-[10px] text-slate-500 font-mono block">
                        Cost: ₹{p.purchasePrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stock bar & Quick Adjustment */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`font-mono font-bold text-xs px-2 py-0.5 rounded-md ${
                        isLowStock
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {p.currentStock} {p.unit} in stock
                    </span>
                    {isLowStock && (
                      <span className="text-[10px] text-rose-400 flex items-center font-medium">
                        <AlertTriangle className="w-3 h-3 mr-0.5" /> Low
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onOpenAdjustStock(p)}
                      className="flex items-center space-x-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      <ArrowUpDown className="w-3 h-3" />
                      <span>Adjust</span>
                    </button>
                    <button
                      onClick={() => onOpenEditProduct(p)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 cursor-pointer"
                      title="Edit Item"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
