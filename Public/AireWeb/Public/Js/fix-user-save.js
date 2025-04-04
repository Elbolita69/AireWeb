// Este script se puede añadir temporalmente para depurar y arreglar problemas con el guardado de usuarios
document.addEventListener("DOMContentLoaded", () => {
    console.log("Script de depuración cargado")
  
    // Verificar si Storage está disponible
    if (typeof Storage !== "undefined") {
      console.log("Storage está disponible")
    } else {
      console.error("Storage no está disponible")
    }
  
    // Verificar localStorage
    try {
      const testKey = "test_storage_" + Date.now()
      localStorage.setItem(testKey, "test")
      const testValue = localStorage.getItem(testKey)
      localStorage.removeItem(testKey)
  
      if (testValue === "test") {
        console.log("localStorage funciona correctamente")
      } else {
        console.error("localStorage no funciona correctamente")
      }
    } catch (e) {
      console.error("Error al acceder a localStorage:", e)
    }
  
    // Verificar si el botón existe
    const btnGuardarUsuario = document.getElementById("btnGuardarUsuario")
    if (btnGuardarUsuario) {
      console.log("Botón de guardar usuario encontrado")
  
      // Añadir un event listener directo
      btnGuardarUsuario.addEventListener("click", (e) => {
        console.log("Botón de guardar usuario clickeado")
        e.preventDefault()
  
        // Implementación directa de guardar usuario
        guardarUsuarioDirecto()
      })
    } else {
      console.error("Botón de guardar usuario no encontrado")
    }
  
    // Función para guardar usuario directamente
    function guardarUsuarioDirecto() {
      console.log("Función guardarUsuarioDirecto ejecutada")
  
      try {
        const form = document.getElementById("formUsuario")
        if (!form) {
          console.error("Formulario no encontrado")
          return
        }
  
        if (!form.checkValidity()) {
          form.reportValidity()
          return
        }
  
        const usuarioId = document.getElementById("usuarioId").value
        const usuario = {
          id: usuarioId || null,
          nombre: document.getElementById("nombre").value,
          nombreBrigada: document.getElementById("nombreBrigada").value || "",
          cargo: document.getElementById("cargo").value || "",
          correo: document.getElementById("correo").value,
          usuario: document.getElementById("usuario").value,
          password: document.getElementById("password").value,
          rol: document.getElementById("rol").value,
          sector: document.getElementById("sector").value || "",
          activo: true,
        }
  
        // Add PRST specific field if role is prst
        if (usuario.rol === "prst") {
          usuario.nombrePRST = document.getElementById("prstUsuario").value || ""
        }
  
        console.log("Datos del usuario a guardar:", usuario)
  
        // Guardar directamente en localStorage
        const usuarios = JSON.parse(localStorage.getItem("air_e_users") || "[]")
  
        // Verificar duplicados
        const usuarioExistente = usuarios.find((u) => u.usuario === usuario.usuario && (!usuarioId || u.id !== usuarioId))
        const correoExistente = usuarios.find((u) => u.correo === usuario.correo && (!usuarioId || u.id !== usuarioId))
  
        if (usuarioExistente) {
          alert("Ya existe un usuario con ese nombre de usuario.")
          return
        }
  
        if (correoExistente) {
          alert("Ya existe un usuario con ese correo electrónico.")
          return
        }
  
        // Si es un nuevo usuario, generar ID
        if (!usuario.id) {
          // Obtener contador
          const counter = JSON.parse(localStorage.getItem("air_e_counter") || '{"users":10}')
          usuario.id = (++counter.users).toString()
  
          // Guardar contador actualizado
          localStorage.setItem("air_e_counter", JSON.stringify(counter))
  
          // Añadir usuario al array
          usuarios.push(usuario)
        } else {
          // Actualizar usuario existente
          const index = usuarios.findIndex((u) => u.id === usuario.id)
          if (index !== -1) {
            usuarios[index] = usuario
          } else {
            usuarios.push(usuario)
          }
        }
  
        // Guardar usuarios actualizados
        localStorage.setItem("air_e_users", JSON.stringify(usuarios))
        console.log("Usuario guardado:", usuario)
  
        // Cerrar modal
        const modalUsuarioEl = document.getElementById("modalUsuario")
        if (modalUsuarioEl) {
          const modalUsuario = bootstrap.Modal.getInstance(modalUsuarioEl)
          if (modalUsuario) {
            modalUsuario.hide()
          } else {
            // Alternativa si no se puede obtener la instancia
            modalUsuarioEl.classList.remove("show")
            document.body.classList.remove("modal-open")
            document.querySelector(".modal-backdrop")?.remove()
          }
        }
  
        // Recargar tabla o página
        if (typeof cargarUsuarios === "function") {
          cargarUsuarios()
        } else {
          location.reload()
        }
  
        // Mostrar mensaje
        alert(`Usuario ${usuarioId ? "actualizado" : "creado"} correctamente.`)
      } catch (error) {
        console.error("Error al guardar usuario:", error)
        alert("Error al guardar usuario: " + error.message)
      }
    }
  
    // Initialize Bootstrap's Modal (assuming Bootstrap is included in your project)
    const bootstrap = window.bootstrap
  
    // Declare cargarUsuarios (assuming it's defined elsewhere in your project)
    // Example:
    // window.cargarUsuarios = function() { ... };
  })
  
  