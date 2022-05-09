import Stripe from 'stripe';

export default async function handler(req, res) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  if (req.method === 'POST') {
    try {
      const session = await stripe.checkout.sessions.create({
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: 1000,
              product_data: {
                name: 'Bananas',
              }
            },
            quantity: 1,
          }
        ],
        mode: 'payment',
      });
      res.redirect(303, session.url);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.status(405).end('Method not allowed');
  }
}