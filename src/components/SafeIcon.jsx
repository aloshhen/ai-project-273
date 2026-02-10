/**
 * SafeIcon Component - Dynamic icon component with full Lucide React support
 */

import React from 'react';
import * as LucideIcons from 'lucide-react';

/**
 * Converts kebab-case to PascalCase
 */
const kebabToPascal = (str) => {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
};

/**
 * SafeIcon - Renders ANY icon from lucide-react with automatic fallback
 */
export const SafeIcon = ({
  name,
  size = 24,
  color = 'currentColor',
  className = '',
  strokeWidth = 2,
}) => {
  // ... весь код компонента ...
};

export default SafeIcon;
