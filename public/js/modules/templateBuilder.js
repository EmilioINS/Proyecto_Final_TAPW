/**
 * templateBuilder.js
 * Constructor Visual de Plantillas — DocFlow · TecNM Campus Celaya
 *
 * Permite crear documentos institucionales sin escribir HTML manualmente.
 * Genera código HTML Handlebars automáticamente basado en el tipo de documento
 * y los campos llenados por el usuario.
 */

// ============================================================
// DEFINICIÓN DE TIPOS DE DOCUMENTOS Y SUS CAMPOS
// ============================================================
const DOC_TYPES = {
  oficio: {
    label: 'Oficio',
    fields: [
      { id: 'numero_oficio',      label: 'Número de Oficio',        type: 'text',     placeholder: 'Ej. OF-DSC-2026-001',     section: 'Encabezado' },
      { id: 'departamento',       label: 'Departamento Emisor',     type: 'text',     placeholder: 'Ej. Depto. de Sistemas',  section: 'Encabezado' },
      { id: 'fecha',              label: 'Fecha',                   type: 'text',     placeholder: 'Ej. 24 de Mayo de 2026',   section: 'Encabezado' },
      { id: 'cargo_destinatario', label: 'Cargo del Destinatario',  type: 'text',     placeholder: 'Ej. Director de Plantel', section: 'Destinatario' },
      { id: 'nombre_destinatario',label: 'Nombre del Destinatario', type: 'text',     placeholder: 'Ej. Ing. Juan Pérez',     section: 'Destinatario' },
      { id: 'lugar_destinatario', label: 'Lugar / Área',            type: 'text',     placeholder: 'Ej. TecNM Campus Celaya', section: 'Destinatario' },
      { id: 'cuerpo_texto',       label: 'Cuerpo del Oficio',       type: 'textarea', placeholder: 'Redacta el contenido...',  section: 'Contenido' },
      { id: 'nombre_firmante',    label: 'Nombre del Firmante',     type: 'text',     placeholder: 'Ej. M.C. María García',   section: 'Firma' },
      { id: 'cargo_firmante',     label: 'Cargo del Firmante',      type: 'text',     placeholder: 'Ej. Jefe de Departamento', section: 'Firma' },
    ],
    generateHTML: (fields) => `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Times New Roman', Times, serif; color: #1a1a1a; padding: 50px 60px; font-size: 13px; line-height: 1.6; }
    .header { text-align: center; margin-bottom: 28px; border-bottom: 2px solid #1B3A6B; padding-bottom: 16px; }
    .header img { height: 60px; margin-bottom: 8px; }
    .header h1 { font-size: 15px; font-weight: bold; text-transform: uppercase; color: #1B3A6B; letter-spacing: 1px; }
    .header h2 { font-size: 12px; font-weight: normal; color: #555; margin-top: 2px; }
    .oficio-num { font-size: 12px; color: #555; margin-bottom: 18px; }
    .lugar-fecha { text-align: right; margin-bottom: 24px; color: #333; }
    .destinatario { margin-bottom: 24px; border-left: 3px solid #1B3A6B; padding-left: 12px; }
    .destinatario .cargo { font-weight: bold; color: #1B3A6B; }
    .presente { font-weight: bold; margin-top: 6px; text-transform: uppercase; }
    .cuerpo { text-align: justify; margin-bottom: 40px; }
    .cuerpo p { margin-bottom: 12px; }
    .firma { margin-top: 60px; text-align: center; }
    .firma .linea { border-top: 1px solid #1a1a1a; width: 200px; margin: 0 auto 8px; }
    .firma .nombre { font-weight: bold; font-size: 13px; }
    .firma .cargo  { font-size: 11px; color: #555; }
    .footer-text { text-align: center; font-size: 10px; color: #888; margin-top: 40px; border-top: 1px solid #eee; padding-top: 10px; font-style: italic; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Tecnológico Nacional de México</h1>
    <h2>Campus Celaya · {{departamento}}</h2>
  </div>
  <div class="oficio-num">Oficio No. {{numero_oficio}}</div>
  <div class="lugar-fecha">Celaya, Gto., {{fecha}}</div>
  <div class="destinatario">
    <div class="cargo">{{cargo_destinatario}}</div>
    <div>{{nombre_destinatario}}</div>
    <div>{{lugar_destinatario}}</div>
    <div class="presente">Presente</div>
  </div>
  <div class="cuerpo">
    <p>{{cuerpo_texto}}</p>
  </div>
  <div class="firma">
    <p style="font-style:italic;color:#555;margin-bottom:40px;">Atentamente<br><em>"Por la Educación al Servicio de la Patria"</em></p>
    <div class="linea"></div>
    <div class="nombre">{{nombre_firmante}}</div>
    <div class="cargo">{{cargo_firmante}}</div>
  </div>
  <div class="footer-text">Tecnológico Nacional de México · Campus Celaya · Av. Tecnológico 100 · Celaya, Gto.</div>
</body>
</html>`
  },

  constancia: {
    label: 'Constancia',
    fields: [
      { id: 'cargo_emitente',  label: 'Cargo de quien Emite',   type: 'text',     placeholder: 'Ej. Jefe de Departamento', section: 'Emisor' },
      { id: 'nombre_emitente', label: 'Nombre de quien Emite',  type: 'text',     placeholder: 'Ej. M.C. Ana López',       section: 'Emisor' },
      { id: 'nombre_alumno',   label: 'Nombre del Alumno',      type: 'text',     placeholder: 'Ej. Juan Carlos García',   section: 'Datos del Alumno' },
      { id: 'numero_control',  label: 'Número de Control',      type: 'text',     placeholder: 'Ej. 20120987',             section: 'Datos del Alumno' },
      { id: 'carrera',         label: 'Carrera',                type: 'text',     placeholder: 'Ej. Ing. en Sistemas',     section: 'Datos del Alumno' },
      { id: 'semestre',        label: 'Semestre',               type: 'text',     placeholder: 'Ej. Sexto',               section: 'Datos del Alumno' },
      { id: 'descripcion',     label: 'Texto de Constancia',    type: 'textarea', placeholder: 'El alumno cursó satisfactoriamente...', section: 'Contenido' },
      { id: 'fecha',           label: 'Fecha',                  type: 'text',     placeholder: 'Ej. 24 de Mayo de 2026',   section: 'Firma' },
      { id: 'nombre_firmante', label: 'Nombre del Firmante',    type: 'text',     placeholder: 'Ej. M.C. María García',   section: 'Firma' },
      { id: 'cargo_firmante',  label: 'Cargo del Firmante',     type: 'text',     placeholder: 'Ej. Jefe de Departamento', section: 'Firma' },
    ],
    generateHTML: (fields) => `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Times New Roman', Times, serif; color: #1a1a1a; padding: 60px; font-size: 13px; line-height: 1.7; text-align: center; }
    .header { border-bottom: 3px double #1B3A6B; padding-bottom: 16px; margin-bottom: 30px; }
    .header h1 { font-size: 14px; font-weight: bold; text-transform: uppercase; color: #1B3A6B; letter-spacing: 1.5px; }
    .header h2 { font-size: 12px; font-weight: normal; color: #666; margin-top: 3px; }
    .titulo { font-size: 22px; font-weight: bold; letter-spacing: 4px; text-transform: uppercase; color: #1B3A6B; margin: 30px 0 20px; }
    .certifica { font-size: 13px; color: #555; margin-bottom: 10px; }
    .nombre-alumno { font-size: 22px; font-weight: bold; border-bottom: 2px solid #1B3A6B; display: inline-block; padding: 0 24px 6px; margin: 14px 0; color: #1B3A6B; }
    .datos { font-size: 12px; color: #444; margin: 4px 0; }
    .descripcion { font-size: 13px; line-height: 1.8; color: #333; margin: 24px auto; max-width: 520px; text-align: justify; }
    .lugar-fecha { margin: 30px 0 50px; color: #555; }
    .firma-wrap { display: inline-block; min-width: 220px; text-align: center; }
    .firma-linea { border-top: 1px solid #333; margin-bottom: 8px; }
    .firma-nombre { font-weight: bold; font-size: 13px; }
    .firma-cargo  { font-size: 11px; color: #666; }
    .sello { width: 90px; height: 90px; border: 2px dashed #ccc; border-radius: 50%; margin: 0 auto 20px; display:flex; align-items:center; justify-content:center; color:#ccc; font-size:10px; letter-spacing:1px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Tecnológico Nacional de México</h1>
    <h2>Campus Celaya</h2>
  </div>
  <div class="titulo">Constancia</div>
  <div class="certifica">Quien suscribe, <strong>{{cargo_emitente}}</strong> <em>{{nombre_emitente}}</em>, hace constar que:</div>
  <div class="nombre-alumno">{{nombre_alumno}}</div>
  <div class="datos">No. Control: <strong>{{numero_control}}</strong></div>
  <div class="datos">Carrera: <strong>{{carrera}}</strong> · <strong>{{semestre}}</strong> Semestre</div>
  <p class="descripcion">{{descripcion}}</p>
  <div class="lugar-fecha">Celaya, Gto., a {{fecha}}</div>
  <div class="sello">SELLO</div>
  <div class="firma-wrap">
    <div class="firma-linea"></div>
    <div class="firma-nombre">{{nombre_firmante}}</div>
    <div class="firma-cargo">{{cargo_firmante}}</div>
  </div>
</body>
</html>`
  },

  constancia_calificaciones: {
    label: 'Constancia de Calificaciones',
    fields: [
      { id: 'alumno',                label: 'Nombre del Alumno',      type: 'text',     placeholder: 'Ej. Juan Carlos García',   section: 'Datos del Alumno' },
      { id: 'control',               label: 'Número de Control',      type: 'text',     placeholder: 'Ej. 20120987',             section: 'Datos del Alumno' },
      { id: 'carrera',               label: 'Carrera',                type: 'text',     placeholder: 'Ej. Ing. en Sistemas',     section: 'Datos del Alumno' },
      { id: 'periodo',               label: 'Periodo Escolar',        type: 'text',     placeholder: 'Ej. Ene - Jun 2026',       section: 'Datos del Alumno' },
      
      { id: 'materia1_nombre',       label: 'Materia 1',              type: 'text',     placeholder: 'Ej. Portales Web',         section: 'Calificaciones' },
      { id: 'materia1_calificacion', label: 'Calificación 1',         type: 'text',     placeholder: 'Ej. 98',                   section: 'Calificaciones' },
      { id: 'materia2_nombre',       label: 'Materia 2',              type: 'text',     placeholder: 'Ej. Arq. de Software',     section: 'Calificaciones' },
      { id: 'materia2_calificacion', label: 'Calificación 2',         type: 'text',     placeholder: 'Ej. 95',                   section: 'Calificaciones' },
      { id: 'materia3_nombre',       label: 'Materia 3',              type: 'text',     placeholder: 'Ej. Prog. Avanzada',       section: 'Calificaciones' },
      { id: 'materia3_calificacion', label: 'Calificación 3',         type: 'text',     placeholder: 'Ej. 100',                  section: 'Calificaciones' },
      { id: 'materia4_nombre',       label: 'Materia 4',              type: 'text',     placeholder: 'Ej. Admin. de BD',         section: 'Calificaciones' },
      { id: 'materia4_calificacion', label: 'Calificación 4',         type: 'text',     placeholder: 'Ej. 90',                   section: 'Calificaciones' },
      
      { id: 'creditos',              label: 'Créditos Cursados',      type: 'text',     placeholder: 'Ej. 32',                   section: 'Resumen' },
      { id: 'promedio',              label: 'Promedio General',       type: 'text',     placeholder: 'Ej. 95.75',                section: 'Resumen' },
      { id: 'fecha',                 label: 'Fecha de Emisión',       type: 'text',     placeholder: 'Ej. 24 de Mayo de 2026',   section: 'Firma' },
    ],
    generateHTML: () => `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: letter;
      margin: 20mm 15mm 20mm 15mm;
    }
    body {
      font-family: 'Arial', sans-serif;
      color: #1e293b;
      margin: 0;
      padding: 0;
      line-height: 1.5;
      font-size: 11pt;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 25px;
    }
    .header-title {
      text-align: center;
      vertical-align: middle;
    }
    .header-title h1 {
      font-size: 14pt;
      font-weight: 800;
      color: #006A3A; /* Verde TecNM */
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .header-title h2 {
      font-size: 11pt;
      font-weight: 600;
      color: #718096;
      margin: 5px 0 0 0;
    }
    .divider-line {
      height: 4px;
      background: linear-gradient(to right, #006A3A 0%, #006A3A 70%, #FDB614 70%, #FDB614 100%);
      margin-bottom: 30px;
      border-radius: 2px;
    }
    .doc-title {
      text-align: center;
      font-size: 13pt;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 25px;
      letter-spacing: 1px;
      color: #1a202c;
    }
    .student-info {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
      background-color: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
    }
    .student-info td {
      padding: 10px 15px;
      border-bottom: 1px solid #edf2f7;
    }
    .student-info td.label {
      font-weight: 700;
      color: #4a5568;
      width: 25%;
      font-size: 10pt;
      text-transform: uppercase;
    }
    .student-info td.value {
      color: #1a202c;
    }
    .grades-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 35px;
    }
    .grades-table th {
      background-color: #006A3A;
      color: #ffffff;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 9pt;
      padding: 10px 12px;
      border: 1px solid #006A3A;
      letter-spacing: 0.5px;
    }
    .grades-table td {
      padding: 10px 12px;
      border: 1px solid #e2e8f0;
      font-size: 10pt;
    }
    .grades-table tr:nth-child(even) {
      background-color: #f8fafc;
    }
    .text-center {
      text-align: center;
    }
    .text-right {
      text-align: right;
    }
    .summary-section {
      width: 50%;
      margin-left: auto;
      border-collapse: collapse;
      margin-bottom: 50px;
    }
    .summary-section td {
      padding: 8px 12px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 10pt;
    }
    .summary-section td.label {
      font-weight: 700;
      color: #4a5568;
    }
    .summary-section td.value {
      font-weight: 700;
      color: #006A3A;
      font-size: 11pt;
    }
    .sign-container {
      width: 100%;
      margin-top: 60px;
      text-align: center;
    }
    .sign-line {
      width: 250px;
      border-bottom: 1px solid #4a5568;
      margin: 0 auto 10px auto;
    }
    .sign-title {
      font-size: 10pt;
      font-weight: 700;
      color: #4a5568;
      text-transform: uppercase;
    }
    .sign-subtitle {
      font-size: 9pt;
      color: #718096;
    }
    .footer-date {
      margin-top: 40px;
      font-size: 9.5pt;
      color: #718096;
      text-align: right;
      font-style: italic;
    }
  </style>
</head>
<body>
  <table class="header-table">
    <tr>
      <td class="header-title">
        <h1>Tecnológico Nacional de México</h1>
        <h2>Instituto Tecnológico de Celaya</h2>
      </td>
    </tr>
  </table>
  <div class="divider-line"></div>
  <div class="doc-title">Constancia de Calificaciones</div>
  <table class="student-info">
    <tr>
      <td class="label">Nombre:</td>
      <td class="value"><strong>{{alumno}}</strong></td>
      <td class="label">No. Control:</td>
      <td class="value"><strong>{{control}}</strong></td>
    </tr>
    <tr>
      <td class="label">Carrera:</td>
      <td class="value">{{carrera}}</td>
      <td class="label">Período:</td>
      <td class="value">{{periodo}}</td>
    </tr>
  </table>
  <table class="grades-table">
    <thead>
      <tr>
        <th style="width: 15%;">Clave</th>
        <th style="text-align: left;">Materia</th>
        <th style="width: 15%; text-align: center;">Calificación</th>
        <th style="width: 20%; text-align: center;">Estatus</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-center">SC101</td>
        <td>{{materia1_nombre}}</td>
        <td class="text-center"><strong>{{materia1_calificacion}}</strong></td>
        <td class="text-center" style="font-weight: 600; color: #006A3A;">Aprobada</td>
      </tr>
      <tr>
        <td class="text-center">SC102</td>
        <td>{{materia2_nombre}}</td>
        <td class="text-center"><strong>{{materia2_calificacion}}</strong></td>
        <td class="text-center" style="font-weight: 600; color: #006A3A;">Aprobada</td>
      </tr>
      <tr>
        <td class="text-center">SC103</td>
        <td>{{materia3_nombre}}</td>
        <td class="text-center"><strong>{{materia3_calificacion}}</strong></td>
        <td class="text-center" style="font-weight: 600; color: #006A3A;">Aprobada</td>
      </tr>
      <tr>
        <td class="text-center">SC104</td>
        <td>{{materia4_nombre}}</td>
        <td class="text-center"><strong>{{materia4_calificacion}}</strong></td>
        <td class="text-center" style="font-weight: 600; color: #006A3A;">Aprobada</td>
      </tr>
    </tbody>
  </table>
  <table class="summary-section">
    <tr>
      <td class="label text-right">Créditos Cursados:</td>
      <td class="value text-center" style="color: #1a202c;">{{creditos}}</td>
    </tr>
    <tr>
      <td class="label text-right">Promedio General:</td>
      <td class="value text-center">{{promedio}}</td>
    </tr>
  </table>
  <div class="footer-date">
    Celaya, Guanajuato a {{fecha}}
  </div>
  <div class="sign-container">
    <div class="sign-line"></div>
    <div class="sign-title">Jefe del Departamento de Servicios Escolares</div>
    <div class="sign-subtitle">Sello y Firma Digital Autorizada</div>
  </div>
</body>
</html>`
  },

  carta: {
    label: 'Carta',
    fields: [
      { id: 'lugar_fecha',        label: 'Lugar y Fecha',          type: 'text',     placeholder: 'Celaya, Gto., 24/05/2026', section: 'Encabezado' },
      { id: 'nombre_destinatario',label: 'Nombre del Destinatario',type: 'text',     placeholder: 'Ej. Lic. Ana Martínez',   section: 'Destinatario' },
      { id: 'cargo_destinatario', label: 'Cargo',                  type: 'text',     placeholder: 'Ej. Coordinadora RR.HH.', section: 'Destinatario' },
      { id: 'empresa',            label: 'Empresa / Institución',  type: 'text',     placeholder: 'Ej. Empresa ABC S.A.',    section: 'Destinatario' },
      { id: 'saludo',             label: 'Saludo',                 type: 'text',     placeholder: 'Estimada Lic. Martínez:', section: 'Contenido' },
      { id: 'cuerpo_texto',       label: 'Cuerpo de la Carta',     type: 'textarea', placeholder: 'Por medio de la presente...', section: 'Contenido' },
      { id: 'despedida',          label: 'Despedida',              type: 'text',     placeholder: 'Quedo a sus órdenes.',    section: 'Contenido' },
      { id: 'nombre_firmante',    label: 'Nombre del Remitente',   type: 'text',     placeholder: 'Ej. Juan García',         section: 'Firma' },
      { id: 'cargo_firmante',     label: 'Cargo / Rol',            type: 'text',     placeholder: 'Ej. Estudiante de ISC',   section: 'Firma' },
    ],
    generateHTML: () => `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Times New Roman', Times, serif; color: #1a1a1a; padding: 60px; font-size: 13px; line-height: 1.75; }
    .lugar-fecha { text-align: right; margin-bottom: 28px; color: #555; }
    .destinatario { margin-bottom: 24px; }
    .destinatario .nombre { font-weight: bold; }
    .saludo { margin-bottom: 16px; }
    .cuerpo { text-align: justify; margin-bottom: 24px; }
    .despedida { margin-bottom: 50px; }
    .firma .nombre { font-weight: bold; }
    .firma .cargo  { color: #555; font-size: 12px; }
    .header-bar { background: #1B3A6B; color: white; padding: 10px 20px; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 40px; font-family: Arial, sans-serif; }
  </style>
</head>
<body>
  <div class="header-bar">Tecnológico Nacional de México · Campus Celaya</div>
  <div class="lugar-fecha">{{lugar_fecha}}</div>
  <div class="destinatario">
    <div class="nombre">{{nombre_destinatario}}</div>
    <div>{{cargo_destinatario}}</div>
    <div>{{empresa}}</div>
  </div>
  <div class="saludo">{{saludo}}</div>
  <div class="cuerpo"><p>{{cuerpo_texto}}</p></div>
  <div class="despedida">{{despedida}}</div>
  <div class="firma">
    <div class="nombre">{{nombre_firmante}}</div>
    <div class="cargo">{{cargo_firmante}}</div>
  </div>
</body>
</html>`
  },

  certificado: {
    label: 'Certificado',
    fields: [
      { id: 'nombre_receptor',  label: 'Nombre del Receptor',     type: 'text',     placeholder: 'Ej. Juan Carlos García',   section: 'Receptor' },
      { id: 'motivo',           label: 'Motivo / Logro',          type: 'text',     placeholder: 'Ej. Primer lugar en hackathon', section: 'Contenido' },
      { id: 'evento',           label: 'Evento o Programa',       type: 'text',     placeholder: 'Ej. HackTecNM 2026',       section: 'Contenido' },
      { id: 'descripcion',      label: 'Descripción adicional',   type: 'textarea', placeholder: 'Detalles del reconocimiento...', section: 'Contenido' },
      { id: 'fecha',            label: 'Fecha',                   type: 'text',     placeholder: 'Mayo 2026',                section: 'Fecha' },
      { id: 'nombre_firmante',  label: 'Autoridad Firmante',      type: 'text',     placeholder: 'Ej. Dr. Carlos Romo',      section: 'Firma' },
      { id: 'cargo_firmante',   label: 'Cargo',                   type: 'text',     placeholder: 'Ej. Director del Plantel', section: 'Firma' },
    ],
    generateHTML: () => `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Georgia', serif; background: #fff; padding: 50px; text-align: center; color: #1a1a1a; }
    .border { border: 6px double #1B3A6B; padding: 40px; min-height: 600px; display:flex; flex-direction:column; justify-content:center; }
    .top-ornament { color: #1B3A6B; font-size: 28px; letter-spacing: 6px; margin-bottom: 8px; }
    .institution { font-size: 13px; letter-spacing: 3px; text-transform: uppercase; color: #1B3A6B; margin-bottom: 20px; }
    .cert-title { font-size: 36px; font-weight: bold; color: #1B3A6B; letter-spacing: 4px; text-transform: uppercase; margin: 14px 0; }
    .certifica { font-size: 14px; color: #555; margin-bottom: 6px; }
    .nombre { font-size: 28px; font-weight: bold; color: #1B3A6B; border-bottom: 2px solid #1B3A6B; display: inline-block; padding: 0 20px 6px; margin: 14px 0; }
    .motivo { font-size: 16px; font-style: italic; color: #333; margin: 10px 0; }
    .evento { font-size: 14px; color: #1B3A6B; font-weight: bold; margin: 6px 0; }
    .descripcion { font-size: 12px; color: #666; margin: 14px auto; max-width: 460px; }
    .fecha { margin: 30px 0; font-size: 12px; color: #777; }
    .firma-linea { border-top: 1px solid #1B3A6B; width: 220px; margin: 0 auto 8px; }
    .firma-nombre { font-weight: bold; font-size: 13px; }
    .firma-cargo { font-size: 11px; color: #666; }
    .bottom-ornament { color: #1B3A6B; font-size: 20px; letter-spacing: 4px; margin-top: 16px; }
  </style>
</head>
<body>
  <div class="border">
    <div class="top-ornament">✦ ✦ ✦</div>
    <div class="institution">Tecnológico Nacional de México · Campus Celaya</div>
    <div class="cert-title">Certificado</div>
    <div class="certifica">Se otorga el presente reconocimiento a:</div>
    <div class="nombre">{{nombre_receptor}}</div>
    <div class="motivo">Por: {{motivo}}</div>
    <div class="evento">{{evento}}</div>
    <p class="descripcion">{{descripcion}}</p>
    <div class="fecha">{{fecha}}</div>
    <div class="firma-linea"></div>
    <div class="firma-nombre">{{nombre_firmante}}</div>
    <div class="firma-cargo">{{cargo_firmante}}</div>
    <div class="bottom-ornament">✦ ✦ ✦</div>
  </div>
</body>
</html>`
  },

  tabla: {
    label: 'Tabla de Datos',
    fields: [
      { id: 'titulo_tabla',   label: 'Título de la Tabla',      type: 'text',     placeholder: 'Ej. Lista de Calificaciones',  section: 'Encabezado' },
      { id: 'departamento',   label: 'Departamento',            type: 'text',     placeholder: 'Ej. Depto. de Sistemas',       section: 'Encabezado' },
      { id: 'periodo',        label: 'Período',                 type: 'text',     placeholder: 'Ej. Ene–Jun 2026',             section: 'Encabezado' },
      { id: 'columna1',       label: 'Nombre Columna 1',        type: 'text',     placeholder: 'Ej. Nombre',                   section: 'Columnas' },
      { id: 'columna2',       label: 'Nombre Columna 2',        type: 'text',     placeholder: 'Ej. Control',                  section: 'Columnas' },
      { id: 'columna3',       label: 'Nombre Columna 3',        type: 'text',     placeholder: 'Ej. Calificación',             section: 'Columnas' },
      { id: 'fecha',          label: 'Fecha de Emisión',        type: 'text',     placeholder: 'Ej. 24 de Mayo 2026',          section: 'Pie' },
      { id: 'nombre_firmante',label: 'Responsable',             type: 'text',     placeholder: 'Ej. M.C. Ana García',          section: 'Pie' },
    ],
    generateHTML: () => `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; padding: 40px; font-size: 12px; }
    .header { border-bottom: 3px solid #1B3A6B; padding-bottom: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
    .header-left h1 { font-size: 14px; font-weight: bold; text-transform: uppercase; color: #1B3A6B; }
    .header-left p { font-size: 11px; color: #666; margin-top: 2px; }
    .header-right { text-align: right; font-size: 11px; color: #666; }
    h2 { font-size: 16px; text-align: center; margin-bottom: 16px; color: #1B3A6B; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #1B3A6B; color: white; }
    th { padding: 10px 12px; text-align: left; font-size: 12px; letter-spacing: 0.5px; }
    td { padding: 9px 12px; border-bottom: 1px solid #e5e7eb; }
    tbody tr:nth-child(even) { background: #f1f5f9; }
    tbody tr:hover { background: #dbeafe; }
    .footer { margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #e5e7eb; padding-top: 14px; }
    .footer .linea { border-top: 1px solid #1B3A6B; width: 180px; margin-bottom: 6px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      <h1>TecNM Campus Celaya</h1>
      <p>{{departamento}} · Período: {{periodo}}</p>
    </div>
    <div class="header-right">Fecha: {{fecha}}</div>
  </div>
  <h2>{{titulo_tabla}}</h2>
  <table>
    <thead>
      <tr>
        <th>{{columna1}}</th>
        <th>{{columna2}}</th>
        <th>{{columna3}}</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>{{fila1_col1}}</td><td>{{fila1_col2}}</td><td>{{fila1_col3}}</td></tr>
      <tr><td>{{fila2_col1}}</td><td>{{fila2_col2}}</td><td>{{fila2_col3}}</td></tr>
      <tr><td>{{fila3_col1}}</td><td>{{fila3_col2}}</td><td>{{fila3_col3}}</td></tr>
    </tbody>
  </table>
  <div class="footer">
    <div></div>
    <div>
      <div class="linea"></div>
      <div><strong>{{nombre_firmante}}</strong></div>
    </div>
  </div>
</body>
</html>`
  },

  circular: {
    label: 'Circular',
    fields: [
      { id: 'numero_circular', label: 'Número de Circular',      type: 'text',     placeholder: 'Ej. CIRC-2026-010',         section: 'Encabezado' },
      { id: 'fecha',           label: 'Fecha',                   type: 'text',     placeholder: 'Ej. 24 de Mayo de 2026',    section: 'Encabezado' },
      { id: 'para',            label: 'Para (Destinatarios)',     type: 'text',     placeholder: 'Ej. Todo el personal docente', section: 'Distribución' },
      { id: 'de_parte',        label: 'De parte de',             type: 'text',     placeholder: 'Ej. Dirección del Plantel', section: 'Distribución' },
      { id: 'asunto',          label: 'Asunto',                  type: 'text',     placeholder: 'Ej. Convocatoria examen...',section: 'Distribución' },
      { id: 'cuerpo_texto',    label: 'Cuerpo del Comunicado',   type: 'textarea', placeholder: 'Por este medio se comunica...', section: 'Contenido' },
      { id: 'nombre_firmante', label: 'Nombre del Firmante',     type: 'text',     placeholder: 'Ej. Dr. Carlos Romo',       section: 'Firma' },
      { id: 'cargo_firmante',  label: 'Cargo',                   type: 'text',     placeholder: 'Ej. Director del Plantel',  section: 'Firma' },
    ],
    generateHTML: () => `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; color: #1a1a1a; padding: 50px; font-size: 13px; }
    .header { background: #1B3A6B; color: white; padding: 16px 24px; margin-bottom: 28px; }
    .header h1 { font-size: 14px; letter-spacing: 1px; text-transform: uppercase; }
    .header p  { font-size: 11px; opacity: 0.8; margin-top: 2px; }
    .tag { display: inline-block; background: #EFF6FF; border-left: 4px solid #1B3A6B; color: #1B3A6B; padding: 4px 10px; font-size: 12px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 18px; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 22px; }
    .meta-table td { padding: 6px 8px; font-size: 12px; border-bottom: 1px solid #e5e7eb; }
    .meta-table td:first-child { font-weight: bold; width: 120px; color: #1B3A6B; }
    .cuerpo { text-align: justify; line-height: 1.8; margin-bottom: 40px; }
    .firma { margin-top: 50px; }
    .linea { border-top: 1px solid #1a1a1a; width: 200px; margin-bottom: 6px; }
    .nombre { font-weight: bold; }
    .cargo  { font-size: 11px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Tecnológico Nacional de México · Campus Celaya</h1>
    <p>Circular No. {{numero_circular}} · {{fecha}}</p>
  </div>
  <div class="tag">Circular Interna</div>
  <table class="meta-table">
    <tr><td>Para:</td><td>{{para}}</td></tr>
    <tr><td>De parte de:</td><td>{{de_parte}}</td></tr>
    <tr><td>Asunto:</td><td>{{asunto}}</td></tr>
    <tr><td>Fecha:</td><td>{{fecha}}</td></tr>
  </table>
  <div class="cuerpo"><p>{{cuerpo_texto}}</p></div>
  <div class="firma">
    <div class="linea"></div>
    <div class="nombre">{{nombre_firmante}}</div>
    <div class="cargo">{{cargo_firmante}}</div>
  </div>
</body>
</html>`
  },
};

