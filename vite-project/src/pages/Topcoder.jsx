import styled from "styled-components";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FaUser, FaCity, FaEnvelope, FaTag } from "react-icons/fa";
import Swal from "sweetalert2";

export function Topcoder(){
    const url = 'http://127.0.0.1:8000/users';
    const [tcUsers, setTcUsers] = useState([]);
    const [user, setUser] = useState({
        handle: "",
        firstName: "",
        lastName: "",
        city: "",
        email: "",
    });
    const [operation, setOperation] = useState(1); // 1: Crear, 2: Editar
    const [title, setTitle] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            const response = await axios.get(url);
            if (response.data && Array.isArray(response.data.users)) {
                const formattedUsers = response.data.users.map(user => ({
                    handle: user[0],
                    firstName: user[1],
                    lastName: user[2],
                    city: user[3],
                    email: user[4],
                }));
                setTcUsers(formattedUsers);
            } else {
                console.error("Formato de datos de respuesta inesperado:", response.data);
                setTcUsers([]);
            }
        } catch (error) {
            console.error("Error al obtener los usuarios:", error);
            setTcUsers([]);
        }
    };

    const openModal = (op, user = {
        handle: "",
        firstName: "",
        lastName: "",
        city: "",
        email: ""
    }) => {
        setUser(user);
        setOperation(op);
        setTitle(op === 1 ? "Registrar" : "Editar");
        setTimeout(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, 500);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevUser => ({ ...prevUser, [name]: value }));
    };

    const handleSave = async () => {
        const {handle, firstName, lastName, city, email } = user;
        if (!handle || !firstName || !lastName || !city || !email) {
            Swal.fire("Error", "Todos los campos son obligatorios", "error");
            return;
        }

        try {
            if (operation === 1) {
                await axios.post(url, user, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                Swal.fire("Éxito", "Usuario registrado correctamente", "success");
            } else {
                await axios.put(`${url}/${handle}`, user, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
            }
            getUsers();
            document.querySelector('.btn-close').click();
        } catch (error) {
            console.error("Error al guardar el usuario:", error);
            if (error.response && error.response.data) {
                Swal.fire("Error", `Hubo un problema al guardar el usuario: ${error.response.data.message}`, "error");
            } else {
                Swal.fire("Error", "Hubo un problema al guardar el usuario", "error");
            }
        }
    };

    const handleDelete = async (handle) => {
        try {
            await axios.delete(`${url}/${handle}`);
            Swal.fire("Éxito", "Usuario eliminado correctamente", "success");
            getUsers();
        } catch (error) {
            console.error("Error al eliminar el usuario:", error);
            Swal.fire("Error", "Hubo un problema al eliminar el usuario", "error");
        }
    };

    return (
        <Container>
            <h1>TopCoder</h1>
            <div className="container-fluid">
                <div className="row mt-3">
                    <div className="col-md-4 offset-md-4">
                        <div className="d-grid mx-auto">
                            <button onClick={() => openModal(1)} className="btn btn-dark" data-bs-toggle='modal' data-bs-target='#modalProducts'>
                                <i className="fa-solid fa-circle-plus"></i> Añadir
                            </button>
                        </div>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-12 col-lg-8 offset-0 offset-lg-2">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr><th>Handle</th><th>FirstName</th><th>LastName</th><th>City</th><th>Email</th><th></th></tr>
                                </thead>
                                <tbody className="table-group-divider">
                                    {tcUsers.map((user) => (
                                        <tr key={user.handle}>
                                            <td>{user.handle}</td>
                                            <td>{user.firstName}</td>
                                            <td>{user.lastName}</td>
                                            <td>{user.city}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <button onClick={() => openModal(2, user)} className="btn btn-warning">
                                                    <i className="fa-solid fa-edit" data-bs-toggle='modal' data-bs-target='#modalProducts'></i>
                                                </button>
                                                &nbsp;
                                                <button onClick={() => handleDelete(user.id)} className="btn btn-danger">
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div id='modalProducts' className="modal fade" aria-hidden='true'>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <label className="h5">{title}</label>
                            <button type="button" className="btn-close" data-bs-dismiss='modal' aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <input type='hidden' handle='handle' value={user.handle}></input>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><FaUser /></span>
                                <input type="text" ref={inputRef} name='handle' className="form-control" placeholder="Handle" value={user.handle} onChange={handleChange}></input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><FaUser /></span>
                                <input type="text" name='firstName' className="form-control" placeholder="firstName" value={user.firstName} onChange={handleChange}></input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><FaUser /></span>
                                <input type="text" name='lastName' className="form-control" placeholder="lastName" value={user.lastName} onChange={handleChange}></input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><FaCity /></span>
                                <input type="text"name='city' className="form-control" placeholder="city" value={user.city} onChange={handleChange}></input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text"><FaEnvelope /></span>
                                <input type="text" name='email' className="form-control" placeholder="email" value={user.email} onChange={handleChange}></input>
                            </div>
                            <div className="d-grid col-6 mx-auto">
                                <button className="btn btn-success" onClick={handleSave}>
                                    <i className="fa-solid fa-floppy-disk"></i> Guardar
                                </button>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type='button' className="btn btn-secondary" data-bs-dismiss='modal'>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
const Container = styled.div`
    height:100vh; 
    margin-top: 20px;
    margin-left: 50px;
`;