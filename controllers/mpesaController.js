import { stkPush } from "../services/mpesaService.js";

// Normalize phone number to 2547XXXXXXXX
const normalizePhone = (p) => {
  const digits = String(p).replace(/\D/g, "");
  if (digits.startsWith("07")) return "254" + digits.slice(1);
  if (digits.startsWith("7")) return "254" + digits;
  if (digits.startsWith("254")) return digits;
  if (digits.startsWith("+254")) return digits.slice(1);
  return null;
};

// Trigger STK Push
export const initiatePayment = async (req, res) => {
  try {
    const { phone, amount } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({ error: "Phone and amount are required" });
    }

    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt < 1) {
      return res.status(400).json({ error: "Amount must be a number >= 1" });
    }

    const msisdn = normalizePhone(phone);
    if (!msisdn) {
      return res.status(400).json({ error: "Invalid phone format. Use 2547XXXXXXXX" });
    }

    const response = await stkPush(msisdn, amt);
    return res.json(response);
  } catch (err) {
    console.error("❌ M-Pesa Error:", err.response?.data || err.message);

    return res.status(err.response?.status || 500).json({
      error: "Payment initiation failed",
      details: err.response?.data || { message: err.message },
    });
  }
};

// Handle Safaricom Callback
export const handleCallback = (req, res) => {
  console.log("📩 M-Pesa Callback Data:", JSON.stringify(req.body, null, 2));
  // Respond immediately so Safaricom doesn’t retry
  return res.json({ message: "Callback received" });
};
