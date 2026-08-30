# PROMPT MESTRE PARA O GLM

## Recriação integral do aplicativo “Busca de Imóveis Quadraimob” com importação direta de PDFs

Copie integralmente este documento para o GLM e anexe também o arquivo `properties.json` e o PDF original `Imóveis Revenda qb_21.08.2026.pdf`. O JSON faz parte da especificação e deve ser usado como a base inicial/fallback; o PDF original é o fixture real de regressão do extrator. Nenhum dos dois elimina a obrigação de implementar a atualização da carteira por upload de novos PDFs.

---

## 1. Papel e objetivo

Atue como engenheiro de software full-stack sênior, arquiteto de front-end, especialista em UX para sistemas imobiliários e QA engineer. Sua tarefa é recriar integralmente um aplicativo web responsivo chamado **Busca de Imóveis Quadraimob**.

Não entregue apenas layout, wireframe, protótipo visual, pseudocódigo ou componentes desconectados. Entregue uma aplicação executável, com todos os dados, estados, filtros, ordenações, favoritos, modal de detalhes, ações externas e importação de PDFs funcionando de ponta a ponta.

Referência funcional do produto existente:

- URL: `https://quadraimob-revendas.santiago-physics.chatgpt.site`
- Idioma: português do Brasil.
- Público principal: corretores de imóveis da Quadraimob.
- Tarefa principal: localizar rapidamente imóveis de revenda sem precisar consultar manualmente uma tabela PDF.
- Tarefa de atualização: permitir que o usuário selecione um PDF mais recente, revise o que foi extraído e importe imóveis novos ou alterações sem editar arquivos-fonte manualmente.
- Base inicial: 83 imóveis, 16 regiões e 81 links de anúncios.
- Data de atualização exibida: 21/08/2026.

Se estiver trabalhando em um repositório existente, primeiro audite a arquitetura, scripts, dependências e convenções. Preserve tudo o que estiver funcionando e implemente a aplicação sem substituir desnecessariamente a estrutura. Se estiver começando um projeto vazio, siga a arquitetura indicada abaixo.

Não faça perguntas de preferência visual. Implemente diretamente a especificação. Só peça esclarecimentos se houver um bloqueio técnico real que torne a execução impossível.

---

## 2. Escopo obrigatório

O aplicativo deve conter:

1. Página única de busca e exploração dos imóveis.
2. Os 83 imóveis do JSON deste documento.
3. Busca textual por código, nome, região, endereço e captador/equipe.
4. Filtros combináveis por:
   - região;
   - tipo de imóvel;
   - quantidade de quartos;
   - valor mínimo;
   - valor máximo;
   - área mínima;
   - área máxima;
   - captador/equipe;
   - aceita financiamento;
   - aceita FGTS;
   - somente favoritos.
5. Ordenação por:
   - ordem original da tabela;
   - menor preço;
   - maior preço;
   - maior área;
   - menor valor por metro quadrado.
6. Contagem dinâmica de resultados.
7. Botão para limpar todos os filtros.
8. Grade responsiva de cartões.
9. Favoritos persistidos no navegador.
10. Modal ou painel de detalhes completo.
11. Ações de ligação, WhatsApp, compartilhamento e abertura do anúncio.
12. Estado vazio quando nenhum imóvel corresponder aos filtros.
13. Metadados de SEO e cartão social.
14. Layout totalmente responsivo e acessível.
15. Botão visível `Atualizar via PDF`.
16. Extração do PDF executada dentro do próprio aplicativo, sem exigir Python, terminal ou edição manual de JSON.
17. Pré-visualização dos registros extraídos e relatório de qualidade antes de alterar a carteira ativa.
18. Comparação por código do imóvel, distinguindo registros novos, alterados, inalterados, ausentes e inválidos.
19. Modos de importação `Sincronizar carteira` e `Mesclar com a carteira atual`.
20. Persistência local da base importada após recarregar o navegador.
21. Histórico mínimo da versão ativa e da versão anterior, com opção de restauração.
22. Estados completos de seleção, processamento, revisão, confirmação, sucesso e erro.

---

## 3. Fora do escopo desta versão

Não adicione por conta própria:

- login ou cadastro;
- banco de dados remoto;
- painel administrativo;
- sincronização automática da carteira entre navegadores ou usuários diferentes;
- edição manual, campo a campo, de imóveis pela interface;
- mapas;
- fotos genéricas de imóveis;
- CRM, funil comercial ou cadastro de leads;
- paginação obrigatória;
- aplicativo nativo para lojas de aplicativos;
- integrações pagas, OCR em nuvem ou serviços dependentes de chaves externas;
- informações não presentes no JSON, como vagas, suítes, andar, posição solar ou estado de conservação.

O projeto deve funcionar apenas com arquivos locais, armazenamento do navegador e os links externos informados. A importação desta versão é local ao navegador em que o PDF for carregado. Não alegue que uma importação local atualiza automaticamente a carteira de todos os corretores.

---

## 4. Stack e arquitetura recomendadas

Se não houver stack preexistente, use:

- Next.js 16 ou versão estável compatível, com App Router.
- React 19.
- TypeScript com modo estrito.
- CSS global ou CSS Modules; Tailwind é opcional.
- `pdfjs-dist` para leitura, itens de texto e anotações de link do PDF no navegador.
- Dados iniciais em `app/data/properties.json`.
- IndexedDB nativo para snapshots da carteira importada e metadados da importação.
- `localStorage` somente para favoritos.
- Nenhum backend necessário nesta versão.

Estrutura mínima sugerida:

