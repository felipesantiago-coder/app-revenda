interface IntroProps {
  propertiesCount: number;
  regionsCount: number;
  linksCount: number;
}

export default function Intro({ propertiesCount, regionsCount, linksCount }: IntroProps) {
  return (
    <section style={{ padding: '2rem 0' }}>
      <p style={{ 
        fontSize: '0.75rem', 
        fontWeight: '600', 
        color: 'var(--cyan)', 
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '0.5rem',
      }}>
        BUSCA DE IMÓVEIS
      </p>
      <h1 style={{ 
        fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
        fontWeight: '700', 
        color: 'var(--ink)',
        marginBottom: '0.5rem',
      }}>
        Encontre a opção certa em poucos segundos.
      </h1>
      <p style={{ 
        fontSize: '1rem', 
        color: 'var(--muted)', 
        maxWidth: '600px',
        marginBottom: '1.5rem',
      }}>
        Consulte a carteira atualizada, refine os resultados e acesse cada anúncio sem percorrer páginas de tabela.
      </p>
      
      <div style={{ 
        display: 'flex', 
        gap: '2rem', 
        flexWrap: 'wrap',
        marginBottom: '1rem',
      }}>
        <div>
          <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--navy)' }}>{propertiesCount}</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--muted)', marginLeft: '0.5rem' }}>imóveis</span>
        </div>
        <div>
          <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--navy)' }}>{regionsCount}</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--muted)', marginLeft: '0.5rem' }}>regiões</span>
        </div>
        <div>
          <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--navy)' }}>{linksCount}</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--muted)', marginLeft: '0.5rem' }}>anúncios</span>
        </div>
      </div>
    </section>
  );
}
