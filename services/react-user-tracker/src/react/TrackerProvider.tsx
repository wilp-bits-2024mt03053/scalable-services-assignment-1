import React, { useEffect, useMemo } from "react";

import { EventTracker } from "../core/EventTracker";
import { TrackerConfig } from "../core/Types";
import { TrackerContext } from "./TrackerContext";

/**
 * Props for TrackerProvider component.
 * @property config - TrackerConfig for initializing the tracker
 * @property children - React children to wrap with tracking context
 */
interface TrackerProviderProps {
  config: TrackerConfig;
  children: React.ReactNode;
}

/**
 * TrackerProvider sets up global event tracking and provides the tracker via React Context.
 * Place at the root of your app for full coverage.
 * @param config TrackerConfig
 * @param children React children
 * @returns JSX.Element
 * @example
 * <TrackerProvider config={config}><App /></TrackerProvider>
 */
export const TrackerProvider: React.FC<TrackerProviderProps> = ({
  config,
  children,
}) => {
  const tracker = useMemo(() => EventTracker.getInstance(config), [config]);

  useEffect(() => {
    const handlePageClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const dom_info = {
        tag: target.tagName,
        id: target.id,
        className: target.className,
        text: target.textContent || "",
      };
      tracker.trackEvent({
        event_type: "CLICK",
        location_type: "PAGE",
        dom_info,
      });
    };
    document.addEventListener("click", handlePageClick);
    return () => {
      document.removeEventListener("click", handlePageClick);
    };
  }, [tracker]);

  return (
    <TrackerContext.Provider value={tracker}>
      {children}
    </TrackerContext.Provider>
  );
};
