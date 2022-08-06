import React, { useEffect, useState } from "react";
import type { ReactElement } from 'react'
import NextLink from 'next/link'
import { useDisclosure, TableContainer, Table, Thead, Tbody, Tr, Th, Td, useControllableState, Modal, ModalOverlay, ModalContent, ModalHeader, Box, Button, ButtonGroup, IconButton, Flex, FormControl, FormLabel, Grid, GridItem, Heading, ModalCloseButton, Image, Input, InputGroup, InputLeftElement, Select, Spacer,ModalFooter, ModalBody, Text } from '@chakra-ui/react'
import Layout from '../../layouts/default'

// @ts-expect-error
import { Integration } from "lit-ceramic-sdk";
import { LitCeramicIntegrationParams } from "../../constants";

import Questions from "../../data/questions_sample.json";


type FormRowProps = {
}

const FormRow = (props: FormRowProps) => {
  return (    
    <Tr>
      <Td>
        <Text fontSize='md' color='white'>Form Name</Text>
      </Td>
      <Td w={16}>
        <Text fontSize='md' color='white'>210 Answered</Text>
      </Td>
      <Td w={16}>
        <NextLink href='/form'>
          <Button size='sm' variant='outline' color='white' >Get Link</Button>
        </NextLink>
      </Td>
    </Tr> 
  )
}

const AppRoot = (page: ReactElement) => {
  const [forms, setForms] = useState([{},{},{}]);

  // Lit
  const [litCeramicIntegration, setLitCeramicIntegration] = useState<any>(null);

  // Form Dialog
  const initialRef = React.useRef(null)
  const [title, setTitle] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const {isOpen, onOpen, onClose} = useDisclosure()

  useEffect(() => {
    const litCeramicIntegration = new Integration(
      ...LitCeramicIntegrationParams
    );
    litCeramicIntegration.startLitClient(window);
    setLitCeramicIntegration(litCeramicIntegration);
  }, []);
  
  const clickNew = () => {
    setTitle('')
    setContractAddress('')
    onOpen();
  };

  const clickSubmit = () => {
    const stringToEncrypt = {'title': title, questions: Questions['questions']};
    const accessControlConditions = [{
      'contractAddress': contractAddress,
      "standardContractType": "",
      "chain": "ethereum",
      "method": "eth_getBalance",
      "parameters": [":userAddress", "latest"],
      "returnValueTest": {
        "comparator": ">=",
        "value": "1000000000000"
      }
    }];
    console.log(stringToEncrypt)
    console.log(accessControlConditions)
    onClose();
    litCeramicIntegration.encryptAndWrite(stringToEncrypt, accessControlConditions).then((value: string) => {
      setForms([{
        title: title,
        url: `${location.origin}/forms?id=${value}`
      }])
    });
  };

  return (
    <>
    <Layout>
      <Box w={'full'} mb={32}>
        <Flex>
          <Heading as='h2' size='md' fontWeight='light' color='white'>My Forms</Heading>
          <Spacer />
          <Button size='sm' variant='outline' color='white'  onClick={clickNew}>Create New Form</Button>
        </Flex>
        <Grid mt={8} templateColumns='repeat(12, 1fr)' gap={4}>
          <GridItem colSpan={{base: 12, md: 4}}>
            <Flex>
              <Spacer />
              <ButtonGroup isAttached variant='outline'>
              </ButtonGroup>
            </Flex>
          </GridItem>
        </Grid> 
        <TableContainer>
          <Table size='lg'>
            <Thead>
              <Tr>
                <Th></Th>
                <Th></Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {forms.map((form, index) =>
                <FormRow key={`form_row_${index}`}/>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Layout>

    <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create new form with our template</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Form Name</FormLabel>
            <Input
              required
              ref={initialRef}
              placeholder='My best form ever' 
              value={title}
              onChange={(evt) => setTitle(evt.target.value)}/>
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>NFT Contract Address</FormLabel>
            <Input
              required
              placeholder='0xabcd...'
              value={contractAddress}
              onChange={(evt) => setContractAddress(evt.target.value)}/>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Flex>
            <Button size='md' variant='text' color='black' onClick={onClose}>Cancel</Button>
            <Button ml={4} size='md' variant='outline' color='#FC8CC9' onClick={clickSubmit}>Save</Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>  
  )
}

export default AppRoot
