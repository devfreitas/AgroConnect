export const colors = {
  // Paleta da marca (informada pela equipe)
  primary: '#C46B38', // Terracota: cor principal e botões
  accent: '#D9B77E', // Dourado areia: destaques e detalhes
  background: '#EAD9C1', // Bege claro: fundos e superfícies de apoio
  text: '#382719', // Marrom café: textos e títulos
  secondary: '#A18D72', // Taupe: elementos secundários

  // Derivadas da paleta (tons mais claros e escuros das mesmas cores)
  canvas: '#F6EEE2', // Fundo das telas: bege bem claro, deixa os cartões respirarem
  surface: '#FFFBF5', // Off-white: cartões e superfícies sobre o fundo
  surfaceMuted: '#F1E5D2', // Superfície rebaixada: campos, trilhas e áreas internas
  primaryDark: '#A5521F', // Terracota escuro: texto e links sobre fundo claro (contraste AA)
  primarySoft: '#F3DCCB', // Terracota suave: fundos de ícones e destaques discretos
  accentSoft: '#F2E6CF', // Dourado suave
  ink: '#2A1D12', // Café profundo: cabeçalhos e áreas escuras
  inkRaised: '#46321F', // Café elevado: cartões sobre áreas escuras
  onInk: '#F6EEE2', // Texto sobre áreas escuras
  onInkMuted: '#CDBBA0', // Texto secundário sobre áreas escuras
  primaryContrast: '#FFFFFF', // Texto sobre a cor principal
  border: '#E1CFB2', // Divisórias e contornos
  textMuted: '#6B5844', // Texto secundário legível sobre o fundo

  // Estados (sempre combinar com texto e ícone, nunca só a cor)
  success: '#4F7A3A',
  successSoft: '#E3EDDA',
  warning: '#A8680F',
  warningSoft: '#F8EACB',
  error: '#B3261E',
  errorSoft: '#F8DEDA',
  info: '#3E6A8A',
  infoSoft: '#DDE9F1',
} as const;

export type ColorName = keyof typeof colors;

/** Aplica transparência a uma cor hexadecimal de 6 dígitos (ex.: withAlpha('#C46B38', 0.12)). */
export function withAlpha(hex: string, alpha: number): string {
  const value = Math.round(Math.min(Math.max(alpha, 0), 1) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${value}`;
}
