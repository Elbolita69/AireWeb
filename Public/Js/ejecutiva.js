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

// Cargar proyectos asignados a la ejecutiva
function loadProjects() {
  // Obtener proyectos asignados a la ejecutiva actual
  const projects = Storage.getProjects().filter(
    (project) => project.ejecutivaId === currentUser.id && project.estado === "En Revisión por Ejecutiva",
  )

  // Mostrar proyectos en la tabla
  const tablaProyectos = document.getElementById("tablaProyectos")
  if (tablaProyectos) {
    if (projects.length === 0) {
      tablaProyectos.innerHTML = `
        <tr>
          <td colspan="8" class="text-center">No hay proyectos asignados para revisión.</td>
        </tr>
      `
    } else {
      tablaProyectos.innerHTML = ""
      projects.forEach((project) => {
        const row = document.createElement("tr")
        row.innerHTML = `
          <td>${project.id}</td>
          <td>${project.nombre}</td>
          <td>${project.creadorNombre}</td>
          <td>${project.municipio}</td>
          <td>${project.departamento}</td>
          <td>${new Date(project.fechaEnvio).toLocaleDateString()}</td>
          <td><span class="badge bg-warning text-dark">${project.estado}</span></td>
          <td>
            <button class="btn btn-sm btn-primary revisar-proyecto" data-id="${project.id}">
              <i class="bi bi-eye"></i> Revisar
            </button>
          </td>
        `
        tablaProyectos.appendChild(row)
      })
    }
  }

  // Cargar proyectos pendientes (con observaciones)
  const projectsPendientes = Storage.getProjects().filter(
    (project) => project.ejecutivaId === currentUser.id && project.estado === "Documentación Errada",
  )

  const tablaProyectosPendientes = document.getElementById("tablaProyectosPendientes")
  if (tablaProyectosPendientes) {
    if (projectsPendientes.length === 0) {
      tablaProyectosPendientes.innerHTML = `
        <tr>
          <td colspan="8" class="text-center">No hay proyectos pendientes de corrección.</td>
        </tr>
      `
    } else {
      tablaProyectosPendientes.innerHTML = ""
      projectsPendientes.forEach((project) => {
        const row = document.createElement("tr")
        row.innerHTML = `
          <td>${project.id}</td>
          <td>${project.nombre}</td>
          <td>${project.creadorNombre}</td>
          <td>${project.municipio}</td>
          <td>${project.departamento}</td>
          <td>${new Date(project.fechaEnvio).toLocaleDateString()}</td>
          <td><span class="badge bg-danger">${project.estado}</span></td>
          <td>
            <button class="btn btn-sm btn-primary ver-observaciones" data-id="${project.id}">
              <i class="bi bi-eye"></i> Ver Observaciones
            </button>
          </td>
        `
        tablaProyectosPendientes.appendChild(row)
      })
    }
  }

  // Cargar proyectos finalizados (aprobados por la ejecutiva)
  const projectsFinalizados = Storage.getProjects().filter(
    (project) =>
      project.ejecutivaId === currentUser.id &&
      (project.estado === "En Asignación" ||
        project.estado === "Asignado" ||
        project.estado === "En Revisión de Verificación" ||
        project.estado === "Finalizado"),
  )

  const tablaProyectosFinalizados = document.getElementById("tablaProyectosFinalizados")
  if (tablaProyectosFinalizados) {
    if (projectsFinalizados.length === 0) {
      tablaProyectosFinalizados.innerHTML = `
        <tr>
          <td colspan="7" class="text-center">No hay proyectos finalizados.</td>
        </tr>
      `
    } else {
      tablaProyectosFinalizados.innerHTML = ""
      projectsFinalizados.forEach((project) => {
        const row = document.createElement("tr")
        row.innerHTML = `
          <td>${project.id}</td>
          <td>${project.nombre}</td>
          <td>${project.creadorNombre}</td>
          <td>${project.municipio}</td>
          <td>${project.departamento}</td>
          <td>${project.fechaAprobacion ? new Date(project.fechaAprobacion).toLocaleDateString() : "-"}</td>
          <td>
            <button class="btn btn-sm btn-info ver-proyecto" data-id="${project.id}">
              <i class="bi bi-eye"></i> Ver Detalles
            </button>
          </td>
        `
        tablaProyectosFinalizados.appendChild(row)
      })
    }
  }
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
  const diffMins = Math.floor(diffSecs / 60)
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
  const project = Storage.getProjectById(projectId)
  if (!project) return

  currentProject = project

  // Llenar datos del proyecto
  document.getElementById("verificacionIdProyecto").textContent = project.id
  document.getElementById("verificacionNombreProyecto").textContent = project.nombre
  document.getElementById("verificacionNombre").textContent = project.nombre
  document.getElementById("verificacionPRST").textContent = project.creadorNombre
  document.getElementById("verificacionDireccionInicial").textContent = project.direccionInicial
  document.getElementById("verificacionDireccionFinal").textContent = project.direccionFinal
  document.getElementById("verificacionBarrios").textContent = project.barrios.join(", ") || "No especificado"
  document.getElementById("verificacionMunicipio").textContent = project.municipio
  document.getElementById("verificacionDepartamento").textContent = project.departamento
  document.getElementById("verificacionNumeroPostes").textContent = project.numPostes
  document.getElementById("verificacionFechaInicio").textContent = project.fechaInicio
  document.getElementById("verificacionFechaFin").textContent = project.fechaFin
  document.getElementById("verificacionPuntoConexion").textContent = project.puntoConexion
  document.getElementById("verificacionObservaciones").textContent = project.observaciones || "No hay observaciones"

  // Mostrar enlaces a documentos
  document.getElementById("linkArchivoKMZ").textContent = project.documentos.kmz.nombre
  document.getElementById("linkArchivoDWG").textContent = project.documentos.dwg.nombre
  document.getElementById("linkArchivoPDF").textContent = project.documentos.plano.nombre
  document.getElementById("linkArchivoMatricula").textContent = project.documentos.matricula.nombre
  document.getElementById("linkArchivoCC").textContent = project.documentos.cc.nombre
  document.getElementById("linkArchivoExcel").textContent = project.documentos.formulario.nombre

  // Resetear verificación
  document.querySelectorAll(".btn-verificacion").forEach((btn) => {
    btn.classList.remove("active")
  })

  document.querySelectorAll(".observacion-doc").forEach((field) => {
    field.value = ""
    field.disabled = true
  })

  // Mostrar sección de verificación
  showSection("seccionVerificacion")
}

