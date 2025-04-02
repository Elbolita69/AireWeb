// KML Handler - Utilidad para procesar archivos KML y KMZ
const KMLHandler = (() => {
  // Función para procesar un archivo KML o KMZ
  async function processFile(file) {
    if (file.name.toLowerCase().endsWith(".kmz")) {
      return await processKMZ(file)
    } else if (file.name.toLowerCase().endsWith(".kml")) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const kmlData = procesarKML(e.target.result)
            resolve(kmlData)
          } catch (error) {
            reject(error)
          }
        }
        reader.onerror = (e) => reject(new Error("Error al leer el archivo KML"))
        reader.readAsText(file)
      })
    } else {
      throw new Error("Formato de archivo no soportado. Solo se aceptan archivos KML y KMZ.")
    }
  }

  // Función para procesar un archivo KMZ (ZIP que contiene un KML)
  async function processKMZ(file) {
    try {
      // Ensure JSZip is available.  If not, you'll need to include it in your project.
      if (typeof JSZip === "undefined") {
        throw new Error("JSZip library is required to process KMZ files.  Please include it in your project.")
      }

      const zip = await JSZip.loadAsync(file)

      // Buscar el archivo KML dentro del ZIP
      let kmlFile = null
      let kmlContent = null

      // Primero buscar doc.kml (nombre estándar)
      if (zip.files["doc.kml"]) {
        kmlFile = zip.files["doc.kml"]
      } else {
        // Si no existe, buscar cualquier archivo .kml
        for (const filename in zip.files) {
          if (filename.toLowerCase().endsWith(".kml")) {
            kmlFile = zip.files[filename]
            break
          }
        }
      }

      if (!kmlFile) {
        throw new Error("No se encontró ningún archivo KML dentro del KMZ")
      }

      // Extraer el contenido del KML
      kmlContent = await kmlFile.async("text")

      // Procesar el KML
      return procesarKML(kmlContent)
    } catch (error) {
      console.error("Error al procesar archivo KMZ:", error)
      throw error
    }
  }

  // Modify KML handler to extract folder information and handle POSTES folder
  function procesarKML(kmlContent) {
    try {
      // Crear un parser de XML
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(kmlContent, "text/xml")

      // Verificar si hay errores en el XML
      const parserError = xmlDoc.querySelector("parsererror")
      if (parserError) {
        throw new Error("Error al parsear el XML: " + parserError.textContent)
      }

      // Extraer puntos (Placemarks)
      const puntos = []
      const placemarks = xmlDoc.querySelectorAll("Placemark")

      placemarks.forEach((placemark) => {
        const nombre = placemark.querySelector("name")?.textContent || ""
        const descripcion = placemark.querySelector("description")?.textContent || ""

        // Extract folder information by tracing back to parent Folder elements
        let carpeta = ""
        let currentElement = placemark
        while (currentElement.parentElement) {
          if (currentElement.parentElement.tagName === "Folder") {
            const folderName = currentElement.parentElement.querySelector("name")?.textContent || ""
            if (folderName) {
              carpeta = folderName
              break
            }
          }
          currentElement = currentElement.parentElement
        }

        // Buscar coordenadas en Point
        const point = placemark.querySelector("Point")
        if (point) {
          const coordsText = point.querySelector("coordinates")?.textContent
          if (coordsText) {
            const coords = coordsText.trim().split(",")
            if (coords.length >= 2) {
              puntos.push({
                nombre: nombre,
                descripcion: descripcion,
                lng: Number.parseFloat(coords[0]),
                lat: Number.parseFloat(coords[1]),
                lon: Number.parseFloat(coords[0]), // Añadir también como 'lon' para compatibilidad
                alt: coords.length > 2 ? Number.parseFloat(coords[2]) : 0,
                carpeta: carpeta, // Add folder information
              })
            }
          }
        }

        // Buscar coordenadas en LineString (para rutas)
        const lineString = placemark.querySelector("LineString")
        if (lineString) {
          const coordsText = lineString.querySelector("coordinates")?.textContent
          if (coordsText) {
            const coordsArray = coordsText.trim().split(/\s+/)
            const puntosRuta = coordsArray.map((coordStr) => {
              const coords = coordStr.split(",")
              return {
                lng: Number.parseFloat(coords[0]),
                lat: Number.parseFloat(coords[1]),
                lon: Number.parseFloat(coords[0]), // Añadir también como 'lon' para compatibilidad
                alt: coords.length > 2 ? Number.parseFloat(coords[2]) : 0,
                carpeta: carpeta, // Add folder information
              }
            })

            // Añadir la ruta
            if (!this.rutas) this.rutas = []
            this.rutas.push({
              nombre: nombre,
              descripcion: descripcion,
              puntos: puntosRuta,
              carpeta: carpeta, // Add folder information
            })
          }
        }
      })

      // Extraer rutas (LineString)
      const rutas = []
      const lineStrings = xmlDoc.querySelectorAll("LineString")

      lineStrings.forEach((lineString) => {
        const placemark = lineString.closest("Placemark")
        const nombre = placemark?.querySelector("name")?.textContent || ""
        const descripcion = placemark?.querySelector("description")?.textContent || ""

        // Extract folder information
        let carpeta = ""
        let currentElement = lineString.closest("Placemark")
        while (currentElement.parentElement) {
          if (currentElement.parentElement.tagName === "Folder") {
            const folderName = currentElement.parentElement.querySelector("name")?.textContent || ""
            if (folderName) {
              carpeta = folderName
              break
            }
          }
          currentElement = currentElement.parentElement
        }

        const coordsText = lineString.querySelector("coordinates")?.textContent
        if (coordsText) {
          const coordsArray = coordsText.trim().split(/\s+/)
          const puntosRuta = coordsArray.map((coordStr) => {
            const coords = coordStr.split(",")
            return {
              lng: Number.parseFloat(coords[0]),
              lat: Number.parseFloat(coords[1]),
              lon: Number.parseFloat(coords[0]), // Añadir también como 'lon' para compatibilidad
              alt: coords.length > 2 ? Number.parseFloat(coords[2]) : 0,
            }
          })

          rutas.push({
            nombre: nombre,
            descripcion: descripcion,
            puntos: puntosRuta,
            carpeta: carpeta, // Add folder information
          })
        }
      })

      return {
        puntos: puntos,
        rutas: rutas,
      }
    } catch (error) {
      console.error("Error al procesar KML:", error)
      throw error
    }
  }

  // Exponer las funciones públicas
  return {
    processFile: processFile,
    procesarKML: procesarKML,
  }
})()

// Si estamos en un entorno de Node.js, exportar el módulo
if (typeof module !== "undefined" && module.exports) {
  module.exports = KMLHandler
}