```text
app/
  data/
    properties.json
  globals.css
  layout.tsx
  page.tsx
public/
  favicon.svg
  og.png
scripts/
  extract_properties.py
package.json
tsconfig.json
```

É permitido separar componentes, hooks e utilitários em mais arquivos quando isso melhorar a manutenção. Exemplos:

```text
components/
  Header.tsx
  SearchFilters.tsx
  PropertyCard.tsx
  PropertyDetailsModal.tsx
  PdfImportDialog.tsx
  ImportReviewTable.tsx
  EmptyState.tsx
hooks/
  useFavorites.ts
  usePropertyCatalog.ts
lib/
  filters.ts
  formatters.ts
  property-types.ts
  catalog-repository.ts
  indexeddb-catalog-repository.ts
  pdf-import/
    extract-pdf.ts
    group-lines.ts
    parse-properties.ts
    normalize-property.ts
    validate-import.ts
    diff-catalogs.ts
```

Arquitetura obrigatória da carteira:

- `properties.json` é o seed imutável e o fallback de recuperação.
- Na inicialização, carregar o snapshot ativo do IndexedDB; se não existir ou estiver corrompido, usar o seed.
- Toda a busca, filtros, contadores e cartões devem usar a carteira ativa, nunca importar diretamente o JSON estático em vários componentes.
- Centralizar leitura, ativação, restauração e limpeza em uma abstração `CatalogRepository` para facilitar uma futura implementação remota sem reescrever a interface.
- A extração e a validação devem ser funções puras sempre que possível, independentes dos componentes React.
- Carregar o módulo pesado de PDF sob demanda com `dynamic import`, somente quando o usuário abrir o fluxo de importação.

---

## 5. Modelo de dados obrigatório

Crie um tipo TypeScript equivalente a:

```ts
export type Property = {
  item: number;
  code: string;
  name: string;
  region: string;
  category: "Apartamento" | "Casa" | "Comercial" | "Flat" | "Lote" | "Outro";
  typology: string;
  bedrooms: number | null;
  area: number | null;
  address: string;
  captor: string;
  appointment: string;
  phone: string;
  phoneDigits: string;
  price: number | null;
  condo: number | null;
  iptu: number | null;
  notes: string;
  acceptsFinancing: boolean;
  acceptsFgts: boolean;
  url: string;
  dataNote: string;
  sourcePage?: number;
  sourceRow?: number;
};
```

Crie também tipos equivalentes a:

```ts
export type CatalogSnapshot = {
  id: string;
  schemaVersion: 1;
  source: "seed" | "pdf";
  sourceFileName: string;
  importedAt: string;
  sourceDate: string | null;
  contentHash: string;
  properties: Property[];
  summary: {
    total: number;
    regions: number;
    links: number;
    warnings: number;
  };
};

export type ImportStatus =
  | "new"
  | "updated"
  | "unchanged"
  | "missing"
  | "invalid";
```

Regras:

- Valores monetários devem permanecer numéricos no JSON.
- A área deve permanecer numérica no JSON.
- Campos não informados devem usar `null` para números e string vazia para textos/URLs.
- Não use o texto formatado como valor de cálculo.
- O campo `item` preserva a ordem original da tabela.
- O campo `code` é o identificador estável do imóvel e a chave dos favoritos.
- Não altere telefones, códigos, endereços, preços, observações ou URLs.
- `sourcePage` e `sourceRow` são opcionais no seed, mas devem ser preenchidos para registros extraídos de PDFs quando a origem puder ser determinada.
- Categorias não reconhecidas devem usar `Outro` e gerar aviso; nunca descartar silenciosamente o imóvel apenas por uma nova tipologia.

---

## 6. Regras de formatação

Crie formatadores centralizados:

```ts
const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const decimal = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2,
});
```

Comportamento:

- Exibir preços como `R$ 630.000`, sem centavos.
- Exibir área como `31 m²` ou `34,76 m²`.
- Exibir `Valor sob consulta` quando `price` for `null`.
- Exibir `Área não informada` quando `area` for `null`.
- Exibir `Não informado` para condomínio ou IPTU ausentes no modal.
- Calcular o valor por m² somente quando preço e área forem maiores que zero: `price / area`.
- Nunca arredondar ou regravar o valor original no JSON.

---

## 7. Cabeçalho e primeira área visível

O aplicativo deve ser uma superfície de trabalho. Não use hero publicitário alto.

### Barra superior

- Fundo azul-petróleo muito escuro.
- Marca textual `quadraimob`, com `quadra` branco e `imob` ciano.
- À direita: `Carteira de revendas`.
- Selo/data dinâmico:
  - no seed, `Atualizado em 21 ago 2026`;
  - após uma importação, usar a data identificada no PDF quando confiável;
  - se o PDF não contiver data identificável, usar `Importado em DD mmm AAAA` com a data local da importação.
- Ação secundária visível `Atualizar via PDF`, com ícone de upload/documento.
- Após uma importação, disponibilizar em menu de contexto `Ver dados da importação`, `Restaurar versão anterior` e `Restaurar base original`.

### Introdução

- Eyebrow: `BUSCA DE IMÓVEIS`.
- Título: `Encontre a opção certa em poucos segundos.`
- Texto: `Consulte a carteira atualizada, refine os resultados e acesse cada anúncio sem percorrer páginas de tabela.`
- Indicadores:
  - quantidade dinâmica de imóveis da carteira ativa;
  - quantidade dinâmica de regiões distintas;
  - quantidade dinâmica de registros com anúncio.

No primeiro carregamento, os indicadores devem exibir `83 imóveis`, `16 regiões` e `81 anúncios`. Depois de importar outro PDF, nenhum desses três números pode permanecer hardcoded.

