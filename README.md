# Billr - Asistente Virtual para Billetaje y Reservas [View](https://billr.netlify.com/)

![Estado del Proyecto](https://img.shields.io/badge/Estado-En%20Desarrollo-brightgreen)
![Versión](https://img.shields.io/badge/Versión-1.4.0-blue)
![Licencia](https://img.shields.io/badge/Licencia-MIT-green)

## Descripción
Billr es un chatbot inteligente diseñado específicamente para la materia de Billetaje y Reservas Aeronáuticas. Este asistente virtual ayuda a los estudiantes a obtener información sobre sistemas de reservas aéreos, revenue management, atención al cliente en aeropuertos y detalles administrativos del curso.

## Características
- 💬 Interfaz de chat intuitiva y responsive
- 🤖 Respuestas basadas en IA utilizando la API de Groq
- 📚 Conocimiento específico sobre billetaje y reservas aeronáuticas
- 📅 Información actualizada sobre fechas de exámenes y entregas
- 📱 Integración sencilla con Moodle a través de iframe

## Tecnologías utilizadas
- React + Vite para el frontend
- Tailwind CSS para el diseño
- Netlify Functions para el backend serverless
- API de Groq (LLama 3) para la generación de respuestas
- React Markdown para formateo de respuestas

## Instalación local

### Requisitos previos
- Node.js (v14 o superior)
- Cuenta en Netlify
- Clave API de Groq

### Pasos de instalación
1. Clona el repositorio:
   ```bash
   git clone https://github.com/Facundo-Villafane/billetaje-chatbot.git
   cd billetaje-chatbot
   ```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo .env en la raíz del proyecto:
```bash
GROQ_API_KEY=tu_clave_api_aquí
```

4. Instala la CLI de Netlify:
```bash
npm install -g netlify-cli
```

5. Inicia el servidor de desarrollo:
```bash
netlify dev
```

### Despliegue en producción

- Haz commit de tus cambios y súbelos a GitHub
- Conéctate a Netlify y configura el despliegue desde tu repositorio
- Configura la variable de entorno GROQ_API_KEY en Netlify
- Despliega el sitio

## Integración con Moodle
Para integrar el chatbot en Moodle:

* Añade un recurso "Página" en tu curso
* Edita como HTML y añade:
```html
<iframe src="https://tu-chatbot.netlify.app" width="100%" height="600px" frameborder="0"></iframe>
```


## Personalización
El chatbot puede personalizarse modificando:

* El nombre del bot en App.jsx
* Los colores y estilos en el archivo CSS y componentes
* La información del curso en la función de Netlify ask-groq.js

## Mantenimiento
Para mantener el chatbot actualizado:

- Revisa y ajusta la información de fechas y eventos del curso
- Añade nuevo contenido académico al objeto courseContent
- Optimiza las respuestas basándote en la retroalimentación de los estudiantes

## Contribuciones
Las contribuciones son bienvenidas. Por favor, abre un issue antes de enviar un pull request.

## Autor
Desarrollado por Prof. Facundo Villafañe para la cátedra de Billetaje y Reservas.
