// prst.js - Funcionalidades para el rol PRST
<<<<<<< HEAD
=======

// Variables globales
const currentUser = null
const projectsData = []
const municipiosPorDepartamento = {
  Atlántico: [
    "Barranquilla",
    "Baranoa",
    "Campo de la Cruz",
    "Candelaria",
    "Galapa",
    "Juan de Acosta",
    "Luruaco",
    "Malambo",
    "Manati",
    "Palmar de varela",
    "Piojo",
    "Polonuevo",
    "Ponedera",
    "Puerto Colombia",
    "Repelon",
    "Sabanagrande",
    "Sabanalarga",
    "Santa Lucia",
    "Santo Tomas",
    "Soledad",
    "Suan",
    "Tubara",
    "Usiacuri",
  ],
  "La Guajira": [
    "Riohacha",
    "Albania",
    "Barrancas",
    "Dibulla",
    "Distraccion",
    "El Molino",
    "Fonseca",
    "Hatonuevo",
    "La Jagua del Pilar",
    "Maicao",
    "Manaure",
    "San Juan del Cesar",
    "Uribia",
    "Urumita",
    "Villanueva",
  ],
  Magdalena: [
    "Santa Marta",
    "Aracataca",
    "Cerro de San Antonio",
    "Chibolo",
    "Cienaga",
    "Concordia",
    "El Piñon",
    "El Reten",
    "Fundacion",
    "Pedraza",
    "Pivijay",
    "Plato",
    "Puebloviejo",
    "Remolino",
    "Salamina",
    "Sitionuevo",
    "Tenerife",
    "Zapayan",
    "Zona Bananera",
  ],
}
>>>>>>> 20de416 (Descripción del cambio)

// Variables globales
const currentUser = null;
const projectsData = [];
const municipiosPorDepartamento = {
    "Atlántico": [
        "Barranquilla", "Baranoa", "Campo de la Cruz", "Candelaria", "Galapa", 
        "Juan de Acosta", "Luruaco", "Malambo", "Manati", "Palmar de varela", 
        "Piojo", "Polonuevo", "Ponedera", "Puerto Colombia", "Repelon", 
        "Sabanagrande", "Sabanalarga", "Santa Lucia", "Santo Tomas", 
        "Soledad", "Suan", "Tubara", "Usiacuri"
    ],
    "La Guajira": [
        "Riohacha", "Albania", "Barrancas", "Dibulla", "Distraccion", 
        "El Molino", "Fonseca", "Hatonuevo", "La Jagua del Pilar", 
        "Maicao", "Manaure", "San Juan del Cesar", "Uribia", 
        "Urumita", "Villanueva"
    ],
    "Magdalena": [
        "Santa Marta", "Aracataca", "Cerro de San Antonio", "Chibolo", 
        "Cienaga", "Concordia", "El Piñon", "El Reten", "Fundacion", 
        "Pedraza", "Pivijay", "Plato", "Puebloviejo", "Remolino", 
        "Salamina", "Sitionuevo", "Tenerife", "Zapayan", "Zona Bananera"
    ]
};

document.addEventListener("DOMContentLoaded", () => {
    // Verificar si el usuario está logueado y tiene el rol correcto
    const loggedUser = Storage.getLoggedUser();
    if (!loggedUser || loggedUser.rol !== "prst") {
        window.location.href = "login.html";
        return;
    }

    // Inicializar componentes
    initializeComponents();

    // Cargar datos iniciales
    loadUserData();
    loadProjects();
    loadNotifications();

    // Manejar eventos
    setupEventListeners();
});

// Inicializar componentes de la interfaz
function initializeComponents() {
    // Inicializar tooltips de Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

    // Inicializar popovers de Bootstrap
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl));

<<<<<<< HEAD
    // Inicializar selectores de fecha
    const dateInputs = document.querySelectorAll(".datepicker");
    dateInputs.forEach((input) => {
        input.type = "date";
    });
=======
  // Inicializar selectores de fecha
  const dateInputs = document.querySelectorAll(".datepicker")
  dateInputs.forEach((input) => {
    input.type = "date"
  })
>>>>>>> 20de416 (Descripción del cambio)
}

// Cargar datos del usuario logueado
function loadUserData() {
    const loggedUser = Storage.getLoggedUser();

    // Mostrar nombre del usuario en la barra de navegación
    const userNameElement = document.getElementById("user-name");
    if (userNameElement) {
        userNameElement.textContent = `${loggedUser.nombre} ${loggedUser.apellido || ""}`;
    }

    // Mostrar datos del usuario en la sección de perfil
    document.getElementById("profile-name").textContent = `${loggedUser.nombre} ${loggedUser.apellido || ""}`;
    document.getElementById("profile-email").textContent = loggedUser.correo || "";
    document.getElementById("profile-role").textContent = "PRST";
    document.getElementById("profile-prst-name").textContent = loggedUser.nombrePRST || "No especificado";
    document.getElementById("profile-id").textContent = loggedUser.cedula || "No especificado";
    document.getElementById("profile-mp").textContent = loggedUser.matriculaProfesional || "No especificado";
    document.getElementById("profile-address").textContent = loggedUser.direccion || "No especificado";
    document.getElementById("profile-neighborhood").textContent = loggedUser.barrio || "No especificado";
    document.getElementById("profile-city").textContent = loggedUser.ciudad || "No especificado";
    document.getElementById("profile-phone").textContent = loggedUser.celular || "No especificado";
}

// Update the loadProjects function to show the correct states for PRST role
function loadProjects() {
    const loggedUser = Storage.getLoggedUser();
    const projects = Storage.getProjects().filter((project) => project.creadorId === loggedUser.id);

<<<<<<< HEAD
    const projectsTableBody = document.getElementById("projects-table-body");
    if (projectsTableBody) {
        if (projects.length === 0) {
            projectsTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center">No hay proyectos creados. Crea tu primer proyecto haciendo clic en "Nuevo Proyecto".</td>
                </tr>
            `;
        } else {
            projectsTableBody.innerHTML = "";

            projects.forEach((project) => {
                // Determinar clase según el estado
                let statusClass = "";
                switch (project.estado) {
                    case "Documentación Errada":
                        statusClass = "table-danger";
                        break;
                    case "En Revisión por Ejecutiva":
                        statusClass = "table-warning";
                        break;
                    case "En Asignación":
                    case "Asignado":
                        statusClass = "table-info";
                        break;
                    case "En Revisión de Verificación":
                        statusClass = "table-primary";
                        break;
                    case "Opción Mejorar":
                        statusClass = "table-secondary";
                        break;
                    case "Generación de Informe":
                        statusClass = "table-light";
                        break;
                    case "Finalizado":
                        statusClass = "table-success";
                        break;
                    default:
                        statusClass = "";
                }

                // Determinar acciones disponibles según el estado
                let actions = `
                    <button class="btn btn-sm btn-info view-project" data-id="${project.id}" title="Ver Detalles">
                        <i class="fas fa-eye"></i>
                    </button>
                `;

                if (project.estado === "Nuevo" || project.estado === "Documentación Errada") {
                    actions += `
                        <button class="btn btn-sm btn-primary edit-project" data-id="${project.id}" title="Editar">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-success send-project" data-id="${project.id}" title="Enviar a Revisión">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    `;
                }

                const row = document.createElement("tr");
                row.className = statusClass;
                row.innerHTML = `
                    <td>${project.id}</td>
                    <td>${project.nombre}</td>
                    <td>${project.municipio}, ${project.departamento}</td>
                    <td>${new Date(project.fechaCreacion).toLocaleDateString()}</td>
                    <td>
                        <span class="badge ${getBadgeClass(project.estado)}">${project.estado}</span>
                    </td>
                    <td>${actions}</td>
                `;

                projectsTableBody.appendChild(row);
            });
        }
    }