// ============================================================
// LÓGICA DEL CONSTRUCTOR
// ============================================================

let selectedDocType = 'oficio';

function initTemplateBuilder() {
  const tabBuilder    = document.getElementById('tab-builder');
  const tabHtml       = document.getElementById('tab-html');
  const panelBuilder  = document.getElementById('panel-builder');
  const panelHtml     = document.getElementById('panel-html');
  const typeGrid      = document.getElementById('doc-type-grid');
  const builderFields = document.getElementById('visual-builder-fields');
  const generateBtn   = document.getElementById('btn-generate-html');
  const copyBtn       = document.getElementById('btn-copy-html');
  const htmlTextarea  = document.getElementById('template-html');

  if (!tabBuilder) return; // modal not on page yet

  // ── Tab switching ──
  tabBuilder.addEventListener('click', () => {
    tabBuilder.classList.add('active');
    tabHtml.classList.remove('active');
    panelBuilder.classList.add('active');
    panelHtml.classList.remove('active');
  });

  tabHtml.addEventListener('click', () => {
    tabHtml.classList.add('active');
    tabBuilder.classList.remove('active');
    panelHtml.classList.add('active');
    panelBuilder.classList.remove('active');
    // Auto-generate HTML when switching to HTML editor
    if (!htmlTextarea.value.trim()) {
      htmlTextarea.value = buildHtmlFromForm();
    }
  });

  // ── Document type selection ──
  typeGrid.querySelectorAll('.doc-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      typeGrid.querySelectorAll('.doc-type-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedDocType = btn.dataset.type;
      renderBuilderFields(selectedDocType);
    });
  });

  // Render initial fields for default type
  renderBuilderFields(selectedDocType);

  // ── "Generate HTML" button ──
  generateBtn.addEventListener('click', () => {
    const html = buildHtmlFromForm();
    htmlTextarea.value = html;
    // Switch to HTML tab to show result
    tabHtml.click();
    showToast('HTML generado con tus datos ✓');
  });

  // ── Copy HTML button ──
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(htmlTextarea.value).then(() => showToast('HTML copiado al portapapeles'));
    });
  }

  // ── Intercept template form submit to ensure HTML is populated ──
  const templateForm = document.getElementById('template-form');
  if (templateForm) {
    templateForm.addEventListener('submit', (e) => {
      // If we're in builder mode and HTML is empty, generate it first
      const isBuilderActive = panelBuilder.classList.contains('active');
      if (isBuilderActive && !htmlTextarea.value.trim()) {
        htmlTextarea.value = buildHtmlFromForm();
      }
      // If still empty, prevent and alert
      if (!htmlTextarea.value.trim()) {
        e.preventDefault();
        e.stopPropagation();
        alert('Por favor genera el HTML de la plantilla antes de guardar.');
      }
    }, true); // capture phase so it runs BEFORE dashboard.js listener
  }
}