// Rechazar proyecto
function rechazarProyecto() {
  if (!currentProject) return

  // Verificar que se hayan marcado todos los documentos
  const docsVerificados = document.querySelectorAll(".btn-verificacion.active")
  if (docsVerificados.length < 6) {
    alert("Debe verificar todos los documentos antes de rechazar el proyecto.")
    return
  }

  // Verificar que haya al menos un documento rechazado
  const hayRechazados = Array.from(docsVerificados).some((btn) => btn.dataset.value === "false")
  if (!hayRechazados) {
    alert("Para rechazar el proyecto, debe marcar al menos un documento como incorrecto.")
    return
  }

  // Recopilar observaciones
  const observaciones = []
  document.querySelectorAll(".btn-verificacion.active[data-value='false']").forEach((btn) => {
    const doc = btn.dataset.doc
    const obsField = document.getElementById(`obs${doc.charAt(0).toUpperCase() + doc.slice(1)}`)
    const obsText = obsField.value.trim()

    if (!obsText) {
      alert(`Debe proporcionar observaciones para el documento ${doc.toUpperCase()} rechazado.`)
      obsField.focus()
      throw new Error("Observaciones faltantes")
    }

    observaciones.push(`${doc.toUpperCase()}: ${obsText}`)
  })

  try {
    // Actualizar proyecto
    currentProject.estado = "Documentación Errada"
    currentProject.observacionesEjecutiva = observaciones.join("\n\n")
    currentProject.fechaRechazo = new Date().toISOString()

    // Guardar proyecto
    Storage.saveProject(currentProject)

    // Notificar al PRST
    Storage.createNotification({
      usuarioId: currentProject.creadorId,
      tipo: "proyecto_rechazado",
      mensaje: `Tu proyecto "${currentProject.nombre}" ha sido revisado y requiere correcciones.`,
      fechaCreacion: new Date().toISOString(),
      leido: false,
    })

    // Notificar a la ejecutiva
    Storage.createNotification({
      usuarioId: currentUser.id,
      tipo: "proyecto_revisado",
      mensaje: `Has rechazado el proyecto "${currentProject.nombre}" con ID ${currentProject.id}.`,
      fechaCreacion: new Date().toISOString(),
      leido: false,
    })

    // Mostrar mensaje de éxito
    alert("Proyecto rechazado correctamente. Se han enviado las observaciones al PRST.")

    // Recargar proyectos y volver a la lista
    loadProjects()
    loadNotifications()
    showSection("seccionProyectos")
  } catch (error) {
    if (error.message !== "Observaciones faltantes") {
      console.error(error)
      alert("Ha ocurrido un error al rechazar el proyecto.")
    }
  }
}

