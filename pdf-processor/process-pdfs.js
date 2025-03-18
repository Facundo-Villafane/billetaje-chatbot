const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

async function processPDFs() {
  // Directorio donde están tus PDFs
  const pdfDir = "./pdfs";
  
  // Crear directorio si no existe
  if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir);
    console.log("Coloca tus PDFs en la carpeta 'pdfs' y ejecuta este script nuevamente.");
    return;
  }
  
  const pdfFiles = fs.readdirSync(pdfDir).filter(file => file.endsWith('.pdf'));
  
  if (pdfFiles.length === 0) {
    console.log("No se encontraron archivos PDF en la carpeta 'pdfs'.");
    return;
  }
  
  console.log(`Procesando ${pdfFiles.length} archivos PDF...`);
  
  // Objeto para almacenar el contenido extraído
  const contentSections = {};
  
  // Procesar cada PDF
  for (const pdfFile of pdfFiles) {
    console.log(`Procesando: ${pdfFile}`);
    const filePath = path.join(pdfDir, pdfFile);
    
    try {
      // Leer el archivo PDF
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      
      // Extraer el texto
      const fullText = data.text;
      
      // Dividir en secciones de aproximadamente 1000 caracteres
      const sections = splitIntoSections(fullText, 1000);
      
      // Almacenar las secciones
      const baseKey = pdfFile.replace('.pdf', '');
      sections.forEach((section, index) => {
        contentSections[`${baseKey}_section_${index + 1}`] = section;
      });
      
    } catch (error) {
      console.error(`Error al procesar ${pdfFile}:`, error);
    }
  }
  
  // Guardar el contenido extraído en un archivo JSON
  fs.writeFileSync(
    "./course-content.json", 
    JSON.stringify(contentSections, null, 2)
  );
  
  console.log(`Proceso completado. Se extrajeron ${Object.keys(contentSections).length} secciones.`);
  console.log("El contenido se ha guardado en 'course-content.json'");
}

// Función para dividir texto en secciones
function splitIntoSections(text, maxLength) {
  const sections = [];
  let currentSection = "";
  
  // Dividir por párrafos o saltos de línea
  const paragraphs = text.split(/\n+/);
  
  for (const paragraph of paragraphs) {
    // Si es una línea vacía, continuar
    if (paragraph.trim().length === 0) continue;
    
    // Si el párrafo añadido excedería la longitud máxima, empezamos una nueva sección
    if (currentSection.length + paragraph.length > maxLength && currentSection.length > 0) {
      sections.push(currentSection.trim());
      currentSection = "";
    }
    
    currentSection += paragraph + "\n";
  }
  
  // Añadir la última sección si queda texto
  if (currentSection.trim().length > 0) {
    sections.push(currentSection.trim());
  }
  
  return sections;
}

// Ejecutar el procesamiento
processPDFs().catch(console.error);