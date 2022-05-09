import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  const handleOnClick = async () => {
    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: 'http://localhost:3000/success',
      }
    });

    if (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <PaymentElement id="payment-element" />
      <button onClick={() => handleOnClick()}>Pay now</button>
    </div>
  );
}