import {BrowserRouter, Routes, Route} from "react-router-dom"
import {Home} from "../pages/Home"
import {Codeforces} from "../pages/Codeforces"
import {Atcoder} from "../pages/Atcoder"
import {Topcoder} from "../pages/Topcoder"
import { Search } from "../pages/Search"
import { SubmissionA } from "../pages/SubmissionA"
import { SubmissionC } from "../pages/SubmissionC"
import { SubmissionT } from "../pages/SubmissionT"
import { SearchSubmission } from "../pages/SearchSubmission"

export function MyRoutes(){
    return(
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/Codeforces" element={<Codeforces/>}/>
            <Route path="/Atcoder" element={<Atcoder/>}/>
            <Route path="/Topcoder" element={<Topcoder/>}/>
            <Route path="/Search" element={<Search/>}/>
            <Route path="/SubmissionA" element={<SubmissionA/>}/>
            <Route path="/SubmissionC" element={<SubmissionC/>}/>
            <Route path="/SubmissionT" element={<SubmissionT/>}/>
            <Route path="/SearchSubmission" element={<SearchSubmission/>}/>
        </Routes>
    );
}
