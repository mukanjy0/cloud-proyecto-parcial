import styled from "styled-components";
import React, { useState } from "react";
import axios from "axios";
import { FaUser, FaCity, FaEnvelope } from "react-icons/fa";
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';

export function Submission() {
    return(
        <Container>
            <h1>Submission</h1>
        </Container>
    );
}
const Container = styled.div`
    height:100vh;
    margin-top: 20px;
    margin-left: 50px; 
`;