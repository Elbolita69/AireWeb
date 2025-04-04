//Ejecutiva.js

// Variables globales
let currentUser = null
let currentProject = null

document.addEventListener("DOMContentLoaded", () => {
  // Verificar si el usuario está logueado y tiene el rol correcto
  const loggedUser = Storage.getLoggedUser()
  if (!loggedUser || loggedUser.rol !== "ejecutiva") {
    window.location.href = "login.html"
    return
  }

  currentUser = loggedUser

  // Cargar datos iniciales
  loadUserData()
  loadProjects()
  loadNotifications()

  // Configurar eventos
  setupEventListeners()
})

// Cargar datos del usuario
function loadUserData() {
  // Mostrar nombre del usuario en la bienvenida
  document.getElementById("nombreUsuario").textContent = `${currentUser.nombre} ${currentUser.apellido || ""}`

  // Cargar datos en la sección de perfil
  document.getElementById("perfilNombre").textContent = `${currentUser.nombre} ${currentUser.apellido || ""}`
  document.getElementById("perfilRol").textContent = "Ejecutiva"
  document.getElementById("perfilUsuario").textContent = currentUser.usuario || "-"
  document.getElementById("perfilCorreo").textContent = currentUser.correo || "-"
  document.getElementById("perfilDepartamento").textContent = currentUser.departamento || "-"
  document.getElementById("perfilCargo").textContent = currentUser.cargo || "Ejecutiva"
}

