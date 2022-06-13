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
import {useRef} from "react";

export default function EditAccount(props) {
// props =
    const isOpen = props.isOpen
    let navigate = useNavigate()
    const toast = useToast()

    const {
        handleSubmit,
        register,
        watch,
        formState: { errors, isSubmitting },
    } = useForm()
    const password = useRef({})
    password.current = watch('password', '')

    function handleSave(value) {
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

                    {/* TODO - fields are filled with value saved in DB*/}
                    <ModalHeader><Heading variant='modalHeader'>My account</Heading></ModalHeader>
                    <ModalCloseButton />

                    <form onSubmit={handleSubmit(handleSave)}>
                        <ModalBody>
                            {/*TODO img import*/}
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

                            <FormControl paddingTop='0.5rem' isRequired isInvalid={errors.email}>
                                <FormLabel htmlFor='email'>Email address:</FormLabel>
                                <Input id='email' type='email' placeholder='john@doe.com' variant='outline'
                                       {...register('email', {
                                           pattern: {
                                               value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                               message: "Invalid email address"
                                           }
                                       })} />
                                <FormErrorMessage>
                                    {errors.email && errors.email.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl paddingTop='0.5rem' isInvalid={errors.bankAccount}>
                                <FormLabel paddingTop='0.5rem' htmlFor='bankAccount'>Bank account:</FormLabel>
                                <Input id='bankAccount' type='text' placeholder='1234567890/0000' variant='outline'
                                       {...register('bankAccount')} />
                                <FormErrorMessage>
                                    {errors.bankAccount && errors.bankAccount.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl paddingTop='0.5rem' isInvalid={errors.password}>
                                <FormLabel htmlFor='password'>Change password:</FormLabel>
                                <Input id='password' type='password' placeholder='Enter password' variant='outline'
                                       {...register('password', {
                                           minLength: {
                                               value: 8,
                                               message: "Password must have at least 8 characters"
                                           }
                                       })} />
                                <FormErrorMessage>
                                    {errors.password && errors.password.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl paddingTop='0.5rem' isInvalid={errors.passwordConfirm}>
                                <FormLabel htmlFor='passwordConfirm'>Confirm password:</FormLabel>
                                <Input id='passwordConfirm' type='password' placeholder='Repeat password' variant='outline'
                                       {...register('passwordConfirm', {
                                           validate: value => value === password.current || "The passwords do not match"
                                       })} />
                                <FormErrorMessage>
                                    {errors.passwordConfirm && errors.passwordConfirm.message}
                                </FormErrorMessage>
                            </FormControl>


                        </ModalBody>
                        <ModalFooter>
                            <HStack m='auto' spacing={5}>
                                <Button variant='primary' size='small' type='submit' isLoading={isSubmitting}>Save</Button>
                                <Button variant='secondary' size='small' onClick={() => props.onClose(false)}>Cancel</Button>
                            </HStack>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    )
}