import axios from 'axios';

export class GenerarGraficas {

  

  static generarTablaHistorias(listaEpicas: string[], cantidadHistorias: number[][]): any[] {
    let historiasData: any[] = [];
    for (let i = 0; i < listaEpicas.length; i++) {
      let epica = listaEpicas[i];
      historiasData.push({
        'Proyecto / Epica': epica,
        'Cant. en Desarrollo': cantidadHistorias[i][0],
        'Cant. Pendientes Pruebas': cantidadHistorias[i][1],
        'Cant. Pruebas': cantidadHistorias[i][2],
        'Cant. Terminadas': cantidadHistorias[i][3],
        'Total': cantidadHistorias[i].reduce((a, b) => a + b, 0)
      });
    }
    return historiasData;
  }

  static generarTablaDefectos(
    listaEpicas: string[],
    bloqueantes: number[][],
    criticos: number[][],
    mayor: number[][],
    normal: number[][],
    menor: number[][],
    sinClasificar: number[][]
  ): Record<string, any[]> {
    // Inicializar defectosData como un objeto con listas vacías
    let defectosData: Record<string, any[]> = {
      'Proyecto / Épica': [],
      'Cantidad de Defectos': [],
      'Defectos Abiertos': [],
      'Defectos Cerrados': [],
      'Severidad': []
    };

    // Definir severidades y asociar datos
    const severidades = ['Bloqueante', 'Crítico', 'Mayor', 'Normal', 'Menor', 'Sin Clasificar'];
    const datosSeveridades = [bloqueantes, criticos, mayor, normal, menor, sinClasificar];

    // Iterar sobre las épicas
    listaEpicas.forEach((epica, i) => {
      // Añadir los datos de cada severidad para la épica actual
      defectosData['Proyecto / Épica'].push(...Array(severidades.length).fill(epica));
      defectosData['Cantidad de Defectos'].push(
        ...datosSeveridades.map((datos) => datos[i].reduce((a, b) => a + b, 0))
      );
      defectosData['Defectos Abiertos'].push(
        ...datosSeveridades.map((datos) => datos[i][0])
      );
      defectosData['Defectos Cerrados'].push(
        ...datosSeveridades.map((datos) => datos[i][1])
      );
      defectosData['Severidad'].push(...severidades);
    });

    return defectosData;
  }

  static async crearGraficaHistorias(cantidadHistorias: number[][], i: number): Promise<string> {
    const categorias = ['En Desarrollo', 'Pendientes', 'En Pruebas', 'Terminadas'];

    const https = require('https');

    const agent = new https.Agent({
    rejectUnauthorized: false // Ignora la verificación del certificado
});

    // Usar solo el índice 'i' para acceder a la sublista de cantidadHistorias
    const dataset = {
      label: `Epica ${i + 1}`,  // Se usa un nombre genérico para la etiqueta
      data: cantidadHistorias[i],  // Datos correspondientes a la sublista
      backgroundColor: ['orange', 'yellow', 'blue', 'green'],
      borderColor: ['orange', 'yellow', 'blue', 'green'],
      borderWidth: 1
    };

    const chartConfig = {
      type: 'bar',
      data: {
        labels: categorias,
        datasets: [dataset]  // Utilizamos solo el dataset correspondiente al índice 'i'
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
                max: (Math.max(...cantidadHistorias[i])+2),
                min: 0,
                stepSize: 1
            }
        }]
      },
        responsive: true,
        plugins: {
          legend: {
            display: false // Oculta toda la leyenda
          }
        }
      }
    };

    // Enviar solicitud a QuickChart para obtener la imagen base64
    const response = await axios.post('https://quickchart.io/chart', {
      chart: chartConfig,
      format: 'png'
    }, { responseType: 'arraybuffer',httpsAgent: agent });

    // Convertir la respuesta a base64
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    return base64Image;
  }

  static async crearGraficaDefectos(
    bloqueantes: number[][],
    criticos: number[][],
    mayor: number[][],
    normal: number[][],
    menor: number[][],
    sinClasificar: number[][],
    i: number
  ): Promise<string> {
    const severidades = ['Bloqueante', 'Crítico', 'Mayor', 'Normal', 'Menor', 'Sin Clasificar'];

    // Calculamos los defectos totales, abiertos y cerrados para cada severidad
    const defectosTotales = [
      bloqueantes[i].reduce((acc, val) => acc + val, 0),
      criticos[i].reduce((acc, val) => acc + val, 0),
      mayor[i].reduce((acc, val) => acc + val, 0),
      normal[i].reduce((acc, val) => acc + val, 0),
      menor[i].reduce((acc, val) => acc + val, 0),
      sinClasificar[i].reduce((acc, val) => acc + val, 0)
    ];
    const defectosAbiertos = [
      bloqueantes[i][0], criticos[i][0], mayor[i][0],
      normal[i][0], menor[i][0], sinClasificar[i][0]
    ];
    const defectosCerrados = [
      bloqueantes[i][1], criticos[i][1], mayor[i][1],
      normal[i][1], menor[i][1], sinClasificar[i][1]
    ];

    // Crear las gráficas de barras apiladas
    const barWidth = 0.4;
    const indices = Array.from({ length: defectosTotales.length }, (_, index) => index);

    const chartConfig = {
      type: 'bar',
      data: {
        labels: severidades,
        datasets: [
          {
            label: 'Defectos Abiertos',
            data: defectosAbiertos,
            backgroundColor: 'orange',
            borderColor: 'orange',
            borderWidth: 1
          },
          {
            label: 'Defectos Cerrados',
            data: defectosCerrados,
            backgroundColor: 'green',
            borderColor: 'green',
            borderWidth: 1
          }
        ]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
                max: (Math.max(...defectosTotales)+2),
                min: 0,
                stepSize: 1
            }
        }]
        },
        responsive: true
      }
    };

    const https = require('https');

    const agent = new https.Agent({
    rejectUnauthorized: false // Ignora la verificación del certificado
});

    // Enviar solicitud a QuickChart para obtener la imagen base64
    const response = await axios.post('https://quickchart.io/chart', {
      chart: chartConfig,
      format: 'png'
    }, { responseType: 'arraybuffer',
      httpsAgent: agent
     });

    // Convertir la respuesta a base64
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    return base64Image;
  }
}
