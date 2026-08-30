interface EmptyStateProps {
  onClearFilters: () => void;
}

export default function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div style={{
      textAlign: 'center',
      padding: '4rem 1rem',
      color: 'var(--muted)',
    }}>
      <svg 
        width="64" 
        height="64" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5"
        style={{ marginBottom: '1rem', opacity: 0.5 }}
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--ink)', marginBottom: '0.5rem' }}>
        Nenhum imóvel corresponde aos filtros.
      </h3>
      <p style={{ marginBottom: '1.5rem' }}>
        Tente ampliar a faixa de preço ou remover algum critério.
      </p>
      <button
        onClick={onClearFilters}
        style={{
          background: 'var(--navy)',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '6px',
          fontWeight: '600',
          fontSize: '0.875rem',
        }}
      >
        Limpar filtros
      </button>
    </div>
  );
}
