// BrigadaCenso.js - Funcionalidades para el rol de Brigada Censo
import { auth, db, storage } from "./Firebase.js"
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js"
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js"
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-storage.js"

// Variables globales
let currentUser = null
let projectsData = []

// Inicialización cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  // Verificar autenticación
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user
      checkUserRole()
      setupUI()
      loadAssignedProjects()
    } else {
      // Redirigir al login si no hay usuario autenticado
      window.location.href = "login.html"
    }
  })

  // Configurar listeners para botones y eventos
  document.getElementById("logoutBtn").addEventListener("click", logout)
})

// Verificar que el usuario tenga el rol de Brigada
async function checkUserRole() {
  try {
    const userRef = doc(db, "usuarios", currentUser.uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data()
      if (userData.rol !== "Brigada") {
        // Redirigir según el rol
        redirectByRole(userData.rol)
      }
    } else {
      console.error("No se encontró información del usuario")
      logout()
    }
  } catch (error) {
    console.error("Error al verificar el rol:", error)
    alert("Error al verificar permisos. Por favor, intente nuevamente.")
  }
}

// Redirigir según el rol del usuario
function redirectByRole(role) {
  switch (role) {
    case "PRST":
      window.location.href = "prst.html"
      break
    case "Ejecutiva":
      window.location.href = "ejecutiva.html"
      break
    case "Coordinador":
      window.location.href = "coordinador.html"
      break
    case "Analista":
      window.location.href = "analista.html"
      break
    default:
      window.location.href = "login.html"
  }
}

// Configurar la interfaz de usuario
function setupUI() {
  // Mostrar nombre del usuario
  const userNameElement = document.getElementById("userName")
  if (userNameElement && currentUser.displayName) {
    userNameElement.textContent = currentUser.displayName
  }

  // Configurar filtros y buscador
  setupFilters()
  setupSearchBar()
}

// Configurar filtros de proyectos
function setupFilters() {
  const filterSelect = document.getElementById("projectFilter")
  if (filterSelect) {
    filterSelect.addEventListener("change", () => {
      filterProjects(filterSelect.value)
    })
  }
}

// Configurar barra de búsqueda
function setupSearchBar() {
  const searchInput = document.getElementById("searchProject")
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase()
      searchProjects(searchTerm)
    })
  }
}

// Cargar proyectos asignados a la brigada
async function loadAssignedProjects() {
  try {
    const projectsContainer = document.getElementById("projectsList")
    projectsContainer.innerHTML = '<p class="loading">Cargando proyectos...</p>'

    // Consultar proyectos asignados a la brigada actual
    const projectsQuery = query(
      collection(db, "proyectos"),
      where("brigadaId", "==", currentUser.uid),
      where("estado", "==", "Asignado"),
    )

    const querySnapshot = await getDocs(projectsQuery)
    projectsData = []

    if (querySnapshot.empty) {
      projectsContainer.innerHTML = '<p class="no-projects">No tienes proyectos asignados actualmente.</p>'
      return
    }

    // Procesar los proyectos
    querySnapshot.forEach((doc) => {
      const project = {
        id: doc.id,
        ...doc.data(),
      }
      projectsData.push(project)
    })

    // Mostrar los proyectos
    displayProjects(projectsData)
  } catch (error) {
    console.error("Error al cargar proyectos:", error)
    document.getElementById("projectsList").innerHTML =
      '<p class="error">Error al cargar proyectos. Por favor, intente nuevamente.</p>'
  }
}

// Mostrar proyectos en la interfaz
function displayProjects(projects) {
  const projectsContainer = document.getElementById("projectsList")
  projectsContainer.innerHTML = ""

  projects.forEach((project) => {
    const projectCard = document.createElement("div")
    projectCard.className = "project-card"
    projectCard.innerHTML = `
            <h3>${project.nombre}</h3>
            <p><strong>Cliente:</strong> ${project.cliente}</p>
            <p><strong>Fecha de creación:</strong> ${new Date(project.fechaCreacion.seconds * 1000).toLocaleDateString()}</p>
            <p><strong>Estado:</strong> ${project.estado}</p>
            <div class="project-actions">
                <button class="btn-view" data-id="${project.id}">Ver detalles</button>
                <button class="btn-census" data-id="${project.id}">Realizar censo</button>
            </div>
        `

    projectsContainer.appendChild(projectCard)
  })

  // Agregar event listeners a los botones
  document.querySelectorAll(".btn-view").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const projectId = e.target.getAttribute("data-id")
      openProjectDetails(projectId)
    })
  })

  document.querySelectorAll(".btn-census").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const projectId = e.target.getAttribute("data-id")
      openCensusForm(projectId)
    })
  })
}

// Filtrar proyectos por estado
function filterProjects(filterValue) {
  if (filterValue === "all") {
    displayProjects(projectsData)
    return
  }

  const filteredProjects = projectsData.filter((project) => project.estado === filterValue)
  displayProjects(filteredProjects)
}

