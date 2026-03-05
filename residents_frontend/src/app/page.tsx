'use client';

import React, { useEffect, useMemo, useState } from 'react';
import RetroShell from '@/components/RetroShell';
import StatusPanel from '@/components/StatusPanel';
import { ApiError, getApiBaseUrl, healthCheck } from '@/lib/apiClient';

type HealthState =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'ok'; data: unknown }
    | { status: 'error'; message: string; details?: unknown };

/**
 * PUBLIC_INTERFACE
 * Home page showing a retro dashboard and verifying backend connectivity.
 */
export default function HomePage() {
    const [health, setHealth] = useState<HealthState>({ status: 'idle' });
    const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);

    useEffect(() => {
        let isMounted = true;

        async function runHealthCheck() {
            setHealth({ status: 'loading' });
            try {
                const data = await healthCheck();
                if (!isMounted) return;
                setHealth({ status: 'ok', data });
            } catch (err) {
                if (!isMounted) return;

                if (err instanceof ApiError) {
                    setHealth({
                        status: 'error',
                        message: `Backend error (${err.status})`,
                        details: err.details,
                    });
                    return;
                }

                const message = err instanceof Error ? err.message : 'Unknown error';
                setHealth({ status: 'error', message });
            }
        }

        void runHealthCheck();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <RetroShell>
            <section className="card" aria-labelledby="home-title">
                <h1 id="home-title" className="h1">Directory Console</h1>
                <p className="p" style={{ marginTop: 8 }}>
                    This frontend uses browser-side <code className="mono">fetch</code> to call the backend.
                </p>

                <div style={{ marginTop: 16 }} className="kv" aria-label="Environment and connection details">
                    <div className="k">API Base URL</div>
                    <div className="v"><code className="mono">{apiBaseUrl}</code></div>

                    <div className="k">Backend Endpoint</div>
                    <div className="v"><code className="mono">GET /</code> (health check)</div>

                    <div className="k">Status</div>
                    <div className="v">
                        {health.status === 'idle' ? 'Idle' : null}
                        {health.status === 'loading' ? 'Checking…' : null}
                        {health.status === 'ok' ? 'Connected' : null}
                        {health.status === 'error' ? 'Error' : null}
                    </div>
                </div>

                <div style={{ marginTop: 14 }}>
                    {health.status === 'loading' ? (
                        <StatusPanel tone="info" title="Connecting">
                            Attempting to reach the backend at <code className="mono">{apiBaseUrl}</code>.
                        </StatusPanel>
                    ) : null}

                    {health.status === 'ok' ? (
                        <StatusPanel tone="ok" title="Backend reachable">
                            <div className="p">Raw response:</div>
                            <pre aria-label="Backend health response">
                                {JSON.stringify(health.data, null, 2)}
                            </pre>
                        </StatusPanel>
                    ) : null}

                    {health.status === 'error' ? (
                        <StatusPanel tone="error" title="Could not reach backend">
                            <div className="p">
                                {health.message}
                            </div>
                            {health.details ? (
                                <>
                                    <div className="p" style={{ marginTop: 10 }}>Details:</div>
                                    <pre aria-label="Error details">
                                        {JSON.stringify(health.details, null, 2)}
                                    </pre>
                                </>
                            ) : null}
                            <div className="p" style={{ marginTop: 10 }}>
                                Ensure <code className="mono">NEXT_PUBLIC_API_BASE_URL</code> is set and CORS is enabled on the backend.
                            </div>
                        </StatusPanel>
                    ) : null}
                </div>

                <div style={{ marginTop: 16 }} className="buttonRow">
                    <button
                        type="button"
                        className="btn"
                        onClick={() => {
                            // Simple client-side refresh to re-run the health check effect.
                            window.location.reload();
                        }}
                    >
                        Re-run Check
                    </button>

                    <a className="btn btnSecondary" href="/not-a-real-page">
                        Test 404
                    </a>

                    <a className="btn btnSecondary" href={`${apiBaseUrl}/docs`} target="_blank" rel="noreferrer">
                        Open Backend Docs
                    </a>
                </div>
            </section>
        </RetroShell>
    );
}
