import React, { useState } from 'react'
import { Box, Avatar, Button, Heading, Text, SimpleGrid, Flex } from '@chakra-ui/react'
import { AddIcon, SearchIcon } from '@chakra-ui/icons'
import { useFetch } from '../hooks/useFetch'
import FindGroup from '../components/forms/FindGroup'
import CreateGroup from '../components/forms/CreateGroup'
import {Outlet, useNavigate} from 'react-router-dom'
import { baseUrl } from "../URL"
import {AuthService} from "../service/auth.service";

export default function Groups() {
    let navigate = useNavigate()
    const user = AuthService.getCurrentUser()
    const {data: groups, isLoading, error} = useFetch(`${baseUrl}/account/${user.id}/groups`)
    // const {data: groups, isLoading, error} = useFetch(`${baseUrl}/account/1/groups`)

    const listGroups = groups.map( group => {
        return (
            <Box key={group.code} as='button' layerStyle='item' onClick={() => navigate(`/group/${group.code}`)}>
                <Avatar size='lg'
                name={group.name}
                src={group.photo}
                />{' '}
                <Heading variant='cardName'>{group.name}</Heading>
            </Box>
        )
    }) 

    const [ createIsOpen, setCreateIsOpen ] = useState(false)
    const [ findIsOpen, setFindIsOpen ] = useState(false)
    
    return (
        <>
        <div className="list">
            <Heading as='h1' variant='pageTitle'>My groups</Heading>
            <Flex justify='flex-end' marginTop='1rem' marginBottom='3rem' gap={4}>
                <Button leftIcon={<AddIcon />} variant='primary' size='normal'
                        onClick={() => setCreateIsOpen( prev => !prev)}>
                    New group
                </Button>
                <Button leftIcon={<SearchIcon />} variant='primary' size='normal'
                        onClick={() => setFindIsOpen( prev => !prev)}>
                    Find group
                </Button>
            </Flex>
            
            <FindGroup isOpen={findIsOpen} onClose={setFindIsOpen} />
            <CreateGroup isOpen={createIsOpen} onClose={setCreateIsOpen} />

            { groups.length === 0 ? 
            <Text variant='nothingHere'>Nothing here yet ヽ(´｡• ᵕ •｡`)ﾉ.<br/>Add or find a group to join in ♡</Text> :
            <SimpleGrid columns={2} spacing={4} marginTop={5}>
                {listGroups} 
            </SimpleGrid> }

            
        </div>
        <Outlet/>
        </>
    )
}