Os controles principais e os primeiros resultados devem aparecer rapidamente, sem grandes áreas vazias.

---

## 8. Busca textual

Implemente um campo de busca com o placeholder:

`Busque por código, empreendimento, endereço ou captador`

Regras:

- Pesquisar simultaneamente em `code`, `name`, `region`, `address` e `captor`.
- A busca deve ignorar maiúsculas/minúsculas.
- Preferencialmente, normalize acentos para que `aguas claras` encontre `ÁGUAS CLARAS`.
- Aplicar o filtro durante a digitação, sem botão “Buscar”.
- Exibir um botão `×` para limpar o texto quando houver conteúdo.
- Não fazer requisições externas.

Normalização recomendada:

```ts
function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}
```

---

## 9. Filtros

Todos os critérios ativos devem ser combinados por lógica `AND`.

### Região

- Gerar opções dinamicamente a partir do JSON.
- Ordenar alfabeticamente em português.
- Opção inicial: `Todas as regiões`.

### Tipo de imóvel

Opções derivadas da carteira ativa:

- Apartamento;
- Casa;
- Comercial;
- Flat;
- Lote.
- Outro, somente quando existir pelo menos um registro dessa categoria.

Opção inicial: `Todos os tipos`.

### Quartos

- Opção inicial: `Qualquer quantidade`.
- Valores: 1, 2, 3, 4 e 5 quartos.
- Imóveis comerciais ou lotes têm `bedrooms: null` e não aparecem quando um número de quartos é selecionado.

### Valor mínimo e máximo

- Inputs numéricos com prefixo visual `R$`.
- Mínimo com placeholder `0`.
- Máximo com placeholder `Sem limite`.
- Valores em reais inteiros.

### Área mínima e máxima

- Inputs numéricos com sufixo visual `m²`.
- Mínimo com placeholder `0`.
- Máximo com placeholder `Sem limite`.

### Captador/equipe

- Gerar opções dinamicamente a partir do JSON.
- Ordenar alfabeticamente.
- Opção inicial: `Todos os captadores`.

### Financiamento e FGTS

- Checkboxes ou botões de seleção independentes.
- `Aceita financiamento` filtra `acceptsFinancing === true`.
- `Aceita FGTS` filtra `acceptsFgts === true`.
- Se ambos estiverem ativos, mostrar somente imóveis que atendam aos dois critérios.

### Favoritos

- Controle `Favoritos` com ícone de coração e contador.
- Quando ativo, mostrar somente códigos presentes no conjunto de favoritos.

### Contador de filtros

- O botão de filtros deve exibir uma pequena badge com a quantidade de filtros estruturados ativos.
- A busca textual pode ser excluída dessa contagem, mas deve continuar sendo considerada em `hasFilters` para disponibilizar `Limpar filtros`.

### Limpar filtros

O botão deve restaurar:

- busca vazia;
- todos os selects em seus valores iniciais;
- campos numéricos vazios;
- financiamento e FGTS desmarcados;
- filtro “somente favoritos” desativado.

Não apagar os favoritos salvos ao limpar filtros.

---

## 10. Algoritmo de filtragem

Implemente a lista filtrada de forma memoizada. A regra conceitual é:

```ts
const matches =
  matchesText(property, query) &&
  (!region || property.region === region) &&
  (!category || property.category === category) &&
  (!bedrooms || property.bedrooms === Number(bedrooms)) &&
  (!captor || property.captor === captor) &&
  (!onlyFinancing || property.acceptsFinancing) &&
  (!onlyFgts || property.acceptsFgts) &&
  (!onlyFavorites || favorites.has(property.code)) &&
  matchesPriceRange(property, minPrice, maxPrice) &&
  matchesAreaRange(property, minArea, maxArea);
```

Valores ausentes não devem ser tratados como zero quando isso produzir correspondências incorretas. Coloque valores nulos no final das ordenações numéricas.

---

## 11. Ordenação

Crie o seletor `Ordenar por` com:

1. `Ordem da tabela`: crescente por `item`.
2. `Menor preço`: crescente por `price`.
3. `Maior preço`: decrescente por `price`.
4. `Maior área`: decrescente por `area`.
5. `Menor valor por m²`: crescente por `price / area`.

Regras:

- Não mutar o array original. Copiar antes de ordenar.
- Ordenação estável; em empate, usar `item`.
- Valores nulos devem ficar no final.

---

## 12. Cartões dos imóveis

Use grade responsiva:

- 3 colunas em telas grandes;
- 2 colunas em tablets;
- 1 coluna em celulares.

Cada cartão deve conter:

1. Cabeçalho visual em gradiente azul-petróleo.
2. Badge de categoria com ícone.
3. Badge com o código `RQB...`.
4. Botão de favorito com coração.
5. Região com ícone de localização.
6. Nome do imóvel.
7. Endereço limitado visualmente a duas linhas.
8. Valor de venda em destaque.
9. Área privativa.
10. Tipologia.
11. Badge `Financiamento`, quando aplicável.
12. Badge `FGTS`, quando aplicável.
13. Captador/equipe.
14. Condomínio, quando informado.
15. Botão `Ver detalhes`.
16. Botão `Anúncio` quando houver URL.
17. Texto/controle desabilitado `Sem link` quando a URL estiver vazia.

Interações:

- Hover sutil em desktop, com pequena elevação.
- Foco visível para teclado.
- O coração ativo deve ficar preenchido e usar tom rosado/vermelho discreto.
- O botão de anúncio abre nova aba com `target="_blank"` e `rel="noreferrer"`.

---

## 13. Favoritos persistentes

Use a chave:

`quadraimob-favorites`

