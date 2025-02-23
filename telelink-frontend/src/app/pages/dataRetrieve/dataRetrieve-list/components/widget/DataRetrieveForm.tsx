
import { FC } from 'react'
import { KTIcon } from '../../../../../../_metronic/helpers'
import { DataRetrieveHeader } from '../header/DataRetrieveHeader'
import { useQueryResponseData, useQueryResponseLoading } from '../../core/QueryResponseProvider'
import { RetrievePageLoading } from '../loading/RetrievePageLoading'
import { ToastContainer } from 'react-bootstrap'
import { RetrieveCard } from './RetrieveCard'
import { useAuth } from '../../../../../modules/auth'
import { RetrieveDataPagination } from '../pagination/RetrieveDataPagination'

type Props = {
  className: string
  color: string
  img: string
}

const DataRetrieveForm: FC<Props> = ({ className, color, img }) => {
  const branches = useQueryResponseData();
  const isLoading = useQueryResponseLoading();
  const { currentUser } = useAuth();
  const userRole = currentUser?.auth.role

  if (isLoading) {
    return <RetrievePageLoading />
  }

  if (branches.length === 0) {
    return (
      <div className={`card ${className}`}>
        <div className='card-body p-0'>
          <div className={`px-9 pt-7 card-rounded h-85px w-100 bg-${color}`} style={{ backgroundImage: `url('${img}')` }}>
            <div className='d-flex flex-stack'>
              <h3 className='m-0 text-white fw-bold fs-3'>Thu hồi dữ liệu</h3>
              <div className='ms-1'>
                <DataRetrieveHeader />
              </div>
            </div>
          </div>
          <div
            className=' card-rounded mx-9 mb-9 py-9 position-relative z-index-1 bg-body'
          >
            <h3 className='text-center'>Không tìm thấy, vui lòng thử lại!</h3>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <ToastContainer />
      <div className={`card ${className}`}>
        {/* begin::Body */}
        <div className='card-body p-0'>
          {/* begin::Header */}
          <div className={`px-9 pt-7 card-rounded h-85px w-100 bg-${color}`} style={{ backgroundImage: `url('${img}')` }}>
            {/* begin::Heading */}
            <div className='d-flex flex-stack'>
              <h3 className='m-0 text-white fw-bold fs-3'>Thu hồi dữ liệu</h3>
              <div className='ms-1'>
                {/* begin::Menu */}
                <DataRetrieveHeader />
                {/* end::Menu */}
              </div>
            </div>
            {/* end::Heading */}
          </div>
          {/* end::Header */}
          {/* begin::Items */}
          <div
            className=' card-rounded mx-9 mb-9 py-9 position-relative z-index-1 bg-body'
          >
            <div className='row'>
              {userRole === 1 && branches.map((branch, index) => {
                return (
                  <div className='col-lg-3'>
                    <RetrieveCard className='card-xl-stretch mb-xl-8' color='danger' branchName={branch.branchName} unassignedTotal={branch.unassignedTotal} unassignedData={branch.unassignedData} assignedData={branch.assignedData} />
                  </div>
                )
              })}
              {userRole === 2 && branches.map((branch, index) => {
                return (
                  <RetrieveCard className='card-xl-stretch mb-xl-8' color='danger' branchName={branch.branchName} unassignedTotal={branch.unassignedTotal} unassignedData={branch.unassignedData} assignedData={branch.assignedData} />
                )
              })}
            </div>
            {/* end::Item */}
          </div>
          {/* end::Items */}
          <RetrieveDataPagination />
        </div>
        {/* end::Body */}
      </div>
    </>

  )
}

export { DataRetrieveForm }
