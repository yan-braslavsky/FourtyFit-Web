// src/styles/theme.ts
export const theme = {
  colors: {
    primary: '#D4A373', // Sandy brown
    secondary: '#A97A50', // Copper
    background: '#F5F0E1', // Very light grayish beige
    text: '#3E3E3E', // Dark gray
    textLight: '#FFFFFF', // White for text on dark backgrounds
    card: '#FFF9F3', // Off-white
    accent: '#4CAF50', // Green for the create button
    accentHover: '#45a049', // Darker green for hover state
    navActive: '#E6CBA8', // Light beige for active navigation tab
    warning: '#FFA500', // Orange for the update button
    warningHover: '#FF8C00', // Darker orange for hover state
    disabled: '#CCCCCC', // Light gray for disabled state
  },
};

export type Theme = typeof theme;

