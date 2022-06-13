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
    Input,
    FormErrorMessage,
    Heading,
    SimpleGrid,
    HStack,
    Select,
    Text,
    Textarea, GridItem, VStack, Spinner, Image, Grid,
} from "@chakra-ui/react"
import { useToast } from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import {useNavigate, useParams} from "react-router-dom"
import DatePicker from 'react-datepicker'
import {useState, useEffect} from "react";
import 'react-datepicker/dist/react-datepicker.css';
import {SubModalContent} from "../SubModalContent";
import {useFetch} from "../../hooks/useFetch";
import {baseUrl} from "../../URL";
import Split from "./Split";
import {uploadImg} from "../../hooks/uploadImg";
import {PictureOutlined} from "@ant-design/icons";

export default function CreateBill(props) {
    const isOpen = props.isOpen

    let params = useParams()
    let groupCode = params.groupId
    let bill = props.bill
    const group = useFetch(`${baseUrl}/groups/${params.groupId}`).data
    const {data: members, isLoading, error} = useFetch(`${baseUrl}/groups/${groupCode}/members`)

    let navigate = useNavigate()
    const toast = useToast()

    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm()

    const [startDate, setStartDate] = useState(new Date())
    const [amount, setAmount] = useState(0)
    const [splitType, setSplitType] = useState('EQUAL')
    const [memberCnt, setMemberCnt] = useState(0)
    const [totalShares, setTotalShares] = useState(0)

    useEffect(() => {
        if(props.reset)
            setSplitType('EQUAL')
            
    }, [props.reset])

    useEffect(() => {
        if(members.length > 0) {
            members.forEach((member) => {
                member.isChecked = true
                member.amount = 0
                member.value = 0
            })

            setMemberCnt(members.length)
        }
    }, [members])

    useEffect(() => {
        if(bill != null){
            setValue('description', bill.description)
            setValue('amount', bill.amount)
            setValue('payerId', bill.payer.id)
            setValue('date', bill.date)
            setValue('notes', bill.notes)

            setAmount(bill.amount)
            populateSplitsData()
        }

        else {
            setSplitType('EQUAL')
        }

    }, [bill])

    async function populateSplitsData () {
        const response = await fetch(`${baseUrl}/bills/${bill.id}/splits`).then(res => res.json())

        setMemberCnt(response.length)

        if(response.length > 0)
            setSplitType(response[0].type)

        members.forEach(m => {
            for(let i = 0; i < response.length; i++) {
                if(m.id == response[i].memberId) {
                    console.log(m)
                    m.isChecked = true
                    m.value = response[i].value
                    m.amount = response[i].amount
                    break
                } else {
                    m.isChecked = false
                    m.value = 0
                    m.amount = 0
                }    
            }
        })
    }

    function handleCheck(memberName){
        // find member by name and alter isChecked attribute.
        const member = members.find(e => e.name == memberName)

        member.isChecked ? member.isChecked = false : member.isChecked = true
    }

    const payerOptions = members.map( member => {
        return (
            <option key={member.id} value={member.id}>
                {member.name}
            </option>
        )
    })
    //------------------- PHOTO GROUP ------------------------------
    const [photoIsLoading, setPhotoIsLoading] = useState(false)
    const [photo, setPhoto] = useState('')
    let photoUrl = ''

    async function handleUpload(file) {
        setPhotoIsLoading(true)
        photoUrl = await uploadImg(file)
        setPhotoIsLoading(false)
        setPhoto(photoUrl)
        console.log(photo)
    }
    //--------------------------------------------------------------
    async function handleRequests(value) {
        value.date = startDate
        value.photo = photo
        
        const settings = {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(value) // body data type must match "Content-Type" header
        }

        const payerId = value.payerId
        let url = `${baseUrl}/bills/${groupCode}`

        if(props.bill != null){
            
            settings.method = 'PUT'
            url = `${baseUrl}/bills/${bill.id}`
        }
        
        try{
            const billResponse = await fetch(url, settings).then(res => res.json())
            const billId = billResponse.id

            url = `${baseUrl}/splits/${billId}/`
            const splits = []
            
            members.forEach(member => {
                if(member.isChecked){
                    const split = {}
                    split.memberId = member.id

                    switch(splitType){
                        case 'EQUAL':
                            split.amount = amount / memberCnt
                            split.value = split.amount
                            break
                        case 'EXACT':
                            split.amount = member.amount
                            split.value = member.amount
                            break
                        case 'PERCENTAGE':
                            split.amount = amount * (member.value / 100)
                            split.value = member.value
                            break
                        case 'SHARE':
                            split.amount = amount * (member.value / totalShares)
                            split.value = member.value
                            break
                    }

                    splits.push(split)
                }  
            })

            if(props.bill != null)
                settings.method = 'PUT'
            else
                settings.method='POST'
                
            const split = {
                billId: billId,
                payerId: payerId,
                amount: amount,
                type: splitType,
                splits: splits
            }

            settings.body = JSON.stringify(split)
            await fetch(url, settings).then(res => res.json())

            window.location.reload(false)
        }catch(error) {
            console.log(error)
        }
    }

    return (
        <Modal isCentered='true' isOpen={isOpen} onClose={() => props.onClose(false)} size='5xl' scrollBehavior='inside'>
            <ModalOverlay />
            <ModalContent  bg='none' shadow='none'>
                <ModalBody>
                    <SimpleGrid spacing={2} columns={2} >
                        <SubModalContent marginBottom='auto' >
                            <ModalHeader>
                                <Heading variant='modalHeader'>
                                    {bill ? 'Edit expense' : 'New expense'}
                                </Heading>
                            </ModalHeader>
                            <ModalCloseButton />

                            <form onSubmit={handleSubmit(value => handleRequests(value))}>
                                <ModalBody>

                                    <Grid templateRows='repeat(9, 1fr)'
                                          templateColumns='repeat(3, 1fr)'
                                          gap={0} >
                                        {/*--------------PHOTO-------------------*/}
                                        <GridItem rowSpan={4} colSpan={1}>
                                            <VStack >
                                                <Input variant='hover' id='img' type='file' accept='image/*' multiple={false} aria-hidden={true}
                                                       width='90px' height='130px' opacity='0' position='absolute'
                                                       onChange={(e) => {handleUpload(e.target.files[0])}}/>
                                                {
                                                    photoIsLoading ?
                                                        <Spinner /> :
                                                        (photo === '' ?
                                                                <PictureOutlined style={{fontSize:'2.5em', borderRadius:'50%', borderColor:'#CBD5E0',
                                                                    width: '90px', height:'90px', padding:'25px 20px 20px 20px',
                                                                    color:'#2D3748', background: '#E2E8F0'}}/> :
                                                                <Image src={photo} borderRadius='full' width='90px'/>
                                                        )
                                                }
                                                <Text color='primary'>Add receipt</Text>
                                            </VStack>
                                        </GridItem>
                                        {/*--------------------------------------*/}

                                        <GridItem rowSpan={2} colSpan={2} height='auto'>
                                            <FormControl isRequired isInvalid={errors.description}>
                                                <FormLabel htmlFor='description'>Description:</FormLabel>
                                                <Input id='description' type='text' placeholder='Lunch, groceries...' variant='outline'
                                                       {...register('description', {
                                                           required: 'This is required'
                                                       })} />
                                                <FormErrorMessage>
                                                    {errors.description && errors.description.message}
                                                </FormErrorMessage>
                                            </FormControl>
                                        </GridItem>

                                        {/*--------------------------------------*/}

                                        <GridItem rowSpan={2} colSpan={2}>
                                            <FormControl paddingTop='0.5rem' isRequired isInvalid={errors.amount}>
                                                <FormLabel htmlFor='amount'>Amount:</FormLabel>
                                                <HStack>
                                                    <Input id='amount' type='number' placeholder='0' variant='outline'
                                                           {...register('amount', {
                                                               valueAsNumber: true
                                                           })}
                                                           onChange={(e) => setAmount(e.target.value)}
                                                    />
                                                    <Text>{group.currency}</Text>
                                                </HStack>
                                                <FormErrorMessage>
                                                    {errors.amount && errors.amount.message}
                                                </FormErrorMessage>
                                            </FormControl>
                                        </GridItem>
                                        {/*--------------------------------------*/}

                                        <GridItem rowSpan={2} colSpan={3} marginTop='-10px'>
                                            <HStack gap={4} paddingTop='0.5rem'>
                                                <FormControl isInvalid={errors.paidBy}>
                                                    <FormLabel htmlFor='paidBy'>Paid by:</FormLabel>
                                                    {/* TODO paidBy default value = user */}
                                                    <Select placeholder='Select a member' variant='outline'  {...register('payerId')}>
                                                        {payerOptions}
                                                    </Select>
                                                    <FormErrorMessage>
                                                        {errors.paidBy && errors.paidBy.message}
                                                    </FormErrorMessage>
                                                </FormControl>

                                                <FormControl isInvalid={errors.date}>
                                                    <FormLabel htmlFor='date'>Date:</FormLabel>
                                                    <DatePicker as='Input' id='date' selected={startDate} dateFormat='dd/MM/yyy' onChange={(date) => setStartDate(date)} />
                                                </FormControl>
                                            </HStack>
                                        </GridItem>

                                        <GridItem rowSpan={3} colSpan={3}>
                                            <FormControl isInvalid={errors.notes}>
                                                <FormLabel htmlFor='notes'>Notes:</FormLabel>
                                                <Textarea id='notes' type='text' placeholder='Notes' variant='outline'
                                                          {...register('notes')} />
                                            </FormControl>
                                        </GridItem>
                                    </Grid>
                                </ModalBody>
                                <ModalFooter>
                                    <HStack m='auto' spacing={5}>
                                        <Button variant='primary' size='small' type='submit' isLoading={isSubmitting}>{bill ? 'Edit' : 'Add'}</Button>
                                        <Button variant='secondary' size='small' onClick={() => props.onClose(false)}>Cancel</Button>
                                    </HStack>
                                </ModalFooter>
                            </form>
                        </SubModalContent>
                        {/*----------------------------------------------------------------------------------------------*/}
                                                <Split
                                                    members={members} amount={amount} currency={group.currency} 
                                                    memberCnt={memberCnt} setMemberCnt={setMemberCnt}
                                                    splitType={splitType} setSplitType={setSplitType}
                                                    handleCheck={handleCheck} isEdit={bill === null ? false : true}
                                                    totalShares={totalShares} setTotalShares={setTotalShares} > 
                                                </Split>
                    </SimpleGrid>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}