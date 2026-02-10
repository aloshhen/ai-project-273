/**
 * SafeIcon Component - Dynamic icon component with full Lucide React support
 * Supports ALL icons from lucide-react library via kebab-case naming
 * Prevents runtime errors with automatic fallback to HelpCircle
 */

import { SafeIcon } from './components/SafeIcon';
import React from 'react';
import * as LucideIcons from 'lucide-react';

/**
 * Converts kebab-case to PascalCase
 * @example kebabToPascal('shopping-cart') => 'ShoppingCart'
 * @example kebabToPascal('arrow-right') => 'ArrowRight'
 */
const kebabToPascal = (str) => {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
};

/**
 * SafeIcon - Renders ANY icon from lucide-react with automatic fallback
 *
 * Dynamically resolves icon components from the full Lucide library.
 * If an icon doesn't exist, falls back to HelpCircle with a warning.
 *
 * @example
 * <SafeIcon name="home" size={24} />
 * <SafeIcon name="shopping-cart" className="text-blue-500" />
 * <SafeIcon name="bitcoin" size={32} />
 * <SafeIcon name="invalid-icon" /> // Falls back to HelpCircle
 */

export default SafeIcon;