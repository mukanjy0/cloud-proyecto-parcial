import {BrowserRouter, Routes, Route} from "react-router-dom"
import {Home} from "../pages/Home"
import {Codeforces} from "../pages/Codeforces"
import {Atcoder} from "../pages/Atcoder"
import {Topcoder} from "../pages/Topcoder"
import { Search } from "../pages/Search"
import { Submission } from "../pages/Submission"

export function MyRoutes(){
    return(
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/Codeforces" element={<Codeforces/>}/>
            <Route path="/Atcoder" element={<Atcoder/>}/>
            <Route path="/Topcoder" element={<Topcoder/>}/>
            <Route path="/Search" element={<Search/>}/>
            <Route path="/Submission" element={<Submission/>}/>
        </Routes>
    );
}
