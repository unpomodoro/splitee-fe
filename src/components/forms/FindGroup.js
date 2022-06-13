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
    Input, FormErrorMessage, Heading, HStack,
} from "@chakra-ui/react"
import { useToast } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { baseUrl } from "../../URL"
import { useNavigate } from "react-router-dom"

export default function FindGroup(props) {

    const isOpen = props.isOpen
    let navigate = useNavigate()
    const toast = useToast()

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm()

    function handleFind(value) {
        console.log('oi')
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
    return (
        <>
            <Modal isCentered='true' isOpen={isOpen} onClose={() => props.onClose(false)}>
                <ModalOverlay />
                <ModalContent>

                    <ModalHeader><Heading variant='modalHeader'>Find a group</Heading></ModalHeader>
                    <ModalCloseButton />

                    <form onSubmit={handleSubmit(handleFind)}>
                        <ModalBody>
                        <FormControl isRequired isInvalid={errors.groupId}>
                            <FormLabel htmlFor='groupId'>Group ID:</FormLabel>
                            <Input id='groupId' type='text' placeholder='Type group ID'
                                   {...register('groupId', {
                                       required: 'This is required',
                                       minLength: { value: 7, message: 'Code should have 7 characters' },
                                   })} />
                            <FormErrorMessage>
                                {errors.groupId && errors.groupId.message}
                            </FormErrorMessage>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <HStack m='auto' spacing={5}>
                            <Button variant='primary' size='small' type='submit' isLoading={isSubmitting}>Find group</Button>
                            <Button variant='secondary' size='small' onClick={() => props.onClose(false)}>Cancel</Button>
                        </HStack>
                    </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}