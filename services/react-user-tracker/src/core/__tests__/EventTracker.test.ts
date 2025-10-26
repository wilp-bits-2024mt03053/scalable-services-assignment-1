import { EventTracker } from "../EventTracker";
import { TrackerConfig } from "../Types";

describe("EventTracker", () => {
  const config: TrackerConfig = {
    endpointUrl: "http://localhost/api/events",
    batchSize: 2,
    flushInterval: 1000,
    appName: "TestApp",
    appVersion: "0.1.0",
    debug: true,
  };

  beforeEach(() => {
    const tracker = EventTracker.getInstance(config);
    tracker.clearQueue();
    tracker.setBatchSize(2);
  });

  it("should add events to the queue", () => {
    const tracker = EventTracker.getInstance();
    tracker.trackEvent({
      event_type: "CLICK",
      location_type: "COMPONENT",
      component_name: "Btn",
    });
    expect(tracker.getQueueSize()).toBe(1);
  });

  it("should clear the queue", () => {
    const tracker = EventTracker.getInstance();
    tracker.trackEvent({
      event_type: "CLICK",
      location_type: "COMPONENT",
      component_name: "Btn",
    });
    tracker.clearQueue();
    expect(tracker.getQueueSize()).toBe(0);
  });

  it("should flush the queue", async () => {
    const tracker = EventTracker.getInstance();
    tracker.trackEvent({
      event_type: "CLICK",
      location_type: "COMPONENT",
      component_name: "Btn",
    });
    tracker.trackEvent({
      event_type: "HOVER_ENTER",
      location_type: "COMPONENT",
      component_name: "Btn",
    });
    await tracker.flushQueue();
    expect(tracker.getQueueSize()).toBe(0);
  });

  it("should update batch size", () => {
    const tracker = EventTracker.getInstance();
    tracker.setBatchSize(5);
    expect((tracker as any).config.batchSize).toBe(5);
  });
});
