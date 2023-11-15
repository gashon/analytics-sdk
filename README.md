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
`@gashon/analytics` offers two primary exports: `Analytics` and `useAnalytics`.

### 1. Analytics Component

Import and use the `Analytics` component in your application to automatically send analytics data on page mount.

```jsx
import React from 'react';
import { Analytics } from '@gashon/analytics';

function App() {
  return (
    <div>
      <Analytics apiKey="YOUR_API_KEY" endpoint="YOUR_ENDPOINT_URL" metadata={{ cookie: document.cookie }} debug />
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
`metadata`: Record<\String, String> (optional) - Optional metadata to associate with a request.  

### 2. useAnalytics Hook

For more control, use the `useAnalytics` hook. This allows you to send analytics data programmatically.

```jsx
import React, { useEffect } from 'react';
import { useAnalytics } from '@gashon/analytics';

function MyComponent() {
  const { data, error, isFetching } = useAnalytics({
    apiKey: 'YOUR_API_KEY',
    endpoint: 'YOUR_ENDPOINT_URL',
    metadata: { userId },
  });

  useEffect(() => {
    // You can use the data, error, and isFetching states here
  }, [data, error, isFetching]);

  return <div>My Component</div>;
}

export default MyComponent;
```

### API

`useAnalytics<T>(config: FetchData): UseAnalytics<T>`

Parameters  
`config`: Object  
`apiKey`: String - Your API key.  
`endpoint`: String - The endpoint URL.  
`metadata`: Record<String, String> - Optional analytics metadata.  
Returns  
An object containing:  

`data`: T | null - The response data.  
`error`: Error | null - Any error encountered during the request.  
`isFetching`: boolean - Indicates if the request is in progress.  

License  
This project is licensed under the MIT License.  
