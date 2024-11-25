import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import { generarCuerpoCorreo } from './cuerpoMail';  // Asegúrate de que esta función sea exportada correctamente

dotenv.config({ path: 'prod.env' });

// Configuración del correo
const fromEmail = process.env.CORREO_EMISOR;
const toEmail = process.env.CORREO_RECEPTOR;


// Configuración del servidor SMTP
const smtpServer = 'mail.dgii.gov.do'; // Cambia esto al servidor SMTP interno

// Crear el transportador de nodemailer
const transporter = nodemailer.createTransport({
    host: smtpServer,
    port: 25, // Puerto para SMTP (ajustar según corresponda)
    secure: false, // Si es 'true' usa TLS
    tls: {
        rejectUnauthorized: false // Si se requiere el rechazo de certificados no autorizados
    }
});

// Función asincrónica para generar el HTML y enviar el correo
async function sendEmail() {
    try {
        // Generar el contenido del correo de forma asincrónica
        const cuerpoCorreo = await generarCuerpoCorreo();
        const subject = `RE: Resumen Avance General Pruebas  | ${process.env.EQUIPO}`;

        // Crear el mensaje
        const message = {
            from: `"${process.env.NOMBRE_REMITENTE}" <${fromEmail}>`,
            to: toEmail,
            subject: subject,
            html: cuerpoCorreo
        };

        // Enviar el correo
        transporter.sendMail(message, (error, info) => {
            if (error) {
                console.log(`Error al enviar el correo: ${error}`);
            } else {
                console.log('Correo enviado exitosamente:', info.response);
            }
        });
    } catch (error) {
        console.error('Error generando el cuerpo del correo:', error);
    }
}

// Llamada a la función para enviar el correo
sendEmail();

