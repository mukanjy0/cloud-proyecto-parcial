import styled from "styled-components";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';

export function SubmissionC() {
    const url = 'http://lb-project-463274464.us-east-1.elb.amazonaws.com:8000/users';
    const url2 = 'http://lb-project-463274464.us-east-1.elb.amazonaws.com:8000/submissions';

    const [tcUsers, setTcUsers] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [submission, setSubmission] = useState({
        status: "Select Status",
        problem: "",
        url_problem: "",
        user_handle: ""
    });
    const [title, setTitle] = useState("");
    const inputRef = useRef(null);  

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        getUsers();
        getSubmissions();
    }, []);

    const getUsers = async () => {
        try {
            const response = await axios.get(url);
            if (response.data && Array.isArray(response.data.users)) {
                const formattedUsers = response.data.users.map(user => ({
                    handle: user[0],
                    email: user[1],
                    firstName: user[2],
                    lastName: user[3],
                    country: user[4],
                    city: user[5],
                    rank: user[6],
                    rating: user[7]
                }));
                console.log("Formatted users:", formattedUsers); // Log the formatted users
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

    const getSubmissions = async () => {
        try {
            const response = await axios.get(url2);
            if (response.data && Array.isArray(response.data.submissions)) {
                setSubmissions(response.data.submissions);
            } else {
                setSubmissions([]);
            }
        } catch (error) {
            console.error("Error al obtener las sumisiones:", error);
            setSubmissions([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSubmission(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        console.log("editingId:", editingId); 
        if (isEditing) {
            try {
                await axios.put(`${url2}/${editingId}`, submission);
                Swal.fire("Success", "Submission updated successfully", "success");
                setIsEditing(false);
                setEditingId(null);
            } catch (error) {
                console.error("Error al actualizar la sumisión:", error);
                Swal.fire("Error", "There was an error updating the submission", "error");
            }
        } else {
            try {
                await axios.post(url2, submission);
                Swal.fire("Success", "Submission added successfully", "success");
            } catch (error) {
                console.error("Error al guardar la sumisión:", error);
                Swal.fire("Error", "There was an error saving the submission", "error");
            }
        }
        getSubmissions();
        document.querySelector('.btn-close').click();
    };
    

    const openModal = (op, submissionData = {
        status: "ACCEPTED",
        problem: "",
        url_problem: "",
        user_handle: ""
    }) => {
        setSubmission(submissionData);
        setIsEditing(op === 2);
        setTitle(op === 1 ? "Registrar" : "Editar");
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 500);
    };

    const handleEdit = (id) => {
        const sub = submissions.find(sub => sub[0] === id);
        setSubmission({
            status: sub[1],
            problem: sub[2],
            url_problem: sub[3],
            user_handle: sub[4]
        });
        setIsEditing(true);
        setEditingId(id);
    };
    

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${url2}/${id}`);
            Swal.fire("Success", "Submission deleted successfully", "success");
            getSubmissions();
        } catch (error) {
            console.error("Error al eliminar la sumisión:", error);
            Swal.fire("Error", "There was an error deleting the submission", "error");
        }
    };

    return (
        <Container>
            <h1>Submision Codeforces</h1>
            <Form>
                <Select name="status" value={submission.status} onChange={handleInputChange}>
                    <option value="">Select Status</option>
                    <option value="ACCEPTED">ACCEPTED</option>
                    <option value="WRONG ANSWER">WRONG ANSWER</option>
                    <option value="TIME LIMIT EXCEEDED">TIME LIMIT EXCEEDED</option>
                    <option value="MEMORY LIMIT EXCEEDED">MEMORY LIMIT EXCEEDED</option>
                    <option value="RUN TIME ERROR">RUN TIME ERROR</option>
                    <option value="COMPILE ERROR">COMPILE ERROR</option>
                </Select>
                <Input 
                    type="text" 
                    name="problem" 
                    placeholder="Problem" 
                    value={submission.problem} 
                    onChange={handleInputChange} 
                />
                <Input 
                    type="text" 
                    name="url_problem" 
                    placeholder="URL Problem" 
                    value={submission.url_problem} 
                    onChange={handleInputChange} 
                />
                <Select name="user_handle" value={submission.user_handle} onChange={handleInputChange}>
                    <option value="">Select User</option>
                    {tcUsers.map((user) => (
                        <option key={user.handle} value={user.handle}>{user.handle}</option>
                    ))}
                </Select>
                <Button onClick={handleSubmit}>Guardar</Button>            
            </Form>
            <div className="row mt-3">
                <div className="col-12 col-lg-8 offset-0 offset-lg-2">
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Problem</th>
                                    <th>URL Problem</th>
                                    <th>User Handle</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="table-group-divider">
                                {submissions.length > 0 ? (
                                    submissions.map((sub) => (
                                        <tr key={sub[0]}>
                                            <td>{sub[1]}</td>
                                            <td>{sub[2]}</td>
                                            <td>{sub[3]}</td>
                                            <td>{sub[4]}</td>
                                            <td>
                                                <button onClick={() => handleEdit(sub[0])} className="btn btn-warning" data-bs-toggle='modal' data-bs-target='#modalSubmission'>
                                                    <i className="fa-solid fa-edit"></i>
                                                </button>
                                                &nbsp;
                                                <button onClick={() => handleDelete(sub[0])} className="btn btn-danger">
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">No submissions found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>    
                    </div>
                </div>
            </div>
            <div id='modalSubmission' className="modal fade" aria-hidden='true'>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <label className="h5">{title}</label>
                            <button type="button" className="btn-close" data-bs-dismiss='modal' aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <input type='hidden' name='id' value={submission.id}></input>
                            <div className="input-group mb-3">
                                <span className="input-group-text">Status</span>
                                <select name="status" className="form-control" value={submission.status} onChange={handleInputChange}>
                                    <option value="ACCEPTED">ACCEPTED</option>
                                    <option value="WRONG ANSWER">WRONG ANSWER</option>
                                    <option value="TIME LIMIT EXCEEDED">TIME LIMIT EXCEEDED</option>
                                    <option value="MEMORY LIMIT EXCEEDED">MEMORY LIMIT EXCEEDED</option>
                                    <option value="RUN TIME ERROR">RUN TIME ERROR</option>
                                    <option value="COMPILE ERROR">COMPILE ERROR</option>
                                </select>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">Problem</span>
                                <input type="text" ref={inputRef} name='problem'                                
                                className="form-control" placeholder="Problem" value={submission.problem} onChange={handleInputChange}></input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">URL Problem</span>
                                <input type="text" name='url_problem' className="form-control" placeholder="URL Problem" value={submission.url_problem} onChange={handleInputChange}></input>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text">User Handle</span>
                                <select name="user_handle" className="form-control" value={submission.user_handle} onChange={handleInputChange}>
                                    <option value="">Select User</option>
                                    {tcUsers.map((user) => (
                                        <option key={user.handle} value={user.handle}>{user.handle}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="d-grid col-6 mx-auto">
                                <button className="btn btn-success" onClick={handleSubmit}>
                                    {isEditing ? "Update" : "Guardar"}
                                </button>
                            </div>
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

const Form = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
`;

const Select = styled.select`
    padding: 10px;
    margin-right: 10px;
`;

const Input = styled.input`
    padding: 10px;
    margin-right: 10px;
`;

const Button = styled.button`
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    &:hover {
        background-color: #0056b3;
    }
`;