function renderBuilderFields(docType) {
  const container = document.getElementById('visual-builder-fields');
  if (!container) return;
  const config = DOC_TYPES[docType];
  if (!config) return;

  let lastSection = '';
  container.innerHTML = '';

  config.fields.forEach(field => {
    if (field.section !== lastSection) {
      const label = document.createElement('div');
      label.className = 'builder-section-label';
      label.textContent = field.section;
      container.appendChild(label);
      lastSection = field.section;
    }

    const group = document.createElement('div');
    group.className = 'form-group';

    const lbl = document.createElement('label');
    lbl.setAttribute('for', `builder-${field.id}`);
    lbl.textContent = field.label;

    let input;
    if (field.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = 3;
    } else {
      input = document.createElement('input');
      input.type = 'text';
    }

    input.id = `builder-${field.id}`;
    input.className = 'form-control';
    input.placeholder = field.placeholder;
    input.dataset.varId = field.id;

    group.appendChild(lbl);
    group.appendChild(input);
    container.appendChild(group);
  });
}

function buildHtmlFromForm() {
  const config = DOC_TYPES[selectedDocType];
  if (!config) return '';

  // Collect values from builder form fields
  const data = {};
  const container = document.getElementById('visual-builder-fields');
  if (container) {
    container.querySelectorAll('[data-var-id]').forEach(input => {
      const varId = input.dataset.varId;
      const value = input.value.trim();
      data[varId] = value || `{{${varId}}}`;
    });
  }

  // Generate template HTML — replace sample values with Handlebars variables
  // Actually keep as Handlebars template with {{varId}} — the visual builder
  // just populates defaults for the generator, not hardcodes them
  return config.generateHTML(data);
}

function showToast(msg) {
  let toast = document.getElementById('builder-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'builder-toast';
    toast.style.cssText = `
      position: fixed; bottom: 2rem; right: 2rem; z-index: 9999;
      background: #1B3A6B; color: white; padding: 0.7rem 1.2rem;
      border-radius: 8px; font-size: 0.85rem; font-family: Inter, sans-serif;
      font-weight: 600; box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      transition: opacity 0.3s ease, transform 0.3s ease;
      opacity: 0; transform: translateY(8px);
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
  }, 2500);
}

// ── Bootstrap on DOM ready ──
document.addEventListener('DOMContentLoaded', initTemplateBuilder);
