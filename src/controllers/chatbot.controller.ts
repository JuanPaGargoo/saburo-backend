import { Request, Response } from "express";
import { askOpenAI } from "../utils/openai";
import prisma from "../config/prisma";

export class ChatbotController {
  static async chat(req: Request, res: Response): Promise<void> {
    const { message } = req.body;

    if (!message) {
      res.status(400).json({ error: "El mensaje es obligatorio." });
      return;
    }

    try {
      // Normalizar el texto del mensaje
      const normalizeText = (text: string): string => {
        return text
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9\s]/g, "");
      };

      const normalizedMessage = normalizeText(message);

      // Palabras clave para recomendaciones
      const recommendationKeywords = [
        "recomienda",
        "recomendacion",
        "recomiendas",
        "sugerencia",
        "sugiere",
        "sugerir",
        "que me recomiendas",
        "que sugieres",
        "precio",
        "descuento",
        "barato",
        "económico",
        "oferta",
        "rebaja",
        "rebajas",
        "color",
        "quiero",
        "busco",
        "me gustaría",
        "me gustaría ver",
        "me gustaría comprar",
        "me gustaría encontrar",
        "necesito",
      ];

      const isRecommendation = recommendationKeywords.some((keyword) =>
        normalizedMessage.includes(keyword)
      );

      if (isRecommendation) {
        // Obtener productos de la base de datos
        const products = await prisma.product.findMany({
          select: {
            id: true,
            name: true,
            description: true,
            gender: true,
            category: true,
            price: true,
            discount: true,
          },
        });

        // Generar un prompt para OpenAI basado en las descripciones de los productos
        const descriptions = products
          .map(
            (p) =>
              `id: ${p.id}, nombre: ${p.name}, descripción: ${p.description}, género: ${p.gender}, categoría: ${p.category}, precio: ${p.price}, descuento: ${p.discount}%`
          )
          .join("\n");

        const prompt1 = `
          El usuario quiere una recomendación de prendas. Basándote en las siguientes descripciones de productos:
          ${descriptions}
          Mensaje del usuario: "${message}".
          Si el usuario menciona género (hombre o mujer), filtra las prendas por género.
          Si menciona precio, selecciona la prenda con el menor precio.
          Si menciona descuento, selecciona las prendas con descuento.
          Si no menciona nada específico, selecciona 3 prendas al azar.
          Responde primero con un estas son las prendas que te recomiendo o algo por el estilo y luego una lista en formato 1. primer producto salto de linea 2. segundo producto.
          luego un breve texto de por que escogiste esas prendas.
          Si solo hay una prenda o dos, que concuerden con la busqueda, no es nesesario tener que poner 3.
          El texto de respuesta debe ser claro y fácil de entender y no debe ser más largo de 2 oraciones por producto.
          si vez que solo uno o dos pro
        `;

        // Generar la primera respuesta
        const response1 = await askOpenAI(prompt1);

        // Usar la respuesta1 para construir el segundo prompt
        const prompt2 = `
          Basándote en la siguiente recomendación generada:
          "${response1}"
          Devuelve un array con los IDs de los productos recomendados ${descriptions}. 
          Responde únicamente con un array de IDs en formato JSON, sin texto adicional.
        `;

        // Generar la segunda respuesta
        const response2 = await askOpenAI(prompt2);

        let productIds;
        try {
          // Intentar parsear como JSON
          productIds = JSON.parse(response2);
          if (!Array.isArray(productIds)) {
            throw new Error("La respuesta no es un array válido.");
          }
        } catch (error) {
          console.warn("La respuesta no es un JSON válido. Intentando procesar como texto...");
          // Procesar como texto si no es JSON
          const matches = response2.match(/\d+/g); // Extraer números del texto
          if (matches) {
            productIds = matches.map(Number); // Convertir a números
          } else {
            console.error("No se pudieron extraer IDs de la respuesta:", response2);
            res.status(500).json({ error: "No se pudieron extraer los IDs de los productos." });
            return;
          }
        }

        // Enviar ambas respuestas al cliente
        res.status(200).json({ response1, productIds });
        return;
      }

      // Verificar si el mensaje está relacionado con tallas
      if (
        message.toLowerCase().includes("talla") ||
        /mido\s\d+(\.\d+)?\s?(cm|m)/i.test(message) || // Detectar altura
        /peso\s\d+(\.\d+)?\s?kg/i.test(message) || // Detectar peso
        /soy\s(hombre|mujer)/i.test(message) // Detectar género
      ) {
        const prompt = `
          Basándote en los datos proporcionados por el usuario, como peso, estatura y género, determina la talla adecuada para la parte de arriba (camisetas, camisas, etc.) y la parte de abajo (pantalones, faldas, etc.).
          Reglas:
          - Para hombres:
            - Parte de arriba:
              - S: peso entre 50-65 kg y estatura entre 1.50-1.65 m.
              - M: peso entre 66-75 kg y estatura entre 1.66-1.75 m.
              - L: peso entre 76-85 kg y estatura entre 1.76-1.85 m.
              - XL: peso mayor a 85 kg y estatura mayor a 1.85 m.
            - Parte de abajo:
              - S: peso entre 50-65 kg y estatura entre 1.50-1.65 m.
              - M: peso entre 66-75 kg y estatura entre 1.66-1.75 m.
              - L: peso entre 76-85 kg y estatura entre 1.76-1.85 m.
              - XL: peso mayor a 85 kg y estatura mayor a 1.85 m.
          - Para mujeres:
            - Parte de arriba:
              - S: peso entre 45-55 kg y estatura entre 1.45-1.60 m.
              - M: peso entre 56-65 kg y estatura entre 1.61-1.70 m.
              - L: peso entre 66-75 kg y estatura entre 1.71-1.80 m.
              - XL: peso mayor a 75 kg y estatura mayor a 1.80 m.
            - Parte de abajo:
              - S: peso entre 45-55 kg y estatura entre 1.45-1.60 m.
              - M: peso entre 56-65 kg y estatura entre 1.61-1.70 m.
              - L: peso entre 66-75 kg y estatura entre 1.71-1.80 m.
              - XL: peso mayor a 75 kg y estatura mayor a 1.80 m.
          Mensaje del usuario: "${message}".
          Responde con las tallas estimadas para la parte de arriba y la parte de abajo, junto con una breve explicación.
          El texto de respuesta debe ser claro y fácil de entender y no debe ser más largo de 3 oraciones.
        `;
        const response = await askOpenAI(prompt);
        res.status(200).json({ response });
        return;
      }

      // Respuesta genérica si el mensaje no está relacionado con tallas o recomendaciones
      const genericResponse = await askOpenAI(
        `El usuario envió el siguiente mensaje: "${message}". Responde de manera genérica y amable.`
      );
      res.status(200).json({ response: genericResponse });
    } catch (error) {
      console.error("Error en el chatbot:", error);
      res.status(500).json({ error: "No se pudo procesar la solicitud." });
    }
  }
}