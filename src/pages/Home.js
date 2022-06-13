import {Flex, Grid, GridItem, Heading, Center, Text, VStack} from "@chakra-ui/react";
import SignUp from "../components/forms/SignUp";
import Login from "../components/forms/Login";
import {useLocation} from "react-router-dom";
import vector from '../assets/img/vector.svg'

export default function Home (props) {
    const location = useLocation()
    return (
        <Flex justify='space-evenly' align='center'>
            <Center backgroundImage={vector} backgroundPosition='center' backgroundRepeat='no-repeat'
                    backgroundSize='contain' height='70vh' width='30vw'>
                <VStack paddingY='40%' paddingX='1rem'>
                    <Heading color='primary' fontSize='6xl' fontWeight='bold'>Welcome {location.pathname === '/login' ? 'back!' : 'to Splitee!'}</Heading>

                    <Text paddingTop='3rem' fontSize='3xl'>Never forget debts and keep your bills well splitee-d!</Text>
                </VStack>
            </Center>

            <GridItem align='right'>
                {location.pathname === '/login' ? <Login/> : <SignUp/> }
            </GridItem>
        </Flex>
    )
}
