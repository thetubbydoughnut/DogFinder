import { MetricType, ReportHandler } from 'web-vitals';

// Function to send metrics to an analytics service
export const sendToAnalytics = (metric: {
  id: string;
  name: string;
  value: number;
  delta?: number;
}): void => {
  // Log metrics in development
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }

  // In production, you would send these metrics to your analytics service
  // Example for Google Analytics:
  // if (typeof window.gtag === 'function') {
  //   window.gtag('event', name, {
  //     event_category: 'Web Vitals',
  //     event_label: id,
  //     value: Math.round(name === 'CLS' ? value * 1000 : value),
  //     non_interaction: true,
  //   });
  // }

  // You can also implement your own backend endpoint for collecting these metrics
  // const body = JSON.stringify({ name: metric.name, value: metric.value, id: metric.id });
  // navigator.sendBeacon('/api/vitals', body);
};

// Helper function to track a custom performance metric
export const trackTiming = (
  metricName: string,
  durationMs: number,
  properties?: Record<string, string | number | boolean>
): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Timing: ${metricName}`, durationMs, properties);
  }

  // In production, send these custom metrics to your analytics service
};

// Helper to track user interactions
export const trackEvent = (
  eventName: string,
  properties?: Record<string, string | number | boolean>
): void => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Event: ${eventName}`, properties);
  }

  // In production, send these events to your analytics service
}; 