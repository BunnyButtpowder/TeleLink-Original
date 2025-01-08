
import React from 'react'
import { KTIcon } from '../../../helpers'
import clsx from 'clsx'

type Props = {
  className: string
  color: string
  svgIcon: string
  iconColor: string
  title: number
  titleColor?: string
  description: string
  descriptionColor?: string
  topAgencies?: Agency[]
  labelColor: string
  textColor: string
}

type Agency = {
  name: string
  avatar?: string
  "Total revenue"?: number
}

const StatisticsWidget5: React.FC<Props> = ({
  className,
  color,
  svgIcon,
  iconColor,
  title,
  topAgencies = [],
  titleColor,
  description,
  descriptionColor,
  labelColor,
  textColor,
}) => {
  return (
    <div className={`card bg-${color} hoverable ${className}`}>
      <div className='card-body'>
        {/* <KTIcon iconName={svgIcon} className={`text-${iconColor} fs-3x ms-n1`} /> */}

        <div className={`text-${titleColor} fw-bold fs-2hx`}>{title}</div>

        <div className={`fw-semibold text-${descriptionColor}`}>{description}</div>
      </div>
      <div className="card-body d-flex flex-column justify-content-end pe-0">
        <span className="fs-6 fw-bolder text-white d-block mb-2">Chi nhánh xuất sắc</span>
        <div className="symbol-group symbol-hover flex-nowrap">
          {topAgencies.map((agency, index) => (
            <div
              className="symbol symbol-35px symbol-circle"
              data-bs-toggle="tooltip"
              title={agency.name}
              key={`cw7-salesman-${index}`}
            >
              {agency.avatar ? (
                <img alt={agency.name} src={agency.avatar} />
              ) : (
                <span
                  className={clsx(
                    'symbol-label fs-8 fw-bold',
                    'bg-' + labelColor,
                    'text-' + textColor
                  )}
                >
                  {agency.name.charAt(0)}
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
              +{Math.max(10 - topAgencies.length, 0)}
            </span>
          </a> */}
        </div>
      </div>
    </div>
  )
}

export { StatisticsWidget5 }
