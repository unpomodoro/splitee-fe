import { extendTheme, theme as base, withDefaultVariant } from '@chakra-ui/react'
import { ButtonStyle as Button } from './ButtonStyle'
import { HeadingStyle as Heading } from './HeadingStyle'
import { TextStyle as Text } from './TextStyle'
import { styles } from './styles'

export const customTheme = extendTheme({
    styles,
    colors: {
        primary: '#6201FF',
        secondary: '#F6BA09',
        safe: '#38A169',
        danger: '#E53E3E'
    },
    fonts: {
        heading: `'Montserrat', ${base.fonts?.heading}`,
        body: `'Montserrat', ${base.fonts?.body}`
    },
    components: {
        Button,
        Heading,
        Text,
        ModalOverlay: {
            bg: 'blackAlpha.900'
        },
    },
    layerStyles: {
        item: {
            border: '1px solid',
            borderColor: 'primary',
            borderRadius: '5px',
            display: 'flex',
            padding: '1rem',
            width: '100%',
            alignItems: 'center'
        },
        modalFooter: {
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4',
        }
    }

    }, 
    withDefaultVariant({
        variant: 'filled',
        components: ['Input', 'Select']
    })
    )