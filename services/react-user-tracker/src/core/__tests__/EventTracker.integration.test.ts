import { EventTracker } from '../EventTracker';
import { TrackerConfig } from '../Types';

describe('EventTracker Integration', () => {
  const config: TrackerConfig = {
    endpointUrl: 'http://localhost/api/events',
    batchSize: 2,
    flushInterval: 100,
    appName: 'TestApp',
    appVersion: '0.1.0',
    debug: true,
  };

  beforeEach(() => {
    const tracker = EventTracker.getInstance(config);
    tracker.clearQueue();
    tracker.setBatchSize(2);
  });

  it('should flush automatically when batch size is reached', async () => {
    const tracker = EventTracker.getInstance();
    const flushSpy = jest.spyOn(tracker, 'flushQueue');
    tracker.trackEvent({
      event_type: 'CLICK',
      location_type: 'COMPONENT',
      component_name: 'Btn',
    });
    tracker.trackEvent({
      event_type: 'HOVER_ENTER',
      location_type: 'COMPONENT',
      component_name: 'Btn',
    });
    expect(flushSpy).toHaveBeenCalled();
    flushSpy.mockRestore();
  });

  it('should flush after flushInterval if batch size not reached', async () => {
    jest.useFakeTimers();
    const tracker = EventTracker.getInstance();
    const flushSpy = jest.spyOn(tracker, 'flushQueue');
    tracker.trackEvent({
      event_type: 'CLICK',
      location_type: 'COMPONENT',
      component_name: 'Btn',
    });
    jest.advanceTimersByTime(config.flushInterval);
    expect(flushSpy).toHaveBeenCalled();
    flushSpy.mockRestore();
    jest.useRealTimers();
  });
});