<<<<<<< HEAD
function loadProjects() {
  // Obtener proyectos asignados a la ejecutiva actual
  const projects = Storage.getProjects().filter(
    (project) => project.ejecutivaId === currentUser.id && project.estado === "En Revisión por Ejecutiva",
  );

  // Mostrar proyectos en la tabla
  const tablaProyectos = document.getElementById("tablaProyectos");
=======
// Update the loadProjects function to use the standardized table structure
function loadProjects() {
  const loggedUser = Storage.getLoggedUser()
  const allProjects = Storage.getProjects()

  // Projects in review (main table)
  const projectsInReview = allProjects.filter(
    (project) =>
      project.ejecutivaId === loggedUser.id &&
      (project.estado === "En Revisión por Ejecutiva" || project.estado === "En Revision por Ejecutiva"),
  )

  console.log("Projects in review:", projectsInReview)

  // Show projects in review
  const tablaProyectos = document.getElementById("tablaProyectos")
>>>>>>> 20de416 (Descripción del cambio)
  if (tablaProyectos) {
    if (projectsInReview.length === 0) {
      tablaProyectos.innerHTML = `
        <tr>
          <td colspan="9" class="text-center">No hay proyectos asignados para revisión.</td>
        </tr>
      `;
    } else {
<<<<<<< HEAD
      tablaProyectos.innerHTML = "";
      projects.forEach((project) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${project.id}</td>
  <td>${project.nombre}</td>
  <td>${project.prstNombre || "No definido"}</td>
  <td>${project.creadorNombre || "No definido"}</td>
  <td>${project.municipio}</td>
  <td>${project.departamento}</td>
  <td>${new Date(project.fechaEnvio).toLocaleDateString()}</td>
  <td><span class="badge bg-warning">${project.estado}</span></td>
  <td>
    <button class="btn btn-sm btn-primary revisar-proyecto" data-id="${project.id}">
      <i class="bi bi-eye"></i> Revisar
    </button>
  </td>
        `;
        tablaProyectos.appendChild(row);
      });
    }
  }

  // Cargar proyectos pendientes (con observaciones)
  const projectsPendientes = Storage.getProjects().filter(
    (project) => project.ejecutivaId === currentUser.id && project.estado === "Documentación Errada",
  );

  const tablaProyectosPendientes = document.getElementById("tablaProyectosPendientes");
=======
      tablaProyectos.innerHTML = ""
      projectsInReview.forEach((project) => {
        const row = document.createElement("tr")
        row.innerHTML = `
          <td>${project.id}</td>
          <td>${project.nombre}</td>
          <td>${project.prst || project.prstNombre || "No definido"}</td>
          <td>${project.creadorNombre || "No definido"}</td>
          <td>${project.municipio || "No definido"}</td>
          <td>${project.departamento || "No definido"}</td>
          <td>${formatDateTime(project.fechaCreacion)}</td>
          <td><span class="badge bg-warning">En Revisión</span></td>
          <td>
            <button class="btn btn-sm btn-primary revisar-proyecto" data-id="${project.id}">
              <i class="bi bi-eye"></i>
            </button>
            <button class="btn btn-sm btn-info ver-historial" data-id="${project.id}">
              <i class="bi bi-clock-history"></i>
            </button>
          </td>
        `
        tablaProyectos.appendChild(row)
      })
    }
  }

  // Projects in management (previously "pending")
  const pendingProjects = allProjects.filter(
    (project) =>
      project.ejecutivaId === loggedUser.id &&
      (project.estado === "En Asignación" ||
        project.estado === "En Gestion por Analista" ||
        project.estado === "En Gestion por Brigada" ||
        project.estado === "En Revision de Verificacion" ||
        project.estado === "Opcion Mejorar" ||
        project.estado === "Generacion de Informe" ||
        project.estado === "Documentación Errada"),
  )

  console.log("Pending projects:", pendingProjects)

  const tablaProyectosPendientes = document.getElementById("tablaProyectosPendientes")
>>>>>>> 20de416 (Descripción del cambio)
  if (tablaProyectosPendientes) {
    if (pendingProjects.length === 0) {
      tablaProyectosPendientes.innerHTML = `
        <tr>
          <td colspan="9" class="text-center">No hay proyectos en gestión.</td>
        </tr>
      `;
    } else {
<<<<<<< HEAD
      tablaProyectosPendientes.innerHTML = "";
      projectsPendientes.forEach((project) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${project.id}</td>
          <td>${project.nombre}</td>
          <td>${project.nombrePRST || "No definido"}</td> <!-- Nombre del PRST -->
          <td>${project.municipio}</td>
          <td>${project.departamento}</td>
          <td>${new Date(project.fechaEnvio).toLocaleDateString()}</td>
          <td><span class="badge bg-danger">${project.estado}</span></td>
=======
      tablaProyectosPendientes.innerHTML = ""
      pendingProjects.forEach((project) => {
        const row = document.createElement("tr")

        // Determine badge class and text based on state
        const badgeClass = getBadgeClass(project.estado)
        const badgeText = project.estado

        row.innerHTML = `
          <td>${project.id}</td>
          <td>${project.nombre}</td>
          <td>${project.prst || project.prstNombre || "No definido"}</td>
          <td>${project.creadorNombre || "No definido"}</td>
          <td>${project.municipio || "No definido"}</td>
          <td>${project.departamento || "No definido"}</td>
          <td>${formatDateTime(project.fechaRechazo || project.fechaCreacion)}</td>
          <td><span class="badge ${badgeClass}">${badgeText}</span></td>
>>>>>>> 20de416 (Descripción del cambio)
          <td>
            ${
              project.estado === "Documentación Errada"
                ? `<button class="btn btn-sm btn-warning ver-observaciones" data-id="${project.id}">
                <i class="bi bi-exclamation-triangle"></i> Ver Observaciones
              </button>`
                : `<button class="btn btn-sm btn-primary ver-proyecto" data-id="${project.id}">
                <i class="bi bi-eye"></i>
              </button>`
            }
            <button class="btn btn-sm btn-info ver-historial" data-id="${project.id}">
              <i class="bi bi-clock-history"></i>
            </button>
          </td>
        `;
        tablaProyectosPendientes.appendChild(row);
      });
    }
  }

<<<<<<< HEAD
// Cargar proyectos finalizados (aprobados por la ejecutiva)
const projectsFinalizados = Storage.getProjects().filter(
  (project) =>
    project.ejecutivaId === currentUser.id &&
    (project.estado === "En Asignación" ||
      project.estado === "Asignado" ||
      project.estado === "En Revisión de Verificación" ||
      project.estado === "Finalizado"),
);

const tablaProyectosFinalizados = document.getElementById("tablaProyectosFinalizados");
if (tablaProyectosFinalizados) {
  if (projectsFinalizados.length === 0) {
    tablaProyectosFinalizados.innerHTML = `
      <tr>
        <td colspan="7" class="text-center">No hay proyectos finalizados.</td>
      </tr>
    `;
  } else {
    tablaProyectosFinalizados.innerHTML = "";
    projectsFinalizados.forEach((project) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${project.id}</td>
        <td>${project.nombre}</td>
        <td>${project.nombrePRST || "No definido"}</td> <!-- Nombre del PRST -->
        <td>${project.municipio}</td>
        <td>${project.departamento}</td>
        <td>${project.fechaAprobacion ? new Date(project.fechaAprobacion).toLocaleDateString() : "-"}</td>
        <td>
          <button class="btn btn-sm btn-info ver-proyecto" data-id="${project.id}">
            <i class="bi bi-eye"></i> Ver Detalles
          </button>
        </td>
      `;
      tablaProyectosFinalizados.appendChild(row);
    });
=======
  // Finished projects (approved by ejecutiva)
  const finishedProjects = allProjects.filter(
    (project) =>
      project.ejecutivaId === loggedUser.id && (project.estado === "Finalizado" || project.estado === "Verificado"),
  )

  console.log("Finished projects:", finishedProjects)

  const tablaProyectosFinalizados = document.getElementById("tablaProyectosFinalizados")
  if (tablaProyectosFinalizados) {
    if (finishedProjects.length === 0) {
      tablaProyectosFinalizados.innerHTML = `
        <tr>
          <td colspan="9" class="text-center">No hay proyectos finalizados.</td>
        </tr>
      `
    } else {
      tablaProyectosFinalizados.innerHTML = ""
      finishedProjects.forEach((project) => {
        const row = document.createElement("tr")
        row.innerHTML = `
          <td>${project.id}</td>
          <td>${project.nombre}</td>
          <td>${project.prst || project.prstNombre || "No definido"}</td>
          <td>${project.creadorNombre || "No definido"}</td>
          <td>${project.municipio || "No definido"}</td>
          <td>${project.departamento || "No definido"}</td>
          <td>${formatDateTime(project.fechaAprobacion || project.fechaCreacion)}</td>
          <td><span class="badge ${getBadgeClass(project.estado)}">${project.estado}</span></td>
          <td>
            <button class="btn btn-sm btn-primary ver-proyecto" data-id="${project.id}">
              <i class="bi bi-eye"></i>
            </button>
            <button class="btn btn-sm btn-info ver-historial" data-id="${project.id}">
              <i class="bi bi-clock-history"></i>
            </button>
          </td>
        `
        tablaProyectosFinalizados.appendChild(row)
      })
    }
>>>>>>> 20de416 (Descripción del cambio)
  }
}
}

// Update the formatDateTime function to include AM/PM
function formatDateTime(dateString) {
  if (!dateString) return "-"
  const date = new Date(dateString)
  return date.toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

// Cargar notificaciones
function loadNotifications() {
  const notifications = Storage.getNotificationsByUser(currentUser.id)

  // Actualizar contador de notificaciones
  const notificationCount = notifications.filter((n) => !n.leido).length
  document.getElementById("notificationCount").textContent = notificationCount

  // Actualizar lista de notificaciones
  const notificationsList = document.getElementById("notificationsList")
  if (notificationsList) {
    if (notifications.length === 0) {
      notificationsList.innerHTML = `
        <div class="notification-empty">
          <i class="bi bi-bell-slash"></i>
          <p>No tienes notificaciones</p>
        </div>
      `
    } else {
      // Ordenar notificaciones por fecha (más recientes primero)
      const sortedNotifications = notifications
        .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
        .slice(0, 5) // Mostrar solo las 5 más recientes

      notificationsList.innerHTML = ""

      sortedNotifications.forEach((notification) => {
        const notificationItem = document.createElement("div")
        notificationItem.className = `notification-item ${notification.leido ? "" : "unread"}`
        notificationItem.dataset.id = notification.id

        notificationItem.innerHTML = `
          <div class="notification-content">
            <p>${notification.mensaje}</p>
            <small>${formatDate(notification.fechaCreacion)}</small>
          </div>
        `

        notificationsList.appendChild(notificationItem)
      })
    }
  }
}

// Formatear fecha para mostrar en notificaciones
function formatDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffMs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) {
    return "Hace un momento"
  } else if (diffMins < 60) {
    return `Hace ${diffMins} ${diffMins === 1 ? "minuto" : "minutos"}`
  } else if (diffHours < 24) {
    return `Hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`
  } else if (diffDays < 7) {
    return `Hace ${diffDays} ${diffDays === 1 ? "día" : "días"}`
  } else {
    return date.toLocaleDateString()
  }
}

