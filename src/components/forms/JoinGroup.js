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
    FormErrorMessage, Select, Heading,
} from "@chakra-ui/react"
import { useToast } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { baseUrl } from "../../URL"
import {useNavigate, useParams} from "react-router-dom"
import {useFetch} from "../../hooks/useFetch";

export default function JoinGroup(props) {

    let params = useParams()
    let groupCode = params.groupId
    const {data: members, isLoading, error} = useFetch(`${baseUrl}/groups/${groupCode}/members/noacc`)

    // const isOpen = props.isOpen
    const isOpen = true
    let navigate = useNavigate()
    const toast = useToast()

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm()

    function handleJoin(value) {

        // TODO  new member is created

        fetch(`${baseUrl}/groups/${value.groupId}`)
            .then((response) => {
                if (!response.ok) {
                    console.log(response)
                    throw Error('Not found')
                }
                return response.json()
            })
            .then( () => {
                console.log(value.groupId)
                navigate(`/group/${value.groupId}`)
            })
            .catch( () => {
                toast({
                    position: 'top',
                    title: 'Group does not exist',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                })
            })
    }

    const listMembers = members.map( member => {
        return (
        <option value={member.id}>{member.name}</option>
        )})

    return (
        <Modal isCentered='true' isOpen={isOpen} onClose={() => props.onClose(false)}>
            <ModalOverlay />
            <ModalContent>

                <ModalHeader><Heading variant='modalHeader'>First, tell us who are you?</Heading></ModalHeader>
                <ModalCloseButton />

                <form onSubmit={handleSubmit(handleJoin)}>
                    <ModalBody>
                        <FormControl isRequired isInvalid={errors.member}>
                            <FormLabel htmlFor='member'>I am:</FormLabel>

                            <Select placeholder='Select member'
                                    {...register('member', {
                                        required: 'Select one option'}
                                    )}>
                                {listMembers}
                            </Select>

                            <FormErrorMessage>
                                {errors.member && errors.member.message}
                            </FormErrorMessage>
                        </FormControl>
                    </ModalBody>

                    {/*TODO onClick -> new member created + added*/}
                    <Button paddingTop='0.5rem' variant='link'>I am not here yet</Button>

                    <ModalFooter>
                        <Button variant='primary' type='submit' isLoading={isSubmitting}>Join</Button>
                    </ModalFooter>
                </form>
            </ModalContent>
        </Modal>
    )
}