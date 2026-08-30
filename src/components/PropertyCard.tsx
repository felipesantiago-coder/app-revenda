import { Property } from '../types';
import { formatCurrency, formatArea } from '../formatters';

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onViewDetails: () => void;
}

const categoryIcons: Record<string, React.JSX.Element> = {
  Apartamento: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  ),
  Casa: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  Comercial: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  Flat: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  ),
  Lote: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" />
    </svg>
  ),
  Outro: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
};

export default function PropertyCard({ property, isFavorite, onToggleFavorite, onViewDetails }: PropertyCardProps) {
  return (
    <article
      style={{
        background: 'var(--surface)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'box-shadow 0.2s, transform 0.2s',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{
        background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 100%)',
        padding: '1rem',
        color: 'white',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{
            background: 'var(--cyan)',
            color: 'var(--navy)',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase',
          }}>
            {categoryIcons[property.category] || categoryIcons.Outro}
            <span style={{ marginLeft: '0.25rem' }}>{property.category}</span>
          </span>
          <button
            onClick={onToggleFavorite}
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            aria-pressed={isFavorite}
            style={{
              background: 'transparent',
              border: 'none',
              color: isFavorite ? '#e57373' : 'rgba(255,255,255,0.7)',
              cursor: 'pointer',
              padding: '0.25rem',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
        <p style={{ marginTop: '0.5rem', fontSize: '0.75rem', opacity: 0.8 }}>
          {property.code}
        </p>
      </div>

      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--muted)', fontSize: '0.875rem' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {property.region}
        </div>

        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--ink)', marginBottom: '0.5rem' }}>
          {property.name}
        </h3>

        <p style={{ 
          fontSize: '0.875rem', 
          color: 'var(--muted)', 
          marginBottom: '0.75rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {property.address}
        </p>

        <p style={{ 
          fontSize: '1.25rem', 
          fontWeight: '700', 
          color: 'var(--navy)',
          marginBottom: '0.5rem',
        }}>
          {formatCurrency(property.price)}
        </p>

        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '0.75rem' }}>
          <span>{formatArea(property.area)}</span>
          {property.bedrooms && (
            <span>{property.bedrooms} {property.bedrooms === 1 ? 'quarto' : 'quartos'}</span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
          {property.acceptsFinancing && (
            <span style={{
              background: '#e8f5e9',
              color: '#2e7d32',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: '500',
            }}>
              Financiamento
            </span>
          )}
          {property.acceptsFgts && (
            <span style={{
              background: '#e3f2fd',
              color: '#1976d2',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: '500',
            }}>
              FGTS
            </span>
          )}
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '1rem' }}>
          <span style={{ fontWeight: '500' }}>Captador:</span> {property.captor}
        </p>

        <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={onViewDetails}
            style={{
              flex: 1,
              background: 'var(--navy)',
              color: 'white',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '0.875rem',
            }}
          >
            Ver detalhes
          </button>
          {property.url ? (
            <a
              href={property.url}
              target="_blank"
              rel="noreferrer"
              style={{
                background: 'var(--cyan)',
                color: 'var(--navy)',
                border: 'none',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '0.875rem',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Anúncio
            </a>
          ) : (
            <span style={{
              background: 'var(--line)',
              color: 'var(--muted)',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              cursor: 'not-allowed',
            }}>
              Sem link
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
