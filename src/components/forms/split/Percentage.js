import {
    Avatar,
    Box,
    Button,
    Checkbox,
    Flex, Grid, GridItem,
    Heading,
    HStack,
    Input,
    ModalBody,
    Spacer,
    Text,
    VStack
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import { disableInput, handleChange, resetCheckBoxes, initMemberValues } from "./UtilFuncs"

export default function Percentage(props) {
    const [memberValues, setMemberValues] = useState(initMemberValues(props.members))


    useEffect(() => {
        if(!props.isEdit)
            resetCheckBoxes(props)
    }, [])

    function handleSplitPer(member, e, i) {
        if(e.target.value){
            member.value = e.target.value
            member.amount = props.amount * (member.value / 100)
            console.log(member.amount)
        } else {
            member.value = 0
            member.amount = 0
        }

        const newArr = memberValues.map(m => {
            console.log(member.amount)
            if(m.index == i)
                return {index: i, amount: member.amount }

            return m
        })

        setMemberValues([...newArr])

        console.log(memberValues)

    }

    let index = 0

    const listMembers = props.members.map( member => {   
        const i = index
        index++

        return (
            //TODO toast alert if numbers do not add up
            <Grid templateColumns='repeat(9, 1fr)' key={i} layerStyle='item'>
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
                                <Text pl='5px'>%</Text>
                                <Input isDisabled={true} placeholder={0}/>
                                <Text pl='5px'>{props.currency}</Text></>
                                
                            :
                            <><Input placeholder={0} defaultValue={member.value} onChange={(e) => { handleSplitPer(member, e, i)}}/>
                                <Text pl='5px'>%</Text>
                                <Input isReadOnly={true} value={memberValues[i].amount}/>
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