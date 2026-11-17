/**
 * Converte uma data ISO da API em Date. O backend pode enviar até 7 casas decimais nos
 * segundos (ex.: "2026-11-10T14:30:00.1234567Z"), que o Hermes pode não aceitar: cortamos para 3.
 */
export function parseApiDate(iso: string): Date {
  return new Date(iso.replace(/(\.\d{3})\d+/, '$1'));
}

/** Área em hectares, no padrão brasileiro (ex.: "3,5 ha"). */
export function formatHectares(value: number): string {
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} ha`;
}

/** Data no padrão brasileiro (ex.: "10/11/2026"). Retorna "—" se a data for inválida. */
export function formatDate(iso: string): string {
  const date = parseApiDate(iso);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString('pt-BR');
}

/** Data e hora no padrão brasileiro (ex.: "10/11/2026 14:30"). Retorna "—" se for inválida. */
export function formatDateTime(iso: string | Date): string {
  const date = typeof iso === 'string' ? parseApiDate(iso) : iso;
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

/** Hora curta (ex.: "14:30"). Retorna "—" se a data for inválida. */
export function formatTimeShort(date: Date): string {
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

/** Dia e mês curtos (ex.: "10/11"). Retorna "—" se a data for inválida. */
export function formatDayMonth(date: Date): string {
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

/** Primeiro nome de um nome completo (ex.: "Rafael de Freitas" vira "Rafael"). */
export function firstName(fullName: string | undefined | null): string {
  const name = (fullName ?? '').trim().split(/\s+/)[0];
  return name || '';
}

/** Iniciais para avatar (até duas letras, ex.: "Rafael de Freitas" vira "RF"). */
export function initials(fullName: string | undefined | null): string {
  const parts = (fullName ?? '')
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 2 || part.length === 1 || /^[A-ZÀ-Ý]/.test(part));
  const letters = [parts[0], parts.length > 1 ? parts[parts.length - 1] : '']
    .map((part) => part?.[0] ?? '')
    .join('');
  return letters.toUpperCase() || '?';
}

/** Saudação conforme a hora do dia. */
export function greeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 5) return 'Boa madrugada';
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}
