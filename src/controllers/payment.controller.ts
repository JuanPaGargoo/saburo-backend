import axios from "axios";
import { Request, Response } from "express";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;
const PAYPAL_API = "https://api-m.sandbox.paypal.com";

async function generateAccessToken(): Promise<string> {
  const response = await axios({
    url: `${PAYPAL_API}/v1/oauth2/token`,
    method: "post",
    auth: {
      username: PAYPAL_CLIENT_ID,
      password: PAYPAL_CLIENT_SECRET,
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: "grant_type=client_credentials",
  });
  return response.data.access_token;
}

export const createOrder = async (req: Request, res: Response) => {
  const { amount } = req.body;

  try {
    const accessToken = await generateAccessToken();

    const order = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount,
            },
          },
        ],
        application_context: {
          return_url: "http://localhost:5173/?success=true",
          cancel_url: "http://localhost:5173/?error=true",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const approvalUrl = order.data.links.find((link: any) => link.rel === "approve").href;
    res.json({ approvalUrl });
  } catch (error) {
    console.error("Error al crear la orden:", error);
    res.status(500).json({ error: "No se pudo crear la orden" });
  }
};

export const captureOrder = async (req: Request, res: Response) => {
  const { token } = req.query;

  try {
    const accessToken = await generateAccessToken();

    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ status: "success", capture: response.data });
  } catch (error) {
    console.error("Error al capturar la orden:", error);
    res.status(500).json({ error: "No se pudo capturar el pago" });
  }
};
