import React from 'react';

/**
 * Props for the IconWrapper component
 * @param lucideIcon - The lucide-react icon component to render
 * @param fallbackName - The name of the SVG file in assets/icons (without .svg extension)
 * @param className - Optional CSS classes for styling
 * @param size - Optional size in pixels (default: 24)
 */
interface IconWrapperProps {
  lucideIcon: React.ReactNode;
  fallbackName: string;
  className?: string;
  size?: number;
}

export const IconWrapper: React.FC<IconWrapperProps> = ({
  lucideIcon,
  fallbackName,
  className,
  size = 24,
}) => {
  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
      }}
    >
      {React.isValidElement(lucideIcon)
        ? React.cloneElement(lucideIcon as React.ReactElement<{ size?: number }>, {
            size,
          })
        : lucideIcon}
      <img
        src={`${import.meta.env.BASE_URL}assets/icons/${fallbackName}.svg`}
        alt={fallbackName}
        width={size}
        height={size}
        className={className}
        style={{ display: 'none' }}
        onError={() => console.warn(`Icon fallback failed: ${fallbackName}.svg`)}
      />
    </span>
  );
};
