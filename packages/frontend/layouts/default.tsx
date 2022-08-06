import React from 'react';
import { Container, Flex, Box, Spacer, Text } from '@chakra-ui/react'
import Logo from '../components/logo'

type Props = {
  children: JSX.Element,
}

const Layout = ({ children }: Props) => {
  return (
    <Box h='calc(100vh)' background={'black'}>
      <Container maxWidth={'8xl'}>
        <Flex>
          <Box minW={240} maxW={320} py={4}>
            <Logo height={12}/>
          </Box>
          <Spacer />
          <Box mt={6}>
            <Text color='white'>Wallet Address</Text>
          </Box>
        </Flex>
      </Container>
      <Container maxWidth={'8xl'}>{ children }</Container>
    </Box>
  )
}

export default Layout
