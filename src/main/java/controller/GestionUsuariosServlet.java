package controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import dao.UsuarioDAO;
import modelo.Usuario;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

// Esta anotación mapea el servlet a la URL "/usuarios"
@WebServlet("/GestionUsuariosServlet")
public class GestionUsuariosServlet extends HttpServlet {
    
    // DAO para operaciones de base de datos
    private UsuarioDAO usuarioDAO;
    // ObjectMapper para convertir objetos Java a JSON y viceversa
    private ObjectMapper objectMapper;

    // Constructor: se ejecuta cuando se crea el servlet
    public GestionUsuariosServlet() {
        this.usuarioDAO = new UsuarioDAO();
        this.objectMapper = new ObjectMapper();
    }

    // Maneja las peticiones GET
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Configura la respuesta como JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String idParam = request.getParameter("id");
        if (idParam != null) {
            // Si se proporciona un ID, obtener un usuario específico
            int id = Integer.parseInt(idParam);
            Usuario usuario = usuarioDAO.obtenerPorId(id);
            objectMapper.writeValue(response.getWriter(), usuario);
        } else {
            // Si no se proporciona ID, obtener todos los usuarios
            List<Usuario> usuarios = usuarioDAO.obtenerTodos();
            objectMapper.writeValue(response.getWriter(), usuarios);
            //convierte la lista de usuarios en JSON y la envía como respuesta HTTP
        }
    }

    // Maneja las peticiones PUT (actualizar usuario)
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Lee el usuario del cuerpo de la petición
        Usuario usuario = objectMapper.readValue(request.getReader(), Usuario.class);
        //objectMapper.readValue: Este método se utiliza para convertir JSON en un objeto Java.
        //request.getReader(): Obtiene el lector del cuerpo de la petición HTTP, que contiene los datos JSON.
        //Usuario.class: Indica que el JSON en el cuerpo de la petición debe ser deserializado en una instancia de la clase Usuario.
        
        
        // Intenta modificar el usuario
        boolean exito = usuarioDAO.modificar(usuario);
        // Envía la respuesta
        enviarRespuesta(response, exito);
    }

    // Maneja las peticiones DELETE (eliminar usuario)
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Obtiene el ID del parámetro de la URL
        int id = Integer.parseInt(request.getParameter("id"));
        // Intenta eliminar el usuario
        boolean exito = usuarioDAO.eliminar(id);
        // Envía la respuesta
        enviarRespuesta(response, exito);
    }

    // Método auxiliar para enviar respuestas de éxito/fracaso
    private void enviarRespuesta(HttpServletResponse response, boolean exito) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        // Escribe un JSON simple indicando el éxito o fracaso de la operación
        response.getWriter().write("{\"exito\": " + exito + "}");
    }
}