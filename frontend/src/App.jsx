
import { ChakraProvider } from '@chakra-ui/react'
import { theme } from 'helpers'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import {
  About,
  Cart,
  Checkout,
  Error,
  HomeLayout,
  Landing,
  Login,
  Orders,
  Products,
  Register,
  SingleProduct,
  CreatePost,
  CheckoutForm,
  CompletePage,
  UserProfile,
} from './pages';
import { ErrorElement } from './components';

// loaders
import { loader as landingLoader } from './pages/Landing';
import { loader as singleProductLoader } from './pages/SingleProduct';
import { loader as productsLoader } from './pages/Products';
import { loader as checkoutLoader } from './pages/Checkout';
import { loader as ordersLoader } from './pages/Orders';

// actions
import { action as registerAction } from './pages/Register';
import { action as loginAction } from './pages/Login';
import { action as checkoutAction } from './components/CheckoutForm';
import { store } from './store';
import PrivateRoute from './components/PrivateRoute';
import StripeWrapper from './components/StripeWrapperComponent';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
        errorElement: <ErrorElement />,
        loader: landingLoader(queryClient),
      },
      {
        path: 'products',
        element: <Products />,
        errorElement: <ErrorElement />,
        loader: productsLoader(queryClient),
      },
      {
        path: 'products/:id',
        element: <SingleProduct />,
        errorElement: <ErrorElement />,
        loader: singleProductLoader(queryClient),
      },
      {
        path: 'about',
        element: <About />
      },
      {
        path: 'cart',
        element: <PrivateRoute element={<Cart />} />,
      },
      {
        path: 'checkout',
        element: <PrivateRoute element={<Checkout />} />,
        loader: checkoutLoader(store),
        action: checkoutAction(store, queryClient),
      },
      {
        path: 'orders',
        element: <PrivateRoute element={<Orders />} />,
        loader: ordersLoader(store, queryClient),
      },
      {
        path:'userProfile',
        element: <PrivateRoute element={<UserProfile />} />,
      },
      {
        path: 'CreatePost',
        element: <PrivateRoute element={<CreatePost />} />,
      },
      {
        path: 'payment',
        element: (
          <PrivateRoute
            element={
              <StripeWrapper>
                <CheckoutForm />
              </StripeWrapper>
            }
          />
        ),
      },
      {
        path: 'complete',
        element: (
          <PrivateRoute
            element={
              <StripeWrapper>
                <CompletePage />
              </StripeWrapper>
            }
          />
        ),
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <Error />,
    action: loginAction(store),
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <Error />,
    action: registerAction,
  },
]);

export default function App() {
  return (

      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ChakraProvider>
    
  )
}