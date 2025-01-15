import React, { useState, useEffect, useRef } from 'react'
import ApexCharts, { ApexOptions } from 'apexcharts'
import { getCSSVariableValue } from '../../../assets/ts/_utils'
import { useThemeMode } from '../../layout/theme-mode/ThemeModeProvider'
import { getYearlyRevenue, getMonthlyRevenue, getWeeklyRevenue } from '../../../../app/pages/reportRevenue/revenue-list/core/_requests'
import { format } from 'path'
import { useAuth } from '../../../../app/modules/auth'


type Props = {
  className: string
}

type YearlyRevenue = {
  year: number
  total_revenue: number
}

type MonthlyRevenue = {
  year: number
  month: number
  total_revenue: number
}

type WeeklyRevenue = {
  year: number
  week: number
  total_revenue: number
}

const ChartsWidget3: React.FC<Props> = ({ className }) => {
  const [selectedMode, setSelectedMode] = useState<string>('year')
  const [revenueData, setRevenueData] = useState<number[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const chartRef = useRef<HTMLDivElement | null>(null)
  const { mode } = useThemeMode()
  const { currentUser } = useAuth();
  const userRole = currentUser?.auth.role;
  const agencyId = currentUser?.agency?.id;

  const refreshMode = (data: number[], categories: string[]) => {
    if (!chartRef.current) {
      return
    }

    const chart = new ApexCharts(chartRef.current, getChartOptions(data, categories))
    if (chart) {
      chart.render()
    }

    return chart
  }

  const fetchYearlyRevenue = async () => {
    try {
      if (userRole === 1) {
        const response = await getYearlyRevenue()
        const data = response.data.map((item: YearlyRevenue) => item.total_revenue)
        const labels = response.data.map((item: YearlyRevenue) => item.year.toString())
        setRevenueData(data)
        setCategories(labels)
      } else if (userRole === 2 && agencyId) {
        const response = await getYearlyRevenue({ agencyId: agencyId?.toString() })
        const data = response.data.map((item: YearlyRevenue) => item.total_revenue)
        const labels = response.data.map((item: YearlyRevenue) => item.year.toString())
        setRevenueData(data)
        setCategories(labels)
      }
    } catch (error) {
      console.error('Failed to fetch yearly revenue:', error)
    }
  }

  const fetchMonthlyRevenue = async () => {
    try {
      if (userRole === 1) {
        const response = await getMonthlyRevenue()
        const data = response.data.map((item: MonthlyRevenue) => item.total_revenue)
        const labels = response.data.map((item: MonthlyRevenue) => item.month.toString())
        setRevenueData(data)
        setCategories(labels)
      } else if (userRole === 2 && agencyId) {
        const response = await getMonthlyRevenue({ agencyId: agencyId?.toString() })
        const data = response.data.map((item: MonthlyRevenue) => item.total_revenue)
        const labels = response.data.map((item: MonthlyRevenue) => item.month.toString())
        setRevenueData(data)
        setCategories(labels)
      }
    } catch (error) {
      console.error('Failed to fetch monthly revenue:', error)
    }
  }

  const fetchWeeklyRevenue = async () => {
    try {
      if (userRole === 1) {
        const response = await getWeeklyRevenue()
        const data = response.data.map((item: WeeklyRevenue) => item.total_revenue)
        const labels = response.data.map((item: WeeklyRevenue) => item.week.toString())
        setRevenueData(data)
        setCategories(labels)
      } else if (userRole === 2 && agencyId) {
        const response = await getWeeklyRevenue({ agencyId: agencyId?.toString() })
        const data = response.data.map((item: WeeklyRevenue) => item.total_revenue)
        const labels = response.data.map((item: WeeklyRevenue) => item.week.toString())
        setRevenueData(data)
        setCategories(labels)
      }
    } catch (error) {
      console.error('Failed to fetch weekly revenue:', error)
    }
  }

  const handleButtonClick = (value: string) => {
    setSelectedMode(value)
  }

  useEffect(() => {
    if (selectedMode === 'year') {
      fetchYearlyRevenue()
    }
    else if (selectedMode === 'month') {
      fetchMonthlyRevenue()
    }
    else if (selectedMode === 'week') {
      fetchWeeklyRevenue()
    }
  }, [selectedMode])

  useEffect(() => {
    const chart = refreshMode(revenueData, categories)

    return () => {
      if (chart) {
        chart.destroy()
      }
    }
  }, [revenueData, categories, mode])

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Thống kê doanh thu</span>

          <span className='text-muted fw-semibold fs-7'></span>
        </h3>

        {/* begin::Toolbar */}
        <div className='card-toolbar' data-kt-buttons='true'>
          <a
            className={`btn btn-sm btn-color-muted btn-active btn-active-primary px-4 me-1 ${selectedMode === 'year' ? 'active' : ''}`}
            onClick={() => handleButtonClick('year')}
            id='kt_charts_widget_3_year_btn'
          >
            Năm
          </a>

          <a
            className={`btn btn-sm btn-color-muted btn-active btn-active-primary px-4 me-1 ${selectedMode === 'month' ? 'active' : ''}`}
            onClick={() => handleButtonClick('month')}
            id='kt_charts_widget_3_month_btn'
          >
            Tháng
          </a>

          <a
            className={`btn btn-sm btn-color-muted btn-active btn-active-primary px-4 ${selectedMode === 'week' ? 'active' : ''}`}
            onClick={() => handleButtonClick('week')}
            id='kt_charts_widget_3_week_btn'
          >
            Tuần
          </a>
        </div>
        {/* end::Toolbar */}
      </div>
      {/* end::Header */}

      {/* begin::Body */}
      <div className='card-body'>
        {/* begin::Chart */}
        <div ref={chartRef} id='kt_charts_widget_3_chart' style={{ height: '350px' }}></div>
        {/* end::Chart */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export { ChartsWidget3 }

function getChartOptions(data: number[], categories: string[]): ApexOptions {
  const labelColor = getCSSVariableValue('--bs-gray-500')
  const borderColor = getCSSVariableValue('--bs-gray-200')
  const baseColor = getCSSVariableValue('--bs-success')
  const lightColor = getCSSVariableValue('--bs-success-light')

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0
    }).format(value)
  }

  return {
    series: [
      {
        name: 'Doanh thu',
        data: data,
      },
    ],
    chart: {
      fontFamily: 'inherit',
      type: 'area',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {},
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'solid',
      opacity: 1,
    },
    stroke: {
      curve: 'smooth',
      show: true,
      width: 3,
      colors: [baseColor],
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
      crosshairs: {
        position: 'front',
        stroke: {
          color: baseColor,
          width: 1,
          dashArray: 3,
        },
      },
      tooltip: {
        enabled: true,
        formatter: undefined,
        offsetY: 0,
        style: {
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => formatCurrency(val),
        style: {
          colors: labelColor,
          fontSize: '12px',
        },
      },
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: '12px',
      },
      y: {
        formatter: function (val) {
          return formatCurrency(val)
        },
      },
    },
    colors: [lightColor],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    markers: {
      strokeColors: baseColor,
      strokeWidth: 3,
    },
  }
}
