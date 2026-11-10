import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, DollarSign, PieChart, ShoppingBag, Award, AlertTriangle, 
  Calendar, Printer, BarChart2, CheckCircle2, ArrowUpRight, ArrowDownRight,
  ShieldAlert, Layers, Percent, FileText, Clock, Coffee, IceCream, Utensils
} from 'lucide-react';
import { db } from '../db/localDb';

export default function EmpresarioDashboard({ currentUser }) {
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [cashCuts, setCashCuts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [timeFilter, setTimeFilter] = useState('all'); // today | week | month | all
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllFinancialData();
  }, []);

  const loadAllFinancialData = async () => {
    setLoading(true);
    try {
      const allSales = await db.sales.toArray();
      const allPurchases = await db.purchases.toArray();
      const allCuts = await db.cashCuts.toArray();
      const allInv = await db.inventory.toArray();
      
      setSales(allSales);
      setPurchases(allPurchases);
      setCashCuts(allCuts);
      setInventory(allInv);
    } catch (err) {
      console.error('Error cargando finanzas:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter sales & purchases by selected time range
  const filterByDate = (items, dateKey) => {
    if (timeFilter === 'all') return items;
    const now = new Date();
    return items.filter(item => {
      const itemDate = new Date(item[dateKey]);
      if (isNaN(itemDate)) return true;
      if (timeFilter === 'today') {
        return itemDate.toDateString() === now.toDateString();
      }
      if (timeFilter === 'week') {
        const diffDays = (now - itemDate) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
      }
      if (timeFilter === 'month') {
        return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  };

  const filteredSales = filterByDate(sales, 'timestamp');
  const filteredPurchases = filterByDate(purchases, 'date');

  // Core Financial Metrics (Best Practices Franquicia Retail / Alimentos)
  const totalRevenue = filteredSales.reduce((acc, s) => acc + (Number(s.total) || 0), 0);
  const totalTransactions = filteredSales.length;
  const averageTicket = totalTransactions > 0 ? (totalRevenue / totalTransactions) : 0;

  // COGS estimado de franquicia de bebidas y snacks: 32% sobre precio de venta
  const estimatedCOGS = totalRevenue * 0.32;
  const grossProfit = totalRevenue - estimatedCOGS;
  const grossMarginPercent = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100) : 68.0;

  // Compras de insumos libres registradas (Costco, Walmart, Chedraui, Mercado)
  const totalPurchasesCost = filteredPurchases.reduce((acc, p) => acc + (Number(p.totalCost) || 0), 0);
  
  // Utilidad neta operativa estimada
  const netOperatingProfit = grossProfit - totalPurchasesCost;
  const netMarginPercent = totalRevenue > 0 ? ((netOperatingProfit / totalRevenue) * 100) : 0;

  // Breakdown by product category
  const categoryStats = {};
  filteredSales.forEach(sale => {
    if (Array.isArray(sale.items)) {
      sale.items.forEach(it => {
        const cat = it.category || 'Otros';
        const itemTotal = (Number(it.price) || 0) * (Number(it.quantity) || 1);
        if (!categoryStats[cat]) {
          categoryStats[cat] = { total: 0, quantity: 0, name: cat };
        }
        categoryStats[cat].total += itemTotal;
        categoryStats[cat].quantity += (Number(it.quantity) || 1);
      });
    }
  });

  const categoryList = Object.values(categoryStats).sort((a, b) => b.total - a.total);

  // Top Products
  const productStats = {};
  filteredSales.forEach(sale => {
    if (Array.isArray(sale.items)) {
      sale.items.forEach(it => {
        const name = it.name || 'Sin Nombre';
        if (!productStats[name]) {
          productStats[name] = { name, count: 0, revenue: 0 };
        }
        productStats[name].count += (Number(it.quantity) || 1);
        productStats[name].revenue += (Number(it.price) || 0) * (Number(it.quantity) || 1);
      });
    }
  });

  const topProducts = Object.values(productStats).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  // Inventory Critical Alerts (Franchise items)
  const criticalItems = inventory.filter(item => (item.stockQuantity || 0) <= (item.minStockAlert || 2));

  // Print Executive Summary
  const handlePrintExecutiveReport = () => {
    window.print();
  };

  return (
    <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* EXECUTIVE HEADER */}
      <div style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(168, 85, 247, 0.2))', border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: '20px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--tropical-yellow)', color: '#000', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
            <Award size={14} /> Panel Estratégico de Control Empresarial
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff' }}>Módulo de Contabilidad, Finanzas & KPIs</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Visión ejecutiva de alto nivel: Márgenes, utilidades, ventas por categoría, auditorías y salud de la inversión en Plaza Andamar.
          </p>
        </div>

        {/* TIME FILTER & EXPORT */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', background: 'var(--bg-dark)', borderRadius: '12px', padding: '4px', border: '1px solid var(--border-light)' }}>
            {[
              { id: 'today', label: 'Hoy' },
              { id: 'week', label: '7 Días' },
              { id: 'month', label: 'Mes' },
              { id: 'all', label: 'Todo' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setTimeFilter(f.id)}
                className="touch-btn"
                style={{
                  padding: '8px 14px', borderRadius: '8px', border: 'none', fontSize: '0.8rem', fontWeight: 700,
                  background: timeFilter === f.id ? 'var(--tropical-yellow)' : 'transparent',
                  color: timeFilter === f.id ? '#000' : 'var(--text-muted)'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <button
            onClick={handlePrintExecutiveReport}
            className="touch-btn"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '12px',
              background: 'var(--bg-card-hover)', color: '#fff', border: '1px solid var(--border-light)',
              fontWeight: 700, fontSize: '0.85rem'
            }}
          >
            <Printer size={16} /> Imprimir P&L
          </button>
        </div>
      </div>

      {/* 4 CARDS FINANCIERAS CLAVE (KPIs EJECUTIVOS) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        
        {/* Total Revenue */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px', border: '1px solid rgba(255, 183, 3, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
            <span>Ingresos Brutos</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255, 183, 3, 0.15)', color: 'var(--tropical-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--tropical-yellow)', marginTop: '8px', fontFamily: 'var(--font-heading)' }}>
            ${totalRevenue.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={14} color="var(--green-emerald)" />
            <span>{totalTransactions} tickets emitidos</span>
          </div>
        </div>

        {/* Ticket Promedio */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
            <span>Ticket Promedio (AOV)</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0, 242, 254, 0.15)', color: 'var(--secondary-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#fff', marginTop: '8px', fontFamily: 'var(--font-heading)' }}>
            ${averageTicket.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Promedio de gasto por cliente
          </div>
        </div>

        {/* Margen Bruto */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
            <span>Margen Bruto Est.</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--green-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Percent size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--green-emerald)', marginTop: '8px', fontFamily: 'var(--font-heading)' }}>
            {grossMarginPercent.toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Utilidad bruta: ${grossProfit.toFixed(2)}
          </div>
        </div>

        {/* Utilidad Operativa Neta */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
            <span>Utilidad Neta en Caja</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.9rem', fontWeight: 900, color: netOperatingProfit >= 0 ? '#fff' : '#ef4444', marginTop: '8px', fontFamily: 'var(--font-heading)' }}>
            ${netOperatingProfit.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
            Compras libres: -${totalPurchasesCost.toFixed(2)}
          </div>
        </div>

      </div>

      {/* SECCIÓN INTERMEDIA: ESTADO DE RESULTADOS (P&L CONDENSADO) & PRODUCT MIX */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', alignItems: 'stretch' }}>
        
        {/* P&L Condensado (Estado de Resultados) */}
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={20} color="var(--tropical-yellow)" /> Estado de Resultados Condensado (P&L)
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ color: '#fff', fontWeight: 700 }}>1. Ingresos por Ventas Totales</span>
                <span style={{ color: 'var(--tropical-yellow)', fontWeight: 800 }}>+${totalRevenue.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span>2. Costo de Ventas Estimado (Insumos Franquicia ~32%)</span>
                <span style={{ color: '#ef4444' }}>-${estimatedCOGS.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-light)', fontWeight: 700 }}>
                <span style={{ color: 'var(--green-emerald)' }}>3. Margen de Contribución Bruto (68%)</span>
                <span style={{ color: 'var(--green-emerald)', fontWeight: 800 }}>${grossProfit.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <span>4. Compras Express Materia Prima (Costco / Walmart / Mercado)</span>
                <span style={{ color: '#ef4444' }}>-${totalPurchasesCost.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', fontSize: '1.1rem', fontWeight: 900 }}>
                <span style={{ color: '#fff' }}>5. Utilidad Operativa Disponible</span>
                <span style={{ color: netOperatingProfit >= 0 ? 'var(--green-emerald)' : '#ef4444' }}>
                  ${netOperatingProfit.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '20px', padding: '12px 16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-light)', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            💡 <strong>Best Practice Franquicia HP:</strong> El margen bruto objetivo debe mantenerse arriba del 65%. Las mermas en masa de crepas y jarabes se auditan cotejando vasos consumidos en el libro de corte diario.
          </div>
        </div>

        {/* Product Mix por Categoría */}
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={20} color="var(--secondary-cyan)" /> Ventas por Categoría (Product Mix)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {categoryList.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '20px' }}>
                No hay ventas registradas en el período seleccionado.
              </div>
            ) : (
              categoryList.map(cat => {
                const percent = totalRevenue > 0 ? ((cat.total / totalRevenue) * 100) : 0;
                return (
                  <div key={cat.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                      <span style={{ color: '#fff', fontWeight: 700, textTransform: 'capitalize' }}>{cat.name} ({cat.quantity} u.)</span>
                      <span style={{ color: 'var(--tropical-yellow)', fontWeight: 800 }}>${cat.total.toFixed(2)} ({percent.toFixed(1)}%)</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--bg-dark)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${percent}%`, height: '100%', background: 'var(--primary-gradient)', borderRadius: '4px' }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* SECCIÓN INFERIOR: HISTORIAL DE CORTES DE CAJA (AUDITORÍA FINANCIERA READ-ONLY) & ALERTAS DE STOCK */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px' }}>
        
        {/* Historial de Cortes de Caja (Auditoría para Empresario) */}
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} color="var(--purple-neon, #a855f7)" /> Auditoría de Cortes de Caja (Historial)
            </h3>
            <span style={{ fontSize: '0.75rem', background: 'rgba(245, 158, 11, 0.2)', color: 'var(--tropical-yellow)', padding: '4px 10px', borderRadius: '8px', fontWeight: 700 }}>
              Solo Lectura
            </span>
          </div>

          {cashCuts.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '24px' }}>
              No se han registrado cortes de caja aún.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)' }}>
                    <th style={{ padding: '8px 12px' }}>Fecha</th>
                    <th style={{ padding: '8px 12px' }}>Venta Teórica</th>
                    <th style={{ padding: '8px 12px' }}>Físico en Cajón</th>
                    <th style={{ padding: '8px 12px' }}>Diferencia</th>
                    <th style={{ padding: '8px 12px' }}>Estatus</th>
                  </tr>
                </thead>
                <tbody>
                  {cashCuts.slice(-5).reverse().map((cut, idx) => {
                    const diff = Number(cut.difference) || 0;
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td style={{ padding: '10px 12px', color: '#fff' }}>
                          {new Date(cut.timestamp).toLocaleDateString()} {new Date(cut.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ padding: '10px 12px', color: 'var(--tropical-yellow)', fontWeight: 700 }}>
                          ${Number(cut.totalCalculated || 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '10px 12px', color: '#fff' }}>
                          ${Number(cut.totalCounted || 0).toFixed(2)}
                        </td>
                        <td style={{ padding: '10px 12px', fontWeight: 800, color: diff === 0 ? 'var(--green-emerald)' : diff > 0 ? 'var(--tropical-yellow)' : '#ef4444' }}>
                          {diff >= 0 ? `+$${diff.toFixed(2)}` : `-$${Math.abs(diff).toFixed(2)}`}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--green-emerald)', fontWeight: 800 }}>
                            {cut.status || 'Completado'}
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

        {/* Productos Más Vendidos & Alertas */}
        <div className="glass-panel" style={{ borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} color="var(--green-emerald)" /> Productos Más Vendidos
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {topProducts.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '16px' }}>
                Sin datos suficientes de productos.
              </div>
            ) : (
              topProducts.map((p, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', borderRadius: '10px', background: 'var(--bg-dark)', border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--primary-gradient)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800 }}>
                      {idx + 1}
                    </span>
                    <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.85rem' }}>{p.name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--tropical-yellow)', fontWeight: 800, fontSize: '0.85rem' }}>${p.revenue.toFixed(2)}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>{p.count} vendidos</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {criticalItems.length > 0 && (
            <div style={{ marginTop: '16px', padding: '12px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 700, fontSize: '0.8rem', marginBottom: '4px' }}>
                <AlertTriangle size={16} /> Alerta de Reabastecimiento HP
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {criticalItems.length} insumos de franquicia se encuentran en stock crítico. Recuerda que los pedidos de jarabes se realizan en múltiplos de 12 o 21 botellas.
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
