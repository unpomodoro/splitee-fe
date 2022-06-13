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
    Input, FormErrorMessage, Box, Avatar, Heading, SimpleGrid, HStack, Text,
} from "@chakra-ui/react"
import { useToast } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { baseUrl } from "../../URL"
import {useNavigate, useParams} from "react-router-dom"
import {AddIcon, CopyIcon} from "@chakra-ui/icons";
import {useState} from "react";
import Equal from './split/Equal'
import Exact from './split/Exact'
import Percentage from './split/Percentage'
import Share from './split/Share'
import {useFetch} from "../../hooks/useFetch";
import {SubModalContent} from "../SubModalContent";

export default function Split(props) {
// props = groupCode --> delete declaration below
    //const isOpen = props.isOpen
    const isOpen = true
    let navigate = useNavigate()
    const toast = useToast()

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm()

    // THIS MIGHT BE MOVED TO PARENT COMPONENT

    let params = useParams()
    let groupCode = params.groupId

    function resetValues(members){
        members.forEach(m => {
            m.amount = 0;
            m.value = 0;
        });
    }

    function renderSplitType() {
        switch (props.splitType) {
            case 'EQUAL':
                return 'equally'
            case 'EXACT':
                return 'by exact amounts'
            case 'PERCENTAGE':
                return 'by percentage'
            case 'SHARE':
                return 'by shares'
        }
    }

    function renderSwitch() {

        switch (props.splitType) {
            case 'EQUAL':
                return (<Equal members={props.members} amount={props.amount} currency={props.currency} memberCnt={props.memberCnt} setMemberCnt={props.setMemberCnt} handleCheck={props.handleCheck} isEdit={props.isEdit} />)
            case 'EXACT':
                return <Exact members={props.members} amount={props.amount} currency={props.currency} memberCnt={props.memberCnt} setMemberCnt={props.setMemberCnt} handleCheck={props.handleCheck} isEdit={props.isEdit}/>
            case 'PERCENTAGE':
                return <Percentage members={props.members} amount={props.amount} currency={props.currency} memberCnt={props.memberCnt} setMemberCnt={props.setMemberCnt} handleCheck={props.handleCheck} isEdit={props.isEdit}/>
            case 'SHARE':
                return <Share members={props.members} amount={props.amount} currency={props.currency} memberCnt={props.memberCnt} setMemberCnt={props.setMemberCnt} handleCheck={props.handleCheck} isEdit={props.isEdit} totalShares={props.totalShares} setTotalShares={props.setTotalShares} />
      }
    }
    return (
        <SubModalContent>
            <ModalHeader height='auto'>
                <Heading variant='splitPage' pt='1rem' pb='0.6rem'>How to split it?</Heading>
                <HStack justify='center' gap={4} pb='0.6rem'>
                    <Button variant='split' size='smallSquare' onClick={() => { resetValues(props.members); props.setSplitType('EQUAL')}}>=</Button>
                    <Button variant='split' size='smallSquare' onClick={() => { resetValues(props.members); props.setSplitType('EXACT')}}>1.23</Button>
                    <Button variant='split' size='smallSquare' onClick={() => { resetValues(props.members); props.setSplitType('PERCENTAGE')}}>%</Button>
                    <Button variant='split' size='smallSquare' onClick={() => { resetValues(props.members); props.setSplitType('SHARE')}}>1/x</Button>
                </HStack>
                <Text> Split {renderSplitType()} </Text>
            </ModalHeader>

            {renderSwitch()}

        </SubModalContent>
    )
}