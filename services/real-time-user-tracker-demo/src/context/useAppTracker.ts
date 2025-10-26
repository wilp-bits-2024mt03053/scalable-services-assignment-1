import { useContext } from 'react';
import { TrackerContext, useTracker } from 'react-user-tracker';

interface UseAppTrackerOptions {
  componentName: string;
  extraMetadata?: Record<string, unknown>;
}

type EventMetadata = Record<string, unknown>;

/**
 * Custom hook for tracking events.
 * @param options { componentName, extraMetadata }
 * @returns event handlers
 */
export function useAppTracker(options: UseAppTrackerOptions) {
  const { componentName, extraMetadata = {} } = options;
  const tracker = useContext(TrackerContext);
  const trackerProps = useTracker(componentName);

  const enhancedHandlers = {
    onClick: (
      eventOrMetadata: React.MouseEvent | EventMetadata,
      customMetadata?: EventMetadata
    ) => {
      try {
        if ('nativeEvent' in eventOrMetadata) {
          // It's a React.MouseEvent, so we can safely cast it.
          const mouseEvent = eventOrMetadata as React.MouseEvent;
          if (typeof trackerProps.onClick === 'function') {
            trackerProps.onClick(mouseEvent);
          }
          tracker?.trackEvent({ event_type: 'CLICK', ...extraMetadata, ...customMetadata });
        } else {
          // It's custom metadata
          tracker?.trackEvent({ ...eventOrMetadata, ...extraMetadata });
        }
      } catch (error) {
        console.warn('Error in onClick handler:', error);
      }
    },
    onMouseEnter: (e: React.MouseEvent) => {
      try {
        if (typeof trackerProps.onMouseEnter === 'function') {
          trackerProps.onMouseEnter(e);
        }
        tracker?.trackEvent({ event_type: 'HOVER_ENTER', ...extraMetadata });
      } catch (error) {
        console.warn('Error in onMouseEnter handler:', error);
      }
    },
    onMouseLeave: (e: React.MouseEvent) => {
      try {
        if (typeof trackerProps.onMouseLeave === 'function') {
          trackerProps.onMouseLeave(e);
        }
        tracker?.trackEvent({ event_type: 'HOVER_LEAVE', ...extraMetadata });
      } catch (error) {
        console.warn('Error in onMouseLeave handler:', error);
      }
    },
    // Expose trackEvent directly as well
    trackEvent: tracker?.trackEvent,
  };

  return enhancedHandlers;
}
