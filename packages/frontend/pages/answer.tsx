import React from 'react';
import type { ReactElement } from 'react'
import NextLink from 'next/link'
import { useControllableState, Flex, Radio, Stack, Checkbox, Container, Box, Heading, RadioGroup, Center, FormControl, FormLabel, Input, Button, Spacer } from '@chakra-ui/react'
import Layout from '../layouts/default'

const Answer = (page: ReactElement) => {
  const FORM_SAMPLE = {
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
          "question_type":"multi_choice",
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useControllableState({ defaultValue: 0 })

  return (    
    <Layout>
      <Container>
        <Box mt={8}>
          <Center>
            <Heading as='h2' color='white' size='sm' fontWeight='bold'>Form Title</Heading>
          </Center>
        </Box>
        <Box w={'full'} mt={24}>
          <FormControl>
            {FORM_TEMPLATE['questions'].map((question, index) =>
              <Box key={`question_${index}`}>
                {(currentQuestionIndex === index) &&
                  <Box>
                    <FormLabel color='white' size='xl'>
                      <Heading as='h3' color='white' size='lg' fontWeight='light'>
                        { `${index + 1}. ${question['question_body']}` }
                      </Heading>
                    </FormLabel>
                    {(question['question_type'] === 'text') &&
                      <Input mt={8} placeholder='Answer Here' />
                    }
                    {(question['question_type'] === 'single_choice') &&
                      <RadioGroup>
                        <Stack>
                          {question['choices'].map((choice, iindex) =>
                            <Radio size='lg' key={`question_${index}_choice_${iindex}`}>
                              <Box color="white">{choice['text']}</Box>
                            </Radio>
                          )}
                        </Stack>
                      </RadioGroup>
                    }
                    {(question['question_type'] === 'multi_choice') &&
                      <Stack>
                        {question['choices'].map((choice, iindex) =>
                          <Checkbox size='lg' key={`question_${index}_choice_${iindex}`}>
                            <Box color="white">{choice['text']}</Box>
                          </Checkbox>
                        )}
                      </Stack>
                    }
                    <Center mt={8}>
                      {(currentQuestionIndex < FORM_TEMPLATE['questions'].length - 1) &&
                        <Flex>
                          <Button size='lg' mr={8} variant='text' color='white' disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>Back</Button>
                          <Button size='lg' ml={8} variant='outline' color='white' onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}>Next</Button>
                        </Flex>
                      }
                      {(currentQuestionIndex >= FORM_TEMPLATE['questions'].length - 1) &&
                        <NextLink href='/result'>
                          <Button size='lg' variant='outline' color='white'>Submit</Button>
                        </NextLink>
                      }
                    </Center>
                  </Box>
                }
              </Box>
            )}
          </FormControl>
        </Box>
      </Container>
    </Layout>
  )
}

export default Answer
