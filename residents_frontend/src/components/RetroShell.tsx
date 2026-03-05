import React from 'react';

/**
 * Props for RetroShell component.
 */
export type RetroShellProps = {
    children: React.ReactNode;
};

/**
 * PUBLIC_INTERFACE
 * App shell providing a retro-themed frame, header, and consistent spacing.
 */
export default function RetroShell(props: RetroShellProps) {
    const { children } = props;

    return (
        <div className="shell">
            <header className="shellHeader">
                <div className="brand">
                    <div className="brandMark" aria-hidden="true">RD</div>
                    <div className="brandText">
                        <div className="brandTitle">Resident Directory</div>
                        <div className="brandSubtitle">Retro Console Edition</div>
                    </div>
                </div>

                <div className="headerMeta">
                    <span className="chip">App Router</span>
                    <span className="chip chipAccent">Next.js</span>
                </div>
            </header>

            <main className="shellMain">{children}</main>

            <footer className="shellFooter">
                <span>Tip: Configure <code>NEXT_PUBLIC_API_BASE_URL</code> to point at the backend.</span>
            </footer>
        </div>
    );
}
