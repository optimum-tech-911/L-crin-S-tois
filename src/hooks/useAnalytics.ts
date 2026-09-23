import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Placeholder for future analytics integration (e.g., GA4, Plausible).
 * Replace the console.log with your actual tracking logic.
 */
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (process.env.NODE_ENV !== 'production') {
    // console.log(`[Analytics Mock] Event: ${eventName}`, parameters);
  }
};

export function useAnalytics() {
  const location = useLocation();

  useEffect(() => {
    trackEvent('page_view', { path: location.pathname });
  }, [location]);
}