// Configurar eventos
function setupEventListeners() {
  // Navegación
  document.getElementById("navProyectos").addEventListener("click", () => {
    showSection("seccionProyectos")
  })

  document.getElementById("navPendientes").addEventListener("click", () => {
    showSection("seccionPendientes")
  })

  document.getElementById("navFinalizados").addEventListener("click", () => {
    showSection("seccionFinalizados")
  })

  document.getElementById("navPerfil").addEventListener("click", () => {
    showSection("seccionPerfil")
  })

  // Cerrar sesión
  document.getElementById("cerrarSesion").addEventListener("click", () => {
    Storage.logout()
    window.location.href = "login.html"
  })

  // Marcar todas las notificaciones como leídas
  document.getElementById("markAllAsRead").addEventListener("click", () => {
    Storage.markAllNotificationsAsRead(currentUser.id)
    loadNotifications()
  })

  // Revisar proyecto
  document.addEventListener("click", (e) => {
    if (e.target.closest(".revisar-proyecto")) {
      const projectId = e.target.closest(".revisar-proyecto").dataset.id
      loadProjectForVerification(projectId)
    }
  })

  // Ver observaciones
  document.addEventListener("click", (e) => {
    if (e.target.closest(".ver-observaciones")) {
      const projectId = e.target.closest(".ver-observaciones").dataset.id
      loadProjectObservations(projectId)
    }
  })

  // Ver proyecto finalizado
  document.addEventListener("click", (e) => {
    if (e.target.closest(".ver-proyecto")) {
      const projectId = e.target.closest(".ver-proyecto").dataset.id
      loadProjectDetails(projectId)
    }
  })

  // Ver historial del proyecto
  document.addEventListener("click", (e) => {
    if (e.target.closest(".ver-historial")) {
      const projectId = e.target.closest(".ver-historial").dataset.id
      showProjectHistory(projectId)
    }
  })

  // Volver desde verificación
  document.getElementById("btnVolverDesdeVerificacion").addEventListener("click", () => {
    showSection("seccionProyectos")
  })

  // Volver desde observaciones
  document.getElementById("btnVolverDesdeObservaciones").addEventListener("click", () => {
    showSection("seccionPendientes")
  })

  // Volver desde finalización
  document.getElementById("btnVolverDesdeFinalizacion").addEventListener("click", () => {
    showSection("seccionFinalizados")
  })

  // Botones de verificación de documentos
  document.querySelectorAll(".btn-verificacion").forEach((btn) => {
    btn.addEventListener("click", function () {
      const doc = this.dataset.doc
      const value = this.dataset.value === "true"

      // Marcar botón como activo
      document.querySelectorAll(`.btn-verificacion[data-doc="${doc}"]`).forEach((b) => {
        b.classList.remove("active")
      })
      this.classList.add("active")

      // Habilitar/deshabilitar campo de observaciones
      const obsField = document.getElementById(`obs${doc.charAt(0).toUpperCase() + doc.slice(1)}`)
      obsField.disabled = value
      if (value) {
        obsField.value = ""
      } else {
        obsField.focus()
      }
    })
  })

  // Rechazar proyecto
  document.getElementById("btnRechazarProyecto").addEventListener("click", () => {
    rechazarProyecto()
  })

  // Aprobar proyecto
  document.getElementById("btnAprobarProyecto").addEventListener("click", () => {
    aprobarProyecto()
  })

  // Enviar observaciones al PRST
  document.getElementById("btnEnviarObservaciones").addEventListener("click", () => {
    enviarObservacionesAlPRST()
  })

  // Cambiar contraseña
  document.getElementById("formCambiarPassword").addEventListener("submit", (e) => {
    e.preventDefault()
    cambiarPassword()
  })

  // Buscar proyectos
  document.getElementById("btnBuscar").addEventListener("click", () => {
    buscarProyectos("tablaProyectos", "buscarProyecto")
  })

  document.getElementById("btnBuscarPendiente").addEventListener("click", () => {
    buscarProyectos("tablaProyectosPendientes", "buscarProyectoPendiente")
  })

  document.getElementById("btnBuscarFinalizado").addEventListener("click", () => {
    buscarProyectos("tablaProyectosFinalizados", "buscarProyectoFinalizado")
  })

  // Notificaciones
  document.addEventListener("click", (e) => {
    if (e.target.closest(".notification-item")) {
      const notificationId = e.target.closest(".notification-item").dataset.id
      if (notificationId) {
        Storage.markNotificationAsRead(notificationId)
        loadNotifications()
      }
    }
  })
}