Armazene um array JSON de códigos, nunca os objetos completos.

Regras importantes:

- Ler o `localStorage` somente no cliente.
- Proteger leitura com `try/catch`.
- Não sobrescrever o armazenamento com um array vazio antes de concluir a hidratação inicial.
- Usar `Set<string>` no estado para operações eficientes.
- Persistir após cada alteração.
- O mesmo botão deve adicionar e remover.
- Atualizar imediatamente o contador de favoritos.
- Favoritos continuam salvos após recarregar a página no mesmo navegador.

---

## 14. Modal de detalhes

Ao clicar em `Ver detalhes`, abrir um modal centralizado no desktop e um bottom sheet no celular.

O modal deve exibir:

- categoria;
- código;
- região;
- nome;
- endereço;
- valor de venda;
- valor por m² calculado;
- tipologia;
- área privativa;
- condomínio;
- IPTU;
- condições de financiamento/FGTS;
- observações adicionais;
- eventual `dataNote`;
- captador/equipe;
- texto de agendamento e telefone;
- botão `Ligar`;
- botão `Conversar no WhatsApp`;
- botão `Abrir anúncio` quando houver URL;
- botão `Compartilhar`;
- botão de favorito;
- botão de fechar.

Formas de fechar:

- botão `X`;
- clique no backdrop;
- tecla `Escape`.

Não fechar quando o clique ocorrer dentro do conteúdo. Ao abrir, impedir rolagem do fundo e mover o foco para o modal. Ao fechar, devolver o foco ao botão que o abriu. Preferencialmente implemente focus trap.

---

## 15. Ações de contato e compartilhamento

### Ligação

Gerar:

```text
tel:+55{phoneDigits}
```

Só renderizar quando houver 10 ou 11 dígitos válidos.

### WhatsApp

Gerar:

```text
https://wa.me/55{phoneDigits}?text={mensagemCodificada}
```

Mensagem exata sugerida:

`Olá! Gostaria de informações sobre o imóvel {name}, código {code}.`

Usar `encodeURIComponent`.

### Compartilhamento

Conteúdo:

`{name} ({code}) — {typology em minúsculas}, {area} m², {price}, em {region}.`

- Se `navigator.share` existir, usar Web Share API.
- Caso contrário, copiar resumo e URL para a área de transferência.
- Exibir toast: `Resumo copiado para compartilhar.`
- Em falha não causada por cancelamento, exibir: `Não foi possível compartilhar agora.`
- O toast deve desaparecer automaticamente.

---

## 16. Estado vazio e feedbacks

Quando a lista estiver vazia, mostrar:

- título: `Nenhum imóvel corresponde aos filtros.`
- texto: `Tente ampliar a faixa de preço ou remover algum critério.`
- botão `Limpar filtros`.

Exibir acima da grade:

- `{n} imóvel encontrado` quando `n === 1`;
- `{n} imóveis encontrados` nos demais casos.

Use `aria-live="polite"` na região de resultados.

---

## 17. Identidade visual

Use os seguintes tokens como referência:

```css
:root {
  --navy: #123b45;
  --navy-2: #0b2f38;
  --cyan: #32bde4;
  --cyan-dark: #0e8eb3;
  --ink: #15323a;
  --muted: #65777d;
  --line: #dce5e7;
  --surface: #ffffff;
  --canvas: #f2f6f7;
}
```

Direção visual:

- corporativa, limpa e confiável;
- alta densidade de informação sem aparência apertada;
- superfícies brancas sobre fundo cinza-azulado claro;
- cantos entre 8 e 20 px, conforme a hierarquia;
- sombras leves;
- ciano apenas como acento e ação primária;
- azul-petróleo para identidade, cabeçalhos e contraste;
- tipografia de sistema/Inter, com excelente legibilidade;
- ícones lineares coerentes, sem misturar estilos;
- não usar gradientes coloridos genéricos, roxo ou elementos decorativos sem função.

---

## 18. Responsividade

Adote como referência:

- Acima de 1050 px: filtros em até 5 colunas e cartões em 3 colunas.
- Entre 741 e 1050 px: filtros em 3 colunas e cartões em 2 colunas.
- Até 740 px:
  - cartões em 1 coluna;
  - filtros avançados recolhidos inicialmente;
  - botão de filtros compacto;
  - modal convertido em bottom sheet;
  - ações do modal empilhadas;
  - indicadores ocupando a largura disponível.
- Até 430 px:
  - filtros em 1 coluna;
  - ações da toolbar empilhadas;
  - valores do modal reorganizados verticalmente;
  - manter no mínimo 14 px de margem lateral.

Não permitir overflow horizontal em nenhuma largura a partir de 320 px.

---

## 19. Acessibilidade

Requisitos mínimos:

- `html lang="pt-BR"`.
- Hierarquia correta de headings.
- Labels associados a todos os inputs.
- Botões com nomes acessíveis.
- `aria-pressed` nos favoritos e no filtro “somente favoritos”.
- `aria-expanded` no botão de filtros móveis.
- `role="dialog"`, `aria-modal="true"` e `aria-labelledby` no modal.
- Foco visível em botões, links, campos e selects.
- Contraste compatível com WCAG AA.
- Fluxo completo por teclado.
- Áreas clicáveis com aproximadamente 44 px em dispositivos móveis.
- Ícones decorativos com `aria-hidden="true"`.
- Não depender somente de cor para comunicar estado.

---

## 20. Metadados e compartilhamento social

Configure:

