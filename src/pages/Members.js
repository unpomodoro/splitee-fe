import { Button, Heading, Avatar, SimpleGrid, Flex, Text, VStack, HStack, Spacer  } from "@chakra-ui/react"
import { ChevronLeftIcon, AddIcon, EditIcon } from "@chakra-ui/icons"
import { useFetch } from '../hooks/useFetch'
import { TransactionOutlined } from '@ant-design/icons'
import { useNavigate, useParams} from "react-router-dom"
import {baseUrl} from "../URL";
import {useState} from "react";
import AddMember from "../components/forms/AddMember";
import EditMember from "../components/forms/EditMember";

export default function Members() {

    let params = useParams()
    let groupCode = params.groupId
    const {data: members, isLoading, error} = useFetch(`${baseUrl}/groups/${groupCode}/members`)

    let navigate = useNavigate()

    const group = useFetch(`${baseUrl}/groups/${params.groupId}`)
    const currency = group.data.currency

    const [addIsOpen, setAddIsOpen] = useState(false)
    const [openFormId, setOpenFormId] = useState(0)

    const listMembers = members.map( member => {
        const isDebtFree = (member.debt === 0)
        const isInDebt = (member.debt < 0)
        return (
            <Flex layerStyle='item' justify='space-between' key={member.id}>
                <Avatar size='lg'
                name={member.name}
                src={member.photo}
                />{' '}
                <Heading variant='cardName'>{member.name}</Heading>
                <Spacer/>
                <VStack pr={5} spacing={0.5}>
                    <Text fontSize='1.5em' fontWeight='semibold' color={isDebtFree ? 'safe' : (isInDebt ? 'danger' : 'safe')}>
                        {Math.abs(member.debt)} {currency}
                    </Text>
                    <Text fontSize='0.8em'>{ isDebtFree ? 'is debt-free' :
                                            (isInDebt ? 'is in debt' : 'gets back')}
                    </Text>
                </VStack>

                <VStack>
                    <Button variant='icon' onClick={() => navigate(`/group/${groupCode}/members/${member.id}`)}>
                        <TransactionOutlined style={{ color: '#6201FF', fontSize: '1.7em'}} />
                    </Button>
                    <Button variant='icon' onClick={() => {
                        setOpenFormId(member.id)
                    }}>
                        <EditIcon color='primary' fontSize='1.7em'/>
                        <EditMember isOpen={openFormId === member.id} onClose={() => {setOpenFormId(null)}} member={member}/>
                    </Button>
                </VStack>
            </Flex>
        )
    }) 

    return (
        <div className="list">
            
            <Flex justify='space-between' align='baseline'>
                <Heading as='h1' variant='pageTitle'>Members</Heading>
                <Button leftIcon={<ChevronLeftIcon />} variant='link' onClick={() => navigate(-1)}>
                    Back
                </Button>
            </Flex>

            <Heading as='h2' variant='pageDetail'>{group.data.name}</Heading>
            
            <Flex justify='flex-end' marginTop='1rem' marginBottom='1.5rem'>
                <Button leftIcon={<AddIcon />} variant='primary' size='normal' onClick={() => {setAddIsOpen(prev => !prev)} }>
                    Add member
                </Button>
            </Flex>
            <AddMember isOpen={addIsOpen} onClose={setAddIsOpen}/>

            <SimpleGrid columns={1} spacing={0.5}>
                {listMembers}
            </SimpleGrid>
        </div>
    )
}