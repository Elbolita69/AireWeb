// storage.js - Manejo de almacenamiento local para la aplicación

const Storage = {
  // Claves para localStorage
  KEYS: {
    USERS: "air_e_users",
    LOGGED_USER: "air_e_logged_user",
    PROJECTS: "air_e_projects",
    NOTIFICATIONS: "air_e_notifications",
    CENSUS: "air_e_census",
    COUNTER: "air_e_counter",
    PRST_LIST: "air_e_prst_list",
  },

  // Lista de PRST con nombres completos y cortos
  PRST_LIST: [
    { nombreCompleto: "AIRTEK CARRIER SERVICES S.A.S.", nombreCorto: "AIRTEK CARRIER SERVICES" },
    { nombreCompleto: "ALIADOS EN COMUNICACION NET", nombreCorto: "TOTAL CONEXION" },
    { nombreCompleto: "HB TV NET S.A.S.", nombreCorto: "TVNET" },
    { nombreCompleto: "HOGARNET COMUNICACIONES S.A.S.", nombreCorto: "HOGARNET" },
    { nombreCompleto: "INTELEXA DE COLOMBIA S.A.S", nombreCorto: "INTELEXA DE COLOMBIA" },
    { nombreCompleto: "INTER REDES DEL MAGDALENA S.A.S", nombreCorto: "INTER REDES DEL MAGDALENA" },
    { nombreCompleto: "INTERNEXT COLOMBIA S.A.S", nombreCorto: "INTERNEXT" },
    { nombreCompleto: "INTERTEL SATELITAL S.A.S", nombreCorto: "INTERTEL SATELITAL" },
    { nombreCompleto: "MACITEL S.A.S", nombreCorto: "MACITEL" },
    { nombreCompleto: "MEDIA COMMERCE PARTNERS S.A.S.", nombreCorto: "MEDIA COMMERCE" },
    { nombreCompleto: "MEGATEL DE COLOMBIA S.A.S", nombreCorto: "MEGATEL" },
    { nombreCompleto: "NOVACLICK S.A.S", nombreCorto: "NOVACLICK" },
    { nombreCompleto: "PROMOTORA DE TELEVISION, INTERNET Y COMUNICACIONES S.A.S.", nombreCorto: "PROMO VISIÓN" },
    { nombreCompleto: "R&R TELECOMUNICACIONES S.A.S", nombreCorto: "R&R TELECOMUNICACIONES" },
    { nombreCompleto: "RAPILINK S.A.S", nombreCorto: "RAPILINK" },
    {
      nombreCompleto: "REDES TELECOMUNICACIONES DIGITALES DE COLOMBIA S.A.S.",
      nombreCorto: "REDES TELECOMUNICACIONES DIGITALES DE COLOMBIA",
    },
    { nombreCompleto: "SAVASA SOLUCIONES INTEGRALES S.A.S", nombreCorto: "SAVASA SOLUCIONES INTEGRALES" },
    { nombreCompleto: "WAYIRANET S.A.S", nombreCorto: "WAYIRANET" },
    { nombreCompleto: "WIPLUS COMUNICACIONES DE COLOMBIA S.A.S", nombreCorto: "WIPLUS COMUNICACIONES DE COLOMBIA" },
    { nombreCompleto: "TUNORTETV TELECOMUNICACIONES S.A.S.", nombreCorto: "TUNORTETV TELECOMUNICACIONES" },
    { nombreCompleto: "INTERCONEXIONES TECNOLOGICAS DEL CARIBE SAS (INTERCON)", nombreCorto: "INTERCON" },
    { nombreCompleto: "UNE EPM TELECOMUNICACIONES S.A.", nombreCorto: "TIGO" },
    { nombreCompleto: "QUEST TELECOM COLOMBIA S.A.S", nombreCorto: "QUEST TELECOM" },
    { nombreCompleto: "BITEL DE COLOMBIA SAS", nombreCorto: "DIGITAL COAST" },
    { nombreCompleto: "DIGITAL COAST S.A.S", nombreCorto: "MEGA TV" },
    { nombreCompleto: "JR REDES DEL CARIBE S.A.S.", nombreCorto: "JR REDES" },
    { nombreCompleto: "FENIX SOLUTION WIRELESS S.A.S.", nombreCorto: "FENIX" },
    { nombreCompleto: "APC LINK S.A.S.", nombreCorto: "APC LINK" },
    { nombreCompleto: "AULAS DIGITALES DE COLOMBIA S.A.S.", nombreCorto: "AUDICOL" },
    { nombreCompleto: "CABLE EXPRESS DE COLOMBIA LTDA", nombreCorto: "CABLE EXPRESS" },
    { nombreCompleto: "CABLE HOGAR.NET S.A.S.", nombreCorto: "CABLE HOGAR.NET" },
    { nombreCompleto: "INVERSIONES ACOSTA VERGARA", nombreCorto: "INVERSIONES ACOSTA VERGARA" },
    { nombreCompleto: "JALU SOLUCIONES S.A.S", nombreCorto: "JALU SOLUCIONES" },
    { nombreCompleto: "SOLUCIONES DANTEL S.A.S", nombreCorto: "SOLUCIONES DANTEL" },
    { nombreCompleto: "SOLUCIONES DE INGENIERIA E-VOLT TECK S.A.S", nombreCorto: "E-VOLT TECK" },
    { nombreCompleto: "SOLUCIONES ESTRATEGICAS DE TELECOMUNICACIONES S.A.S", nombreCorto: "SEGITEL" },
    { nombreCompleto: "SPACE COMUNICACIONES S.A.S.", nombreCorto: "SPACE COMUNICACIONES" },
    { nombreCompleto: "TV COMUNICACIONES JL S.A.S", nombreCorto: "TV COMUNICACIONES JL" },
    { nombreCompleto: "TV LINE S.A.S", nombreCorto: "TV LINE" },
    { nombreCompleto: "TV ZONA BANANERA S.A.S", nombreCorto: "TV ZONA BANANERA" },
    { nombreCompleto: "VENTELCO S.A.S", nombreCorto: "VENTELCO" },
    { nombreCompleto: "AZTECA COMUNICACIONES COLOMBIA S.A.S", nombreCorto: "AZTECA" },
    { nombreCompleto: "CABLE GUAJIRA LTDA", nombreCorto: "CABLE GUAJIRA" },
    { nombreCompleto: "COOPERATIVA MULTIACTIVA DE SERVICIOS INTEGRALES COOSUMA", nombreCorto: "COOSUMA" },
    { nombreCompleto: "LIWA S.A.S.", nombreCorto: "LIWA" },
    { nombreCompleto: "PARTNERS TELECOM COLOMBIA S.A.S.", nombreCorto: "WOM" },
    { nombreCompleto: "SP SISTEMAS PALACIOS LTDA.", nombreCorto: "SP SISTEMAS PALACIOS" },
    { nombreCompleto: "WORLD CONNECTIONS S.A.S", nombreCorto: "WORLD CONNECTIONS" },
    { nombreCompleto: "SUPERCABLE TELECOMUNICACIONES S.A.S.", nombreCorto: "SUPERCABLE TELECOMUNICACIONES" },
    { nombreCompleto: "LIBERTY NETWORKS DE COLOMBIA S.A.S.", nombreCorto: "C&W NETWORK" },
    { nombreCompleto: "INVERSIONES RODRIGUEZ MEJIA S.A.S.", nombreCorto: "INVERSIONES RODRIGUEZ MEJIA" },
    { nombreCompleto: "CARIBE INTERCOMUNICACIONES S.A.S.", nombreCorto: "CARIBE INTERCOMUNICACIONES" },
    { nombreCompleto: "CARIBETECH S.A.S", nombreCorto: "CARIBETECH" },
    { nombreCompleto: "DATA LAN S.A.S.", nombreCorto: "DATA LAN" },
    { nombreCompleto: "DIALNET DE COLOMBIA S.A. E.S.P.", nombreCorto: "DIALNET" },
    { nombreCompleto: "EME INGENIERIA S.A.", nombreCorto: "EME INGENIERIA" },
    { nombreCompleto: "EMPRESA DE TELECOMUNICACIONES DE LA COSTA COSTATEL S.A E.S.P", nombreCorto: "COSTATEL" },
    { nombreCompleto: "INTERCAR.NET S.A.S", nombreCorto: "INTERCAR.NET" },
    { nombreCompleto: "INTERCARIBE TV S.A.S.", nombreCorto: "CABLE EXITO" },
    { nombreCompleto: "INTERMAIC.NET 1 SAS", nombreCorto: "INTERMAIC.NET" },
    {
      nombreCompleto: "INTERNET Y TELECOMUNICACIONES DE COLOMBIA S.A.S",
      nombreCorto: "INTERNET Y TELECOMUNICACIONES DE COLOMBIA",
    },
    { nombreCompleto: "STARCOM CARIBE S.A.S", nombreCorto: "STARCOM CARIBE" },
    { nombreCompleto: "TELECOMUNICACIONES ZONA BANANERA S.A.S", nombreCorto: "TELECOMUNICACIONES ZONA BANANERA" },
    { nombreCompleto: "ETB - EMPRESA DE TELECOMUNICACIONES DE BOGOTA SA ESP", nombreCorto: "ETB" },
    { nombreCompleto: "CIRION TECHNOLOGIES COLOMBIA S.A.S", nombreCorto: "CIRION TECHNOLOGIES COLOMBIA" },
    { nombreCompleto: "COMUNICACION CELULAR COMCEL S.A", nombreCorto: "CLARO" },
    { nombreCompleto: "COMUNET TELECOMUNICACIONES S.A.S.", nombreCorto: "COMUNET TELECOMUNICACIONES" },
    {
      nombreCompleto: "COMUNICACIONES TERRESTRES DE COLOMBIA S.A.S.",
      nombreCorto: "COMUNICACIONES TERRESTRES DE COLOMBIA",
    },
    { nombreCompleto: "DIGITVNET S.A.S", nombreCorto: "DIGITVNET" },
    { nombreCompleto: "DRACO NET S.A.S", nombreCorto: "DRACO NET" },
    { nombreCompleto: "ECONEXION S.A.S", nombreCorto: "ECONEXION" },
    { nombreCompleto: "ELECNORTE S.A", nombreCorto: "ELECNORTE" },
    { nombreCompleto: "JHOSDY TELECOMUNICACIONES S.A.S", nombreCorto: "JHOSDY TELECOMUNICACIONES" },
    { nombreCompleto: "LOGISTICA EN TELECOMUNICACIONES S.A.S", nombreCorto: "LOGISTICA EN TELECOMUNICACIONES" },
    { nombreCompleto: "SOLUNET DIGITAL S.A.S.", nombreCorto: "SOLUNET DIGITAL" },
    { nombreCompleto: "ITELKOM S.A.S.", nombreCorto: "ITELKOM" },
    { nombreCompleto: "ATP FIBER COLOMBIA S.A.S", nombreCorto: "ATP FIBER" },
    { nombreCompleto: "CONETTA S.A.S", nombreCorto: "CONETTA" },
    { nombreCompleto: "GLOBAL TIC SAS", nombreCorto: "GLOBAL TIC" },
    {
      nombreCompleto: "TECOLRADIO TECNOLOGIA COLOMBIANA DE RADIO COMUNICACIONES S.A.S.",
      nombreCorto: "TECOLRADIO",
    },
    { nombreCompleto: "INTSOFTV S.A.S", nombreCorto: "INTSOFTV" },
    { nombreCompleto: "AJFIBER.NET SAS", nombreCorto: "AJFIBER.NET" },
    { nombreCompleto: "GIGAREDTELECOMUNICACIONES S.A.S", nombreCorto: "GIGARED" },
    { nombreCompleto: "CYV NETWORKS S.A.S", nombreCorto: "CYV NETWORKS" },
    { nombreCompleto: "AWATA WIRELESS S.A.S.", nombreCorto: "AWATA" },
    { nombreCompleto: "TPE COMUNICACIONES COLOMBIA S.A.S.", nombreCorto: "TPE COMUNICACIONES" },
    {
      nombreCompleto: "CONSTRUCCIÓN, GESTIÓN, VELOCIDAD Y ESTRATEGIAS DE TELECOMUNICACIONES SAS",
      nombreCorto: "CGVE",
    },
    { nombreCompleto: "ALCALDIA MUNICIPAL DE MAICAO", nombreCorto: "ALCALDIA MUNICIPAL DE MAICAO" },
    { nombreCompleto: "ALCALDIA DE SANTA MARTA", nombreCorto: "ALCALDIA DE SANTA MARTA" },
    { nombreCompleto: "FIBRAZO S.A.S.", nombreCorto: "FIBRAZO" },
    { nombreCompleto: "UFINET COLOMBIA S.A.", nombreCorto: "UFINET" },
    { nombreCompleto: "INTERNEXA S.A", nombreCorto: "INTERNEXA" },
    { nombreCompleto: "MOVISTAR", nombreCorto: "MOVISTAR" },
  ],

  // Inicializar el almacenamiento
  init: function () {
    // Limpiar localStorage para asegurar que se creen los usuarios correctamente
    // (Solo para desarrollo, quitar en producción)
    // localStorage.clear()

    // Guardar la lista de PRST
    localStorage.setItem(this.KEYS.PRST_LIST, JSON.stringify(this.PRST_LIST))

    // Verificar si ya existen datos
    if (!localStorage.getItem(this.KEYS.USERS)) {
      // Crear usuarios por defecto
      const defaultUsers = [
        {
          id: "1",
          nombre: "Jorge",
          apellido: "Ditta",
          usuario: "jditta",
          correo: "jditta@aire.com",
          password: "admin123",
          rol: "admin",
          activo: true,
        },
        {
          id: "2",
          nombre: "Juan",
          apellido: "Pérez",
          usuario: "jperez",
          correo: "jperez@aire.com",
          password: "prst123",
          rol: "prst",
          nombrePRST: "Claro",
          cedula: "1234567890",
          matriculaProfesional: "MP-12345",
          direccion: "Calle 123 #45-67",
          barrio: "Centro",
          ciudad: "Barranquilla",
          celular: "3001234567",
          activo: true,
        },
        {
          id: "3",
          nombre: "Ester",
          apellido: "Pacheco",
          usuario: "epacheco",
          correo: "epacheco@aire.com",
          password: "prst123",
          rol: "prst",
          nombrePRST: "cable expres",
          cedula: "0987654321",
          matriculaProfesional: "MP-12345",
          direccion: "Carrera 321 #67-45",
          barrio: "Centro",
          ciudad: "Barranquilla",
          celular: "3002234567",
          activo: true,
        },
        {
          id: "4",
          nombre: "Maria Isabel",
          apellido: "Jimenez Beleño",
          usuario: "mjimenez",
          correo: "mjimenez@aire.com",
          password: "ejecutiva123",
          rol: "ejecutiva",
          responsablePRST: [
            "AIRTEK CARRIER SERVICES",
            "TOTAL CONEXION",
            "TVNET",
            "HOGARNET",
            "INTELEXA DE COLOMBIA",
            "INTER REDES DEL MAGDALENA",
            "INTERNEXT",
            "INTERTEL SATELITAL",
            "MACITEL",
            "MEDIA COMMERCE",
            "MEGATEL",
            "NOVACLICK",
            "PROMO VISIÓN",
            "R&R TELECOMUNICACIONES",
            "RAPILINK",
            "REDES TELECOMUNICACIONES DIGITALES DE COLOMBIA",
            "SAVASA SOLUCIONES INTEGRALES",
            "WAYIRANET",
            "WIPLUS COMUNICACIONES DE COLOMBIA",
            "TUNORTETV TELECOMUNICACIONES",
            "INTERCON",
            "TIGO",
            "QUEST TELECOM",
            "DIGITAL COAST",
            "MEGA TV",
            "JR REDES",
            "FENIX",
          ],
          activo: true,
        },
        {
          id: "5",
          nombre: "Maria Jose",
          apellido: "Blanco Ochoa",
          usuario: "mblanco",
          correo: "mblanco@aire.com",
          password: "ejecutiva123",
          rol: "ejecutiva",
          responsablePRST: [
            "APC LINK",
            "AUDICOL",
            "CABLE EXPRESS",
            "CABLE HOGAR.NET",
            "INVERSIONES ACOSTA VERGARA",
            "JALU SOLUCIONES",
            "SOLUCIONES DANTEL",
            "E-VOLT TECK",
            "SEGITEL",
            "SPACE COMUNICACIONES",
            "TV COMUNICACIONES JL",
            "TV LINE",
            "TV ZONA BANANERA",
            "VENTELCO",
            "AZTECA",
            "CABLE GUAJIRA",
            "COOSUMA",
            "LIWA",
            "WOM",
            "SP SISTEMAS PALACIOS",
            "WORLD CONNECTIONS",
            "SUPERCABLE TELECOMUNICACIONES",
            "C&W NETWORK",
            "INVERSIONES RODRIGUEZ MEJIA",
          ],
          activo: true,
        },
        {
          id: "6",
          nombre: "Claudia Patricia",
          apellido: "Villegas Duque",
          usuario: "cvillegas",
          correo: "cvillegas@aire.com",
          password: "ejecutiva123",
          rol: "ejecutiva",
          responsablePRST: [
            "CARIBE INTERCOMUNICACIONES",
            "CARIBETECH",
            "DATA LAN",
            "DIALNET",
            "EME INGENIERIA",
            "COSTATEL",
            "INTERCAR.NET",
            "CABLE EXITO",
            "INTERMAIC.NET",
            "INTERNET Y TELECOMUNICACIONES DE COLOMBIA",
            "STARCOM CARIBE",
            "TELECOMUNICACIONES ZONA BANANERA",
            "ETB",
          ],
          activo: true,
        },
        {
          id: "7",
          nombre: "Sheylla",
          apellido: "Medina Garcia",
          usuario: "smedina",
          correo: "smedina@aire.com",
          password: "ejecutiva123",
          rol: "ejecutiva",
          responsablePRST: [
            "CIRION TECHNOLOGIES COLOMBIA",
            "CLARO",
            "COMUNET TELECOMUNICACIONES",
            "COMUNICACIONES TERRESTRES DE COLOMBIA",
            "DIGITVNET",
            "DRACO NET",
            "ECONEXION",
            "ELECNORTE",
            "JHOSDY TELECOMUNICACIONES",
            "LOGISTICA EN TELECOMUNICACIONES",
            "SOLUNET DIGITAL",
            "ITELKOM",
            "ATP FIBER",
            "CONETTA",
            "GLOBAL TIC",
            "TECOLRADIO",
            "INTSOFTV",
            "AJFIBER.NET",
            "GIGARED",
            "CYV NETWORKS",
            "AWATA",
            "TPE COMUNICACIONES",
            "CGVE",
            "ALCALDIA MUNICIPAL DE MAICAO",
            "ALCALDIA DE SANTA MARTA",
            "FIBRAZO",
            "UFINET",
            "INTERNEXA",
            "MOVISTAR",
          ],
          activo: true,
        },
        {
          id: "8",
          nombre: "Herbert Ale",
          apellido: "Petano Baleta",
          usuario: "hpetano",
          correo: "hpetano@aire.com",
          password: "coordinador123",
          rol: "coordinador",
          tipoCoordinador: "administrativo",
          activo: true,
        },
        {
          id: "9",
          nombre: "Wadith Alejandro",
          apellido: "Castillo Ramirez",
          usuario: "wcastillo",
          correo: "wcastillo@aire.com",
          password: "coordinador123",
          rol: "coordinador",
          tipoCoordinador: "operativo",
          activo: true,
        },
        {
          id: "10",
          nombre: "Eric",
          apellido: "ejemplo",
          usuario: "eejemplo",
          correo: "eejemplo@aire.com",
          password: "coordinador123",
          rol: "coordinador",
          tipoCoordinador: "censo",
          activo: true,
        },
        {
          id: "11",
          nombre: "Marcos",
          apellido: "Márquez",
          usuario: "mmarquez",
          correo: "mmarquez@aire.com",
          password: "analista123",
          rol: "analista",
          activo: true,
        },
        {
          id: "12",
          nombre: "Esteban",
          apellido: "Gomez",
          usuario: "egomez",
          correo: "egomez@aire.com",
          password: "analista1234",
          rol: "analista",
          activo: true,
        },
        {
          id: "13",
          nombre: "Richard",
          apellido: "de Lima Guette",
          usuario: "rlima",
          correo: "rlima@aire.com",
          password: "brigada123",
          rol: "brigada",
          departamento: "Atlantico",
          activo: true,
        },
        {
          id: "14",
          nombre: "Carlos Andrés",
          apellido: "Ospina",
          usuario: "cospina",
          correo: "cospina@aire.com",
          password: "brigada123",
          rol: "brigada",
          departamento: "Magdalena",
          activo: true,
        },
        {
          id: "15",
          nombre: "Senén",
          apellido: "Alcides",
          usuario: "salcides",
          correo: "salcides@aire.com",
          password: "brigada123",
          rol: "brigada",
          departamento: "Magdalena",
          activo: true,
        },
        {
          id: "16",
          nombre: "Yair Nicolas",
          apellido: "Redondo Epiayu",
          usuario: "yredondo",
          correo: "yredondo@aire.com",
          password: "brigada123",
          rol: "brigada",
          departamento: "La Guajira",
          activo: true,
        },
      ]

      localStorage.setItem(this.KEYS.USERS, JSON.stringify(defaultUsers))
    }

    if (!localStorage.getItem(this.KEYS.PROJECTS)) {
      localStorage.setItem(this.KEYS.PROJECTS, JSON.stringify([]))
    }

    if (!localStorage.getItem(this.KEYS.NOTIFICATIONS)) {
      localStorage.setItem(this.KEYS.NOTIFICATIONS, JSON.stringify([]))
    }

    if (!localStorage.getItem(this.KEYS.CENSUS)) {
      localStorage.setItem(this.KEYS.CENSUS, JSON.stringify([]))
    }

    if (!localStorage.getItem(this.KEYS.COUNTER)) {
      localStorage.setItem(
        this.KEYS.COUNTER,
        JSON.stringify({
          projects: 1000,
          notifications: 1000,
          census: 1000,
          users: 10,
        }),
      )
    }

    // Imprimir usuarios para depuración
    console.log("Usuarios inicializados:", this.getUsers())
  },

  // Obtener todos los usuarios
  getUsers: function () {
    return JSON.parse(localStorage.getItem(this.KEYS.USERS) || "[]")
  },

  // Obtener usuario por ID
  getUserById: function (id) {
    const users = this.getUsers()
    return users.find((user) => user.id === id)
  },

  // Obtener usuario por correo
  getUserByEmail: function (email) {
    const users = this.getUsers()
    return users.find((user) => user.correo === email)
  },

  // Guardar usuario - versión mejorada con manejo de errores
  saveUser: function (user) {
    try {
      console.log("Storage.saveUser llamado con:", user)
      const users = this.getUsers()
      console.log("Usuarios actuales:", users)

      // Si no tiene ID, es un nuevo usuario
      if (!user.id) {
        const counter = this.getCounter()
        user.id = (++counter.users).toString()
        console.log("Nuevo ID generado:", user.id)
        this.saveCounter(counter)
        users.push(user)
      } else {
        // Actualizar usuario existente
        const index = users.findIndex((u) => u.id === user.id)
        if (index !== -1) {
          users[index] = user
          console.log("Usuario actualizado en posición:", index)
        } else {
          users.push(user)
          console.log("Usuario existente añadido como nuevo")
        }
      }

      console.log("Guardando usuarios en localStorage:", users)
      localStorage.setItem(this.KEYS.USERS, JSON.stringify(users))
      console.log("Usuario guardado exitosamente")
      return user
    } catch (error) {
      console.error("Error en Storage.saveUser:", error)
      throw error
    }
  },

  // Eliminar usuario
  deleteUser: function (id) {
    const users = this.getUsers()
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
      users.splice(index, 1)
      localStorage.setItem(this.KEYS.USERS, JSON.stringify(users))
      return true
    }

    return false
  },

  // Autenticar usuario
  authenticateUser: function (email, password) {
    const users = this.getUsers()
    const user = users.find((u) => u.correo === email && u.password === password && u.activo)

    if (user) {
      // Add last login timestamp
      user.lastLogin = new Date().toISOString()

      // Update user in storage with last login
      this.saveUser(user)

      // Set as logged user
      this.setLoggedUser(user)
      return user
    }

    return null
  },

  // Establecer usuario logueado
  setLoggedUser: function (user) {
    localStorage.setItem(this.KEYS.LOGGED_USER, JSON.stringify(user))
  },

  // Obtener usuario logueado
  getLoggedUser: function () {
    return JSON.parse(localStorage.getItem(this.KEYS.LOGGED_USER))
  },

  // Cerrar sesión
  logout: function () {
    localStorage.removeItem(this.KEYS.LOGGED_USER)
  },

  // Obtener todos los proyectos
  getProjects: function () {
    return JSON.parse(localStorage.getItem(this.KEYS.PROJECTS) || "[]")
  },

  // Obtener proyecto por ID
  getProjectById: function (id) {
    const projects = this.getProjects()
    return projects.find((project) => project.id === id)
  },

  // Obtener lista de PRST
  getPRSTList: function () {
    return JSON.parse(localStorage.getItem(this.KEYS.PRST_LIST) || "[]")
  },

  // Obtener nombre corto de PRST por nombre completo
  getPRSTShortName: function (fullName) {
    const prstList = this.getPRSTList()
    const prst = prstList.find((p) => p.nombreCompleto === fullName)
    return prst ? prst.nombreCorto : fullName
  },

  // Guardar proyecto
  // Dentro del objeto Storage, modificar el método saveProject:
