<<<<<<< HEAD
// Coordinador.js - Funcionalidades para el rol de Coordinador usando Storage.js

// Inicialización cuando el DOM está completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  // Verificar autenticación
  const loggedUser = Storage.getLoggedUser();
  if (loggedUser) {
    currentUser = loggedUser;
    checkUserRole();
  } else {
    // Redirigir al login si no hay usuario autenticado
    window.location.href = "login.html";
  }

  // Configurar listeners para botones y eventos
  document.getElementById("logoutBtn")?.addEventListener("click", logout);
  document.getElementById("cerrarSesion")?.addEventListener("click", logout);
  
  // Configurar navegación entre secciones
  setupNavigation();
});

// Variables globales
let currentUser = null;
let projectsData = [];
const usersData = {
  analistas: [],
  brigadas: [],
};
let coordinadorType = null; // Administrativo, Operativo, Censo

// Configurar navegación entre secciones
function setupNavigation() {
  // Mostrar sección según el tipo de coordinador
  const navLinks = {
    "navAdministrativo": "seccionAdministrativo",
    "navOperativo": "seccionOperativo",
    "navCenso": "seccionCenso",
    "navPerfil": "seccionPerfil"
  };

  Object.entries(navLinks).forEach(([linkId, sectionId]) => {
    const link = document.getElementById(linkId);
    if (link) {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        
        // Ocultar todas las secciones
        document.querySelectorAll(".row[id^='seccion']").forEach(section => {
          section.style.display = "none";
        });
        
        // Mostrar la sección seleccionada
        document.getElementById(sectionId).style.display = "block";
        
        // Cargar contenido según la sección
        switch(sectionId) {
          case "seccionAdministrativo":
            loadPendingProjects();
            break;
          case "seccionOperativo":
            loadAssignedProjects();
            break;
          case "seccionCenso":
            loadCompletedProjects();
            break;
          case "seccionPerfil":
            loadProfileData();
            break;
        }
      });
    }
  });
}

// Verificar que el usuario tenga el rol de Coordinador y su tipo
function checkUserRole() {
  try {
    if (currentUser.rol !== "coordinador") {
      // Redirigir según el rol
      redirectByRole(currentUser.rol);
      return;
    }

    // Guardar tipo de coordinador
    coordinadorType = currentUser.tipoCoordinador || "operativo";

    // Continuar con la inicialización
    setupUI();
    loadUsers();
    loadInitialSection();
  } catch (error) {
    console.error("Error al verificar el rol:", error);
    alert("Error al verificar permisos. Por favor, intente nuevamente.");
  }
}

// Cargar la sección inicial según el tipo de coordinador
function loadInitialSection() {
  // Ocultar todas las secciones primero
  document.querySelectorAll(".row[id^='seccion']").forEach(section => {
    section.style.display = "none";
  });

  // Mostrar la sección correspondiente al tipo de coordinador
  let initialSection = "seccionAdministrativo";
  switch(coordinadorType) {
    case "operativo":
      initialSection = "seccionOperativo";
      loadAssignedProjects();
      break;
    case "censo":
      initialSection = "seccionCenso";
      loadCompletedProjects();
      break;
    case "administrativo":
    default:
      initialSection = "seccionAdministrativo";
      loadPendingProjects();
  }
  
  document.getElementById(initialSection).style.display = "block";
}

// Redirigir según el rol del usuario
function redirectByRole(role) {
  switch (role) {
    case "prst":
      window.location.href = "prst.html";
      break;
    case "ejecutiva":
      window.location.href = "ejecutiva.html";
      break;
    case "analista":
      window.location.href = "analista.html";
      break;
    case "brigada":
      window.location.href = "brigada-censo.html";
      break;
    case "admin":
      window.location.href = "admin.html";
      break;
    default:
      window.location.href = "login.html";
  }
}

