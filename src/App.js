import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import { store } from 'store';
import mainRouter from 'router/mainRouter';

function App() {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
        <RouterProvider router={mainRouter} />
      </GoogleOAuthProvider>
    </Provider>
  );
}

export default App;