=======
  const projectsTableBody = document.getElementById("projects-table-body")
  if (projectsTableBody) {
    if (projects.length === 0) {
      projectsTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center">No hay proyectos creados. Crea tu primer proyecto haciendo clic en "Nuevo Proyecto".</td>
        </tr>
      `
    } else {
      projectsTableBody.innerHTML = ""

      projects.forEach((project) => {
        // Map the state to a simplified version for PRST view
        let displayState = project.estado

        // Group states for PRST view
        if (
          [
            "En Asignación",
            "En Gestion por Analista",
            "En Gestion por Brigada",
            "En Revision de Verificacion",
            "Generacion de Informe",
          ].includes(project.estado)
        ) {
          displayState = "En Gestión"
        } else if (project.estado === "Documentación Errada") {
          displayState = "Opcion Mejorar"
        }

        // Determine class based on the state
        let statusClass = ""
        switch (displayState) {
          case "Opcion Mejorar":
            statusClass = "table-danger"
            break
          case "En Revisión por Ejecutiva":
            statusClass = "table-warning"
            break
          case "En Gestión":
            statusClass = "table-info"
            break
          case "Finalizado":
            statusClass = "table-success"
            break
          default:
            statusClass = ""
        }

        // Determine available actions based on the state
        let actions = `
          <button class="btn btn-sm btn-info view-project" data-id="${project.id}" title="Ver Detalles">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-sm btn-info ver-historial" data-id="${project.id}" title="Ver Historial">
            <i class="fas fa-clock"></i>
          </button>
        `

        if (project.estado === "Nuevo" || displayState === "Opcion Mejorar") {
          actions += `
            <button class="btn btn-sm btn-primary edit-project" data-id="${project.id}" title="Editar">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-success send-project" data-id="${project.id}" title="Enviar a Revisión">
              <i class="fas fa-paper-plane"></i>
            </button>
          `
        }

        const row = document.createElement("tr")
        row.className = statusClass
        row.innerHTML = `
          <td>${project.id}</td>
          <td>${project.nombre}</td>
          <td>${project.municipio}, ${project.departamento}</td>
          <td>${new Date(project.fechaCreacion).toLocaleDateString()}</td>
          <td>
            <span class="badge ${getBadgeClass(displayState)}">${displayState}</span>
          </td>
          <td>${actions}</td>
        `

        projectsTableBody.appendChild(row)
      })
    }
  }
}

// Configurar listeners de eventos
function setupEventListeners() {
  // Cerrar sesión
  const logoutButton = document.getElementById("logout-button")
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      Storage.logout()
      window.location.href = "login.html"
    })
  }

  // Mostrar perfil
  const profileButton = document.getElementById("profile-button")
  if (profileButton) {
    profileButton.addEventListener("click", () => {
      showView("profile-view")
    })
  }

  // Volver al panel principal desde perfil
  const backToMainButtonProfile = document.getElementById("back-to-main-button-profile")
  if (backToMainButtonProfile) {
    backToMainButtonProfile.addEventListener("click", () => {
      showView("main-view")
    })
  }

  // Volver al panel principal desde perfil (segundo botón)
  const backToMainButton2 = document.getElementById("back-to-main-button-2")
  if (backToMainButton2) {
    backToMainButton2.addEventListener("click", () => {
      showView("main-view")
    })
  }

  // Mostrar modal de nuevo proyecto
  const newProjectButton = document.getElementById("new-project-button")
  if (newProjectButton) {
    newProjectButton.addEventListener("click", () => {
      // Limpiar formulario
      document.getElementById("project-form").reset()
      document.getElementById("project-id").value = ""
      document.getElementById("project-form-title").textContent = "Nuevo Proyecto"
      document.getElementById("neighborhoods-list").innerHTML = ""
      document.getElementById("ejecutiva-observations-alert").classList.add("d-none")

      // Mostrar vista de formulario
      showView("project-form-view")
    })
  }

  // Volver al panel principal desde formulario
  const backToMainButton = document.getElementById("back-to-main-button")
  if (backToMainButton) {
    backToMainButton.addEventListener("click", () => {
      showView("main-view")
    })
  }

  // Cancelar creación/edición de proyecto
  const cancelProjectButton = document.getElementById("cancel-project-button")
  if (cancelProjectButton) {
    cancelProjectButton.addEventListener("click", () => {
      showView("main-view")
    })
  }

  // Agregar barrio
  const addNeighborhoodButton = document.getElementById("add-neighborhood-button")
  if (addNeighborhoodButton) {
    addNeighborhoodButton.addEventListener("click", () => {
      const neighborhoodInput = document.getElementById("project-neighborhood")
      const neighborhood = neighborhoodInput.value.trim()

      if (neighborhood) {
        addNeighborhood(neighborhood)
        neighborhoodInput.value = ""
        neighborhoodInput.focus()
      }
    })
  }

  // Guardar proyecto
  const projectForm = document.getElementById("project-form")
  if (projectForm) {
    projectForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Validar que todos los campos obligatorios estén completos
      const requiredFields = [
        "project-name",
        "project-address-start",
        "project-address-end",
        "project-department",
        "project-municipality",
        "project-posts",
        "project-start-date",
        "project-end-date",
        "project-connection",
      ]

      let isValid = true
      requiredFields.forEach((fieldId) => {
        const field = document.getElementById(fieldId)
        if (!field.value) {
          field.classList.add("is-invalid")
          isValid = false
        } else {
          field.classList.remove("is-invalid")
        }
      })

      if (!isValid) {
        alert("Por favor, completa todos los campos obligatorios marcados con *")
        return
      }

      saveProject()
    })
  }

  // Manejar cambio de departamento para actualizar municipios
  document.getElementById("project-department").addEventListener("change", () => {
    updateMunicipalityOptions()
  })

  // Cambiar contraseña
  const changePasswordButton = document.getElementById("change-password-button")
  if (changePasswordButton) {
    changePasswordButton.addEventListener("click", () => {
      const changePasswordModal = new bootstrap.Modal(document.getElementById("change-password-modal"))
      changePasswordModal.show()
    })
  }

  // Guardar nueva contraseña
  const changePasswordForm = document.getElementById("change-password-form")
  if (changePasswordForm) {
    changePasswordForm.addEventListener("submit", (e) => {
      e.preventDefault()
      changePassword()
    })
  }

  // Notificaciones
  const notificationsButton = document.getElementById("notifications-button")
  if (notificationsButton) {
    notificationsButton.addEventListener("click", () => {
      // Marcar notificaciones como leídas cuando se abren
      const notificationItems = document.querySelectorAll(".notification-item.unread")
      notificationItems.forEach((item) => {
        const notificationId = item.dataset.id
        if (notificationId) {
          markNotificationAsRead(notificationId)
        }
      })
    })
  }

  // Ver todas las notificaciones
  document.addEventListener("click", (e) => {
    if (e.target.id === "viewAllNotifications" || e.target.closest("#viewAllNotifications")) {
      const notificationsModal = new bootstrap.Modal(document.getElementById("notifications-modal"))
      notificationsModal.show()
      loadAllNotifications()
    }
  })

  // Marcar todas las notificaciones como leídas
  const markAllReadButton = document.getElementById("mark-all-read")
  if (markAllReadButton) {
    markAllReadButton.addEventListener("click", () => {
      const loggedUser = Storage.getLoggedUser()
      Storage.markAllNotificationsAsRead(loggedUser.id)
      loadNotifications()
      loadAllNotifications()
    })
  }

  // Ver detalles de proyecto
  document.addEventListener("click", (e) => {
    if (e.target.closest(".view-project")) {
      const projectId = e.target.closest(".view-project").dataset.id
      viewProject(projectId)
    }
  })

  // Editar proyecto
  document.addEventListener("click", (e) => {
    if (e.target.closest(".edit-project")) {
      const projectId = e.target.closest(".edit-project").dataset.id
      editProject(projectId)
    }
  })

  // Enviar proyecto a revisión
  document.addEventListener("click", (e) => {
    if (e.target.closest(".send-project")) {
      const projectId = e.target.closest(".send-project").dataset.id
      sendProject(projectId)
    }
  })

  // Ver historial del proyecto
  document.addEventListener("click", (e) => {
    if (e.target.closest(".ver-historial")) {
      const projectId = e.target.closest(".ver-historial").dataset.id
      showProjectHistory(projectId)
    }
  })

  // Dentro de la función setupEventListeners(), después de la inicialización del resto de eventos
  // Añadir validación de fechas al cambiar el valor de la fecha de inicio o fin o cantidad de postes
  const startDateInput = document.getElementById("project-start-date")
  const endDateInput = document.getElementById("project-end-date")
  const postsInput = document.getElementById("project-posts")

  if (startDateInput && endDateInput && postsInput) {
    // Validar al cambiar la fecha de inicio
    startDateInput.addEventListener("change", validateDates)

    // Validar al cambiar la fecha de fin
    endDateInput.addEventListener("change", validateDates)

    // Validar cuando cambia la cantidad de postes
    postsInput.addEventListener("input", validateDates)
  }
}

// Modify the validateDates function to implement the new date validation rules
function validateDates() {
  const startDateInput = document.getElementById("project-start-date")
  const endDateInput = document.getElementById("project-end-date")
  const postsInput = document.getElementById("project-posts")

  const startDate = new Date(startDateInput.value)
  const endDate = new Date(endDateInput.value)
  const postsCount = Number.parseInt(postsInput.value, 10) || 0

  // Get current date and add 5 days
  const today = new Date()
  const minStartDate = new Date(today)
  minStartDate.setDate(today.getDate() + 5)

  // Validate that the start date is at least 5 days from today
  if (startDate < minStartDate) {
    alert("La fecha de inicio debe ser al menos 5 días después de la fecha actual")
    document.getElementById("project-start-date").value = ""
    return
  }

  // Validate that the end date is not before the start date
  if (endDate < startDate) {
    alert("La fecha de finalización no puede ser anterior a la fecha de inicio")
    document.getElementById("project-end-date").value = ""
    return
  }

  // Calculate the maximum allowed end date based on the start date
  const maxEndDate = new Date(startDate)
  const maxDuration = postsCount <= 50 ? 30 : 45
  maxEndDate.setDate(startDate.getDate() + maxDuration - 1) // -1 because we count the start day

  // Validate that the construction period doesn't exceed the maximum allowed duration
  if (endDate > maxEndDate) {
    alert(
      `Para ${postsCount} postes, la duración máxima permitida es de ${maxDuration} días. La fecha de finalización no puede ser posterior a ${maxEndDate.toLocaleDateString()}.`,
    )
    document.getElementById("project-end-date").value = ""
    return
  }

  // Validate that the time between request date (today) and construction start date doesn't exceed 30 days
  const maxRequestToStartDays = 30
  const maxStartDate = new Date(today)
  maxStartDate.setDate(today.getDate() + maxRequestToStartDays)

  if (startDate > maxStartDate) {
    alert(
      `La fecha de inicio no puede ser más de ${maxRequestToStartDays} días después de la fecha de solicitud (hoy).`,
    )
    document.getElementById("project-start-date").value = ""
    return
  }
}

// Función para actualizar las opciones de municipio según el departamento seleccionado
function updateMunicipalityOptions() {
  const departmentSelect = document.getElementById("project-department")
  const municipalitySelect = document.getElementById("project-municipality")
  const department = departmentSelect.value

  municipalitySelect.innerHTML = '<option value="">Seleccione un municipio</option>'

  if (department && municipiosPorDepartamento[department]) {
    municipiosPorDepartamento[department].forEach((municipio) => {
      const option = document.createElement("option")
      option.value = municipio
      option.textContent = municipio
      municipalitySelect.appendChild(option)
    })
  }
}

// Obtener clase para el badge según el estado
function getBadgeClass(estado) {
  switch (estado) {
    case "Nuevo":
      return "bg-secondary"
    case "En Revisión por Ejecutiva":
      return "bg-warning text-dark"
    case "En Asignación":
      return "bg-info text-dark"
    case "Asignado":
      return "bg-primary"
    case "En Revisión de Verificación":
      return "bg-info"
    case "Opción Mejorar":
      return "bg-warning"
    case "Generación de Informe":
      return "bg-light text-dark"
    case "Finalizado":
      return "bg-success"
    case "Documentación Errada":
      return "bg-danger"
    default:
      return "bg-secondary"
  }
}

// Mostrar vista específica
function showView(viewId) {
  // Ocultar todas las vistas
  const views = document.querySelectorAll(".view")
  views.forEach((view) => {
    view.classList.add("d-none")
  })

  // Mostrar la vista seleccionada
  const selectedView = document.getElementById(viewId)
  if (selectedView) {
    selectedView.classList.remove("d-none")
  }
}

// Agregar barrio a la lista
function addNeighborhood(neighborhood) {
  const neighborhoodsList = document.getElementById("neighborhoods-list")

  // Crear elemento de barrio
  const neighborhoodItem = document.createElement("div")
  neighborhoodItem.className = "neighborhood-item"
  neighborhoodItem.innerHTML = `
        <span>${neighborhood}</span>
        <button type="button" class="btn btn-sm btn-danger remove-neighborhood">
            <i class="fas fa-times"></i>
        </button>
    `

  // Agregar evento para eliminar barrio
  const removeButton = neighborhoodItem.querySelector(".remove-neighborhood")
  removeButton.addEventListener("click", () => {
    neighborhoodItem.remove()
  })

  // Agregar a la lista
  neighborhoodsList.appendChild(neighborhoodItem)
}

// Update the saveProject function to modify the ID generation logic
function saveProject() {
  // Obtain form data
  const projectId = document.getElementById("project-id").value
  const nombre = document.getElementById("project-name").value
  const direccionInicial = document.getElementById("project-address-start").value
  const direccionFinal = document.getElementById("project-address-end").value
  const municipio = document.getElementById("project-municipality").value
  const departamento = document.getElementById("project-department").value
  const numPostes = document.getElementById("project-posts").value
  const fechaInicio = document.getElementById("project-start-date").value
  const fechaFin = document.getElementById("project-end-date").value
  const puntoConexion = document.getElementById("project-connection").value
  const observaciones = document.getElementById("project-observations").value

  try {
    // Get neighborhoods
    const neighborhoodItems = document.querySelectorAll("#neighborhoods-list .neighborhood-item")
    const barrios = Array.from(neighborhoodItems).map((item) => item.querySelector("span").textContent)

    // Get files (optional)
    const kmzFile = document.getElementById("project-kmz").files[0]
    const dwgFile = document.getElementById("project-dwg").files[0]
    const matriculaFile = document.getElementById("project-matricula").files[0]
    const ccFile = document.getElementById("project-cc").files[0]
    const formularioFile = document.getElementById("project-formulario").files[0]

    // Create project object
    const loggedUser = Storage.getLoggedUser()

    // Get PRST name from logged user
    const prstName = loggedUser.nombrePRST || loggedUser.nombre

    const project = {
      nombre,
      direccionInicial,
      direccionFinal,
      barrios,
      municipio,
      departamento,
      numPostes: Number.parseInt(numPostes),
      fechaInicio,
      fechaFin,
      puntoConexion,
      observaciones,
      creadorId: loggedUser.id,
      creadorNombre: `${loggedUser.nombre} ${loggedUser.apellido || ""}`,
      prst: prstName, // Add PRST name explicitly
      prstNombre: prstName, // Add PRST name explicitly
      estado: "Nuevo",
      documentos: {},
      fechaCreacion: new Date().toISOString(), // Ensure creation date is set
    }

    // Handle files
    project.documentos = {
      kmz: kmzFile ? { nombre: kmzFile.name, tipo: kmzFile.type, tamaño: kmzFile.size } : null,
      dwg: dwgFile ? { nombre: dwgFile.name, tipo: dwgFile.type, tamaño: dwgFile.size } : null,
      matricula: matriculaFile ? { nombre: matriculaFile.name, tipo: matriculaFile.size } : null,
      cc: ccFile ? { nombre: ccFile.name, tipo: ccFile.type, tamaño: ccFile.size } : null,
      formulario: formularioFile
        ? { nombre: formularioFile.name, tipo: formularioFile.type, tamaño: formularioFile.size }
        : null,
    }

    // If editing, keep existing ID
    if (projectId) {
      project.id = projectId
    } else {
      // Generate new ID in the format: "PRST_NAME"_MONTH_YEAR.SEQUENCE
      const now = new Date()
      const month = now.toLocaleString("default", { month: "short" }).toUpperCase()
      const year = now.getFullYear()

      // Get all projects for this PRST in the current month/year
      const allProjects = Storage.getProjects()
      const prstProjects = allProjects.filter(
        (p) => p.prst === prstName && p.id && p.id.includes(`${prstName}_${month}_${year}`),
      )

      // Find the next sequence number, starting from 1001
      let sequence = 1001
      if (prstProjects.length > 0) {
        const sequences = prstProjects
          .map((p) => {
            const parts = p.id.split(".")
            return parts.length > 1 ? Number.parseInt(parts[1]) : 0
          })
          .filter((seq) => !isNaN(seq))

        if (sequences.length > 0) {
          sequence = Math.max(...sequences) + 1
        }
      }

      // Create the new ID
      project.id = `${prstName}_${month}_${year}.${sequence}`
    }

    // Save project
    const savedProject = Storage.saveProject(project)

    // Show success message
    alert(`Proyecto ${projectId ? "actualizado" : "creado"} correctamente con N° de Radicado: ${savedProject.id}`)

    // Reload data and return to main view
    loadProjects()
    showView("main-view")
  } catch (error) {
    console.error("Error al guardar el proyecto:", error)
    alert(`Error al guardar el proyecto: ${error.message}`)
  }
}

// Editar proyecto
function editProject(projectId) {
  const project = Storage.getProjectById(projectId)
  if (!project) {
    alert("No se encontró el proyecto a editar")
    return
  }

  // Llenar formulario con datos del proyecto
  document.getElementById("project-id").value = project.id
  document.getElementById("project-name").value = project.nombre
  document.getElementById("project-address-start").value = project.direccionInicial
  document.getElementById("project-address-end").value = project.direccionFinal
  document.getElementById("project-posts").value = project.numPostes
  document.getElementById("project-start-date").value = project.fechaInicio
  document.getElementById("project-end-date").value = project.fechaFin
  document.getElementById("project-connection").value = project.puntoConexion
  document.getElementById("project-observations").value = project.observaciones || ""

  // Manejar departamento y municipio
  const departmentSelect = document.getElementById("project-department")
  departmentSelect.value = project.departamento

  // Disparar evento change para cargar municipios
  const event = new Event("change")
  departmentSelect.dispatchEvent(event)

  // Esperar un breve momento para que se carguen los municipios
  setTimeout(() => {
    document.getElementById("project-municipality").value = project.municipio
  }, 100)

  // Limpiar y cargar barrios
  const neighborhoodsList = document.getElementById("neighborhoods-list")
  neighborhoodsList.innerHTML = ""
  if (project.barrios && project.barrios.length > 0) {
    project.barrios.forEach((barrio) => addNeighborhood(barrio))
  }

  // Mostrar observaciones de ejecutiva si existen
  const ejecutivaObservationsAlert = document.getElementById("ejecutiva-observations-alert")
  if (project.observacionesEjecutiva) {
    ejecutivaObservationsAlert.textContent = project.observacionesEjecutiva
    ejecutivaObservationsAlert.classList.remove("d-none")
  } else {
    ejecutivaObservationsAlert.classList.add("d-none")
  }

  // Actualizar título del formulario
  document.getElementById("project-form-title").textContent = "Editar Proyecto"

  // Mostrar vista de formulario
  showView("project-form-view")
}

// Ver detalles de proyecto
function viewProject(projectId) {
  const project = Storage.getProjectById(projectId)
  if (!project) return

  // Llenar datos en el modal
  document.getElementById("detail-project-id").textContent = project.id
  document.getElementById("detail-project-name").textContent = project.nombre
  document.getElementById("detail-project-creator").textContent = project.creadorNombre
  document.getElementById("detail-project-status").textContent = project.estado
  document.getElementById("detail-project-creation-date").textContent = new Date(
    project.fechaCreacion,
  ).toLocaleDateString()
  document.getElementById("detail-project-start-date").textContent = project.fechaInicio
  document.getElementById("detail-project-end-date").textContent = project.fechaFin
  document.getElementById("detail-project-address-start").textContent = project.direccionInicial
  document.getElementById("detail-project-address-end").textContent = project.direccionFinal
  document.getElementById("detail-project-neighborhoods").textContent = project.barrios.join(", ") || "No especificado"
  document.getElementById("detail-project-municipality").textContent = project.municipio
  document.getElementById("detail-project-department").textContent = project.departamento
  document.getElementById("detail-project-posts").textContent = project.numPostes
  document.getElementById("detail-project-connection").textContent = project.puntoConexion
  document.getElementById("detail-project-observations").textContent = project.observaciones || "No hay observaciones"

  // Enlaces a documentos
  if (project.documentos.kmz) {
    document.getElementById("detail-kmz-link").href = "#"
    document.getElementById("detail-kmz-link").onclick = () =>
      alert("Descargando archivo KMZ: " + project.documentos.kmz.nombre)
  }

  if (project.documentos.dwg) {
    document.getElementById("detail-dwg-link").href = "#"
    document.getElementById("detail-dwg-link").onclick = () =>
      alert("Descargando archivo DWG: " + project.documentos.dwg.nombre)
  }

  if (project.documentos.matricula) {
    document.getElementById("detail-matricula-link").href = "#"
    document.getElementById("detail-matricula-link").onclick = () =>
      alert("Descargando archivo PDF: " + project.documentos.matricula.nombre)
  }

  if (project.documentos.cc) {
    document.getElementById("detail-cc-link").href = "#"
    document.getElementById("detail-cc-link").onclick = () =>
      alert("Descargando archivo PDF: " + project.documentos.cc.nombre)
  }

  if (project.documentos.formulario) {
    document.getElementById("detail-formulario-link").href = "#"
    document.getElementById("detail-formulario-link").onclick = () =>
      alert("Descargando archivo Excel: " + project.documentos.formulario.nombre)
  }

  // Mostrar observaciones si existen
  const ejecutivaObsContainer = document.getElementById("detail-ejecutiva-observations-container")
  if (project.observacionesEjecutiva) {
    document.getElementById("detail-ejecutiva-observations").textContent = project.observacionesEjecutiva
    ejecutivaObsContainer.classList.remove("d-none")
  } else {
    ejecutivaObsContainer.classList.add("d-none")
  }

  const analistaObsContainer = document.getElementById("detail-analista-observations-container")
  if (project.observacionesAnalista) {
    document.getElementById("detail-analista-observations").textContent = project.observacionesAnalista
    analistaObsContainer.classList.remove("d-none")
  } else {
    analistaObsContainer.classList.add("d-none")
  }

  // Mostrar modal
  const projectDetailModal = new bootstrap.Modal(document.getElementById("project-detail-modal"))
  projectDetailModal.show()
}

// Enviar proyecto a revisión
function sendProject(projectId) {
  const project = Storage.getProjectById(projectId)
  if (!project) return

  // Confirmar acción
  if (
    !confirm(
      "¿Estás seguro de enviar este proyecto a revisión? Una vez enviado, no podrás editarlo hasta que sea revisado.",
    )
  ) {
    return
  }

  // Actualizar estado del proyecto
  project.estado = "En Revisión por Ejecutiva"
  project.fechaEnvio = new Date().toISOString()

  // Asignar a un usuario ejecutivo
  const ejecutivas = Storage.getUsers().filter((user) => user.rol === "ejecutiva" && user.activo)

  if (ejecutivas.length > 0) {
    // Asignar a una ejecutiva aleatoria (en un sistema real podría ser por carga de trabajo)
    const ejecutivaAsignada = ejecutivas[Math.floor(Math.random() * ejecutivas.length)]
    project.ejecutivaId = ejecutivaAsignada.id
    project.ejecutivaNombre = `${ejecutivaAsignada.nombre} ${ejecutivaAsignada.apellido || ""}`

    // Guardar proyecto
    Storage.saveProject(project)

    // Crear notificación para el usuario PRST
    const loggedUser = Storage.getLoggedUser()
    Storage.createNotification({
      usuarioId: loggedUser.id,
      tipo: "proyecto_enviado",
      mensaje: `Has enviado el proyecto "${project.nombre}" con ID ${project.id} a revisión. Ha sido asignado a ${project.ejecutivaNombre}.`,
      fechaCreacion: new Date().toISOString(),
      leido: false,
    })

    // Crear notificación para la ejecutiva asignada
    Storage.createNotification({
      usuarioId: ejecutivaAsignada.id,
      tipo: "proyecto_asignado",
      mensaje: `Se te ha asignado un nuevo proyecto para revisar: "${project.nombre}" con ID ${project.id}.`,
      fechaCreacion: new Date().toISOString(),
      leido: false,
    })

    // Recargar proyectos y notificaciones
    loadProjects()
    loadNotifications()

    // Mostrar mensaje de éxito
    alert(`Proyecto enviado a revisión correctamente. Ha sido asignado a ${project.ejecutivaNombre}.`)
  } else {
    alert("No hay usuarios ejecutivos disponibles para asignar el proyecto. Por favor, contacte al administrador.")
  }
}

// Cargar notificaciones del usuario
function loadNotifications() {
  const loggedUser = Storage.getLoggedUser()
  const notifications = Storage.getNotificationsByUser(loggedUser.id)

  // Actualizar contador de notificaciones
  const notificationCount = notifications.filter((n) => !n.leido).length
  const notificationBadge = document.getElementById("notification-badge")
  if (notificationBadge) {
    notificationBadge.textContent = notificationCount
    notificationBadge.classList.toggle("d-none", notificationCount === 0)
  }

  // Actualizar lista de notificaciones en el dropdown
  const notificationsList = document.getElementById("notifications-list")
  if (notificationsList) {
    if (notifications.length === 0) {
      notificationsList.innerHTML = `
                <div class="dropdown-item text-center">No tienes notificaciones</div>
            `
    } else {
      notificationsList.innerHTML = ""

      // Mostrar las 5 notificaciones más recientes
      const recentNotifications = notifications
        .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
        .slice(0, 5)

      recentNotifications.forEach((notification) => {
        const item = document.createElement("div")
        item.className = `dropdown-item notification-item ${notification.leido ? "" : "unread"}`
        item.dataset.id = notification.id

        item.innerHTML = `
                    <div class="d-flex align-items-center">
                        <div class="notification-icon me-3">
                            <i class="fas ${getNotificationIcon(notification.tipo)} text-primary"></i>
                        </div>
                        <div class="notification-content flex-grow-1">
                            <div class="notification-text">${notification.mensaje}</div>
                            <div class="notification-time text-muted small">${formatDate(notification.fechaCreacion)}</div>
                        </div>
                        ${notification.leido ? "" : '<div class="notification-badge"></div>'}
                    </div>
                `

        notificationsList.appendChild(item)
      })

      // Agregar enlace para ver todas las notificaciones
      const viewAllLink = document.createElement("div")
      viewAllLink.className = "dropdown-item text-center text-primary"

      viewAllLink.textContent = "Ver todas las notificaciones"
      viewAllLink.id = "viewAllNotifications"
      viewAllLink.style.cursor = "pointer"
      notificationsList.appendChild(viewAllLink)
    }
  }
}

// Obtener icono según el tipo de notificación
function getNotificationIcon(tipo) {
  switch (tipo) {
    case "proyecto_creado":
      return "fa-plus-circle"
    case "proyecto_actualizado":
      return "fa-edit"
    case "proyecto_enviado":
      return "fa-paper-plane"
    case "proyecto_revisado":
      return "fa-check-circle"
    case "proyecto_rechazado":
      return "fa-times-circle"
    case "proyecto_asignado":
      return "fa-user-check"
    case "proyecto_finalizado":
      return "fa-flag-checkered"
    default:
      return "fa-bell"
  }
}

// Formatear fecha para mostrar en notificaciones
function formatDate(dateString, includeTime = false) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (!includeTime) {
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
  } else {
    return date.toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }
}

// Marcar notificación como leída
function markNotificationAsRead(notificationId) {
  Storage.markNotificationAsRead(notificationId)
  loadNotifications()
}

// Cargar todas las notificaciones en el modal
function loadAllNotifications() {
  const loggedUser = Storage.getLoggedUser()
  const notifications = Storage.getNotificationsByUser(loggedUser.id)

  const notificationsModalBody = document.getElementById("notifications-modal-body")
  if (notificationsModalBody) {
    if (notifications.length === 0) {
      notificationsModalBody.innerHTML = `
                <p class="text-center">No tienes notificaciones</p>
            `
    } else {
      notificationsModalBody.innerHTML = ""

      // Ordenar notificaciones por fecha (más recientes primero)
      const sortedNotifications = notifications.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))

      sortedNotifications.forEach((notification) => {
        const item = document.createElement("div")
        item.className = `notification-item ${notification.leido ? "" : "unread"}`
        item.dataset.id = notification.id

        item.innerHTML = `
                    <div class="d-flex align-items-center mb-3 p-2 border-bottom">
                        <div class="notification-icon me-3">
                            <i class="fas ${getNotificationIcon(notification.tipo)} text-primary"></i>
                        </div>
                        <div class="notification-content flex-grow-1">
                            <div class="notification-text">${notification.mensaje}</div>
                            <div class="notification-time text-muted small">${formatDate(notification.fechaCreacion)}</div>
                        </div>
                        ${notification.leido ? "" : '<div class="notification-badge"></div>'}
                    </div>
                `

        notificationsModalBody.appendChild(item)
      })
    }
  }
}

// Cambiar contraseña
function changePassword() {
  const currentPassword = document.getElementById("current-password").value
  const newPassword = document.getElementById("new-password").value
  const confirmPassword = document.getElementById("confirm-password").value

  // Validar campos
  if (!currentPassword || !newPassword || !confirmPassword) {
    alert("Por favor, completa todos los campos")
    return
  }

  // Validar que las contraseñas coincidan
  if (newPassword !== confirmPassword) {
    alert("Las contraseñas no coinciden")
    return
  }

  // Validar contraseña actual
  const loggedUser = Storage.getLoggedUser()
  if (currentPassword !== loggedUser.password) {
    alert("La contraseña actual es incorrecta")
    return
  }

  // Actualizar contraseña
  loggedUser.password = newPassword
  Storage.saveUser(loggedUser)
  Storage.setLoggedUser(loggedUser)

  // Cerrar modal
  const passwordModal = bootstrap.Modal.getInstance(document.getElementById("change-password-modal"))
  if (passwordModal) {
    passwordModal.hide()
  }

  // Mostrar mensaje de éxito
  alert("Contraseña cambiada correctamente")
}

// Add the showProjectHistory function
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
                      <td>${formatDate(item.fecha, true)}</td>
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
>>>>>>> 20de416 (Descripción del cambio)
}

// Configurar listeners de eventos
function setupEventListeners() {
    // Cerrar sesión
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            Storage.logout();
            window.location.href = "login.html";
        });
    }

    // Mostrar perfil
    const profileButton = document.getElementById("profile-button");
    if (profileButton) {
        profileButton.addEventListener("click", () => {
            showView("profile-view");
        });
    }

    // Volver al panel principal desde perfil
    const backToMainButtonProfile = document.getElementById("back-to-main-button-profile");
    if (backToMainButtonProfile) {
        backToMainButtonProfile.addEventListener("click", () => {
            showView("main-view");
        });
    }

    // Volver al panel principal desde perfil (segundo botón)
    const backToMainButton2 = document.getElementById("back-to-main-button-2");
    if (backToMainButton2) {
        backToMainButton2.addEventListener("click", () => {
            showView("main-view");
        });
    }

    // Mostrar modal de nuevo proyecto
    const newProjectButton = document.getElementById("new-project-button");
    if (newProjectButton) {
        newProjectButton.addEventListener("click", () => {
            // Limpiar formulario
            document.getElementById("project-form").reset();
            document.getElementById("project-id").value = "";
            document.getElementById("project-form-title").textContent = "Nuevo Proyecto";
            document.getElementById("neighborhoods-list").innerHTML = "";

            // Mostrar vista de formulario
            showView("project-form-view");
        });
    }

    // Volver al panel principal desde formulario
    const backToMainButton = document.getElementById("back-to-main-button");
    if (backToMainButton) {
        backToMainButton.addEventListener("click", () => {
            showView("main-view");
        });
    }

    // Cancelar creación/edición de proyecto
    const cancelProjectButton = document.getElementById("cancel-project-button");
    if (cancelProjectButton) {
        cancelProjectButton.addEventListener("click", () => {
            showView("main-view");
        });
    }

    // Agregar barrio
    const addNeighborhoodButton = document.getElementById("add-neighborhood-button");
    if (addNeighborhoodButton) {
        addNeighborhoodButton.addEventListener("click", () => {
            const neighborhoodInput = document.getElementById("project-neighborhood");
            const neighborhood = neighborhoodInput.value.trim();

            if (neighborhood) {
                addNeighborhood(neighborhood);
                neighborhoodInput.value = "";
                neighborhoodInput.focus();
            }
        });
    }

    // Guardar proyecto
    // En setupEventListeners()
const projectForm = document.getElementById("project-form");
if (projectForm) {
    projectForm.addEventListener("submit", function(e) {
        e.preventDefault();
        saveProject();
    });
}

    // Manejar cambio de departamento y municipio
    document.getElementById('project-department').addEventListener('change', function() {
        updateMunicipalityOptions();
        updateProjectId();
    });

    document.getElementById('project-municipality').addEventListener('change', function() {
        updateProjectId();
    });

    // Cambiar contraseña
    const changePasswordButton = document.getElementById("change-password-button");
    if (changePasswordButton) {
        changePasswordButton.addEventListener("click", () => {
            const changePasswordModal = new bootstrap.Modal(document.getElementById("change-password-modal"));
            changePasswordModal.show();
        });
    }

    // Guardar nueva contraseña
    const changePasswordForm = document.getElementById("change-password-form");
    if (changePasswordForm) {
        changePasswordForm.addEventListener("submit", (e) => {
            e.preventDefault();
            changePassword();
        });
    }

    // Notificaciones
    const notificationsButton = document.getElementById("notifications-button");
    if (notificationsButton) {
        notificationsButton.addEventListener("click", () => {
            // Marcar notificaciones como leídas cuando se abren
            const notificationItems = document.querySelectorAll(".notification-item.unread");
            notificationItems.forEach((item) => {
                const notificationId = item.dataset.id;
                if (notificationId) {
                    markNotificationAsRead(notificationId);
                }
            });
        });
    }

    // Ver todas las notificaciones
    document.addEventListener("click", (e) => {
        if (e.target.id === "viewAllNotifications" || e.target.closest("#viewAllNotifications")) {
            const notificationsModal = new bootstrap.Modal(document.getElementById("notifications-modal"));
            notificationsModal.show();
            loadAllNotifications();
        }
    });

    // Marcar todas las notificaciones como leídas
    const markAllReadButton = document.getElementById("mark-all-read");
    if (markAllReadButton) {
        markAllReadButton.addEventListener("click", () => {
            const loggedUser = Storage.getLoggedUser();
            Storage.markAllNotificationsAsRead(loggedUser.id);
            loadNotifications();
            loadAllNotifications();
        });
    }

    // Ver detalles de proyecto
    document.addEventListener("click", (e) => {
        if (e.target.closest(".view-project")) {
            const projectId = e.target.closest(".view-project").dataset.id;
            viewProject(projectId);
        }
    });

    // Editar proyecto
    document.addEventListener("click", (e) => {
        if (e.target.closest(".edit-project")) {
            const projectId = e.target.closest(".edit-project").dataset.id;
            editProject(projectId);
        }
    });

    // Enviar proyecto a revisión
    document.addEventListener("click", (e) => {
        if (e.target.closest(".send-project")) {
            const projectId = e.target.closest(".send-project").dataset.id;
            sendProject(projectId);
        }
    });
}

// Función para actualizar las opciones de municipio según el departamento seleccionado
function updateMunicipalityOptions() {
    const departmentSelect = document.getElementById('project-department');
    const municipalitySelect = document.getElementById('project-municipality');
    const department = departmentSelect.value;
    
    municipalitySelect.innerHTML = '<option value="">Seleccione un municipio</option>';
    
    if (department && municipiosPorDepartamento[department]) {
        municipiosPorDepartamento[department].forEach(municipio => {
            const option = document.createElement('option');
            option.value = municipio;
            option.textContent = municipio;
            municipalitySelect.appendChild(option);
        });
    }
}

// Función para actualizar el ID del proyecto cuando cambia la ubicación
function updateProjectId() {
    const projectIdField = document.getElementById('project-id');
    const department = document.getElementById('project-department').value;
    const municipality = document.getElementById('project-municipality').value;
    
    // Solo actualizar si ya hay un proyecto existente (edición) o si ambos campos están completos
    if ((projectIdField.value || (department && municipality)) && department && municipality) {
        try {
            const loggedUser = Storage.getLoggedUser();
            const project = projectIdField.value ? Storage.getProjectById(projectIdField.value) : {
                creadorId: loggedUser.id,
                departamento: department,
                municipio: municipality,
                nombre: document.getElementById('project-name').value || 'Nuevo Proyecto'
            };
            
            // Actualizar los datos del proyecto temporalmente
            project.departamento = department;
            project.municipio = municipality;
            
            // Generar nuevo ID
            const newId = Storage.generateProjectId(project);
            projectIdField.value = newId;
            
        } catch (error) {
            console.error("Error al actualizar ID del proyecto:", error);
        }
    }
}

// Editar proyecto
function editProject(projectId) {
  const project = Storage.getProjectById(projectId);
  if (!project) {
      alert("No se encontró el proyecto a editar");
      return;
  }

  // Llenar formulario con datos del proyecto
  document.getElementById("project-id").value = project.id;
  document.getElementById("project-name").value = project.nombre;
  document.getElementById("project-address-start").value = project.direccionInicial;
  document.getElementById("project-address-end").value = project.direccionFinal;
  document.getElementById("project-posts").value = project.numPostes;
  document.getElementById("project-start-date").value = project.fechaInicio;
  document.getElementById("project-end-date").value = project.fechaFin;
  document.getElementById("project-connection").value = project.puntoConexion;
  document.getElementById("project-observations").value = project.observaciones || "";

  // Manejar departamento y municipio
  const departmentSelect = document.getElementById("project-department");
  departmentSelect.value = project.departamento;
  
  // Disparar evento change para cargar municipios
  const event = new Event('change');
  departmentSelect.dispatchEvent(event);
  
  // Esperar un breve momento para que se carguen los municipios
  setTimeout(() => {
      document.getElementById("project-municipality").value = project.municipio;
  }, 100);

  // Limpiar y cargar barrios
  const neighborhoodsList = document.getElementById("neighborhoods-list");
  neighborhoodsList.innerHTML = "";
  if (project.barrios && project.barrios.length > 0) {
      project.barrios.forEach(barrio => addNeighborhood(barrio));
  }

  // Mostrar observaciones de ejecutiva si existen
  const ejecutivaObservationsAlert = document.getElementById("ejecutiva-observations-alert");
  if (project.observacionesEjecutiva) {
      ejecutivaObservationsAlert.textContent = project.observacionesEjecutiva;
      ejecutivaObservationsAlert.classList.remove("d-none");
  } else {
      ejecutivaObservationsAlert.classList.add("d-none");
  }

  // Actualizar título del formulario
  document.getElementById("project-form-title").textContent = "Editar Proyecto";

  // Mostrar vista de formulario
  showView("project-form-view");
}

// Resto de las funciones existentes (showView, addNeighborhood, saveProject, viewProject, etc.)
// ... (mantén todas las demás funciones como estaban)

// Obtener clase para el badge según el estado
function getBadgeClass(estado) {
    switch (estado) {
        case "Nuevo":
            return "bg-secondary";
        case "En Revisión por Ejecutiva":
            return "bg-warning text-dark";
        case "En Asignación":
            return "bg-info text-dark";
        case "Asignado":
            return "bg-primary";
        case "En Revisión de Verificación":
            return "bg-info";
        case "Opción Mejorar":
            return "bg-warning";
        case "Generación de Informe":
            return "bg-light text-dark";
        case "Finalizado":
            return "bg-success";
        case "Documentación Errada":
            return "bg-danger";
        default:
            return "bg-secondary";
    }
}

// Mostrar vista específica
function showView(viewId) {
    // Ocultar todas las vistas
    const views = document.querySelectorAll(".view");
    views.forEach((view) => {
        view.classList.add("d-none");
    });

    // Mostrar la vista seleccionada
    const selectedView = document.getElementById(viewId);
    if (selectedView) {
        selectedView.classList.remove("d-none");
    }
}

// Agregar barrio a la lista
function addNeighborhood(neighborhood) {
    const neighborhoodsList = document.getElementById("neighborhoods-list");

    // Crear elemento de barrio
    const neighborhoodItem = document.createElement("div");
    neighborhoodItem.className = "neighborhood-item";
    neighborhoodItem.innerHTML = `
        <span>${neighborhood}</span>
        <button type="button" class="btn btn-sm btn-danger remove-neighborhood">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Agregar evento para eliminar barrio
    const removeButton = neighborhoodItem.querySelector(".remove-neighborhood");
    removeButton.addEventListener("click", () => {
        neighborhoodItem.remove();
    });

    // Agregar a la lista
    neighborhoodsList.appendChild(neighborhoodItem);
}

// Guardar proyecto
function saveProject() {
    // Obtener datos del formulario
    const projectId = document.getElementById("project-id").value;
    const nombre = document.getElementById("project-name").value;
    const direccionInicial = document.getElementById("project-address-start").value;
    const direccionFinal = document.getElementById("project-address-end").value;
    const municipio = document.getElementById("project-municipality").value;
    const departamento = document.getElementById("project-department").value;
    const numPostes = document.getElementById("project-posts").value;
    const fechaInicio = document.getElementById("project-start-date").value;
    const fechaFin = document.getElementById("project-end-date").value;
    const puntoConexion = document.getElementById("project-connection").value;
    const observaciones = document.getElementById("project-observations").value;

    // Validar campos obligatorios
    if (!nombre || !direccionInicial || !direccionFinal || !municipio || 
        !departamento || !numPostes || !fechaInicio || !fechaFin || !puntoConexion) {
        alert("Por favor, completa todos los campos obligatorios marcados con *");
        return;
    }

    try {
        // Obtener barrios
        const neighborhoodItems = document.querySelectorAll("#neighborhoods-list .neighborhood-item");
        const barrios = Array.from(neighborhoodItems).map((item) => item.querySelector("span").textContent);

        // Obtener archivos (opcionales)
        const kmzFile = document.getElementById("project-kmz").files[0];
        const dwgFile = document.getElementById("project-dwg").files[0];
        const matriculaFile = document.getElementById("project-matricula").files[0];
        const ccFile = document.getElementById("project-cc").files[0];
        const formularioFile = document.getElementById("project-formulario").files[0];

        // Crear objeto de proyecto
        const loggedUser = Storage.getLoggedUser();
        let project = {
            nombre,
            direccionInicial,
            direccionFinal,
            barrios,
            municipio,
            departamento,
            numPostes: parseInt(numPostes),
            fechaInicio,
            fechaFin,
            puntoConexion,
            observaciones,
            creadorId: loggedUser.id,
            creadorNombre: `${loggedUser.nombre} ${loggedUser.apellido || ""}`,
            estado: "Nuevo",
            documentos: {},
        };

        // Si es edición, mantener el ID existente
        if (projectId) {
            project.id = projectId;
            project.fechaActualizacion = new Date().toISOString();
        } else {
            project.fechaCreacion = new Date().toISOString();
        }

        // Manejar archivos
        project.documentos = {
            kmz: kmzFile ? { nombre: kmzFile.name, tipo: kmzFile.type, tamaño: kmzFile.size } : null,
            dwg: dwgFile ? { nombre: dwgFile.name, tipo: dwgFile.type, tamaño: dwgFile.size } : null,
            matricula: matriculaFile ? { nombre: matriculaFile.name, tipo: matriculaFile.type, tamaño: matriculaFile.size } : null,
            cc: ccFile ? { nombre: ccFile.name, tipo: ccFile.type, tamaño: ccFile.size } : null,
            formulario: formularioFile ? { nombre: formularioFile.name, tipo: formularioFile.type, tamaño: formularioFile.size } : null
        };

        // Guardar proyecto
        const savedProject = Storage.saveProject(project);

        // Mostrar mensaje de éxito
        alert(`Proyecto ${projectId ? 'actualizado' : 'creado'} correctamente con ID: ${savedProject.id}`);

        // Recargar datos y volver a la vista principal
        loadProjects();
        showView("main-view");

    } catch (error) {
        console.error("Error al guardar el proyecto:", error);
        alert(`Error al guardar el proyecto: ${error.message}`);
    }
}

// Ver detalles de proyecto
function viewProject(projectId) {
    const project = Storage.getProjectById(projectId);
    if (!project) return;

    // Llenar datos en el modal
    document.getElementById("detail-project-id").textContent = project.id;
    document.getElementById("detail-project-name").textContent = project.nombre;
    document.getElementById("detail-project-creator").textContent = project.creadorNombre;
    document.getElementById("detail-project-status").textContent = project.estado;
    document.getElementById("detail-project-creation-date").textContent = new Date(
        project.fechaCreacion,
    ).toLocaleDateString();
    document.getElementById("detail-project-start-date").textContent = project.fechaInicio;
    document.getElementById("detail-project-end-date").textContent = project.fechaFin;
    document.getElementById("detail-project-address-start").textContent = project.direccionInicial;
    document.getElementById("detail-project-address-end").textContent = project.direccionFinal;
    document.getElementById("detail-project-neighborhoods").textContent = project.barrios.join(", ") || "No especificado";
    document.getElementById("detail-project-municipality").textContent = project.municipio;
    document.getElementById("detail-project-department").textContent = project.departamento;
    document.getElementById("detail-project-posts").textContent = project.numPostes;
    document.getElementById("detail-project-connection").textContent = project.puntoConexion;
    document.getElementById("detail-project-observations").textContent = project.observaciones || "No hay observaciones";

    // Enlaces a documentos
    if (project.documentos.kmz) {
        document.getElementById("detail-kmz-link").href = "#";
        document.getElementById("detail-kmz-link").onclick = () =>
            alert("Descargando archivo KMZ: " + project.documentos.kmz.nombre);
    }

    if (project.documentos.dwg) {
        document.getElementById("detail-dwg-link").href = "#";
        document.getElementById("detail-dwg-link").onclick = () =>
            alert("Descargando archivo DWG: " + project.documentos.dwg.nombre);
    }

    if (project.documentos.matricula) {
        document.getElementById("detail-matricula-link").href = "#";
        document.getElementById("detail-matricula-link").onclick = () =>
            alert("Descargando archivo PDF: " + project.documentos.matricula.nombre);
    }

    if (project.documentos.cc) {
        document.getElementById("detail-cc-link").href = "#";
        document.getElementById("detail-cc-link").onclick = () =>
            alert("Descargando archivo PDF: " + project.documentos.cc.nombre);
    }

    if (project.documentos.formulario) {
        document.getElementById("detail-formulario-link").href = "#";
        document.getElementById("detail-formulario-link").onclick = () =>
            alert("Descargando archivo Excel: " + project.documentos.formulario.nombre);
    }

    // Mostrar observaciones si existen
    const ejecutivaObsContainer = document.getElementById("detail-ejecutiva-observations-container");
    if (project.observacionesEjecutiva) {
        document.getElementById("detail-ejecutiva-observations").textContent = project.observacionesEjecutiva;
        ejecutivaObsContainer.classList.remove("d-none");
    } else {
        ejecutivaObsContainer.classList.add("d-none");
    }

    const analistaObsContainer = document.getElementById("detail-analista-observations-container");
    if (project.observacionesAnalista) {
        document.getElementById("detail-analista-observations").textContent = project.observacionesAnalista;
        analistaObsContainer.classList.remove("d-none");
    } else {
        analistaObsContainer.classList.add("d-none");
    }

    // Mostrar modal
    const projectDetailModal = new bootstrap.Modal(document.getElementById("project-detail-modal"));
    projectDetailModal.show();
}

// Enviar proyecto a revisión
function sendProject(projectId) {
    const project = Storage.getProjectById(projectId);
    if (!project) return;

    // Confirmar acción
    if (
        !confirm(
            "¿Estás seguro de enviar este proyecto a revisión? Una vez enviado, no podrás editarlo hasta que sea revisado.",
        )
    ) {
        return;
    }

    // Actualizar estado del proyecto
    project.estado = "En Revisión por Ejecutiva";
    project.fechaEnvio = new Date().toISOString();

    // Asignar a un usuario ejecutivo
    const ejecutivas = Storage.getUsers().filter((user) => user.rol === "ejecutiva" && user.activo);

    if (ejecutivas.length > 0) {
        // Asignar a una ejecutiva aleatoria (en un sistema real podría ser por carga de trabajo)
        const ejecutivaAsignada = ejecutivas[Math.floor(Math.random() * ejecutivas.length)];
        project.ejecutivaId = ejecutivaAsignada.id;
        project.ejecutivaNombre = `${ejecutivaAsignada.nombre} ${ejecutivaAsignada.apellido || ""}`;

        // Guardar proyecto
        Storage.saveProject(project);

        // Crear notificación para el usuario PRST
        const loggedUser = Storage.getLoggedUser();
        Storage.createNotification({
            usuarioId: loggedUser.id,
            tipo: "proyecto_enviado",
            mensaje: `Has enviado el proyecto "${project.nombre}" con ID ${project.id} a revisión. Ha sido asignado a ${project.ejecutivaNombre}.`,
            fechaCreacion: new Date().toISOString(),
            leido: false,
        });

        // Crear notificación para la ejecutiva asignada
        Storage.createNotification({
            usuarioId: ejecutivaAsignada.id,
            tipo: "proyecto_asignado",
            mensaje: `Se te ha asignado un nuevo proyecto para revisar: "${project.nombre}" con ID ${project.id}.`,
            fechaCreacion: new Date().toISOString(),
            leido: false,
        });

        // Recargar proyectos y notificaciones
        loadProjects();
        loadNotifications();

        // Mostrar mensaje de éxito
        alert(`Proyecto enviado a revisión correctamente. Ha sido asignado a ${project.ejecutivaNombre}.`);
    } else {
        alert("No hay usuarios ejecutivos disponibles para asignar el proyecto. Por favor, contacte al administrador.");
    }
}

// Cargar notificaciones del usuario
function loadNotifications() {
    const loggedUser = Storage.getLoggedUser();
    const notifications = Storage.getNotificationsByUser(loggedUser.id);

    // Actualizar contador de notificaciones
    const notificationCount = notifications.filter((n) => !n.leido).length;
    const notificationBadge = document.getElementById("notification-badge");
    if (notificationBadge) {
        notificationBadge.textContent = notificationCount;
        notificationBadge.classList.toggle("d-none", notificationCount === 0);
    }

    // Actualizar lista de notificaciones en el dropdown
    const notificationsList = document.getElementById("notifications-list");
    if (notificationsList) {
        if (notifications.length === 0) {
            notificationsList.innerHTML = `
                <div class="dropdown-item text-center">No tienes notificaciones</div>
            `;
        } else {
            notificationsList.innerHTML = "";

            // Mostrar las 5 notificaciones más recientes
            const recentNotifications = notifications
                .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
                .slice(0, 5);

            recentNotifications.forEach((notification) => {
                const item = document.createElement("div");
                item.className = `dropdown-item notification-item ${notification.leido ? "" : "unread"}`;
                item.dataset.id = notification.id;

                item.innerHTML = `
                    <div class="d-flex align-items-center">
                        <div class="notification-icon me-3">
                            <i class="fas ${getNotificationIcon(notification.tipo)} text-primary"></i>
                        </div>
                        <div class="notification-content flex-grow-1">
                            <div class="notification-text">${notification.mensaje}</div>
                            <div class="notification-time text-muted small">${formatDate(notification.fechaCreacion)}</div>
                        </div>
                        ${notification.leido ? "" : '<div class="notification-badge"></div>'}
                    </div>
                `;

                notificationsList.appendChild(item);
            });

            // Agregar enlace para ver todas las notificaciones
            const viewAllLink = document.createElement("div");
            viewAllLink.className = "dropdown-item text-center text-primary";
            viewAllLink.textContent = "Ver todas las notificaciones";
            viewAllLink.id = "viewAllNotifications";
            viewAllLink.style.cursor = "pointer";
            notificationsList.appendChild(viewAllLink);
        }
    }
}

// Obtener icono según el tipo de notificación
function getNotificationIcon(tipo) {
    switch (tipo) {
        case "proyecto_creado":
            return "fa-plus-circle";
        case "proyecto_actualizado":
            return "fa-edit";
        case "proyecto_enviado":
            return "fa-paper-plane";
        case "proyecto_revisado":
            return "fa-check-circle";
        case "proyecto_rechazado":
            return "fa-times-circle";
        case "proyecto_asignado":
            return "fa-user-check";
        case "proyecto_finalizado":
            return "fa-flag-checkered";
        default:
            return "fa-bell";
    }
}

// Formatear fecha para mostrar en notificaciones
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) {
        return "Hace un momento";
    } else if (diffMins < 60) {
        return `Hace ${diffMins} ${diffMins === 1 ? "minuto" : "minutos"}`;
    } else if (diffHours < 24) {
        return `Hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;
    } else if (diffDays < 7) {
        return `Hace ${diffDays} ${diffDays === 1 ? "día" : "días"}`;
    } else {
        return date.toLocaleDateString();
    }
}

// Marcar notificación como leída
function markNotificationAsRead(notificationId) {
    Storage.markNotificationAsRead(notificationId);
    loadNotifications();
}

// Cargar todas las notificaciones en el modal
function loadAllNotifications() {
    const loggedUser = Storage.getLoggedUser();
    const notifications = Storage.getNotificationsByUser(loggedUser.id);

    const notificationsModalBody = document.getElementById("notifications-modal-body");
    if (notificationsModalBody) {
        if (notifications.length === 0) {
            notificationsModalBody.innerHTML = `
                <p class="text-center">No tienes notificaciones</p>
            `;
        } else {
            notificationsModalBody.innerHTML = "";

            // Ordenar notificaciones por fecha (más recientes primero)
            const sortedNotifications = notifications.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));

            sortedNotifications.forEach((notification) => {
                const item = document.createElement("div");
                item.className = `notification-item ${notification.leido ? "" : "unread"}`;
                item.dataset.id = notification.id;

                item.innerHTML = `
                    <div class="d-flex align-items-center mb-3 p-2 border-bottom">
                        <div class="notification-icon me-3">
                            <i class="fas ${getNotificationIcon(notification.tipo)} text-primary"></i>
                        </div>
                        <div class="notification-content flex-grow-1">
                            <div class="notification-text">${notification.mensaje}</div>
                            <div class="notification-time text-muted small">${formatDate(notification.fechaCreacion)}</div>
                        </div>
                        ${notification.leido ? "" : '<div class="notification-badge"></div>'}
                    </div>
                `;

                notificationsModalBody.appendChild(item);
            });
        }
    }
}

// Cambiar contraseña
function changePassword() {
    const currentPassword = document.getElementById("current-password").value;
    const newPassword = document.getElementById("new-password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    // Validar campos
    if (!currentPassword || !newPassword || !confirmPassword) {
        alert("Por favor, completa todos los campos");
        return;
    }

    // Validar que las contraseñas coincidan
    if (newPassword !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
    }

    // Validar contraseña actual
    const loggedUser = Storage.getLoggedUser();
    if (currentPassword !== loggedUser.password) {
        alert("La contraseña actual es incorrecta");
        return;
    }

    // Actualizar contraseña
    loggedUser.password = newPassword;
    Storage.saveUser(loggedUser);
    Storage.setLoggedUser(loggedUser);

    // Cerrar modal
    const passwordModal = bootstrap.Modal.getInstance(document.getElementById("change-password-modal"));
    if (passwordModal) {
        passwordModal.hide();
    }

    // Mostrar mensaje de éxito
    alert("Contraseña cambiada correctamente");
}