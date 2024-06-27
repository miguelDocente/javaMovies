document.addEventListener('DOMContentLoaded', cargarUsuarios);

let modificarModal;

document.addEventListener('DOMContentLoaded', function() {
    modificarModal = new bootstrap.Modal(document.getElementById('modificarModal'));
    cargarUsuarios();
});

function cargarUsuarios() {
    fetch('/usuariosAdministrador/GestionUsuariosServlet')
        .then(response => response.json())
        .then(usuarios => {
            const tbody = document.querySelector('#usuariosTable tbody');
            tbody.innerHTML = '';
            usuarios.forEach(usuario => {
                tbody.innerHTML += `
                    <tr>
                        <td>${usuario.id}</td>
                        <td>${usuario.nombre}</td>
                        <td>${usuario.apellido}</td>
                        <td>${usuario.email}</td>
                        <td>********</td>
                        <td>${usuario.fechaNacimiento}</td>
                        <td>${usuario.pais}</td>
                        <td>
                            <button class="btn btn-primary btn-sm" onclick="mostrarModificarModal(${usuario.id})">Modificar</button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error:', error));
}

function mostrarModificarModal(id) {
    fetch(`/usuariosAdministrador/GestionUsuariosServlet?id=${id}`)
        .then(response => response.json())
        .then(usuario => {
            document.getElementById('userId').value = usuario.id;
            document.getElementById('nombre').value = usuario.nombre;
            document.getElementById('apellido').value = usuario.apellido;
            document.getElementById('email').value = usuario.email;
            document.getElementById('password').value = usuario.password;
            document.getElementById('fechaNacimiento').value = usuario.fechaNacimiento;
            document.getElementById('pais').value = usuario.pais;
            modificarModal.show();
        })
        .catch(error => console.error('Error:', error));
}

function guardarModificacion() {
    const usuario = {
        id: document.getElementById('userId').value,
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        pais: document.getElementById('pais').value
    };

    fetch('/usuariosAdministrador/GestionUsuariosServlet', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario)
        //método en JavaScript que convierte un objeto JavaScript en una cadena JSON.
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            modificarModal.hide();
            cargarUsuarios();
        } else {
            alert('Error al modificar el usuario');
        }
    })
    .catch(error => console.error('Error:', error));
}

function eliminarUsuario(id) {
    //función que muestra un cuadro de diálogo con un mensaje y botones "Aceptar" y "Cancelar"
    //Devuelve true si el usuario hace clic en "Aceptar" y false si hace clic en "Cancelar".
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
        fetch(`/usuariosAdministrador/GestionUsuariosServlet?id=${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                console.log(data.succes)
                if (data.success) {
                    cargarUsuarios();
                } else {
                    alert('Error al eliminar el usuario');
                }
            })
            .catch(error => console.error('Error:', error));
    }
}