// Mostrar sección
function showSection(sectionId) {
  const sections = [
    "seccionProyectos",
    "seccionPendientes",
    "seccionFinalizados",
    "seccionPerfil",
    "seccionVerificacion",
    "seccionObservacionesVerificacion",
    "seccionFinalizacion",
  ]

  sections.forEach((section) => {
    document.getElementById(section).style.display = "none"
  })

  document.getElementById(sectionId).style.display = "block"

  // Actualizar navegación
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active")
  })

  if (sectionId === "seccionProyectos") {
    document.getElementById("navProyectos").classList.add("active")
  } else if (sectionId === "seccionPendientes") {
    document.getElementById("navPendientes").classList.add("active")
  } else if (sectionId === "seccionFinalizados") {
    document.getElementById("navFinalizados").classList.add("active")
  } else if (sectionId === "seccionPerfil") {
    document.getElementById("navPerfil").classList.add("active")
  }
}

// Cargar proyecto para verificación
function loadProjectForVerification(projectId) {
  const project = Storage.getProjectById(projectId);
  if (!project) return;

  currentProject = project;

  // Llenar datos del proyecto
<<<<<<< HEAD
  document.getElementById("verificacionIdProyecto").textContent = project.id;
  document.getElementById("verificacionNombreProyecto").textContent = project.nombre;
  document.getElementById("verificacionNombre").textContent = project.nombre;
  document.getElementById("verificacionPRST").textContent = project.prstNombre || project.creadorNombre;
  document.getElementById("verificacionDireccionInicial").textContent = project.direccionInicial;
  document.getElementById("verificacionDireccionFinal").textContent = project.direccionFinal;
  document.getElementById("verificacionBarrios").textContent = project.barrios?.join(", ") || "No especificado";
  document.getElementById("verificacionMunicipio").textContent = project.municipio;
  document.getElementById("verificacionDepartamento").textContent = project.departamento;
  document.getElementById("verificacionNumeroPostes").textContent = project.numPostes;
  document.getElementById("verificacionFechaInicio").textContent = project.fechaInicio;
  document.getElementById("verificacionFechaFin").textContent = project.fechaFin;
  document.getElementById("verificacionPuntoConexion").textContent = project.puntoConexion;
  document.getElementById("verificacionObservaciones").textContent = project.observaciones || "No hay observaciones";

  // Mostrar enlaces a documentos (si existen)
  if (project.documentos) {
    document.getElementById("linkArchivoKMZ").textContent = project.documentos.kmz?.nombre || "No disponible";
    document.getElementById("linkArchivoDWG").textContent = project.documentos.dwg?.nombre || "No disponible";
    document.getElementById("linkArchivoPDF").textContent = project.documentos.plano?.nombre || "No disponible";
    document.getElementById("linkArchivoMatricula").textContent = project.documentos.matricula?.nombre || "No disponible";
    document.getElementById("linkArchivoCC").textContent = project.documentos.cc?.nombre || "No disponible";
    document.getElementById("linkArchivoExcel").textContent = project.documentos.formulario?.nombre || "No disponible";
=======
  document.getElementById("verificacionIdProyecto").textContent = project.id
  document.getElementById("verificacionNombreProyecto").textContent = project.nombre
  document.getElementById("verificacionNombre").textContent = project.nombre
  document.getElementById("verificacionPRST").textContent = project.prstNombre || project.creadorNombre
  document.getElementById("verificacionDireccionInicial").textContent = project.direccionInicial
  document.getElementById("verificacionDireccionFinal").textContent = project.direccionFinal
  document.getElementById("verificacionBarrios").textContent = project.barrios?.join(", ") || "No especificado"
  document.getElementById("verificacionMunicipio").textContent = project.municipio
  document.getElementById("verificacionDepartamento").textContent = project.departamento
  document.getElementById("verificacionNumeroPostes").textContent = project.numPostes
  document.getElementById("verificacionFechaInicio").textContent = project.fechaInicio
  document.getElementById("verificacionFechaFin").textContent = project.fechaFin
  document.getElementById("verificacionPuntoConexion").textContent = project.puntoConexion
  document.getElementById("verificacionObservaciones").textContent = project.observaciones || "No hay observaciones"

  // Mostrar enlaces a documentos (si existen)
  if (project.documentos) {
    document.getElementById("linkArchivoKMZ").textContent = project.documentos.kmz?.nombre || "No disponible"
    document.getElementById("linkArchivoDWG").textContent = project.documentos.dwg?.nombre || "No disponible"
    document.getElementById("linkArchivoPDF").textContent = project.documentos.plano?.nombre || "No disponible"
    document.getElementById("linkArchivoMatricula").textContent =
      project.documentos.matricula?.nombre || "No disponible"
    document.getElementById("linkArchivoCC").textContent = project.documentos.cc?.nombre || "No disponible"
    document.getElementById("linkArchivoExcel").textContent = project.documentos.formulario?.nombre || "No disponible"
>>>>>>> 20de416 (Descripción del cambio)
  }

  // Resetear verificación
  document.querySelectorAll(".btn-verificacion").forEach((btn) => {
    btn.classList.remove("active");
  });

  document.querySelectorAll(".observacion-doc").forEach((field) => {
    field.value = "";
    field.disabled = true;
  });

  // Mostrar sección de verificación
  showSection("seccionVerificacion");
}

<<<<<<< HEAD
// Rechazar proyecto
// Rechazar proyecto
function rechazarProyecto() {
  if (!currentProject) {
    console.error("No hay proyecto seleccionado");
    return;
  }

  // Verificar que se hayan marcado todos los documentos
  const docsVerificados = document.querySelectorAll(".btn-verificacion.active");
=======
// Update the rechazarProyecto function to add a cancel button and prevent adding more observations after rejection
function rechazarProyecto() {
  if (!currentProject) {
    console.error("No hay proyecto seleccionado")
    return
  }

  // Verify all documents are checked
  const docsVerificados = document.querySelectorAll(".btn-verificacion.active")
>>>>>>> 20de416 (Descripción del cambio)
  if (docsVerificados.length < 6) {
    showModalMessage("Debe verificar todos los documentos antes de rechazar el proyecto.");
    return;
  }

<<<<<<< HEAD
  // Verificar que haya al menos un documento rechazado
  const hayRechazados = Array.from(docsVerificados).some(
    (btn) => btn.dataset.value === "false"
  );
  
=======
  // Verify at least one document is rejected
  const hayRechazados = Array.from(docsVerificados).some((btn) => btn.dataset.value === "false")

>>>>>>> 20de416 (Descripción del cambio)
  if (!hayRechazados) {
    showModalMessage("Para rechazar el proyecto, debe marcar al menos un documento como incorrecto.");
    return;
  }

<<<<<<< HEAD
  // Recopilar observaciones
  const observaciones = [];
  let observacionesValidas = true;
=======
  // Collect observations
  const observaciones = []
  let observacionesValidas = true
>>>>>>> 20de416 (Descripción del cambio)

  document.querySelectorAll(".btn-verificacion.active[data-value='false']").forEach((btn) => {
    const doc = btn.dataset.doc;
    const obsField = document.getElementById(`obs${doc.charAt(0).toUpperCase() + doc.slice(1)}`);
    const obsText = obsField.value.trim();

    if (!obsText) {
<<<<<<< HEAD
      showModalMessage(`Debe proporcionar observaciones para el documento ${doc.toUpperCase()} rechazado.`);
      obsField.focus();
      observacionesValidas = false;
      return;
=======
      alert(`Debe proporcionar observaciones para el documento ${doc.toUpperCase()} rechazado.`)
      obsField.focus()
      observacionesValidas = false
      return
>>>>>>> 20de416 (Descripción del cambio)
    }

    observaciones.push(`${doc.toUpperCase()}: ${obsText}`);
  });

  if (!observacionesValidas) return;

  // Actualizar proyecto
  currentProject.estado = "Documentación Errada";
  currentProject.observacionesEjecutiva = observaciones.join("\n\n");
  currentProject.fechaRechazo = new Date().toISOString();

  if (!observacionesValidas) return

  // Show confirmation dialog with cancel option
  if (!confirm("¿Está seguro de rechazar este proyecto? Esta acción no se puede deshacer.")) {
    return // User canceled the action
  }

  try {
<<<<<<< HEAD
    // Guardar proyecto
    Storage.saveProject(currentProject);
=======
    // Update project
    currentProject.estado = "Documentación Errada"
    currentProject.observacionesEjecutiva = observaciones.join("\n\n")
    currentProject.fechaRechazo = new Date().toISOString()

    // Add to history
    if (!currentProject.historial) {
      currentProject.historial = []
    }

    currentProject.historial.push({
      estado: "Documentación Errada",
      fecha: new Date().toISOString(),
      usuario: `${currentUser.nombre} ${currentUser.apellido || ""}`,
      rol: "Ejecutiva",
      comentario: "Proyecto rechazado por documentación incorrecta",
    })

    // Save project
    Storage.saveProject(currentProject)
>>>>>>> 20de416 (Descripción del cambio)

    // Notify PRST
    Storage.createNotification({
      usuarioId: currentProject.creadorId,
      tipo: "proyecto_rechazado",
      mensaje: `Tu proyecto "${currentProject.nombre}" ha sido revisado y requiere correcciones.`,
      fechaCreacion: new Date().toISOString(),
      leido: false,
    });

    // Notify ejecutiva
    Storage.createNotification({
      usuarioId: currentUser.id,
      tipo: "proyecto_revisado",
      mensaje: `Has rechazado el proyecto "${currentProject.nombre}" con ID ${currentProject.id}.`,
      fechaCreacion: new Date().toISOString(),
      leido: false,
    });

<<<<<<< HEAD
    // Mostrar mensaje de éxito
    showModalMessage("Proyecto rechazado correctamente. Se han enviado las observaciones al PRST.");

    // Recargar proyectos y volver a la lista
    loadProjects();
    loadNotifications();
    showSection("seccionProyectos");
    
  } catch (error) {
    console.error("Error al rechazar el proyecto:", error);
    showModalMessage("Ocurrió un error al rechazar el proyecto. Por favor, intente nuevamente.");
  }
}

// Función auxiliar para mostrar mensajes modales
function showModalMessage(message) {
  const modal = new bootstrap.Modal(document.getElementById('modalMensaje'));
  document.getElementById('modalMensajeBody').textContent = message;
  modal.show();
}


// Aprobar proyecto
=======
    alert("Proyecto rechazado correctamente. Se han enviado las observaciones al PRST.")

    // Reload data
    loadProjects()
    loadNotifications()
    showSection("seccionProyectos")
  } catch (error) {
    console.error("Error al rechazar proyecto:", error)
    alert("Error al rechazar el proyecto. Por favor, intente nuevamente.")
  }
}

