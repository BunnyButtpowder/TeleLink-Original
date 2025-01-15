/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC, useEffect, useRef } from 'react'
import { KTIcon } from '../../../../helpers'
import { getCSSVariableValue } from '../../../../assets/ts/_utils'
import { useThemeMode } from '../../../layout/theme-mode/ThemeModeProvider'
import { useAuth } from '../../../../../app/modules/auth'

type Props = {
  className: string
  chartSize?: number
  chartLine?: number
  chartRotate?: number
  topMonthAgencies?: Agency[]
  topMonthSalesmen?: Salesman[]
  totalRevenue?: number
}

type Salesman = {
  fullname: string
  avatar?: string
  "Total revenue"?: number
  saleman: number
  agency: string
}

type Agency = {
  name: string
  avatar?: string
  "Total revenue"?: number
}

const CardsWidget17: FC<Props> = ({
  className,
  chartSize = 70,
  chartLine = 11,
  chartRotate = 145,
  topMonthAgencies = [],
  topMonthSalesmen = [],
  totalRevenue,
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const { currentUser } = useAuth();
  const userRole = currentUser?.auth.role;
  const data = userRole === 1 ? topMonthAgencies.map((item) => item["Total revenue"]) : topMonthSalesmen.map((item) => item["Total revenue"])
  const agencyName = userRole === 1 ? topMonthAgencies.map((item) => item.name) : topMonthSalesmen.map((item) => item.fullname)
  const othersData = totalRevenue ? totalRevenue - (data[0] ?? 0) - (data[1] ?? 0) - (data[2] ?? 0) : 0
  const { mode } = useThemeMode()
  
  useEffect(() => {
    refreshChart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, data, totalRevenue, othersData])

  const refreshChart = () => {
    if (!chartRef.current) {
      return
    }

    setTimeout(() => {
      initChart(chartSize, chartLine, chartRotate, data, totalRevenue, othersData)
    }, 10)
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className={`card card-flush ${className}`}>
      <div className='card-header pt-5'>
        <div className='card-title d-flex flex-column'>
          <div className='d-flex align-items-center'>


            <span className='fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2'>{formatCurrency(totalRevenue ?? 0)}</span>
            <span className='fs-4 fw-semibold text-gray-500 me-1 align-self-start'>vnd</span>
            {/* <span className='badge badge-light-success fs-base'>
              <KTIcon iconName='arrow-up' className='fs-5 text-success ms-n1' /> 2.2%
            </span> */}
          </div>
          <span className='text-gray-500 pt-1 fw-semibold fs-6'>Doanh thu tháng hiện tại</span>
        </div>
      </div>

      <div className='card-body pt-2 pb-4 d-flex flex-wrap align-items-center'>
        <div className='d-flex flex-center me-5 pt-2'>
          <div
            id='kt_card_widget_17_chart'
            ref={chartRef}
            style={{ minWidth: chartSize + 'px', minHeight: chartSize + 'px' }}
            data-kt-size={chartSize}
            data-kt-line={chartLine}
          ></div>
        </div>

        <div className='d-flex flex-column content-justify-center flex-row-fluid'>
          {data[0] !== undefined && (
            <>
              <div className='d-flex fw-semibold align-items-center'>
                <div className='bullet w-8px h-3px rounded-2 bg-success me-3'></div>
                <div className='text-gray-500 flex-grow-1 me-4'>{agencyName[0]}</div>
                <div className='fw-bolder text-gray-700 text-xxl-end'>{formatCurrency(data[0] ?? 0)}₫</div>
              </div>
            </>
          )}
          {data[1] !== undefined && (
            <>
              <div className='d-flex fw-semibold align-items-center my-3'>
                <div className='bullet w-8px h-3px rounded-2 bg-primary me-3'></div>
                <div className='text-gray-500 flex-grow-1 me-4'>{agencyName[1]}</div>
                <div className='fw-bolder text-gray-700 text-xxl-end'>{formatCurrency(data[1] ?? 0)}₫</div>
              </div>
            </>
          )}
          {data[2] !== undefined && (
            <>
              <div className='d-flex fw-semibold align-items-center mb-3'>
                <div className='bullet w-8px h-3px rounded-2 bg-info me-3'></div>
                <div className='text-gray-500 flex-grow-1 me-4'>{agencyName[2]}</div>
                <div className='fw-bolder text-gray-700 text-xxl-end'>{formatCurrency(data[2] ?? 0)}₫</div>
              </div>
            </>
          )}
          <div className='d-flex fw-semibold align-items-center'>
            <div
              className='bullet w-8px h-3px rounded-2 me-3'
              style={{ backgroundColor: '#E4E6EF' }}
            ></div>
            <div className='text-gray-500 flex-grow-1 me-4'>Khác</div>
            <div className=' fw-bolder text-gray-700 text-xxl-end'>{formatCurrency(othersData)}₫</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const initChart = function (
  chartSize: number = 70,
  chartLine: number = 11,
  chartRotate: number = 145,
  data: (number | undefined)[],
  totalRevenue: number | undefined,
  othersData: number | undefined
) {
  const el = document.getElementById('kt_card_widget_17_chart')
  if (!el) {
    return
  }
  el.innerHTML = ''

  const options = {
    size: chartSize,
    lineWidth: chartLine,
    rotate: chartRotate,
    //percent:  el.getAttribute('data-kt-percent') ,
  }

  const canvas = document.createElement('canvas')
  const span = document.createElement('span')

  //@ts-ignore
  if (typeof G_vmlCanvasManager !== 'undefined') {
    //@ts-ignore
    G_vmlCanvasManager.initElement(canvas)
  }

  const ctx = canvas.getContext('2d')
  canvas.width = canvas.height = options.size

  el.appendChild(span)
  el.appendChild(canvas)


  ctx?.translate(options.size / 2, options.size / 2) // change center
  ctx?.rotate((-1 / 2 + options.rotate / 180) * Math.PI) // rotate -90 deg

  //imd = ctx.getImageData(0, 0, 240, 240);
  const radius = (options.size - options.lineWidth) / 2

  const drawCircle = function (color: string, lineWidth: number, percent: number) {
    percent = Math.min(Math.max(0, percent || 1), 1)
    if (!ctx) {
      return
    }

    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false)
    ctx.strokeStyle = color
    ctx.lineCap = 'round' // butt, round or square
    ctx.lineWidth = lineWidth
    ctx.stroke()
  }

  // Init 2
  if (data[0] !== undefined && totalRevenue !== undefined && data[0] !== 0) {
    drawCircle(getCSSVariableValue('--bs-success'), options.lineWidth, data[0] / totalRevenue)
  }
  if (data[1] !== undefined && totalRevenue !== undefined && data[1] !== 0) {
    drawCircle(getCSSVariableValue('--bs-primary'), options.lineWidth, data[1] / totalRevenue)
  }

  if (data[2] !== undefined && totalRevenue !== undefined && data[2] !== 0) {
    drawCircle(getCSSVariableValue('--bs-info'), options.lineWidth, data[2] / totalRevenue)
  }

  if (othersData !== undefined && totalRevenue !== undefined && othersData !== 0) {
    drawCircle('#E4E6EF', options.lineWidth, othersData / totalRevenue)
  }
}

export { CardsWidget17 }
