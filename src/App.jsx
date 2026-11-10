import React, { useState, useEffect } from 'react';
import { 
  Sparkles, IceCream, GlassWater, CupSoda, Coffee, Utensils, Flame, Soup, Cookie,
  ShoppingCart, Trash2, Plus, Minus, Search, CreditCard, DollarSign, CheckCircle2,
  BookOpen, FileText, Lock, RefreshCw, Layers, Printer, Wifi, ShieldAlert, Award, FileSpreadsheet,
  Package, AlertTriangle, ShoppingBag, ArrowUpRight, Megaphone, Tag, Users, BarChart2, Shield, UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CATEGORIES, PRODUCTS, PROMOTIONS } from './data/mockProducts';
import { db, initDatabase, ROLE_PERMISSIONS, DEFAULT_USERS } from './db/localDb';
import { syncLocalDataToCloud } from './services/firebaseSync';
import MarketingModule from './components/MarketingModule';
import MysteryShopperModule from './components/MysteryShopperModule';
import UserManagementModule from './components/UserManagementModule';
import EmpresarioDashboard from './components/EmpresarioDashboard';
import UserAuthModal from './components/UserAuthModal';

// Map icon strings to Lucide Components
const ICON_MAP = {
  Sparkles, IceCream, GlassWater, CupSoda, Coffee, Utensils, Flame, Soup, Cookie
};

