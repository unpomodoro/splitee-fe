import {
    Avatar,
    Flex,
    Heading,
    Input,
    ModalBody,
    Text,
    VStack,
    Checkbox,
    GridItem, Grid
} from "@chakra-ui/react";
import {useEffect} from "react";
import { disableInput, handleChange, resetCheckBoxes } from "./UtilFuncs"

//props = all members, bill
export default function Equal(props) {

    useEffect(() => {
        if(!props.isEdit)
            resetCheckBoxes(props)
    }, [])

    const listMembers = props.members.map( member => {
        return (
            <Grid templateColumns='repeat(9, 1fr)' key={member.name} layerStyle='item'>
                <GridItem colSpan={1}>
                    <Flex justify='space-between'>
                        <Checkbox isChecked={member.isChecked}
                                  value={member.name}
                                  onChange={(e) => {
                                      handleChange(props, e)
                                  }}
                        ></Checkbox>
                        <Avatar padding='auto'
                                size='xs'
                                name={member.name}
                                src={member.photo}
                        />{' '}
                    </Flex>
                </GridItem>

                <GridItem colSpan={3}>
                    <Heading variant='memberSplitCard'>{member.name}</Heading>
                </GridItem>

                <GridItem colSpan={5}>
                    <Flex align='baseline' justify='space-between'>
                        {disableInput(props, member.name) ?
                            <><Input isDisabled={true} value={0}/>
                                <Text pl='5px'>{props.currency}</Text></>
                            :
                            <><Input isReadOnly={true} value={props.memberCnt === 0 ? (props.amount / props.members.length) : (props.amount / props.memberCnt)}/>
                                <Text pl='5px'>{props.currency}</Text></>
                        }
                    </Flex>
                </GridItem>


            </Grid>
        )
    })


    return (
        <ModalBody>
            <VStack mb='1rem'>
                {listMembers}
            </VStack>
        </ModalBody>
    )
}