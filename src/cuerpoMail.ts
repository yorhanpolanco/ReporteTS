import { ConversionData } from './conversiones';
import { GenerarHtml } from './generacionHtml';
import { GenerarGraficas } from './graficas';
import * as fs from 'fs';
import * as path from 'path';

const ruta_logo = 'pictures/dgii_logo.png';
const users = path.resolve(__dirname, 'users/', 'correosQA.json');
const fileContent = fs.readFileSync(users, 'utf-8');

const datosUsuario=JSON.parse(fileContent);

export async function generarCuerpoCorreo() {

// Variables
const equipo = process.env.CORREO_EMISOR?datosUsuario[process.env.CORREO_EMISOR.toLocaleLowerCase()]['equipo']:'No hay equipo regisrado';
process.env.EQUIPO=equipo;
const lista_Epicas = process.env.LISTA_EPICAS || '';
const datos_Epicas = process.env.DATOS_EPICAS || '';
const impedimentos = process.env.IMPEDIMENTOS || '';
const actividades = process.env.ACTIVIDADES || '';
const acuerdos = process.env.ACUEERDOS || '';
const consideraciones = process.env.CONSIDERACIONES || '';
const cantidad_Historias = process.env.CANTIDAD_HISTORIAS || ''; // [Cant. en Desarrollo, Cant. Pendientes, Pruebas, Cant. Pruebas, Cant. Terminadas]
const bloqueantes = process.env.BLOQUEANTES || ''; // [abiertos, cerrados]
const criticos = process.env.CRITICOS || '';
const mayor = process.env.MAYOR || '';
const normal = process.env.NORMAL || '';
const menor = process.env.MENOR || '';
const sin_Clasificar = process.env.SIN_CLASIFICAR || '';
const actividades_fuera = process.env.ACTIVIDADES_FUERA || '';
const nombre_remitente = process.env.CORREO_EMISOR?datosUsuario[process.env.CORREO_EMISOR.toLocaleLowerCase()]['nombre']:'No hay nombre registrado';//process.env.NOMBRE_REMITENTE || '';
process.env.NOMBRE_REMITENTE=nombre_remitente;
const rol = process.env.CORREO_EMISOR?datosUsuario[process.env.CORREO_EMISOR.toLocaleLowerCase()]['rol']:'No hay rol registrado';


// Formatear texto de epicas
const listaEpicasArray = lista_Epicas.split(';').map(String);
const datosEpicasArray = ConversionData.convertirAListaDeListas(datos_Epicas);
const impedimentosArray = ConversionData.convertirAListaDeListas(impedimentos);
const actividadesArray = ConversionData.convertirAListaDeListas(actividades);
const acuerdosArray = ConversionData.convertirAListaDeListas(acuerdos);
const consideracionesArray = ConversionData.convertirAListaDeListas(consideraciones);

// Formatear Historias y defectos
const cantidadHistoriasArray = ConversionData.convertirAListaDeListasEnteros(cantidad_Historias);
const bloqueantesArray = ConversionData.convertirAListaDeListasEnteros(bloqueantes);
const criticosArray = ConversionData.convertirAListaDeListasEnteros(criticos);
const mayorArray = ConversionData.convertirAListaDeListasEnteros(mayor);
const normalArray = ConversionData.convertirAListaDeListasEnteros(normal);
const menorArray = ConversionData.convertirAListaDeListasEnteros(menor);
const sinClasificarArray = ConversionData.convertirAListaDeListasEnteros(sin_Clasificar);
const actividadesFueraArray = actividades_fuera.split(';').map(String);

//const crearGraficaHistorias = GenerarGraficas.crearGraficaHistorias.bind(cantidadHistoriasArray);

// Generar html de las graficas de historia
const graficaHistoriasBase64 = await GenerarHtml.generarHtmlGraficas(listaEpicasArray,await GenerarGraficas.crearGraficaHistorias,cantidadHistoriasArray);

//const crearGraficaDefectos = GenerarGraficas.crearGraficaDefectos.bind(null, bloqueantesArray, criticosArray, mayorArray, normalArray, menorArray, sinClasificarArray);

// Generar html de grafica de defectos
const graficaDefectosBase64 = await GenerarHtml.generarHtmlGraficas(listaEpicasArray, await GenerarGraficas.crearGraficaDefectos,{bloqueantes:bloqueantesArray, criticos:criticosArray, mayor:mayorArray, normal:normalArray, menor:menorArray, sinClasificar:sinClasificarArray});

const logoBase64 = ConversionData.imagenBase64(ruta_logo);

// Crear el cuerpo del correo en HTML
const cuerpoCorreo = `
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Informe de Estatus</title>
    <style>
        body {
            font-family: Aptos;
            line-height: 1.6;
            margin: 20px;
            color: #333;
        }
        h1, h2, h3 { color: #4cb749; }
        h4 { color: black; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            color:black;
        }
        td:first-child { width: 300px; }
        .tabla { width: 75%; margin: 0; text-align: left; }
        .status { background-color: yellow; font-weight: bold; }
        th, td {
            border: 1px solid #8dd873;
            padding: 8px;
            text-align: center;
        }
        th { background-color: #4ea72e; }
        .tabla tbody tr:nth-child(even) { background-color: #ffffff; }
        .tabla tbody tr:nth-child(odd) { background-color: #d9f2d0; }
        .contact-info { margin-top: 40px; }
        p, li, ul { margin: 0; }
        .equipo {
            font-weight: bold;
        }
    </style>
</head>

<body>
    <p>Buenas,</p>
    <br>
    <p>A continuación, presentamos el estatus por parte de QA del Proyecto / Épica / Incidentes del <span class="equipo">${equipo}</span>.</p>
    <h2 style="color: #4cb749;" >Objetivo</h2>
    <p>Presentar un informe periódico sobre los trabajos realizados por el equipo de QA de cara a los pendientes que están siendo trabajados por el <span class="equipo">${equipo}</span>.</p>

    <h2 style="color: #4cb749;">Situación Actual</h2>
    
    ${GenerarHtml.generarSituacionActual(listaEpicasArray, datosEpicasArray, impedimentosArray, actividadesArray, acuerdosArray, consideracionesArray)}

    <div id="resumen">
        <h2 style="color: #4cb749;">Resumen Historias</h2>
        <div class="tabla">
            ${GenerarHtml.generarTablaHistoriasHTML(GenerarGraficas.generarTablaHistorias(listaEpicasArray, cantidadHistoriasArray))}
        </div>
        <h2 style="color: #4cb749;">Gráfica de Historias</h2>
        ${graficaHistoriasBase64}
        
        <h2 style="color: #4cb749;">Resumen de Defectos</h2>
        <table class="tabla">
            <thead>
                <tr>
                    <th>Proyecto / Épica</th>
                    <th>Cantidad de Defectos</th>
                    <th>Defectos Abiertos</th>
                    <th>Defectos Cerrados</th>
                    <th>Severidad</th>
                </tr>
            </thead>
            <tbody>
                ${GenerarHtml.defectosHtml(GenerarGraficas.generarTablaDefectos(listaEpicasArray, bloqueantesArray, criticosArray, mayorArray, normalArray, menorArray, sinClasificarArray))}
            </tbody>
        </table>
        
        <h2 style="color: #4cb749;">Gráfica de Defectos</h2>
        ${graficaDefectosBase64}
    </div>

    <h3 style="color: #4cb749;">Notas:</h3>
    <p>Actividades fuera de la célula:</p>
    <ul>${GenerarHtml.generarListaEnVinetas(actividadesFueraArray)}</ul>

    <div class="contact-info">
        <p>Saludos,</p>
        <p>${nombre_remitente}</p>
        <p>${rol}</p>
        <p>Sección Aseguramiento de la Calidad</p>

        <img src="data:image/png;base64,${logoBase64}" alt="Logo" style="width:150px;height:auto;" />
    </div>
</body>
</html>
`;

// Guardar el HTML en un archivo para verificar
fs.writeFileSync(path.join(__dirname, 'reports/informe_estatus.html'), cuerpoCorreo, 'utf-8');

console.log("HTML generado correctamente.");

return cuerpoCorreo;
}
