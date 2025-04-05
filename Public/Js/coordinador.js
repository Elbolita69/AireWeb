// coordinador.js - Funcionalidades para el rol de Coordinador

document.addEventListener("DOMContentLoaded", () => {
  // Verificar si el usuario está logueado y tiene el rol correcto
  const loggedUser = Storage.getLoggedUser()
  if (!loggedUser || loggedUser.rol !== "coordinador") {
    window.location.href = "login.html"
    return
  }

  // Inicializar variables globales
  let currentProject = null
  const currentAction = null

  // Cargar datos del usuario
  loadUserData()

  // Cargar proyectos según el tipo de coordinador
  loadProjects()

  // Cargar notificaciones
  loadNotifications()

  // Configurar eventos
  setupEventListeners()

  // Función para cargar datos del usuario
  function loadUserData() {
    // Mostrar nombre del usuario
    document.getElementById("nombreUsuario").textContent = loggedUser.nombre
    document.getElementById("nombreCoordinador").textContent = loggedUser.nombre

    // Mostrar tipo de coordinador
    const tipoCoordinador = loggedUser.tipoCoordinador || "No especificado"
    document.getElementById("tipoCoordinador").textContent = tipoCoordinador

    // Cargar datos en la sección de perfil
    document.getElementById("perfilNombre").textContent = `${loggedUser.nombre} ${loggedUser.apellido || ""}`
    document.getElementById("perfilRol").textContent = "Coordinador"
    document.getElementById("perfilTipo").textContent = `Tipo: ${tipoCoordinador}`
    document.getElementById("perfilUsuario").textContent = loggedUser.usuario || "-"
    document.getElementById("perfilCorreo").textContent = loggedUser.correo || "-"
    document.getElementById("perfilDepartamento").textContent = loggedUser.departamento || "-"
    document.getElementById("perfilCargo").textContent = loggedUser.cargo || "Coordinador"

    // Ocultar pestañas según el tipo de coordinador
    if (tipoCoordinador.toLowerCase() !== "operativo") {
      // Para coordinadores administrativos y de censo, ocultar la pestaña "Por Asignar"
      document.getElementById("porAsignar-tab").classList.add("d-none")
    }
  }

  // Función para cargar proyectos
  function loadProjects() {
    const tipoCoordinador = loggedUser.tipoCoordinador?.toLowerCase() || ""
    const allProjects = Storage.getProjects()

    // Filtrar proyectos según el tipo de coordinador
    let proyectosPorAsignar = []
    let proyectosEnGestion = []
    let proyectosVerificados = []
    let proyectosFinalizados = []

    if (tipoCoordinador === "operativo") {
      // Coordinador Operativo: Puede asignar proyectos y revisar verificaciones
      proyectosPorAsignar = allProjects.filter(
        (project) =>
          project.estado === "En Asignación" &&
          project.coordinadorId === loggedUser.id &&
          project.tipoCoordinacion === "operativa",
      )

      proyectosEnGestion = allProjects.filter(
        (project) =>
          (project.estado === "Asignado" ||
            project.estado === "En Gestion por Analista" ||
            project.estado === "En Gestion por Brigada") &&
          project.coordinadorId === loggedUser.id,
      )

      proyectosVerificados = allProjects.filter(
        (project) => project.estado === "En Revision de Verificacion" && project.coordinadorId === loggedUser.id,
      )

      proyectosFinalizados = allProjects.filter(
        (project) =>
          (project.estado === "Verificado" ||
            project.estado === "Finalizado" ||
            project.estado === "Generacion de Informe") &&
          project.coordinadorId === loggedUser.id,
      )
    } else if (tipoCoordinador === "administrativo") {
      // Coordinador Administrativo: Solo ve proyectos, no asigna
      proyectosEnGestion = allProjects.filter(
        (project) =>
          (project.estado === "Asignado" ||
            project.estado === "En Gestion por Analista" ||
            project.estado === "En Gestion por Brigada") &&
          project.tipoCoordinacion === "administrativa",
      )

      proyectosVerificados = allProjects.filter(
        (project) =>
          (project.estado === "En Revision de Verificacion" || project.estado === "Verificado") &&
          project.tipoCoordinacion === "administrativa",
      )

      proyectosFinalizados = allProjects.filter(
        (project) =>
          (project.estado === "Finalizado" || project.estado === "Generacion de Informe") &&
          project.tipoCoordinacion === "administrativa",
      )
    } else if (tipoCoordinador === "censo") {
      // Coordinador de Censo: Solo ve proyectos, no asigna
      proyectosEnGestion = allProjects.filter(
        (project) =>
          (project.estado === "Asignado" ||
            project.estado === "En Gestion por Analista" ||
            project.estado === "En Gestion por Brigada") &&
          project.tipoCoordinacion === "censo",
      )

      proyectosVerificados = allProjects.filter(
        (project) =>
          (project.estado === "En Revision de Verificacion" || project.estado === "Verificado") &&
          project.tipoCoordinacion === "censo",
      )

      proyectosFinalizados = allProjects.filter(
        (project) =>
          (project.estado === "Finalizado" || project.estado === "Generacion de Informe") &&
          project.tipoCoordinacion === "censo",
      )
    }

    // Cargar proyectos en las tablas correspondientes
    loadProjectsTable("tablaProyectosPorAsignar", proyectosPorAsignar, "porAsignar")
    loadProjectsTable("tablaProyectosEnGestion", proyectosEnGestion, "enGestion")
    loadProjectsTable("tablaProyectosVerificados", proyectosVerificados, "verificados")
    loadProjectsTable("tablaProyectosFinalizados", proyectosFinalizados, "finalizados")
  }

  // Función para cargar proyectos en una tabla específica
  function loadProjectsTable(tableId, projects, type) {
    const table = document.getElementById(tableId)
    if (!table) return

    if (projects.length === 0) {
      table.innerHTML = `
      <tr>
        <td colspan="9" class="text-center">No hay proyectos disponibles</td>
      </tr>
    `
      return
    }

    table.innerHTML = ""
    projects.forEach((project) => {
      const row = document.createElement("tr")

      // Determine the content of the row based on the table type
      if (type === "porAsignar") {
        row.innerHTML = `
        <td>${project.id}</td>
        <td>${project.nombre}</td>
        <td>${project.prst || project.prstNombre || "No definido"}</td>
        <td>${project.creadorNombre || "No definido"}</td>
        <td>${project.municipio || "No definido"}</td>
        <td>${project.departamento || "No definido"}</td>
        <td>${formatDateTime(project.fechaAprobacion || project.fechaCreacion)}</td>
        <td><span class="badge bg-info">Por Asignar</span></td>
        <td>
          <button class="btn btn-sm btn-primary asignar-proyecto" data-id="${project.id}">
            <i class="bi bi-person-check"></i>
          </button>
          <button class="btn btn-sm btn-info ver-proyecto" data-id="${project.id}">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-sm btn-secondary ver-historial" data-id="${project.id}">
            <i class="bi bi-clock-history"></i>
          </button>
        </td>
      `
      } else if (type === "enGestion") {
        const asignadoA = project.analistaNombre || project.brigadaNombre || "No asignado"
        row.innerHTML = `
        <td>${project.id}</td>
        <td>${project.nombre}</td>
        <td>${project.prst || project.prstNombre || "No definido"}</td>
        <td>${project.creadorNombre || "No definido"}</td>
        <td>${project.municipio || "No definido"}</td>
        <td>${project.departamento || "No definido"}</td>
        <td>${formatDateTime(project.fechaAsignacion || project.fechaCreacion)}</td>
        <td><span class="badge ${getBadgeClass(project.estado)}">${project.estado}</span></td>
        <td>
          <button class="btn btn-sm btn-info ver-proyecto" data-id="${project.id}">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-sm btn-secondary ver-historial" data-id="${project.id}">
            <i class="bi bi-clock-history"></i>
          </button>
        </td>
      `
      } else if (type === "verificados") {
        const verificadoPor = project.analistaNombre || project.brigadaNombre || "No definido"
        row.innerHTML = `
        <td>${project.id}</td>
        <td>${project.nombre}</td>
        <td>${project.prst || project.prstNombre || "No definido"}</td>
        <td>${project.creadorNombre || "No definido"}</td>
        <td>${project.municipio || "No definido"}</td>
        <td>${project.departamento || "No definido"}</td>
        <td>${formatDateTime(project.fechaVerificacion || project.fechaCreacion)}</td>
        <td><span class="badge ${getBadgeClass(project.estado)}">${project.estado}</span></td>
        <td>
            ${
              loggedUser.tipoCoordinador?.toLowerCase() === "operativo"
                ? `<button class="btn btn-sm btn-primary revisar-verificacion" data-id="${project.id}">
                <i class="bi bi-check-circle"></i> Revisar
              </button>`
                : ""
            }
            <button class="btn btn-sm btn-info ver-proyecto" data-id="${project.id}">
              <i class="bi bi-eye"></i>
            </button>
            <button class="btn btn-sm btn-secondary ver-historial" data-id="${project.id}">
              <i class="bi bi-clock-history"></i>
            </button>
          </td>
        `
      } else if (type === "finalizados") {
        row.innerHTML = `
        <td>${project.id}</td>
        <td>${project.nombre}</td>
        <td>${project.prst || project.prstNombre || "No definido"}</td>
        <td>${project.creadorNombre || "No definido"}</td>
        <td>${project.municipio || "No definido"}</td>
        <td>${project.departamento || "No definido"}</td>
        <td>${formatDateTime(project.fechaFinalizacion || project.fechaCreacion)}</td>
        <td><span class="badge ${getBadgeClass(project.estado)}">${project.estado}</span></td>
        <td>
          <button class="btn btn-sm btn-info ver-proyecto" data-id="${project.id}">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-sm btn-secondary ver-historial" data-id="${project.id}">
            <i class="bi bi-clock-history"></i>
          </button>
        </td>
      `
      }

      table.appendChild(row)
    })
  }

  // Función para cargar notificaciones
  function loadNotifications() {
    const notifications = Storage.getNotificationsByUser(loggedUser.id)
    const notificationCount = document.getElementById("notificationCount")
    const notificationsList = document.getElementById("notificationsList")

    // Contar notificaciones no leídas
    const noLeidas = notifications.filter((n) => !n.leido).length
    notificationCount.textContent = noLeidas

    // Si no hay notificaciones, mostrar mensaje
    if (notifications.length === 0) {
      notificationsList.innerHTML = `
        <div class="notification-empty">
          <i class="bi bi-bell-slash"></i>
          <p>No tienes notificaciones</p>
        </div>
      `
      return
    }

    // Ordenar notificaciones por fecha (más recientes primero)
    notifications.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))

    // Generar HTML para las notificaciones
    let html = ""
    notifications.forEach((notif) => {
      const fecha = new Date(notif.fechaCreacion)
      const fechaFormateada = fecha.toLocaleDateString() + " " + fecha.toLocaleTimeString()

      let icono = "bi-bell"
      let titulo = "Notificación"

      // Determinar icono y título según el tipo
      switch (notif.tipo) {
        case "proyecto_asignado":
          icono = "bi-folder-check"
          titulo = "Proyecto Asignado"
          break
        case "proyecto_verificado":
          icono = "bi-clipboard-check"
          titulo = "Proyecto Verificado"
          break
        case "proyecto_rechazado":
          icono = "bi-x-circle"
          titulo = "Proyecto Rechazado"
          break
        case "inicio_sesion":
          icono = "bi-box-arrow-in-right"
          titulo = "Inicio de Sesión"
          break
        default:
          icono = "bi-bell"
      }

      html += `
        <div class="notification-item ${notif.leido ? "" : "unread"}" data-id="${notif.id}">
          <div class="d-flex align-items-center">
            <div class="me-2">
              <i class="bi ${icono}"></i>
            </div>
            <div class="flex-grow-1">
              <div class="notification-title">${titulo}</div>
              <div class="notification-message">${notif.mensaje}</div>
              <div class="notification-time">${fechaFormateada}</div>
            </div>
            ${!notif.leido ? '<div class="ms-2"><span class="badge bg-primary">Nueva</span></div>' : ""}
          </div>
        </div>
      `
    })

    notificationsList.innerHTML = html

    // Añadir event listeners para marcar como leídas al hacer clic
    document.querySelectorAll(".notification-item").forEach((item) => {
      item.addEventListener("click", () => {
        const id = item.dataset.id
        Storage.markNotificationAsRead(id)
        item.classList.remove("unread")
        item.querySelector(".badge")?.remove()

        // Actualizar contador
        const noLeidasActualizadas = Storage.getUnreadNotificationsCount(loggedUser.id)
        notificationCount.textContent = noLeidasActualizadas
      })
    })
  }

  // Función para configurar los event listeners
  function setupEventListeners() {
    // Marcar todas las notificaciones como leídas
    document.getElementById("markAllAsRead").addEventListener("click", () => {
      Storage.markAllNotificationsAsRead(loggedUser.id)
      loadNotifications()
    })

    // Cerrar sesión
    document.getElementById("cerrarSesion").addEventListener("click", () => {
      Storage.logout()
      window.location.href = "login.html"
    })

    // Ver perfil
    document.getElementById("navPerfil").addEventListener("click", () => {
      document.querySelector(".tab-content").style.display = "none"
      document.getElementById("seccionPerfil").style.display = "block"
    })

    // Volver desde perfil
    document.getElementById("btnVolverDesdePerfil").addEventListener("click", () => {
      document.getElementById("seccionPerfil").style.display = "none"
      document.querySelector(".tab-content").style.display = "block"
    })

    // Cambiar contraseña
    document.getElementById("formCambiarPassword").addEventListener("submit", (e) => {
      e.preventDefault()
      cambiarPassword()
    })

    // Buscar proyectos
    document.getElementById("btnBuscarAsignar").addEventListener("click", () => {
      buscarProyectos("tablaProyectosPorAsignar", "buscarProyectoAsignar")
    })

    document.getElementById("btnBuscarGestion").addEventListener("click", () => {
      buscarProyectos("tablaProyectosEnGestion", "buscarProyectoGestion")
    })

    document.getElementById("btnBuscarVerificado").addEventListener("click", () => {
      buscarProyectos("tablaProyectosVerificados", "buscarProyectoVerificado")
    })

    document.getElementById("btnBuscarFinalizado").addEventListener("click", () => {
      buscarProyectos("tablaProyectosFinalizados", "buscarProyectoFinalizado")
    })

    // Cambiar tipo de asignación
    document.getElementById("tipoAsignacion").addEventListener("change", function () {
      const tipoSeleccionado = this.value
      if (tipoSeleccionado === "analista") {
        document.getElementById("contenedorAnalistas").style.display = "block"
        document.getElementById("contenedorBrigadas").style.display = "none"
      } else {
        document.getElementById("contenedorAnalistas").style.display = "none"
        document.getElementById("contenedorBrigadas").style.display = "block"
      }
    })

    // Asignar proyecto
    document.addEventListener("click", (e) => {
      if (e.target.closest(".asignar-proyecto")) {
        const projectId = e.target.closest(".asignar-proyecto").dataset.id
        abrirModalAsignarProyecto(projectId)
      }
    })

    // Revisar verificación
    document.addEventListener("click", (e) => {
      if (e.target.closest(".revisar-verificacion")) {
        const projectId = e.target.closest(".revisar-verificacion").dataset.id
        abrirModalRevisarVerificacion(projectId)
      }
    })

    // Ver proyecto
    document.addEventListener("click", (e) => {
      if (e.target.closest(".ver-proyecto")) {
        const projectId = e.target.closest(".ver-proyecto").dataset.id
        abrirModalDetalleProyecto(projectId)
      }
    })

    // Ver historial
    document.addEventListener("click", (e) => {
      if (e.target.closest(".ver-historial")) {
        const projectId = e.target.closest(".ver-historial").dataset.id
        abrirModalHistorialProyecto(projectId)
      }
    })

    // Botón para ver historial desde el modal de detalles
    document.getElementById("btnVerHistorial").addEventListener("click", () => {
      if (currentProject) {
        abrirModalHistorialProyecto(currentProject.id)
      }
    })

    // Confirmar asignación
    document.getElementById("btnConfirmarAsignacion").addEventListener("click", () => {
      asignarProyecto()
    })

    // Confirmar verificación
    document.getElementById("btnConfirmarVerificacion").addEventListener("click", () => {
      procesarVerificacion()
    })
  }

  // Función para abrir el modal de asignar proyecto
  function abrirModalAsignarProyecto(projectId) {
    const project = Storage.getProjectById(projectId)
    if (!project) return

    currentProject = project

    // Llenar datos del proyecto
    document.getElementById("proyectoIdAsignar").value = project.id
    document.getElementById("asignarProyectoId").textContent = project.id
    document.getElementById("asignarProyectoNombre").textContent = project.nombre
    document.getElementById("asignarProyectoPRST").textContent =
      project.prstNombre || project.creadorNombre || "No definido"
    document.getElementById("asignarProyectoMunicipio").textContent = project.municipio || "No definido"
    document.getElementById("asignarProyectoDepartamento").textContent = project.departamento || "No definido"

    // Cargar analistas disponibles
    const analistas = Storage.getUsers().filter((user) => user.rol === "analista" && user.activo)
    const selectAnalistas = document.getElementById("analistaAsignado")
    selectAnalistas.innerHTML = '<option value="">Seleccione un analista</option>'

    analistas.forEach((analista) => {
      const option = document.createElement("option")
      option.value = analista.id
      option.textContent = `${analista.nombre} ${analista.apellido || ""} - ${analista.cargo || "Analista"}`
      selectAnalistas.appendChild(option)
    })

    // Cargar brigadas disponibles
    const brigadas = Storage.getUsers().filter((user) => user.rol === "brigada" && user.activo)
    const selectBrigadas = document.getElementById("brigadaAsignada")
    selectBrigadas.innerHTML = '<option value="">Seleccione una brigada</option>'

    brigadas.forEach((brigada) => {
      const option = document.createElement("option")
      option.value = brigada.id
      option.textContent = `${brigada.nombre} - ${brigada.sector || "Sin sector"}`
      selectBrigadas.appendChild(option)
    })

    // Mostrar contenedor de analistas por defecto
    document.getElementById("contenedorAnalistas").style.display = "block"
    document.getElementById("contenedorBrigadas").style.display = "none"
    document.getElementById("tipoAsignacion").value = "analista"

    // Limpiar comentarios
    document.getElementById("comentarioAsignacion").value = ""

    // Mostrar modal
    const modalAsignarProyectoEl = document.getElementById("modalAsignarProyecto")
    const modalAsignarProyecto = new bootstrap.Modal(modalAsignarProyectoEl)
    modalAsignarProyecto.show()
  }

  // Función para asignar proyecto
  function asignarProyecto() {
    if (!currentProject) return

    const tipoAsignacion = document.getElementById("tipoAsignacion").value
    let asignadoId = null
    let asignadoNombre = ""

    if (tipoAsignacion === "analista") {
      asignadoId = document.getElementById("analistaAsignado").value
      if (!asignadoId) {
        mostrarMensaje("Error", "Debe seleccionar un analista para asignar el proyecto.")
        return
      }
      const analista = Storage.getUserById(asignadoId)
      asignadoNombre = `${analista.nombre} ${analista.apellido || ""}`
    } else {
      asignadoId = document.getElementById("brigadaAsignada").value
      if (!asignadoId) {
        mostrarMensaje("Error", "Debe seleccionar una brigada para asignar el proyecto.")
        return
      }
      const brigada = Storage.getUserById(asignadoId)
      asignadoNombre = brigada.nombre
    }

    const comentario = document.getElementById("comentarioAsignacion").value

    // Actualizar proyecto
    currentProject.estado = "Asignado"
    currentProject.fechaAsignacion = new Date().toISOString()

    if (tipoAsignacion === "analista") {
      currentProject.analistaId = asignadoId
      currentProject.analistaNombre = asignadoNombre
      currentProject.brigadaId = null
      currentProject.brigadaNombre = null
    } else {
      currentProject.brigadaId = asignadoId
      currentProject.brigadaNombre = asignadoNombre
      currentProject.analistaId = null
      currentProject.analistaNombre = null
    }

    // Agregar al historial
    if (!currentProject.historial) {
      currentProject.historial = []
    }

    currentProject.historial.push({
      estado: "Asignado",
      fecha: new Date().toISOString(),
      usuario: `${loggedUser.nombre} ${loggedUser.apellido || ""}`,
      rol: "Coordinador",
      comentario: `Proyecto asignado a ${asignadoNombre}${comentario ? `. Comentario: ${comentario}` : ""}`,
    })

    // Guardar proyecto
    Storage.saveProject(currentProject)

    // Notificar al asignado
    Storage.createNotification({
      usuarioId: asignadoId,
      tipo: "proyecto_asignado",
      mensaje: `Se te ha asignado el proyecto "${currentProject.nombre}" con ID ${currentProject.id}.`,
      fechaCreacion: new Date().toISOString(),
      leido: false,
    })

    // Cerrar modal
    const modalAsignarProyectoEl = document.getElementById("modalAsignarProyecto")
    const modalAsignarProyecto = bootstrap.Modal.getInstance(modalAsignarProyectoEl)
    modalAsignarProyecto.hide()

    // Mostrar mensaje de éxito
    mostrarMensaje("Éxito", `Proyecto asignado correctamente a ${asignadoNombre}.`)

    // Recargar proyectos
    loadProjects()
  }

  // Función para abrir el modal de revisar verificación
  function abrirModalRevisarVerificacion(projectId) {
    const project = Storage.getProjectById(projectId)
    if (!project) return

    currentProject = project

    // Llenar datos del proyecto
    document.getElementById("proyectoIdVerificar").value = project.id
    document.getElementById("verificarProyectoId").textContent = project.id
    document.getElementById("verificarProyectoNombre").textContent = project.nombre
    document.getElementById("verificarProyectoPRST").textContent =
      project.prstNombre || project.creadorNombre || "No definido"
    document.getElementById("verificarProyectoAsignado").textContent =
      project.analistaNombre || project.brigadaNombre || "No asignado"
    document.getElementById("verificarProyectoEstado").textContent = project.estado

    // Mostrar observaciones
    document.getElementById("verificarObservaciones").innerHTML =
      project.observacionesVerificacion || "No hay observaciones."

    // Cargar documentos verificados
    const tablaDocumentos = document.getElementById("tablaDocumentosVerificados")
    tablaDocumentos.innerHTML = ""

    if (project.documentosVerificados) {
      Object.entries(project.documentosVerificados).forEach(([doc, info]) => {
        const row = document.createElement("tr")
        row.innerHTML = `
          <td>${getDocumentName(doc)}</td>
          <td>
            <span class="badge ${info.aprobado ? "bg-success" : "bg-danger"}">
              ${info.aprobado ? "Aprobado" : "Rechazado"}
            </span>
          </td>
          <td>${info.observaciones || "Sin observaciones"}</td>
        `
        tablaDocumentos.appendChild(row)
      })
    } else {
      tablaDocumentos.innerHTML = `
        <tr>
          <td colspan="3" class="text-center">No hay documentos verificados</td>
        </tr>
      `
    }

    // Limpiar campos
    document.getElementById("decisionVerificacion").value = "aprobar"
    document.getElementById("comentarioVerificacion").value = ""

    // Mostrar modal
    const modalRevisarVerificacionEl = document.getElementById("modalRevisarVerificacion")
    const modalRevisarVerificacion = new bootstrap.Modal(modalRevisarVerificacionEl)
    modalRevisarVerificacion.show()
  }

  // Función para procesar verificación
  function procesarVerificacion() {
    if (!currentProject) return

    const decision = document.getElementById("decisionVerificacion").value
    const comentario = document.getElementById("comentarioVerificacion").value

    if (decision === "aprobar") {
      // Aprobar verificación
      currentProject.estado = "Verificado"
      currentProject.fechaVerificacionAprobada = new Date().toISOString()
    } else {
      // Rechazar verificación
      currentProject.estado = "Documentación Errada"
      currentProject.fechaVerificacionRechazada = new Date().toISOString()
    }

    // Agregar al historial
    if (!currentProject.historial) {
      currentProject.historial = []
    }

    currentProject.historial.push({
      estado: currentProject.estado,
      fecha: new Date().toISOString(),
      usuario: `${loggedUser.nombre} ${loggedUser.apellido || ""}`,
      rol: "Coordinador",
      comentario: `Verificación ${decision === "aprobar" ? "aprobada" : "rechazada"}${comentario ? `. Comentario: ${comentario}` : ""}`,
    })

    // Guardar comentario de coordinador
    currentProject.observacionesCoordinador = comentario

    // Guardar proyecto
    Storage.saveProject(currentProject)

    // Notificar al asignado
    const asignadoId = currentProject.analistaId || currentProject.brigadaId
    if (asignadoId) {
      Storage.createNotification({
        usuarioId: asignadoId,
        tipo: decision === "aprobar" ? "verificacion_aprobada" : "verificacion_rechazada",
        mensaje: `La verificación del proyecto "${currentProject.nombre}" ha sido ${decision === "aprobar" ? "aprobada" : "rechazada"}.`,
        fechaCreacion: new Date().toISOString(),
        leido: false,
      })
    }

    // Cerrar modal
    const modalRevisarVerificacionEl = document.getElementById("modalRevisarVerificacion")
    const modalRevisarVerificacion = bootstrap.Modal.getInstance(modalRevisarVerificacionEl)
    modalRevisarVerificacion.hide()

    // Mostrar mensaje de éxito
    mostrarMensaje("Éxito", `Verificación ${decision === "aprobar" ? "aprobada" : "rechazada"} correctamente.`)

    // Recargar proyectos
    loadProjects()
  }

  // Función para abrir el modal de detalle de proyecto
  function abrirModalDetalleProyecto(projectId) {
    const project = Storage.getProjectById(projectId)
    if (!project) return

    currentProject = project

    // Llenar datos del proyecto
    document.getElementById("detalleProyectoId").textContent = project.id
    document.getElementById("detalleProyectoNombre").textContent = project.nombre
    document.getElementById("detalleProyectoPRST").textContent =
      project.prstNombre || project.creadorNombre || "No definido"
    document.getElementById("detalleProyectoDireccionInicial").textContent = project.direccionInicial || "No definido"
    document.getElementById("detalleProyectoDireccionFinal").textContent = project.direccionFinal || "No definido"
    document.getElementById("detalleProyectoBarrios").textContent = project.barrios?.join(", ") || "No definido"
    document.getElementById("detalleProyectoMunicipio").textContent = project.municipio || "No definido"
    document.getElementById("detalleProyectoDepartamento").textContent = project.departamento || "No definido"
    document.getElementById("detalleProyectoNumeroPostes").textContent = project.numPostes || "No definido"
    document.getElementById("detalleProyectoFechaInicio").textContent = project.fechaInicio || "No definido"
    document.getElementById("detalleProyectoFechaFin").textContent = project.fechaFin || "No definido"
    document.getElementById("detalleProyectoPuntoConexion").textContent = project.puntoConexion || "No definido"
    document.getElementById("detalleProyectoEstado").textContent = project.estado
    document.getElementById("detalleProyectoAsignado").textContent =
      project.analistaNombre || project.brigadaNombre || "No asignado"
    document.getElementById("detalleProyectoFechaAsignacion").textContent = project.fechaAsignacion
      ? formatDateTime(project.fechaAsignacion)
      : "No asignado"
    document.getElementById("detalleProyectoObservaciones").textContent =
      project.observaciones || "No hay observaciones"

    // Cargar documentos
    const tablaDocumentos = document.getElementById("tablaDocumentosDetalle")
    tablaDocumentos.innerHTML = ""

    if (project.documentos) {
      const documentos = [
        { key: "kmz", name: "Archivo KMZ" },
        { key: "dwg", name: "Plano DWG" },
        { key: "plano", name: "Plano PDF" },
        { key: "matricula", name: "Matrícula Profesional" },
        { key: "cc", name: "Cédula de Ciudadanía" },
        { key: "formulario", name: "Formulario de Caracterización" },
      ]

      documentos.forEach((doc) => {
        if (project.documentos[doc.key]) {
          const row = document.createElement("tr")

          // Determinar estado del documento
          let estadoDocumento = "Pendiente"
          let badgeClass = "bg-warning"

          if (project.documentosVerificados && project.documentosVerificados[doc.key]) {
            estadoDocumento = project.documentosVerificados[doc.key].aprobado ? "Aprobado" : "Rechazado"
            badgeClass = project.documentosVerificados[doc.key].aprobado ? "bg-success" : "bg-danger"
          }

          row.innerHTML = `
            <td>${doc.name}</td>
            <td><span class="badge ${badgeClass}">${estadoDocumento}</span></td>
            <td>
              <button class="btn btn-sm btn-primary">
                <i class="bi bi-download"></i> Descargar
              </button>
            </td>
          `
          tablaDocumentos.appendChild(row)
        }
      })
    }

    if (tablaDocumentos.innerHTML === "") {
      tablaDocumentos.innerHTML = `
        <tr>
          <td colspan="3" class="text-center">No hay documentos disponibles</td>
        </tr>
      `
    }

    // Mostrar modal
    const modalDetalleProyectoEl = document.getElementById("modalDetalleProyecto")
    const modalDetalleProyecto = new bootstrap.Modal(modalDetalleProyectoEl)
    modalDetalleProyecto.show()
  }

  // Función para abrir el modal de historial de proyecto
  function abrirModalHistorialProyecto(projectId) {
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
          estado: "Asignado",
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

    // Cargar historial en la tabla
    const tablaHistorial = document.getElementById("tablaHistorialProyecto")
    tablaHistorial.innerHTML = ""

    sortedHistory.forEach((item) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${formatDateTime(item.fecha)}</td>
        <td><span class="badge ${getBadgeClass(item.estado)}">${item.estado}</span></td>
        <td>${item.usuario}</td>
        <td>${item.rol}</td>
        <td>${item.comentario}</td>
      `
      tablaHistorial.appendChild(row)
    })

    // Mostrar modal
    const modalHistorialProyectoEl = document.getElementById("modalHistorialProyecto")
    const modalHistorialProyecto = new bootstrap.Modal(modalHistorialProyectoEl)
    modalHistorialProyecto.show()
  }

  // Función para buscar proyectos
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

  // Función para cambiar contraseña
  function cambiarPassword() {
    const passwordActual = document.getElementById("passwordActual").value
    const passwordNueva = document.getElementById("passwordNueva").value
    const passwordConfirmar = document.getElementById("passwordConfirmar").value

    // Validar campos
    if (!passwordActual || !passwordNueva || !passwordConfirmar) {
      mostrarMensaje("Error", "Por favor, complete todos los campos.")
      return
    }

    // Validar que las contraseñas coincidan
    if (passwordNueva !== passwordConfirmar) {
      mostrarMensaje("Error", "Las contraseñas nuevas no coinciden.")
      return
    }

    // Validar contraseña actual
    if (passwordActual !== loggedUser.password) {
      mostrarMensaje("Error", "La contraseña actual es incorrecta.")
      return
    }

    // Actualizar contraseña
    loggedUser.password = passwordNueva
    Storage.saveUser(loggedUser)
    Storage.setLoggedUser(loggedUser)

    // Mostrar mensaje de éxito
    mostrarMensaje("Éxito", "Contraseña actualizada correctamente.")

    // Limpiar formulario
    document.getElementById("formCambiarPassword").reset()
  }

  // Función para mostrar mensajes
  function mostrarMensaje(titulo, mensaje) {
    document.getElementById("tituloModalMensaje").textContent = titulo
    document.getElementById("textoModalMensaje").textContent = mensaje

    const modalMensajeEl = document.getElementById("modalMensaje")
    const modalMensaje = new bootstrap.Modal(modalMensajeEl)
    modalMensaje.show()
  }

  // Función para formatear fecha y hora
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

  // Función para obtener clase de badge según estado
  function getBadgeClass(estado) {
    switch (estado) {
      case "Nuevo":
        return "bg-secondary"
      case "En Revision por Ejecutiva":
      case "En Revisión por Ejecutiva":
        return "bg-warning text-dark"
      case "En Asignación":
        return "bg-info text-dark"
      case "Asignado":
        return "bg-primary"
      case "En Gestion por Analista":
      case "En Gestion por Brigada":
        return "bg-primary"
      case "En Revision de Verificacion":
      case "En Revisión de Verificación":
        return "bg-info"
      case "Verificado":
        return "bg-success"
      case "Documentación Errada":
        return "bg-danger"
      case "Generacion de Informe":
      case "Generación de Informe":
        return "bg-light text-dark"
      case "Finalizado":
        return "bg-success"
      default:
        return "bg-secondary"
    }
  }

  // Función para obtener nombre del documento
  function getDocumentName(key) {
    const documentNames = {
      kmz: "Archivo KMZ",
      dwg: "Plano DWG",
      plano: "Plano PDF",
      matricula: "Matrícula Profesional",
      cc: "Cédula de Ciudadanía",
      formulario: "Formulario de Caracterización",
    }

    return documentNames[key] || key
  }
})

// Inicializar Bootstrap tooltips y popovers
document.addEventListener("DOMContentLoaded", () => {
  // Tooltips
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))

  // Popovers
  var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
  var popoverList = popoverTriggerList.map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl))
})

