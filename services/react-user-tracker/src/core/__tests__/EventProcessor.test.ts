import { flushQueue } from '../EventProcessor';
import { TrackerConfig, UserEvent } from '../Types';

describe('flushQueue', () => {
  const config: TrackerConfig = {
    endpointUrl: 'http://localhost/api/events',
    batchSize: 2,
    flushInterval: 1000,
    appName: 'TestApp',
    appVersion: '0.1.0',
    debug: true,
  };

  it('should resolve immediately in debug mode and log batch', async () => {
    const batch: UserEvent[] = [
      {
        timestamp: Date.now(),
        event_id: 'uuid',
        event_type: 'CLICK',
        location_type: 'COMPONENT',
        component_name: 'Btn',
        page_path: '/',
        page_title: 'Home',
        user_metadata: {},
      },
    ];
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await flushQueue(batch, config);
    expect(logSpy).toHaveBeenCalledWith(
      '[react-user-tracker] Debug mode - batch:',
      batch
    );
    logSpy.mockRestore();
  });

  it('should handle network errors gracefully', async () => {
    const errorConfig = {
      ...config,
      debug: false,
      endpointUrl: 'http://invalid-url',
    };
    const batch: UserEvent[] = [
      {
        timestamp: Date.now(),
        event_id: 'uuid',
        event_type: 'CLICK',
        location_type: 'COMPONENT',
        component_name: 'Btn',
        page_path: '/',
        page_title: 'Home',
        user_metadata: {},
      },
    ];
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await flushQueue(batch, errorConfig);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
