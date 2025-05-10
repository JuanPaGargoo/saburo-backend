import axios from 'axios';

const PAYPAL_API = process.env.PAYPAL_API!;
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;

let cachedToken: string | null = null;
let tokenExpiration: number | null = null;

export async function getAccessToken(): Promise<string> {
  // Verificar si el token aún es válido
  if (cachedToken && tokenExpiration && Date.now() < tokenExpiration) {
    return cachedToken; // TypeScript garantiza que cachedToken no es null aquí
  }

  try {
    const response = await axios({
      url: `${PAYPAL_API}/v1/oauth2/token`,
      method: 'post',
      auth: {
        username: PAYPAL_CLIENT_ID,
        password: PAYPAL_CLIENT_SECRET,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: 'grant_type=client_credentials',
    });

    // Almacenar el token y su tiempo de expiración
    cachedToken = response.data.access_token;
    tokenExpiration = Date.now() + response.data.expires_in * 1000; // Convertir a milisegundos

    return cachedToken!;
  } catch (error) {
    console.error('Error al generar el token de acceso:', error);
    throw new Error('No se pudo generar el token de acceso');
  }
}