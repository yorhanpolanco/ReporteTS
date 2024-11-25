# README
## Generador de reporte de QA

----
### Descripción
Generador de reporte de QA basado en la data que se inserte de las Epicas trabajadas dentro del sprint

----
### Contenido
- [Prerequisitos]
- [Instalacion]
- [Estructura del Proyecto]
- [Uso]
- [Ejecución]

----
### Prerequisitos
1. Instalar **[Node.js](https://nodejs.org/en)** (v20.14.0 o superior)
2. Instalar **[Visual studio Code](https://code.visualstudio.com/download)** (Ultima versión recomendada)

----
### Instalacion
1. Clonar el repositorio desde la consola en la ruta donde desea trabajar el proyecto:
```bash
git clone <Link_del_repositorio>
```
2. Instalar las dependencias:
```bash
npm install
```

----
### Estructura del Proyecto

```plaintext
├───pictures
├───src
│   ├───reports
│   └───users
├─── .gitignore
├─── azure-pipelines.yml
├─── dev.env
├─── package-lock.json
├─── package.json
├─── prod.env
├─── README.md
└─── tsconfig.json
```

### Uso
El reporte se enviara desde el correo del usuario que ejecute el pipeline como remitente, ademas completara el campo de equipo y la firma. Los demas campos deben ser llenados de la siguiente manera:

# Formulario de Datos

| **Campo**              | **Valor**                                                                                       | **Descripción**                                                                 |
|------------------------|-------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| **LISTA_EPICAS**       | Epic 59873 Mejoras a la automatización de Proformas, Resoluciones y Actas de Descargo en SECCON (Versión 2); Epic60167-ADECUACIÓN DE SECCON POR MODIFICACIÓN DEL ARTÍCULO 11 DEL CÓDIGO TRIBUTARIO | Lista de las epicas separadas por ( ; )                                  |
| **DATOS_EPICAS**       | Fidel Linares y Yorhan Polanco, ALM, 100% - QA, Pase a producción planificado; Fidel Linares y Yorhan Polanco, ALM, 10% - Desarrollo, En fase de desarrollo | Situacion actual de la epica donde se debe agregar separado por (,): **Responsable(s) QA ,Plataforma ,Porcentaje de avance, Situación del proyecto**. Si desea agregar la informacion de alguna otra epica solo debe agregar ( ; )y luego agregar la informacion de situacion actual en el mismo orden de la anterior          |
| **IMPEDIMENTOS**       | Impedimento1, Impedimento2; N/A                                                                | Agregar los impedimentos separados por (,) para dar salto de linea entre cada impedimiento. Para agregar los impedimientos de cada epica separar epicas por ( ; )                              |
| **ACTIVIDADES**        | Actividad1, Actividad2                                                                         | Agregar las activiades separados por (,) para dar salto de linea entre cada actividad. Para agregar las actividades de cada epica separar epicas por ( ; )                                    |
| **ACUERDOS**           | Acuerdo1;                                                                                      | Agregar los acuerdos separados por (,) para dar salto de linea entre cada acuerdo. Para agregar los acuerdos de cada epica separar epicas por ( ; )                                  |
| **CONSIDERACIONES**    | consideraciones1, consideraciones2;                                                            | Agregar las consideraciones separadas por (,) para dar salto de linea entre cada consideracion. Para agregar las consideraciones de cada epica separar epicas por ( ; )                                         |
| **CANTIDAD_HISTORIAS** | 10, 4, 1, 20; 5, 3, 7, 16                                                                      | Agregar historias en este formato **Cant. en Desarrollo, Cant. Pendientes Pruebas, Cant. Pruebas,Cant. Terminadas**. Para agregar las historias de cada epica separar epicas por ( ; )                        |
| **BLOQUEANTES**        | 2, 3; 2, 3                                                                                     | Defectos que bloquean **Defectos Abiertos, Defectos Cerrados**. Para agregar las historias de cada epica separar epicas por ( ; )                                  |
| **CRITICOS**           | 2, 2; 2, 1                                                                                     | Defectos críticos **Defectos Abiertos, Defectos Cerrados**. Para agregar las historias de cada epica separar epicas por ( ; )                                  |                                               |
| **MAYOR**              | 3, 1; 2, 4                                                                                     | Defectos mayores **Defectos Abiertos, Defectos Cerrados**. Para agregar las historias de cada epica separar epicas por ( ; )                                  |                                                |
| **NORMAL**             | 0, 0; 2, 0                                                                                     | Defectos normales **Defectos Abiertos, Defectos Cerrados**. Para agregar las historias de cada epica separar epicas por ( ; )                                  |                                                |
| **MENOR**              | 0, 0; 2, 7                                                                                     | Defectos menores **Defectos Abiertos, Defectos Cerrados**. Para agregar las historias de cada epica separar epicas por ( ; )                                  |                                                |
| **SIN_CLASIFICAR**     | 0, 0; 2, 3                                                                                     | Defectos aún sin clasificar **Defectos Abiertos, Defectos Cerrados**. Para agregar las historias de cada epica separar epicas por ( ; )                                  |                                                |
| **ACTIVIDADES_FUERA**  | Automatizacion; reporte                                                                        | Actividades no contempladas dentro del proyecto principal separados por (,) para dar salto de linea entre cada Actividad                      |
| **CORREO_RECEPTOR**    | ypolanco@dgii.gov.do                                                                           | Dirección de correo del receptor o los receptores. Si son varios receptores poner los correos separados por (,)                                             |

----
### Ejecución
1. Compilar el codigo:
```bash
npx tsc
```
2. Ejecutar el codigo:
```bash
npm run reporte
```
3. Para ejecutarlo desde el pipeline solo se necesita hacer clic en **Run**.

### Contribución
Para subir los cambios al repositorio favor tomar en cuenta:

1. Realizar los cambios y pruebas en una nueva rama.
2. Asegurar que el código cumple con la estructura establecida.
5. Enviar un pull request detallando los cambios.
