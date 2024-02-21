import './bootstrap';

import { createRoot } from 'react-dom/client';
import { hydrateRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import NProgress from 'nprogress'
import { router } from '@inertiajs/react'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const queryClient = new QueryClient()

createInertiaApp({
    progress: {
        color: '#4B5563',
        showSpinner:true
    },
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <QueryClientProvider client={queryClient}>
                <App {...props} />
            </QueryClientProvider>
        );
    },
});

router.on('start', () => NProgress.start())
router.on('finish', () => NProgress.done())
