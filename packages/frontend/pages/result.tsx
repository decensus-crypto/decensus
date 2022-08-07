import React from 'react';
import type { ReactElement } from 'react'
import { useEffect, useState } from "react";
import { Container, Box, Center, Heading } from '@chakra-ui/react'

import Highcharts from 'highcharts';
import Highcharts3d from 'highcharts/highcharts-3d';
import HighchartsExporting from "highcharts/modules/exporting";
 
import Layout from '../layouts/default'

const Root = (page: ReactElement) => {

  const buildAgeChart = () => {
    Highcharts.chart('ageChartContainer', {
      chart: {
        style: {
          color: "#ffffff"
        },
        type: 'bar',
        marginRight: 30,
        backgroundColor: '#000000',
      },
      title: {
        text: 'Lil Nouns NFT community values survey',
        style: {
          color: "#ffffff"
        },
      },
      subtitle: {
        text: 'Source: <a href="https://decensus.io/0x9823972887123988">decensus.io survey</a>',
        style: {
          color: "#ffffff"
        },
      },
      xAxis: {
        type: 'category',
        title: {
          text: null,
          style: {
            color: "#ffffff"
          },
        },
        labels: {
          style: {
            color: "#ffffff"
          },
        }
      },
      yAxis: {
        lineWidth: 1,
        title: {
          text: 'Votes',
          align: 'high',
          style: {
            color: "#ffffff"
          },
        },
        showLastLabel: false,
        labels: {
          style: {
            color: "#ffffff"
          },
        }
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      legend: {enabled: false},
      credits: {enabled: false},
      series: [{
        name: 'Votes',
        data: [
          ["Under 21", 50],
          ["Between 21 and 30", 230],
          ["Between 31 and 40", 222],
          ["Between 41 and 50", 40],
          ["Over 50", 10],
          ["Prefer not to respond", 10],
        ]
      }]
    });
  }

  const buildCountryChart = () => {
    Highcharts.chart('countryChartContainer', {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45,
          beta: 0
        },
        backgroundColor: '#000000',
      },
      title: {
        text: 'Demographics',
        style: {
          color: "#ffffff"
        },
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          depth: 35,
          dataLabels: {
            enabled: true,
            format: '{point.name}',
            style: {
              color: "#ffffff"
            },
          }
        }
      },
      series: [{
        type: 'pie',
        name: 'Country of residence',
        data: [
          {name: 'US', y: 123, sliced: true, selected: true},
          ['Canada', 12],
          ['Mexico', 2],
          ['Dominican Republic', 6],
          ['Spain', 3],
          ['Prefer not to say', 2]
        ]
      }]
    })
  }

  useEffect(() => {
    Highcharts3d(Highcharts);
    HighchartsExporting(Highcharts);
    buildAgeChart();
    buildCountryChart();
  })

  return (    
    <Layout>
      <Box w={'full'} mb={32}>
        <Center>
          <Heading as='h2' color='white' size='lg' fontWeight='bold'>Answer Summary For "Form Title"</Heading>
        </Center>
        <Container maxWidth={"2xl"} mt={32}>
          <Box boxShadow={'lg'} rounded={'lg'}>
            <figure className="highcharts-figure">
                <div id="ageChartContainer"></div>
            </figure>
          </Box>
        </Container>
        <Container maxWidth={"2xl"} mt={8}>
          <Box boxShadow={'lg'} rounded={'lg'} p={8}>
            <figure className="highcharts-figure">
            <div id="countryChartContainer"></div>
            </figure>
          </Box>
        </Container>
      </Box>
    </Layout>
  )
}

export default Root
