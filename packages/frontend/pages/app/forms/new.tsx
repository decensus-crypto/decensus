import React from 'react';
import type { ReactElement } from 'react'
import { Box, Text } from '@chakra-ui/react'
import Layout from '../../../layouts/default'

const Root = (page: ReactElement) => {
  return (    
    <Layout>
      <Box w={'full'} mb={32}>
      <Text color='white'>New Form</Text>
      </Box>
    </Layout>
  )
}

export default Root
