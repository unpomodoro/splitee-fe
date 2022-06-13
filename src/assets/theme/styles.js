export const styles = {
    global: (props) => ({
        body: {
            background: 'rgb(100,0,255) linear-gradient(0deg, rgba(100,0,255,1) 0%, rgba(100,0,255,1) 30%, rgba(255,255,255,1) 100%)',
            backgroundAttachment: 'fixed',
            margin: '0',
            height: '100vh',
        },
        header: {
            height: '4rem',
            backgroundColor: 'white',
        },
        '.header-wrapper': {
            height: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 10rem'
        },
        /*main: {
            position: 'absolute',
            width: '70%',
            height: '90vh',
            backgroundColor: 'white',
            marginTop: '1rem auto',
            borderRadius: '15'
        },*/
        '.list': {
            width: '80%',
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingBottom: '3rem'
        },
        '::-webkit-scrollbar': {
            bg: 'none',
            width: '8px'
        },
        '::-webkit-scrollbar-track': {
            bg: 'none',
            borderRadius: '10px'
        },

        '::-webkit-scrollbar-thumb': {
            background: 'white',
            borderRadius: '10px'
        },
        '.photo-upload': {
            _hover: {
                cursor: 'pointer'
            }
        },
        '.chart': {
            width: '25%',
            height: '25%',
        },
        '.homepage': {
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-around',
            width: '20rem',
            height: 'auto',
            marginY: 'auto'
        }
    }),
}