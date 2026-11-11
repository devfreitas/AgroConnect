/** Área em hectares, no padrão brasileiro (ex.: "3,5 ha"). */
export function formatHectares(value: number): string {
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} ha`;
}

/** Data no padrão brasileiro (ex.: "10/11/2026"). Retorna "—" se a data for inválida. */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('pt-BR');
}

/** Data e hora no padrão brasileiro (ex.: "10/11/2026 14:30"). Retorna "—" se for inválida. */
export function formatDateTime(iso: string | Date): string {
  const date = typeof iso === 'string' ? new Date(iso) : iso;
  if (Number.isNaN(date.getTime())) return '—';
  const day = date.toLocaleDateString('pt-BR');
  const time = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return `${day} ${time}`;
}

/** Lê um número digitado com vírgula ou ponto decimal (ex.: "3,5"). Retorna null se for inválido. */
export function parseHectares(text: string): number | null {
  const normalized = text.trim().replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(normalized)) return null;
  return Number(normalized);
}

/** Número para exibir em um campo de texto, com vírgula decimal (ex.: 3.5 vira "3,5"). */
export function hectaresToInput(value: number): string {
  return String(value).replace('.', ',');
}
