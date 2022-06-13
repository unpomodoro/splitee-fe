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
    InputRightElement,
    InputGroup,
    useToast,
    Heading,
    Grid,
    GridItem,
    Text,
    VStack,
    HStack,
    AspectRatio,
    Image, Spinner
} from "@chakra-ui/react"
import { useForm } from 'react-hook-form'
import { baseUrl } from "../../URL"
import {useParams} from "react-router-dom"
import {CopyIcon} from "@chakra-ui/icons";
import {useState, useEffect} from "react";
import { uploadImg } from '../../hooks/uploadImg'
import {PictureOutlined} from "@ant-design/icons";


export default function AddMember(props) {
// props = list of all members
    const isOpen = props.isOpen
    const toast = useToast()
    let params = useParams()
    let groupCode = params.groupId
    const [ member, setMember ] = useState({
        name: '',
        email: '',
        bankAcount: ''})

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm()


    const [isLoading, setIsLoading] = useState(false)
    const [photo, setPhoto] = useState('')
    let photoUrl = ''

    async function handleUpload(file) {
        setIsLoading(true)
        photoUrl = await uploadImg(file)
        setIsLoading(false)
        setPhoto(photoUrl)
    }

    async function handleSave(data) {
        data.photo = photo

        const settings = {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        }

        const memberResponse = await fetch(`${baseUrl}/members/${groupCode}`, settings).then(response => response.json())

        const url = `${baseUrl}/debts/${memberResponse.id}/`
        settings.body = JSON.stringify({ })
        await fetch(url, settings).then(response => response.json())
        
        window.location.reload(false)
    }

    return (
        <>
            <Modal isCentered='true' isOpen={isOpen} onClose={() => props.onClose(false)}>
                <ModalOverlay />
                <ModalContent>

                    <ModalHeader><Heading variant='modalHeader'>New member</Heading></ModalHeader>
                    <ModalCloseButton />

                    <form onSubmit={handleSubmit(handleSave)}>
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

                                <GridItem colSpan={2}>
                                    <FormControl isRequired isInvalid={errors.name}>
                                        <FormLabel htmlFor='name'>Name:</FormLabel>
                                        <Input id='name' type='text' placeholder='John Doe' variant='outline'
                                               {...register('name', {
                                                   required: 'This is required'
                                               })} />
                                        <FormErrorMessage>
                                            {errors.name && errors.name.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                </GridItem>

                                <GridItem colSpan={2}>
                                    <FormControl isInvalid={errors.bankAccount}>
                                        <FormLabel htmlFor='bankAccount'>Bank account:</FormLabel>
                                        <Input id='bankAccount' type='text' placeholder='1234567890/0000' variant='outline'
                                               {...register('bankAccount')} />
                                        <FormErrorMessage>
                                            {errors.bankAccount && errors.bankAccount.message}
                                        </FormErrorMessage>
                                    </FormControl>
                                </GridItem>

                                <GridItem colSpan={2}>
                                    <FormLabel>Copy this to share the group!</FormLabel>
                                    <InputGroup>
                                        <Input readOnly value={groupCode} variant='filled' />
                                        <InputRightElement as='button' children={<CopyIcon/>} onClick={() => {
                                            navigator.clipboard.writeText(groupCode)
                                            toast({
                                                position: 'top',
                                                title: 'Copied to clipboard!',
                                                status: 'success',
                                                duration: 1000,
                                                isClosable: true,
                                            })
                                        }}/>
                                    </InputGroup>
                                </GridItem>
                            </Grid>
                        </ModalBody>

                        <ModalFooter>
                            <HStack m='auto' spacing={5}>
                                <Button variant='primary' size='small' type='submit' isLoading={isSubmitting} onClick={() => props.onClose(false)}>
                                    Add
                                </Button>
                                <Button variant='secondary' size='small' onClick={() => props.onClose(false)}>
                                    Cancel
                                </Button>
                            </HStack>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}