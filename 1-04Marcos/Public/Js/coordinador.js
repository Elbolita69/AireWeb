// Coordinador.js - Funcionalidades para el rol de Coordinador
import { auth, db } from "./Firebase.js"
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

// Variables globales
let currentUser = null
let projectsData = []
const usersData = {
  analistas: [],
  brigadas: [],
}
let coordinadorType = null // Administrativo, Operativo, Censo

// Inicialización cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  // Verificar autenticación
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser = user
      checkUserRole()
    } else {
      // Redirigir al login si no hay usuario autenticado
      window.location.href = "login.html"
    }
  })

  // Configurar listeners para botones y eventos
  document.getElementById("logoutBtn").addEventListener("click", logout)
})

// Verificar que el usuario tenga el rol de Coordinador y su tipo
async function checkUserRole() {
  try {
    const userRef = doc(db, "usuarios", currentUser.uid)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      const userData = userSnap.data()
      if (userData.rol !== "Coordinador") {
        // Redirigir según el rol
        redirectByRole(userData.rol)
        return
      }

      // Guardar tipo de coordinador
      coordinadorType = userData.tipo || "Operativo" // Por defecto Operativo si no se especifica

      // Continuar con la inicialización
      setupUI()
      loadUsers()
      loadProjectsByType()
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
    case "Analista":
      window.location.href = "analista.html"
      break
    case "Brigada":
      window.location.href = "brigada-censo.html"
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

  // Mostrar tipo de coordinador
  const coordinadorTypeElement = document.getElementById("coordinadorType")
  if (coordinadorTypeElement) {
    coordinadorTypeElement.textContent = `Coordinador ${coordinadorType}`
  }

  // Configurar filtros y buscador
  setupFilters()
  setupSearchBar()
  setupTabs()
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

// Configurar pestañas
function setupTabs() {
  const tabs = document.querySelectorAll(".tab-button")
  if (tabs) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Remover clase activa de todas las pestañas
        tabs.forEach((t) => t.classList.remove("active"))

        // Agregar clase activa a la pestaña seleccionada
        tab.classList.add("active")

        // Cargar proyectos según la pestaña
        const tabType = tab.getAttribute("data-tab")
        switch (tabType) {
          case "pending":
            loadPendingProjects()
            break
          case "assigned":
            loadAssignedProjects()
            break
          case "completed":
            loadCompletedProjects()
            break
        }
      })
    })
  }
}

