import {Button, Heading, Avatar, SimpleGrid, Flex, Text, Spacer, HStack, VStack} from "@chakra-ui/react"
import { ChevronLeftIcon } from "@chakra-ui/icons"
import { useFetch } from '../hooks/useFetch'
import {baseUrl} from "../URL";
import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import QrModal from "../components/QrModal";

export default function Debts(props) {
    let params = useParams()
    let memberId = params.memberId

    const {data: debts, isLoading, error} = useFetch(`${baseUrl}/members/${memberId}/debts`)
    const navigate = useNavigate()

    const group = useFetch(`${baseUrl}/groups/${params.groupId}`)
    const currency = group.data.currency

    const [ openModalId, setOpenModalId ] = useState( 0 )

    const listDebts = debts.map( debt => {

        console.log(debt)
        const date = ( Date.parse(debt.date) )  // ?? :D
        const isDebtFree = (debt.amount === 0)
        const isOwe = (debt.amount > 0)

        if (!isDebtFree) {      //only show debts
        // determine who is who -> the roles are correct in props
        let owes = isOwe ? {id: debt.owes.id, name: debt.owes.name} : {id: debt.getsBack.id, name: debt.getsBack.name}
        let getsBack = isOwe ? {id: debt.getsBack.id, name: debt.getsBack.name, bankAccount: debt.getsBack.bankAccount} :
                                {id: debt.owes.id, name: debt.owes.name, bankAccount: debt.owes.bankAccount}

        return (
            <Flex layerStyle='item' justify='space-between' key={[debt.owes.id, debt.getsBack.id]}>
                <Avatar size='lg'
                    name={debt.getsBack.name}
                    src={debt.getsBack.photo}
                />{' '}

                <Heading variant='cardName'>{debt.getsBack.name}</Heading>
                <Spacer/>

                <VStack pr={5} spacing={0.5}>
                    <Text fontSize='1.5em' fontWeight='semibold' color={isDebtFree ? 'safe' : (isOwe ? 'danger' : 'safe')}>
                        {Math.abs(debt.amount)} {currency}
                    </Text>
                    <Text fontSize='0.8em'><strong></strong> { isOwe ? `${debt.owes.name} owes` : `${debt.owes.name} gets back` }
                    </Text>
                </VStack>

                <Button variant='safe' size='normal' marginLeft='2rem' onClick={() => setOpenModalId(debt.getsBack.id)}>
                    Settle up
                </Button>

                <QrModal isOpen={openModalId === debt.getsBack.id} onClose={() => {setOpenModalId(null)}}
                         owes={owes} getsBack={getsBack} amount={Math.abs(debt.amount)} currency={currency}/>

            </Flex>
        )
    }})

    const member = useFetch(`${baseUrl}/members/${memberId}`)
    const memberName = member.data.name
    return (
        <div className="list">
            
            <Flex justify='space-between' align='baseline'>
                
                <HStack>
                    <Avatar size='lg'
                        name={memberName}
                        src={member.data.photo}
                        marginTop='3rem'
                        marginRight='1rem'
                    />{' '}
                    <Heading as='h1' variant='pageTitle'>{memberName}</Heading>
                </HStack>

                <Spacer/>
                <Button leftIcon={<ChevronLeftIcon />} variant='link' onClick={() => navigate(-1)}>Back</Button>
            </Flex>

            {/* TODO Only show debts and loans */}

            <SimpleGrid columns={1} spacing={0.5} marginTop='2rem'>
                {listDebts}
            </SimpleGrid>
        </div>
    )
}