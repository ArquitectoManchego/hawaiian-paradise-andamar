import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Award, RefreshCw, FileText } from 'lucide-react';

export default function MysteryShopperModule() {
  const QUESTIONS = [
    // PERSONAL
    { id: 1, category: 'Personal', text: '¿La persona que lo atendió tenía la presentación adecuada para trabajar?' },
    { id: 2, category: 'Personal', text: '¿El personal usaba playera de uniforme?' },
    { id: 3, category: 'Personal', text: '¿La persona que lo atendió usaba cofia, malla o gorra?' },
    { id: 4, category: 'Personal', text: '¿Se utilizaron guantes para elaborar los raspados?' },
    { id: 5, category: 'Personal', text: '¿La disposición y atención del personal fue adecuada?' },
    
    // LOCAL Y FACHADA
    { id: 6, category: 'Local', text: '¿La fachada del local estaba en buenas condiciones?' },
    { id: 7, category: 'Local', text: '¿Indicaba la fachada los logotipos de la Franquicia (Hawaiian / Crepizza)?' },
    { id: 8, category: 'Local', text: '¿Existía anuncio luminoso de Hawaiian Paradise en buenas condiciones?' },
    { id: 9, category: 'Local', text: '¿Existe un menú a la vista de los clientes y en buenas condiciones?' },
    { id: 10, category: 'Local', text: '¿Se encontraba la ubicación correctamente limpia e iluminada?' },
    { id: 11, category: 'Local', text: '¿El mostrador donde te atendieron está limpio y de aspecto agradable?' },
    { id: 12, category: 'Local', text: '¿El piso de la tienda estaba limpio y libre de derrames?' },
    { id: 13, category: 'Local', text: '¿La pintura del local presentaba la imagen amarillo, morado y verde?' },
    { id: 14, category: 'Local', text: '¿Se reconocía fácilmente el área de ordenar y pagar?' },

    // PRODUCTO - RASPADOS
    { id: 15, category: 'Raspados', text: '¿El vaso del raspado tenía el logotipo impreso?' },
    { id: 16, category: 'Raspados', text: '¿El raspado tenía el popote amarillo con cuchara?' },
    { id: 17, category: 'Raspados', text: '¿El vaso entregado estaba limpio y libre de derrames?' },
    { id: 18, category: 'Raspados', text: '¿El área donde se elabora estaba limpia y ordenada?' },
    { id: 19, category: 'Raspados', text: '¿El raspado recibido tenía el cono en la parte superior?' },
    { id: 20, category: 'Raspados', text: '¿Al raspado chamoicano le aplicaron chile y chamoy sobre el cono?' },
    { id: 21, category: 'Raspados', text: '¿A los raspados de leche les aplicaron leche condensada sobre el cono sin costo?' },
    { id: 22, category: 'Raspados', text: '¿Tenían disponibles todos los sabores que ofrece el menú?' },

    // PRODUCTO - CREPAS & CAFÉ & SMOOTHIES
    { id: 23, category: 'Crepas & Servicio', text: '¿Tenían encendida la crepera al momento de ordenar?' },
    { id: 24, category: 'Crepas & Servicio', text: '¿Tardaron menos de 4 minutos en despachar la crepa solicitada?' },
    { id: 25, category: 'Crepas & Servicio', text: '¿La presentación de la crepa era adecuada en cuanto a relleno?' },
    { id: 26, category: 'Crepas & Servicio', text: '¿Tenían encendida la cafetera al momento de ordenar?' },
    { id: 27, category: 'Crepas & Servicio', text: '¿Tardaron menos de 4 minutos en despachar el café solicitado?' },
    { id: 28, category: 'Crepas & Servicio', text: '¿El vaso del café tenía el logotipo impreso?' },
    { id: 29, category: 'Crepas & Servicio', text: '¿El capuchino entregado tenía buena temperatura?' },
    { id: 30, category: 'Crepas & Servicio', text: '¿Le ofrecieron agregar alguna esencia al ordenar su café?' },
    { id: 31, category: 'Crepas & Servicio', text: '¿Tenían encendida la máquina de capuchino frío con producto a la vista?' },
    { id: 32, category: 'Crepas & Servicio', text: '¿El vaso del smoothie tenía el logotipo impreso y popote amarillo?' },
  ];

  const [answers, setAnswers] = useState({});
  const [evaluatorName, setEvaluatorName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleToggle = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const answeredCount = Object.keys(answers).length;
  const yesCount = Object.values(answers).filter((v) => v === true).length;
  const score = answeredCount > 0 ? Math.round((yesCount / QUESTIONS.length) * 100) : 0;

  return (
    <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* HEADER BANNER */}
      <div style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(0, 242, 254, 0.2))', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '20px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--green-emerald)', color: '#000', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
            <Award size={14} /> Auditoría Oficial de Calidad HP
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#fff' }}>Evaluación Mystery Shopper — HP Andamar</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            Formulario estandarizado de 32 puntos para control de excelencia en personal, local y producto.
          </p>
        </div>

        {/* CALIFICACIÓN EN TIEMPO REAL */}
        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '16px 24px', borderRadius: '16px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Puntaje de Calidad</div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: score >= 90 ? 'var(--green-emerald)' : score >= 75 ? 'var(--tropical-yellow)' : '#ef4444' }}>
            {score}%
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {yesCount} de {QUESTIONS.length} Cumplidos
          </div>
        </div>
      </div>

      {/* FORMULARIO */}
      {!isSubmitted ? (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', border: '1px solid var(--border-light)' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Nombre del Evaluador / Supervisor:</label>
            <input
              type="text"
              placeholder="Ej. Supervisor de Isla Andamar"
              value={evaluatorName}
              onChange={(e) => setEvaluatorName(e.target.value)}
              style={{ width: '100%', maxWidth: '400px', padding: '12px', borderRadius: '10px', background: 'var(--bg-dark)', color: '#fff', border: '1px solid var(--border-light)' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {QUESTIONS.map((q) => {
              const val = answers[q.id];
              return (
                <div
                  key={q.id}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '12px',
                    background: val === true ? 'rgba(16, 185, 129, 0.08)' : val === false ? 'rgba(239, 68, 68, 0.08)' : 'var(--bg-dark)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    gap: '16px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, background: 'rgba(255, 255, 255, 0.1)', color: 'var(--tropical-yellow)', padding: '2px 8px', borderRadius: '6px' }}>
                      {q.category}
                    </span>
                    <p style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff', marginTop: '4px' }}>
                      {q.id}. {q.text}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleToggle(q.id, true)}
                      className="touch-btn"
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: val === true ? 'var(--green-emerald)' : 'var(--bg-card-hover)',
                        color: '#fff',
                        fontWeight: 700,
                        border: 'none',
                        fontSize: '0.8rem'
                      }}
                    >
                      SÍ
                    </button>
                    <button
                      onClick={() => handleToggle(q.id, false)}
                      className="touch-btn"
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        background: val === false ? '#ef4444' : 'var(--bg-card-hover)',
                        color: '#fff',
                        fontWeight: 700,
                        border: 'none',
                        fontSize: '0.8rem'
                      }}
                    >
                      NO
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setIsSubmitted(true)}
            disabled={answeredCount < QUESTIONS.length}
            className="touch-btn"
            style={{
              marginTop: '24px',
              width: '100%',
              padding: '16px',
              borderRadius: '14px',
              background: answeredCount === QUESTIONS.length ? 'var(--primary-gradient)' : 'var(--bg-card-hover)',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 800,
              border: 'none'
            }}
          >
            {answeredCount === QUESTIONS.length ? 'Guardar Reporte de Auditoría' : `Responde todos los ítems (${answeredCount}/${QUESTIONS.length})`}
          </button>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '36px', borderRadius: '24px', textAlign: 'center', border: '1px solid var(--green-emerald)', background: 'rgba(16, 185, 129, 0.1)' }}>
          <CheckCircle2 size={56} color="var(--green-emerald)" style={{ margin: '0 auto 16px auto' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff' }}>¡Auditoría Mystery Shopper Registrada!</h3>
          <p style={{ fontSize: '1rem', color: 'var(--tropical-yellow)', marginTop: '8px', fontWeight: 700 }}>
            Calificación Final: {score}% — {score >= 90 ? 'Excelente (Estándar Franquicia Cumplido)' : 'Requiere Atención en Puntos Faltantes'}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Evaluador: {evaluatorName || 'Supervisor General'}
          </p>
          <button
            onClick={() => { setIsSubmitted(false); setAnswers({}); setEvaluatorName(''); }}
            className="touch-btn"
            style={{ marginTop: '24px', padding: '12px 24px', borderRadius: '10px', background: 'var(--primary-gradient)', color: '#fff', fontWeight: 800, border: 'none' }}
          >
            Realizar Nueva Evaluación
          </button>
        </div>
      )}

    </div>
  );
}
