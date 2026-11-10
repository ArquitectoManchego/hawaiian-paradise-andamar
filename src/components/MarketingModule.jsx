import React, { useState } from 'react';
import { Megaphone, CheckCircle, Tag, Calendar, Sparkles, Image, Flame, Plus, AlertCircle, Shield } from 'lucide-react';
import { PROMOTIONS } from '../data/mockProducts';

export default function MarketingModule({ activePromo, setActivePromo, currentUser, userPermissions }) {
  const [selectedFlyer, setSelectedFlyer] = useState(null);
  const [promoList, setPromoList] = useState(PROMOTIONS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPromoForm, setNewPromoForm] = useState({
    name: '',
    type: 'DISCOUNT_PERCENT',
    discountPercent: 15,
    fixedPrice: 50,
    applicableCategory: 'all',
    description: '',
    flyer: '/assets/publicidad/flyer-institucional.jpg'
  });

  const canManage = userPermissions?.canManagePromos ?? (currentUser?.role === 'administrador' || currentUser?.role === 'gerente');

  const handleCreatePromo = (e) => {
    e.preventDefault();
    if (!newPromoForm.name.trim()) return;

    const created = {
      id: `promo-${Date.now()}`,
      name: newPromoForm.name.trim(),
      type: newPromoForm.type,
      discountPercent: Number(newPromoForm.discountPercent) || 0,
      fixedPrice: Number(newPromoForm.fixedPrice) || 0,
      applicableCategory: newPromoForm.applicableCategory === 'all' ? null : newPromoForm.applicableCategory,
      description: newPromoForm.description.trim() || 'Promoción especial activa en sucursal Andamar.',
      flyer: newPromoForm.flyer
    };

    setPromoList([created, ...promoList]);
    setIsAddModalOpen(false);
    setNewPromoForm({
      name: '',
      type: 'DISCOUNT_PERCENT',
      discountPercent: 15,
      fixedPrice: 50,
      applicableCategory: 'all',
      description: '',
      flyer: '/assets/publicidad/flyer-institucional.jpg'
    });
  };

  const flyersList = [
    { title: 'Flyer 2x1 Hawaiian', file: 'flyer2x1 hawaiian.jpg', desc: 'Promoción clásica 2x1 en raspados' },
    { title: '2 Smoothies x $56', file: 'flyer2x56 smothies.jpg', desc: 'Combo de smoothies a $56' },
    { title: 'Gran Inauguración HP', file: 'flyerINAUGURACION.jpg', desc: 'Descuento del 20% por apertura' },
    { title: 'Gratis Raspado Chica', file: 'flyeGRATIS RASPA CHICA.jpg', desc: 'Regalo en consumo mayor a $150' },
    { title: 'Gratis Raspado Leche', file: 'flyer -GRATIS RASPA LECHE.jpg', desc: 'Raspado de leche de cortesía' },
    { title: 'Promo Lunes y Martes', file: 'Flyer Promo Lun martes.jpg', desc: '15% de descuento inicio de semana' },
    { title: 'Promo Miércoles y Jueves', file: 'Flyer promo Mier y Jueves.jpg', desc: '20% en 2do raspado' },
    { title: 'Especial 21 Marzo (Bermudas)', file: 'flyer 21 MARZO BERMUDAS.jpg', desc: '20% si vienes en bermudas' },
    { title: 'Especial Día del Niño (30 Abril)', file: 'flyer30 ABRIL DIA DEL NIO.jpg', desc: '25% en raspados chicle azul' },
    { title: 'Especial Día de las Madres (10 Mayo)', file: 'flyer10 deMAYO.jpg', desc: 'Topping Boba gratis para mamá' },
    { title: 'Flyer Institucional', file: 'flyer-institucional.jpg', desc: 'Publicidad corporativa Hawaiian Paradise' },
    { title: 'Tarjeta Premio Hawaiian', file: 'Tarjeta-Hawaiian-premio.jpg', desc: 'Tarjeta de lealtad para clientes frecuentes' },
  ];

  return (
    <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, rgba(255, 82, 82, 0.2), rgba(255, 183, 3, 0.2))', border: '1px solid rgba(255, 183, 3, 0.4)', borderRadius: '20px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--tropical-yellow)', color: '#000', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
            <Sparkles size={14} /> Centro de Marketing & Campañas Publicitarias
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff' }}>Gestión de Promociones HP Andamar</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Selecciona y activa la promoción vigente para aplicar automáticamente los precios y descuentos en la pantalla POS.
          </p>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '12px 20px', borderRadius: '14px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Promoción Activa Actualmente</div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: activePromo ? 'var(--green-emerald)' : 'var(--primary-coral)', marginTop: '2px' }}>
            {activePromo ? activePromo.name : 'Ninguna (Precios Lista)'}
          </div>
        </div>
      </div>

      {/* SECTION 1: ACTIVACIÓN DE PROMOCIONES DE 1-CLIC */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--tropical-yellow)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tag size={18} /> Promociones Disponibles para la Caja Registradora
          </h3>
          {canManage ? (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="touch-btn"
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', borderRadius: '12px',
                background: 'var(--primary-gradient)', color: '#fff', fontSize: '0.85rem', fontWeight: 800, border: 'none'
              }}
            >
              <Plus size={16} /> Crear Nueva Promoción
            </button>
          ) : (
            <span style={{ fontSize: '0.75rem', background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-muted)', padding: '6px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={14} /> Modo Cajero (Solo Gerente puede agregar promociones)
            </span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {promoList.map((promo) => {
            const isActive = activePromo?.id === promo.id;
            return (
              <div
                key={promo.id}
                className="glass-panel"
                style={{
                  padding: '20px',
                  borderRadius: '18px',
                  border: isActive ? '2px solid var(--green-emerald)' : '1px solid var(--border-light)',
                  background: isActive ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  gap: '14px',
                  transition: 'all 0.2s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, background: 'rgba(255, 255, 255, 0.1)', color: 'var(--tropical-yellow)', padding: '4px 10px', borderRadius: '8px' }}>
                      {promo.type === '2x1' ? '⚡ 2x1' : promo.type === 'FIXED_COMBO' ? '💰 Precio Combo' : '🏷️ Descuento'}
                    </span>
                    {isActive && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--green-emerald)' }}>
                        <CheckCircle size={14} /> ACTIVA
                      </span>
                    )}
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginTop: '10px' }}>{promo.name}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.5 }}>
                    {promo.description}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setActivePromo(isActive ? null : promo)}
                    className="touch-btn"
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      background: isActive ? '#ef4444' : 'var(--primary-gradient)',
                      color: '#fff',
                      fontWeight: 800,
                      border: 'none',
                      fontSize: '0.85rem'
                    }}
                  >
                    {isActive ? 'Desactivar Promo' : 'Activar en POS'}
                  </button>
                  <button
                    onClick={() => setSelectedFlyer(promo.flyer)}
                    className="touch-btn"
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: 'var(--bg-card-hover)',
                      color: '#fff',
                      border: '1px solid var(--border-light)'
                    }}
                    title="Ver Flyer Oficial"
                  >
                    <Image size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: GALERÍA COMPLETA DE FLYERS & PUBLICIDAD OFICIAL */}
      <div>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--tropical-yellow)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Megaphone size={18} /> Galería Completa de Flyers Oficiales Hawaiian Paradise (40+ Diseños)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px' }}>
          {flyersList.map((flyer, idx) => (
            <div
              key={idx}
              className="glass-panel"
              onClick={() => setSelectedFlyer(`/assets/publicidad/${flyer.file}`)}
              style={{
                borderRadius: '14px',
                overflow: 'hidden',
                border: '1px solid var(--border-light)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, border-color 0.2s ease',
                background: 'var(--bg-card)'
              }}
            >
              <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: '#000' }}>
                <img
                  src={`/assets/publicidad/${flyer.file}`}
                  alt={flyer.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <div style={{ padding: '10px' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{flyer.title}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{flyer.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL VISOR DE FLYER EN ALTA RESOLUCIÓN */}
      {selectedFlyer && (
        <div
          onClick={() => setSelectedFlyer(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            zIndex: 1000,
            padding: '24px'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxHeight: '90vh',
              maxWidth: '90vw',
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
            }}
          >
            <button
              onClick={() => setSelectedFlyer(null)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(0,0,0,0.7)',
                color: '#fff',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                fontSize: '1.2rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                zIndex: 10
              }}
            >
              ✕
            </button>
            <img
              src={selectedFlyer}
              alt="Flyer Promocional"
              style={{ maxHeight: '85vh', maxWidth: '85vw', display: 'block', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}

      {/* MODAL PARA CREAR NUEVA PROMOCIÓN (GERENTE / ADMIN) */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', background: 'var(--bg-card)', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>Crear Nueva Promoción HP</h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.4rem', cursor: 'pointer' }}>×</button>
            </div>

            <form onSubmit={handleCreatePromo} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Nombre de la Promoción</label>
                <input
                  type="text"
                  placeholder="Ej. 2x1 en Raspados de Leche"
                  value={newPromoForm.name}
                  onChange={e => setNewPromoForm({ ...newPromoForm, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border-light)', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Tipo de Promoción</label>
                <select
                  value={newPromoForm.type}
                  onChange={e => setNewPromoForm({ ...newPromoForm, type: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border-light)', outline: 'none' }}
                >
                  <option value="DISCOUNT_PERCENT">Porcentaje de Descuento (%)</option>
                  <option value="2x1">Promoción 2x1</option>
                  <option value="FIXED_COMBO">Precio Fijo Combo ($)</option>
                </select>
              </div>

              {newPromoForm.type === 'DISCOUNT_PERCENT' && (
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Porcentaje de Descuento (%)</label>
                  <input
                    type="number"
                    value={newPromoForm.discountPercent}
                    onChange={e => setNewPromoForm({ ...newPromoForm, discountPercent: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border-light)', outline: 'none' }}
                    min="1"
                    max="100"
                  />
                </div>
              )}

              {newPromoForm.type === 'FIXED_COMBO' && (
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Precio Especial Combo ($)</label>
                  <input
                    type="number"
                    value={newPromoForm.fixedPrice}
                    onChange={e => setNewPromoForm({ ...newPromoForm, fixedPrice: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border-light)', outline: 'none' }}
                  />
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Descripción de la Oferta</label>
                <textarea
                  rows={2}
                  placeholder="Detalles sobre días aplicables, condiciones o productos..."
                  value={newPromoForm.description}
                  onChange={e => setNewPromoForm({ ...newPromoForm, description: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border-light)', outline: 'none', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="touch-btn"
                  style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'var(--bg-card-hover)', color: '#fff', border: '1px solid var(--border-light)', fontWeight: 700 }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="touch-btn"
                  style={{ flex: 2, padding: '12px', borderRadius: '10px', background: 'var(--primary-gradient)', color: '#fff', border: 'none', fontWeight: 800 }}
                >
                  Guardar y Habilitar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
