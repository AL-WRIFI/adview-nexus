
// Simplified dynamic styles that work with the theme system
export const applyDynamicStyles = (colors: any, mode: string = 'light') => {
  if (!colors) return;
  
  const styleId = 'dynamic-api-styles';
  let styleElement = document.getElementById(styleId) as HTMLStyleElement;
  
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }
  
  const isDarkMode = mode === 'dark';
  
  // Use API colors for branding while respecting theme
  const primaryColor = isDarkMode && colors.dark_site_main_color_one 
    ? colors.dark_site_main_color_one 
    : colors.site_main_color_one;
    
  const secondaryColor = isDarkMode && colors.dark_site_main_color_two 
    ? colors.dark_site_main_color_two 
    : colors.site_main_color_two;

  let css = '';

  if (primaryColor) {
    css += `
      :root {
        --primary: ${convertToHsl(primaryColor)};
      }
      
      .bg-primary {
        background-color: ${primaryColor} !important;
        color: white !important;
      }
      
      .text-primary {
        color: ${primaryColor} !important;
      }
      
      .border-primary {
        border-color: ${primaryColor} !important;
      }
    `;
    
    if (secondaryColor) {
      css += `
        .bg-primary:hover {
          background-color: ${secondaryColor} !important;
        }
      `;
    }
  }
  
  styleElement.textContent = css;
  console.log(`🎨 Dynamic styles applied for ${isDarkMode ? 'dark' : 'light'} mode`);
};

// Helper function to convert hex to hsl
function convertToHsl(hex: string): string {
  if (!hex) return '0 0% 50%';
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '0 0% 50%';
  
  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export const initializeDynamicStyles = async () => {
  try {
    const { settingsAPI } = await import('@/services/settings-api');
    const colorSettings = await settingsAPI.getColorSettings();
    
    if (colorSettings?.data) {
      const isDarkMode = document.documentElement.classList.contains('dark');
      applyDynamicStyles(colorSettings.data, isDarkMode ? 'dark' : 'light');
    }
  } catch (error) {
    console.error('❌ Failed to initialize dynamic styles:', error);
  }
};
