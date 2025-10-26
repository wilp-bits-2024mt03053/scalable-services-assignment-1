import React, { useCallback, useContext } from 'react';
import { TrackerContext, useTracker } from 'react-user-tracker';

import { useVisitor } from './VisitorContext';

interface UseAppTrackerOptions {
  componentName: string;
  extraMetadata?: Record<string, unknown>;
}

type EventMetadata = Record<string, unknown>;

interface TrackerHandlers {
  onClick: (e: React.MouseEvent) => void;
  onMouseEnter: (e: React.MouseEvent) => void;
  onMouseLeave: (e: React.MouseEvent) => void;
}

interface UseAppTrackerResult extends TrackerHandlers {
  trackEvent: (eventType: string, metadata?: EventMetadata) => void;
}

/**
 * Custom hook for tracking events.
 * @param options { componentName, extraMetadata }
 * @returns tracking handlers and event tracking function
 */
export function useAppTracker(options: UseAppTrackerOptions): UseAppTrackerResult {
  const { componentName, extraMetadata = {} } = options;
  const tracker = useContext(TrackerContext);
  const baseProps = useTracker(componentName);
  const { visitor } = useVisitor();

  const handleEvent = useCallback(
    (eventType: string, metadata: EventMetadata = {}) => {
      if (!tracker) {
        console.warn('Tracker context is not available');
        return;
      }
      tracker.trackEvent({
        event_type: eventType,
        user_metadata: {
          ...visitor,
          ...extraMetadata,
          ...metadata,
        },
      });
    },
    [tracker, visitor, extraMetadata]
  );

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      baseProps.onClick?.(e);
      handleEvent('CLICK');
    },
    [baseProps, handleEvent]
  );

  const onMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      baseProps.onMouseEnter?.(e);
      handleEvent('HOVER_ENTER');
    },
    [baseProps, handleEvent]
  );

  const onMouseLeave = useCallback(
    (e: React.MouseEvent) => {
      baseProps.onMouseLeave?.(e);
      handleEvent('HOVER_LEAVE');
    },
    [baseProps, handleEvent]
  );

  return {
    onClick,
    onMouseEnter,
    onMouseLeave,
    trackEvent: handleEvent,
  };
}
