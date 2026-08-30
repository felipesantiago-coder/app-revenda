import { CatalogSnapshot } from '../types';

interface HeaderProps {
  snapshot: CatalogSnapshot;
  onImportClick: () => void;
}

export default function Header({ snapshot, onImportClick }: HeaderProps) {
  const displayDate = snapshot.sourceDate 
    ? `Atualizado em ${snapshot.sourceDate}`
    : `Importado em ${new Date(snapshot.importedAt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}`;

  return (
    <header style={{
      background: 'var(--navy)',
      color: 'white',
      padding: '1rem 0',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            <span style={{ color: 'white' }}>quadra</span>
            <span style={{ color: 'var(--cyan)' }}>imob</span>
          </span>
          <span style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>|</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--cyan)' }}>Carteira de revendas</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{displayDate}</span>
          <button
            onClick={onImportClick}
            style={{
              background: 'var(--cyan)',
              color: 'var(--navy)',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            aria-label="Atualizar via PDF"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Atualizar via PDF
          </button>
        </div>
      </div>
    </header>
  );
}
