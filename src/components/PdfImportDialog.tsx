import React, { useState } from 'react';
import { CatalogSnapshot, Property } from '../types';

interface PdfImportDialogProps {
  onClose: () => void;
  currentProperties: Property[];
  onUpdateSnapshot: (snapshot: CatalogSnapshot) => void;
}

export default function PdfImportDialog({ 
  onClose, 
  currentProperties, 
  onUpdateSnapshot 
}: PdfImportDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Simulação de processamento - em produção, aqui seria a lógica real de parsing do PDF
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Para demonstração, mantém os mesmos dados
      const snapshot: CatalogSnapshot = {
        id: `import-${Date.now()}`,
        schemaVersion: 1,
        source: 'pdf',
        sourceFileName: file.name,
        importedAt: new Date().toISOString(),
        sourceDate: new Date().toLocaleDateString('pt-BR'),
        contentHash: `hash-${Date.now()}`,
        properties: currentProperties,
        summary: {
          total: currentProperties.length,
          regions: new Set(currentProperties.map(p => p.region)).size,
          links: currentProperties.filter(p => p.url).length,
          warnings: 0,
        },
      };
      
      onUpdateSnapshot(snapshot);
    } catch (err) {
      setError('Erro ao processar o arquivo. Tente novamente.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'var(--surface)',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '500px',
          width: '90%',
          boxShadow: 'var(--shadow)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Importar Catálogo PDF
        </h2>
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Selecione o arquivo PDF do catálogo de imóveis para importar os dados.
        </p>

        {error && (
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
            color: '#dc2626',
            fontSize: '0.875rem',
          }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: '1.5rem' }}>
          <label 
            style={{
              display: 'block',
              padding: '2rem',
              border: '2px dashed var(--border)',
              borderRadius: '8px',
              textAlign: 'center',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: isProcessing ? 0.6 : 1,
            }}
          >
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              disabled={isProcessing}
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📄</div>
            <div style={{ fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              {isProcessing ? 'Processando...' : 'Clique para selecionar o PDF'}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {isProcessing ? 'Aguarde...' : 'ou arraste o arquivo aqui'}
            </div>
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            onClick={onClose}
            disabled={isProcessing}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.6 : 1,
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
