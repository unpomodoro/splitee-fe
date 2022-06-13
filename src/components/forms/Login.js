import {useNavigate} from "react-router-dom";
import {useForm} from "react-hook-form";
import {
    Button,
    Container,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    VStack
} from "@chakra-ui/react";
import { AuthService } from "../../service/auth.service";


export default function Login () {

    let navigate = useNavigate()
    const {
        handleSubmit,
        register,
        watch,
        formState: { errors, isSubmitting },
    } = useForm()

    async function login(data) {
        await AuthService.login(data)
        //navigate('/groups')
    }

    return (
        <Container width='20vw'>
            <form onSubmit={handleSubmit(login)}>
                <VStack>
                    <Heading variant='homepage'>LOG IN</Heading>

                    <FormControl isInvalid={errors.email}>
                            <FormLabel htmlFor='email'>Email address:</FormLabel>
                            <Input id='email' type='email' placeholder='Enter email address' variant='outline'
                                   {...register('email', {
                                       required: 'This is required',
                                       pattern: {
                                           value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                           message: "Invalid email address"
                                       }
                                   })} />
                            <FormErrorMessage>
                                {errors.email && errors.email.message}
                            </FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid={errors.password}>
                            <FormLabel htmlFor='password'>Change password:</FormLabel>
                            <Input id='password' type='password' placeholder='Enter password' variant='outline'
                                   {...register('password')} />
                            <FormErrorMessage>
                                {errors.password && errors.password.message}
                            </FormErrorMessage>
                        </FormControl>

                    <Button marginTop='1.5rem !important' variant='primary' size='normal' type='submit' isLoading={isSubmitting}>
                        Log in
                    </Button>
                </VStack>
            </form>
        </Container>

    )
}