// Modificar la función aprobarProyecto para enviar el proyecto al Coordinador Operativo
>>>>>>> 20de416 (Descripción del cambio)
function aprobarProyecto() {
  if (!currentProject) return

  // Verify all documents are checked
  const docsVerificados = document.querySelectorAll(".btn-verificacion.active")
  if (docsVerificados.length < 6) {
    alert("Debe verificar todos los documentos antes de aprobar el proyecto.")
    return
  }

  // Verify all documents are approved
  const todosAprobados = Array.from(docsVerificados).every((btn) => btn.dataset.value === "true")
  if (!todosAprobados) {
    alert("Para aprobar el proyecto, todos los documentos deben estar correctos.")
    return
  }

  // Confirm action with cancel option
  if (
    !confirm(
      "¿Está seguro de aprobar este proyecto? Esta acción asignará el proyecto a un coordinador para su revisión.",
    )
  ) {
    return // User canceled the action
  }

  // Find available coordinators with role "operativo"
  const coordinadores = Storage.getUsers().filter(
    (user) => user.rol === "coordinador" && user.tipoCoordinador === "operativo" && user.activo,
  )

  if (coordinadores.length === 0) {
    alert("No hay coordinadores operativos disponibles para asignar el proyecto. Por favor, contacte al administrador.")
    return
  }

  // Assign to a random coordinator (in real system would be based on workload)
  const coordinadorAsignado = coordinadores[Math.floor(Math.random() * coordinadores.length)]

  // Update project
  currentProject.estado = "En Asignación"
  currentProject.coordinadorId = coordinadorAsignado.id
  currentProject.coordinadorNombre = `${coordinadorAsignado.nombre} ${coordinadorAsignado.apellido || ""}`
  currentProject.fechaAprobacion = new Date().toISOString()
  currentProject.tipoCoordinacion = "operativa" // Mark for operational coordinator

  // Add to history
  if (!currentProject.historial) {
    currentProject.historial = []
  }

  currentProject.historial.push({
    estado: "En Asignación",
    fecha: new Date().toISOString(),
    usuario: `${currentUser.nombre} ${currentUser.apellido || ""}`,
    rol: "Ejecutiva",
    comentario: `Proyecto aprobado y asignado al coordinador operativo ${coordinadorAsignado.nombre} ${coordinadorAsignado.apellido || ""}`,
  })

  try {
    // Save project
    Storage.saveProject(currentProject)

    // Notify PRST
    Storage.createNotification({
      usuarioId: currentProject.creadorId,
      tipo: "proyecto_aprobado",
      mensaje: `Tu proyecto "${currentProject.nombre}" ha sido aprobado por la ejecutiva y pasará a revisión por el coordinador operativo.`,
      fechaCreacion: new Date().toISOString(),
      leido: false,
    })

    // Notify coordinator
    Storage.createNotification({
      usuarioId: coordinadorAsignado.id,
      tipo: "proyecto_asignado",
      mensaje: `Se te ha asignado un nuevo proyecto para coordinar: "${currentProject.nombre}" con ID ${currentProject.id}.`,
      fechaCreacion: new Date().toISOString(),
      leido: false,
    })

    // Notify ejecutiva
    Storage.createNotification({
      usuarioId: currentUser.id,
      tipo: "proyecto_revisado",
      mensaje: `Has aprobado el proyecto "${currentProject.nombre}" con ID ${currentProject.id}. Ha sido asignado al coordinador operativo ${currentProject.coordinadorNombre}.`,
      fechaCreacion: new Date().toISOString(),
      leido: false,
    })

    alert(
      `Proyecto aprobado correctamente. Ha sido asignado al coordinador operativo ${currentProject.coordinadorNombre}.`,
    )

    // Reload data
    loadProjects()
    loadNotifications()
    showSection("seccionProyectos")
  } catch (error) {
    console.error("Error al aprobar proyecto:", error)
    alert("Error al aprobar el proyecto. Por favor, intente nuevamente.")
  }
}

