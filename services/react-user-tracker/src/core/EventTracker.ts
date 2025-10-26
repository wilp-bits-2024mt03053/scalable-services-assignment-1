import { v4 as uuidv4 } from "uuid";

import { flushQueue } from "./EventProcessor";
import { TrackerConfig, UserEvent } from "./Types";

export class EventTracker {
  private static instance: EventTracker | null = null;
  private eventQueue: UserEvent[] = [];
  private timer: ReturnType<typeof setTimeout> | null = null;
  private config: TrackerConfig;

  private constructor(config: TrackerConfig) {
    this.config = config;
  }

  /**
   * Returns the singleton instance of EventTracker.
   * Ensures only one tracker exists per app lifecycle.
   * @param config Optional TrackerConfig for initialization (required on first call)
   * @returns {EventTracker} Singleton instance
   * @throws {Error} If config is not provided on first call
   * @example
   * const tracker = EventTracker.getInstance(config);
   */
  public static getInstance(config?: TrackerConfig): EventTracker {
    if (!EventTracker.instance) {
      if (!config) throw new Error("TrackerConfig required for initialization");
      EventTracker.instance = new EventTracker(config);
    }
    return EventTracker.instance;
  }

  /**
   * Tracks a user event, enriches it with global context, and adds to the queue.
   * @param event Partial UserEvent data (can omit timestamp, event_id, page info)
   * @returns void
   * @example
   * tracker.trackEvent({ event_type: 'CLICK', location_type: 'COMPONENT', component_name: 'Btn' });
   */
  public trackEvent(event: Partial<UserEvent>): void {
    const enriched: UserEvent = {
      ...event,
      timestamp: Date.now(),
      event_id: uuidv4(),
      page_path: window.location.pathname,
      page_title: document.title,
      user_metadata: event.user_metadata || {},
      event_type: event.event_type || "UNKNOWN",
      location_type: event.location_type || "PAGE",
    } as UserEvent;
    this.eventQueue.push(enriched);
    this.checkAndFlush();
  }

  /**
   * Checks if the queue should be flushed immediately or schedules a flush.
   * Internal throttling logic for batch delivery.
   * @private
   */
  private checkAndFlush(): void {
    if (this.eventQueue.length >= this.config.batchSize) {
      this.flushQueue();
      return;
    }
    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.flushQueue();
      }, this.config.flushInterval);
    }
  }

  /**
   * Immediately flushes the event queue by sending all events to the EventProcessor.
   * Can be called manually or by internal logic.
   * @returns Promise<void>
   * @example
   * await tracker.flushQueue();
   */
  public async flushQueue(): Promise<void> {
    if (this.eventQueue.length === 0) return;
    const batch = this.eventQueue.slice(0, this.config.batchSize);
    await flushQueue(batch, this.config);
    this.eventQueue.splice(0, batch.length);
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  /**
   * Clears all events from the queue and cancels any pending flush timer.
   * @returns void
   * @example
   * tracker.clearQueue();
   */
  public clearQueue(): void {
    this.eventQueue = [];
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  /**
   * Returns the current size of the event queue.
   * @returns number
   * @example
   * const size = tracker.getQueueSize();
   */
  public getQueueSize(): number {
    return this.eventQueue.length;
  }

  /**
   * Updates the batch size in the tracker config.
   * @param size New batch size
   * @returns void
   * @example
   * tracker.setBatchSize(100);
   */
  public setBatchSize(size: number): void {
    this.config.batchSize = size;
  }
}