- Título: `Busca de Imóveis Quadraimob`.
- Descrição: `Consulte e filtre a carteira atualizada de imóveis para revenda da Quadraimob.`
- Open Graph e Twitter/X:
  - título: `Busca de Imóveis Quadraimob`;
  - descrição: `83 imóveis, filtros inteligentes e acesso rápido aos anúncios.`;
  - cartão grande 1200 × 630.

Crie `public/og.png` com:

- fundo azul-petróleo/azul profundo;
- acentos ciano;
- título exato e legível `Busca de Imóveis Quadraimob`;
- subtítulo `83 imóveis • filtros inteligentes • acesso rápido`;
- motivos abstratos de busca, localização, edifícios e cartões;
- sem pessoas, sem fotos específicas e sem logotipos inventados.

Use URL absoluta confiável no metadata final quando a URL de produção estiver disponível.

---

## 21. Importação direta de PDF e atualização da carteira

Esta funcionalidade é obrigatória e deve funcionar pela interface publicada do aplicativo. O usuário não pode depender de Python, terminal, recompilação, novo deploy ou edição manual do arquivo `properties.json` para usar uma tabela mais recente.

### 21.1. Princípio de funcionamento

- O usuário seleciona um arquivo PDF local.
- O aplicativo lê o PDF no próprio navegador com `pdfjs-dist`.
- O conteúdo não é enviado a nenhum servidor ou serviço de IA.
- A carteira ativa só é alterada depois da extração, validação, comparação, revisão e confirmação explícita.
- A importação concluída deve atualizar imediatamente cartões, busca, filtros, regiões, captadores, contadores e data de atualização.
- O resultado deve continuar ativo após fechar ou recarregar a página, por meio do IndexedDB.
- O seed de 83 imóveis deve permanecer imutável no bundle como base original de recuperação.

### 21.2. Entrada e limites

Aceitar somente:

- um arquivo por importação;
- MIME `application/pdf` ou extensão `.pdf` coerente;
- no máximo 20 MiB;
- no máximo 200 páginas;
- PDF digital com texto extraível.

Validar a assinatura `%PDF-` nos primeiros bytes, e não confiar apenas no nome ou MIME. Se o PDF for protegido por senha, estiver corrompido, não tiver texto extraível ou parecer composto somente por imagens, interromper sem alterar a carteira e explicar o motivo. OCR de PDF escaneado está fora do escopo desta versão; não produzir dados por suposição.

### 21.3. Fluxo visual obrigatório

O botão `Atualizar via PDF` abre um diálogo responsivo em etapas:

1. **Selecionar PDF**
   - área de arrastar e soltar e botão `Escolher arquivo`;
   - informar que o processamento ocorre no dispositivo;
   - mostrar nome e tamanho após a seleção.
2. **Processando**
   - progresso por página, por exemplo `Lendo página 3 de 8`;
   - permitir cancelar de forma segura;
   - não bloquear a interface inteira.
3. **Revisar extração**
   - resumo com total extraído, regiões, anúncios, avisos e erros;
   - comparação com a carteira atual;
   - tabela pesquisável dos registros extraídos;
   - filtros por status `Novos`, `Alterados`, `Inalterados`, `Ausentes` e `Inválidos`;
   - cada item alterado deve permitir visualizar campos `Antes` e `Depois`;
   - avisos devem mostrar página/linha de origem quando disponível.
4. **Escolher estratégia**
   - `Sincronizar carteira` — recomendado: o PDF é tratado como a nova fonte completa; adiciona novos, atualiza existentes e remove da carteira ativa os códigos ausentes no PDF;
   - `Mesclar com a carteira atual`: adiciona novos e atualiza existentes, mas mantém códigos ausentes no PDF;
   - explicar o efeito de cada opção e mostrar a quantidade final antes da confirmação.
5. **Confirmar importação**
   - resumo final: `X novos`, `Y alterados`, `Z mantidos`, `W removidos`;
   - botão explícito `Importar e ativar carteira`;
   - não executar a alteração ao simplesmente selecionar o arquivo.
6. **Concluído**
   - mensagem de sucesso com a nova quantidade de imóveis;
   - ações `Ver carteira`, `Ver dados da importação` e `Desfazer importação`.

Fechar ou cancelar antes da confirmação deve descartar apenas o rascunho da importação e preservar integralmente a carteira ativa.

### 21.4. Extração determinística no navegador

Implemente o extrator TypeScript usando os itens de texto e anotações retornados pelo PDF.js:

1. Ler todas as páginas e preservar `pageNumber`, texto, posição `x`, `y`, largura e altura de cada item.
2. Agrupar itens visuais na mesma linha por proximidade vertical, com tolerância proporcional ao tamanho da fonte.
3. Ordenar itens da linha pela coordenada horizontal.
4. Detectar os limites das colunas pelo cabeçalho da tabela e pelas posições recorrentes; não depender exclusivamente de divisão por espaços.
5. Detectar cabeçalhos de região e manter a região corrente até um novo cabeçalho, inclusive entre páginas.
6. Identificar o início de um registro quando houver item ordinal numérico seguido por código compatível com `/^RQB\d+$/i`.
7. Anexar linhas quebradas ao registro anterior até o próximo início de registro ou cabeçalho de região.
8. Ignorar cabeçalhos, rodapés, números de página e linhas decorativas repetidas.
9. Ler anotações de link da página e associá-las à linha/registro cuja caixa vertical tenha maior sobreposição.
10. Remover URLs duplicadas no mesmo registro.
11. Preservar texto Unicode, normalizando espaços, NBSPs e quebras de linha sem retirar acentos.
12. Não usar um LLM para interpretar valores e não fazer chamadas de rede.

Quando o layout do novo PDF divergir significativamente do conhecido e a confiança da associação de colunas for baixa, bloquear a ativação e mostrar um diagnóstico. É preferível solicitar revisão do arquivo a importar dados nas colunas erradas.

