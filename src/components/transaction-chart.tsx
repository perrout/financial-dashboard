import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
  type TooltipItem,
} from "chart.js"
import { useMemo } from "react"
import { Alert, Spinner } from "react-bootstrap"
import { Bar } from "react-chartjs-2"
import { useTranslation } from "react-i18next"
import { useAppStore } from "@/store/app-store"
import type { DailyTransactionSummary } from "@/services/transaction-service"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface TransactionChartProps {
  height?: number
  className?: string
  dailySummary: DailyTransactionSummary[] | null
  loading: boolean
  error: string | null
}

const CHART_COLORS = {
  primary: "#0d6efd",
}

export default function TransactionChart({
  height = 300,
  className = "",
  dailySummary,
  loading,
  error,
}: TransactionChartProps) {
  const { t } = useTranslation()
  const { selectedCountry, formatterService } = useAppStore()
  const hasDailySummary = dailySummary && dailySummary.length > 0

  const chartData = useMemo(() => {
    if (!dailySummary || dailySummary.length === 0) {
      return { labels: [], datasets: [] }
    }
    return {
      labels: dailySummary.map(item => {
        return formatterService.formatDayMonth(item.date, selectedCountry)
      }),
      datasets: [
        {
          label: t("chart.dailyVolume"),
          data: dailySummary.map(item => item.totalAmount),
          backgroundColor: `${CHART_COLORS.primary}80`,
          borderColor: CHART_COLORS.primary,
          borderWidth: 1,
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    }
  }, [dailySummary, t, formatterService, selectedCountry])

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
          text: `${t("chart.dailyVolumeDescription", { country: `${selectedCountry.flag} ${selectedCountry.name}` })}`,
          font: { size: 16, weight: "bold" as const },
        },
        tooltip: {
          callbacks: {
            label: (context: TooltipItem<"bar">) => {
              const value = context.parsed.y
              return formatterService.formatCurrency(
                value,
                selectedCountry.primaryCurrency,
                selectedCountry
              )
            },
            afterLabel: (context: TooltipItem<"bar">) => {
              const dataIndex = context.dataIndex
              const dayData = dailySummary?.[dataIndex]
              if (dayData) {
                return dayData.transactionCount > 1
                  ? t("transaction.countPlural", {
                      count: dayData.transactionCount,
                    })
                  : t("transaction.countSingular", {
                      count: dayData.transactionCount,
                    })
              }
              return ""
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: t("transaction.date"),
            font: { size: 12, weight: "bold" as const },
          },
          ticks: { maxRotation: 45, minRotation: 0 },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: t("transaction.amount"),
            font: { size: 12, weight: "bold" as const },
          },
          ticks: {
            callback: (value: string | number) =>
              formatterService.formatCurrency(
                Number(value),
                selectedCountry.primaryCurrency,
                selectedCountry
              ),
          },
        },
      },
      interaction: { intersect: false, mode: "index" as const },
      animation: { duration: 750, easing: "easeInOutQuart" as const },
    }),
    [
      dailySummary,
      t,
      selectedCountry.flag,
      selectedCountry.name,
      formatterService,
      selectedCountry,
      selectedCountry.primaryCurrency,
    ]
  )

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height }}
      >
        <div className="text-center">
          <Spinner animation="border" as="output">
            <span className="visually-hidden">{t("common.loading")}</span>
          </Spinner>
          <div className="mt-2">{t("common.loading")}</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>{t("common.error")}</Alert.Heading>
        <p>{error}</p>
      </Alert>
    )
  }

  if (!hasDailySummary) {
    return (
      <div
        className="d-flex justify-content-center align-items-center bg-light rounded"
        style={{ height }}
      >
        <div className="text-center text-muted">
          <div className="mb-2">
            <i className="bi bi-bar-chart" style={{ fontSize: "3rem" }} />
          </div>
          <h5>{t("chart.noData")}</h5>
          <p className="mb-0">{t("chart.noDataAlert")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div style={{ height }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}
