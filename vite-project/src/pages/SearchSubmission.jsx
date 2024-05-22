import styled from "styled-components";
import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaCity, FaEnvelope } from "react-icons/fa";
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';

export function SearchSubmission() {
    const [handle, setHandle] = useState("");
    const [results, setResults] = useState({
        atcoder: null,
        codeforces: null,
        topcoder: null
    });

    const searchUser = async () => {
        try {
            let atcoderRes, codeforcesRes, topcoderRes;
            
            try {
                atcoderRes = await axios.get(`http://lb-project-463274464.us-east-1.elb.amazonaws.com:8001/users/${handle}/submissions`);
            } catch (atcoderError) {
                atcoderRes = { data: null }; 
            }
    
            try {
                codeforcesRes = await axios.get(`http://lb-project-463274464.us-east-1.elb.amazonaws.com:8000/users/${handle}/submissions`);
            } catch (codeforcesError) {
                codeforcesRes = { data: null }; 
            }
    
            try {
                topcoderRes = await axios.get(`http://lb-project-463274464.us-east-1.elb.amazonaws.com:8002/users/${handle}/submissions`);
            } catch (topcoderError) {
                topcoderRes = { data: null }; 
            }
    
            console.log("AtCoder Response:", atcoderRes.data);
            console.log("Codeforces Response:", codeforcesRes.data);
            console.log("TopCoder Response:", topcoderRes.data);
    
            setResults({
                atcoder: atcoderRes.data,
                codeforces: codeforcesRes.data,
                topcoder: topcoderRes.data
            });
        } catch (error) {
            Swal.fire("Error", "Hubo un problema al buscar el usuario", "error");
            console.error("Error al buscar el usuario:", error);
        }
    };
    
    

    const handleChange = (e) => {
        setHandle(e.target.value);
    };

    const handleSearch = () => {
        if (!handle) {
            Swal.fire("Error", "El campo de handle es obligatorio", "error");
            return;
        }
        searchUser();
    };

    return (
        <Container>
            <h1>BUSCA LOS SUBMISSIONS DE UN USUARIO EN CADA UNO DE LOS JUECES</h1>
            <div className="input-group mb-3">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ingresa el handle" 
                    value={handle} 
                    onChange={handleChange}
                />
                <button 
                    className="btn btn-dark" 
                    onClick={handleSearch}
                >
                    Buscar
                </button>
            </div>
            <div className="row">
                <div className="col-lg-4 col-md-6">
                        {results.atcoder && results.atcoder.submissions && (
                            <SubmissionTable>
                                <thead>
                                    <tr>
                                        <th>Status</th>
                                        <th>Problem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.atcoder.submissions.map((submission, index) => (
                                        <tr key={index}>
                                            <td>{submission[1]}</td>
                                            <td>{submission[2]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </SubmissionTable>
                        )}
                </div>
                <div className="col-lg-4 col-md-6">
                        {results.codeforces && results.codeforces.submissions && (
                            <SubmissionTable>
                                <thead>
                                    <tr>
                                        <th >Status</th>
                                        <th>Problem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.codeforces.submissions.map((submission, index) => (
                                        <tr key={index}>
                                            <td>{submission[1]}</td>
                                            <td>{submission[2]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </SubmissionTable>
                        )}

                </div>
                <div className="col-lg-4 col-md-6">
                        {results.topcoder && results.topcoder.submissions && (
                            <SubmissionTable>
                                <thead>
                                    <tr>
                                        <th>Status</th>
                                        <th>Problem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.topcoder.submissions.map((submission, index) => (
                                        <tr key={index}>
                                            <td>{submission[1]}</td>
                                            <td>{submission[2]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </SubmissionTable>
                        )}
                </div>
            </div>
        </Container>
    );
}

const Container = styled.div`
    height: 100vh; 
    margin-top: 20px;
    margin-left: 50px;
    margin-right: 50px;
`;

const SubmissionTable = styled.table`
    margin-top: 20px;
    width: 100%;
    border-collapse: collapse;

    th, td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }

    th {
        background-color: #f2f2f2;
        color: black;
    }
`;