// Configurar la interfaz de usuario
function setupUI() {
  // Mostrar nombre del usuario
  const userNameElement = document.getElementById("userName");
  const perfilNombre = document.getElementById("perfilNombre");
  if (userNameElement && currentUser.nombre) {
    const fullName = `${currentUser.nombre} ${currentUser.apellido || ''}`;
    userNameElement.textContent = fullName;
    if (perfilNombre) perfilNombre.textContent = fullName;
  }

  // Mostrar tipo de coordinador
  const coordinadorTypeElement = document.getElementById("coordinadorType");
  if (coordinadorTypeElement) {
    coordinadorTypeElement.textContent = `Coordinador ${coordinadorType}`;
  }

  // Configurar perfil
  const perfilRol = document.getElementById("perfilRol");
  if (perfilRol) perfilRol.textContent = `Coordinador ${coordinadorType}`;
  
  const perfilCorreo = document.getElementById("perfilCorreo");
  if (perfilCorreo) perfilCorreo.textContent = currentUser.correo || "-";

  // Configurar filtros y buscador
  setupFilters();
  setupSearchBar();
  setupTabs();
}

// Configurar filtros de proyectos
function setupFilters() {
  const filterSelect = document.getElementById("projectFilter");
  if (filterSelect) {
    filterSelect.addEventListener("change", () => {
      filterProjects(filterSelect.value);
    });
  }
}

// Configurar barra de búsqueda
function setupSearchBar() {
  const searchInput = document.getElementById("searchProject");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();
      searchProjects(searchTerm);
    });
  }
  
  const btnSearch = document.getElementById("btnSearch");
  if (btnSearch) {
    btnSearch.addEventListener("click", () => {
      const searchTerm = document.getElementById("searchProject").value.toLowerCase();
      searchProjects(searchTerm);
    });
  }
}

// Configurar pestañas
function setupTabs() {
  const tabs = document.querySelectorAll(".tab-button");
  if (tabs) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        // Remover clase activa de todas las pestañas
        tabs.forEach((t) => t.classList.remove("active"));

        // Agregar clase activa a la pestaña seleccionada
        tab.classList.add("active");

        // Cargar proyectos según la pestaña
        const tabType = tab.getAttribute("data-tab");
        switch (tabType) {
          case "pending":
            loadPendingProjects();
            break;
          case "assigned":
            loadAssignedProjects();
            break;
          case "completed":
            loadCompletedProjects();
            break;
          case "verification":
            loadProjectsInVerification();
            break;
          case "review":
            loadProjectsInReview();
            break;
        }
      });
    });
  }
}

// Cargar datos del perfil
function loadProfileData() {
  try {
    document.getElementById("perfilUsuario").textContent = currentUser.correo || "-";
    document.getElementById("perfilDepartamento").textContent = "Coordinación";
    document.getElementById("perfilCargo").textContent = `Coordinador ${coordinadorType}`;
  } catch (error) {
    console.error("Error al cargar datos del perfil:", error);
  }
}

// Cargar usuarios (analistas y brigadas)
function loadUsers() {
  try {
    // Cargar todos los usuarios
    const allUsers = Storage.getUsers();
    
    // Filtrar analistas
    usersData.analistas = allUsers.filter(user => user.rol === "analista");
    
    // Filtrar brigadas
    usersData.brigadas = allUsers.filter(user => user.rol === "brigada");
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    alert("Error al cargar usuarios. Por favor, intente nuevamente.");
  }
}

// Cargar proyectos pendientes de asignación
function loadPendingProjects() {
  try {
    const projectsContainer = document.getElementById("projectsList");
    if (!projectsContainer) return;
    
    projectsContainer.innerHTML = '<p class="loading">Cargando proyectos...</p>';

    // Consultar proyectos pendientes de asignación
    projectsData = Storage.getProjects().filter(project => project.estado === "En Asignación");

    if (projectsData.length === 0) {
      projectsContainer.innerHTML = '<p class="no-projects">No hay proyectos pendientes de asignación.</p>';
      return;
    }

    // Ordenar proyectos por fecha de creación (más recientes primero)
    projectsData.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));

    // Mostrar los proyectos
    displayProjects(projectsData);
  } catch (error) {
    console.error("Error al cargar proyectos:", error);
    const projectsContainer = document.getElementById("projectsList");
    if (projectsContainer) {
      projectsContainer.innerHTML = '<p class="error">Error al cargar proyectos. Por favor, intente nuevamente.</p>';
    }
  }
}

