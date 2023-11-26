## [@gashon/analytics](https://www.npmjs.com/package/@gashon/analytics)

A React-based analytics tool for easy integration and tracking of analytics data in React applications.

### Installation

```bash
npm install @gashon/analytics
```

Or using yarn:

```bash
yarn add @gashon/analytics
```

Usage
`@gashon/analytics` offers two primary exports: `Analytics` and `useAnalytics`, with added support for browser fingerprinting and session tracking.

### 1. Analytics Component

Import and use the `Analytics` component in your application to automatically send analytics data on page mount.

```jsx
import React from 'react';
import { Analytics } from '@gashon/analytics';

function App() {
  return (
    <div>
      <Analytics
        apiKey="YOUR_API_KEY"
        endpoint="YOUR_ENDPOINT_URL"
        metadata={{ cookie: document.cookie }}
        debug
        trackSession
        fingerprintBrowser
        trackClickEvents
      />
      {/* Your application components */}
    </div>
  );
}

export default App;
```

Props  
`apiKey`: String - Your unique API key for authentication.  
`endpoint`: String - The URL to which analytics data is sent.  
`debug`: Boolean (optional) - Enables debug mode for additional logging.  
`metadata`: Record<\String, String> (optional) - Optional metadata to associate with a request. \
`trackClickEvents`: Boolean (default false) - Enables click event tracking. \
`trackSession`: Boolean (default true) - Enables session tracking.\
`fingerprintBrowser`: Boolean (default true) - Enables browser fingerprinting for unique user identification.

### 2. useAnalytics Hook

For more control, use the `useAnalytics` hook. This allows you to send analytics data programmatically, with options for session tracking and browser fingerprinting.

```jsx
import React, { useEffect } from 'react';
import { useAnalytics } from '@gashon/analytics';

function MyComponent() {
  const { data, error, isFetching } = useAnalytics({
    apiKey: 'YOUR_API_KEY',
    endpoint: 'YOUR_ENDPOINT_URL',
    metadata: { userId },
    trackClickEvents: true,
    fingerprintBrowser: false,
  });

  useEffect(() => {
    // You can use the data, error, and isFetching states here
  }, [data, error, isFetching]);

  return <div>My Component</div>;
}

export default MyComponent;
```

### Click Event Tracking

To enable click event tracking, set trackClickEvents to true in your Analytics component or useAnalytics hook. Attach a `data-tracking-label` attribute to any HTML element you wish to track. When the element is clicked, a payload containing the label and additional click data is sent to your specified endpoint.

### API

`useAnalytics<T>(config: FetchData): UseAnalytics<T>`

Parameters  
`config`: Object  
`apiKey`: String - Your API key.  
`endpoint`: String - The endpoint URL.  
`metadata`: Record<String, String> - Optional analytics metadata.  
`trackSession`: Boolean (default true) - Enables session tracking. \
`trackClickEvents`: Boolean (default false) - Enables click event tracking. \
`fingerprintBrowser`: Boolean (default true) - Enables browser fingerprinting. \
Returns  
An object containing:

`data`: T | null - The response data.  
`error`: Error | null - Any error encountered during the request.  
`isFetching`: boolean - Indicates if the request is in progress.

### Custom Headers

Additional header information is prefixed with `x-` and can be used to identify requests from the analytics tool.

#### Supported Headers

- `x-path-name`: `window.location.pathname` (path of the viewed page)
- `x-api-key`: apiKey param
- `x-checksum`: A sha1 hash of the request payload (JSON.stringy(payload)) for simple bot mitigation.

License  
This project is licensed under the MIT License.
