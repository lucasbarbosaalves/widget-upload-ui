import type { ComponentProps } from 'react';

type ButtonSize = 'default' | 'icon' | 'icon-sm';

interface ButtonProps extends ComponentProps<'button'> {
  size?: ButtonSize;
}

export function Button({ size = 'default', className, ...props }: ButtonProps) {
  const sizeClass = `btn-${size}`;

  const classes = ['button', sizeClass, className].filter(Boolean).join(' ');

  return <button className={classes} {...props} />;
}