// Update the loadProjectObservations function to correctly show the header
function loadProjectObservations(projectId) {
  const project = Storage.getProjectById(projectId)
  if (!project) return

  currentProject = project

  // Llenar datos del proyecto
  document.getElementById("observacionesIdProyecto").textContent = project.id
  document.getElementById("observacionesNombreProyecto").textContent = project.nombre
  document.getElementById("observacionesNombre").textContent = project.nombre
  document.getElementById("observacionesPRST").textContent = project.creadorNombre
  document.getElementById("observacionesMunicipio").textContent = project.municipio
  document.getElementById("observacionesDepartamento").textContent = project.departamento
  document.getElementById("observacionesNumeroPostes").textContent = project.numPostes

  // Actualizar el título del encabezado para mostrar "Observaciones de Ejecutiva" en lugar de "Observaciones del Analista"
  const headerElement = document.querySelector("#seccionObservacionesVerificacion .card-header h5")
  if (headerElement) {
    headerElement.innerHTML = '<h5 class="mb-0">Observaciones de Ejecutiva</h5>'
  }

  // Actualizar el texto del alert para mostrar "Proyecto con Documentación Errada" en lugar de "Proyecto con Observaciones"
  const alertTitleElement = document.querySelector("#seccionObservacionesVerificacion .alert h5")
  if (alertTitleElement) {
    alertTitleElement.innerHTML =
      '<i class="bi bi-exclamation-triangle-fill me-2"></i> Proyecto con Documentación Errada'
  }

  const alertTextElement = document.querySelector("#seccionObservacionesVerificacion .alert p")
  if (alertTextElement) {
    alertTextElement.textContent = "Se han encontrado problemas con la documentación que deben ser corregidos."
  }

  // Mostrar observaciones
  document.getElementById("observacionesAnalista").innerHTML = project.observacionesEjecutiva.replace(/\n/g, "<br>")

  // Limpiar campo de observaciones para el PRST
  document.getElementById("observacionesParaPRST").value = ""

  // Mostrar sección de observaciones
  showSection("seccionObservacionesVerificacion")
}