// Cargar proyectos asignados
function loadAssignedProjects() {
  try {
    const projectsContainer = document.getElementById("projectsListOp");
    if (!projectsContainer) return;
    
    projectsContainer.innerHTML = '<p class="loading">Cargando proyectos...</p>';

    // Consultar proyectos asignados
    projectsData = Storage.getProjects().filter(project => project.estado === "Asignado");

    if (projectsData.length === 0) {
      projectsContainer.innerHTML = '<p class="no-projects">No hay proyectos asignados actualmente.</p>';
      return;
    }

    // Ordenar proyectos por fecha de creación (más recientes primero)
    projectsData.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));

    // Mostrar los proyectos
    displayProjects(projectsData, "projectsListOp");
  } catch (error) {
    console.error("Error al cargar proyectos:", error);
    const projectsContainer = document.getElementById("projectsListOp");
    if (projectsContainer) {
      projectsContainer.innerHTML = '<p class="error">Error al cargar proyectos. Por favor, intente nuevamente.</p>';
    }
  }
}

// Cargar proyectos en verificación
function loadProjectsInVerification() {
  try {
    const projectsContainer = document.getElementById("projectsListOp") || document.getElementById("projectsListCenso");
    if (!projectsContainer) return;
    
    projectsContainer.innerHTML = '<p class="loading">Cargando proyectos...</p>';

    // Consultar proyectos en verificación
    projectsData = Storage.getProjects().filter(project => project.estado === "En Verificación");

    if (projectsData.length === 0) {
      projectsContainer.innerHTML = '<p class="no-projects">No hay proyectos en verificación actualmente.</p>';
      return;
    }

    // Ordenar proyectos por fecha de creación (más recientes primero)
    projectsData.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));

    // Mostrar los proyectos
    displayProjects(projectsData, projectsContainer.id);
  } catch (error) {
    console.error("Error al cargar proyectos:", error);
    const projectsContainer = document.getElementById("projectsListOp") || document.getElementById("projectsListCenso");
    if (projectsContainer) {
      projectsContainer.innerHTML = '<p class="error">Error al cargar proyectos. Por favor, intente nuevamente.</p>';
    }
  }
}

// Cargar proyectos en revisión
function loadProjectsInReview() {
  try {
    const projectsContainer = document.getElementById("projectsListOp") || document.getElementById("projectsListCenso");
    if (!projectsContainer) return;
    
    projectsContainer.innerHTML = '<p class="loading">Cargando proyectos...</p>';

    // Consultar proyectos en revisión
    projectsData = Storage.getProjects().filter(project => project.estado === "En Revisión");

    if (projectsData.length === 0) {
      projectsContainer.innerHTML = '<p class="no-projects">No hay proyectos en revisión actualmente.</p>';
      return;
    }

    // Ordenar proyectos por fecha de creación (más recientes primero)
    projectsData.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));

    // Mostrar los proyectos
    displayProjects(projectsData, projectsContainer.id);
  } catch (error) {
    console.error("Error al cargar proyectos:", error);
    const projectsContainer = document.getElementById("projectsListOp") || document.getElementById("projectsListCenso");
    if (projectsContainer) {
      projectsContainer.innerHTML = '<p class="error">Error al cargar proyectos. Por favor, intente nuevamente.</p>';
    }
  }
}

