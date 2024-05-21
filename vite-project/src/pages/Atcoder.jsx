import styled from "styled-components";
import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { FaUser, FaCity, FaEnvelope, FaTag } from "react-icons/fa";
import Swal from "sweetalert2";

export function Atcoder() {
  const url =
    "http://lb-project-463274464.us-east-1.elb.amazonaws.com:8001/users";
  const [tcUsers, setTcUsers] = useState([]);
  const [user, setUser] = useState({
    handle: "",
    email: "",
    rank: "",
    rating: "",
  });
  const [operation, setOperation] = useState(1);
  const [title, setTitle] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get(url);
      console.log("Response data:", response.data); // Log the response data
      // Check if response data is an array and contains users
      if (response.data && Array.isArray(response.data)) {
        const formattedUsers = response.data.map((user) => ({
          handle: user.handle,
          email: user.email,
          rank: user.rank,
          rating: user.rating,
        }));
        setTcUsers(formattedUsers);
      } else {
        console.error(
          "Formato de datos de respuesta inesperado:",
          response.data
        );
        setTcUsers([]);
      }
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      setTcUsers([]);
    }
  };

  const openModal = (
    op,
    user = {
      handle: "",
      email: "",
      rank: "",
      rating: "",
    }
  ) => {
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
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSave = async () => {
    const { handle, email, rank, rating } = user;
    if (!handle || !email || !rank || !rating) {
      Swal.fire("Error", "Todos los campos son obligatorios", "error");
      return;
    }

    // Convertir el rating a un número entero
    const ratingInt = parseInt(rating);

    try {
      const response =
        operation === 1
          ? await axios.post(url, { ...user, rating: ratingInt })
          : await axios.put(`${url}/${handle}`, { ...user, rating: ratingInt });

      if (response.status === 200 || response.status === 201) {
        Swal.fire(
          "Éxito",
          operation === 1
            ? "Usuario registrado correctamente"
            : "Usuario actualizado correctamente",
          "success"
        );
        getUsers();
        document.querySelector(".btn-close").click();
      } else {
        Swal.fire("Error", "Hubo un problema al guardar el usuario", "error");
      }
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      if (error.response && error.response.data) {
        Swal.fire(
          "Error",
          `Hubo un problema al guardar el usuario: ${error.response.data.message}`,
          "error"
        );
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
      <h1>Atcoder</h1>
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-md-4 offset-md-4">
            <div className="d-grid mx-auto">
              <button
                onClick={() => openModal(1)}
                className="btn btn-dark"
                data-bs-toggle="modal"
                data-bs-target="#modalProducts"
              >
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
                  <tr>
                    <th>handle</th>
                    <th>email</th>
                    <th>rank</th>
                    <th>rating</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {tcUsers.map((user) => (
                    <tr key={user.handle}>
                      <td>{user.handle}</td>
                      <td>{user.email}</td>
                      <td>{user.rank}</td>
                      <td>{user.rating}</td>
                      <td>
                        <button
                          onClick={() => openModal(2, user)}
                          className="btn btn-warning"
                        >
                          <i
                            className="fa-solid fa-edit"
                            data-bs-toggle="modal"
                            data-bs-target="#modalProducts"
                          ></i>
                        </button>
                        &nbsp;
                        <button
                          onClick={() => handleDelete(user.handle)}
                          className="btn btn-danger"
                        >
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
      <div id="modalProducts" className="modal fade" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <label className="h5">{title}</label>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input type="hidden" name="handle" value={user.handle}></input>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <FaUser />
                </span>
                <input
                  type="text"
                  ref={inputRef}
                  name="handle"
                  className="form-control"
                  placeholder="Handle"
                  value={user.handle}
                  onChange={handleChange}
                ></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <FaEnvelope />
                </span>
                <input
                  type="text"
                  name="email"
                  className="form-control"
                  placeholder="email"
                  value={user.email}
                  onChange={handleChange}
                ></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <FaCity />
                </span>
                <input
                  type="text"
                  name="rank"
                  className="form-control"
                  placeholder="rank"
                  value={user.rank}
                  onChange={handleChange}
                ></input>
              </div>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <FaCity />
                </span>
                <input
                  type="number"
                  name="rating"
                  className="form-control"
                  placeholder="rating"
                  value={user.rating}
                  onChange={handleChange}
                ></input>
              </div>
              <div className="d-grid col-6 mx-auto">
                <button className="btn btn-success" onClick={handleSave}>
                  <i className="fa-solid fa-floppy-disk"></i> Guardar
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
const Container = styled.div`
  height: 100vh;
  margin-top: 20px;
  margin-left: 50px;
`;
