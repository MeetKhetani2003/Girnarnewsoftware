import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { MobileFrame } from './components/MobileFrame.tsx';
import { Header } from './components/Header.tsx';
import { BottomNavigation, TabType } from './components/BottomNavigation.tsx';
import { DashboardView } from './views/DashboardView.tsx';
import { OrdersView } from './views/OrdersView.tsx';
import { PartiesView } from './views/PartiesView.tsx';
import { InvoicesView } from './views/InvoicesView.tsx';
import { InventoryView } from './views/InventoryView.tsx';
import { SuppliersView } from './views/SuppliersView.tsx';
import { TransfersView } from './views/TransfersView.tsx';
import { RojmelView } from './views/RojmelView.tsx';
import { PedhisManagementView } from './views/PedhisManagementView.tsx';
import { TaktiCostingView } from './views/TaktiCostingView.tsx';
import { ExpoServerlessView } from './views/ExpoServerlessView.tsx';

// Modals
import { PedhiSelectorModal } from './components/PedhiSelectorModal.tsx';
import { PedhiFormModal } from './components/PedhiFormModal.tsx';
import { CustomerModal } from './components/CustomerModal.tsx';
import { ProductModal } from './components/ProductModal.tsx';
import { StockAdjustModal } from './components/StockAdjustModal.tsx';
import { InvoiceCreateModal } from './components/InvoiceCreateModal.tsx';
import { InvoiceViewModal } from './components/InvoiceViewModal.tsx';
import { PaymentModal } from './components/PaymentModal.tsx';
import { LedgerStatementModal } from './components/LedgerStatementModal.tsx';
import { OrderCreateModal } from './components/OrderCreateModal.tsx';
import { ExpoNativeHubModal } from './components/ExpoNativeHubModal.tsx';
import { TaktiCostingModal } from './components/TaktiCostingModal.tsx';

import { Customer, Product, Invoice, Pedhi, Order } from './types/index.ts';

