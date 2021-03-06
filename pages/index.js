import Head from 'next/head'
import styles from '../styles/Home.module.css'

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import CheckoutForm from './components/CheckoutForm';

import React, { useEffect, useState } from 'react';

export default function Home() {
  const [publishableKey, setPublishableKey] = useState('');
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    fetch('api/keys', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setPublishableKey(data.publishableKey);
      });

    fetch('api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      });

  }, []);

  if (!publishableKey) {
    return 'Loading...';
  }

  const stripe = loadStripe(publishableKey);

  const options = {
    clientSecret,
    appearance: {
      theme: 'flat',
      variables: {
        borderRadius: '10px',
      }
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Next.js Stripe Demo</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to my shop!
        </h1>
        <p>
          <form action="api/checkout" method="POST">
            <button type="submit">Check out</button>
          </form>
        </p>
        <hr style={{ "width": "100%" }} />
        <div>
          Pay with Stripe Elements
          {clientSecret && (
            <Elements options={options} stripe={stripe}>
              <CheckoutForm />
            </Elements>
          )}
        </div>
      </main>
    </div>
  )
}