// Buscar proyectos por término
function searchProjects(searchTerm) {
  if (!searchTerm) {
    displayProjects(projectsData)
    return
  }

  const filteredProjects = projectsData.filter(
    (project) =>
      project.nombre.toLowerCase().includes(searchTerm) || project.cliente.toLowerCase().includes(searchTerm),
  )

  displayProjects(filteredProjects)
}

// Abrir detalles del proyecto
function openProjectDetails(projectId) {
  const project = projectsData.find((p) => p.id === projectId)
  if (!project) return

  const modal = document.getElementById("projectDetailsModal")
  const modalContent = document.getElementById("projectDetailsContent")

  // Preparar sección de instrucciones si existen
  let instruccionesHTML = ""
  if (project.instrucciones) {
    instruccionesHTML = `
            <div class="instructions-section">
                <h3>Instrucciones</h3>
                <p>${project.instrucciones}</p>
            </div>
        `
  }

  modalContent.innerHTML = `
        <h2>${project.nombre}</h2>
        <p><strong>Cliente:</strong> ${project.cliente}</p>
        <p><strong>Descripción:</strong> ${project.descripcion || "No disponible"}</p>
        <p><strong>Fecha de creación:</strong> ${new Date(project.fechaCreacion.seconds * 1000).toLocaleDateString()}</p>
        <p><strong>Estado:</strong> ${project.estado}</p>
        <p><strong>Ubicación:</strong> ${project.ubicacion || "No especificada"}</p>
        
        ${instruccionesHTML}
        
        <h3>Documentos</h3>
        <div id="projectDocuments">
            ${project.documentos ? renderDocumentsList(project.documentos) : "No hay documentos disponibles"}
        </div>
        
        <div class="modal-actions">
            <button id="closeDetailsBtn" class="btn-secondary">Cerrar</button>
        </div>
    `

  modal.style.display = "block"

  // Configurar cierre del modal
  document.getElementById("closeDetailsBtn").addEventListener("click", () => {
    modal.style.display = "none"
  })

  // Cerrar modal al hacer clic fuera del contenido
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none"
    }
  })
}

// Renderizar lista de documentos
function renderDocumentsList(documentos) {
  let html = '<ul class="documents-list">'

  Object.entries(documentos).forEach(([key, url]) => {
    const docName = key.charAt(0).toUpperCase() + key.slice(1) // Capitalizar primera letra
    html += `
            <li>
                <span>${docName}</span>
                <a href="${url}" target="_blank" class="btn-view-doc">Ver documento</a>
            </li>
        `
  })

  html += "</ul>"
  return html
}

// Abrir formulario de censo
function openCensusForm(projectId) {
  const project = projectsData.find((p) => p.id === projectId)
  if (!project) return

  const modal = document.getElementById("censusModal")
  const modalContent = document.getElementById("censusContent")

  modalContent.innerHTML = `
        <h2>Censo para Proyecto: ${project.nombre}</h2>
        
        <form id="censusForm">
            <div class="form-group">
                <label for="censusDate">Fecha de visita:</label>
                <input type="date" id="censusDate" required>
            </div>
            
            <div class="form-group">
                <label for="censusLocation">Ubicación exacta:</label>
                <input type="text" id="censusLocation" value="${project.ubicacion || ""}" required>
            </div>
            
            <div class="form-group">
                <label for="censusCoordinates">Coordenadas GPS:</label>
                <input type="text" id="censusCoordinates" placeholder="Ej: 10.9876, -74.7890">
                <button type="button" id="getLocationBtn" class="btn-secondary">Obtener ubicación actual</button>
            </div>
            
            <div class="form-group">
                <label for="censusDescription">Descripción del sitio:</label>
                <textarea id="censusDescription" rows="3" required></textarea>
            </div>
            
            <div class="form-group">
                <label for="censusObservations">Observaciones:</label>
                <textarea id="censusObservations" rows="3"></textarea>
            </div>
            
            <div class="form-group">
                <label>Fotos del sitio:</label>
                
                <div class="photo-upload">
                    <label for="photoFrontal">Foto frontal:</label>
                    <input type="file" id="photoFrontal" accept="image/*" capture="camera" required>
                </div>
                
                <div class="photo-upload">
                    <label for="photoLateral1">Foto lateral 1:</label>
                    <input type="file" id="photoLateral1" accept="image/*" capture="camera" required>
                </div>
                
                <div class="photo-upload">
                    <label for="photoLateral2">Foto lateral 2:</label>
                    <input type="file" id="photoLateral2" accept="image/*" capture="camera" required>
                </div>
                
                <div class="photo-upload">
                    <label for="photoAdicional">Fotos adicionales:</label>
                    <input type="file" id="photoAdicional" accept="image/*" capture="camera" multiple>
                </div>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn-primary" data-id="${projectId}">Enviar censo</button>
                <button type="button" id="cancelCensusBtn" class="btn-secondary">Cancelar</button>
            </div>
        </form>
    `

  modal.style.display = "block"

  // Configurar obtención de ubicación GPS
  document.getElementById("getLocationBtn").addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coordinates = `${position.coords.latitude}, ${position.coords.longitude}`
          document.getElementById("censusCoordinates").value = coordinates
        },
        (error) => {
          console.error("Error al obtener ubicación:", error)
          alert("No se pudo obtener la ubicación. Por favor, ingrese las coordenadas manualmente.")
        },
      )
    } else {
      alert("Su navegador no soporta geolocalización. Por favor, ingrese las coordenadas manualmente.")
    }
  })

  // Configurar cierre del modal
  document.getElementById("cancelCensusBtn").addEventListener("click", () => {
    modal.style.display = "none"
  })

  // Configurar envío del formulario
  document.getElementById("censusForm").addEventListener("submit", async (e) => {
    e.preventDefault()
    const projectId = e.target.querySelector(".btn-primary").getAttribute("data-id")
    await submitCensus(projectId)
  })

  // Cerrar modal al hacer clic fuera del contenido
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none"
    }
  })
}

