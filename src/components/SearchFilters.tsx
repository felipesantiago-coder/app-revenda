type SortOption = 'item' | 'price-asc' | 'price-desc' | 'area-desc' | 'price-per-sqm';

interface FilterState {
  search: string;
  region: string;
  category: string;
  bedrooms: string;
  minPrice: string;
  maxPrice: string;
  minArea: string;
  maxArea: string;
  captor: string;
  onlyFinancing: boolean;
  onlyFgts: boolean;
  onlyFavorites: boolean;
}

interface SearchFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  regions: string[];
  categories: string[];
  captors: string[];
  favoritesCount: number;
  onClearFilters: () => void;
  hasFilters: boolean;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  resultsCount: number;
}

export default function SearchFilters({
  filters,
  onFiltersChange,
  regions,
  categories,
  captors,
  favoritesCount,
  onClearFilters,
  hasFilters,
  sortOption,
  onSortChange,
  resultsCount,
}: SearchFiltersProps) {
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div style={{ 
      background: 'var(--surface)', 
      borderRadius: '12px', 
      padding: '1.5rem', 
      marginBottom: '1.5rem',
      boxShadow: 'var(--shadow)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          Filtros
        </h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
            <span>Ordenar por:</span>
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              style={{
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                background: 'var(--background)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              <option value="item">Número do Item</option>
              <option value="price-asc">Preço (menor primeiro)</option>
              <option value="price-desc">Preço (maior primeiro)</option>
              <option value="area-desc">Área (maior primeiro)</option>
              <option value="price-per-sqm">Preço por m² (menor primeiro)</option>
            </select>
          </label>
          
          {hasFilters && (
            <button
              onClick={onClearFilters}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                background: 'var(--primary)',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem' 
      }}>
        {/* Busca por texto */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: 500, 
            marginBottom: '0.5rem',
            color: 'var(--text-secondary)'
          }}>
            Buscar
          </label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Código, nome, endereço..."
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Região */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: 500, 
            marginBottom: '0.5rem',
            color: 'var(--text-secondary)'
          }}>
            Região
          </label>
          <select
            value={filters.region}
            onChange={(e) => updateFilter('region', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              boxSizing: 'border-box'
            }}
          >
            <option value="">Todas</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* Categoria */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: 500, 
            marginBottom: '0.5rem',
            color: 'var(--text-secondary)'
          }}>
            Categoria
          </label>
          <select
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              boxSizing: 'border-box'
            }}
          >
            <option value="">Todas</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Quartos */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: 500, 
            marginBottom: '0.5rem',
            color: 'var(--text-secondary)'
          }}>
            Quartos
          </label>
          <select
            value={filters.bedrooms}
            onChange={(e) => updateFilter('bedrooms', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              boxSizing: 'border-box'
            }}
          >
            <option value="">Qualquer</option>
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        {/* Captor */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: 500, 
            marginBottom: '0.5rem',
            color: 'var(--text-secondary)'
          }}>
            Captor
          </label>
          <select
            value={filters.captor}
            onChange={(e) => updateFilter('captor', e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              boxSizing: 'border-box'
            }}
          >
            <option value="">Todos</option>
            {captors.map(captor => (
              <option key={captor} value={captor}>{captor}</option>
            ))}
          </select>
        </div>

        {/* Preço Mínimo */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: 500, 
            marginBottom: '0.5rem',
            color: 'var(--text-secondary)'
          }}>
            Preço Mínimo (R$)
          </label>
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            placeholder="0"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Preço Máximo */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: 500, 
            marginBottom: '0.5rem',
            color: 'var(--text-secondary)'
          }}>
            Preço Máximo (R$)
          </label>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            placeholder="Ilimitado"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Área Mínima */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: 500, 
            marginBottom: '0.5rem',
            color: 'var(--text-secondary)'
          }}>
            Área Mínima (m²)
          </label>
          <input
            type="number"
            value={filters.minArea}
            onChange={(e) => updateFilter('minArea', e.target.value)}
            placeholder="0"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Área Máxima */}
        <div>
          <label style={{ 
            display: 'block', 
            fontSize: '0.875rem', 
            fontWeight: 500, 
            marginBottom: '0.5rem',
            color: 'var(--text-secondary)'
          }}>
            Área Máxima (m²)
          </label>
          <input
            type="number"
            value={filters.maxArea}
            onChange={(e) => updateFilter('maxArea', e.target.value)}
            placeholder="Ilimitada"
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--background)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div style={{ 
        display: 'flex', 
        gap: '1.5rem', 
        marginTop: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={filters.onlyFinancing}
            onChange={(e) => updateFilter('onlyFinancing', e.target.checked)}
            style={{ 
              width: '1rem', 
              height: '1rem', 
              cursor: 'pointer',
              accentColor: 'var(--primary)'
            }}
          />
          Apenas Financiamento
        </label>

        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={filters.onlyFgts}
            onChange={(e) => updateFilter('onlyFgts', e.target.checked)}
            style={{ 
              width: '1rem', 
              height: '1rem', 
              cursor: 'pointer',
              accentColor: 'var(--primary)'
            }}
          />
          Apenas FGTS
        </label>

        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={filters.onlyFavorites}
            onChange={(e) => updateFilter('onlyFavorites', e.target.checked)}
            style={{ 
              width: '1rem', 
              height: '1rem', 
              cursor: 'pointer',
              accentColor: 'var(--primary)'
            }}
          />
          Favoritos ({favoritesCount})
        </label>
      </div>

      {/* Resultados */}
      <div style={{ 
        marginTop: '1.5rem', 
        paddingTop: '1rem', 
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
        fontSize: '0.875rem',
        color: 'var(--text-secondary)'
      }}>
        <strong>{resultsCount}</strong> imóvel{resultsCount !== 1 ? 'is' : ''} encontrado{resultsCount !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
