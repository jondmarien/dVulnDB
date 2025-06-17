'use client';

import React, { forwardRef } from 'react';

export type ButtonProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    { children, startIcon, endIcon, ...props },
    ref
) {
    return (
        <button {...props} ref={ref}>
            {startIcon && <i className="wallet-adapter-button-start-icon">{startIcon}</i>}
            {children}
            {endIcon && <i className="wallet-adapter-button-end-icon">{endIcon}</i>}
        </button>
    );
});
