import styled from "styled-components";
import logo from "../assets/react.svg";
import {v} from "../styles/Variables";
import { FaAngleDoubleLeft } from "react-icons/fa";
import { IoHome } from "react-icons/io5";
import { FaCode } from "react-icons/fa";
import { SiCodeforces } from "react-icons/si";
import { SiTopcoder } from "react-icons/si";
import { FaSearch } from "react-icons/fa";
import { GoFileSubmodule } from "react-icons/go";
import {Link} from "react-router-dom";

export function Sidebar({sidebarOpen, setSidebarOpen}){

    const ModSidebaropen =()=>{
        setSidebarOpen(!sidebarOpen);
      }
    return(
        <Container isOpen = {sidebarOpen}>
            <button className="Sidebarbutton" onClick={ModSidebaropen}>
                <FaAngleDoubleLeft />

            </button>
            <div className = "Logocontent">
                <div className="imgcontent"> 
                    <img src = {logo} />
                </div>
                <h2>
                    Proyecto Cloud
                </h2>
            </div>
            {linksArray.map(({icon, label, to}) => (
                <div className = "LinkContainer" key={label}>
                    <Link to={to} className="Links">
                        <div className="Linkicon">
                            {icon}
                        </div>
                        {sidebarOpen &&(<span>{label}</span>)}
                    </Link>
                </div>
            ))}
        </Container>
    );
}

const linksArray=[
    {
        label: "Home",
        icon: <IoHome/>,
        to : "/"
    },
    {
        label: "Atcoder",
        icon: <FaCode/>,
        to : "/Atcoder"
    },
    {
        label: "Submission ATCoder",
        icon: <GoFileSubmodule />,
        to: "/SubmissionA"
    },
    {
        label: "Codeforces",
        icon: <SiCodeforces/>,
        to : "/Codeforces"
    },
    {
        label: "Submission Codeforces",
        icon: <GoFileSubmodule />,
        to: "/SubmissionC"
    },
    {
        label: "Topcoder",
        icon: <SiTopcoder/>,
        to : "/Topcoder"
    },
    {
        label: "Submission Topcoder",
        icon: <GoFileSubmodule />,
        to: "/SubmissionT"
    },
    {
        label: "Search",
        icon: <FaSearch/>,
        to: "/Search"
    },
    {
        label: "SearchSubmission",
        icon: <FaSearch/>,
        to: "/SearchSubmission"
    }
]


const Container = styled.div`
    color: #231f20;
    background: #00bffe;
    position: sticky;
    padding-top:20px;
    .Sidebarbutton{
        position: absolute;
        top: ${v.xxlSpacing};
        right: -18px;
        width: 32px;
        height: 32px;
        border-radius:50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s;
        transform: ${({isOpen})=>(isOpen?`initial`:`rotate(180deg)`)};
        border: none;
        letter-spacing: inherit;
        font-size: inherit;
        text-align: inherit;
        padding: 0;
        font-family: inherit;
        aoutline: none;
    }

    .Logocontent{
        display:flex;
        justify-content: center;
        align-items: center;
        width: 10px
        padding-bottom: ${ v.lgSpacing}
        .imgcontent{
            display: flex;
            img{
                max-width:100%;
                height: auto;
            }
        }
        transition: all 0.3s;
        transform: ${({isOpen})=>(isOpen?`scale(0.7)`:`scale(1.4)`)};

        h2{
            display: ${({isOpen})=>(isOpen?`block`: `none`)};
        }
    }

    .LinkContainer{
        margin: 8px 0;
        padding: 0 15%;
        :hover{
            background: #99D1FF;
        }
        .Links{
            display: flex;
            align-items: center;
            text-decoration: none;
            padding: calc(${v.smSpacing}) 0;

            .Linkicon{
                paddin: ${v.smSpacing} ${v.mdSpacing};
                display: flex;
                align-item: center;
                justify-content: ${({isOpen})=>(isOpen?`none`:`center`)};
                width: ${({isOpen})=>(isOpen?`20%`:`100%`)};
                svg{
                    font-size: 25px;
                }
            }
        }
    }
    

    
`;