import {Avatar, Button, HStack, Menu, MenuButton, MenuItem, MenuList, Text} from '@chakra-ui/react'
import logo from '../assets/img/logo.svg'
import {useNavigate} from "react-router-dom";
import {AuthService} from "../service/auth.service";
import {LineChartOutlined, LogoutOutlined, MoreOutlined} from "@ant-design/icons";
import {EditIcon} from "@chakra-ui/icons";
import {useState} from "react";
import EditAccount from "./forms/EditAccount";

export default function Header() {
    let navigate = useNavigate()
    const user = AuthService.getCurrentUser()
    const [ editIsOpen, setEditIsOpen ] = useState(false)

    return (
        <header>
            <div className='header-wrapper'>
                {
                    user === null ?
                        <><Button variant='link' onClick={() => navigate('/')}><img src={logo}/></Button>
                        <HStack gap={2}>
                            <Button variant='primary' size='small' onClick={() => navigate('/signup')}>Sign up</Button>
                            <Button variant='link' size='small' onClick={() => navigate('/login')}>Sign in</Button>
                        </HStack></> :
                        //-----------------------------------------------------------------------------------------------
                        <>
                        <Button variant='link' onClick={() => navigate('/groups')}><img src={logo}/></Button>
                        <HStack>
                            <Button variant='secondary' size='normal' mr='1.5rem' onClick={() => navigate('/groups')}>My groups</Button>
                            <Menu>
                                <MenuButton as={Button} variant='icon' flexDirection='column'>
                                    <Avatar size='md'
                                            name={user.name}
                                            src={user.photo}
                                    />{' '}
                                </MenuButton>
                                <MenuList>
                                    <MenuItem onClick={() => setEditIsOpen(prev => !prev)}><EditIcon/><Text pl='1rem'>Edit account</Text></MenuItem>
                                    <MenuItem color='danger' onClick={() => AuthService.logout()}><LogoutOutlined /><Text pl='1rem'>Log out</Text></MenuItem>
                                </MenuList>
                            </Menu>

                            <EditAccount isOpen={editIsOpen} onClose={setEditIsOpen}></EditAccount>
                        </HStack>
                        </>
                }
            </div>
        </header>
    )
}