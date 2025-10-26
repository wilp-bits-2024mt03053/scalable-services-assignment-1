import { useCallback, useContext } from "react";

import { TrackerProps } from "../core/Types";
import { TrackerContext } from "./TrackerContext";

/**
 * useTracker hook returns event handler props for tracking user interactions on a component.
 * @param componentName Name of the component to track
 * @returns TrackerProps (event handlers)
 * @example
 * const tracker = useTracker('MyButton');
 * <button {...tracker}>Click Me</button>
 */
export const useTracker = (componentName: string): TrackerProps => {
  const tracker = useContext(TrackerContext);

  const track = useCallback(
    (event_type: string, e: React.MouseEvent<any>) => {
      tracker?.trackEvent({
        event_type,
        location_type: "COMPONENT",
        component_name: componentName,
        user_metadata: {},
      });
    },
    [tracker, componentName],
  );

  return {
    onClick: (e) => track("CLICK", e),
    onMouseEnter: (e) => track("HOVER_ENTER", e),
    onMouseLeave: (e) => track("HOVER_LEAVE", e),
  };
};
