/**
 * Color Tokens Utility
 * Provides programmatic access to color tokens from Figma
 */

const Colors = {
  /**
   * Get a color token by name and shade
   * @param {string} colorName - The color name (e.g., 'red', 'blue', 'purple')
   * @param {string} shade - The shade (e.g., '500', '900', '50')
   * @returns {string} CSS variable name
   */
  getToken(colorName, shade) {
    return `var(--color-${colorName}-${shade})`;
  },

  /**
   * Get the computed RGB value of a color token
   * @param {string} colorName - The color name
   * @param {string} shade - The shade
   * @returns {string} RGB value (e.g., 'rgb(102, 162, 216)')
   */
  getRGB(colorName, shade) {
    const cssVar = this.getToken(colorName, shade);
    const style = getComputedStyle(document.documentElement);
    return style.getPropertyValue(`--color-${colorName}-${shade}`).trim();
  },

  /**
   * Convert RGB to hex
   * @param {string} rgb - RGB string (e.g., 'rgb(102, 162, 216)')
   * @returns {string} Hex color (e.g., '#66a2d8')
   */
  rgbToHex(rgb) {
    const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return null;
    
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    
    return `#${r}${g}${b}`;
  },

  /**
   * Get hex value of a color token
   * @param {string} colorName - The color name
   * @param {string} shade - The shade
   * @returns {string} Hex color
   */
  getHex(colorName, shade) {
    const rgb = this.getRGB(colorName, shade);
    return this.rgbToHex(rgb);
  },

  /**
   * Available color families
   */
  families: ['red', 'orange', 'yellow', 'green', 'pine', 'teal', 'blue', 'purple', 'pink', 'gray'],

  /**
   * Available shades
   */
  shades: ['900', '800', '700', '600', '500', '400', '300', '200', '100', '50', '25'],

  /**
   * Grayscale shades (special naming)
   */
  grayscaleShades: ['1', '25', '50', '75', '100', '200', '300', '400', '500', '600', '700', '800', '850', '900', '925', '950', '975', '999'],

  /**
   * Get a grayscale token
   * @param {string} shade - The shade (e.g., '100', '500', '900')
   * @returns {string} CSS variable name
   */
  getGrayToken(shade) {
    if (shade === 'white') return 'var(--color-white)';
    if (shade === 'black') return 'var(--color-black)';
    return `var(--color-gray-${shade})`;
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Colors;
}

