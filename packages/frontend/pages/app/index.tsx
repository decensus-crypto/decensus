import React from 'react';
import type { ReactElement } from 'react'
import NextLink from 'next/link'
import { useDisclosure, TableContainer, Table, Thead, Tbody, Tr, Th, Td, useControllableState, Modal, ModalOverlay, ModalContent, ModalHeader, Box, Button, ButtonGroup, IconButton, Flex, FormControl, FormLabel, Grid, GridItem, Heading, ModalCloseButton, Image, Input, InputGroup, InputLeftElement, Select, Spacer,ModalFooter, ModalBody, Text } from '@chakra-ui/react'
import Layout from '../../layouts/default'

const FORM_TEMPLATE = {
  "questions":[
     {
        "question_body":"What’s your age range?",
        "question_type":"single_choice",
        "choices":[
           {"text":"Under 21"},
           {"text":"Between 21 and 30"},
           {"text":"Between 31 and 40"},
           {"text":"Between 41 and 50"},
           {"text":"Over 50"}
        ]
     },
     {
        "question_body":"What’s your gender?",
        "question_type":"single_choice",
        "choices":[
           {"text":"Male"},
           {"text":"Female"},
           {"text":"Transgender"},
           {"text":"Non-binary / non-conforming"},
           {"text":"Prefer not to say"}
        ]
     },
     {
        "question_body":"What’s your gender?",
        "question_type":"single_choice",
        "choices":[
           {"text":"Hispanic"},
           {"text":"White alone, non-Hispanic"},
           {"text":"Black or African American alone, non-Hispanic"},
           {"text":"American Indian and Alaska Native alone, non-Hispanic"},
           {"text":"Asian alone, non-Hispanic"},
           {"text":"Native Hawaiian and Other Pacific Islander alone, non-Hispanic"},
           {"text":"Some Other Race alone, non-Hispanic"},
           {"text":"Multiracial, non-Hispanic"},
           {"text":"Prefer not to say"}
        ]
     },
     {
        "question_body":"In what country are you based?",
        "question_type":"text",
        "choices":[]
     },
     {
        "question_body":"What’s your occupation's industry?",
        "question_type":"single_choice",
        "choices":[
           {"text":"Arts and entertainment"},
           {"text":"Business administration"},
           {"text":"Industrial and manufacturing"},
           {"text":"Law enforcement and armed forces"},
           {"text":"Science and technology"},
           {"text":"Others"}
        ]
     }
  ]
}
 
type FormRowProps = {
}

const FormRow = (props: FormRowProps) => {
  return (    
    <NextLink href='/forms/1'>
      <Tr>
        <Td>
          <Text fontSize='md' color='white'>Form Name</Text>
        </Td>
        <Td w={16}>
          <Text fontSize='md' color='white'>210 Answered</Text>
        </Td>
        <Td w={16}>
          <Button size='sm' variant='outline' color='white' >Get Link</Button>
          </Td>
      </Tr> 
    </NextLink>
  )
}

const AppRoot = (page: ReactElement) => {

  const { isOpen, onOpen, onClose } = useDisclosure()

  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)

  const forms = [{},{},{}];


  return (  
    <>
    <Layout>
      <Box w={'full'} mb={32}>
        <Flex>
          <Heading as='h2' size='md' fontWeight='light' color='white'>My Forms</Heading>
          <Spacer />
          <Button size='sm' variant='outline' color='white'  onClick={onOpen} >Create New Form</Button>
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
            <Input ref={initialRef} placeholder='My best form ever' />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>NFT Contract Address</FormLabel>
            <Input placeholder='0xabcd...' />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Flex>
            <Button size='md' variant='text' color='black' onClick={onClose}>Cancel</Button>
            <Button ml={4} size='md'  variant='outline' color='#FC8CC9'  onClick={onClose}>Save</Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>  
  )
}

export default AppRoot