// Update the enviarObservacionesAlPRST function to prevent adding more observations after rejection
function enviarObservacionesAlPRST() {
  if (!currentProject) return

  // Check if the project is already in "Documentación Errada" state and has observations
  if (currentProject.estado === "Documentación Errada" && currentProject.observacionesEjecutiva) {
    alert("Este proyecto ya ha sido rechazado y tiene observaciones. No se pueden agregar más observaciones.")
    return
  }

  const observaciones = document.getElementById("observacionesParaPRST").value.trim()

  if (!observaciones) {
    alert("Por favor, escriba las observaciones que desea enviar al PRST.")
    document.getElementById("observacionesParaPRST").focus()
    return
  }

  // Actualizar observaciones del proyecto
  currentProject.observacionesEjecutiva += "\n\nObservaciones adicionales:\n" + observaciones

  // Agregar al historial
  if (!currentProject.historial) {
    currentProject.historial = []
  }

  currentProject.historial.push({
    estado: "Documentación Errada",
    fecha: new Date().toISOString(),
    usuario: `${currentUser.nombre} ${currentUser.apellido || ""}`,
    rol: "Ejecutiva",
    comentario: "Se agregaron observaciones adicionales al proyecto",
  })

  // Guardar proyecto
  Storage.saveProject(currentProject)

  // Notificar al PRST
  Storage.createNotification({
    usuarioId: currentProject.creadorId,
    tipo: "proyecto_observaciones",
    mensaje: `Se han agregado nuevas observaciones a tu proyecto "${currentProject.nombre}".`,
    fechaCreacion: new Date().toISOString(),
    leido: false,
  })

  // Mostrar mensaje de éxito
  alert("Observaciones enviadas correctamente al PRST.")

  // Recargar proyectos y volver a la lista
  loadProjects()
  loadNotifications()
  showSection("seccionPendientes")
}

// Cargar detalles de proyecto
function loadProjectDetails(projectId) {
  const project = Storage.getProjectById(projectId)
  if (!project) return

  // Llenar datos del proyecto
  document.getElementById("finalizacionIdProyecto").textContent = project.id
  document.getElementById("finalizacionNombreProyecto").textContent = project.nombre
  document.getElementById("finalizacionNombre").textContent = project.nombre
  document.getElementById("finalizacionPRST").textContent = project.creadorNombre
  document.getElementById("finalizacionDireccionInicial").textContent = project.direccionInicial
  document.getElementById("finalizacionDireccionFinal").textContent = project.direccionFinal
  document.getElementById("finalizacionBarrios").textContent = project.barrios?.join(", ") || "No especificado"
  document.getElementById("finalizacionMunicipio").textContent = project.municipio
  document.getElementById("finalizacionDepartamento").textContent = project.departamento
  document.getElementById("finalizacionNumeroPostes").textContent = project.numPostes
  document.getElementById("finalizacionFechaInicio").textContent = project.fechaInicio
  document.getElementById("finalizacionFechaFin").textContent = project.fechaFin
  document.getElementById("finalizacionPuntoConexion").textContent = project.puntoConexion

  // Mostrar sección de finalización
  showSection("seccionFinalizacion")
}

