const puppeteer = require('puppeteer');
const handlebars = require('handlebars');
const HandlebarsHelpers = require('../helpers/HandlebarsHelpers');

// Registrar los helpers globales
HandlebarsHelpers.registerHelpers();

class PdfService {
    /**
     * @param {string} htmlContent - El HTML en crudo con variables Handlebars.
     * @param {object} data - Payload de datos para inyectar en el template.
     * @param {object} options - Opciones adicionales para Puppeteer (format, landscape, margins).
     */
    async generatePdfFromHtml(htmlContent, data, options = {}) {
        // 1. Inyectar Tailwind CSS y estilos base para mejorar el diseño si no están presentes.
        // Se inyecta antes del head o al inicio.
        const tailwindScript = `<script src="https://cdn.tailwindcss.com"></script>
        <style>
            @media print {
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                .page-break { page-break-before: always; }
                .avoid-break { page-break-inside: avoid; }
            }
        </style>`;
        
        let processedHtml = htmlContent;
        if (!processedHtml.includes('tailwindcss.com')) {
            if (processedHtml.includes('<head>')) {
                processedHtml = processedHtml.replace('<head>', '<head>' + tailwindScript);
            } else {
                processedHtml = tailwindScript + processedHtml;
            }
        }

        // 2. Compilar el template con handlebars
        const template = handlebars.compile(processedHtml);
        const finalHtml = template(data);

        // 3. Opciones por defecto y mezcla con las personalizadas
        const defaultPdfOptions = {
            format: 'A4',
            printBackground: true,
            landscape: false,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        };

        const pdfOptions = { ...defaultPdfOptions, ...options };
        
        // Validar si vienen márgenes personalizados (ej. para credenciales sin márgenes)
        if (options.margin === false || options.margin === null) {
            pdfOptions.margin = { top: 0, right: 0, bottom: 0, left: 0 };
        } else if (options.margin) {
            pdfOptions.margin = { ...defaultPdfOptions.margin, ...options.margin };
        }

        // 4. Lanzar puppeteer
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: 'new'
        });

        const page = await browser.newPage();
        
        // 5. Configurar el contenido y esperar a que recursos (imágenes, scripts como tailwind) carguen
        await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

        // 6. Generar PDF
        const pdfBuffer = await page.pdf(pdfOptions);

        await browser.close();
        return pdfBuffer;
    }
}

module.exports = new PdfService();
