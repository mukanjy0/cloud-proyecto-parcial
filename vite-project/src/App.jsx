import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import styled from 'styled-components'
import { MyRoutes } from './routes/routes'
import {Sidebar} from "./components/Sidebar"

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  return (
    <>
      <BrowserRouter>
        <Container className={sidebarOpen?"sidebarState active":""} >
              <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
              <MyRoutes/>
        </Container>
      </BrowserRouter>
    </>
  )
}
const Container = styled.div`
    display: grid;
    grid-template-columns: 90px auto;
    background: #231f20;
    color:#ffffff;
    transition:all 0.3;
    &.active{
      grid-template-columns:300px auto;
    }

`;
export default App;
