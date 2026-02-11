/**
 * SafeIcon Component - Dynamic icon component with full Lucide React support
 */
import SafeIcon from './components/SafeIcon';
import React from 'react';
import * as LucideIcons from 'lucide-react';

const kebabToPascal = (str) => {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
};

const SafeIcon = ({ name, size = 24, className = '', ...props }) => {
  if (!name) return <LucideIcons.HelpCircle size={size} className={className} {...props} />;
  
  const pascalName = kebabToPascal(name);
  const IconComponent = LucideIcons[pascalName] || LucideIcons[name];
  
  if (!IconComponent) {
    console.warn(`SafeIcon: icon "${name}" not found, using fallback`);
    return <LucideIcons.HelpCircle size={size} className={className} {...props} />;
  }
  
  return <IconComponent size={size} className={className} {...props} />;
};

export default SafeIcon;