### 21.5. Normalização dos campos

Aplicar as seguintes regras em funções puras e testáveis:

- `code`: maiúsculas, sem espaços internos; deve corresponder a `RQB` + dígitos.
- moedas brasileiras:
  - remover `R$`, NBSP e espaços;
  - remover pontos de milhar;
  - converter vírgula decimal em ponto;
  - retornar `number` ou `null`, nunca `NaN`.
- `area`: aceitar unidade `m²`, `m2` e erro conhecido `m³`; converter o número brasileiro e registrar aviso para unidade suspeita.
- `phone`: preservar a representação extraída.
- `phoneDigits`: manter apenas dígitos e normalizar o DDI conforme as regras já definidas para WhatsApp, sem alterar `phone`.
- `bedrooms`: extrair de expressões como `1 quarto`, `2 quartos`, `3Q` ou tipologia equivalente; usar `null` quando não houver evidência.
- `acceptsFinancing`: verdadeiro somente quando houver indicação positiva; frases como `não aceita financiamento` devem resultar em falso.
- `acceptsFgts`: aplicar a mesma análise de negação para FGTS.
- `url`: aceitar apenas `http:` ou `https:`; valor inválido vira string vazia e gera aviso.
- `item`: preservar a ordem encontrada no novo PDF e renumerar sequencialmente somente se os ordinais forem ausentes ou duplicados, gerando aviso.

Classificação de categoria, em ordem:

1. Se a tipologia contiver `LOTE`, `TERRENO` ou a URL contiver `/lote`: `Lote`.
2. Se a tipologia contiver `SALA`, `LOJA`, `COMERCIAL` ou `GALPÃO`: `Comercial`.
3. Se nome/URL indicar `hotel-flat`, `apart-hotel` ou `flat`: `Flat`.
4. Se tipologia/URL/nome indicar claramente `casa`, `sobrado` ou `residência`: `Casa`.
5. Se indicar `apartamento`, `studio`, `kitnet` ou quartos residenciais: `Apartamento`.
6. Caso contrário: `Outro`, com aviso de revisão.

### 21.6. Validação e confiança

Classifique problemas em:

- **erro bloqueante**: impede a ativação;
- **registro inválido**: exclui apenas aquela linha da carteira candidata e exige destaque na revisão;
- **aviso**: permite continuar após revisão.

Erros bloqueantes mínimos:

- zero registros válidos;
- códigos duplicados sem possibilidade de resolução determinística;
- mais de 20% das linhas candidatas inválidas;
- mais de 30% dos registros sem região ou nome;
- colunas críticas aparentemente deslocadas;
- falha de escrita no IndexedDB.

Um registro é inválido quando não tiver `code` válido, nome ou região. Preço, área, condomínio, IPTU, telefone, observações e URL podem estar ausentes e devem virar `null`/string vazia com aviso quando apropriado.

Exibir uma pontuação de confiança global `Alta`, `Média` ou `Baixa`, acompanhada dos motivos. Confiança baixa deve bloquear a ativação; não oferecer botão que ignore erros críticos.

Não exigir exatamente 83 imóveis em PDFs futuros. A validação `83 imóveis / 16 regiões / 81 links` pertence somente ao seed e ao PDF original usado como fixture de regressão.

### 21.7. Comparação e identificação de mudanças

Usar `code` como chave estável. Antes de comparar:

- normalizar strings para eliminar apenas diferenças irrelevantes de espaços e quebras de linha;
- comparar valores numéricos como números;
- comparar todos os campos de negócio, ignorando somente `sourcePage`, `sourceRow` e metadados da importação.

Status:

- `new`: código não existe na carteira atual;
- `updated`: código existe e ao menos um campo de negócio mudou;
- `unchanged`: código existe e os campos de negócio são equivalentes;
- `missing`: código existe atualmente, mas não foi encontrado no novo PDF;
- `invalid`: linha candidata não pode virar um `Property` válido.

Para `updated`, listar nominalmente os campos alterados e mostrar valores anterior/posterior. Nunca tratar apenas a mudança do ordinal `item` como atualização de negócio, mas preservar a nova ordem quando a estratégia for `Sincronizar carteira`.

### 21.8. Persistência, atomicidade e restauração

Use IndexedDB com stores versionadas, por exemplo:

- `catalogSnapshots`;
- `catalogState` com referência ao snapshot ativo e ao anterior.

Requisitos:

- calcular `contentHash` SHA-256 dos bytes do PDF usando Web Crypto;
- detectar importação repetida do mesmo arquivo/hash e avisar antes de continuar;
- salvar primeiro o novo snapshot completo;
- somente após a gravação bem-sucedida, trocar atomicamente a referência ativa em uma transação;
- manter no mínimo o snapshot ativo e o imediatamente anterior, além do seed embutido;
- `Desfazer importação` restaura o snapshot anterior sem reprocessar o PDF;
- `Restaurar base original` volta ao seed após confirmação, sem apagar favoritos;
- se o IndexedDB falhar ou estiver indisponível, manter a carteira atual e explicar que a atualização não pôde ser salva;
- ao restaurar ou ativar outra base, remover dos favoritos somente códigos inexistentes se o usuário confirmar essa limpeza; por padrão, manter os códigos para que possam reaparecer em outra versão.

### 21.9. Data e metadados da fonte

Tentar extrair do cabeçalho do PDF uma data com padrões brasileiros como `DD/MM/AAAA` ou texto equivalente. Só aceitar como `sourceDate` quando houver rótulo contextual como `Atualizado em`, `Tabela de`, `Posição em` ou equivalente. Não inferir data pelo nome do arquivo sem sinalizar que é apenas uma hipótese.

