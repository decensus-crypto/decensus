import { useControllableState, Box, Container, Flex, Spinner, Text, Heading, Divider, Spacer, Center, Image, Badge, StatGroup, Stat, StatLabel, StatNumber } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";
import Highcharts from "highcharts";
import Highcharts3d from "highcharts/highcharts-3d";
import HighchartsExporting from "highcharts/modules/exporting";

import {
  AGE_QUESTION_ID,
  AGE_QUESTION_OPTIONS,
  COUNTRY_QUESTION_ID,
  COUNTRY_QUESTION_OPTIONS,
} from "../constants/constants";
import { useLitCeramic } from "../hooks/useLitCeramic";
import { useResult } from "../hooks/useResult";


const NftSummary = () => {
  const [nftAddress, setNftAddress] = useControllableState({ defaultValue: '' })
  const [nftName, setNftName] = useControllableState({ defaultValue: '' })
  const [totalSupply, setTotalSupply] = useControllableState({ defaultValue: 0 })

  const getNft = async () => {
    const networkInfo = {
      network: ZDKNetwork.Ethereum,
//      chain: ZDKChain.Mainnet,
      chain: ZDKChain.Goerli,
    }
    const args = {
      endPoint: "https://api.zora.co/graphql",
      networks:[networkInfo]
    } 
    const zdk = new ZDK(args)
    const resp = await zdk.collection({address: '0xca21d4228cdcc68d4e23807e5e370c07577dd152'})
    console.log(resp)
    setNftAddress(resp.address as string)
    setNftName(resp.name as string)
    setTotalSupply(resp.totalSupply as number)
  }

  useEffect(() => {
    getNft();
  })

  return (    
    <Box p={4} boxShadow={'lg'} rounded={'lg'} background={'gray.800'}>
      <Flex>
        <Box w={32} h={32}>
          <Image rounded={80} src='https://bit.ly/dan-abramov' alt='Dan Abramov' />
        </Box>
        <Spacer />
        <Box>
          <Badge top={3} right={3} colorScheme='green'>{nftAddress.substring(0, 12) + '...'}</Badge>
        </Box>
      </Flex>
      <Box px={4} py={4}>
        <Heading as='h3' size='md' fontWeight='bold' color='white'>{nftName}</Heading>
      </Box>
      <Divider />
      <Box px={4} py={4}>
      <StatGroup>
        <Stat>
          <StatLabel color='white'>Items</StatLabel>
          <StatNumber color='white'>{totalSupply}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel color='white'>Owners</StatLabel>
          <StatNumber color='white'>{totalSupply}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel color='white'>Sent</StatLabel>
          <StatNumber color='white'>{totalSupply}</StatNumber>
        </Stat>
      </StatGroup>
      </Box>
    </Box>
  )
}

const buildAgeChart = (data: [string, number][]) => {
  Highcharts.chart(
    "ageChartContainer" as any,
    {
      chart: {
        style: {
          color: "#ffffff",
        },
        type: "bar",
        marginRight: 30,
        backgroundColor: "#000000",
      },
      title: {
        text: "Age",
        style: {
          color: "#ffffff",
        },
      },
      xAxis: {
        type: "category",
        title: {
          text: null,
          style: {
            color: "#ffffff",
          },
        },
        labels: {
          style: {
            color: "#ffffff",
          },
        },
      },
      yAxis: {
        lineWidth: 1,
        title: {
          text: "Votes",
          align: "high",
          style: {
            color: "#ffffff",
          },
        },
        showLastLabel: false,
        labels: {
          style: {
            color: "#ffffff",
          },
        },
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
          },
        },
      },
      legend: { enabled: false },
      credits: { enabled: false },
      series: [
        {
          name: "Votes",
          data,
        },
      ],
    } as any
  );
};

const buildCountryChart = (data: [string, number][]) => {
  Highcharts.chart("countryChartContainer", {
    chart: {
      type: "pie",
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0,
      },
      backgroundColor: "#000000",
    },
    title: {
      text: "Country",
      style: {
        color: "#ffffff",
      },
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        depth: 35,
        dataLabels: {
          enabled: true,
          format: "{point.name}",
          style: {
            color: "#ffffff",
          },
        },
      },
    },
    series: [
      {
        type: "pie",
        name: "Country of residence",
        data,
      },
    ],
  });
};

const ResultBody = () => {
  const { initLitCeramic } = useLitCeramic();
  const { isLoadingAnswersList, answersList, fetchResults } = useResult();

  useEffect(() => {
    initLitCeramic();
  }, [initLitCeramic]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const aggAges = useMemo(() => {
    if (!answersList) return [];
    const ageAnswers = answersList
      .flatMap((d) => d.answers)
      .filter((a) => a.question_id === AGE_QUESTION_ID);

    const aggObj = AGE_QUESTION_OPTIONS.reduce((p, c) => {
      p[c.text] = 0;
      return p;
    }, {} as Record<string, number>);

    for (const a of ageAnswers) {
      const text = a.answer.toString();
      if (aggObj[text] == null) continue;

      aggObj[text] += 1;
    }

    return AGE_QUESTION_OPTIONS.map((o) => [o.text, aggObj[o.text]]) as [
      string,
      number
    ][];
  }, [answersList]);

  const aggCountries = useMemo(() => {
    if (!answersList) return [];
    const countryAnswers = answersList
      .flatMap((d) => d.answers)
      .filter((a) => a.question_id === COUNTRY_QUESTION_ID);

    const aggObj = COUNTRY_QUESTION_OPTIONS.reduce((p, c) => {
      p[c.text] = 0;
      return p;
    }, {} as Record<string, number>);

    for (const a of countryAnswers) {
      const text = a.answer.toString();
      if (aggObj[text] == null) continue;

      aggObj[text] += 1;
    }

    return Object.entries(aggObj)
      .filter((r) => r[1] > 0)
      .sort((r1, r2) => r1[1] - r2[1]);
  }, [answersList]);

  useEffect(() => {
    if (aggAges.length === 0 || aggCountries.length === 0) return;
    Highcharts3d(Highcharts);
    HighchartsExporting(Highcharts);
    buildAgeChart(aggAges);
    buildCountryChart(aggCountries);
  }, [aggAges, aggCountries]);

  if (isLoadingAnswersList)
    return (
      <Flex w="100%" h="500px" align="center" justify="center">
        <Spinner size="lg" />
      </Flex>
    );

  if (!isLoadingAnswersList && answersList && answersList.length === 0) {
    return (
      <Flex w="100%" h="500px" align="center" justify="center">
        <Text fontSize="xl">No results to show</Text>
      </Flex>
    );
  }

  return (
    <Box w={"full"} mb={32}>
      <Container maxWidth={"2xl"} mt={8}>
        <NftSummary />
      </Container>
      <Container maxWidth={"2xl"} mt={8}>
        <Box boxShadow={"lg"} rounded={"lg"}>
          <figure className="highcharts-figure">
            <div id="ageChartContainer"></div>
          </figure>
        </Box>
      </Container>
      <Container maxWidth={"2xl"} mt={8}>
        <Box boxShadow={"lg"} rounded={"lg"} p={8}>
          <figure className="highcharts-figure">
            <div id="countryChartContainer"></div>
          </figure>
        </Box>
      </Container>
    </Box>
  );
};

export default ResultBody;
