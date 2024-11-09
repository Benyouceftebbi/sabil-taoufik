import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { SchoolProvider } from './context/SchoolContext';
import { SubscriptionProvider } from './context/SubscriptionContext';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <SchoolProvider>
      <SubscriptionProvider>
        <App />
      </SubscriptionProvider>
    </SchoolProvider>
  </React.StrictMode>
);