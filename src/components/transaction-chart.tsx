import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  type TooltipItem,
} from "chart.js";
import { useMemo } from "react";
import { Alert, Spinner } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import {
  MOCK_ERROR,
  MOCK_LOADING,
  MOCK_TRANSACTIONS,
  selectedCountry,
} from "../mocks";
import { calculateDailySummary } from "../utils";

import { formatCurrency } from "../utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface TransactionChartProps {
  height?: number;
  className?: string;
}

const CHART_COLORS = {
  primary: "#0d6efd",
};

export default function TransactionChart({
  height = 300,
  className = "",
}: TransactionChartProps) {
  const dailySummary = calculateDailySummary(MOCK_TRANSACTIONS);
  const loading = MOCK_LOADING;
  const error = MOCK_ERROR;

  const chartData = useMemo(() => {
    if (!dailySummary || dailySummary.length === 0) {
      return { labels: [], datasets: [] };
    }
    return {
      labels: dailySummary.map((item) => {
        const date = new Date(item.date);
        return date.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        });
      }),
      datasets: [
        {
          label: "Daily Volume",
          data: dailySummary.map((item) => item.totalAmount),
          backgroundColor: `${CHART_COLORS.primary}80`,
          borderColor: CHART_COLORS.primary,
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    };
  }, [dailySummary]);

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top" as const,
          labels: { font: { size: 12 } },
        },
        title: {
          display: true,
          text: `Volume diário - ${selectedCountry.flag} ${selectedCountry.name}`,
          font: { size: 16, weight: "bold" as const },
        },
        tooltip: {
          callbacks: {
            label: (context: TooltipItem<"bar">) => {
              const value = context.parsed.y;
              return `Value: ${formatCurrency(value, selectedCountry.primaryCurrency.code)}`;
            },
            afterLabel: (context: TooltipItem<"bar">) => {
              const dataIndex = context.dataIndex;
              const dayData = dailySummary?.[dataIndex];
              if (dayData) {
                return `Transactions: ${dayData.transactionCount}`;
              }
              return "";
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Data",
            font: { size: 12, weight: "bold" as const },
          },
          ticks: { maxRotation: 45, minRotation: 0 },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Value",
            font: { size: 12, weight: "bold" as const },
          },
          ticks: {
            callback: (value: string | number) =>
              formatCurrency(
                Number(value),
                selectedCountry.primaryCurrency.code,
              ),
          },
        },
      },
      interaction: { intersect: false, mode: "index" as const },
      animation: { duration: 750, easing: "easeInOutQuart" as const },
    }),
    [dailySummary],
  );

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height }}
      >
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <div className="mt-2">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  if (!dailySummary || dailySummary.length === 0) {
    return (
      <div
        className="d-flex justify-content-center align-items-center bg-light rounded"
        style={{ height }}
      >
        <div className="text-center text-muted">
          <div className="mb-2">
            <i className="bi bi-bar-chart" style={{ fontSize: "3rem" }} />
          </div>
          <h5>No data</h5>
          <p className="mb-0">Add transactions to visualize the chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div style={{ height }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
