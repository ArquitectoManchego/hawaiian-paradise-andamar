import React, { useState, useEffect } from 'react';
import { 
  Sparkles, IceCream, GlassWater, CupSoda, Coffee, Utensils, Flame, Soup, Cookie,
  ShoppingCart, Trash2, Plus, Minus, Search, CreditCard, DollarSign, CheckCircle2,
  BookOpen, FileText, Lock, RefreshCw, Layers, Printer, Wifi, ShieldAlert, Award, FileSpreadsheet,
  Package, AlertTriangle, ShoppingBag, ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CATEGORIES, PRODUCTS } from './data/mockProducts';
import { db, initDatabase } from './db/localDb';
import { syncLocalDataToCloud } from './services/firebaseSync';

// Map icon strings to Lucide Components
const ICON_MAP = {
  Sparkles, IceCream, GlassWater, CupSoda, Coffee, Utensils, Flame, Soup, Cookie
};

export default function App() {
  const [activeTab, setActiveTab] = useState('pos'); // pos | inventario | corte | conocimiento | documentos
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  
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

  // Sync status
  const [syncStatus, setSyncStatus] = useState('En línea (Sincronizado)');

  // Clock
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize DB and load inventory
  useEffect(() => {
    async function loadData() {
      await initDatabase();
      const items = await db.inventory.toArray();
      setInventoryList(items);
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

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal;

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

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(15, 23, 42, 0.6)', padding: '6px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
          {[
            { id: 'pos', label: 'Punto de Venta', icon: ShoppingCart },
            { id: 'inventario', label: 'Inventario & Compras', icon: Package },
            { id: 'corte', label: 'Corte de Caja', icon: Lock },
            { id: 'conocimiento', label: 'Capacitación HP', icon: BookOpen },
            { id: 'documentos', label: 'Formatos & Contratos', icon: FileText }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="touch-btn"
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px',
                  background: isActive ? 'var(--primary-gradient)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 500, fontSize: '0.9rem'
                }}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* System info & Sync badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--green-emerald)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.8rem', fontWeight: 600 }}>
            <Wifi size={14} /> Local + Firebase Sync
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff' }}>{time}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Turno 1 • Cajero Activo</div>
          </div>
        </div>

      </header>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* TAB 1: POS / PUNTO DE VENTA */}
        {activeTab === 'pos' && (
          <>
            {/* Left Column: Categories + Products Catalog */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px', gap: '16px', overflow: 'hidden' }}>
              
              {/* Top Bar: Search */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-card)', padding: '12px 16px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
                  <Search size={20} color="var(--text-muted)" />
                  <input
                    type="text"
                    placeholder="Buscar raspado, smoothie, crepa, esquite..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '1rem', outline: 'none', width: '100%' }}
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>×</button>
                  )}
                </div>
              </div>

              {/* Categories Scrollable Pills */}
              <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                {CATEGORIES.map(cat => {
                  const Icon = ICON_MAP[cat.icon] || Sparkles;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className="touch-btn"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', borderRadius: '14px',
                        whiteSpace: 'nowrap',
                        background: isSelected ? cat.color : 'var(--bg-card)',
                        color: isSelected ? '#000' : '#fff',
                        fontWeight: 700, fontSize: '0.9rem',
                        border: isSelected ? 'none' : '1px solid var(--border-light)',
                        boxShadow: isSelected ? `0 4px 15px ${cat.color}55` : 'none'
                      }}
                    >
                      <Icon size={18} />
                      {cat.name}
                    </button>
                  );
                })}
              </div>

              {/* Product Grid */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '16px', paddingRight: '4px' }}>
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className="touch-btn animate-fade-in"
                    style={{
                      background: 'var(--bg-card)',
                      borderRadius: '16px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justify: 'space-between',
                      border: '1px solid var(--border-light)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <span style={{ 
                        fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', padding: '4px 8px', borderRadius: '6px',
                        background: product.isFranchise ? 'rgba(0, 242, 254, 0.15)' : product.isOwnRecipe ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 123, 0, 0.15)',
                        color: product.isFranchise ? 'var(--secondary-cyan)' : product.isOwnRecipe ? 'var(--green-emerald)' : 'var(--tropical-yellow)',
                        border: '1px solid currentColor'
                      }}>
                        {product.badge}
                      </span>
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '6px', lineHeight: 1.2 }}>
                        {product.name}
                      </h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '14px', height: '32px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {product.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--tropical-yellow)', fontFamily: 'var(--font-heading)' }}>
                        ${product.price}
                      </span>
                      <div style={{ 
                        width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-gradient)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' 
                      }}>
                        <Plus size={20} />
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '6px' }}>
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
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

        {/* TAB 2: INVENTARIO & COMPRAS LIBRES EXPRESS */}
        {activeTab === 'inventario' && (
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>Inventario Físico & Compras Express</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Gestión integrada de stock Franquicia HP e Insumos Libres (Costco, Walmart, Chedraui, Mercado).</p>
              </div>

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

        {/* TAB 3: CORTE DE CAJA (Cierre Ciego) */}
        {activeTab === 'corte' && (
          <div style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '32px', borderRadius: '24px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(255, 82, 82, 0.15)', color: 'var(--primary-coral)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
                <Lock size={32} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>Corte Ciego de Caja (Turno 1)</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                Cuenta el dinero físico en el cajón e ingresa el monto total. El sistema comparará contra las ventas registradas sin mostrar la diferencia en pantalla.
              </p>

              {!cutSubmitted ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: 'var(--bg-dark)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                      Efectivo Contado en Cajón ($)
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
                    onClick={() => setCutSubmitted(true)}
                    disabled={!countedCash}
                    className="touch-btn"
                    style={{
                      padding: '16px', borderRadius: '14px', background: countedCash ? 'var(--primary-gradient)' : 'var(--bg-card-hover)',
                      color: '#fff', fontSize: '1.1rem', fontWeight: 800
                    }}
                  >
                    Generar Libro de Corte HP
                  </button>
                </div>
              ) : (
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid var(--green-emerald)', padding: '20px', borderRadius: '16px', color: '#fff' }}>
                  <CheckCircle2 size={40} color="var(--green-emerald)" style={{ margin: '0 auto 12px auto' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>¡Corte de Caja Registrado con Éxito!</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    El reporte fue guardado localmente en IndexedDB y enviado a Firebase.
                  </p>
                  <button onClick={() => { setCutSubmitted(false); setCountedCash(''); }} style={{ marginTop: '16px', background: 'none', border: '1px solid var(--border-light)', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
                    Realizar Otro Corte
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: BASE DE CONOCIMIENTO & REPOSITORIO DE VIDEOS */}
        {activeTab === 'conocimiento' && (
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>Base de Conocimiento y Recetarios Hawaiian Paradise</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Manuales de preparación y tutoriales en video accesibles directamente en caja para empleados.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {[
                { title: 'Recetario de Productos Nuevos', type: 'PDF', desc: 'Guía paso a paso para bebidas de temporada', color: '#ff5252' },
                { title: 'Tutorial Elaboración Crepas', type: 'VIDEO', desc: 'Video oficial de curado de crepera y doblez', color: '#ffb703' },
                { title: 'Tutorial Elaboración Smoothie', type: 'VIDEO', desc: 'Gramajes exactos de jarabes y polvos HP', color: '#00f2fe' },
                { title: 'Recetario de Tapioca', type: 'PDF', desc: 'Cocimiento de perlas y consistencia ideal', color: '#a855f7' }
              ].map((item, idx) => (
                <div key={idx} className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, background: item.color, color: '#000', padding: '4px 8px', borderRadius: '6px' }}>{item.type}</span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginTop: '10px' }}>{item.title}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{item.desc}</p>
                  </div>
                  <button className="touch-btn" style={{ marginTop: '16px', width: '100%', padding: '10px', background: 'var(--bg-card-hover)', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: 600 }}>
                    Abrir Archivo
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: FORMATOS E IMPRESIÓN DE CONTRATOS */}
        {activeTab === 'documentos' && (
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>Módulo de Gestión Documental y Formatos HP</h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Impresión rápida de formatos oficiales y contratos individuales de trabajo.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {[
                { title: 'Formato Solicitud Jarabes', icon: FileSpreadsheet, category: 'Formatos Excel Franquicia' },
                { title: 'Existencias Franquicia Formato', icon: FileSpreadsheet, category: 'Inventario Físico' },
                { title: 'Contrato Individual de Trabajo', icon: FileText, category: 'Recursos Humanos' },
                { title: 'Convenio de Confidencialidad', icon: Lock, category: 'Legal / Franquicia' }
              ].map((doc, idx) => {
                const Icon = doc.icon;
                return (
                  <div key={idx} className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tropical-yellow)' }}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{doc.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{doc.category}</div>
                      </div>
                    </div>
                    <button className="touch-btn" style={{ padding: '10px 14px', background: 'var(--primary-gradient)', color: '#fff', borderRadius: '8px', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                      <Printer size={16} /> Imprimir
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
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

    </div>
  );
}
