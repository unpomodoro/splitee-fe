import { whiten } from '@chakra-ui/theme-tools'

export const ButtonStyle = {
    // Styles for the base style
    baseStyle: {
        fontSize: '1.5em',
        borderRadius: '50px',

    },
    // Styles for the size variations
    sizes: {
        normal: {
            minWidth: '11rem',
            height:'3rem',
            fontSize: '1.2em',
        },
        small: {
            minWidth: '8rem',
            height:'2.5rem',
            fontSize: '1em',
        },
        smallSquare: {
            width: '55px',
            height:'55px',
            fontSize: '1.6rem',
            fontWeight: 'bold'
        }
    },
    // Styles for the visual style variations
    variants: {
        primary: {
            bg: 'primary',
            color: 'white',
            _hover: {
                bg: whiten('primary', 20)
            },

        },
        secondary: {
            bg: 'transparent',
            outline: '2px solid',
            outlineOffset: '-2px',
            borderColor: 'primary',
            color: 'primary',
            _hover: {
                border: '0',
                bg: whiten('primary', 20),
                color: 'white'
            },

        },
        safe: {
            bg: 'safe',
            color: 'white',
            _hover: {
                bg: whiten('safe', 20)
            },
        }, 
        danger: {
            bg: 'danger',
            color: 'white',
            _hover: {
                bg: whiten('danger', 20)
            },
        },
        link: {
            color: 'primary',
            fontSize: '1.2rem',
            fontWeight: 'normal',
            height: '2rem',
            width: 'auto',
            padding: '0.3rem',          
        },
        delete: {
            color: 'danger',
            padding: '0',
            marginTop: '0.5rem'
        },
        icon: {
            maxWidth: '40px',
        },
        split: {
            color: 'primary',
            outline: '1px solid',
            borderRadius: '15px',
            _focus: {
                outline: '4px',
                color: 'primary'
            }
        }

    },
    // The default `size` or `variant` values
    defaultProps: {},
  }