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
    GridItem,
    VStack,
    Spinner,
    Image, Text, Grid, HStack,
} from "@chakra-ui/react"
import { useForm } from 'react-hook-form'
import { baseUrl } from "../../URL"
import {useParams} from "react-router-dom"
import {CopyIcon} from "@chakra-ui/icons";
import {useState, useRef, useEffect} from "react";
import {deleteFetch} from "../../hooks/deleteFetch";
import { putData } from '../../hooks/putFetch'
import {DeleteAlert} from "../DeleteAlert";
import {PictureOutlined} from "@ant-design/icons";
import {uploadImg} from "../../hooks/uploadImg";

export default function Edit(props) {
// props = member
    const isOpen = props.isOpen
    let params = useParams()
    let groupCode = params.groupId
    const [ member, setMember ] = useState(props.member)

    const toast = useToast()

    const {
        handleSubmit,
        register,
        setValue,
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
        const url = `${baseUrl}/members/${member.id}`
        await putData(url, data)

        window.location.reload(false)
    }

    useEffect(() => {
        setValue('name', member.name)
        setValue('email', member.email)
        setValue('bankAccount', member.bankAccount)

    }, [member])

    const [ alertIsOpen, setAlertIsOpen ] = useState(false)

    return (
        <>
            <Modal isCentered='true' isOpen={isOpen} onClose={() => props.onClose(false)}>
                <ModalOverlay />
                <ModalContent>

                    <ModalHeader><Heading variant='modalHeader'>Edit member</Heading></ModalHeader>
                    <ModalCloseButton />

                    <form onSubmit={handleSubmit((value) => {handleSave(value)})}>
                        <ModalBody>
                            <Grid templateRows='repeat(4, 1fr)'
                                  templateColumns='repeat(3, 1fr)'
                                  gap={3} >
                                {/*--------------PHOTO-------------------*/}
                                <GridItem rowSpan={4} colSpan={1}>
                                    <VStack >
                                        <Input variant='hover' id='img' type='file' accept='image/*' multiple={false} aria-hidden={true}
                                               width='90px' height='130px' opacity='0' position='absolute'
                                               onChange={(e) => {handleUpload(e.target.files[0])}}/>
                                        {
                                            isLoading ?
                                                <Spinner /> :
                                                (member.photo === null && photoUrl === '' ?
                                                        <PictureOutlined style={{fontSize:'2.5em', borderRadius:'50%', borderColor:'#CBD5E0',
                                                            width: '90px', height:'90px', padding:'25px 20px 20px 20px',
                                                            color:'#2D3748', background: '#E2E8F0'}}/> :
                                                    (member.photo !== null ?
                                                        <Image src={member.photo} borderRadius='full' width='90px'/> :
                                                        <Image src={photo} borderRadius='full' width='90px'/>
                                                    )
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

                                <GridItem colSpan={2}>
                                    <Button variant='delete' onClick={() => {setAlertIsOpen(prev => !prev)}}>Delete this member</Button>
                                    <DeleteAlert isOpen={alertIsOpen} onClose={setAlertIsOpen} toDelete='member'
                                                 editModalIsOpen={props.onClose}
                                                 url={`${baseUrl}/members/${props.member.id}`} />
                                </GridItem>
                            </Grid>

                        </ModalBody>

                        <ModalFooter>
                            <HStack m='auto' spacing={5}>
                                <Button variant='primary' size='small' type='submit' isLoading={isSubmitting} onClick={() => props.onClose(false)}>
                                    Save
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