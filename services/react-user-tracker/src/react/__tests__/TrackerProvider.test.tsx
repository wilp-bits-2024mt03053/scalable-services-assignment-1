import React from 'react';

import { render } from '@testing-library/react';

import { TrackerConfig } from '../../core/Types';
import { TrackerContext } from '../TrackerContext';
import { TrackerProvider } from '../TrackerProvider';

describe('TrackerProvider', () => {
  const config: TrackerConfig = {
    endpointUrl: 'http://localhost/api/events',
    batchSize: 2,
    flushInterval: 1000,
    appName: 'TestApp',
    appVersion: '0.1.0',
    debug: true,
  };

  it('should provide TrackerContext to children', () => {
    let contextValue = null;
    const TestComponent = () => {
      contextValue = React.useContext(TrackerContext);
      return <div>Test</div>;
    };
    render(
      <TrackerProvider config={config}>
        <TestComponent />
      </TrackerProvider>
    );
    expect(contextValue).not.toBeNull();
  });

  it('should attach and cleanup global click listener', () => {
    const addSpy = jest.spyOn(document, 'addEventListener');
    const removeSpy = jest.spyOn(document, 'removeEventListener');
    const { unmount } = render(
      <TrackerProvider config={config}>
        <div>Test</div>
      </TrackerProvider>
    );
    expect(addSpy).toHaveBeenCalledWith('click', expect.any(Function));
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('click', expect.any(Function));
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
