
export class GenerarHtml {
  
  // Formateador de Viñetas
  static generarListaEnVinetas(
    listaDeListas: string[] | string[][],
    i?: number
  ): string {
    let vinetasHtml = "";

    let listaAProcesar = i !== undefined && i < listaDeListas.length
      ? listaDeListas[i]
      : listaDeListas;

    for (const item of listaAProcesar) {
      if (Array.isArray(item)) {
        for (const subItem of item) {
          if (!subItem || subItem.trim() === "") {
            vinetasHtml += "<li>N/A</li>";
            break;
          } else {
            vinetasHtml += `<li>${subItem.charAt(0).toUpperCase() + subItem.slice(1)}</li>`;
          }
        }
      } else {
        if (!item || item.trim() === "") {
          vinetasHtml += "<li>N/A</li>";
        } else {
          vinetasHtml += `<li>${item.charAt(0).toUpperCase() + item.slice(1)}</li>`;
        }
      }
    }
    return vinetasHtml;
  }

  static generarSituacionActual(
    listaEpicas: string[],
    datosEpicas: string[][],
    impedimentos: string[][],
    actividades: string[][],
    acuerdos: string[][],
    consideraciones: string[][]
  ): string {
    let situacionActualHtml = "";
    listaEpicas.forEach((epica, i) => {
      const datos = datosEpicas[i];
      situacionActualHtml += `
        <div id="situacion">        
          <h3 style="color: #4cb749;">${epica}</h3>
          <p><strong>Responsable(s) QA:</strong> ${datos[0]}</p>
          <p><strong>Plataforma:</strong> ${datos[1]}</p>
          <p><strong>Porcentaje de avance:</strong> <span class="status">${datos[2]}</span></p>
          <p><strong>Situación del proyecto:</strong> ${datos[3]}</p>
          <p><strong>Impedimentos:</strong></p>
            <ul>${this.generarListaEnVinetas(impedimentos, i)}</ul>
          <p><strong>Próximas actividades:</strong></p>
            <ul>${this.generarListaEnVinetas(actividades, i)}</ul>
          <p><strong>Acuerdos:</strong></p>
            <ul>${this.generarListaEnVinetas(acuerdos, i)}</ul>
          <p><strong>Consideraciones:</strong></p>
            <ul>${this.generarListaEnVinetas(consideraciones, i)}</ul>
        </div>`;
    });
    return situacionActualHtml;
  }

  static defectosHtml(defectosData: Record<string, any[]>): string {
    const rows: string[] = [];
    let previousEpica: string | null = null;
    let rowspan = 0;

    const epicas = defectosData['Proyecto / Épica'];
    const cantidadDefectos = defectosData['Cantidad de Defectos'];
    const defectosAbiertos = defectosData['Defectos Abiertos'];
    const defectosCerrados = defectosData['Defectos Cerrados'];
    const severidades = defectosData['Severidad'];

    for (let i = 0; i < epicas.length; i++) {
        const epica = epicas[i];
        const cantidadDefecto = cantidadDefectos[i];
        const defectosAbierto = defectosAbiertos[i];
        const defectosCerrado = defectosCerrados[i];
        const severidad = severidades[i];
        let formato=i%2===0?'#d9f2d0':'#ffffff';

        if (epica !== previousEpica) {
            // Cuando la épica cambia
            if (previousEpica !== null) {
                // Cerrar el rowspan de la épica anterior
                rows[rows.length - rowspan] = rows[rows.length - rowspan].replace(
                    '{ROWSPAN}',
                    rowspan.toString()
                );
            }
            // Iniciar una nueva épica
            previousEpica = epica;
            rowspan = 1;
            rows.push(`
              <tr style="background-color: ${formato};">
                <td rowspan="{ROWSPAN}">${epica}</td>
                <td>${cantidadDefecto}</td>
                <td>${defectosAbierto}</td>
                <td>${defectosCerrado}</td>
                <td>${severidad}</td>
              </tr>
            `);
        } else {
            // Continuar en la misma épica
            rowspan++;
            rows.push(`
              <tr style="background-color: ${formato};">
                <td>${cantidadDefecto}</td>
                <td>${defectosAbierto}</td>
                <td>${defectosCerrado}</td>
                <td>${severidad}</td>
              </tr>
            `);
        }
    }

    // Cerrar la última épica
    if (previousEpica !== null) {
        rows[rows.length - rowspan] = rows[rows.length - rowspan].replace(
            '{ROWSPAN}',
            rowspan.toString()
        );
    }

    return rows.join('');
}

static  async generarHtmlGraficas(
  listaEpicas: String[],
  crearGrafica: Function,
  datos: number[][] | {
      bloqueantes?: number[][],
      criticos?: number[][],
      mayor?: number[][],
      normal?: number[][],
      menor?: number[][],
      sinClasificar?: number[][]
  }
): Promise<string> {
  let htmlGraficasBase64 = "";

  for (let i = 0; i < listaEpicas.length; i++) {
      let graficaBase64: string;

      if (Array.isArray(datos)) {
          // Si `datos` es un array, asume que es `cantidadHistorias`
          graficaBase64 = await crearGrafica(datos, i);
      } else {
          // Si `datos` es un objeto, asume que son `datosAdicionales`
          graficaBase64 = await crearGrafica(
              datos.bloqueantes,
              datos.criticos,
              datos.mayor,
              datos.normal,
              datos.menor,
              datos.sinClasificar,
              i
          );
      }

      htmlGraficasBase64 += `
          <h3 style="color: #4cb749;">${listaEpicas[i]}</h3>
          <img src="data:image/png;base64,${graficaBase64}" />
      `;
  }

  return htmlGraficasBase64;
}

static generarTablaHistoriasHTML(historiasData: any[]): string {
  // Inicia el HTML de la tabla
  let html = `<table border="1" style="border-collapse: collapse; width: 100%;">`;
  html += `
      <thead>
          <tr>
              <th>Proyecto / Epica</th>
              <th>Cant. en Desarrollo</th>
              <th>Cant. Pendientes Pruebas</th>
              <th>Cant. Pruebas</th>
              <th>Cant. Terminadas</th>
              <th>Total</th>
          </tr>
      </thead>
      <tbody>
  `;

  // Agrega las filas de datos
  historiasData.forEach((row, index) => {
    let formato=index%2===0?'#d9f2d0':'#ffffff';
      html += `
          <tr style="background-color: ${formato};">
              <td>${row['Proyecto / Epica']}</td>
              <td>${row['Cant. en Desarrollo']}</td>
              <td>${row['Cant. Pendientes Pruebas']}</td>
              <td>${row['Cant. Pruebas']}</td>
              <td>${row['Cant. Terminadas']}</td>
              <td>${row['Total']}</td>
          </tr>
      `;
  });

  // Cierra la tabla
  html += `
      </tbody>
  </table>`;

  return html;
}


}
