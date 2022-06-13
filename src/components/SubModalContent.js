import {Box, useStyles} from "@chakra-ui/react";

export const SubModalContent = (props) => {
    const styles = useStyles();
    return (
        <Box
            //my='auto'
            borderRadius="md"
            pos="relative"
            bg={styles.dialog.bg}
            {...props}
        />
    )
}