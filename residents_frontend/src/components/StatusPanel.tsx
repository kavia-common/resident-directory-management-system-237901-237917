import React from 'react';

export type StatusTone = 'ok' | 'warn' | 'error' | 'info';

export type StatusPanelProps = {
    tone: StatusTone;
    title: string;
    children?: React.ReactNode;
};

/**
 * PUBLIC_INTERFACE
 * Retro-styled status panel for communicating state (success/error/info).
 */
export default function StatusPanel(props: StatusPanelProps) {
    const { tone, title, children } = props;

    const className = ['statusPanel', `statusPanel_${tone}`].join(' ');

    return (
        <section className={className} role="status" aria-live="polite">
            <div className="statusPanelTitle">{title}</div>
            {children ? <div className="statusPanelBody">{children}</div> : null}
        </section>
    );
}
