import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { Provider } from 'react-redux';
import { setupStore } from './core/store/store';

import './core/localization/localization';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Suspense fallback={<div>loading...</div>}>
      <Provider store={setupStore()}>
        <App />
      </Provider>
    </Suspense>
  </React.StrictMode>
);