// Aprobar proyecto
function aprobarProyecto() {
  if (!currentProject) return

  // Verificar que se hayan marcado todos los documentos
  const docsVerificados = document.querySelectorAll(".btn-verificacion.active")
  if (docsVerificados.length < 6) {
    alert("Debe verificar todos los documentos antes de aprobar el proyecto.")
    return
  }

  // Verificar que todos los documentos estén aprobados
  const todosAprobados = Array.from(docsVerificados).every((btn) => btn.dataset.value === "true")
  if (!todosAprobados) {
    alert("Para aprobar el proyecto, todos los documentos deben estar correctos.")
    return
  }

  // Confirmar acción
  if (
    !confirm(
      '¿Está seguro de aprobar este proyecto? Esta acción asignará el proyecto a un coordinador para su revisión.")) {yecto? Esta acción asignará el proyecto a un coordinador para su revisión.',
    )
  ) {
    return
  }

  // Buscar coordinadores disponibles
  const coordinadores = Storage.getUsers().filter((user) => user.rol === "coordinador" && user.activo)

  if (coordinadores.length === 0) {
    alert("No hay coordinadores disponibles para asignar el proyecto. Por favor, contacte al administrador.")
    return
  }

  // Asignar a un coordinador (en un sistema real podría ser por carga de trabajo)
  const coordinadorAsignado = coordinadores[Math.floor(Math.random() * coordinadores.length)]

  // Actualizar proyecto
  currentProject.estado = "En Asignación"
  currentProject.coordinadorId = coordinadorAsignado.id
  currentProject.coordinadorNombre = `${coordinadorAsignado.nombre} ${coordinadorAsignado.apellido || ""}`
  currentProject.fechaAprobacion = new Date().toISOString()

  // Guardar proyecto
  Storage.saveProject(currentProject)

  // Notificar al PRST
  Storage.createNotification({
    usuarioId: currentProject.creadorId,
    tipo: "proyecto_aprobado",
    mensaje: `Tu proyecto "${currentProject.nombre}" ha sido aprobado por la ejecutiva y pasará a revisión por el coordinador.`,
    fechaCreacion: new Date().toISOString(),
    leido: false,
  })

  // Notificar al coordinador
  Storage.createNotification({
    usuarioId: coordinadorAsignado.id,
    tipo: "proyecto_asignado",
    mensaje: `Se te ha asignado un nuevo proyecto para coordinar: "${currentProject.nombre}" con ID ${currentProject.id}.`,
    fechaCreacion: new Date().toISOString(),
    leido: false,
  })

  // Notificar a la ejecutiva
  Storage.createNotification({
    usuarioId: currentUser.id,
    tipo: "proyecto_revisado",
    mensaje: `Has aprobado el proyecto "${currentProject.nombre}" con ID ${currentProject.id}. Ha sido asignado a ${currentProject.coordinadorNombre}.`,
    fechaCreacion: new Date().toISOString(),
    leido: false,
  })

  // Mostrar mensaje de éxito
  alert(`Proyecto aprobado correctamente. Ha sido asignado al coordinador ${currentProject.coordinadorNombre}.`)

  // Recargar proyectos y volver a la lista
  loadProjects()
  loadNotifications()
  showSection("seccionProyectos")
}

// Cargar observaciones de proyecto
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

  // Mostrar observaciones
  document.getElementById("observacionesAnalista").innerHTML = project.observacionesEjecutiva.replace(/\n/g, "<br>")

  // Limpiar campo de observaciones para el PRST
  document.getElementById("observacionesParaPRST").value = ""

  // Mostrar sección de observaciones
  showSection("seccionObservacionesVerificacion")
}

// Enviar observaciones al PRST
function enviarObservacionesAlPRST() {
  if (!currentProject) return

  const observaciones = document.getElementById("observacionesParaPRST").value.trim()

  if (!observaciones) {
    alert("Por favor, escriba las observaciones que desea enviar al PRST.")
    document.getElementById("observacionesParaPRST").focus()
    return
  }

  // Actualizar observaciones del proyecto
  currentProject.observacionesEjecutiva += "\n\nObservaciones adicionales:\n" + observaciones

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
  document.getElementById("finalizacionBarrios").textContent = project.barrios.join(", ") || "No especificado"
  document.getElementById("finalizacionMunicipio").textContent = project.municipio
  document.getElementById("finalizacionDepartamento").textContent = project.departamento
  document.getElementById("finalizacionNumeroPostes").textContent = project.numPostes
  document.getElementById("finalizacionFechaInicio").textContent = project.fechaInicio
  document.getElementById("finalizacionFechaFin").textContent = project.fechaFin
  document.getElementById("finalizacionPuntoConexion").textContent = project.puntoConexion

  // Mostrar sección de finalización
  showSection("seccionFinalizacion")
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



