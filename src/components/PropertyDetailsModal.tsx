import { Property } from '../types';
import { formatCurrency, formatArea, formatPricePerSqm, formatOptionalNumber } from '../formatters';

interface PropertyDetailsModalProps {
  property: Property;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function PropertyDetailsModal({ property, onClose, isFavorite, onToggleFavorite }: PropertyDetailsModalProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        zIndex: 1000,
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: '12px',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          background: 'linear-gradient(135deg, var(--navy) 0%, var(--navy-2) 100%)',
          padding: '1.5rem',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div>
            <span style={{
              background: 'var(--cyan)',
              color: 'var(--navy)',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: '600',
              textTransform: 'uppercase',
            }}>
              {property.category}
            </span>
            <h2 id="modal-title" style={{ fontSize: '1.5rem', fontWeight: '700', marginTop: '0.5rem' }}>
              {property.name}
            </h2>
            <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>{property.code} • {property.region}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={onToggleFavorite}
              aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              aria-pressed={isFavorite}
              style={{
                background: 'transparent',
                border: 'none',
                color: isFavorite ? '#e57373' : 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                padding: '0.5rem',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            <button
              onClick={onClose}
              aria-label="Fechar"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '0.5rem',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--navy)', marginBottom: '0.25rem' }}>
              {formatCurrency(property.price)}
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>
              Valor por m²: {formatPricePerSqm(property.price, property.area)}
            </p>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem',
            marginBottom: '1.5rem',
            padding: '1rem',
            background: 'var(--canvas)',
            borderRadius: '8px',
          }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>Área privativa</p>
              <p style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--ink)' }}>{formatArea(property.area)}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>Tipologia</p>
              <p style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--ink)' }}>{property.typology}</p>
            </div>
            {property.bedrooms && (
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>Quartos</p>
                <p style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--ink)' }}>{property.bedrooms}</p>
              </div>
            )}
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>Condomínio</p>
              <p style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--ink)' }}>{formatOptionalNumber(property.condo)}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>IPTU</p>
              <p style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--ink)' }}>{formatOptionalNumber(property.iptu)}</p>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--ink)', marginBottom: '0.5rem' }}>Endereço</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{property.address}</p>
          </div>

          {(property.acceptsFinancing || property.acceptsFgts) && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--ink)', marginBottom: '0.5rem' }}>Condições</h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {property.acceptsFinancing && (
                  <span style={{
                    background: '#e8f5e9',
                    color: '#2e7d32',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                  }}>
                    Aceita financiamento
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
                    Aceita FGTS
                  </span>
                )}
              </div>
            </div>
          )}

          {property.notes && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--ink)', marginBottom: '0.5rem' }}>Observações</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{property.notes}</p>
            </div>
          )}

          {property.dataNote && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--ink)', marginBottom: '0.5rem' }}>Nota</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{property.dataNote}</p>
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--ink)', marginBottom: '0.5rem' }}>Captador / Equipe</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{property.captor}</p>
            <p style={{ fontSize: '0.875rem', color: 'var(--muted)', marginTop: '0.25rem' }}>{property.appointment}</p>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <a
              href={`tel:+55${property.phoneDigits}`}
              style={{
                flex: 1,
                minWidth: '140px',
                background: 'var(--navy)',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '0.875rem',
                textDecoration: 'none',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Ligar
            </a>
            <a
              href={`https://wa.me/55${property.phoneDigits}?text=${encodeURIComponent(`Olá! Gostaria de informações sobre o imóvel ${property.name}, código ${property.code}.`)}`}
              target="_blank"
              rel="noreferrer"
              style={{
                flex: 1,
                minWidth: '140px',
                background: '#25D366',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '0.875rem',
                textDecoration: 'none',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              WhatsApp
            </a>
            {property.url && (
              <a
                href={property.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  flex: 1,
                  minWidth: '140px',
                  background: 'var(--cyan)',
                  color: 'var(--navy)',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Anúncio
              </a>
            )}
            <button
              onClick={async () => {
                const shareData = {
                  title: property.name,
                  text: `${property.name} (${property.code}) — ${property.typology.toLowerCase()}, ${formatArea(property.area)}, ${formatCurrency(property.price)}, em ${property.region}.`,
                  url: property.url || window.location.href,
                };
                
                if (navigator.share) {
                  try {
                    await navigator.share(shareData);
                  } catch (e) {
                    // User cancelled or error
                  }
                } else {
                  try {
                    await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                  } catch (e) {
                    // Failed to copy
                  }
                }
              }}
              style={{
                flex: 1,
                minWidth: '140px',
                background: 'var(--line)',
                color: 'var(--ink)',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Compartilhar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
