import { Box, Container, Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";

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
      <Container maxWidth={"2xl"} mt={32}>
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
