"use server";

import { StatiticsData } from "@/models/api";

const WEBHOOK_URL = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL as string;

export async function getAllData(): Promise<StatiticsData[]> {
    try {
        if (!WEBHOOK_URL) {
            throw new Error("La URL del webhook no está definida en las variables de entorno.");
        }

        const response = await fetch(WEBHOOK_URL);
        if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}
