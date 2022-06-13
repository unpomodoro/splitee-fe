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
    Input, FormErrorMessage, Heading, HStack, Select, Textarea, GridItem, VStack, Spinner, Image, Text, Grid,
} from "@chakra-ui/react"
import { useToast } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { baseUrl } from "../../URL"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useFetch } from '../../hooks/useFetch'
import { putData } from '../../hooks/putFetch'
import {DeleteAlert} from "../DeleteAlert";
import {PictureOutlined} from "@ant-design/icons";
import {uploadImg} from "../../hooks/uploadImg";

export default function EditGroup(props) {
    let params = useParams()
    let groupCode = params.groupId
    const isOpen = props.isOpen
    const toast = useToast()

    const {data: group, isLoading, error} = useFetch(`${baseUrl}/groups/${groupCode}`)

    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm()

    const [ alertIsOpen, setAlertIsOpen ] = useState(false)

    useEffect(() => {
        setValue('name', group.name)
        setValue('currency', group.currency)
        setValue('description', group.description)
    }, [group])

    //------------------- PHOTO GROUP ------------------------------

    const [isLoading2, setIsLoading2] = useState(false)
    const [photo, setPhoto] = useState('')
    let photoUrl = ''
    async function handleUpload(file) {
        setIsLoading2(true)
        photoUrl = await uploadImg(file)
        setIsLoading2(false)
        setPhoto(photoUrl)
    }

    async function handleSave(value) {
        const url = `${baseUrl}/groups/${groupCode}`
        value.photo = photo
        const response = await putData(url, value)

        console.log(response)
    }

    return (
        <>
            <Modal isCentered='true' isOpen={isOpen} onClose={() => props.onClose(false)}>
                <ModalOverlay />
                <ModalContent>

                    <ModalHeader><Heading variant='modalHeader'>Edit group</Heading></ModalHeader>
                    <ModalCloseButton />

                    <form onSubmit={handleSubmit((value) => handleSave(value))}>
                        <ModalBody>

                            <Grid templateColumns='repeat(3, 1fr)'
                                  gap={3} >
                                {/*--------------PHOTO-------------------*/}
                                <GridItem colSpan={1}>
                                    <VStack >
                                        <Input variant='hover' id='img' type='file' accept='image/*' multiple={false} aria-hidden={true}
                                               width='90px' height='130px' opacity='0' position='absolute'
                                               onChange={(e) => {handleUpload(e.target.files[0])}}/>
                                        {
                                            isLoading2 ?
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

                                <GridItem colSpan={2}>
                                    <FormControl isRequired isInvalid={errors.name}>
                                        <FormLabel htmlFor='name'>Group name:</FormLabel>
                                        <Input id='name' type='text' variant='outline'
                                               {...register('name', {
                                                   required: 'This is required'
                                               })} />
                                        <FormErrorMessage>
                                            {errors.name && errors.name.message}
                                        </FormErrorMessage>
                                    </FormControl>

                                    <FormControl paddingTop='0.5rem' isRequired isInvalid={errors.name}>
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

                                    <FormControl isRequired isInvalid={errors.description}>
                                        <FormLabel htmlFor='description'>Description:</FormLabel>
                                        <Textarea id='description' type='text' variant='outline'
                                                  {...register('description')} />
                                    </FormControl>

                                    <Button variant='delete' onClick={() => {setAlertIsOpen(prev => !prev)}}>Delete this group</Button>
                                    <DeleteAlert isOpen={alertIsOpen} onClose={setAlertIsOpen} toDelete='group'
                                                 editModalIsOpen={props.onClose}
                                                 url={`${baseUrl}/groups/${groupCode}`} />
                                </GridItem>
                            </Grid>
                        </ModalBody>

                        <ModalFooter>
                            <HStack m='auto' spacing={5}>
                                <Button variant='primary' size='small' type='submit' isLoading={isSubmitting}>Add</Button>
                                <Button variant='secondary' size='small' onClick={() => props.onClose(false)}>Cancel</Button>
                            </HStack>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}