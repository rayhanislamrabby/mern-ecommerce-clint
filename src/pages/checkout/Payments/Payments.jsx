import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useLocation, Navigate } from "react-router-dom";
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe(import.meta.env.VITE_payment_key);

const Payments = () => {
  const location = useLocation();

  const orderInfo = location.state?.orderInfo;
  const clientSecret = location.state?.clientSecret;
  const totalAmount = orderInfo?.totalAmount;

  if (!orderInfo || !clientSecret) return <Navigate to="/" />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <Elements stripe={stripePromise}>
        <PaymentForm
          price={totalAmount}
          orderInfo={orderInfo}
          clientSecret={clientSecret}
        />
      </Elements>
    </div>
  );
};

export default Payments;
