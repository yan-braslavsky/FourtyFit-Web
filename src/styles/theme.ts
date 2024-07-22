import Colors from './Colors';

export const theme = {
  colors: Colors.light, // Use light theme by default
  // You can add more theme properties here, such as typography, spacing, etc.
};

export type Theme = typeof theme;