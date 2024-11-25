import * as fs from 'fs';  // Importa el módulo fs de Node.js

export class ConversionData {

    // Convertir a lista de listas de string
    static convertirAListaDeListas(texto: string): string[][] {
        return texto.split(';').map(item => item.split(',').map(str => str.trim()));
    }

    // Convertir a lista de listas de enteros
    static convertirAListaDeListasEnteros(texto: string): number[][] {
        return texto.split(';').map(x => x.split(',').map(num => parseInt(num, 10)));
    }

    // Función para convertir la imagen a base64
    static imagenBase64(rutaImagen: string): string  {
        const imgData = fs.readFileSync(rutaImagen);  // Usa fs.promises para leer el archivo de forma asincrónica
        return imgData.toString('base64');  // Convierte el archivo en base64
    }
}