<<<<<<< HEAD
=======
  // Modificar el método saveProject para usar el nuevo ID
>>>>>>> 20de416 (Descripción del cambio)
  saveProject: function (project) {
    const projects = this.getProjects()

    try {
      // Si no tiene ID, es un nuevo proyecto
      if (!project.id) {
<<<<<<< HEAD
        // Generar el ID personalizado
        project.id = this.generateProjectId(project)

        // Incrementar contador
        const counter = this.getCounter()
        counter.projects += 1
        this.saveCounter(counter)

=======
        // Generar el ID secuencial
        project.id = this.generateProjectId(project.prstNombre)

        // Incrementar contador
        const counter = this.getCounter()
        counter.projects++
        this.saveCounter(counter)

        // Establecer fecha de creación
        project.fechaCreacion = new Date().toISOString()
        project.estado = "Nuevo"

>>>>>>> 20de416 (Descripción del cambio)
        projects.push(project)

        // Crear notificación
        this.createNotification({
          usuarioId: project.creadorId,
          tipo: "proyecto_creado",
          mensaje: `Has creado el proyecto "${project.nombre}" con ID ${project.id}.`,
          fechaCreacion: new Date().toISOString(),
          leido: false,
        })
      } else {
        // Actualizar proyecto existente
        const index = projects.findIndex((p) => p.id === project.id)
        if (index !== -1) {
<<<<<<< HEAD
          projects[index] = project

          // Crear notificación
          this.createNotification({
            usuarioId: project.creadorId,
            tipo: "proyecto_actualizado",
            mensaje: `El proyecto "${project.nombre}" con ID ${project.id} ha sido actualizado.`,
            fechaCreacion: new Date().toISOString(),
            leido: false,
          })
        } else {
          projects.push(project)
        }
      }

      localStorage.setItem(this.KEYS.PROJECTS, JSON.stringify(projects))
      return project
    } catch (error) {
      console.error("Error en saveProject:", error)
      throw error // Re-lanzar el error para manejarlo en prst.js
    }
  },

  // Añadir este nuevo método al objeto Storage:
  generateProjectId: function (project) {
    // Obtener el usuario PRST que crea el proyecto
    const creator = this.getUserById(project.creadorId)
    if (!creator || creator.rol !== "prst") {
      throw new Error("El proyecto debe ser creado por un PRST")
    }

    // 1. PRST (nombrePRST en mayúsculas, reemplazar espacios con _)
    const prstPart = creator.nombrePRST ? creator.nombrePRST.toUpperCase().replace(/\s+/g, "_") : "PRST"

    // 2. Departamento (código según el departamento del proyecto)
    let deptCode = "UNK"
    switch (project.departamento?.toUpperCase()) {
      case "ATLÁNTICO":
      case "ATLANTICO":
        deptCode = "ALT"
        break
      case "MAGDALENA":
        deptCode = "MAG"
        break
      case "LA GUAJIRA":
      case "GUAJIRA":
        deptCode = "LA"
        break
    }

    // 3. Mes y año actual
    const now = new Date()
    const monthNames = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"]
    const monthPart = monthNames[now.getMonth()]
    const yearPart = now.getFullYear()

    // 4. Número continuo (contar proyectos existentes con mismo PRST, departamento y periodo)
    const existingProjects = this.getProjects().filter((p) => {
      const parts = p.id.split("_")
      return (
        parts.length >= 4 && parts[0] === prstPart && parts[1] === deptCode && parts[2] === `${monthPart}.${yearPart}`
      )
    })

    const sequentialNumber = existingProjects.length + 1

    // Construir el ID completo
    return `${prstPart}_${deptCode}_${monthPart}.${yearPart}_${sequentialNumber}`
=======
          // Guardar la fecha de creación original
          const originalCreationDate = projects[index].fechaCreacion
          project.fechaCreacion = originalCreationDate

          // Actualizar proyecto
          project.fechaActualizacion = new Date().toISOString()
          projects[index] = project

          // Crear notificación
          this.createNotification({
            usuarioId: project.creadorId,
            tipo: "proyecto_actualizado",
            mensaje: `El proyecto "${project.nombre}" con ID ${project.id} ha sido actualizado.`,
            fechaCreacion: new Date().toISOString(),
            leido: false,
          })
        } else {
          // Esto no debería ocurrir, pero por si acaso
          projects.push(project)
        }
      }

      localStorage.setItem(this.KEYS.PROJECTS, JSON.stringify(projects))
      return project
    } catch (error) {
      console.error("Error en saveProject:", error)
      throw error
    }
  },

  // Añadir este nuevo método al objeto Storage:
  generateProjectId: function (prstName) {
    // Obtener el nombre corto del PRST
    const prstShortName = this.getPRSTShortName(prstName)

    // Obtener el contador actual
    const counter = this.getCounter()
    const nextId = counter.projects + 1

    // Generar el ID con el formato "NOMBRE_CORTO_CONTINUIDAD"
    return `${prstShortName}_${nextId}`
>>>>>>> 20de416 (Descripción del cambio)
  },

  // Eliminar proyecto
  deleteProject: function (id) {
    const projects = this.getProjects()
    const index = projects.findIndex((project) => project.id === id)

    if (index !== -1) {
      projects.splice(index, 1)
      localStorage.setItem(this.KEYS.PROJECTS, JSON.stringify(projects))
      return true
    }

    return false
  },

  // Obtener todas las notificaciones
  getNotifications: function () {
    return JSON.parse(localStorage.getItem(this.KEYS.NOTIFICATIONS) || "[]")
  },

  // Obtener notificaciones por usuario
  getNotificationsByUser: function (userId) {
    const notifications = this.getNotifications()
    return notifications.filter((notification) => notification.usuarioId === userId)
  },

  // Crear notificación
  createNotification: function (notification) {
    const notifications = this.getNotifications()

    // Si no tiene ID, es una nueva notificación
    if (!notification.id) {
      const counter = this.getCounter()
      notification.id = (++counter.notifications).toString()
      this.saveCounter(counter)
    }

    notifications.push(notification)
    localStorage.setItem(this.KEYS.NOTIFICATIONS, JSON.stringify(notifications))
    return notification
  },

  // Marcar notificación como leída
  markNotificationAsRead: function (id) {
    const notifications = this.getNotifications()
    const index = notifications.findIndex((notification) => notification.id === id)

    if (index !== -1) {
      notifications[index].leido = true
      localStorage.setItem(this.KEYS.NOTIFICATIONS, JSON.stringify(notifications))
      return true
    }

    return false
  },

  // Marcar todas las notificaciones de un usuario como leídas
  markAllNotificationsAsRead: function (userId) {
    const notifications = this.getNotifications()
    let updated = false

    notifications.forEach((notification) => {
      if (notification.usuarioId === userId && !notification.leido) {
        notification.leido = true
        updated = true
      }
    })

    if (updated) {
      localStorage.setItem(this.KEYS.NOTIFICATIONS, JSON.stringify(notifications))
    }

    return updated
  },

  // Obtener contador
  getCounter: function () {
    return JSON.parse(
      localStorage.getItem(this.KEYS.COUNTER) || '{"projects":1000,"notifications":1000,"census":1000,"users":10}',
    )
  },

  // Guardar contador
  saveCounter: function (counter) {
    localStorage.setItem(this.KEYS.COUNTER, JSON.stringify(counter))
  },

  // Modify or add the getUserByUsername method to ensure PRST users can log in
  getUserByUsername: function (username) {
    const users = this.getUsers()
    return users.find((user) => user.usuario === username)
  },
}

