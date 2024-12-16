import { useEffect, useState } from 'react'
import clsx from 'clsx'
import axios from 'axios'
import { getTop10Salesmen } from '../../../../../app/pages/reportRevenue/revenue-list/core/_requests'

type Props = {
  className: string
  description: string
  icon: boolean
  stats: number
  labelColor: string
  textColor: string
}

type Salesman = {
  fullname: string
  avatar?: string
  "Total revenue"?: number
  saleman: number
  agency: number
}

const CardsWidget7 = ({ className, description, stats, labelColor, textColor }: Props) => {
  const [topSalesmen, setTopSalesmen] = useState<Salesman[]>([])

  useEffect(() => {
    const fetchTopSalesmen = async () => {
      try {
        const response = await getTop10Salesmen()
        setTopSalesmen(response.data)
      } catch (error) {
        console.error('Error fetching top salesmen:', error)
      }
    }

    fetchTopSalesmen()
  }, [])

  return (
    <div className={`card card-flush ${className}`}>
      <div className="card-header pt-5">
        <div className="card-title d-flex flex-column">
          <div className="card-title d-flex flex-column">
            <span className="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">{stats}</span>
            <span className="text-gray-500 pt-1 fw-semibold fs-6">{description}</span>
          </div>
        </div>
      </div>
      <div className="card-body d-flex flex-column justify-content-end pe-0">
        <span className="fs-6 fw-bolder text-gray-800 d-block mb-2">Nhân viên xuất sắc</span>
        <div className="symbol-group symbol-hover flex-nowrap">
          {topSalesmen.map((salesman, index) => (
            <div
              className="symbol symbol-35px symbol-circle"
              data-bs-toggle="tooltip"
              title={salesman.fullname}
              key={`cw7-salesman-${index}`}
            >
              {salesman.avatar ? (
                <img alt={salesman.fullname} src={salesman.avatar} />
              ) : (
                <span
                  className={clsx(
                    'symbol-label fs-8 fw-bold',
                    'bg-' + labelColor,
                    'text-' + textColor
                  )}
                >
                  {salesman.fullname.charAt(0)}
                </span>
              )}
            </div>
          ))}
          {/* <a href="#" className="symbol symbol-35px symbol-circle">
            <span
              className={clsx(
                'symbol-label fs-8 fw-bold',
                'bg-' + labelColor,
                'text-' + textColor
              )}
            >
              +{Math.max(10 - topSalesmen.length, 0)}
            </span>
          </a> */}
        </div>
      </div>
    </div>
  )
}

export { CardsWidget7 }
