import  { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from 'axios';

const stripePromise = loadStripe('pk_test_51PGyxvSCF9cPyeh95JcNV0tcwBPk9jeqdZF2zBgN73ROrVAwiXzOM6MjiEwvwl2hA8BXLaP0FrFrvCQ7tcvwXGz300egDWR0kT');

function StripeWrapper({ children }) {
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    async function createPaymentIntent() {
      try {
        const response = await axios.post(
          "https://rental-service-backend.onrender.com/api/v1/stripe/create-payment-intent",
          { amount: 1000 },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
        setError("Failed to initialize payment. Please try again later.");
      }
    }

    createPaymentIntent();
  }, []);

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!clientSecret) {
    return <div>Loading payment system...</div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      {children}
    </Elements>
  );
}

StripeWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StripeWrapper;
