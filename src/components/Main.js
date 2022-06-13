import { Container } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import {AuthService} from "../service/auth.service";
import Home from "../pages/Home";

export default function Main() {

    const user = AuthService.getCurrentUser()

    return (
        <Container maxWidth='70%' bg='white' minHeight='90vh' my='1rem' borderRadius={15}>
            {
                user === null ?
                    <Home/> :
                    <Outlet/>
            }
        </Container>
    )
}