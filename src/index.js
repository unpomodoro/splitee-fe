import ReactDOM from "react-dom/client"
import { ChakraProvider } from '@chakra-ui/react'
import App from "./App"
import { customTheme } from "./assets/theme/theme"
import {
    BrowserRouter,
    Routes,
    Route,
  } from "react-router-dom";
import Groups from "./pages/Groups";
import Members from "./pages/Members";
import GroupDetail from "./pages/GroupDetail";
import Debts from "./pages/Debts";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Statistics from "./pages/Statistics";


ReactDOM.createRoot(document.getElementById("root")).render(
    <>
    <ChakraProvider resetCSS theme={customTheme}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
            <Route path='login' element={<Home/>} />
            <Route path='signup' element={<Home/>} />
            <Route path="groups" element={<Groups/>} />
            <Route path="group/:groupId/members/:memberId" element={<Debts/>} />
            <Route path="group/:groupId/members" element={<Members/>} />
            <Route path="group/:groupId/statistics" element={<Statistics/>} />
            <Route path="group/:groupId" element={<GroupDetail/>} />
            <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </ChakraProvider>
    </>
)