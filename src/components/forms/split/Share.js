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

export default function Share(props) {
    const [memberValues, setMemberValues] = useState(initMemberValues(props.members))

    useEffect(() => {
        if(!props.isEdit){
            resetCheckBoxes(props)
            props.setTotalShares(0)
        }
            
        else {
            let shares = 0
            props.members.forEach(m => {
                shares += m.value
            });

            props.setTotalShares(shares)
        }
            

        return () => props.setTotalShares(0)
    }, [])

    function handleSplitShare(member, e) {
        //
        let allShares = props.totalShares

        if(e.target.value){
            let oldVal = member.value
            member.value = e.target.value
            
            allShares += parseInt(member.value) - parseInt(oldVal)
    
        } else {
            allShares -= parseInt(member.value)
            member.value = 0
            member.amount = 0
        }

        props.setTotalShares(allShares)
        let i = 0;

        const newArr = memberValues.map(m => {
            const val = props.members[i].value
            let currAmount = 0

            if(val > 0)
                currAmount = props.amount * (val / allShares)
            else 
                currAmount = 0

            const idx = i
            i++

            return {index: idx, amount: currAmount }
        })

        setMemberValues([...newArr])
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
                                <Text pl='5px'>Shares</Text>
                                <Input isDisabled={true} placeholder={0}/>
                                <Text pl='5px'>{props.currency}</Text></>
                                
                            :
                            <><Input placeholder={0} defaultValue={member.value} onChange={(e) => handleSplitShare(member, e)}/>
                                <Text pl='5px'>Shares</Text>
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