import { whiten } from '@chakra-ui/theme-tools'

export const TextStyle = {
    // Styles for the base style
    baseStyles: {

    },
    // Styles for the size variations
    sizes: {},
    // Styles for the visual style variations
    variants: {
        nothingHere: {
            textAlign: 'center',
            color: 'gray.300',
            fontSize: '4xl',
            fontWeight: 'bold',
            paddingTop: '3rem'
        },
        pageDetail: {
            fontSize: '2xl',
            fontWeight: 'normal'
        },
        cardName: {
            fontSize: '2xl',
            fontWeight: 'normal',
            paddingLeft: '1rem'
        }
    },
    // The default `size` or `variant` values
    defaultProps: {},
  }