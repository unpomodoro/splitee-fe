import {
    Button, Container,
    FormControl,
    FormErrorMessage,
    FormLabel, Heading,
    Input,
    Text, VStack, Center
} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {useRef} from "react";
import {useNavigate} from "react-router-dom";
import {AuthService} from "../../service/auth.service";

export default function SignUp () {

    let navigate = useNavigate()
    const {
        handleSubmit,
        register,
        watch,
        formState: { errors, isSubmitting },
    } = useForm()
    const password = useRef({})
    password.current = watch('password', '')

    async function signup(data) {
        await AuthService.signup(data)
        // navigate('/groups')
    }

    return (
        <Container width='20vw'>
            <form onSubmit={handleSubmit(signup)}>
                <VStack>
                    <Heading variant='homepage'>SIGN UP</Heading>

                    <FormControl isRequired isInvalid={errors.name}>
                        <FormLabel htmlFor='name'>Display name:</FormLabel>
                        <Input id='name' type='text' placeholder='Your name' variant='outline'
                               {...register('name', {
                                   required: 'This is required'
                               })} />
                        <FormErrorMessage>
                            {errors.name && errors.name.message}
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isRequired isInvalid={errors.email}>
                        <FormLabel htmlFor='email'>Email address:</FormLabel>
                        <Input id='email' type='email' placeholder='your@email.com' variant='outline'
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

                    <FormControl isRequired isInvalid={errors.password}>
                        <FormLabel htmlFor='password'>Change password:</FormLabel>
                        <Input id='password' type='password' placeholder='Enter password' variant='outline'
                               {...register('password', {
                                   required: 'This is required',
                                   minLength: {
                                       value: 8,
                                       message: "Password must have at least 8 characters"
                                   }
                               })} />
                        <FormErrorMessage>
                            {errors.password && errors.password.message}
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isRequired  isInvalid={errors.passwordConfirm}>
                        <FormLabel htmlFor='passwordConfirm'>Confirm password:</FormLabel>
                        <Input id='passwordConfirm' type='password' placeholder='Repeat password' variant='outline'
                               {...register('passwordConfirm', {
                                   required: 'This is required',
                                   validate: value => value === password.current || "The passwords do not match"
                               })} />
                        <FormErrorMessage>
                            {errors.passwordConfirm && errors.passwordConfirm.message}
                        </FormErrorMessage>
                    </FormControl>
                </VStack>

                    <Text align='left' fontSize='1em' paddingTop='0.7rem'>
                        Already have an account? <Text as='button' color='primary' onClick={() => navigate('/login')}>Log in</Text>
                    </Text>

                    <Center>
                        <Button align='left' marginTop='2rem' variant='primary' size='normal' type='submit' isLoading={isSubmitting}>
                            Create account
                        </Button>
                    </Center>

            </form>
        </Container>
)}