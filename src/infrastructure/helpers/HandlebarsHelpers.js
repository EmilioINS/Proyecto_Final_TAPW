const Handlebars = require('handlebars');

class HandlebarsHelpers {
    static registerHelpers() {
        // Helper para QuickChart (Gráficas)
        // Ejemplo de uso: {{chart type="pie" data=chartData title="Mi Gráfica"}}
        Handlebars.registerHelper('chart', function(options) {
            const { type = 'bar', data = {}, title = '' } = options.hash;
            
            // Construir el payload para QuickChart
            const chartConfig = {
                type: type,
                data: data,
                options: {
                    plugins: {
                        title: {
                            display: !!title,
                            text: title
                        }
                    }
                }
            };

            const encodedChart = encodeURIComponent(JSON.stringify(chartConfig));
            // Devolver directamente el tag de la imagen. Al usar SafeString evitamos que escape el HTML
            const imgUrl = `https://quickchart.io/chart?c=${encodedChart}&w=500&h=300`;
            return new Handlebars.SafeString(`<img src="${imgUrl}" alt="Gráfica dinámica" class="w-full max-w-lg mx-auto" />`);
        });

        // Helper para QR Code
        // Ejemplo: {{qrCode data="https://midominio.com/validar" size="150x150"}}
        Handlebars.registerHelper('qrCode', function(options) {
            const { data = '', size = '150x150' } = options.hash;
            const encodedData = encodeURIComponent(data);
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${encodedData}`;
            return new Handlebars.SafeString(`<img src="${qrUrl}" alt="QR Code" width="${size.split('x')[0]}" height="${size.split('x')[1]}" />`);
        });

        // Helper para condicionales matemáticos / lógicos
        // Ejemplo: {{#ifCond v1 '==' v2}} ... {{/ifCond}}
        Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
            switch (operator) {
                case '==':
                    return (v1 == v2) ? options.fn(this) : options.inverse(this);
                case '===':
                    return (v1 === v2) ? options.fn(this) : options.inverse(this);
                case '!=':
                    return (v1 != v2) ? options.fn(this) : options.inverse(this);
                case '!==':
                    return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                case '<':
                    return (v1 < v2) ? options.fn(this) : options.inverse(this);
                case '<=':
                    return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                case '>':
                    return (v1 > v2) ? options.fn(this) : options.inverse(this);
                case '>=':
                    return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                case '&&':
                    return (v1 && v2) ? options.fn(this) : options.inverse(this);
                case '||':
                    return (v1 || v2) ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        });

        // Helper de fecha básica (formato simple local)
        Handlebars.registerHelper('formatDate', function(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
        });

        // Helper para moneda
        Handlebars.registerHelper('currency', function(value) {
            if (isNaN(value)) return value;
            return '$ ' + parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        });
    }
}

module.exports = HandlebarsHelpers;