// Mostrar historial del proyecto
function showProjectHistory(projectId) {
  const project = Storage.getProjectById(projectId)
  if (!project) return

  // Crear historial si no existe
  if (!project.historial) {
    project.historial = []

    // Agregar estado inicial
    project.historial.push({
      estado: "Nuevo",
      fecha: project.fechaCreacion,
      usuario: project.creadorNombre,
      rol: "PRST",
      comentario: "Proyecto creado",
    })

    // Agregar otros estados si existen fechas
    if (project.fechaEnvio) {
      project.historial.push({
        estado: "En Revision por Ejecutiva",
        fecha: project.fechaEnvio,
        usuario: project.creadorNombre,
        rol: "PRST",
        comentario: "Proyecto enviado a revisión",
      })
    }

    if (project.fechaRechazo) {
      project.historial.push({
        estado: "Documentación Errada",
        fecha: project.fechaRechazo,
        usuario: project.ejecutivaNombre || "Ejecutiva",
        rol: "Ejecutiva",
        comentario: "Proyecto rechazado por documentación incorrecta",
      })
    }

    if (project.fechaAprobacion) {
      project.historial.push({
        estado: "En Asignación",
        fecha: project.fechaAprobacion,
        usuario: project.ejecutivaNombre || "Ejecutiva",
        rol: "Ejecutiva",
        comentario: "Proyecto aprobado y enviado a coordinación",
      })
    }

    if (project.fechaAsignacion) {
      project.historial.push({
        estado: project.analistaId ? "En Gestion por Analista" : "En Gestion por Brigada",
        fecha: project.fechaAsignacion,
        usuario: project.coordinadorNombre || "Coordinador",
        rol: "Coordinador",
        comentario: project.analistaId
          ? `Proyecto asignado al analista ${project.analistaNombre}`
          : `Proyecto asignado a la brigada ${project.brigadaNombre}`,
      })
    }

    // Guardar el historial
    Storage.saveProject(project)
  }

  // Ordenar historial por fecha (más recientes primero)
  const sortedHistory = [...project.historial].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

  // Crear modal para mostrar historial
  const modalHtml = `
    <div class="modal fade" id="historialModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">Historial del Proyecto: ${project.nombre}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>Fecha y Hora</th>
                    <th>Estado</th>
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th>Comentario</th>
                  </tr>
                </thead>
                <tbody>
                  ${sortedHistory
                    .map(
                      (item) => `
                    <tr>
                      <td>${formatDateTime(item.fecha)}</td>
                      <td><span class="badge ${getBadgeClass(item.estado)}">${item.estado}</span></td>
                      <td>${item.usuario}</td>
                      <td>${item.rol}</td>
                      <td>${item.comentario}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  `

  // Eliminar modal anterior si existe
  const oldModal = document.getElementById("historialModal")
  if (oldModal) {
    oldModal.remove()
  }

  // Agregar modal al DOM
  document.body.insertAdjacentHTML("beforeend", modalHtml)

  // Mostrar modal
  const historialModal = new bootstrap.Modal(document.getElementById("historialModal"))
  historialModal.show()
}

// Obtener clase para el badge según el estado
function getBadgeClass(estado) {
  switch (estado) {
    case "Nuevo":
      return "bg-secondary"
    case "En Revision por Ejecutiva":
      return "bg-warning text-dark"
    case "En Asignación":
      return "bg-info text-dark"
    case "En Gestion por Analista":
    case "En Gestion por Brigada":
      return "bg-primary"
    case "En Revision de Verificacion":
      return "bg-info"
    case "Opcion Mejorar":
      return "bg-warning"
    case "Generacion de Informe":
      return "bg-light text-dark"
    case "Finalizado":
      return "bg-success"
    case "Documentación Errada":
      return "bg-danger"
    default:
      return "bg-secondary"
  }
}

// Buscar proyectos
function buscarProyectos(tablaId, inputId) {
  const searchText = document.getElementById(inputId).value.toLowerCase()
  const tabla = document.getElementById(tablaId)
  const filas = tabla.querySelectorAll("tr")

  filas.forEach((fila) => {
    if (fila.cells && fila.cells.length > 1) {
      // Ignorar filas de encabezado o mensajes
      const textoFila = Array.from(fila.cells)
        .map((cell) => cell.textContent.toLowerCase())
        .join(" ")

      if (textoFila.includes(searchText)) {
        fila.style.display = ""
      } else {
        fila.style.display = "none"
      }
    }
  })
}

// Cambiar contraseña
function cambiarPassword() {
  const passwordActual = document.getElementById("passwordActual").value
  const passwordNueva = document.getElementById("passwordNueva").value
  const passwordConfirmar = document.getElementById("passwordConfirmar").value

  // Validar campos
  if (!passwordActual || !passwordNueva || !passwordConfirmar) {
    alert("Por favor, complete todos los campos.")
    return
  }

  // Validar que las contraseñas coincidan
  if (passwordNueva !== passwordConfirmar) {
    alert("Las contraseñas nuevas no coinciden.")
    return
  }

  // Validar contraseña actual
  if (passwordActual !== currentUser.password) {
    alert("La contraseña actual es incorrecta.")
    return
  }

  // Actualizar contraseña
  currentUser.password = passwordNueva
  Storage.saveUser(currentUser)
  Storage.setLoggedUser(currentUser)

  // Mostrar mensaje de éxito
  alert("Contraseña actualizada correctamente.")

  // Limpiar formulario
  document.getElementById("formCambiarPassword").reset()
}

// Import bootstrap (assuming it's available globally or via a module bundler)
const bootstrap = window.bootstrap

