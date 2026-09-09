import React, { useState, useEffect, useRef } from 'react';
import { SinglyLinkedList } from '../estructuras/SinglyLinkedList';
import { DoublyLinkedList } from '../estructuras/DoublyLinkedList';
import { CircularLinkedList } from '../estructuras/CircularLinkedList';
import { DoublyCircularLinkedList } from '../estructuras/DoublyCircularLinkedList';

export default function ClinicaDashboard() {
  const pacientesList = useRef(new SinglyLinkedList());
  const historialList = useRef(new DoublyLinkedList());
  const medicosList = useRef(new CircularLinkedList());
  const comiteList = useRef(new DoublyCircularLinkedList());

  const [pacientes, setPacientes] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [medicoActual, setMedicoActual] = useState('');
  const [comite, setComite] = useState([]);
  const [nuevoPaciente, setNuevoPaciente] = useState('');

  useEffect(() => {
    ['Dr. García (General)', 'Dra. López (Pediatría)', 'Dr. Martínez (Urgencias)'].forEach(m => medicosList.current.append(m));
    ['Director Alfa', 'Vicedirector Beta', 'Tesorero Gamma'].forEach(c => comiteList.current.append(c));

    setMedicoActual(medicosList.current.getMedicoActual());
    setComite(comiteList.current.toArray());

    const interval = setInterval(() => {
      const nuevoMedico = medicosList.current.rotar();
      setMedicoActual(nuevoMedico);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const agregarPaciente = (e) => {
    e.preventDefault();
    if (!nuevoPaciente.trim()) return;
    pacientesList.current.append(nuevoPaciente);
    setPacientes(pacientesList.current.toArray());
    setNuevoPaciente('');
  };

  const atenderPaciente = () => {
    const atendido = pacientesList.current.removerPrimero();
    if (atendido) {
      const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const registro = { paciente: atendido, medico: medicoActual, hora };
      historialList.current.append(registro);
      setPacientes(pacientesList.current.toArray());
      setHistorial(historialList.current.toArray());
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🏥 Panel de Gestión Clínica</h1>
        <p style={styles.subtitle}>Sistema de colas y turnos en tiempo real</p>
      </header>

      {/* Tarjeta Destacada: Médico de Guardia */}
      <div style={styles.bannerCard}>
        <div>
          <span style={styles.badge}>Lista Circular</span>
          <h2 style={styles.bannerTitle}>👨‍⚕️ Médico de Guardia Actual</h2>
          <p style={styles.doctorName}>{medicoActual}</p>
        </div>
        <div style={styles.timerBadge}>
          <span style={styles.liveDot}></span> Rotación automática (10s)
        </div>
      </div>

      <div style={styles.grid}>
        {/* Pacientes en Espera */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTag}>Lista Enlazada Simple</span>
            <h3 style={styles.cardTitle}>⏳ Pacientes en Espera ({pacientes.length})</h3>
          </div>

          <form onSubmit={agregarPaciente} style={styles.form}>
            <input 
              type="text"
              value={nuevoPaciente} 
              onChange={(e) => setNuevoPaciente(e.target.value)} 
              placeholder="Nombre del paciente..."
              style={styles.input}
            />
            <button type="submit" style={styles.btnPrimary}>+ Agregar</button>
          </form>

          <button 
            onClick={atenderPaciente} 
            disabled={pacientes.length === 0}
            style={pacientes.length === 0 ? styles.btnDisabled : styles.btnSuccess}
          >
            📋 Atender Siguiente Paciente
          </button>

          <div style={styles.listContainer}>
            {pacientes.length === 0 ? (
              <p style={styles.emptyText}>No hay pacientes en cola.</p>
            ) : (
              pacientes.map((p, i) => (
                <div key={i} style={styles.patientItem}>
                  <span style={styles.queueNumber}>#{i + 1}</span>
                  <span style={styles.itemText}>{p}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Historial de Atención */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTag}>Lista Doblemente Enlazada</span>
            <h3 style={styles.cardTitle}>📜 Historial de Atención</h3>
          </div>

          <div style={styles.listContainer}>
            {historial.length === 0 ? (
              <p style={styles.emptyText}>Sin atenciones registradas.</p>
            ) : (
              historial.map((h, i) => (
                <div key={i} style={styles.historyItem}>
                  <div>
                    <strong>{h.paciente}</strong>
                    <div style={styles.historySub}>Atendido por: {h.medico}</div>
                  </div>
                  <span style={styles.timeTag}>{h.hora}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Comité Administrativo */}
      <div style={{ ...styles.card, marginTop: '20px' }}>
        <div style={styles.cardHeader}>
          <span style={styles.cardTag}>Lista Circular Doble</span>
          <h3 style={styles.cardTitle}>👥 Comité Administrativo</h3>
        </div>
        <div style={styles.comiteGrid}>
          {comite.map((member, i) => (
            <div key={i} style={styles.comiteChip}>
              👤 {member}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  header: {
    marginBottom: '25px',
  },
  title: {
    color: '#1e293b',
    fontSize: '28px',
    fontWeight: '700',
  },
  subtitle: {
    color: '#64748b',
    fontSize: '14px',
    marginTop: '4px',
  },
  bannerCard: {
    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    color: '#ffffff',
    padding: '24px',
    borderRadius: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
    boxShadow: '0 10px 15px -3px rgba(2, 132, 199, 0.25)',
  },
  badge: {
    background: 'rgba(255, 255, 255, 0.2)',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  bannerTitle: {
    fontSize: '18px',
    marginTop: '8px',
    fontWeight: '500',
  },
  doctorName: {
    fontSize: '26px',
    fontWeight: 'bold',
    marginTop: '4px',
  },
  timerBadge: {
    background: '#ffffff',
    color: '#0369a1',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  liveDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
  },
  cardHeader: {
    marginBottom: '15px',
  },
  cardTag: {
    color: '#0284c7',
    fontSize: '12px',
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: '18px',
    color: '#0f172a',
    marginTop: '2px',
  },
  form: {
    display: 'flex',
    gap: '8px',
    marginBottom: '12px',
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    outline: 'none',
    fontSize: '14px',
  },
  btnPrimary: {
    backgroundColor: '#0284c7',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnSuccess: {
    width: '100%',
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '15px',
  },
  btnDisabled: {
    width: '100%',
    backgroundColor: '#e2e8f0',
    color: '#94a3b8',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'not-allowed',
    marginBottom: '15px',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '220px',
    overflowY: 'auto',
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: '14px',
    fontStyle: 'italic',
  },
  patientItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #f1f5f9',
  },
  queueNumber: {
    backgroundColor: '#e0f2fe',
    color: '#0369a1',
    fontSize: '12px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '6px',
  },
  itemText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#334155',
  },
  historyItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    borderLeft: '4px solid #10b981',
  },
  historySub: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '2px',
  },
  timeTag: {
    fontSize: '12px',
    color: '#94a3b8',
    fontWeight: '500',
  },
  comiteGrid: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    marginTop: '10px',
  },
  comiteChip: {
    backgroundColor: '#f1f5f9',
    color: '#334155',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    border: '1px solid #e2e8f0',
  },
};