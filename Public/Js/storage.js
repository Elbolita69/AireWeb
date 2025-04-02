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
  },

  // Inicializar el almacenamiento
  init: function () {
    // Limpiar localStorage para asegurar que se creen los usuarios correctamente
    // (Solo para desarrollo, quitar en producción)
    // localStorage.clear()

    // Verificar si ya existen datos
    if (!localStorage.getItem(this.KEYS.USERS)) {
      // Crear usuarios por defecto
      const defaultUsers = [
        {
          id: "1",
          nombre: "Admin",
          apellido: "Sistema",
          correo: "admin@aire.com",
          password: "admin123",
          rol: "admin",
          activo: true,
        },
        {
          id: "2",
          nombre: "Juan",
          apellido: "Pérez",
          correo: "prst@aire.com",
          password: "prst123",
          rol: "prst",
          nombrePRST: "Telecom Solutions",
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
          nombre: "María",
          apellido: "González",
          correo: "ejecutiva@aire.com",
          password: "ejecutiva123",
          rol: "ejecutiva",
          activo: true,
        },
        {
          id: "4",
          nombre: "Carlos",
          apellido: "Rodríguez",
          correo: "coordinador-admin@aire.com",
          password: "coordinador123",
          rol: "coordinador",
          tipoCoordinador: "administrativo",
          activo: true,
        },
        {
          id: "5",
          nombre: "Pedro",
          apellido: "Gómez",
          correo: "coordinador-op@aire.com",
          password: "coordinador123",
          rol: "coordinador",
          tipoCoordinador: "operativo",
          activo: true,
        },
        {
          id: "6",
          nombre: "Laura",
          apellido: "Díaz",
          correo: "coordinador-censo@aire.com",
          password: "coordinador123",
          rol: "coordinador",
          tipoCoordinador: "censo",
          activo: true,
        },
        {
          id: "7",
          nombre: "Ana",
          apellido: "Martínez",
          correo: "analista@aire.com",
          password: "analista123",
          rol: "analista",
          activo: true,
        },
        {
          id: "8",
          nombre: "Brigada",
          apellido: "Censo",
          correo: "brigada@aire.com",
          password: "brigada123",
          rol: "brigada",
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

  // Guardar usuario
  saveUser: function (user) {
    const users = this.getUsers()

    // Si no tiene ID, es un nuevo usuario
    if (!user.id) {
      const counter = this.getCounter()
      user.id = (++counter.users).toString()
      this.saveCounter(counter)
      users.push(user)
    } else {
      // Actualizar usuario existente
      const index = users.findIndex((u) => u.id === user.id)
      if (index !== -1) {
        users[index] = user
      } else {
        users.push(user)
      }
    }

    localStorage.setItem(this.KEYS.USERS, JSON.stringify(users))
    return user
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

  // Guardar proyecto
  // Dentro del objeto Storage, modificar el método saveProject:
  saveProject: function (project) {
    const projects = this.getProjects()
    
    try {
      // Si no tiene ID, es un nuevo proyecto
      if (!project.id) {
        // Generar el ID personalizado
        project.id = this.generateProjectId(project)
        
        // Incrementar contador
        const counter = this.getCounter()
        counter.projects += 1
        this.saveCounter(counter)
        
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
generateProjectId: function(project) {
    // Obtener el usuario PRST que crea el proyecto
    const creator = this.getUserById(project.creadorId)
    if (!creator || creator.rol !== "prst") {
        throw new Error("El proyecto debe ser creado por un PRST")
    }
    
    // 1. PRST (nombrePRST en mayúsculas, reemplazar espacios con _)
    const prstPart = creator.nombrePRST 
        ? creator.nombrePRST.toUpperCase().replace(/\s+/g, '_')
        : "PRST"
    
    // 2. Departamento (código según el departamento del proyecto)
    let deptCode = "UNK"
    switch(project.departamento?.toUpperCase()) {
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
    const monthNames = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", 
                       "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"]
    const monthPart = monthNames[now.getMonth()]
    const yearPart = now.getFullYear()
    
    // 4. Número continuo (contar proyectos existentes con mismo PRST, departamento y periodo)
    const existingProjects = this.getProjects().filter(p => {
        const parts = p.id.split('_')
        return parts.length >= 4 && 
               parts[0] === prstPart && 
               parts[1] === deptCode && 
               parts[2] === `${monthPart}.${yearPart}`
    })
    
    const sequentialNumber = existingProjects.length + 1
    
    // Construir el ID completo
    return `${prstPart}_${deptCode}_${monthPart}.${yearPart}_${sequentialNumber}`
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
}

