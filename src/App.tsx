import { useState, useEffect, useMemo, useCallback } from 'react';
import seedProperties from '../app/data/properties.json';
import { Property, CatalogSnapshot } from './types';
import { getActiveSnapshot } from './catalogRepository';
import { getFavorites, toggleFavorite } from './useFavorites';
import { normalizeSearch } from './utils';
import Header from './components/Header';
import Intro from './components/Intro';
import SearchFilters from './components/SearchFilters';
import PropertyCard from './components/PropertyCard';
import PropertyDetailsModal from './components/PropertyDetailsModal';
import EmptyState from './components/EmptyState';
import PdfImportDialog from './components/PdfImportDialog';

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

const initialFilters: FilterState = {
  search: '',
  region: '',
  category: '',
  bedrooms: '',
  minPrice: '',
  maxPrice: '',
  minArea: '',
  maxArea: '',
  captor: '',
  onlyFinancing: false,
  onlyFgts: false,
  onlyFavorites: false,
};

function App() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [snapshot, setSnapshot] = useState<CatalogSnapshot | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [sortOption, setSortOption] = useState<SortOption>('item');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    async function loadData() {
      // Load favorites
      const favs = getFavorites();
      setFavorites(favs);

      // Try to load active snapshot from IndexedDB
      const activeSnapshot = await getActiveSnapshot();
      
      if (activeSnapshot) {
        setSnapshot(activeSnapshot);
        setProperties(activeSnapshot.properties);
      } else {
        // Use seed data
        const seedProps = seedProperties as Property[];
        const seedSnapshot: CatalogSnapshot = {
          id: 'seed',
          schemaVersion: 1,
          source: 'seed',
          sourceFileName: 'properties.json',
          importedAt: new Date().toISOString(),
          sourceDate: '21/08/2026',
          contentHash: 'seed-hash',
          properties: seedProps,
          summary: {
            total: seedProps.length,
            regions: new Set(seedProps.map(p => p.region)).size,
            links: seedProps.filter(p => p.url).length,
            warnings: 0,
          },
        };
        setSnapshot(seedSnapshot);
        setProperties(seedProps);
      }
      
      setIsLoaded(true);
    }
    
    loadData();
  }, []);

  // Get unique values for filters
  const regions = useMemo(() => {
    return Array.from(new Set(properties.map(p => p.region))).sort((a, b) => 
      a.localeCompare(b, 'pt-BR')
    );
  }, [properties]);

  const categories = useMemo(() => {
    return Array.from(new Set(properties.map(p => p.category))).sort((a, b) => 
      a.localeCompare(b, 'pt-BR')
    );
  }, [properties]);

  const captors = useMemo(() => {
    return Array.from(new Set(properties.map(p => p.captor))).sort((a, b) => 
      a.localeCompare(b, 'pt-BR')
    );
  }, [properties]);

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let result = [...properties];

    // Text search
    if (filters.search) {
      const normalizedSearch = normalizeSearch(filters.search);
      result = result.filter(p => {
        const searchable = `${p.code} ${p.name} ${p.region} ${p.address} ${p.captor}`;
        return normalizeSearch(searchable).includes(normalizedSearch);
      });
    }

    // Region filter
    if (filters.region) {
      result = result.filter(p => p.region === filters.region);
    }

    // Category filter
    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }

    // Bedrooms filter
    if (filters.bedrooms) {
      const bedroomsNum = parseInt(filters.bedrooms, 10);
      result = result.filter(p => p.bedrooms === bedroomsNum);
    }

    // Captor filter
    if (filters.captor) {
      result = result.filter(p => p.captor === filters.captor);
    }

    // Financing filter
    if (filters.onlyFinancing) {
      result = result.filter(p => p.acceptsFinancing);
    }

    // FGTS filter
    if (filters.onlyFgts) {
      result = result.filter(p => p.acceptsFgts);
    }

    // Favorites filter
    if (filters.onlyFavorites) {
      result = result.filter(p => favorites.has(p.code));
    }

    // Price range
    if (filters.minPrice) {
      const min = parseFloat(filters.minPrice);
      result = result.filter(p => p.price !== null && p.price >= min);
    }
    if (filters.maxPrice) {
      const max = parseFloat(filters.maxPrice);
      result = result.filter(p => p.price !== null && p.price <= max);
    }

    // Area range
    if (filters.minArea) {
      const min = parseFloat(filters.minArea);
      result = result.filter(p => p.area !== null && p.area >= min);
    }
    if (filters.maxArea) {
      const max = parseFloat(filters.maxArea);
      result = result.filter(p => p.area !== null && p.area <= max);
    }

    // Sort
    switch (sortOption) {
      case 'item':
        result.sort((a, b) => a.item - b.item);
        break;
      case 'price-asc':
        result.sort((a, b) => {
          if (a.price === null && b.price === null) return 0;
          if (a.price === null) return 1;
          if (b.price === null) return -1;
          return a.price - b.price;
        });
        break;
      case 'price-desc':
        result.sort((a, b) => {
          if (a.price === null && b.price === null) return 0;
          if (a.price === null) return 1;
          if (b.price === null) return -1;
          return b.price - a.price;
        });
        break;
      case 'area-desc':
        result.sort((a, b) => {
          if (a.area === null && b.area === null) return 0;
          if (a.area === null) return 1;
          if (b.area === null) return -1;
          return b.area - a.area;
        });
        break;
      case 'price-per-sqm':
        result.sort((a, b) => {
          const aVal = a.price && a.area ? a.price / a.area : Infinity;
          const bVal = b.price && b.area ? b.price / b.area : Infinity;
          return aVal - bVal;
        });
        break;
    }

    return result;
  }, [properties, filters, sortOption, favorites]);

  const handleToggleFavorite = useCallback((code: string) => {
    setFavorites(prev => toggleFavorite(code, prev));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  const hasFilters = useMemo(() => {
    return (
      filters.search !== '' ||
      filters.region !== '' ||
      filters.category !== '' ||
      filters.bedrooms !== '' ||
      filters.minPrice !== '' ||
      filters.maxPrice !== '' ||
      filters.minArea !== '' ||
      filters.maxArea !== '' ||
      filters.captor !== '' ||
      filters.onlyFinancing ||
      filters.onlyFgts ||
      filters.onlyFavorites
    );
  }, [filters]);

  if (!isLoaded || !snapshot) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Carregando...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--canvas)' }}>
      <Header
        snapshot={snapshot}
        onImportClick={() => setShowImportDialog(true)}
      />
      
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
        <Intro
          propertiesCount={snapshot.summary.total}
          regionsCount={snapshot.summary.regions}
          linksCount={snapshot.summary.links}
        />
        
        <SearchFilters
          filters={filters}
          onFiltersChange={setFilters}
          regions={regions}
          categories={categories}
          captors={captors}
          favoritesCount={favorites.size}
          onClearFilters={handleClearFilters}
          hasFilters={hasFilters}
          sortOption={sortOption}
          onSortChange={setSortOption}
          resultsCount={filteredProperties.length}
        />
        
        {filteredProperties.length === 0 ? (
          <EmptyState onClearFilters={handleClearFilters} />
        ) : (
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '1.5rem',
              padding: '1.5rem 0',
            }}
            role="list"
            aria-live="polite"
          >
            {filteredProperties.map(property => (
              <PropertyCard
                key={property.code}
                property={property}
                isFavorite={favorites.has(property.code)}
                onToggleFavorite={() => handleToggleFavorite(property.code)}
                onViewDetails={() => setSelectedProperty(property)}
              />
            ))}
          </div>
        )}
      </main>

      {selectedProperty && (
        <PropertyDetailsModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          isFavorite={favorites.has(selectedProperty.code)}
          onToggleFavorite={() => handleToggleFavorite(selectedProperty.code)}
        />
      )}

      {showImportDialog && (
        <PdfImportDialog
          onClose={() => setShowImportDialog(false)}
          currentProperties={properties}
          onUpdateSnapshot={(newSnapshot: CatalogSnapshot) => {
            setSnapshot(newSnapshot);
            setProperties(newSnapshot.properties);
            setShowImportDialog(false);
          }}
        />
      )}
    </div>
  );
}

export default App;
