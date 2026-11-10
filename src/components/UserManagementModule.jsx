import React, { useState, useEffect } from 'react';
import { 
  Users, UserPlus, Shield, Key, Check, X, Edit2, Trash2, 
  Lock, Sparkles, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';
import { db, ROLE_PERMISSIONS, DEFAULT_USERS } from '../db/localDb';

export default function UserManagementModule({ currentUser }) {
  const [userList, setUserList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    name: '',
    username: '',
    role: 'cajero',
    pin: '',
    password: '',
    avatar: '🍧',
    active: true
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const AVATAR_OPTIONS = ['👑', '💼', '📋', '🍧', '☕', '🥐', '✨', '🍍', '🥥', '🥭'];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const allUsers = await db.users.toArray();
    if (allUsers.length === 0) {
      await db.users.bulkAdd(DEFAULT_USERS);
      setUserList(DEFAULT_USERS);
    } else {
      setUserList(allUsers);
    }
  };

  const handleOpenCreate = () => {
    setEditingUser(null);
    setForm({
      name: '',
      username: '',
      role: 'cajero',
      pin: '',
      password: '',
      avatar: '🍧',
      active: true
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      username: user.username,
      role: user.role,
      pin: user.pin || '',
      password: user.password || '',
      avatar: user.avatar || '🍧',
      active: user.active !== false
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!form.name.trim() || !form.username.trim()) {
      setErrorMsg('Nombre completo y nombre de usuario son obligatorios.');
      return;
    }
    if (!form.pin.trim() || form.pin.length < 4) {
      setErrorMsg('El PIN debe tener al menos 4 dígitos numéricos para la pantalla táctil.');
      return;
    }

    const cleanUsername = form.username.trim().toLowerCase();

    // Check duplicate username
    const existing = await db.users.where('username').equals(cleanUsername).first();
    if (existing && (!editingUser || existing.id !== editingUser.id)) {
      setErrorMsg(`El nombre de usuario "${cleanUsername}" ya está registrado.`);
      return;
    }

    if (editingUser) {
      // Prevent deactivating or demoting the only administrator
      if (editingUser.role === 'administrador' && form.role !== 'administrador') {
        const adminCount = await db.users.where('role').equals('administrador').count();
        if (adminCount <= 1) {
          setErrorMsg('No puedes cambiar el rol del único administrador del sistema.');
          return;
        }
      }

      await db.users.update(editingUser.id, {
        name: form.name.trim(),
        username: cleanUsername,
        role: form.role,
        pin: form.pin.trim(),
        password: form.password.trim() || form.pin.trim(),
        avatar: form.avatar,
        active: form.active,
        updatedAt: new Date().toISOString()
      });
      setSuccessMsg(`Usuario "${form.name}" actualizado correctamente.`);
    } else {
      const newUser = {
        id: `user-${Date.now()}`,
        name: form.name.trim(),
        username: cleanUsername,
        role: form.role,
        pin: form.pin.trim(),
        password: form.password.trim() || form.pin.trim(),
        avatar: form.avatar,
        active: form.active,
        createdAt: new Date().toISOString()
      };
      await db.users.add(newUser);
      setSuccessMsg(`Usuario "${form.name}" creado con éxito.`);
    }

    await loadUsers();
    setIsModalOpen(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleDeleteUser = async (user) => {
    if (user.role === 'administrador') {
      const adminCount = await db.users.where('role').equals('administrador').count();
      if (adminCount <= 1) {
        alert('No se puede eliminar el único Administrador del sistema.');
        return;
      }
    }
    if (confirm(`¿Estás seguro de eliminar al usuario "${user.name}" (@${user.username})?`)) {
      await db.users.delete(user.id);
      await loadUsers();
      setSuccessMsg(`Usuario eliminado.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const handleToggleStatus = async (user) => {
    if (user.role === 'administrador' && user.active) {
      const activeAdmins = userList.filter(u => u.role === 'administrador' && u.active);
      if (activeAdmins.length <= 1) {
        alert('Debe existir al menos un Administrador activo.');
        return;
      }
    }
    await db.users.update(user.id, { active: !user.active });
    await loadUsers();
  };

  return (
    <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(0, 242, 254, 0.2))', border: '1px solid rgba(168, 85, 247, 0.4)', borderRadius: '20px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--purple-neon, #a855f7)', color: '#fff', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
            <Shield size={14} /> Control de Acceso y Niveles de Seguridad (RBAC)
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff' }}>Gestión de Cuentas de Usuario</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Asigna y administra roles: Administrador, Empresario (Dueño), Gerente y Cajero con permisos específicos en la isla Andamar.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="touch-btn"
          style={{
            display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 22px', borderRadius: '14px',
            background: 'var(--primary-gradient)', color: '#fff', fontWeight: 800, fontSize: '0.95rem',
            border: 'none', boxShadow: 'var(--shadow-glow)'
          }}
        >
          <UserPlus size={20} /> Nuevo Usuario
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid var(--green-emerald)', color: '#fff', padding: '12px 18px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={18} color="var(--green-emerald)" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Role Summary Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
        {Object.entries(ROLE_PERMISSIONS).map(([key, perm]) => (
          <div key={key} className="glass-panel" style={{ padding: '16px', borderRadius: '14px', border: `1px solid ${perm.badgeColor}40` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: '8px', background: perm.badgeBg, color: perm.badgeColor }}>
                {perm.label}
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              {perm.description}
            </p>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="glass-panel" style={{ borderRadius: '20px', padding: '20px', border: '1px solid var(--border-light)' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={20} color="var(--tropical-yellow)" /> Cuentas Registradas en el Sistema ({userList.length})
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 16px' }}>Usuario</th>
                <th style={{ padding: '12px 16px' }}>Nombre Completo</th>
                <th style={{ padding: '12px 16px' }}>Rol / Nivel</th>
                <th style={{ padding: '12px 16px' }}>PIN de Caja</th>
                <th style={{ padding: '12px 16px' }}>Estado</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {userList.map(u => {
                const perm = ROLE_PERMISSIONS[u.role] || ROLE_PERMISSIONS.cajero;
                const isCurrent = currentUser?.id === u.id;
                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', background: isCurrent ? 'rgba(255, 183, 3, 0.05)' : 'transparent' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.4rem' }}>{u.avatar || '🍧'}</span>
                        <div>
                          <strong style={{ color: '#fff', fontSize: '0.95rem' }}>@{u.username}</strong>
                          {isCurrent && <span style={{ marginLeft: '8px', fontSize: '0.65rem', background: 'var(--tropical-yellow)', color: '#000', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>TÚ</span>}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#fff', fontSize: '0.9rem' }}>
                      {u.name}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ 
                        fontSize: '0.75rem', fontWeight: 800, padding: '4px 10px', borderRadius: '8px',
                        background: perm.badgeBg, color: perm.badgeColor, border: `1px solid ${perm.badgeColor}40`
                      }}>
                        {perm.label}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      •••• ({u.pin})
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className="touch-btn"
                        style={{
                          padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800, border: 'none',
                          background: u.active !== false ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          color: u.active !== false ? 'var(--green-emerald)' : '#ef4444'
                        }}
                      >
                        {u.active !== false ? '● Activo' : '○ Inactivo'}
                      </button>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="touch-btn"
                          style={{ padding: '8px 12px', background: 'var(--bg-card-hover)', color: '#fff', borderRadius: '8px', border: '1px solid var(--border-light)' }}
                          title="Modificar Usuario"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u)}
                          className="touch-btn"
                          style={{ padding: '8px 12px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                          title="Eliminar Cuenta"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', background: 'var(--bg-card)', borderRadius: '24px', padding: '28px', border: '1px solid var(--border-light)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fff' }}>
                {editingUser ? 'Modificar Cuenta de Usuario' : 'Crear Nueva Cuenta'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
            </div>

            {errorMsg && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fff', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} color="#ef4444" /> {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Avatar Selector */}
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Avatar / Emoji Identificador</label>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
                  {AVATAR_OPTIONS.map(av => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setForm({ ...form, avatar: av })}
                      style={{
                        fontSize: '1.4rem', padding: '8px', borderRadius: '10px', cursor: 'pointer',
                        background: form.avatar === av ? 'var(--primary-gradient)' : 'var(--bg-dark)',
                        border: form.avatar === av ? '2px solid var(--tropical-yellow)' : '1px solid var(--border-light)'
                      }}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Nombre Completo</label>
                <input
                  type="text"
                  placeholder="Ej. Carlos Mendoza"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border-light)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Nombre de Usuario (Login)</label>
                <input
                  type="text"
                  placeholder="Ej. carlosm"
                  value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border-light)', outline: 'none' }}
                />
              </div>

              {/* Rol / Nivel */}
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Nivel de Acceso / Rol</label>
                <select
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border-light)', outline: 'none' }}
                >
                  <option value="cajero">Cajero (Solo ventas POS, recetarios y ver promos)</option>
                  <option value="gerente">Gerente (POS, Inventario, Cortes, Crear Promos, Calidad)</option>
                  <option value="empresario">Empresario / Dueño (Panel Ejecutivo, Contabilidad, KPIs, Auditorías)</option>
                  <option value="administrador">Administrador (Creador - Acceso Total y Gestión de Usuarios)</option>
                </select>
                <div style={{ fontSize: '0.75rem', color: 'var(--tropical-yellow)', marginTop: '4px' }}>
                  ℹ️ {ROLE_PERMISSIONS[form.role]?.description}
                </div>
              </div>

              {/* PIN Táctil (4 dígitos) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>PIN Rápido (4 dígitos)</label>
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="1234"
                    value={form.pin}
                    onChange={e => setForm({ ...form, pin: e.target.value.replace(/\D/g, '') })}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--bg-dark)', color: 'var(--tropical-yellow)', fontSize: '1.2rem', fontWeight: 800, textAlign: 'center', border: '1px solid var(--border-light)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Contraseña de Texto (Opcional)</label>
                  <input
                    type="text"
                    placeholder="admin123"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border-light)', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
                <input
                  type="checkbox"
                  id="userActiveCheck"
                  checked={form.active}
                  onChange={e => setForm({ ...form, active: e.target.checked })}
                  style={{ width: '18px', height: '18px' }}
                />
                <label htmlFor="userActiveCheck" style={{ color: '#fff', fontSize: '0.85rem' }}>Usuario Habilitado / Activo</label>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="touch-btn"
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', background: 'var(--bg-card-hover)', color: '#fff', border: '1px solid var(--border-light)', fontWeight: 700 }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="touch-btn"
                  style={{ flex: 2, padding: '14px', borderRadius: '12px', background: 'var(--primary-gradient)', color: '#fff', border: 'none', fontWeight: 800 }}
                >
                  {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
