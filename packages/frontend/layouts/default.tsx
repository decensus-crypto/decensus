import React from 'react';
import NextLink from 'next/link'
import { Container, Flex, Box, Spacer, Text } from '@chakra-ui/react'
import Logo from '../components/logo'

type Props = {
  children: JSX.Element,
}

const Layout = ({ children }: Props) => {
  return (
    <Box h='calc(100vh)' background={'black'}>
      <Container maxWidth={'6xl'}>
        <Flex>
          <NextLink href='/'>
            <Box minW={240} maxW={320} py={4}>
              <Logo height={12}/>
            </Box>
          </NextLink>
          <Spacer />
          <Box mt={6}>
            <Text color='white'>Wallet Address</Text>
          </Box>
        </Flex>
      </Container>
      <Container maxWidth={'6xl'}>{ children }</Container>
    </Box>
  )
}

export default Layout
