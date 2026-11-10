import { forwardRef } from 'react';

/**
 * Variants:
 *  - "menu"    (default) text button; `selected` gives the slanted red bar
 *  - "outline" secondary bordered button (e.g. MENU in the pop-up)
 *  - "back"    small back link with a left arrow
 * `cursor={false}` hides the pixel cursor arrow on menu buttons.
 */
const Button = forwardRef(function Button(
  { variant = 'menu', selected = false, cursor = true, className = '', children, ...rest },
  ref
) {
  if (variant === 'outline') {
    return <button ref={ref} className={`btn-outline ${className}`.trim()} {...rest}>{children}</button>;
  }
  if (variant === 'back') {
    return <button ref={ref} className={`back ${className}`.trim()} {...rest}>{children}</button>;
  }
  return (
    <button
      ref={ref}
      className={`menu-btn${selected ? ' is-selected' : ''} ${className}`.trim()}
      {...rest}
    >
      {cursor && <span className="cursor" aria-hidden="true" />}
      {children}
    </button>
  );
});

export default Button;