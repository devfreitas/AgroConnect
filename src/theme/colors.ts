export const colors = {
  // Paleta da marca 
  primary: '#C46B38', // Terracota: cor principal e botões
  accent: '#D9B77E', // Dourado areia: destaques e detalhes
  background: '#EAD9C1', // Bege claro: fundos
  text: '#382719', // Marrom café: textos e títulos
  secondary: '#A18D72', // Taupe: elementos secundários

  // Complementares (proposta)
  surface: '#FFFBF5', // Off-white: cartões e superfícies sobre o fundo
  primaryContrast: '#FFFFFF', // Texto sobre a cor principal
  border: '#D6C3A5', // Divisórias e contornos
  textMuted: '#6B5844', // Texto secundário legível sobre o fundo

  // Estados (sempre combinar com texto e ícone)
  success: '#4F7A3A',
  warning: '#B7791F',
  error: '#B3261E',
  info: '#3E6A8A',
} as const;

export type ColorName = keyof typeof colors;