import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    Box,
    Avatar,
    Heading,
    SimpleGrid,
    HStack,
    InputGroup,
    InputRightElement,
    Select,
    GridItem,
    VStack, Spinner, Image, Text, Grid
} from "@chakra-ui/react"
import { useToast } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useNavigate } from "react-router-dom"
import { CopyIcon } from "@chakra-ui/icons";
import {useState} from "react";
import { SubModalContent } from "../SubModalContent";
import {baseUrl} from "../../URL";
import {PictureOutlined} from "@ant-design/icons";
import {DeleteAlert} from "../DeleteAlert";
import {uploadImg} from "../../hooks/uploadImg";

export default function CreateGroup(props) {
    const isOpen = props.isOpen
    let navigate = useNavigate()
    const toast = useToast()

    // TODO: dont forget to add logged user into members
    const [ members, setMembers ] = useState([])

    const { handleSubmit, register, formState: { errors, isSubmitting } } = useForm()
    const { handleSubmit: handleSubmit2, 
            register: register2,
            reset: reset2, 
            formState: { errors:errors2, isSubmitting: isSubmitting2 } } = useForm()

    function handleMember(value) {
        setMembers(members => [...members, value])

        reset2({
            name: "",
            bankAccount: ""
        })
    }
    //------------------- PHOTO GROUP ------------------------------
    const [isLoading, setIsLoading] = useState(false)
    const [photo, setPhoto] = useState('')
    let photoUrl = ''

    async function handleUpload(file) {
        setIsLoading(true)
        photoUrl = await uploadImg(file)
        setIsLoading(false)
        setPhoto(photoUrl)
    }
    //------------------- PHOTO MEMBER ------------------------------
    const [isLoading2, setIsLoading2] = useState(false)
    const [photo2, setPhoto2] = useState('')
    let photoUrl2 = ''

    async function handleUpload2(file) {
        setIsLoading2(true)
        photoUrl2 = await uploadImg(file)
        setIsLoading2(false)
        setPhoto2(photoUrl2)
    }
    //--------------------------------------------------------------

    async function handlePosts(value) {
        const settings = {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(value)
        }

        let url = `${baseUrl}/groups`

        try{
            const groupResponse = await fetch(url, settings).then(res => res.json())
            const groupCode = groupResponse.code

            const memberPromises = []
            members.forEach((member) => {
                url = `${baseUrl}/members/${groupCode}`
                settings.body = JSON.stringify(member)
                memberPromises.push(fetch(url, settings))
            })

            Promise.all(memberPromises)
                .then(values => {
                    return Promise.all(values.map(res => res.json()))
                })
                .then(values => {
                    const Ids = []
                    values.forEach(m => Ids.push(m.id))
                    return Ids
                }).then((Ids) =>{
                    url = `${baseUrl}/debts`
                    console.log(Ids)
                    settings.body = JSON.stringify(Ids)
                    fetch(url, settings).then(res => res.json()).then(data => console.log(data))
                })
            
        }
        catch(error){
            console.log(error)
        }

        // close form or redirect to created group
    }

    const listMembers = members.map( member => {
        return (
            <Box key={member.name} layerStyle='item'>
                <Avatar size='sm'
                        name={member.name}
                        src='Your photo'    // TODO what is this
                />{' '}
                <Heading variant='memberSmallCard'>{member.name}</Heading>
            </Box>
        )
    })

    return (
            <Modal isCentered='true' isOpen={isOpen} onClose={() => props.onClose(false)} size='4xl' >
                <ModalOverlay />
                <ModalContent bg='none' shadow='none'>

                    <SimpleGrid spacing={2} columns={2} >
                    <SubModalContent>
                        <ModalHeader><Heading variant='modalHeader'>New group</Heading></ModalHeader>
                        <ModalCloseButton />
                        <form onSubmit={handleSubmit(value => handlePosts(value))}>
                            <ModalBody>

                                <Grid templateRows='repeat(3, 1fr)'
                                      templateColumns='repeat(3, 1fr)'
                                      gap={3} >
                                    {/*--------------PHOTO-------------------*/}
                                    <GridItem rowSpan={3} colSpan={1}>
                                        <VStack >
                                            <Input variant='hover' id='img' type='file' accept='image/*' multiple={false} aria-hidden={true}
                                                   width='90px' height='130px' opacity='0' position='absolute'
                                                   onChange={(e) => {handleUpload(e.target.files[0])}}/>
                                            {
                                                isLoading ?
                                                    <Spinner /> :
                                                    (photo === '' ?
                                                            <       PictureOutlined style={{fontSize:'2.5em', borderRadius:'50%', borderColor:'#CBD5E0',
                                                                width: '90px', height:'90px', padding:'25px 20px 20px 20px',
                                                                color:'#2D3748', background: '#E2E8F0'}}/> :
                                                            <Image src={photo} borderRadius='full' width='90px'/>
                                                    )
                                            }
                                            <Text color='primary'>Add photo</Text>
                                        </VStack>
                                    </GridItem>
                                    {/*--------------------------------------*/}

                                    <GridItem rowSpan={2} colSpan={2}>
                                        <FormControl isRequired isInvalid={errors.name}>
                                            <FormLabel htmlFor='name'>Group name:</FormLabel>
                                            <Input id='name' type='text' placeholder='Trip to Barcelona' variant='outline'
                                                   {...register('name', {
                                                       required: 'This is required'
                                                   })} />
                                            <FormErrorMessage>
                                                {errors.name && errors.name.message}
                                            </FormErrorMessage>
                                        </FormControl>
                                    </GridItem>

                                    <GridItem colSpan={2} marginTop='-10px'>
                                        <FormControl isRequired isInvalid={errors.name}>
                                            <HStack>
                                                <FormLabel htmlFor='name'>Default currency:</FormLabel>
                                                <Select placeholder='Select currency' variant='outline' width='6rem' {...register('currency')}>
                                                    <option value='CZK'>CZK</option>
                                                    <option value='EUR'>EUR</option>
                                                    <option value='USD'>USD</option>
                                                </Select>
                                            </HStack>
                                            <FormErrorMessage>
                                                {errors.name && errors.name.message}
                                            </FormErrorMessage>
                                        </FormControl>
                                    </GridItem>
                                </Grid>

                                <FormLabel paddingTop='0.5rem'>Members:</FormLabel>
                                <SimpleGrid columns={2} spacing={2} overflowY='scroll'>
                                    {listMembers}
                                    {/* TODO list of added members */}
                                </SimpleGrid>

                            </ModalBody>

                            <ModalFooter>
                                <Button m='auto' variant='primary' type='submit'>Add New Group</Button>
                            </ModalFooter>
                        </form>
                    </SubModalContent>
                    {/*----------------------------------------------------------------------------------------------*/}
                    <SubModalContent my='auto'>
                        <ModalHeader><Heading variant='modalHeader'>Add new member</Heading></ModalHeader>
                        <ModalCloseButton />
                        <form onSubmit={handleSubmit2((value) =>{
                            handleMember(value)
                        })}>
                            <ModalBody>
                                <Grid templateRows='repeat(2, 1fr)'
                                      templateColumns='repeat(3, 1fr)'
                                      gap={3} >
                                    {/*--------------PHOTO-------------------*/}
                                    <GridItem rowSpan={2} colSpan={1}>
                                        <VStack >
                                            <Input variant='hover' id='img' type='file' accept='image/*' multiple={false} aria-hidden={true}
                                                   width='90px' height='130px' opacity='0' position='absolute'
                                                   onChange={(e) => {handleUpload2(e.target.files[0])}}/>
                                            {
                                                isLoading2 ?
                                                    <Spinner /> :
                                                    (photo2 === '' ?
                                                            <       PictureOutlined style={{fontSize:'2.5em', borderRadius:'50%', borderColor:'#CBD5E0',
                                                                width: '90px', height:'90px', padding:'25px 20px 20px 20px',
                                                                color:'#2D3748', background: '#E2E8F0'}}/> :
                                                            <Image src={photo2} borderRadius='full' width='90px'/>
                                                    )
                                            }
                                            <Text color='primary'>Add photo</Text>
                                        </VStack>
                                    </GridItem>
                                    {/*--------------------------------------*/}
                                    <GridItem colSpan={2}>
                                        <FormControl isRequired isInvalid={errors2.name}>
                                            <FormLabel htmlFor='name'>Name:</FormLabel>
                                            <Input id='name' type='text' placeholder='John Doe' variant='outline'
                                                   {...register2('name', {
                                                       required: 'This is required'
                                                   })} />
                                            <FormErrorMessage>
                                                {errors2.name && errors2.name.message}
                                            </FormErrorMessage>
                                        </FormControl>
                                    </GridItem>

                                    <GridItem colSpan={2}>
                                        <FormControl isInvalid={errors2.bankAccount}>
                                            <FormLabel htmlFor='bankAccount'>Bank account:</FormLabel>
                                            <Input id='bankAccount' type='text' placeholder='1234567890/0000' variant='outline'
                                                   {...register2('bankAccount')} />
                                            <FormErrorMessage>
                                                {errors2.bankAccount && errors2.bankAccount.message}
                                            </FormErrorMessage>
                                        </FormControl>
                                    </GridItem>

                                </Grid>

                                {/*TODO img import*/}




                            </ModalBody>
                            <ModalFooter>
                                <HStack m='auto' spacing={5}>
                                    <Button variant='primary' size='small' type='submit'>
                                        Add
                                    </Button>
                                    <Button variant='secondary' size='small' onClick={() => props.onClose(false)}>
                                        Cancel
                                    </Button>
                                </HStack>
                            </ModalFooter>
                        </form>
                    </SubModalContent>
                </SimpleGrid>

                </ModalContent>
            </Modal>
    )
}