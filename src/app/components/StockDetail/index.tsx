'use client';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Module } from '@/types';
import { Chart as ChartJS, registerables } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import Link from 'next/link';
import styles from './StockDetail.module.scss';
import DummyData from './DummyData.json'; // ! When the free api rate reaches its maximum, we use this dummy data.

ChartJS.register(...registerables);

type SandboxProps = {
  title: string;
  description: string;
};

type ModuleOptionProps = {
  isBg: boolean;
};

const Sandbox = ({ order, data }: { order: number; data: Module<SandboxProps, ModuleOptionProps> }) => {
  const {
    id,
    content: { title, description },
  } = data;

  const { slug } = useParams();

  const [stockData, setStockData] = useState({
    overview: {} as any,
    chart: [] as any,
    prevClose: [] as any,
  });

  enum StockDataType {
    OVERVIEW = '/v3/reference/tickers/',
    DAILY_OPEN_CLOSE = '/v1/open-close/', // ! Paid content
    PREV_CLOSE = '/v2/aggs/ticker/',
    AGGREGATES = '/v2/aggs/ticker',
  }

  const apiInfo = {
    key: process.env.NEXT_PUBLIC_API_POLYGON_KEY, // ! API free plan: Rate limited only 5 API Calls / Minute
    endpoint: process.env.NEXT_PUBLIC_API_POLYGON_ENDPOINT,
  };

  const [lastestMarketDate, setLatestMarketDate] = useState<string>('');
  const [dateRangeGap, setDateRangeGap] = useState<number>(5);
  const [dateRange, setDateRange] = useState<any>(['', '']);
  const [chartLabels, setChartLabels] = useState<any>();
  const [chartDatasets, setChartDatasets] = useState<any>();
  const [isShowChart, setShowChart] = useState<boolean>(false);

  // ! For Free API
  const getTwoDaysAgoDate = () => {
    let today = new Date();

    today.setDate(today.getDate() - 2);

    let dayOfWeek = today.getDay();
    if (dayOfWeek === 0) {
      today.setDate(today.getDate() - 2);
    } else if (dayOfWeek === 6) {
      today.setDate(today.getDate() - 1);
    }

    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, '0');
    let day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const getDateNDaysAgo = useCallback(() => {
    const today = new Date(lastestMarketDate);
    const daysToSubtract = dateRangeGap;

    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - daysToSubtract);

    if (targetDate.getDay() === 0) {
      targetDate.setDate(targetDate.getDate() - 2);
    } else if (targetDate.getDay() === 6) {
      targetDate.setDate(targetDate.getDate() - 1);
    }

    const formattedDate = targetDate.toISOString().split('T')[0];

    return formattedDate;
  }, [lastestMarketDate, dateRangeGap]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-us', { month: 'short', day: '2-digit' });
  };

  const formatNumber = (str: string) => {
    return str.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const mapChartData = useCallback(async () => {
    const startDate = new Date(dateRange[0]);
    const endDate = new Date(dateRange[1]);
    const range = [];
    const chartData = stockData.chart;

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const formattedDate = date.toISOString().split('T')[0];
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;

      range.push({
        date: formattedDate,
        isWeekend: isWeekend,
      });
    }

    let cnt = 0;
    let cntWeekend = 0;
    const result = range.map((item, index) => {
      if (item.isWeekend) {
        cntWeekend++;
        const chart = chartData[cnt - 1];
        return {
          ...item,
          chart,
        };
      } else {
        cnt++;
        const chart = chartData[index - cntWeekend];
        return {
          ...item,
          chart,
        };
      }
    });

    let label: string[] = [];
    let datasets: string[] = [];

    const mapLalbelDatasets = result.map((item: any, index) => {
      label[index] = formatDate(item.date);
      datasets[index] = item.chart?.c;
    });

    setChartLabels(label);
    setChartDatasets(datasets);
    setShowChart(true);
    return;
  }, [dateRange, stockData, setChartLabels, setChartDatasets, setShowChart]);

  const updateStockData = useCallback(
    (type: StockDataType, data: Record<any, any>) => {
      if (type === StockDataType.OVERVIEW) {
        setStockData((prev) => ({
          ...prev,
          overview: data,
        }));
      }

      if (type === StockDataType.AGGREGATES) {
        setStockData((prev) => ({
          ...prev,
          chart: data,
        }));
      }

      if (type === StockDataType.PREV_CLOSE) {
        setStockData((prev) => ({
          ...prev,
          prevClose: data,
        }));
      }
    },
    [stockData, setStockData]
  );

  const fetchStockData = async (dataType: StockDataType) => {
    let endpoint = ``;
    const symbol = slug[1].toUpperCase();

    if (dataType === StockDataType.OVERVIEW) {
      endpoint = `${StockDataType.OVERVIEW}${symbol}?apiKey=${apiInfo.key}`;
    }

    if (dataType === StockDataType.PREV_CLOSE) {
      endpoint = `${StockDataType.PREV_CLOSE}${symbol}/prev?adjusted=true&apiKey=${apiInfo.key}`;
    }

    if (dataType === StockDataType.AGGREGATES) {
      endpoint = `${StockDataType.AGGREGATES}/${symbol}/range/1/day/${dateRange[0]}/${dateRange[1]}?adjusted=true&apiKey=${apiInfo.key}`;
    }

    try {
      const res = await fetch(`${apiInfo.endpoint + endpoint}`);
      const data = (await res.json()) as any;

      if (data.status === 'ERROR') {
        if (dataType === StockDataType.OVERVIEW) {
          updateStockData(dataType, DummyData.overview);
        }

        if (dataType === StockDataType.AGGREGATES) {
          updateStockData(dataType, DummyData.chart);
        }

        if (dataType === StockDataType.PREV_CLOSE) {
          updateStockData(dataType, DummyData.prevClose);
        }
      } else {
        updateStockData(dataType, data.results);
      }

      return data;
    } catch (error) {
      console.error('Error', error);
    }
  };

  const chartDefault = {
    labels: chartLabels,
    datasets: [
      {
        responsive: true,
        maintainAspectRatio: false,
        data: chartDatasets,
        backgroundColor: [
          'rgba(0, 185, 240, 0.2)',
          'rgba(0, 185, 240, 0.2)',
          'rgba(0, 185, 240, 0.2)',
          'rgba(0, 185, 240, 0.2)',
        ],
        borderColor: ['rgb(0, 185, 240)', 'rgb(0, 185, 240)', 'rgb(0, 185, 240)', 'rgb(0, 185, 240)'],
        borderWidth: 1,
        barPercentage: 1,
        borderRadius: {
          topLeft: 5,
          topRight: 5,
        },
        fill: 'start',
      },
    ],
  };

  const toolFooter = (tooltipItems: any) => {
    let sum = 0;

    tooltipItems.forEach(function (tooltipItem: any) {
      sum += tooltipItem.parsed.y;
    });
    return 'Close: ' + sum;
  };

  const chartOptions = {
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as 'index',
    },
    plugins: {
      tooltip: {
        callbacks: {
          footer: toolFooter,
        },
      },
      legend: {
        display: false,
      },
    },
  };

  const fetchIniticalData = async () => {
    await fetchStockData(StockDataType.OVERVIEW);
    await fetchStockData(StockDataType.PREV_CLOSE);
    await fetchStockData(StockDataType.AGGREGATES);
  };

  useEffect(() => {
    if (!data) return;
    const today = getTwoDaysAgoDate();
    setLatestMarketDate(today);
  }, [data]);

  useEffect(() => {
    if (!lastestMarketDate) return;
    const startDate = getDateNDaysAgo();
    setDateRange([`${startDate}`, `${lastestMarketDate}`]);
  }, [lastestMarketDate]);

  useEffect(() => {
    if (!dateRange[0]) return;
    fetchIniticalData();
  }, [dateRange]);

  const [otehrInfo, setOtherInfo] = useState<any>([]);

  useEffect(() => {
    mapChartData();

    if (!stockData.prevClose[0]) return;

    const { v, vw, o, c, h, l, t, n } = stockData.prevClose[0];
    const listLable = [
      'Volume',
      'Volmue weight',
      'Open Price',
      'Close Price',
      'Highest Price',
      'Lowest Price',
      'Timestamp',
      'Number of Transactions',
    ];

    const result = listLable.map((label, index) => {
      return {
        label: label,
        value:
          stockData.prevClose[0][
            index === 0
              ? 'v'
              : index === 1
              ? 'vw'
              : index === 2
              ? 'o'
              : index === 3
              ? 'c'
              : index === 4
              ? 'h'
              : index === 5
              ? 'l'
              : index === 6
              ? 't'
              : 'n'
          ],
      };
    });

    setOtherInfo(result);
  }, [stockData]);

  const {
    ticker,
    name,
    description: tDescription,
    market,
    locale,
    primary_exchange,
    homepage_url,
    currency_name,
  } = stockData.overview;

  return (
    <section id={id} className={styles.stockDetail}>
      {stockData.overview.name && (
        <div className={styles.highlight}>
          <h2 className={styles.ticker}>
            {name} ({ticker})
          </h2>
          <ul className={`${styles.info}`}>
            <li>${stockData.prevClose[0]?.c}</li>
            <li>Volume: {stockData.prevClose[0]?.v && formatNumber(stockData.prevClose[0]?.v)}</li>
            <li>{dateRange[1]}</li>
          </ul>
          <ul className={`${styles.subInfo}`}>
            <li>{currency_name.toUpperCase()}</li>
            <li>{primary_exchange}</li>
          </ul>

          <div className={`${styles.otherInfo}`}>
            {otehrInfo &&
              otehrInfo.map((item: any, index: number) => {
                return (
                  <div key={index} className={`${styles.infoRow}`}>
                    <div className={`${styles.th}`}>{item.label}</div>
                    {item.label === 'Volume' ? (
                      <div className={`${styles.td}`}>{formatNumber(item.value)}</div>
                    ) : item.label.includes('Price') ? (
                      <div className={`${styles.td}`}>${item.value}</div>
                    ) : (
                      <div className={`${styles.td}`}>{item.value}</div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {stockData.overview.name && (
        <article>
          <h3 className={styles.articleTitle}>About {stockData.overview.name}</h3>
          <div>{tDescription}</div>
          <div className={`${styles.companySite}`}>
            <Link href={homepage_url} target='_blank'>
              {homepage_url}
            </Link>
          </div>
        </article>
      )}

      <article>
        <h3 className={styles.articleTitle}>Stock Chart</h3>
        {isShowChart && (
          <div className={`${styles.chart}`}>
            <Line data={chartDefault} options={chartOptions} width={'100%'} />
          </div>
        )}
      </article>
    </section>
  );
};

export default Sandbox;
