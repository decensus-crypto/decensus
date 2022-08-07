import React from 'react';
import type { ReactElement } from 'react'
import { Box } from '@chakra-ui/react'
import dynamic from "next/dynamic";
const ResultBody = dynamic(() => import("../components/ResultBody"), {
  ssr: false,
});
import Layout from '../layouts/default'

const Root = (page: ReactElement) => {
  return (    
    <Layout>
      <Box w={'full'} mb={32}>
        <ResultBody />
      </Box>
    </Layout>
  )
}

export default Root
