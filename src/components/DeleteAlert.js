import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay, Button
} from "@chakra-ui/react";
import {deleteFetch} from "../hooks/deleteFetch";
import {useRef} from "react";
import {useNavigate} from "react-router-dom";


export function DeleteAlert(props) {

    const url = props.url
    const isOpen = props.isOpen
    const cancelRef = useRef()
    let navigate = useNavigate()

    async function handleDelete() {
        const response = await deleteFetch(url)

        props.editModalIsOpen(false)
        props.onClose(false)

        props.toDelete === 'group' ? navigate('/groups') : window.location.reload(false)
    }

    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={props.onClose}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Delete {props.toDelete}
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        Are you sure? You can't undo this action afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={() => props.onClose(false)}>
                            Cancel
                        </Button>
                        <Button colorScheme='red' onClick={handleDelete} ml={3}>
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
        )

}
