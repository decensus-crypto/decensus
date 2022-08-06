import React from 'react';
import type { ReactElement } from 'react'
import NextLink from 'next/link'
import { Container, Box, Heading, Image, Center, Button, Grid, GridItem } from '@chakra-ui/react'
import Layout from '../layouts/default'

const Answer = (page: ReactElement) => {
  return (    
    <Layout>
      <Container>
        <Box mt={36}>
          <Center>
            <Heading as='h2' color='white' size='lg' fontWeight='bold'>Form Title</Heading>
          </Center>
        </Box>
        <Box mt={8}>
          <Center>
            <NextLink href='/answer'>
              <Button size='lg' variant='outline' color='white' >Connect Wallet and Answer this Form</Button>
            </NextLink>
          </Center>
        </Box>
      </Container>
    </Layout>
  )
}

export default Answer
