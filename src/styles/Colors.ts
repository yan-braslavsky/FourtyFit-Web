export enum ColorsTheme {
    Light = "light",
    Dark = "dark",
  }
  
  export const Colors = {
    light: {
      text: '#3E3E3E', // Dark gray
      textSecondary: '#7E7E7E', // Medium gray
      primary: '#D4A373', // Sandy brown
      secondary: '#A97A50', // Copper
      ternary: '#E6CBA8', // Light beige
      quaternary: '#FFF1E1', // Very light beige
      card: '#FFF9F3', // Off-white
      background: '#F5F0E1', // Very light grayish beige
      listBackground: '#F9F5EB', // New color for list background
      darkColorLight: '#E0D7C6', // Light taupe
      tabBar: '#FFF9F3', // Off-white (matches card color for consistency)
      tabBarIcon: '#A97A50', // Copper (matches secondary color)
      tabBarInactiveBackgroundColor: '#FFF1E1', // Very light beige
      tabBarActiveBackgroundColor: '#D4A373', // Sandy brown
    },
    dark: {
      text: '#E0D7C6', // Light taupe
      textSecondary: '#A97A50', // Copper
      primary: '#D4A373', // Sandy brown
      secondary: '#A97A50', // Copper
      ternary: '#E6CBA8', // Light beige
      quaternary: '#FFF1E1', // Very light beige
      card: '#3E3E3E', // Dark gray
      background: '#2A2A2A', // Very dark gray
      listBackground: '#323232', // New color for list background in dark mode
      darkColorLight: '#7E7E7E', // Medium gray
      tabBar: '#3E3E3E', // Dark gray (matches card color for consistency)
      tabBarIcon: '#E0D7C6', // Light taupe (matches text color)
    },
  
    getColorsByTheme(theme: ColorsTheme) {
      return Colors[theme];
    }
  };
  
  export default Colors;