import { useSelector } from 'react-redux';
import { CartItemsList, SectionTitle, CartTotals } from '../components';
import { Link, Navigate } from 'react-router-dom';

const Cart = () => {
  const user = useSelector((state) => state.userState.user);
  const numItemsInCart = useSelector((state) => state.cartState.numItemsInCart);

  // Redirect to login if user is not logged in
  if (!user) {
    return <Navigate to='/login' replace />;
  }

  // Handle empty cart case
  if (numItemsInCart === 0) {
    return <SectionTitle text='Your cart is empty' />;
  }

  return (
    <>
      <SectionTitle text='Shopping Cart' />
      <div className='mt-8 grid gap-8 lg:grid-cols-12'>
        <div className='lg:col-span-8'>
          <CartItemsList />
        </div>
        <div className='lg:col-span-4 lg:pl-4'>
          <CartTotals />
          <Link to='/checkout' className='btn btn-primary btn-block mt-8'>
            Proceed to Payment
          </Link>
        </div>
      </div>
    </>
  );
};

export default Cart;