// Cargar usuarios (analistas y brigadas)
async function loadUsers() {
  try {
    // Cargar analistas
    const analistasQuery = query(collection(db, "usuarios"), where("rol", "==", "Analista"))

    const analistasSnapshot = await getDocs(analistasQuery)
    usersData.analistas = []

    analistasSnapshot.forEach((doc) => {
      usersData.analistas.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    // Cargar brigadas
    const brigadasQuery = query(collection(db, "usuarios"), where("rol", "==", "Brigada"))

    const brigadasSnapshot = await getDocs(brigadasQuery)
    usersData.brigadas = []

    brigadasSnapshot.forEach((doc) => {
      usersData.brigadas.push({
        id: doc.id,
        ...doc.data(),
      })
    })
  } catch (error) {
    console.error("Error al cargar usuarios:", error)
    alert("Error al cargar usuarios. Por favor, intente nuevamente.")
  }
}

// Cargar proyectos según el tipo de coordinador
function loadProjectsByType() {
  switch (coordinadorType) {
    case "Administrativo":
      // Coordinador Administrativo ve proyectos en estado "En Asignación"
      loadPendingProjects()
      break
    case "Operativo":
      // Coordinador Operativo ve proyectos asignados
      loadAssignedProjects()
      break
    case "Censo":
      // Coordinador Censo ve proyectos en verificación
      loadCompletedProjects()
      break
    default:
      loadPendingProjects()
  }
}

// Cargar proyectos pendientes de asignación
async function loadPendingProjects() {
  try {
    const projectsContainer = document.getElementById("projectsList")
    projectsContainer.innerHTML = '<p class="loading">Cargando proyectos...</p>'

    // Consultar proyectos pendientes de asignación
    const projectsQuery = query(collection(db, "proyectos"), where("estado", "==", "En Asignación"))

    const querySnapshot = await getDocs(projectsQuery)
    projectsData = []

    if (querySnapshot.empty) {
      projectsContainer.innerHTML = '<p class="no-projects">No hay proyectos pendientes de asignación.</p>'
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

    // Ordenar proyectos por fecha de creación (más recientes primero)
    projectsData.sort((a, b) => b.fechaCreacion.seconds - a.fechaCreacion.seconds)

    // Mostrar los proyectos
    displayProjects(projectsData)
  } catch (error) {
    console.error("Error al cargar proyectos:", error)
    document.getElementById("projectsList").innerHTML =
      '<p class="error">Error al cargar proyectos. Por favor, intente nuevamente.</p>'
  }
}

// Cargar proyectos asignados
async function loadAssignedProjects() {
  try {
    const projectsContainer = document.getElementById("projectsList")
    projectsContainer.innerHTML = '<p class="loading">Cargando proyectos...</p>'

    // Consultar proyectos asignados
    const projectsQuery = query(collection(db, "proyectos"), where("estado", "==", "Asignado"))

    const querySnapshot = await getDocs(projectsQuery)
    projectsData = []

    if (querySnapshot.empty) {
      projectsContainer.innerHTML = '<p class="no-projects">No hay proyectos asignados actualmente.</p>'
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

    // Ordenar proyectos por fecha de creación (más recientes primero)
    projectsData.sort((a, b) => b.fechaCreacion.seconds - a.fechaCreacion.seconds)

    // Mostrar los proyectos
    displayProjects(projectsData)
  } catch (error) {
    console.error("Error al cargar proyectos:", error)
    document.getElementById("projectsList").innerHTML =
      '<p class="error">Error al cargar proyectos. Por favor, intente nuevamente.</p>'
  }
}

// Cargar proyectos en verificación o completados
async function loadCompletedProjects() {
  try {
    const projectsContainer = document.getElementById("projectsList")
    projectsContainer.innerHTML = '<p class="loading">Cargando proyectos...</p>'

    // Consultar proyectos en verificación
    const projectsQuery = query(collection(db, "proyectos"), where("estado", "==", "En Revisión de Verificación"))

    const querySnapshot = await getDocs(projectsQuery)
    projectsData = []

    if (querySnapshot.empty) {
      projectsContainer.innerHTML = '<p class="no-projects">No hay proyectos en verificación.</p>'
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

    // Ordenar proyectos por fecha de creación (más recientes primero)
    projectsData.sort((a, b) => b.fechaCreacion.seconds - a.fechaCreacion.seconds)

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

    // Aplicar clase según el estado
    projectCard.classList.add(`status-${project.estado.toLowerCase().replace(/\s+/g, "-")}`)

    // Mostrar información de asignación si está asignado
    let assignedInfo = ""
    if (project.analistaId) {
      const analista = usersData.analistas.find((a) => a.id === project.analistaId)
      assignedInfo = `<p><strong>Asignado a:</strong> ${analista ? analista.nombre : "Analista"}</p>`
    } else if (project.brigadaId) {
      const brigada = usersData.brigadas.find((b) => b.id === project.brigadaId)
      assignedInfo = `<p><strong>Asignado a:</strong> ${brigada ? brigada.nombre : "Brigada"}</p>`
    }

    projectCard.innerHTML = `
            <h3>${project.nombre}</h3>
            <p><strong>Cliente:</strong> ${project.cliente}</p>
            <p><strong>Fecha de creación:</strong> ${new Date(project.fechaCreacion.seconds * 1000).toLocaleDateString()}</p>
            <p><strong>Estado:</strong> ${project.estado}</p>
            ${assignedInfo}
            <div class="project-actions">
                <button class="btn-view" data-id="${project.id}">Ver detalles</button>
                ${
                  project.estado === "En Asignación"
                    ? `<button class="btn-assign" data-id="${project.id}">Asignar</button>`
                    : ""
                }
                ${
                  project.estado === "En Revisión de Verificación"
                    ? `<button class="btn-review" data-id="${project.id}">Revisar verificación</button>`
                    : ""
                }
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

  document.querySelectorAll(".btn-assign").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const projectId = e.target.getAttribute("data-id")
      openAssignForm(projectId)
    })
  })

  document.querySelectorAll(".btn-review").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const projectId = e.target.getAttribute("data-id")
      openVerificationReviewForm(projectId)
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

  // Preparar sección de asignación si existe
  let asignacionHTML = ""
  if (project.analistaId) {
    const analista = usersData.analistas.find((a) => a.id === project.analistaId)
    asignacionHTML = `
            <div class="assignment-section">
                <h3>Información de Asignación</h3>
                <p><strong>Asignado a:</strong> ${analista ? analista.nombre : "Analista"}</p>
                <p><strong>Fecha de asignación:</strong> ${new Date(project.fechaAsignacion.seconds * 1000).toLocaleDateString()}</p>
                <p><strong>Asignado por:</strong> ${project.asignadoPorNombre || "Coordinador"}</p>
            </div>
        `
  } else if (project.brigadaId) {
    const brigada = usersData.brigadas.find((b) => b.id === project.brigadaId)
    asignacionHTML = `
            <div class="assignment-section">
                <h3>Información de Asignación</h3>
                <p><strong>Asignado a:</strong> ${brigada ? brigada.nombre : "Brigada"}</p>
                <p><strong>Fecha de asignación:</strong> ${new Date(project.fechaAsignacion.seconds * 1000).toLocaleDateString()}</p>
                <p><strong>Asignado por:</strong> ${project.asignadoPorNombre || "Coordinador"}</p>
            </div>
        `
  }

  // Preparar sección de verificación si existe
  let verificacionHTML = ""
  if (project.verificacion) {
    verificacionHTML = `
            <div class="verification-section">
                <h3>Resultado de Verificación</h3>
                <p><strong>Estado:</strong> ${project.verificacion.estado}</p>
                <p><strong>Comentarios:</strong> ${project.verificacion.comentarios || "Sin comentarios"}</p>
                <p><strong>Verificado por:</strong> ${project.verificacion.analistaNombre}</p>
                <p><strong>Fecha:</strong> ${new Date(project.verificacion.fecha.seconds * 1000).toLocaleDateString()}</p>
                ${
                  project.verificacion.informeURL
                    ? `<p><strong>Informe:</strong> <a href="${project.verificacion.informeURL}" target="_blank">Ver informe</a></p>`
                    : ""
                }
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
        <p><strong>Creado por:</strong> ${project.creadorNombre}</p>
        
        ${asignacionHTML}
        ${verificacionHTML}
        
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

// Abrir formulario de asignación
function openAssignForm(projectId) {
  const project = projectsData.find((p) => p.id === projectId)
  if (!project) return

  const modal = document.getElementById("assignModal")
  const modalContent = document.getElementById("assignContent")

  // Preparar opciones de analistas
  let analistasOptions = '<option value="">Seleccione un analista</option>'
  usersData.analistas.forEach((analista) => {
    analistasOptions += `<option value="${analista.id}">${analista.nombre || analista.email}</option>`
  })

  // Preparar opciones de brigadas
  let brigadasOptions = '<option value="">Seleccione una brigada</option>'
  usersData.brigadas.forEach((brigada) => {
    brigadasOptions += `<option value="${brigada.id}">${brigada.nombre || brigada.email}</option>`
  })

  modalContent.innerHTML = `
        <h2>Asignación de Proyecto: ${project.nombre}</h2>
        
        <div class="form-group">
            <label for="assignType">Tipo de asignación:</label>
            <select id="assignType" required>
                <option value="">Seleccione un tipo</option>
                <option value="analista">Analista</option>
                <option value="brigada">Brigada Censo</option>
            </select>
        </div>
        
        <div id="analistaSection" class="form-group" style="display: none;">
            <label for="analistaSelect">Seleccione un analista:</label>
            <select id="analistaSelect">
                ${analistasOptions}
            </select>
        </div>
        
        <div id="brigadaSection" class="form-group" style="display: none;">
            <label for="brigadaSelect">Seleccione una brigada:</label>
            <select id="brigadaSelect">
                ${brigadasOptions}
            </select>
        </div>
        
        <div class="form-group">
            <label for="assignComments">Instrucciones:</label>
            <textarea id="assignComments" rows="4" placeholder="Ingrese instrucciones para el asignado"></textarea>
        </div>
        
        <div class="modal-actions">
            <button id="submitAssignBtn" class="btn-primary" data-id="${projectId}">Asignar proyecto</button>
            <button id="closeAssignBtn" class="btn-secondary">Cancelar</button>
        </div>
    `

  modal.style.display = "block"

  // Configurar cambio de tipo de asignación
  document.getElementById("assignType").addEventListener("change", (e) => {
    const type = e.target.value
    document.getElementById("analistaSection").style.display = type === "analista" ? "block" : "none"
    document.getElementById("brigadaSection").style.display = type === "brigada" ? "block" : "none"
  })

  // Configurar cierre del modal
  document.getElementById("closeAssignBtn").addEventListener("click", () => {
    modal.style.display = "none"
  })

  // Configurar envío del formulario
  document.getElementById("submitAssignBtn").addEventListener("click", async (e) => {
    const projectId = e.target.getAttribute("data-id")
    await submitAssignment(projectId)
  })

  // Cerrar modal al hacer clic fuera del contenido
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none"
    }
  })
}

// Enviar asignación del proyecto
async function submitAssignment(projectId) {
  const assignType = document.getElementById("assignType").value
  const analistaId = document.getElementById("analistaSelect").value
  const brigadaId = document.getElementById("brigadaSelect").value
  const comments = document.getElementById("assignComments").value

  // Validar campos
  if (!assignType) {
    alert("Por favor, seleccione un tipo de asignación.")
    return
  }

  if (assignType === "analista" && !analistaId) {
    alert("Por favor, seleccione un analista.")
    return
  }

  if (assignType === "brigada" && !brigadaId) {
    alert("Por favor, seleccione una brigada.")
    return
  }

  try {
    // Mostrar indicador de carga
    document.getElementById("submitAssignBtn").disabled = true
    document.getElementById("submitAssignBtn").textContent = "Asignando..."

    // Preparar datos de asignación
    const assignData = {
      estado: "Asignado",
      fechaAsignacion: new Date(),
      asignadoPor: currentUser.uid,
      asignadoPorNombre: currentUser.displayName || currentUser.email,
      instrucciones: comments || null,
    }

    // Agregar información del asignado según el tipo
    if (assignType === "analista") {
      const analista = usersData.analistas.find((a) => a.id === analistaId)
      assignData.analistaId = analistaId
      assignData.analistaNombre = analista ? analista.nombre || analista.email : "Analista"
      assignData.brigadaId = null
      assignData.brigadaNombre = null
    } else {
      const brigada = usersData.brigadas.find((b) => b.id === brigadaId)
      assignData.brigadaId = brigadaId
      assignData.brigadaNombre = brigada ? brigada.nombre || brigada.email : "Brigada"
      assignData.analistaId = null
      assignData.analistaNombre = null
    }

    // Actualizar proyecto en Firestore
    const projectRef = doc(db, "proyectos", projectId)
    await updateDoc(projectRef, assignData)

    // Cerrar modal y actualizar lista
    document.getElementById("assignModal").style.display = "none"
    alert("Proyecto asignado correctamente.")

    // Recargar proyectos según la pestaña activa
    const activeTab = document.querySelector(".tab-button.active")
    if (activeTab) {
      const tabType = activeTab.getAttribute("data-tab")
      switch (tabType) {
        case "pending":
          loadPendingProjects()
          break
        case "assigned":
          loadAssignedProjects()
          break
        case "completed":
          loadCompletedProjects()
          break
      }
    } else {
      loadPendingProjects()
    }
  } catch (error) {
    console.error("Error al asignar proyecto:", error)
    alert("Error al asignar el proyecto. Por favor, intente nuevamente.")
  } finally {
    // Restaurar botón
    document.getElementById("submitAssignBtn").disabled = false
    document.getElementById("submitAssignBtn").textContent = "Asignar proyecto"
  }
}

// Abrir formulario de revisión de verificación
function openVerificationReviewForm(projectId) {
  const project = projectsData.find((p) => p.id === projectId)
  if (!project) return

  const modal = document.getElementById("verificationReviewModal")
  const modalContent = document.getElementById("verificationReviewContent")

  modalContent.innerHTML = `
        <h2>Revisión de Verificación: ${project.nombre}</h2>
        
        <div class="verification-summary">
            <h3>Resumen de Verificación</h3>
            <p><strong>Estado:</strong> ${project.verificacion?.estado || "No disponible"}</p>
            <p><strong>Comentarios:</strong> ${project.verificacion?.comentarios || "Sin comentarios"}</p>
            <p><strong>Verificado por:</strong> ${project.verificacion?.analistaNombre || "No disponible"}</p>
            <p><strong>Fecha:</strong> ${project.verificacion?.fecha ? new Date(project.verificacion.fecha.seconds * 1000).toLocaleDateString() : "No disponible"}</p>
            ${
              project.verificacion?.informeURL
                ? `<p><strong>Informe:</strong> <a href="${project.verificacion.informeURL}" target="_blank">Ver informe</a></p>`
                : ""
            }
        </div>
        
        <div class="form-group">
            <label for="reviewComments">Comentarios adicionales:</label>
            <textarea id="reviewComments" rows="4" placeholder="Ingrese comentarios adicionales sobre la verificación"></textarea>
        </div>
        
        <div class="modal-actions">
            <button id="approveVerificationBtn" class="btn-primary" data-id="${projectId}">Aprobar y enviar a Ejecutiva</button>
            <button id="closeVerificationReviewBtn" class="btn-secondary">Cancelar</button>
        </div>
    `

  modal.style.display = "block"

  // Configurar cierre del modal
  document.getElementById("closeVerificationReviewBtn").addEventListener("click", () => {
    modal.style.display = "none"
  })

  // Configurar envío del formulario
  document.getElementById("approveVerificationBtn").addEventListener("click", async (e) => {
    const projectId = e.target.getAttribute("data-id")
    await approveVerification(projectId)
  })

  // Cerrar modal al hacer clic fuera del contenido
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none"
    }
  })
}

// Aprobar verificación y enviar a Ejecutiva
async function approveVerification(projectId) {
  const comments = document.getElementById("reviewComments").value

  try {
    // Mostrar indicador de carga
    document.getElementById("approveVerificationBtn").disabled = true
    document.getElementById("approveVerificationBtn").textContent = "Enviando..."

    // Preparar datos de aprobación
    const approvalData = {
      comentariosCoordinador: comments || null,
      fechaAprobacionCoordinador: new Date(),
      coordinadorId: currentUser.uid,
      coordinadorNombre: currentUser.displayName || currentUser.email,
    }

    // Actualizar proyecto en Firestore
    const projectRef = doc(db, "proyectos", projectId)
    await updateDoc(projectRef, approvalData)

    // Cerrar modal y actualizar lista
    document.getElementById("verificationReviewModal").style.display = "none"
    alert("Verificación aprobada y enviada a Ejecutiva correctamente.")

    // Recargar proyectos
    loadCompletedProjects()
  } catch (error) {
    console.error("Error al aprobar verificación:", error)
    alert("Error al aprobar la verificación. Por favor, intente nuevamente.")
  } finally {
    // Restaurar botón
    document.getElementById("approveVerificationBtn").disabled = false
    document.getElementById("approveVerificationBtn").textContent = "Aprobar y enviar a Ejecutiva"
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