// Cargar proyectos en revisión de verificación o completados
function loadCompletedProjects() {
  try {
    const projectsContainer = document.getElementById("projectsListCenso");
    if (!projectsContainer) return;
    
    projectsContainer.innerHTML = '<p class="loading">Cargando proyectos...</p>';

    // Consultar proyectos en verificación
    projectsData = Storage.getProjects().filter(project => project.estado === "En Revisión de Verificación");

    if (projectsData.length === 0) {
      projectsContainer.innerHTML = '<p class="no-projects">No hay proyectos en verificación.</p>';
      return;
    }

    // Ordenar proyectos por fecha de creación (más recientes primero)
    projectsData.sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion));

    // Mostrar los proyectos
    displayProjects(projectsData, "projectsListCenso");
  } catch (error) {
    console.error("Error al cargar proyectos:", error);
    const projectsContainer = document.getElementById("projectsListCenso");
    if (projectsContainer) {
      projectsContainer.innerHTML = '<p class="error">Error al cargar proyectos. Por favor, intente nuevamente.</p>';
    }
  }
}

// Mostrar proyectos en la interfaz
function displayProjects(projects, containerId = "projectsList") {
  const projectsContainer = document.getElementById(containerId);
  if (!projectsContainer) return;
  
  projectsContainer.innerHTML = "";

  projects.forEach((project) => {
    const projectCard = document.createElement("div");
    projectCard.className = "project-card";

    // Aplicar clase según el estado
    projectCard.classList.add(`status-${project.estado.toLowerCase().replace(/\s+/g, "-")}`);

    // Mostrar información de asignación si está asignado
    let assignedInfo = "";
    if (project.analistaId) {
      const analista = usersData.analistas.find((a) => a.id === project.analistaId);
      assignedInfo = `<p><strong>Asignado a:</strong> ${analista ? `${analista.nombre} ${analista.apellido || ''}` : "Analista"}</p>`;
    } else if (project.brigadaId) {
      const brigada = usersData.brigadas.find((b) => b.id === project.brigadaId);
      assignedInfo = `<p><strong>Asignado a:</strong> ${brigada ? `${brigada.nombre} ${brigada.apellido || ''}` : "Brigada"}</p>`;
    }

    projectCard.innerHTML = `
      <h3>${project.nombre}</h3>
      <p><strong>Cliente:</strong> ${project.cliente}</p>
      <p><strong>Fecha de creación:</strong> ${new Date(project.fechaCreacion).toLocaleDateString()}</p>
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
    `;

    projectsContainer.appendChild(projectCard);
  });

  // Agregar event listeners a los botones
  document.querySelectorAll(".btn-view").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const projectId = e.target.getAttribute("data-id");
      openProjectDetails(projectId);
    });
  });

  document.querySelectorAll(".btn-assign").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const projectId = e.target.getAttribute("data-id");
      openAssignForm(projectId);
    });
  });

  document.querySelectorAll(".btn-review").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const projectId = e.target.getAttribute("data-id");
      openVerificationReviewForm(projectId);
    });
  });
}

// Filtrar proyectos por estado
function filterProjects(filterValue) {
  if (filterValue === "all") {
    displayProjects(projectsData);
    return;
  }

  const filteredProjects = projectsData.filter((project) => project.estado === filterValue);
  displayProjects(filteredProjects);
}

// Buscar proyectos por término
function searchProjects(searchTerm) {
  if (!searchTerm) {
    displayProjects(projectsData);
    return;
  }

  const filteredProjects = projectsData.filter(
    (project) =>
      project.nombre.toLowerCase().includes(searchTerm) || 
      project.cliente.toLowerCase().includes(searchTerm)
  );

  displayProjects(filteredProjects);
}

