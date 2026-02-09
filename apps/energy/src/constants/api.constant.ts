/**
 * Base URLs for API services.
 * Customize via env: VITE_API_URL, VITE_INDEXER_API_URL
 * Dev: INDEXER_BASE always /indexer-api (Vite proxy) to avoid CORS. Prod: use VITE_INDEXER_API_URL.
 */

export const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const INDEXER_BASE = import.meta.env.DEV ? '/indexer-api' : (import.meta.env.VITE_INDEXER_API_URL ?? '');
