import { extendTheme } from '@chakra-ui/react';

// Extend the default Chakra UI theme
const theme = extendTheme({
  colors: {
    brand: {
      primary: 'teal', // Update with your desired color
    },
  },
  components: {
    Button: {
      variants: {
        navbar: {
          bg: 'brand.primary',
          color: 'white',
          _hover: {
            bg: 'brand.primary', // Update with your desired color
            opacity: 0.8,
          },
        },
      },
    },
  },
});

export default theme;