Em `Ver dados da importação`, exibir:

- nome do arquivo;
- hash abreviado;
- data/hora da importação;
- data declarada no PDF, se houver;
- total, regiões, links, avisos e estratégia usada;
- comparação resumida com a versão anterior.

### 21.10. Script auxiliar e paridade

Mantenha `scripts/extract_properties.py` com `pdfplumber` apenas como ferramenta opcional de desenvolvimento e diagnóstico. A funcionalidade publicada não pode depender dele.

O script deve seguir as mesmas regras de normalização do importador TypeScript, aceitar caminhos de entrada/saída, gravar JSON UTF-8 e produzir um relatório de avisos. Crie fixtures compartilhadas ou testes de paridade para impedir que o script Python e o importador do navegador gerem resultados de negócio incompatíveis para o PDF original.

Cuidados específicos da base inicial:

- Os itens 13 (`RQB0702`) e 51 (`RQB0715`) não possuem link no PDF original; preservar `url: ""`.
- O item 73 (`RQB0595`) aparece como `138,60 m³`; usar `area: 138.6` e registrar em `dataNote` que a fonte traz uma unidade suspeita.
- Não inventar URLs ausentes.
- Preservar números de telefone exatamente como extraídos, inclusive possíveis inconsistências da fonte.

---

## 22. Segurança, privacidade e robustez

- Não inserir segredos ou chaves no front-end.
- Não usar `dangerouslySetInnerHTML` para dados dos imóveis.
- Tratar URLs externas como dados não confiáveis e permitir somente `http:` ou `https:`.
- Abrir links externos com `rel="noreferrer"`.
- Não enviar o PDF, seus bytes, o texto extraído ou os dados dos imóveis a serviços externos.
- Processar o arquivo em memória e não persistir os bytes integrais do PDF; persistir somente o snapshot estruturado e seu hash.
- Validar assinatura, tamanho, quantidade de páginas e limites antes de processar.
- Tratar todo texto do PDF como entrada não confiável; exibi-lo somente como texto escapado pelo React.
- Interromper loops e liberar referências ao `ArrayBuffer`, documento PDF e worker após concluir ou cancelar.
- Não adicionar analytics sem solicitação.
- Proteger acesso ao `localStorage` com `try/catch`.
- Proteger IndexedDB, Web Crypto, drag-and-drop e File API com tratamento de falhas e mensagens acessíveis.
- Evitar erros de hidratação.
- Manter funcionamento quando compartilhamento, área de transferência ou `localStorage` não estiverem disponíveis.
- Não alterar o conjunto de dados durante filtros e ordenações.
- Nunca substituir a carteira ativa quando a importação falhar parcial ou totalmente.

---

## 23. Desempenho

- A carteira inteira pode ser filtrada no cliente; não assumir que futuras versões terão exatamente 83 registros.
- Memoizar listas derivadas e resultados filtrados.
- Não carregar bibliotecas pesadas para tarefas simples.
- Carregar `pdfjs-dist` e o worker apenas quando o fluxo de importação for aberto.
- Processar páginas sequencialmente ou com concorrência limitada para evitar picos de memória.
- Atualizar o progresso de forma limitada para não renderizar a cada item de texto.
- Evitar imagens externas e requisições no carregamento inicial.
- Não introduzir virtualização ou paginação sem necessidade.
- Na tabela de revisão, adicionar paginação ou virtualização somente se o PDF produzir mais de 300 linhas, mantendo busca e status funcionais.
- Manter o bundle enxuto.
- Usar animações somente em `transform` e `opacity`, respeitando `prefers-reduced-motion`.

---

## 24. Testes obrigatórios

Implemente testes unitários, de integração e ao menos um teste de fluxo completo para confirmar:

1. A base contém exatamente 83 imóveis.
2. Existem exatamente 16 regiões distintas.
3. Existem 81 registros com URL.
4. Os itens 13 e 51 aparecem como `Sem link`.
5. Busca por `RQB0777` retorna o Life Resort correto.
6. Busca sem acento por `aguas claras` encontra imóveis de `ÁGUAS CLARAS`.
7. Filtro por região funciona.
8. Filtro por categoria funciona.
9. Filtro por quantidade de quartos funciona.
10. Faixas de preço e área são inclusivas.
11. Financiamento e FGTS funcionam individualmente e em conjunto.
12. Filtros diferentes são combinados por `AND`.
13. Limpar filtros restaura todos os resultados da carteira ativa (83 quando o seed estiver ativo).
14. Todas as cinco ordenações funcionam e não mutam a base.
15. Favoritos são adicionados, removidos e restaurados após recarregar.
16. O filtro de favoritos mostra somente os itens salvos.
17. O modal abre com o imóvel correto e fecha por X, backdrop e Escape.
18. O cálculo de valor por m² está correto.
19. O WhatsApp recebe país, número e mensagem codificada.
20. Registros sem URL não exibem link clicável.
21. O fallback de compartilhamento copia o texto.
22. O estado vazio e o reset funcionam.
23. Não existe overflow horizontal em 320, 375, 768, 1024 e 1440 px.
24. A navegação por teclado e o foco do modal funcionam.
25. Ao não existir snapshot no IndexedDB, o aplicativo usa o seed com 83 imóveis.
26. Um snapshot ativo válido substitui o seed na interface e atualiza todos os contadores dinamicamente.
27. O seletor rejeita arquivo que não seja PDF, assinatura inválida, arquivo acima de 20 MiB e PDF acima de 200 páginas.
28. O fixture do PDF original produz 83 imóveis, 16 regiões e 81 links, inclusive os dois casos sem URL e a área com unidade suspeita.
29. O parser associa corretamente linhas quebradas, cabeçalhos de região entre páginas e hyperlinks por sobreposição vertical.
30. Moeda, área, telefone, quartos, financiamento, FGTS e categoria são normalizados corretamente, incluindo negações.
31. Um PDF futuro pode conter quantidade diferente de 83 sem falhar apenas por essa diferença.
32. Duplicidade de código, zero registros, confiança baixa e excesso de registros inválidos bloqueiam a ativação.
33. O diff classifica corretamente registros novos, alterados, inalterados, ausentes e inválidos.
34. O diff ignora diferenças irrelevantes de espaços, mas detecta mudanças reais de preço, endereço, telefone, observações e URL.
35. `Sincronizar carteira` remove códigos ausentes; `Mesclar` os mantém.
36. Cancelar ou fechar antes da confirmação não altera a carteira ativa.
37. A ativação grava o snapshot e troca a referência ativa na mesma transação lógica; uma falha de persistência preserva a versão anterior.
38. A base importada permanece ativa após recarregar a página.
39. `Desfazer importação` restaura o snapshot anterior e `Restaurar base original` volta ao seed.
40. Reimportar o mesmo hash gera aviso de duplicidade.
41. O PDF e seu texto não geram requisições de rede.
42. Cancelamento libera o fluxo e permite iniciar uma nova importação.
43. Todos os estados do diálogo têm rótulos acessíveis, foco controlado e navegação por teclado.

