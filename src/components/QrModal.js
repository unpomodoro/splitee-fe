import {
    AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay,
    Button, Center, Container,
    Heading, HStack, Image, Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay, Text
} from "@chakra-ui/react";
import {useRef, useState} from "react";
import {putData} from "../hooks/putFetch";
import fallback from '../assets/img/fallback.png'
import {baseUrl} from "../URL";

// TODO test
export default function QrModal(props) {
    const isOpen = props.isOpen
    const [ isConfirmOpen, setIsConfirmOpen ] = useState(false)
    const cancelRef = useRef()

    async function nullDebt() {
        alert('hallo')
        const response = await putData(`${baseUrl}/debts/${props.owes.id}/${props.getsBack.id}/settleup`)
        console.log(response)
        props.onClose(false)
    }
    console.log(props)
    const bankAccount = props.getsBack.bankAccount.split('/');
    const accNum = bankAccount[0]
    const bankCode = bankAccount[1]

    const msg = 'Debt settlement from ' + props.owes.name

    function getSrc() {
        const base = 'https://api.paylibo.com/paylibo/generator/czech/image?'
        // ${accNum}&bankCode=0800&amount=1599.00&currency=CZK&vs=1234567890&message=ALZA.CZ&size=200
        return base + 'accountNumber=' + accNum + '&bankCode=' + bankCode + '&amount='
            + props.amount + '&currency=' + props.currency + '&message=' + msg + '&size=300&branding=false'
    }

    return (
        <Modal isCentered='true' isOpen={isOpen} onClose={() => props.onClose(false)}>
            <ModalOverlay />
            <ModalContent>

                <ModalHeader><Heading variant='modalHeader'>QR payment</Heading></ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <Container>
                        <Image loading='lazy' pb='1rem' align='center' alt="QR code" src={getSrc()} fallbackSrc={fallback} margin='0'/>
                        <Text><strong>Bank account:</strong> {props.getsBack.bankAccount}</Text>
                        <Text><strong>Amount:</strong> {props.amount} {props.currency}</Text>
                        <Text><strong>Message for recipient:</strong> {msg}</Text>
                    </Container>
                </ModalBody>

                <ModalFooter>
                    <HStack m='auto' spacing={5}>
                        <Button variant='safe' size='small' onClick={() => setIsConfirmOpen(prev => !prev) }>Done</Button>

                        <AlertDialog
                            isOpen={isConfirmOpen}
                            leastDestructiveRef={cancelRef}
                            onClose={() => setIsConfirmOpen(prev => !prev)}
                        >
                            <AlertDialogOverlay>
                                <AlertDialogContent>
                                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                        Delete Customer
                                    </AlertDialogHeader>

                                    <AlertDialogBody>
                                        Are you sure? You can't undo this action afterwards.
                                    </AlertDialogBody>

                                    <AlertDialogFooter>
                                        <Button ref={cancelRef} onClick={() => setIsConfirmOpen(prev => !prev)}>
                                            Cancel
                                        </Button>
                                        <Button colorScheme='red' onClick={() => nullDebt()} ml={3}>
                                            Yes, delete the debt
                                        </Button>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialogOverlay>
                        </AlertDialog>

                        <Button variant='secondary' size='small' onClick={() => props.onClose(false)}>Cancel</Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}