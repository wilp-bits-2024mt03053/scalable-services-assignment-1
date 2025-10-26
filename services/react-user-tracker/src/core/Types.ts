/**
 * Configuration for the event tracker.
 * Controls batching, endpoint, app context, and debug mode.
 * @property endpointUrl - Backend API URL for event delivery
 * @property batchSize - Number of events per batch
 * @property flushInterval - Time in ms to flush events if batch not reached
 * @property appName - Application name for context
 * @property appVersion - Application version for context
 * @property debug - If true, logs events to console instead of sending
 * @property log - If true, prints all batches and network responses to console
 * @example
 * const config: TrackerConfig = {
 *   endpointUrl: 'https://api.example.com/events',
 *   batchSize: 50,
 *   flushInterval: 5000,
 *   appName: 'MyApp',
 *   appVersion: '1.0.0',
 *   debug: false,
 *   log: false,
 * };
 */
export interface TrackerConfig {
  endpointUrl: string;
  batchSize: number;
  flushInterval: number;
  appName: string;
  appVersion: string;
  debug: boolean;
  log?: boolean;
}

/**
 * User event payload sent to the backend.
 * Contains all metadata for analytics and tracking.
 * @property timestamp - Unix ms timestamp of event
 * @property event_id - UUID v4 for event uniqueness
 * @property event_type - Event type string (e.g., 'CLICK')
 * @property location_type - 'COMPONENT' or 'PAGE'
 * @property component_name - Name of the component (if applicable)
 * @property page_path - Current page path
 * @property page_title - Current page title
 * @property dom_info - DOM metadata for page-level events
 * @property user_metadata - Custom user data
 * @example
 * const event: UserEvent = {
 *   timestamp: Date.now(),
 *   event_id: 'uuid-v4',
 *   event_type: 'CLICK',
 *   location_type: 'COMPONENT',
 *   component_name: 'MyButton',
 *   page_path: '/home',
 *   page_title: 'Home',
 *   dom_info: { tag: 'BUTTON', id: 'submit', className: 'btn', text: 'Click Me' },
 *   user_metadata: { userId: 123 },
 * };
 */
export interface UserEvent {
  timestamp: number;
  event_id: string;
  event_type: "CLICK" | "HOVER_ENTER" | "HOVER_LEAVE" | "PAGE_VIEW" | string;
  location_type: "COMPONENT" | "PAGE";
  component_name?: string;
  page_path: string;
  page_title: string;
  dom_info?: {
    tag: string;
    id?: string;
    className?: string;
    text?: string;
  };
  user_metadata: Record<string, any>;
}

/**
 * Event handler props for tracking React component events.
 * Use with {...trackerProps} on any React element.
 * @property onClick - Click event handler
 * @property onMouseEnter - Mouse enter event handler
 * @property onMouseLeave - Mouse leave event handler
 * @example
 * <button {...trackerProps}>Click Me</button>
 */
export interface TrackerProps {
  onClick: (e: React.MouseEvent<any>) => void;
  onMouseEnter: (e: React.MouseEvent<any>) => void;
  onMouseLeave: (e: React.MouseEvent<any>) => void;
}