Antes de concluir:

- executar lint;
- executar typecheck;
- executar testes;
- executar build de produção;
- corrigir todos os erros e avisos relevantes;
- testar manualmente o fluxo principal em desktop e celular.

---

## 25. Critérios de aceite visual e funcional

Considere a tarefa concluída somente quando:

- em uma instalação limpa, sem snapshot importado, a primeira renderização mostra os 83 resultados do seed;
- todos os filtros funcionam isolados e combinados;
- favoritos persistem;
- todos os botões do modal executam sua função;
- na base seed, os 81 anúncios abrem o link correto;
- os dois imóveis sem URL são tratados adequadamente;
- os textos estão em português do Brasil;
- o layout é visualmente consistente com a identidade azul-petróleo/ciano;
- o aplicativo é confortável em celular e computador;
- não há dados fictícios, placeholders ou `TODO` visíveis;
- não há erros no console;
- o build final é reproduzível;
- o botão `Atualizar via PDF` executa todo o fluxo sem terminal ou edição de arquivos;
- a revisão mostra diferenças antes da confirmação;
- novos imóveis do PDF passam a aparecer na busca e nos filtros imediatamente após a ativação;
- alterações em imóveis existentes substituem corretamente os campos anteriores;
- as estratégias de sincronização e mesclagem têm os efeitos documentados;
- cancelar, detectar erro ou falhar ao salvar nunca corrompe nem substitui a carteira ativa;
- a importação persiste após recarregar e pode ser desfeita;
- todos os indicadores e opções de filtro são derivados da carteira ativa;
- o aplicativo informa com clareza que a atualização é local ao navegador atual.

---

## 26. Entrega esperada do GLM

Ao terminar, forneça:

1. Aplicação completa no repositório.
2. Relação objetiva dos arquivos criados ou alterados.
3. Comandos para instalar, executar, testar e gerar build.
4. Resumo das funcionalidades implementadas.
5. Resultado de lint, typecheck, testes e build.
6. Evidência dos testes do importador usando o fixture original e ao menos um fixture com novos, alterados e ausentes.
7. Quaisquer limitações reais ainda existentes, incluindo a ausência de sincronização central entre usuários.

Não termine apenas com explicações. Implemente o projeto completo e valide-o.

---

## APÊNDICE A — BASE DE DADOS INICIAL COMPLETA

O arquivo complementar `properties.json` contém a base completa e validada dos 83 imóveis. Copie-o, sem alterações, para `app/data/properties.json`. Ele é o seed e a base original de recuperação, não a única fonte permitida em tempo de execução.

O GLM deve tratar o documento de instruções e o arquivo JSON como uma única entrega. Não substituir o JSON por dados fictícios, amostras reduzidas ou conteúdo reextraído sem validação. Depois da inicialização, todos os componentes devem consumir a carteira ativa fornecida por `CatalogRepository`, que pode ser o seed ou um snapshot importado.

---

## APÊNDICE B — CHECKLIST RÁPIDO PARA O GLM

- [ ] 83 registros carregados.
- [ ] 16 regiões.
- [ ] 81 anúncios.
- [ ] Busca textual.
- [ ] 11 critérios/filtros combináveis.
- [ ] 5 ordenações.
- [ ] Favoritos persistentes.
- [ ] Modal completo.
- [ ] Telefone, WhatsApp, anúncio e compartilhamento.
- [ ] Responsividade 3/2/1 colunas.
- [ ] Acessibilidade de teclado e foco.
- [ ] Metadados e `og.png`.
- [ ] Botão `Atualizar via PDF` e diálogo em seis etapas.
- [ ] Extração real com PDF.js no navegador.
- [ ] Validação, confiança, avisos e bloqueios.
- [ ] Comparação `novo/alterado/inalterado/ausente/inválido`.
- [ ] Estratégias `Sincronizar` e `Mesclar`.
- [ ] Persistência em IndexedDB, importação atômica e rollback.
- [ ] Contadores, filtros e data derivados da carteira ativa.
- [ ] Testes com PDF original e fixture atualizado.
- [ ] Testes e build aprovados.