// Abrir detalles del proyecto
function openProjectDetails(projectId) {
  const project = projectsData.find((p) => p.id === projectId);
  if (!project) return;

  const modal = document.getElementById("projectDetailsModal");
  const modalContent = document.getElementById("projectDetailsContent");

  // Obtener información del creador
  const creador = Storage.getUserById(project.creadorId);

  // Preparar sección de asignación si existe
  let asignacionHTML = "";
  if (project.analistaId) {
    const analista = usersData.analistas.find((a) => a.id === project.analistaId);
    asignacionHTML = `
      <div class="assignment-section">
        <h3>Información de Asignación</h3>
        <p><strong>Asignado a:</strong> ${analista ? `${analista.nombre} ${analista.apellido || ''}` : "Analista"}</p>
        <p><strong>Fecha de asignación:</strong> ${new Date(project.fechaAsignacion).toLocaleDateString()}</p>
        <p><strong>Asignado por:</strong> ${project.asignadoPorNombre || "Coordinador"}</p>
      </div>
    `;
  } else if (project.brigadaId) {
    const brigada = usersData.brigadas.find((b) => b.id === project.brigadaId);
    asignacionHTML = `
      <div class="assignment-section">
        <h3>Información de Asignación</h3>
        <p><strong>Asignado a:</strong> ${brigada ? `${brigada.nombre} ${brigada.apellido || ''}` : "Brigada"}</p>
        <p><strong>Fecha de asignación:</strong> ${new Date(project.fechaAsignacion).toLocaleDateString()}</p>
        <p><strong>Asignado por:</strong> ${project.asignadoPorNombre || "Coordinador"}</p>
      </div>
    `;
  }

  // Preparar sección de verificación si existe
  let verificacionHTML = "";
  if (project.verificacion) {
    verificacionHTML = `
      <div class="verification-section">
        <h3>Resultado de Verificación</h3>
        <p><strong>Estado:</strong> ${project.verificacion.estado}</p>
        <p><strong>Comentarios:</strong> ${project.verificacion.comentarios || "Sin comentarios"}</p>
        <p><strong>Verificado por:</strong> ${project.verificacion.analistaNombre}</p>
        <p><strong>Fecha:</strong> ${new Date(project.verificacion.fecha).toLocaleDateString()}</p>
        ${
          project.verificacion.informeURL
            ? `<p><strong>Informe:</strong> <a href="${project.verificacion.informeURL}" target="_blank">Ver informe</a></p>`
            : ""
        }
      </div>
    `;
  }

  modalContent.innerHTML = `
    <h2>${project.nombre}</h2>
    <p><strong>Cliente:</strong> ${project.cliente}</p>
    <p><strong>Descripción:</strong> ${project.descripcion || "No disponible"}</p>
    <p><strong>Fecha de creación:</strong> ${new Date(project.fechaCreacion).toLocaleDateString()}</p>
    <p><strong>Estado:</strong> ${project.estado}</p>
    <p><strong>Ubicación:</strong> ${project.ubicacion || "No especificada"}</p>
    <p><strong>Creado por:</strong> ${creador ? `${creador.nombre} ${creador.apellido || ''}` : "Usuario desconocido"}</p>
    
    ${asignacionHTML}
    ${verificacionHTML}
    
    <h3>Documentos</h3>
    <div id="projectDocuments">
      ${project.documentos ? renderDocumentsList(project.documentos) : "No hay documentos disponibles"}
    </div>
    
    <div class="modal-actions">
      <button id="closeDetailsBtn" class="btn-secondary">Cerrar</button>
    </div>
  `;

  modal.style.display = "block";

  // Configurar cierre del modal
  document.getElementById("closeDetailsBtn").addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Cerrar modal al hacer clic fuera del contenido
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

// Renderizar lista de documentos
function renderDocumentsList(documentos) {
  let html = '<ul class="documents-list">';

  Object.entries(documentos).forEach(([key, url]) => {
    const docName = key.charAt(0).toUpperCase() + key.slice(1); // Capitalizar primera letra
    html += `
      <li>
        <span>${docName}</span>
        <a href="${url}" target="_blank" class="btn-view-doc">Ver documento</a>
      </li>
    `;
  });

  html += "</ul>";
  return html;
}

// Abrir formulario de asignación
function openAssignForm(projectId) {
  const project = projectsData.find((p) => p.id === projectId);
  if (!project) return;

  const modal = document.getElementById("assignModal");
  const modalContent = document.getElementById("assignContent");

  // Preparar opciones de analistas
  let analistasOptions = '<option value="">Seleccione un analista</option>';
  usersData.analistas.forEach((analista) => {
    analistasOptions += `<option value="${analista.id}">${analista.nombre} ${analista.apellido || ''} (${analista.correo})</option>`;
  });

  // Preparar opciones de brigadas
  let brigadasOptions = '<option value="">Seleccione una brigada</option>';
  usersData.brigadas.forEach((brigada) => {
    brigadasOptions += `<option value="${brigada.id}">${brigada.nombre} ${brigada.apellido || ''} (${brigada.correo})</option>`;
  });

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
  `;

  modal.style.display = "block";

  // Configurar cambio de tipo de asignación
  document.getElementById("assignType").addEventListener("change", (e) => {
    const type = e.target.value;
    document.getElementById("analistaSection").style.display = type === "analista" ? "block" : "none";
    document.getElementById("brigadaSection").style.display = type === "brigada" ? "block" : "none";
  });

  // Configurar cierre del modal
  document.getElementById("closeAssignBtn").addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Configurar envío del formulario
  document.getElementById("submitAssignBtn").addEventListener("click", async (e) => {
    const projectId = e.target.getAttribute("data-id");
    await submitAssignment(projectId);
  });

  // Cerrar modal al hacer clic fuera del contenido
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

// Enviar asignación del proyecto
async function submitAssignment(projectId) {
  const assignType = document.getElementById("assignType").value;
  const analistaId = document.getElementById("analistaSelect").value;
  const brigadaId = document.getElementById("brigadaSelect").value;
  const comments = document.getElementById("assignComments").value;

  // Validar campos
  if (!assignType) {
    alert("Por favor, seleccione un tipo de asignación.");
    return;
  }

  if (assignType === "analista" && !analistaId) {
    alert("Por favor, seleccione un analista.");
    return;
  }

  if (assignType === "brigada" && !brigadaId) {
    alert("Por favor, seleccione una brigada.");
    return;
  }

  try {
    // Mostrar indicador de carga
    document.getElementById("submitAssignBtn").disabled = true;
    document.getElementById("submitAssignBtn").textContent = "Asignando...";

    // Obtener el proyecto actual
    const project = Storage.getProjectById(projectId);
    if (!project) {
      throw new Error("Proyecto no encontrado");
    }

    // Actualizar datos del proyecto
    project.estado = "Asignado";
    project.fechaAsignacion = new Date().toISOString();
    project.asignadoPor = currentUser.id;
    project.asignadoPorNombre = `${currentUser.nombre} ${currentUser.apellido || ''}`;
    project.instrucciones = comments || null;

    // Agregar información del asignado según el tipo
    if (assignType === "analista") {
      const analista = usersData.analistas.find((a) => a.id === analistaId);
      project.analistaId = analistaId;
      project.analistaNombre = analista ? `${analista.nombre} ${analista.apellido || ''}` : "Analista";
      project.brigadaId = null;
      project.brigadaNombre = null;
    } else {
      const brigada = usersData.brigadas.find((b) => b.id === brigadaId);
      project.brigadaId = brigadaId;
      project.brigadaNombre = brigada ? `${brigada.nombre} ${brigada.apellido || ''}` : "Brigada";
      project.analistaId = null;
      project.analistaNombre = null;
    }

    // Guardar proyecto actualizado
    Storage.saveProject(project);

    // Cerrar modal y actualizar lista
    document.getElementById("assignModal").style.display = "none";
    alert("Proyecto asignado correctamente.");

    // Recargar proyectos según la pestaña activa
    const activeTab = document.querySelector(".tab-button.active");
    if (activeTab) {
      const tabType = activeTab.getAttribute("data-tab");
      switch (tabType) {
        case "pending":
          loadPendingProjects();
          break;
        case "assigned":
          loadAssignedProjects();
          break;
        case "completed":
          loadCompletedProjects();
          break;
      }
    } else {
      loadPendingProjects();
    }
  } catch (error) {
    console.error("Error al asignar proyecto:", error);
    alert("Error al asignar el proyecto. Por favor, intente nuevamente.");
  } finally {
    // Restaurar botón
    document.getElementById("submitAssignBtn").disabled = false;
    document.getElementById("submitAssignBtn").textContent = "Asignar proyecto";
  }
}

// Abrir formulario de revisión de verificación
function openVerificationReviewForm(projectId) {
  const project = projectsData.find((p) => p.id === projectId);
  if (!project) return;

  const modal = document.getElementById("verificationReviewModal");
  const modalContent = document.getElementById("verificationReviewContent");

  modalContent.innerHTML = `
    <h2>Revisión de Verificación: ${project.nombre}</h2>
    
    <div class="verification-summary">
      <h3>Resumen de Verificación</h3>
      <p><strong>Estado:</strong> ${project.verificacion?.estado || "No disponible"}</p>
      <p><strong>Comentarios:</strong> ${project.verificacion?.comentarios || "Sin comentarios"}</p>
      <p><strong>Verificado por:</strong> ${project.verificacion?.analistaNombre || "No disponible"}</p>
      <p><strong>Fecha:</strong> ${project.verificacion?.fecha ? new Date(project.verificacion.fecha).toLocaleDateString() : "No disponible"}</p>
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
  `;

  modal.style.display = "block";

  // Configurar cierre del modal
  document.getElementById("closeVerificationReviewBtn").addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Configurar envío del formulario
  document.getElementById("approveVerificationBtn").addEventListener("click", async (e) => {
    const projectId = e.target.getAttribute("data-id");
    await approveVerification(projectId);
  });

  // Cerrar modal al hacer clic fuera del contenido
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

// Aprobar verificación y enviar a Ejecutiva
async function approveVerification(projectId) {
  const comments = document.getElementById("reviewComments").value;

  try {
    // Mostrar indicador de carga
    document.getElementById("approveVerificationBtn").disabled = true;
    document.getElementById("approveVerificationBtn").textContent = "Enviando...";

    // Obtener el proyecto actual
    const project = Storage.getProjectById(projectId);
    if (!project) {
      throw new Error("Proyecto no encontrado");
    }

    // Actualizar datos del proyecto
    project.estado = "En Revisión Ejecutiva";
    project.comentariosCoordinador = comments || null;
    project.fechaAprobacionCoordinador = new Date().toISOString();
    project.coordinadorId = currentUser.id;
    project.coordinadorNombre = `${currentUser.nombre} ${currentUser.apellido || ''}`;

    // Guardar proyecto actualizado
    Storage.saveProject(project);

    // Cerrar modal y actualizar lista
    document.getElementById("verificationReviewModal").style.display = "none";
    alert("Verificación aprobada y enviada a Ejecutiva correctamente.");

    // Recargar proyectos
    loadCompletedProjects();
  } catch (error) {
    console.error("Error al aprobar verificación:", error);
    alert("Error al aprobar la verificación. Por favor, intente nuevamente.");
  } finally {
    // Restaurar botón
    document.getElementById("approveVerificationBtn").disabled = false;
    document.getElementById("approveVerificationBtn").textContent = "Aprobar y enviar a Ejecutiva";
=======
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
>>>>>>> 20de416 (Descripción del cambio)
  }

<<<<<<< HEAD
// Cerrar sesión
function logout() {
  Storage.logout();
  window.location.href = "login.html";
}

// Exportar funciones para uso en HTML
window.logout = logout;
=======
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

>>>>>>> 20de416 (Descripción del cambio)
