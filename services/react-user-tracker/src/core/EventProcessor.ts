import { TrackerConfig, UserEvent } from "./Types";

/**
 * Flushes a batch of user events to the backend endpoint or logs to console in debug mode.
 * Handles network errors gracefully and supports debug logging for development.
 * @param batch Array of UserEvent objects to send
 * @param config Tracker configuration
 * @returns Promise<void>
 * @example
 * await flushQueue(batch, config);
 */
export async function flushQueue(
  batch: UserEvent[],
  config: TrackerConfig,
): Promise<void> {
  if (config.debug) {
    console.log("[react-user-tracker] Debug mode - batch:", batch);
    return;
  }
  if (config.log) {
    console.log("[react-user-tracker] Log enabled - batch:", batch);
  }
  try {
    const response = await fetch(config.endpointUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        events: batch,
        appName: config.appName,
        appVersion: config.appVersion,
      }),
    });
    if (config.log) {
      console.log("[react-user-tracker] Response:", await response.text());
    }
  } catch (error) {
    console.error("[react-user-tracker] Failed to send batch:", error);
  }
}