// Enviar censo del proyecto
async function submitCensus(projectId) {
  // Obtener valores del formulario
  const censusDate = document.getElementById("censusDate").value
  const censusLocation = document.getElementById("censusLocation").value
  const censusCoordinates = document.getElementById("censusCoordinates").value
  const censusDescription = document.getElementById("censusDescription").value
  const censusObservations = document.getElementById("censusObservations").value

  // Obtener archivos
  const photoFrontal = document.getElementById("photoFrontal").files[0]
  const photoLateral1 = document.getElementById("photoLateral1").files[0]
  const photoLateral2 = document.getElementById("photoLateral2").files[0]
  const photoAdicional = document.getElementById("photoAdicional").files

  // Validar campos requeridos
  if (!censusDate || !censusLocation || !censusDescription || !photoFrontal || !photoLateral1 || !photoLateral2) {
    alert("Por favor, complete todos los campos requeridos y suba las fotos obligatorias.")
    return
  }

  try {
    // Mostrar indicador de carga
    const submitBtn = document.querySelector("#censusForm .btn-primary")
    submitBtn.disabled = true
    submitBtn.textContent = "Enviando censo..."

    // Preparar datos del censo
    const censusData = {
      estado: "En Revisión de Verificación",
      censo: {
        fecha: new Date(censusDate),
        ubicacion: censusLocation,
        coordenadas: censusCoordinates,
        descripcion: censusDescription,
        observaciones: censusObservations,
        fechaEnvio: new Date(),
        brigadaId: currentUser.uid,
        brigadaNombre: currentUser.displayName || currentUser.email,
        fotos: {},
      },
    }

    // Subir fotos
    // Foto frontal
    const frontalRef = ref(storage, `proyectos/${projectId}/censo_frontal_${Date.now()}_${photoFrontal.name}`)
    await uploadBytes(frontalRef, photoFrontal)
    censusData.censo.fotos.frontal = await getDownloadURL(frontalRef)

    // Foto lateral 1
    const lateral1Ref = ref(storage, `proyectos/${projectId}/censo_lateral1_${Date.now()}_${photoLateral1.name}`)
    await uploadBytes(lateral1Ref, photoLateral1)
    censusData.censo.fotos.lateral1 = await getDownloadURL(lateral1Ref)

    // Foto lateral 2
    const lateral2Ref = ref(storage, `proyectos/${projectId}/censo_lateral2_${Date.now()}_${photoLateral2.name}`)
    await uploadBytes(lateral2Ref, photoLateral2)
    censusData.censo.fotos.lateral2 = await getDownloadURL(lateral2Ref)

    // Fotos adicionales
    if (photoAdicional.length > 0) {
      censusData.censo.fotos.adicionales = []

      for (let i = 0; i < photoAdicional.length; i++) {
        const file = photoAdicional[i]
        const adicionalRef = ref(storage, `proyectos/${projectId}/censo_adicional${i}_${Date.now()}_${file.name}`)
        await uploadBytes(adicionalRef, file)
        const url = await getDownloadURL(adicionalRef)
        censusData.censo.fotos.adicionales.push(url)
      }
    }

    // Actualizar proyecto en Firestore
    const projectRef = doc(db, "proyectos", projectId)
    await updateDoc(projectRef, censusData)

    // Cerrar modal y actualizar lista
    document.getElementById("censusModal").style.display = "none"
    alert("Censo enviado correctamente. Será revisado por un analista.")

    // Recargar proyectos
    loadAssignedProjects()
  } catch (error) {
    console.error("Error al enviar censo:", error)
    alert("Error al enviar el censo. Por favor, intente nuevamente.")
  } finally {
    // Restaurar botón
    const submitBtn = document.querySelector("#censusForm .btn-primary")
    submitBtn.disabled = false
    submitBtn.textContent = "Enviar censo"
  }
}

// Cerrar sesión
function logout() {
  auth
    .signOut()
    .then(() => {
      window.location.href = "login.html"
    })
    .catch((error) => {
      console.error("Error al cerrar sesión:", error)
    })
}

// Exportar funciones para uso en HTML
window.logout = logout

