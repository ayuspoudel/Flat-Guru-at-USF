import  { useState } from "react";
import PropTypes from 'prop-types';
import {
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { ChevronDown } from 'lucide-react';

const CheckoutForm = ({ dpmCheckerLink }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setIsLoading(true);
    
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://rental-service-backend.onrender.com/complete",
      },
    });
    
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occurred.");
    }
    
    setIsLoading(false);
  };

  return (
    <div >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="card-element" className="font-bold text-lg">
            Card number
          </label>
          <CardElement
            id="card-element"
            className="w-full p-3 border border-gray-300 rounded-md"
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#aab7c4',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
              },
            }}
          />
        </div>
        
        <div className="flex space-x-4">
          <div className="flex-1">
            <label htmlFor="expiry" className="font-bold text-lg">
              Expiration date
            </label>
            <input
              type="text"
              id="expiry"
              placeholder="MM / YY"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="cvc" className="font-bold text-lg">
              Security code
            </label>
            <input
              type="text"
              id="cvc"
              placeholder="CVC"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="country" className="font-bold text-lg">
            Country
          </label>
          <div className="relative">
            <select
              id="country"
              className="w-full p-3 border border-gray-300 rounded-md appearance-none"
            >
              <option>Nepal</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading || !stripe || !elements}
          className="w-full bg-blue-600 text-white p-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          {isLoading ? "Processing..." : "Pay now"}
        </button>
      </form>
      
      {message && <div className="mt-4 text-red-600">{message}</div>}
      
      <div className="font-bold text-lg">
        <p>
          Payment methods are dynamically displayed based on customer location, order amount, and currency.
        </p>
        {dpmCheckerLink && (
          <a href={dpmCheckerLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            Preview payment methods by transaction
          </a>
        )}
      </div>
    </div>
  );
};

CheckoutForm.propTypes = {
  dpmCheckerLink: PropTypes.string,
};

CheckoutForm.defaultProps = {
  dpmCheckerLink: '',
};

export default CheckoutForm;