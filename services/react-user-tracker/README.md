# react-user-tracker

A highly scalable, modular, and performant user event tracking package for React, written in TypeScript. Decouples tracking logic from React using an asynchronous, batched queue system.

## Features

- Batched, async event tracking for React apps
- Decoupled core logic for easy integration
- Singleton tracker instance
- Configurable batching, endpoint, and debug mode
- React Context and hook for easy usage

## Installation

```sh
npm install react-user-tracker
```

## Usage

### 1. Setup Provider

```tsx
import { TrackerProvider } from 'react-user-tracker';

const trackerConfig = {
  endpointUrl: 'https://your-backend/api/events',
  batchSize: 50,
  flushInterval: 5000,
  appName: 'MyApp',
  appVersion: '0.1.2', // match your package version
  debug: false,
  log: true, // set to true to print all event batches and responses to console
};

<TrackerProvider config={trackerConfig}>
  <App />
</TrackerProvider>;
```

### 2. Track Component Events

```tsx
import { useTracker } from 'react-user-tracker';

const MyButton = () => {
  const tracker = useTracker('MyButton');
  return <button {...tracker}>Click Me</button>;
};
```

## API Reference & Examples

### TrackerConfig

Configuration for the event tracker.

```typescript
const config: TrackerConfig = {
  endpointUrl: 'https://api.example.com/events',
  batchSize: 50,
  flushInterval: 5000,
  appName: 'MyApp',
  appVersion: '1.0.0',
  debug: false,
};
```

### UserEvent

User event payload sent to the backend.

```typescript
const event: UserEvent = {
  timestamp: Date.now(),
  event_id: 'uuid-v4',
  event_type: 'CLICK',
  location_type: 'COMPONENT',
  component_name: 'MyButton',
  page_path: '/home',
  page_title: 'Home',
  dom_info: { tag: 'BUTTON', id: 'submit', className: 'btn', text: 'Click Me' },
  user_metadata: { userId: 123 },
};
```

### TrackerProps

Event handler props for tracking React component events.

```tsx
const trackerProps: TrackerProps = useTracker('MyButton');
<button {...trackerProps}>Click Me</button>;
```

### Core API & Usage Examples

#### EventTracker

Singleton class for managing user event queue and batching logic.

```typescript
import { EventTracker } from 'react-user-tracker';
import { TrackerConfig } from 'react-user-tracker';

const config: TrackerConfig = {
  endpointUrl: 'https://your-backend/api/events',
  batchSize: 50,
  flushInterval: 5000,
  appName: 'MyApp',
  appVersion: '1.0.0',
  debug: false,
};

// Get singleton instance
const tracker = EventTracker.getInstance(config);

// Track a custom event
tracker.trackEvent({
  event_type: 'CUSTOM_EVENT',
  location_type: 'PAGE',
  user_metadata: { foo: 'bar' },
});

// Manually flush the queue (send all events immediately)
await tracker.flushQueue();

// Clear all queued events
tracker.clearQueue();

// Get current queue size
const size = tracker.getQueueSize();

// Change batch size at runtime
tracker.setBatchSize(100);
```

#### flushQueue

Flushes a batch of user events to the backend endpoint or logs to console in debug mode.

```typescript
import { flushQueue } from 'react-user-tracker';
import { TrackerConfig, UserEvent } from 'react-user-tracker';

const batch: UserEvent[] = [
  /* ...events... */
];
const config: TrackerConfig = {
  /* ... */
};
await flushQueue(batch, config);
```

#### React Integration

##### TrackerProvider

```tsx
import { TrackerProvider } from 'react-user-tracker';

const trackerConfig = {
  /* ...see above... */
};

<TrackerProvider config={trackerConfig}>
  <App />
</TrackerProvider>;
```

##### useTracker

```tsx
import { useTracker } from 'react-user-tracker';

const MyButton = () => {
  const tracker = useTracker('MyButton');
  return <button {...tracker}>Click Me</button>;
};
```

## License

MIT
