
import { FC } from 'react'
import { KTIcon } from '../../../../../../_metronic/helpers'
import { RetrieveDropdown } from './RetrieveDropdown'
import { useAuth } from '../../../../../modules/auth'
import { AssignedData, SalesmanAssignedData } from '../../core/_models'

type Props = {
  className: string
  color: string
  branchName: string | undefined
  unassignedTotal: number | undefined
  unassignedData: Record<string, number> | undefined
  assignedData: AssignedData[] | undefined
}

const RetrieveCard: FC<Props> = ({ className, color, branchName, unassignedTotal, unassignedData, assignedData }) => {
  const { currentUser } = useAuth();
  const userRole = currentUser?.auth.role

  return (
    <>
      {
        userRole === 1 && (
          <>
            <div className={`card ${className}`}>
              {/* begin::Body */}
              <div className='card-body p-0'>
                {/* begin::Header */}
                <div className={`px-9 pt-7 card-rounded h-275px w-100 bg-${color}`}>
                  {/* begin::Heading */}
                  <div className='d-flex flex-stack'>
                    <h3 className='m-0 text-white fw-bold fs-3'>{branchName}</h3>
                    <div className='ms-1'>
                      {/* begin::Menu */}
                      <button
                        type='button'
                        className={`btn btn-sm btn-icon btn-color-white btn-active-white btn-active-color-${color} border-0 me-n3`}
                        data-kt-menu-trigger='click'
                        data-kt-menu-placement='bottom-end'
                        data-kt-menu-flip='top-end'
                      >
                      </button>
                      {/* end::Menu */}
                    </div>
                  </div>
                  {/* end::Heading */}
                  <div className='d-flex text-center flex-column text-white pt-8'>
                    <span className='fw-semibold fs-5'>Lượng data chưa phân phối</span>
                    <span className='fw-bold fs-2x pt-1'>{unassignedTotal}</span>
                  </div>
                </div>
                {/* end::Header */}
                {/* begin::Items */}
                <div
                  className='shadow-xs card-rounded mx-9 mb-6 px-6 pt-9 pb-2 position-relative z-index-1 bg-body'
                  style={{ marginTop: '-100px' }}
                >
                  {unassignedData && Object.entries(unassignedData).map(([category, value]) => (
                    <div key={category} className='d-flex align-items-center mb-6'>
                      {/* begin::Symbol */}
                      <div className='symbol symbol-45px w-40px me-5'>
                        <span className='symbol-label bg-lighten'>
                          <KTIcon iconName='dropbox' className='fs-1 text-danger' />
                        </span>
                      </div>
                      {/* end::Symbol */}
                      {/* begin::Description */}
                      <div className='d-flex align-items-center flex-wrap w-100'>
                        {/* begin::Title */}
                        <div className='mb-1 pe-3 flex-grow-1'>
                          <a href='#' className='fs-5 text-gray-800 text-hover-primary fw-bold'>
                            {category}
                          </a>
                          {/* <div className='text-gray-500 fw-semibold fs-7'>100 Regions</div> */}
                        </div>
                        {/* end::Title */}
                        {/* begin::Label */}
                        <div className='d-flex align-items-center'>
                          <div className='fw-bold fs-5 text-gray-800 pe-1'>{value}</div>
                        </div>
                        {/* end::Label */}
                      </div>
                      {/* end::Description */}
                    </div>
                  ))}
                </div>
                {/* end::Items */}
              </div>
              {/* end::Body */}
            </div>
          </>
        )
      }

      {userRole === 2 && (
        <>
          {assignedData && assignedData.map((data) => (
            <div className='col-lg-3'>
              <div key={data.user} className={`card ${className}`}>
                {/* begin::Body */}
                <div className='card-body p-0'>
                  {/* begin::Header */}
                  <div className={`px-9 pt-7 card-rounded h-275px w-100 bg-${color}`}>
                    {/* begin::Heading */}
                    <div className='d-flex flex-stack'>
                      <h3 className='m-0 text-white fw-bold fs-3'>{data.userName}</h3>
                      <div className='ms-1'>
                        {/* begin::Menu */}
                        <button
                          type='button'
                          className={`btn btn-sm btn-icon btn-color-white btn-active-white btn-active-color-${color} border-0 me-n3`}
                          data-kt-menu-trigger='click'
                          data-kt-menu-placement='bottom-end'
                          data-kt-menu-flip='top-end'
                        >
                        </button>
                        {/* end::Menu */}
                      </div>
                    </div>
                    {/* end::Heading */}
                    <div className='d-flex text-center flex-column text-white pt-8'>
                      <span className='fw-semibold fs-5'>Số data đã phân phối</span>
                      <span className='fw-bold fs-2x pt-1'>{data.totalData}</span>
                    </div>
                  </div>
                  {/* end::Header */}
                  {/* begin::Items */}
                  <div
                    className='shadow-xs card-rounded mx-9 mb-6 px-6 pt-9 pb-2 position-relative z-index-1 bg-body'
                    style={{ marginTop: '-100px' }}
                  >
                    {data.categories && Object.entries(data.categories).map(([category, value]) => (
                      <div key={category} className='d-flex align-items-center mb-6'>
                        {/* begin::Symbol */}
                        <div className='symbol symbol-45px w-40px me-5'>
                          <span className='symbol-label bg-lighten'>
                            <KTIcon iconName='dropbox' className='fs-1 text-danger' />
                          </span>
                        </div>
                        {/* end::Symbol */}
                        {/* begin::Description */}
                        <div className='d-flex align-items-center flex-wrap w-100'>
                          {/* begin::Title */}
                          <div className='mb-1 pe-3 flex-grow-1'>
                            <a href='#' className='fs-5 text-gray-800 text-hover-primary fw-bold'>
                              {category}
                            </a>
                            {/* <div className='text-gray-500 fw-semibold fs-7'>100 Regions</div> */}
                          </div>
                          {/* end::Title */}
                          {/* begin::Label */}
                          <div className='d-flex align-items-center'>
                            <div className='fw-bold fs-5 text-gray-800 pe-1'>{value}</div>
                          </div>
                          {/* end::Label */}
                        </div>
                        {/* end::Description */}
                      </div>
                    ))}
                  </div>
                  {/* end::Items */}
                </div>
                {/* end::Body */}
              </div>
            </div>
          ))}
        </>
      )}
    </>
  )
}

export { RetrieveCard }
