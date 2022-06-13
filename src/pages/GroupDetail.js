import {
    Button,
    Heading,
    Avatar,
    SimpleGrid,
    Flex,
    Text,
    VStack,
    Spacer,
    Menu,
    MenuButton,
    MenuList, MenuItem, Modal, ModalOverlay, ModalContent, ModalHeader,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    HStack,
    Select,
    Textarea,
} from "@chakra-ui/react"
import { ChevronLeftIcon, AddIcon, EditIcon } from "@chakra-ui/icons"
import { useFetch } from '../hooks/useFetch'
import {LineChartOutlined, LogoutOutlined, MoreOutlined} from '@ant-design/icons'
import { useNavigate, useParams} from "react-router-dom"
import { baseUrl } from "../URL"
import { useForm } from 'react-hook-form'
import {useState, useEffect} from "react";
import CreateBill from "../components/forms/CreateBill";
import EditGroup from "../components/forms/EditGroup";
import { useToast } from '@chakra-ui/react'
import 'react-datepicker/dist/react-datepicker.css';

export default function GroupDetail() {

    let params = useParams()
    let groupCode = params.groupId
    let navigate = useNavigate()

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm()

    const [ resetSplit, setResetSplit ] = useState(false)
    const [ isOpenModal, setIsOpenModal ] = useState(false) // TODO set to false 
    const [ editIsOpen, setEditIsOpen ] = useState(false)
    const [bill, setBill] = useState(null)

    const {data: bills, isLoading, error} = useFetch(`${baseUrl}/groups/${groupCode}/bills`)
    const {data: group, isLoading1, error1} = useFetch(`${baseUrl}/groups/${groupCode}`)

    function formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear(),
            hour = '' + d.getHours(),
            minute = '' + d.getMinutes(),
            sec = '' + d.getSeconds()

        month = (month.length < 2 ? '0' + month : month)
        day = (day.length < 2 ? '0' + day : day)
        hour = (hour.length < 2 ? '0' + hour : hour)
        minute = (minute.length < 2 ? '0' + minute : minute)
        sec = (sec.length < 2 ? '0' + sec : sec)

        return [day, month, year].join('.') + ' ' + [hour, minute, sec].join(':')
    }


    const listBills = bills.map( b => {

        return (
            <Flex key={b.id} layerStyle='item' justify='space-between'>
                <Avatar size='lg'
                name={b.payer.name}
                src={b.payer.photo}
                />{' '}
                <VStack align='flex-start' spacing={0.5}>
                    <Text pl='1rem'>{formatDate(b.date)}</Text>
                    <Heading variant='cardName'>{b.description}</Heading>

                </VStack>
                <Spacer/>
                <VStack pr={5} spacing={0.5}>
                    <Text fontSize='1.5em' fontWeight='semibold' color='danger'>
                        {b.amount} {group.currency}
                    </Text>
                    <Text fontSize='0.8em'>
                        Paid by {b.payer.name}
                    </Text>
                </VStack>
                <Button variant='icon' onClick={() => {
                        setBill(b)
                        setIsOpenModal(true)
                        setResetSplit(false)
                    }}>
                        <EditIcon color='primary' fontSize='1.7em'/>
                    </Button>
                
            </Flex>
        )
    }) 

    return (
        <div className="list">
            
            <Flex justify='space-between' align='baseline'>
                <Heading as='h1' variant='pageTitle'>{group.name}</Heading>
                <Button leftIcon={<ChevronLeftIcon />} variant='link' onClick={() => navigate(-1)}>
                    Back to My groups
                </Button>
            </Flex>

            <Heading as='h2' variant='pageDetail'>
                {group.description === null ? 'Here shall be the group\'s description...' : group.description}
            </Heading>
            
            <Flex justify='flex-end' align='center' marginTop='1rem' marginBottom='1.5rem' gap={4}>
                <Button leftIcon={<AddIcon />} variant='primary' size='normal' onClick={() => {
                    setIsOpenModal(prev => !prev)
                    setBill(null)
                    setResetSplit(true)
                }}>
                    Add expense
                </Button>

                <Button variant='secondary' size='normal' onClick={() => navigate(`/group/${groupCode}/members`)}>
                    Members
                </Button>

                <Menu>
                    <MenuButton as={Button} variant='icon' flexDirection='column'>
                        <MoreOutlined style={{fontSize: '2.5em', strokeWidth: '60', stroke: '#6201FF', color: '#6201FF'}}/>
                    </MenuButton>
                    <MenuList>
                        <MenuItem onClick={() => setEditIsOpen(prev => !prev)}><EditIcon/><Text pl='1rem'>Edit group</Text></MenuItem>
                        <MenuItem onClick={() => navigate(`statistics`)}><LineChartOutlined /><Text pl='1rem'>Statistics</Text></MenuItem>
                        <MenuItem color='danger'><LogoutOutlined /><Text pl='1rem'>Leave group</Text></MenuItem>
                    </MenuList>
                </Menu>
            </Flex>

            <EditGroup isOpen={editIsOpen} onClose={setEditIsOpen}/>

            <SimpleGrid columns={1} spacing={0.5}>
                { bills.length === 0 ? 
                    <Text variant='nothingHere'>Nothing here yet ヽ(´｡• ᵕ •｡`)ﾉ.<br/>Try adding an expense ♡</Text> :
                <>{listBills}</> }
            </SimpleGrid>

            <CreateBill isOpen={isOpenModal} onClose={() => { setResetSplit(null); setIsOpenModal(! isOpenModal)}} bill={bill} reset={resetSplit} />
            
        </div>
    )
}