function MainAppContent() {
  const { currentPedhi, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  // Modals state
  const [isPedhiSelectorOpen, setIsPedhiSelectorOpen] = useState(false);
  const [isPedhiFormOpen, setIsPedhiFormOpen] = useState(false);
  const [pedhiToEdit, setPedhiToEdit] = useState<Pedhi | null>(null);

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const [isStockAdjustModalOpen, setIsStockAdjustModalOpen] = useState(false);
  const [stockAdjustProduct, setStockAdjustProduct] = useState<Product | null>(null);

  const [isOrderCreateModalOpen, setIsOrderCreateModalOpen] = useState(false);

  const [isInvoiceCreateModalOpen, setIsInvoiceCreateModalOpen] = useState(false);
  const [isInvoiceViewModalOpen, setIsInvoiceViewModalOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<Invoice | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentModalType, setPaymentModalType] = useState<'PAYMENT_IN' | 'PAYMENT_OUT'>('PAYMENT_IN');
  const [paymentPreselectedCustomer, setPaymentPreselectedCustomer] = useState<Customer | null>(null);

  const [isLedgerStatementModalOpen, setIsLedgerStatementModalOpen] = useState(false);
  const [ledgerCustomerId, setLedgerCustomerId] = useState<string | null>(null);

  // Expo & Takti Costing Modals
  const [isExpoHubOpen, setIsExpoHubOpen] = useState(false);
  const [isTaktiCostingOpen, setIsTaktiCostingOpen] = useState(false);

  // Key to force refresh views when modal changes happen
  const [viewKey, setViewKey] = useState(0);
  const triggerRefresh = () => setViewKey((prev) => prev + 1);

  if (isLoading && !currentPedhi) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-lg animate-pulse">
          GS
        </div>
        <div className="font-bold text-sm tracking-tight text-slate-200">Girnar Shilp Multi-Pedhi Manager</div>
        <p className="text-xs text-slate-500">Connecting to MongoDB Atlas...</p>
      </div>
    );
  }

  return (
    <MobileFrame
      onOpenPedhiSelector={() => setIsPedhiSelectorOpen(true)}
      onOpenExpoHub={() => setIsExpoHubOpen(true)}
    >
      {/* Top Header */}
      <Header
        onOpenPedhiSelector={() => setIsPedhiSelectorOpen(true)}
        onOpenNewInvoice={() => setIsInvoiceCreateModalOpen(true)}
        onOpenNewPayment={() => {
          setPaymentModalType('PAYMENT_IN');
          setPaymentPreselectedCustomer(null);
          setIsPaymentModalOpen(true);
        }}
        onOpenExpoHub={() => setIsExpoHubOpen(true)}
        onOpenTaktiCalc={() => setIsTaktiCostingOpen(true)}
      />

      {/* Main View Area */}
      <div key={`${currentPedhi?._id}-${viewKey}`} className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <DashboardView
            onOpenNewInvoice={() => setIsInvoiceCreateModalOpen(true)}
            onOpenNewPayment={(type) => {
              setPaymentModalType(type || 'PAYMENT_IN');
              setPaymentPreselectedCustomer(null);
              setIsPaymentModalOpen(true);
            }}
            onOpenNewCustomer={() => {
              setCustomerToEdit(null);
              setIsCustomerModalOpen(true);
            }}
            onOpenNewProduct={() => {
              setProductToEdit(null);
              setIsProductModalOpen(true);
            }}
            onSelectInvoice={(inv) => {
              setActiveInvoice(inv);
              setIsInvoiceViewModalOpen(true);
            }}
            onAdjustProductStock={(prod) => {
              setStockAdjustProduct(prod);
              setIsStockAdjustModalOpen(true);
            }}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'orders' && (
          <OrdersView
            onOpenCreateOrder={() => setIsOrderCreateModalOpen(true)}
            onInvoiceCreated={(inv) => {
              setActiveInvoice(inv);
              setIsInvoiceViewModalOpen(true);
            }}
          />
        )}

        {activeTab === 'takti-calc' && (
          <TaktiCostingView
            onBookOrderWithCosting={() => {
              setIsOrderCreateModalOpen(true);
            }}
          />
        )}

        {activeTab === 'expo' && (
          <ExpoServerlessView
            onOpenOrderModal={() => setIsOrderCreateModalOpen(true)}
            onOpenTaktiCalc={() => setIsTaktiCostingOpen(true)}
          />
        )}

        {activeTab === 'invoices' && (
          <InvoicesView
            onOpenNewInvoice={() => setIsInvoiceCreateModalOpen(true)}
            onSelectInvoice={(inv) => {
              setActiveInvoice(inv);
              setIsInvoiceViewModalOpen(true);
            }}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryView
            onOpenCreateProduct={() => {
              setProductToEdit(null);
              setIsProductModalOpen(true);
            }}
            onOpenEditProduct={(prod) => {
              setProductToEdit(prod);
              setIsProductModalOpen(true);
            }}
            onOpenAdjustStock={(prod) => {
              setStockAdjustProduct(prod);
              setIsStockAdjustModalOpen(true);
            }}
          />
        )}

        {activeTab === 'parties' && (
          <PartiesView
            onOpenCreateCustomer={() => {
              setCustomerToEdit(null);
              setIsCustomerModalOpen(true);
            }}
            onOpenEditCustomer={(cust) => {
              setCustomerToEdit(cust);
              setIsCustomerModalOpen(true);
            }}
            onOpenLedgerStatement={(custId) => {
              setLedgerCustomerId(custId);
              setIsLedgerStatementModalOpen(true);
            }}
          />
        )}

        {activeTab === 'suppliers' && <SuppliersView />}

        {activeTab === 'transfers' && <TransfersView />}

        {activeTab === 'rojmel' && (
          <RojmelView
            onOpenNewPayment={(type) => {
              setPaymentModalType(type || 'PAYMENT_IN');
              setPaymentPreselectedCustomer(null);
              setIsPaymentModalOpen(true);
            }}
          />
        )}

        {activeTab === 'pedhis' && (
          <PedhisManagementView
            onOpenCreatePedhi={() => {
              setPedhiToEdit(null);
              setIsPedhiFormOpen(true);
            }}
            onOpenEditPedhi={(p) => {
              setPedhiToEdit(p);
              setIsPedhiFormOpen(true);
            }}
          />
        )}
      </div>

      {/* Bottom Mobile Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Modals */}
      <PedhiSelectorModal
        isOpen={isPedhiSelectorOpen}
        onClose={() => setIsPedhiSelectorOpen(false)}
        onOpenCreatePedhi={() => {
          setPedhiToEdit(null);
          setIsPedhiFormOpen(true);
        }}
      />

      <PedhiFormModal
        isOpen={isPedhiFormOpen}
        onClose={() => setIsPedhiFormOpen(false)}
        pedhiToEdit={pedhiToEdit}
        onSuccess={triggerRefresh}
      />

      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        customerToEdit={customerToEdit}
        onSuccess={() => triggerRefresh()}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        productToEdit={productToEdit}
        onSuccess={() => triggerRefresh()}
      />

      <StockAdjustModal
        isOpen={isStockAdjustModalOpen}
        onClose={() => setIsStockAdjustModalOpen(false)}
        product={stockAdjustProduct}
        onSuccess={triggerRefresh}
      />

      <OrderCreateModal
        isOpen={isOrderCreateModalOpen}
        onClose={() => setIsOrderCreateModalOpen(false)}
        onSuccess={() => triggerRefresh()}
        onOpenCreateCustomer={() => {
          setCustomerToEdit(null);
          setIsCustomerModalOpen(true);
        }}
      />

      <InvoiceCreateModal
        isOpen={isInvoiceCreateModalOpen}
        onClose={() => setIsInvoiceCreateModalOpen(false)}
        onSuccess={(inv) => {
          triggerRefresh();
          setActiveInvoice(inv);
          setIsInvoiceViewModalOpen(true);
        }}
        onOpenCreateCustomer={() => {
          setCustomerToEdit(null);
          setIsCustomerModalOpen(true);
        }}
      />

      <InvoiceViewModal
        isOpen={isInvoiceViewModalOpen}
        onClose={() => setIsInvoiceViewModalOpen(false)}
        invoice={activeInvoice}
        pedhi={currentPedhi}
        onPaymentRecorded={triggerRefresh}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        defaultType={paymentModalType}
        preselectedCustomer={paymentPreselectedCustomer}
        onSuccess={triggerRefresh}
      />

      <LedgerStatementModal
        isOpen={isLedgerStatementModalOpen}
        onClose={() => setIsLedgerStatementModalOpen(false)}
        customerId={ledgerCustomerId}
        onOpenPayment={(cust, type) => {
          setPaymentPreselectedCustomer(cust);
          setPaymentModalType(type);
          setIsPaymentModalOpen(true);
        }}
        onOpenInvoiceView={(inv) => {
          setActiveInvoice(inv);
          setIsInvoiceViewModalOpen(true);
        }}
      />

      {/* Expo Native & Serverless API Hub Modal */}
      <ExpoNativeHubModal
        isOpen={isExpoHubOpen}
        onClose={() => setIsExpoHubOpen(false)}
        onOpenTaktiCalc={() => {
          setIsExpoHubOpen(false);
          setIsTaktiCostingOpen(true);
        }}
        onOpenOrderModal={() => {
          setIsExpoHubOpen(false);
          setIsOrderCreateModalOpen(true);
        }}
      />

      {/* Takti Dedicated Sq.Ft & Supplier Costing Modal */}
      <TaktiCostingModal
        isOpen={isTaktiCostingOpen}
        onClose={() => setIsTaktiCostingOpen(false)}
        onBookOrderWithCosting={() => {
          setIsTaktiCostingOpen(false);
          setIsOrderCreateModalOpen(true);
        }}
      />
    </MobileFrame>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}
