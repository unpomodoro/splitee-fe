import {Button, Flex, Heading, Text} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";

export default function NotFound() {

    let navigate = useNavigate()

    return (
        <Flex justify='center' align='center' flexDir='column'>
            <Heading variant='pageTitle' textAlign='center' paddingTop='5rem'>404 NOT FOUND</Heading>
            <Text variant='nothingHere'>Nothing to see here ヽ(´｡• ▽ •｡`)ﾉ.<br/>Maybe a typo in the URL?</Text>
            <Button variant='primary' size='normal' px='1rem' marginTop='3rem' onClick={() => navigate('/groups')}>Back to homepage</Button>
        </Flex>
    )
}