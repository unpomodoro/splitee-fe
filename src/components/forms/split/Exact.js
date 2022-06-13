import {
    Avatar,
    Checkbox,
    Flex, Grid, GridItem,
    Heading,
    Input,
    ModalBody,
    Text,
    VStack
} from "@chakra-ui/react";
import {useEffect} from "react";
import { disableInput, handleChange, handleSplitAmount, resetCheckBoxes } from "./UtilFuncs"

//props = all members, bill
export default function Exact(props) {

    useEffect(() => {
        if(!props.isEdit)
            resetCheckBoxes(props)
    }, [])


    const listMembers = props.members.map( member => {
        return (
            //TODO toast alert if numbers do not add up

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
                            <><Input isDisabled={true} placeholder={0}/>
                                <Text pl='5px'>{props.currency}</Text></>
                            :
                            <><Input placeholder={0} defaultValue={member.amount} onChange={(e) => handleSplitAmount(member, e)}/>
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