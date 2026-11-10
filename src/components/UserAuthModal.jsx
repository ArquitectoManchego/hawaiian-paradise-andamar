import React, { useState, useEffect } from 'react';
import { Shield, Key, Check, X, Delete, ArrowRight, Lock, UserCheck } from 'lucide-react';
import { db, ROLE_PERMISSIONS, DEFAULT_USERS } from '../db/localDb';

export default function UserAuthModal({ isOpen, onClose, onSelectUser, currentUser }) {
  const [users, setUsers] = useState([]);
  const [selectedUserForPin, setSelectedUserForPin] = useState(null);
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadUsers();
      setPinInput('');
      setErrorMsg('');
      setSelectedUserForPin(null);
    }
  }, [isOpen]);

  const loadUsers = async () => {
    const list = await db.users.where('active').equals(1).toArray();
    if (list.length === 0) {
      const all = await db.users.toArray();
      setUsers(all.length > 0 ? all : DEFAULT_USERS);
    } else {
      setUsers(list);
    }
  };

  const handleSelectUser = (u) => {
    setSelectedUserForPin(u);
    setPinInput('');
    setErrorMsg('');
  };

  const handleKeyClick = (num) => {
    if (pinInput.length < 6) {
      const newPin = pinInput + num;
      setPinInput(newPin);
      if (selectedUserForPin && newPin.length === (selectedUserForPin.pin?.length || 4)) {
        verifyPin(newPin);
      }
    }
  };

  const handleDelete = () => {
    setPinInput(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  const handleClear = () => {
    setPinInput('');
    setErrorMsg('');
  };

  const verifyPin = (pinToTest) => {
    const pin = pinToTest || pinInput;
    if (!selectedUserForPin) return;

    if (pin === selectedUserForPin.pin || pin === selectedUserForPin.password) {
      onSelectUser(selectedUserForPin);
      onClose();
    } else {
      setErrorMsg('PIN incorrecto. Intenta de nuevo.');
      setPinInput('');
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%', maxWidth: '580px', background: 'var(--bg-card)', borderRadius: '24px',
        border: '1px solid var(--border-light)', padding: '28px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
      }}>
        
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--tropical-yellow)', background: 'rgba(255, 183, 3, 0.15)', padding: '3px 10px', borderRadius: '8px' }}>
              Control de Turno & Autenticación
            </span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', marginTop: '4px' }}>
              Cambiar Usuario Activo
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.6rem', cursor: 'pointer' }}>×</button>
        </div>

        {/* STEP 1: USER SELECTION CARDS */}
        {!selectedUserForPin ? (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Selecciona tu cuenta para identificarte en la terminal táctil:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {users.map(u => {
                const perm = ROLE_PERMISSIONS[u.role] || ROLE_PERMISSIONS.cajero;
                const isCurrent = currentUser?.id === u.id;
                return (
                  <div
                    key={u.id}
                    onClick={() => handleSelectUser(u)}
                    className="touch-btn"
                    style={{
                      padding: '16px', borderRadius: '16px', background: isCurrent ? 'rgba(255, 183, 3, 0.1)' : 'var(--bg-dark)',
                      border: isCurrent ? '2px solid var(--tropical-yellow)' : '1px solid var(--border-light)',
                      display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '2rem' }}>{u.avatar || '🍧'}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>{u.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>@{u.username}</div>
                      <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', background: perm.badgeBg, color: perm.badgeColor }}>
                        {perm.label}
                      </span>
                    </div>
                    {isCurrent && (
                      <span style={{ color: 'var(--tropical-yellow)', fontSize: '0.75rem', fontWeight: 800 }}>ACTIVO</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* STEP 2: PIN PAD */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', background: 'var(--bg-dark)', padding: '12px 16px', borderRadius: '14px', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '2rem' }}>{selectedUserForPin.avatar}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{selectedUserForPin.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--tropical-yellow)', fontWeight: 700 }}>
                  {ROLE_PERMISSIONS[selectedUserForPin.role]?.label}
                </div>
              </div>
              <button
                onClick={() => setSelectedUserForPin(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Cambiar
              </button>
            </div>

            {/* PIN Display Dots */}
            <div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', margin: '8px 0' }}>
                {[0, 1, 2, 3].map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: pinInput.length > idx ? 'var(--tropical-yellow)' : 'rgba(255, 255, 255, 0.1)',
                      border: '2px solid var(--border-light)',
                      transition: 'all 0.15s ease'
                    }}
                  />
                ))}
              </div>
              {errorMsg && (
                <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 700, textAlign: 'center', marginTop: '6px' }}>
                  {errorMsg}
                </div>
              )}
            </div>

            {/* Large On-Screen Numeric Keypad for All-in-One Touchscreens */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', width: '100%', maxWidth: '300px' }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeyClick(num.toString())}
                  className="touch-btn"
                  style={{
                    padding: '16px', fontSize: '1.4rem', fontWeight: 800, color: '#fff',
                    background: 'var(--bg-dark)', borderRadius: '14px', border: '1px solid var(--border-light)'
                  }}
                >
                  {num}
                </button>
              ))}
              
              <button
                type="button"
                onClick={handleClear}
                className="touch-btn"
                style={{
                  padding: '16px', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)',
                  background: 'var(--bg-dark)', borderRadius: '14px', border: '1px solid var(--border-light)'
                }}
              >
                BORRAR
              </button>
              
              <button
                type="button"
                onClick={() => handleKeyClick('0')}
                className="touch-btn"
                style={{
                  padding: '16px', fontSize: '1.4rem', fontWeight: 800, color: '#fff',
                  background: 'var(--bg-dark)', borderRadius: '14px', border: '1px solid var(--border-light)'
                }}
              >
                0
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="touch-btn"
                style={{
                  padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444',
                  background: 'var(--bg-dark)', borderRadius: '14px', border: '1px solid var(--border-light)'
                }}
              >
                <Delete size={22} />
              </button>
            </div>

            {/* Quick Submit button */}
            <button
              onClick={() => verifyPin()}
              disabled={pinInput.length < 4}
              className="touch-btn"
              style={{
                width: '100%', maxWidth: '300px', padding: '14px', borderRadius: '12px',
                background: pinInput.length >= 4 ? 'var(--primary-gradient)' : 'var(--bg-card-hover)',
                color: '#fff', fontWeight: 800, border: 'none', fontSize: '1rem', marginTop: '6px'
              }}
            >
              Entrar al Sistema
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
