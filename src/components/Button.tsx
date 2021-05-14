import classNames from 'classnames';
import React from 'react';

export enum ButtonVariant {
  Primary,
  Danger,
}

interface ButtonProps {
  children: string;
  variant: ButtonVariant;
  onClick: () => void;
}

const Button: React.FunctionComponent<ButtonProps> = ({ children, variant, onClick }) => (
  <button
    onClick={onClick}
    className={classNames('btn', {
      'btn-outline-primary': variant === ButtonVariant.Primary,
      'btn-outline-danger': variant === ButtonVariant.Danger,
    })}
  >
    {children}
  </button>
);

export default Button;
