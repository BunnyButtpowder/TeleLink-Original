import { useEffect, useState } from 'react'
import { initialQueryState, KTIcon, useDebounce } from '../../../../../_metronic/helpers'
import { useIntl } from 'react-intl'
import { useAuth } from '../../../../../app/modules/auth'
import { getAllData, getDataByAgency, getAllNetworks, getNetworksByAgency } from '../../../../../app/pages/data/data-list/core/_requests'

type Props = {
  className: string
  description: string
  color: string
  img: string
}

const CardsWidget20 = ({ className, description, color, img }: Props) => {
  const { currentUser } = useAuth()
  const userRole = currentUser?.auth.role;
  const agencyId = currentUser?.agency?.id;

  const [totalCount, setTotalCount] = useState<number>(0)
  const [networkCounts, setNetworkCounts] = useState<{ [key: string]: { count: number } }>({})
  const [pendingCount, setPendingCount] = useState<number>(0)
  const [percentage, setPercentage] = useState<number>(0)

  const fetchNetworks = async () => {
    try {
      if (userRole === 1) {
        const networks = await getAllNetworks();
        const networkArray = Object.values(networks) as { count: number }[];
        const totalNetworkCount = networkArray.reduce((sum, { count }) => sum + count, 0);
        setNetworkCounts(networks);
        setPendingCount(totalNetworkCount);
      } else if (userRole === 2 && agencyId) {
        const networks = await getNetworksByAgency(agencyId?.toString() || '');
        const networkArray = Object.values(networks) as { count: number }[];
        const totalNetworkCount = networkArray.reduce((sum, { count }) => sum + count, 0);
        setNetworkCounts(networks);
        setPendingCount(totalNetworkCount);
      }
    } catch (error) {
      console.error('Failed to fetch data networks:', error);
    }
  }


  const fetchData = async () => {
    try {
      let response;
      if (userRole === 1) {
        response = await getAllData();
      } else if (userRole === 2 && agencyId) {
        response = await getDataByAgency(agencyId);
      }
      if (response?.totalCount) {
        setTotalCount(response.totalCount);
      } else {
        setTotalCount(0);
      }
    } catch (error) {
      console.error('Failed to fetch data networks:', error);
    }
  }

  useEffect(() => {
    fetchData();
    fetchNetworks();
  }, [userRole, agencyId])

  useEffect(() => {
    if (totalCount > 0) {
      const calculatedPercentage = (((totalCount - pendingCount) / totalCount) * 100).toFixed(2)
      setPercentage(parseFloat(calculatedPercentage))
    }
  }, [totalCount, pendingCount])

  return (
    <div
      className={`card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end ${className}`}
      style={{
        backgroundColor: color,
        backgroundImage: `url('${img}')`,
      }}
    >
      <div className='card-header pt-5'>
        <div className='card-title d-flex flex-column'>
          <span className='fs-2hx fw-bold text-white me-2 lh-1 ls-n2'>{totalCount}</span>

          <span className='text-white opacity-75 pt-1 fw-semibold fs-6'>{description}</span>
        </div>
      </div>
      <div className='card-body d-flex align-items-end pt-0'>
        <div className='d-flex align-items-center flex-column mt-3 w-100'>
          <div className='d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100 mt-auto mb-2'>
            <span>{totalCount - pendingCount} data đã phân phối</span>
            <span>{percentage}%</span>
          </div>

          <div className='h-8px mx-3 w-100 bg-white bg-opacity-50 rounded'>
            <div
              className='bg-white rounded h-8px'
              role='progressbar'
              style={{ width: `${percentage}%` }}
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
export { CardsWidget20 }
