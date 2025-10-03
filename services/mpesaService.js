import axios from "axios";
import moment from "moment";
import dotenv from "dotenv";

dotenv.config();

const baseURL = "https://sandbox.safaricom.co.ke";


export const getToken = async () => {
  const { MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET } = process.env;
  const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString("base64");

  const res = await axios.get(`${baseURL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${auth}` },
  });

  return res.data.access_token;
};

export const stkPush = async (phone, amount) => {
  const token = await getToken();

  const timestamp = moment().format("YYYYMMDDHHmmss");
  const shortCode = process.env.MPESA_SHORTCODE; // e.g., 174379 for sandbox
  const passkey = process.env.MPESA_PASSKEY;

  const password = Buffer.from(shortCode + passkey + timestamp).toString("base64");

  const payload = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline", // Use CustomerBuyGoodsOnline for till numbers
    Amount: amount,
    PartyA: phone,
    PartyB: shortCode,
    PhoneNumber: phone,
    CallBackURL: `https://${process.env.PUBLIC_BASE}/mpesa/callback`,
    AccountReference: "Test123",
    TransactionDesc: "Payment for goods",
  };

  try {
    const response = await axios.post(
      `${baseURL}/mpesa/stkpush/v1/processrequest`,
      payload,
      { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
    );

    console.log("✅ M-Pesa Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ M-Pesa Error:", error.response?.data || error.message);
    throw error;
  }
};
