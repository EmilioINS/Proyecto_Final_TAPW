const puppeteer = require('puppeteer');
const handlebars = require('handlebars');

class PdfService {
    async generatePdfFromHtml(htmlContent, data) {
        // Compile the template with handlebars
        const template = handlebars.compile(htmlContent);
        const finalHtml = template(data);

        // Launch puppeteer
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: 'new'
        });

        const page = await browser.newPage();
        
        // Set the HTML content
        await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });

        await browser.close();
        return pdfBuffer;
    }
}

module.exports = new PdfService();