export default function App() {
  // User Authentication & Roles
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hp_current_user');
      return saved ? JSON.parse(saved) : DEFAULT_USERS[0];
    } catch {
      return DEFAULT_USERS[0];
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const userPermissions = ROLE_PERMISSIONS[currentUser?.role] || ROLE_PERMISSIONS.cajero;

  const [activeTab, setActiveTab] = useState(() => {
    const perms = ROLE_PERMISSIONS[currentUser?.role] || ROLE_PERMISSIONS.cajero;
    return perms.defaultTab || 'pos';
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [activePromo, setActivePromo] = useState(null); // Promoción seleccionada activada
  
  // Inventory state from IndexedDB
  const [inventoryList, setInventoryList] = useState([]);
  const [isExpressPurchaseOpen, setIsExpressPurchaseOpen] = useState(false);
  const [purchaseForm, setPurchaseForm] = useState({ storeName: 'Costco', itemName: '', quantity: '', cost: '' });

  // Payment Modal State
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [cashGiven, setCashGiven] = useState('');
  const [lastCompletedSale, setLastCompletedSale] = useState(null);

  // Blind Cash Cut State (Corte Ciego)
  const [countedCash, setCountedCash] = useState('');
  const [cutSubmitted, setCutSubmitted] = useState(false);
  const [historicalCuts, setHistoricalCuts] = useState([]);

  // Sync status
  const [syncStatus, setSyncStatus] = useState('En línea (Sincronizado)');

  // Clock
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  // Handle switching users
  const handleSelectUser = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('hp_current_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    const perms = ROLE_PERMISSIONS[user.role] || ROLE_PERMISSIONS.cajero;
    if (!perms.allowedTabs.includes(activeTab)) {
      setActiveTab(perms.defaultTab);
    }
  };

  // Redirect if current tab is not allowed
  useEffect(() => {
    if (!userPermissions.allowedTabs.includes(activeTab)) {
      setActiveTab(userPermissions.defaultTab);
    }
  }, [currentUser]);
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize DB, load inventory and cash cuts
  const loadCashCuts = async () => {
    try {
      const cuts = await db.cashCuts.toArray();
      setHistoricalCuts(cuts);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    async function loadData() {
      await initDatabase();
      const items = await db.inventory.toArray();
      setInventoryList(items);
      await loadCashCuts();
    }
    loadData();
  }, []);

  // Refresh inventory
  const refreshInventory = async () => {
    const items = await db.inventory.toArray();
    setInventoryList(items);
  };

  // Filter products
  const filteredProducts = PRODUCTS.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Cart operations
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedOption === product.defaultOption);
      if (existing) {
        return prev.map(item => 
          item === existing ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedOption: product.options?.[0] || 'Estándar', cartItemId: Date.now() }];
    });
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => setCart([]);

  // Subtotal y Descuentos por Promoción Activa
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let discountAmount = 0;
  if (activePromo) {
    if (activePromo.type === 'DISCOUNT_PERCENT') {
      discountAmount = subtotal * (activePromo.discountPercent / 100);
    } else if (activePromo.type === '2x1') {
      // Aplicar 2x1 en la categoría aplicable o en todo
      const eligibleItems = cart.filter(item => !activePromo.applicableCategory || item.category === activePromo.applicableCategory);
      const totalEligibleQty = eligibleItems.reduce((acc, i) => acc + i.quantity, 0);
      const freePairs = Math.floor(totalEligibleQty / 2);
      if (freePairs > 0 && eligibleItems.length > 0) {
        // Descontar el ítem de menor precio por cada par
        const minPrice = Math.min(...eligibleItems.map(i => i.price));
        discountAmount = minPrice * freePairs;
      }
    }
  }

  const total = Math.max(0, subtotal - discountAmount);

  // Handle Payment completion
  const handleCompleteSale = async () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const saleRecord = {
      timestamp: new Date().toISOString(),
      items: cart,
      total,
      cashGiven: Number(cashGiven) || total,
      change: (Number(cashGiven) || total) - total,
      syncedToCloud: 0
    };

    // Save to local IndexedDB
    await db.sales.add(saleRecord);

    // Background Firebase Sync
    syncLocalDataToCloud();

    setLastCompletedSale({
      id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      ...saleRecord,
      date: new Date().toLocaleTimeString()
    });

    setCart([]);
    setIsPaymentOpen(false);
    setCashGiven('');
  };

  // Add Express Local Purchase (Costco, Walmart, Chedraui, Mercado)
  const handleAddExpressPurchase = async () => {
    if (!purchaseForm.itemName || !purchaseForm.quantity || !purchaseForm.cost) return;

    await db.purchases.add({
      date: new Date().toISOString(),
      storeName: purchaseForm.storeName,
      itemName: purchaseForm.itemName,
      quantity: Number(purchaseForm.quantity),
      totalCost: Number(purchaseForm.cost)
    });

    // Check if item exists in inventory, update or add
    const existing = await db.inventory.where('name').equals(purchaseForm.itemName).first();
    if (existing) {
      await db.inventory.update(existing.id, {
        stockQuantity: existing.stockQuantity + Number(purchaseForm.quantity)
      });
    } else {
      await db.inventory.add({
        id: `inv-${Date.now()}`,
        name: purchaseForm.itemName,
        category: 'Compras Locales',
        stockQuantity: Number(purchaseForm.quantity),
        unit: 'Pzs/Kg',
        isFranchiseItem: false,
        minStockAlert: 5
      });
    }

    await refreshInventory();
    setIsExpressPurchaseOpen(false);
    setPurchaseForm({ storeName: 'Costco', itemName: '', quantity: '', cost: '' });
  };

  // Save Cash Cut (Corte de Caja)
  const handleSaveCashCut = async () => {
    if (!countedCash) return;
    try {
      const allSales = await db.sales.toArray();
      const totalCalculated = allSales.reduce((acc, s) => acc + (Number(s.total) || 0), 0);
      const totalCounted = Number(countedCash) || 0;
      const difference = totalCounted - totalCalculated;

      await db.cashCuts.add({
        timestamp: new Date().toISOString(),
        totalCalculated,
        totalCounted,
        difference,
        user: currentUser?.name || 'Personal HP',
        status: Math.abs(difference) < 0.01 ? 'Cuadrado' : difference > 0 ? 'Sobrante' : 'Faltante'
      });

      await loadCashCuts();
      setCutSubmitted(true);
    } catch (e) {
      console.error('Error guardando corte de caja:', e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh', backgroundColor: 'var(--bg-dark)' }}>
      
      {/* TOP KIOSK HEADER */}
      <header className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', borderBottom: '1px solid var(--border-light)' }}>
        
        {/* Brand identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            width: '42px', height: '42px', borderRadius: '12px', 
            background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Sparkles size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>
              Hawaiian Paradise <span style={{ color: 'var(--tropical-yellow)' }}>Andamar</span>
            </h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Plaza Andamar • Frente a Café Don Justo</p>
          </div>
        </div>

        {/* Navigation Tabs (Filtered dynamically by Role Permissions) */}
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(15, 23, 42, 0.6)', padding: '6px', borderRadius: '14px', border: '1px solid var(--border-light)', overflowX: 'auto' }}>
          {[
            { id: 'pos',          label: 'POS Ventas',     icon: ShoppingCart, permKey: 'canSell' },
            { id: 'campanas',     label: '📢 Promos',      icon: Megaphone,    permKey: 'canViewPromos' },
            { id: 'inventario',   label: 'Inventario',     icon: Package,      permKey: 'canViewInventory' },
            { id: 'corte',        label: 'Corte Caja',     icon: Lock,         permKey: 'canViewCashCuts' },
            { id: 'empresario',   label: '💼 Negocio/KPIs',icon: BarChart2,    permKey: 'canAccessEmpresario' },
            { id: 'mystery',      label: 'Auditoría QC',   icon: Award,        permKey: 'canAudit' },
            { id: 'conocimiento', label: 'Recetarios HP',  icon: BookOpen,     permKey: 'canViewRecipes' },
            { id: 'documentos',   label: 'Formatos',       icon: FileText,     permKey: 'canViewFormats' },
            { id: 'usuarios',     label: '👑 Cuentas',     icon: Users,        permKey: 'canManageUsers' },
          ].filter(tab => userPermissions[tab.permKey]).map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="touch-btn"
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '10px',
                  background: isActive ? 'var(--primary-gradient)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  fontWeight: isActive ? 800 : 500, fontSize: '0.82rem', whiteSpace: 'nowrap'
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* User Profile Switcher Widget & Sync Badge & Clock */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* User Auth Switcher Widget */}
          <div
            onClick={() => setIsAuthModalOpen(true)}
            className="touch-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(15, 23, 42, 0.8)',
              padding: '6px 14px', borderRadius: '14px', border: `1px solid ${userPermissions.badgeColor}60`,
              cursor: 'pointer'
            }}
            title="Toca para cambiar de usuario o identificarte con PIN"
          >
            <span style={{ fontSize: '1.4rem' }}>{currentUser?.avatar || '🍧'}</span>
            <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>
                {currentUser?.name?.split(' ')[0] || 'Usuario'}
              </div>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: userPermissions.badgeColor }}>
                {userPermissions.label.split(' / ')[0]}
              </span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>▾</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--green-emerald)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.78rem', fontWeight: 600 }}>
            <Wifi size={14} /> En línea
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{time}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Plaza Andamar</div>
          </div>
        </div>

      </header>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* TAB 1: POS / PUNTO DE VENTA */}
        {activeTab === 'pos' && (
          <>
            {/* Left Column: Product Selection */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', overflow: 'hidden' }}>
              
              {/* Active Promotion Bar if any */}
              {activePromo && (
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--green-emerald)', borderRadius: '12px', padding: '10px 16px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '0.85rem' }}>
                    <Tag size={18} color="var(--green-emerald)" />
                    <span><strong>Promoción Activa:</strong> {activePromo.name}</span>
                  </div>
                  <button onClick={() => setActivePromo(null)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 700 }}>
                    Quitar Promo
                  </button>
                </div>
              )}

              {/* Category Chips Bar */}
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
                {CATEGORIES.map(cat => {
                  const Icon = ICON_MAP[cat.icon] || Sparkles;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className="touch-btn"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '14px',
                        background: isSelected ? cat.color : 'var(--bg-card)',
                        color: isSelected ? '#000' : '#fff',
                        fontWeight: 800, fontSize: '0.9rem', border: '1px solid var(--border-light)',
                        flexShrink: 0, boxShadow: isSelected ? 'var(--shadow-glow)' : 'none'
                      }}
                    >
                      <Icon size={18} />
                      {cat.name}
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Buscar producto, sabor o insumo (ej. Chamoicano, Nutella, Crepa Hawaiiana)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%', padding: '14px 14px 14px 48px', borderRadius: '14px',
                    background: 'var(--bg-card)', border: '1px solid var(--border-light)',
                    color: '#fff', fontSize: '1rem', outline: 'none'
                  }}
                />
              </div>

              {/* Products Grid */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px', alignContent: 'start' }}>
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="touch-btn"
                    style={{
                      background: 'var(--bg-card)',
                      borderRadius: '16px',
                      padding: '14px',
                      display: 'flex',
                      flexDirection: 'column',
                      justify: 'space-between',
                      border: '1px solid var(--border-light)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Real Product Image if available */}
                    {product.image && (
                      <div style={{ width: '100%', height: '85px', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px', background: '#000' }}>
                        <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
                      </div>
                    )}

                    {/* Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span style={{ 
                        fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', padding: '3px 8px', borderRadius: '6px',
                        background: product.isFranchise ? 'rgba(0, 242, 254, 0.15)' : product.isOwnRecipe ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 123, 0, 0.15)',
                        color: product.isFranchise ? 'var(--secondary-cyan)' : product.isOwnRecipe ? 'var(--green-emerald)' : 'var(--tropical-yellow)',
                        border: '1px solid currentColor'
                      }}>
                        {product.badge}
                      </span>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '4px', lineHeight: 1.2 }}>
                        {product.name}
                      </h3>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '10px', height: '28px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {product.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--tropical-yellow)', fontFamily: 'var(--font-heading)' }}>
                        ${product.price}
                      </span>
                      <div style={{ 
                        width: '32px', height: '32px', borderRadius: '8px', background: 'var(--primary-gradient)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' 
                      }}>
                        <Plus size={18} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Ticket / Cart Panel */}
            <div className="glass-panel" style={{ width: '380px', display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--border-light)', padding: '20px' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingCart size={22} color="var(--primary-coral)" /> Ticket de Venta
                </h2>
                {cart.length > 0 && (
                  <button onClick={clearCart} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>
                    <Trash2 size={16} /> Vaciar
                  </button>
                )}
              </div>

              {/* Items List */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
                {cart.length === 0 ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', textAlign: 'center', gap: '12px' }}>
                    <ShoppingCart size={48} opacity={0.3} />
                    <p style={{ fontSize: '0.9rem' }}>Toca cualquier producto para agregarlo al ticket</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.cartItemId} style={{ background: 'var(--bg-card)', borderRadius: '12px', padding: '12px', border: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{item.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Modificador: {item.selectedOption}</div>
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--tropical-yellow)' }}>
                          ${item.price * item.quantity}
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-dark)', borderRadius: '8px', padding: '2px 8px' }}>
                          <button onClick={() => updateQuantity(item.cartItemId, -1)} className="touch-btn" style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1rem', padding: '4px' }}>
                            <Minus size={14} />
                          </button>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartItemId, 1)} className="touch-btn" style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1rem', padding: '4px' }}>
                            <Plus size={14} />
                          </button>
                        </div>

                        <button onClick={() => removeFromCart(item.cartItemId)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Total Breakdown & Checkout Button */}
              {cart.length > 0 && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--green-emerald)', fontSize: '0.85rem', marginBottom: '6px' }}>
                      <span>Descuento ({activePromo.name}):</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '1.4rem', fontWeight: 900, marginBottom: '16px' }}>
                    <span>Total a Cobrar:</span>
                    <span style={{ color: 'var(--tropical-yellow)' }}>${total.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={() => setIsPaymentOpen(true)}
                    className="touch-btn pulse-glow"
                    style={{
                      width: '100%', padding: '16px', borderRadius: '14px', background: 'var(--primary-gradient)',
                      color: '#fff', fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                    }}
                  >
                    <DollarSign size={24} /> Cobrar Ticket (${total.toFixed(2)})
                  </button>
                </div>
              )}

            </div>
          </>
        )}

        {/* TAB DE CAMPAÑAS Y PROMOCIONES */}
        {activeTab === 'campanas' && (
          <MarketingModule 
            activePromo={activePromo} 
            setActivePromo={setActivePromo} 
            currentUser={currentUser}
            userPermissions={userPermissions}
          />
        )}

        {/* TAB DE AUDITORÍA MYSTERY SHOPPER */}
        {activeTab === 'mystery' && (
          <MysteryShopperModule />
        )}

        {/* TAB 2: INVENTARIO & COMPRAS LIBRES EXPRESS */}
        {activeTab === 'inventario' && (
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>Inventario Físico & Compras Express</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Gestión integrada de stock Franquicia HP e Insumos Libres (Costco, Walmart, Chedraui, Mercado).</p>
              </div>

              {userPermissions.canManageInventory ? (
                <button
                  onClick={() => setIsExpressPurchaseOpen(true)}
                  className="touch-btn"
                  style={{
                    padding: '12px 20px', borderRadius: '12px', background: 'var(--green-emerald)', color: '#fff',
                    fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', border: 'none'
                  }}
                >
                  <ShoppingBag size={18} /> Registrar Compra Express
                </button>
              ) : (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(245, 158, 11, 0.15)',
                  color: 'var(--tropical-yellow)', padding: '10px 18px', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.3)',
                  fontSize: '0.85rem', fontWeight: 700
                }}>
                  <Shield size={16} /> Modo Auditoría (Solo Lectura)
                </div>
              )}
            </div>

            {/* Inventory Table */}
            <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-light)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                    <th style={{ padding: '16px' }}>Insumo</th>
                    <th style={{ padding: '16px' }}>Categoría</th>
                    <th style={{ padding: '16px' }}>Stock Actual</th>
                    <th style={{ padding: '16px' }}>Alerta Mínima</th>
                    <th style={{ padding: '16px' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryList.map(item => {
                    const isLow = item.stockQuantity <= item.minStockAlert;
                    return (
                      <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)', color: '#fff' }}>
                        <td style={{ padding: '16px', fontWeight: 700 }}>{item.name}</td>
                        <td style={{ padding: '16px' }}>
                          <span style={{
                            padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700,
                            background: item.isFranchiseItem ? 'rgba(0, 242, 254, 0.15)' : 'rgba(247, 183, 49, 0.15)',
                            color: item.isFranchiseItem ? 'var(--secondary-cyan)' : 'var(--tropical-yellow)'
                          }}>
                            {item.category}
                          </span>
                        </td>
                        <td style={{ padding: '16px', fontWeight: 800, fontSize: '1.1rem', color: isLow ? '#ef4444' : '#fff' }}>
                          {item.stockQuantity} {item.unit}
                        </td>
                        <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{item.minStockAlert} {item.unit}</td>
                        <td style={{ padding: '16px' }}>
                          {isLow ? (
                            <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '0.8rem' }}>
                              <AlertTriangle size={16} /> Reabastecer
                            </span>
                          ) : (
                            <span style={{ color: 'var(--green-emerald)', fontWeight: 600, fontSize: '0.8rem' }}>OK</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CORTE DE CAJA (Cierre Ciego & Auditoría) */}
        {activeTab === 'corte' && (
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
            
            {/* Formulario de Corte Ciego (Solo Cajero, Gerente y Admin con permiso de corte) */}
            {userPermissions.canCashCut ? (
              <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '32px', borderRadius: '24px', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(255, 82, 82, 0.15)', color: 'var(--primary-coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                  <Lock size={32} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Corte Ciego de Caja (Turno Actual)</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                  Responsable: <strong style={{ color: '#fff' }}>{currentUser?.name}</strong> ({userPermissions.label.split(' / ')[0]}).
                  Cuenta el dinero físico en el cajón e ingresa el monto total. El sistema comparará contra las ventas registradas.
                </p>

                {!cutSubmitted ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ background: 'var(--bg-dark)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
                      <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Efectivo Físico Contado en Cajón ($)
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={countedCash}
                        onChange={(e) => setCountedCash(e.target.value)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--tropical-yellow)', fontSize: '2rem', fontWeight: 900, textAlign: 'center', width: '100%', outline: 'none' }}
                      />
                    </div>

                    <button
                      onClick={handleSaveCashCut}
                      disabled={!countedCash}
                      className="touch-btn"
                      style={{
                        padding: '16px', borderRadius: '14px', background: countedCash ? 'var(--primary-gradient)' : 'var(--bg-card-hover)',
                        color: '#fff', fontSize: '1.1rem', fontWeight: 800
                      }}
                    >
                      Generar y Guardar Libro de Corte HP
                    </button>
                  </div>
                ) : (
                  <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--green-emerald)', padding: '20px', borderRadius: '16px', color: '#fff' }}>
                    <CheckCircle2 size={40} color="var(--green-emerald)" style={{ margin: '0 auto 12px auto' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>¡Corte de Caja Registrado con Éxito!</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                      El reporte fue guardado en IndexedDB para la auditoría del Empresario y sincronizado a la nube.
                    </p>
                    <button onClick={() => { setCutSubmitted(false); setCountedCash(''); }} style={{ marginTop: '16px', background: 'none', border: '1px solid var(--border-light)', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}>
                      Realizar Otro Corte
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Mensaje de Auditoría para Empresario (sin permiso operativo de corte) */
              <div className="glass-panel" style={{ width: '100%', maxWidth: '800px', padding: '24px', borderRadius: '20px', border: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: 'rgba(245, 158, 11, 0.2)', color: 'var(--tropical-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Shield size={26} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>Modo Auditoría Ejecutiva — Cortes de Caja</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Como {userPermissions.label}, tienes acceso de solo lectura para auditar los cierres de caja y diferencias de efectivo reportados por cajeros y gerentes.
                  </p>
                </div>
              </div>
            )}

            {/* Tabla de Historial de Cortes de Caja (Auditable por Empresario, Gerente y Admin) */}
            <div className="glass-panel" style={{ width: '100%', maxWidth: '1000px', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>Historial y Auditoría de Cortes de Caja</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Comparativa entre ventas registradas en el POS y dinero físico contado.</p>
                </div>
                <button onClick={loadCashCuts} className="touch-btn" style={{ padding: '8px 14px', borderRadius: '8px', background: 'var(--bg-card-hover)', color: '#fff', border: '1px solid var(--border-light)', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <RefreshCw size={14} /> Actualizar
                </button>
              </div>

              {historicalCuts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Aún no hay cortes de caja registrados en esta terminal.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.72rem' }}>
                        <th style={{ padding: '12px' }}>Fecha / Hora</th>
                        <th style={{ padding: '12px' }}>Responsable</th>
                        <th style={{ padding: '12px' }}>Venta Teórica (POS)</th>
                        <th style={{ padding: '12px' }}>Efectivo Físico</th>
                        <th style={{ padding: '12px' }}>Diferencia</th>
                        <th style={{ padding: '12px' }}>Estatus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historicalCuts.slice().reverse().map((cut, idx) => {
                        const diff = Number(cut.difference) || 0;
                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                            <td style={{ padding: '12px', color: '#fff' }}>
                              {new Date(cut.timestamp).toLocaleDateString()} {new Date(cut.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td style={{ padding: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                              {cut.user || 'Personal HP'}
                            </td>
                            <td style={{ padding: '12px', color: 'var(--tropical-yellow)', fontWeight: 700 }}>
                              ${Number(cut.totalCalculated || 0).toFixed(2)}
                            </td>
                            <td style={{ padding: '12px', color: '#fff', fontWeight: 700 }}>
                              ${Number(cut.totalCounted || 0).toFixed(2)}
                            </td>
                            <td style={{ padding: '12px', fontWeight: 800, color: Math.abs(diff) < 0.01 ? 'var(--green-emerald)' : diff > 0 ? 'var(--tropical-yellow)' : '#ef4444' }}>
                              {diff >= 0 ? `+$${diff.toFixed(2)}` : `-$${Math.abs(diff).toFixed(2)}`}
                            </td>
                            <td style={{ padding: '12px' }}>
                              <span style={{
                                fontSize: '0.72rem', padding: '3px 8px', borderRadius: '6px', fontWeight: 800,
                                background: Math.abs(diff) < 0.01 ? 'rgba(16, 185, 129, 0.15)' : diff > 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                color: Math.abs(diff) < 0.01 ? 'var(--green-emerald)' : diff > 0 ? 'var(--tropical-yellow)' : '#ef4444'
                              }}>
                                {cut.status || (Math.abs(diff) < 0.01 ? 'Cuadrado' : diff > 0 ? 'Sobrante' : 'Faltante')}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 4: BASE DE CONOCIMIENTO & REPOSITORIO DE VIDEOS */}
        {activeTab === 'conocimiento' && (
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>Base de Conocimiento — Hawaiian Paradise Andamar</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Manuales de preparación y tutoriales en video accesibles directamente en caja para empleados.</p>
            </div>

            {/* RECETARIOS Y MENÚS */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--tropical-yellow)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>📋 Recetarios y Menús Oficiales HP</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                {[
                  { title: 'Menú Raspados HP', type: 'PDF', desc: 'Naturales, De Leche, Explosivos, Light, Concentrados — precios y tamaños', color: '#00f2fe', path: '/assets/menus/menú raspados pdf (1).pdf', localPath: 'C:\\OneDrive\\HAWAIIAN PARADISE - ANEXOS CURSO\\ANEXOS PARA CURSO BASICA\\MENUS\\menú raspados pdf (1).pdf' },
                  { title: 'Menú Smoothies & Aguas', type: 'PDF', desc: 'Todos los sabores de smoothies, aguas frescas y opción ¡Hazlo Boba!', color: '#ffb703', path: '/assets/menus/menu smothies_pdf (1).pdf', localPath: 'C:\\OneDrive\\HAWAIIAN PARADISE - ANEXOS CURSO\\ANEXOS PARA CURSO BASICA\\MENUS\\menu smothies_pdf (1).pdf' },
                  { title: 'Menú Crepas (Crepizza)', type: 'PDF', desc: 'Dulces, saladas, especialidades y de colores', color: '#ff7b00', path: '/assets/menus/menú crepas pdf.pdf', localPath: 'C:\\OneDrive\\HAWAIIAN PARADISE - ANEXOS CURSO\\ANEXOS PARA CURSO BASICA\\MENUS\\menú crepas pdf.pdf' },
                  { title: 'Recetario Productos Nuevos', type: 'PDF', desc: 'Frappe Nutella, Súper Explosivo, Mangada, Fresada, Raspado con Fruta', color: '#ff5252', path: '/assets/recetarios/RECETARIO DE PRODUCTOS NUEVOS.pdf', localPath: 'C:\\OneDrive\\HAWAIIAN PARADISE - ANEXOS CURSO\\ANEXOS PARA CURSO BASICA\\Archivos Varios HP\\RECETARIO DE PRODUCTOS NUEVOS.pdf' },
                  { title: 'Recetario de Tapioca (Boba)', type: 'PDF', desc: 'Cocción paso a paso: 250g en 2L de agua, 30-40 min a fuego lento', color: '#a855f7', path: '/assets/recetarios/RECETARIO DE TAPIOCA.pdf', localPath: 'C:\\OneDrive\\HAWAIIAN PARADISE - ANEXOS CURSO\\ANEXOS PARA CURSO BASICA\\Archivos Varios HP\\RECETARIO DE TAPIOCA.pdf' },
                ].map((item, idx) => (
                  <div key={idx} className="glass-panel" style={{ padding: '18px', borderRadius: '16px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, background: item.color, color: '#000', padding: '4px 10px', borderRadius: '6px' }}>{item.type}</span>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: '10px' }}>{item.title}</h3>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>{item.desc}</p>
                    </div>
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noreferrer"
                      style={{ marginTop: '14px', display: 'block', textAlign: 'center', padding: '10px', background: 'var(--bg-card-hover)', color: '#fff', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', fontSize: '0.85rem' }}
                    >
                      📂 Abrir PDF
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* VIDEOS TUTORIALES */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--tropical-yellow)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>🎬 Tutoriales en Video — Curso Básico HP</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                {[
                  { title: 'Tutorial Elaboración Crepas', type: 'VIDEO', desc: 'Doblez, temperatura y rellenos de crepas en la crepera', color: '#ffb703', localPath: 'C:\\OneDrive\\HAWAIIAN PARADISE - ANEXOS CURSO\\VIDEOS BASICA\\TUTORIAL ELABORACION CREPAS.avi' },
                  { title: 'Tutorial Elaboración Smoothie', type: 'VIDEO', desc: 'Gramajes exactos de polvos HP y técnica de licuado', color: '#00f2fe', localPath: 'C:\\OneDrive\\HAWAIIAN PARADISE - ANEXOS CURSO\\VIDEOS BASICA\\TUTOTIAL ELABORACION SMOOTHIE.mov' },
                  { title: 'Cómo Curar la Crepera', type: 'VIDEO', desc: 'Paso a paso del curado inicial de la plancha para crepas', color: '#10b981', localPath: 'C:\\OneDrive\\HAWAIIAN PARADISE - ANEXOS CURSO\\VIDEOS BASICA\\VIDEO PARA CURAR CREPERA.mp4' },
                  { title: 'Máquina de Raspados', type: 'VIDEO', desc: 'Operación y limpieza de la máquina raspa HP', color: '#a855f7', localPath: 'C:\\OneDrive\\HAWAIIAN PARADISE - ANEXOS CURSO\\VIDEOS BASICA\\curso práctico Máquina de raspados\\2.mp4' },
                  { title: 'Curso Práctico Raspados & Smoothies (9 videos)', type: 'VIDEO', desc: 'Serie completa de práctica: 00265–00273.MTS en carpeta del curso', color: '#ff5252', localPath: 'C:\\OneDrive\\HAWAIIAN PARADISE - ANEXOS CURSO\\VIDEOS BASICA\\curso practico  Raspados & Smoothies\\' },
                  { title: 'Curso Práctico Crepizza (9 videos)', type: 'VIDEO', desc: 'Serie completa de práctica de crepas: 00274–00282.MTS', color: '#ff7b00', localPath: 'C:\\OneDrive\\HAWAIIAN PARADISE - ANEXOS CURSO\\VIDEOS BASICA\\curso practico Crepizza\\' },
                ].map((item, idx) => (
                  <div key={idx} className="glass-panel" style={{ padding: '18px', borderRadius: '16px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, background: item.color, color: '#000', padding: '4px 10px', borderRadius: '6px' }}>{item.type}</span>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginTop: '10px' }}>{item.title}</h3>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.5 }}>{item.desc}</p>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '6px', fontFamily: 'monospace', wordBreak: 'break-all' }}>{item.localPath}</p>
                    </div>
                    <button
                      onClick={() => {
                        if (window.electronAPI?.openPath) { window.electronAPI.openPath(item.localPath); }
                        else { alert('Ruta del archivo: ' + item.localPath + '\n\nEn la versión de escritorio (Electron) este botón abrirá el archivo directamente.'); }
                      }}
                      className="touch-btn"
                      style={{ marginTop: '14px', padding: '10px', background: 'var(--bg-card-hover)', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: 600, fontSize: '0.85rem' }}
                    >
                      🎬 Abrir Video
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* RECETAS EXTRAÍDAS — Consulta Rápida */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--tropical-yellow)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>⚡ Recetas Rápidas — Consulta en Caja</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
                {[
                  { name: 'Frappe Nutella', pasos: 'Hielo + 2 cdas Nutella + Capuccino Clásico HP → Licuar → Decorar con chocolate.' },
                  { name: 'Súper Explosivo', pasos: 'Raspado normal en cono chico → Agregar dulces al contorno → Chamoy + Chile en polvo encima.' },
                  { name: 'Mangada', pasos: 'Hielo + ½ taza jarabe Mango Natural HP → Licuar → Chamoy + chilito + palito de tamarindo.' },
                  { name: 'Fresada', pasos: 'Hielo + ½ taza jarabe Fresa Natural HP → Licuar → Chamoy + chilito + palito de tamarindo.' },
                  { name: 'Raspado con Fruta', pasos: '½ L con jarabe Natural o Explosivo → ¾ taza fruta picada (pepino, jícama, piña o mango) → Chamoy + chile.' },
                  { name: 'Crema Chantilly', pasos: 'Por cada 1L crema Chantilly: + 5ml Vainilla + 25g Azúcar Glass.' },
                  { name: 'Tapioca (Boba)', pasos: '2L agua hervida → Reducir calor + 250g tapioca → 30-40 min fuego lento → Reposo 35 min tapado → Enjuagar + azúcar.' },
                ].map((rec, idx) => (
                  <div key={idx} className="glass-panel" style={{ padding: '16px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
                    <h4 style={{ color: 'var(--tropical-yellow)', fontWeight: 800, fontSize: '0.95rem', marginBottom: '8px' }}>🧾 {rec.name}</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{rec.pasos}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: FORMATOS E IMPRESIÓN DE CONTRATOS */}
        {activeTab === 'documentos' && (
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>Módulo de Gestión Documental — HP Andamar</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Formatos oficiales de la franquicia, contratos de trabajo e impresos de operación diaria.</p>
            </div>

            {/* FORMATOS FRANQUICIA */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--tropical-yellow)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>📊 Formatos Operativos Franquicia HP</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { title: 'Formato Solicitud de Jarabes HP', icon: FileSpreadsheet, category: 'Pedido de Insumos Franquicia', note: 'Pedir en múltiplos de 12 o 21 botellas (capacidad de hieleras)', localPath: 'C:\\OneDrive\\HAWAIIAN PARADISE - ANEXOS CURSO\\ANEXOS PARA CURSO BASICA\\Formatos\\FORMATO SOLICITUD JARABES.xlsx', webPath: '/assets/formatos/FORMATO SOLICITUD JARABES.xlsx' },
                  { title: 'Existencias Franquicia — Formato Vacío', icon: FileSpreadsheet, category: 'Control de Inventario HP', note: 'Llenado diario de vasos, jarabes, smoothies, portacrepas', localPath: 'C:\\OneDrive\\HAWAIIAN PARADISE - ANEXOS CURSO\\ANEXOS PARA CURSO BASICA\\Formatos\\EXISTENCIAS FRANQUICIA FORMATO.xls', webPath: '/assets/formatos/EXISTENCIAS FRANQUICIA FORMATO.xls' },
                  { title: 'Existencias Franquicia — Ejemplo Llenado', icon: FileSpreadsheet, category: 'Ejemplo de referencia', note: 'Muestra cómo llenar el formato de existencias (02 BASICO)', localPath: 'C:\\OneDrive\\HAWAIIAN PARADISE - ANEXOS CURSO\\ANEXOS PARA CURSO BASICA\\Formatos\\02 EXISTENCIA FRANQUICIA BASICO  EJEMPLO.xlsx', webPath: '/assets/formatos/02 EXISTENCIA FRANQUICIA BASICO  EJEMPLO.xlsx' },
                  { title: 'Libro de Corte — Formato Vacío', icon: FileSpreadsheet, category: 'Cierre de Turno / Caja', note: 'Vasos (4/8/12/14oz), Crepas, Smoothies, Agua HP, Gastos', localPath: 'C:\\OneDrive\\HAWAIIAN PARADISE - ANEXOS CURSO\\ANEXOS PARA CURSO BASICA\\Formatos\\LIBRO DE CORTE  FORMATO.xls', webPath: '/assets/formatos/LIBRO DE CORTE  FORMATO.xls' },
                  { title: 'Libro de Corte — Ejemplo Llenado', icon: FileSpreadsheet, category: 'Referencia de Cierre', note: 'Ejemplo real: Ventas $3,973 — Gastos $23 — Depósito $3,950', localPath: 'C:\\OneDrive\\HAWAIIAN PARADISE - ANEXOS CURSO\\ANEXOS PARA CURSO BASICA\\Formatos\\03 LIBRO DE CORTE BASICA EJEMPLO.xlsx', webPath: '/assets/formatos/03 LIBRO DE CORTE BASICA EJEMPLO.xlsx' },
                  { title: 'Mystery Shopper — Evaluación HP', icon: Award, category: 'Auditoría y Calidad', note: '34 preguntas: Personal, Local, Producto (Raspados/Crepas/Cafés/Smoothies)', localPath: 'C:\\OneDrive\\HAWAIIAN PARADISE - ANEXOS CURSO\\ANEXOS PARA CURSO BASICA\\Formatos\\MISTERY SHOPER.xlsx', webPath: '/assets/formatos/MISTERY SHOPER.xlsx' },
                ].map((doc, idx) => {
                  const Icon = doc.icon;
                  return (
                    <div key={idx} className="glass-panel" style={{ padding: '16px 20px', borderRadius: '14px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-emerald)', flexShrink: 0 }}>
                          <Icon size={22} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{doc.title}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{doc.category}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--tropical-yellow)', marginTop: '2px' }}>💡 {doc.note}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        <button
                          onClick={() => {
                            if (window.electronAPI?.openPath) { window.electronAPI.openPath(doc.localPath); }
                            else { window.open(doc.webPath, '_blank'); }
                          }}
                          className="touch-btn"
                          style={{ padding: '10px 14px', background: 'var(--bg-card-hover)', color: '#fff', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.8rem' }}
                        >
                          📂 Abrir
                        </button>
                        <button className="touch-btn" style={{ padding: '10px 14px', background: 'var(--primary-gradient)', color: '#fff', borderRadius: '8px', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.8rem' }}>
                          <Printer size={14} /> Imprimir
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CONTRATOS Y RRHH */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--tropical-yellow)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>📝 Contratos y Recursos Humanos</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { title: 'Contrato Individual de Trabajo HP', icon: FileText, category: 'Recursos Humanos', note: 'Contrato de trabajo con cláusulas de la franquicia', localPath: 'C:\\OneDrive\\HAWAIIAN PARADISE - ANEXOS CURSO\\ANEXOS PARA CURSO BASICA\\Formatos\\CONTRATO INDIVIDUAL DE TRABAJO.docx' },
                  { title: 'Convenio de Confidencialidad HP', icon: Lock, category: 'Legal / Franquicia', note: 'Acuerdo de no divulgación para empleados y franquiciatario', localPath: 'C:\\OneDrive\\HAWAIIAN PARADISE - ANEXOS CURSO\\ANEXOS PARA CURSO BASICA\\Formatos\\CONVENIO DE CONFIDENCIALIDAD.doc' },
                  { title: 'Horarios para Empleadas HP', icon: BookOpen, category: 'Administración de Personal', note: 'Plantilla de horarios rotación turnos semana', localPath: 'C:\\OneDrive\\HAWAIIAN PARADISE - ANEXOS CURSO\\ANEXOS PARA CURSO BASICA\\Archivos Varios HP\\07 HORARIOS PARA EMPLEADAS-HP.doc' },
                ].map((doc, idx) => {
                  const Icon = doc.icon;
                  return (
                    <div key={idx} className="glass-panel" style={{ padding: '16px 20px', borderRadius: '14px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7', flexShrink: 0 }}>
                          <Icon size={22} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{doc.title}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{doc.category}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--tropical-yellow)', marginTop: '2px' }}>💡 {doc.note}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                        <button
                          onClick={() => {
                            if (window.electronAPI?.openPath) { window.electronAPI.openPath(doc.localPath); }
                            else { alert('Archivo: ' + doc.localPath + '\n\nEn Electron se abrirá automáticamente.'); }
                          }}
                          className="touch-btn"
                          style={{ padding: '10px 14px', background: 'var(--bg-card-hover)', color: '#fff', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.8rem' }}
                        >
                          📂 Abrir
                        </button>
                        <button className="touch-btn" style={{ padding: '10px 14px', background: 'var(--primary-gradient)', color: '#fff', borderRadius: '8px', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.8rem' }}>
                          <Printer size={14} /> Imprimir
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* GALERÍA PUBLICIDAD */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--tropical-yellow)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>📸 Galería de Publicidad y Redes Sociales</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
                {['flyeGRATIS RASPA CHICA.jpg','flyer2x1 hawaiian.jpg','flyerINAUGURACION.jpg','flyer-inst hawaiian (2).jpg','Flyer Promo Lun martes.jpg','Flyer promo Mier y Jueves.jpg','RASPA2 HAWAIIAN.jpg','RASPA2 2x1.jpg'].map((img, idx) => (
                  <div key={idx} style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-light)', aspectRatio: '3/4', background: 'var(--bg-card)' }}>
                    <img
                      src={`/assets/publicidad/${img}`}
                      alt={img}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '10px' }}>📁 Carpeta completa: C:\OneDrive\HAWAIIAN PARADISE - ANEXOS CURSO\ANEXOS PARA CURSO BASICA\Publicidad\RGB\</p>
            </div>
          </div>
        )}

        {/* TAB: PANEL EMPRESARIO / FINANZAS & KPIS */}
        {activeTab === 'empresario' && userPermissions.canAccessEmpresario && (
          <EmpresarioDashboard currentUser={currentUser} />
        )}

        {/* TAB: GESTIÓN DE USUARIOS Y ROLES */}
        {activeTab === 'usuarios' && userPermissions.canManageUsers && (
          <UserManagementModule currentUser={currentUser} />
        )}

      </div>

      {/* EXPRESS PURCHASE MODAL */}
      {isExpressPurchaseOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div className="glass-panel animate-fade-in" style={{ width: '450px', background: 'var(--bg-card)', borderRadius: '24px', padding: '28px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>Registrar Compra Express Insumos Libres</h3>
              <button onClick={() => setIsExpressPurchaseOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Tienda / Mercado</label>
                <select
                  value={purchaseForm.storeName}
                  onChange={e => setPurchaseForm({ ...purchaseForm, storeName: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border-light)' }}
                >
                  <option value="Costco">Costco Wholesale</option>
                  <option value="Walmart">Walmart / Sam's Club</option>
                  <option value="Chedraui">Chedraui Selecto</option>
                  <option value="Mercado Local">Mercado Local / Proveedor de Fruta</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Nombre del Insumo</label>
                <input
                  type="text"
                  placeholder="Ej. Leche Entera 10L, Queso de Bola 2Kg"
                  value={purchaseForm.itemName}
                  onChange={e => setPurchaseForm({ ...purchaseForm, itemName: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border-light)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Cantidad Comprada</label>
                  <input
                    type="number"
                    placeholder="10"
                    value={purchaseForm.quantity}
                    onChange={e => setPurchaseForm({ ...purchaseForm, quantity: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border-light)' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Costo Total ($)</label>
                  <input
                    type="number"
                    placeholder="250.00"
                    value={purchaseForm.cost}
                    onChange={e => setPurchaseForm({ ...purchaseForm, cost: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border-light)' }}
                  />
                </div>
              </div>

              <button
                onClick={handleAddExpressPurchase}
                className="touch-btn"
                style={{ marginTop: '10px', padding: '14px', borderRadius: '12px', background: 'var(--green-emerald)', color: '#fff', fontWeight: 800, border: 'none' }}
              >
                Guardar en Inventario & Finanzas
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYMENT / COBRO MODAL */}
      {isPaymentOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div className="glass-panel animate-fade-in" style={{ width: '450px', background: 'var(--bg-card)', borderRadius: '24px', padding: '28px', border: '1px solid var(--border-light)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>Cobro de Ticket</h3>
              <button onClick={() => setIsPaymentOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>

            <div style={{ background: 'var(--bg-dark)', padding: '16px', borderRadius: '16px', textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total a Pagar</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--tropical-yellow)', fontFamily: 'var(--font-heading)' }}>
                ${total.toFixed(2)}
              </div>
            </div>

            {/* Quick Cash Buttons */}
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Efectivo Recibido Rápidamente:</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px' }}>
              {[total, 50, 100, 200, 500].slice(0, 4).map((amt, idx) => (
                <button
                  key={idx}
                  onClick={() => setCashGiven(amt.toString())}
                  className="touch-btn"
                  style={{ padding: '12px', borderRadius: '10px', background: 'var(--bg-card-hover)', color: '#fff', fontWeight: 700, border: '1px solid var(--border-light)' }}
                >
                  ${amt}
                </button>
              ))}
            </div>

            <div style={{ background: 'var(--bg-dark)', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cambio a Entregar:</span>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: (Number(cashGiven) || total) >= total ? 'var(--green-emerald)' : '#ef4444' }}>
                ${Math.max(0, (Number(cashGiven) || total) - total).toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleCompleteSale}
              className="touch-btn"
              style={{
                width: '100%', padding: '16px', borderRadius: '14px', background: 'var(--primary-gradient)',
                color: '#fff', fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase'
              }}
            >
              Confirmar y Emitir Ticket
            </button>

          </div>
        </div>
      )}

      {/* USER AUTHENTICATION / PIN PAD MODAL */}
      <UserAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSelectUser={handleSelectUser}
        currentUser={currentUser}
      />

    </div>
  );
}
