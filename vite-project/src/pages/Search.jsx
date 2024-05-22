import styled from "styled-components";
import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaCity, FaEnvelope } from "react-icons/fa";
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';

export function Search() {
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
                atcoderRes = await axios.get(`http://lb-project-463274464.us-east-1.elb.amazonaws.com:8001/users/${handle}`);
            } catch (atcoderError) {
                atcoderRes = { data: null }; 
            }
    
            try {
                codeforcesRes = await axios.get(`http://lb-project-463274464.us-east-1.elb.amazonaws.com:8000/users/${handle}`);
            } catch (codeforcesError) {
                codeforcesRes = { data: null }; 
            }
    
            try {
                topcoderRes = await axios.get(`http://lb-project-463274464.us-east-1.elb.amazonaws.com:8002/users/${handle}`);
            } catch (topcoderError) {
                topcoderRes = { data: null }; 
            }
    
            console.log("AtCoder Response:", atcoderRes.data);
            console.log("Codeforces Response:", codeforcesRes.data);
            console.log("TopCoder Response:", topcoderRes.data);
    
            setResults({
                atcoder: atcoderRes.data,
                codeforces: codeforcesRes.data?.user,
                topcoder: topcoderRes.data?.users
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
            <h1>BUSCA TU USUARIO EN LOS 3 JUECES</h1>
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
                    <Card>
                        <div className="card">
                            <div className="card-header">
                                AtCoder
                            </div>
                            <div className="card-body">
                                {results.atcoder ? (
                                    <>
                                        <p><FaUser /> {results.atcoder.handle}</p>
                                        <p><FaEnvelope /> {results.atcoder.email}</p>
                                        <p>Rank: {results.atcoder.rank}</p>
                                        <p>Rating: {results.atcoder.rating}</p>
                                    </>
                                ) : (
                                    <p>No tiene una cuenta en este juez.</p>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="col-lg-4 col-md-6">
                    <Card>
                        <div className="card">
                            <div className="card-header">
                                Codeforces
                            </div>
                            <div className="card-body">
                                {results.codeforces ? (
                                    <>
                                        <p><FaUser /> {results.codeforces[0]}</p>
                                        <p><FaEnvelope /> {results.codeforces[1]}</p>
                                        <p> First Name: {results.codeforces[2]}</p>
                                        <p> Last Name: {results.codeforces[3]}</p>
                                        <p> Country: {results.codeforces[4]}</p>
                                        <p> City: {results.codeforces[5]}</p>
                                        <p> Rank: {results.codeforces[6]}</p>
                                        <p> Rating: {results.codeforces[7]}</p>
                                    </>
                                ) : (
                                    <p>No tiene una cuenta en este juez.</p>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
                <div className="col-lg-4 col-md-6">
                    <Card>
                        <div className="card">
                            <div className="card-header">
                                TopCoder
                            </div>
                            <div className="card-body">
                                {results.topcoder ? (
                                    <>
                                        <p><FaUser /> {results.topcoder[0]}</p>
                                        <p> First Name: {results.topcoder[1]}</p>
                                        <p> Last Name: {results.topcoder[2]}</p>
                                        <p><FaCity /> {results.topcoder[3]}</p>
                                        <p><FaEnvelope /> {results.topcoder[4]}</p>
                                    </>
                                ) : (
                                    <p>No tiene una cuenta en este juez.</p>
                                )}
                            </div>
                        </div>
                    </Card>
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

const Card = styled.div`
    margin-bottom: 20px;
`;
