import Razorpay from 'razorpay'

const PROVIDER_CONFIG = process.env.PAYMENT_PROVIDER || 'dev'

let razorpayClient

if (
  PROVIDER_CONFIG === 'razorpay' &&
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_SECRET
) {
  razorpayClient = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
}

export function getPaymentProvider() {
  if (razorpayClient) {
    return 'razorpay'
  }
  return 'dev'
}

export async function createProviderOrder({ amount, currency, receipt }) {
  const provider = getPaymentProvider()

  if (provider === 'razorpay' && razorpayClient) {
    const order = await razorpayClient.orders.create({
      amount: amount * 100,
      currency,
      receipt,
    })

    return {
      provider,
      providerOrderId: order?.id,
    }
  }

  return {
    provider: 'dev',
    providerOrderId: `dev_${receipt}`,
  }
}

