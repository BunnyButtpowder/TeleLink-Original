
import { FC } from 'react'
import { KTIcon } from '../../../../../../_metronic/helpers'
import { CustomersListHeader } from '../header/CustomersListHeader'
import { Customer } from '../../core/_models'
import { useQueryResponseData, useQueryResponseLoading } from '../../core/QueryResponseProvider'
import { UsersListLoading } from '../loading/UsersListLoading'

type Props = {
  className: string
  color: string
  img: string
}

const CustomerForm: FC<Props> = ({ className, color, img }) => {
  const customer = useQueryResponseData();
  const isLoading = useQueryResponseLoading();

  if (isLoading) {
    return <UsersListLoading />
  }

  const customerData = customer?.[0] || {};
  if (!customerData) {
    return (
      <div className='text-center py-10'>
        <h3>Không có dữ liệu khách hàng</h3>
      </div>
    )
  }

  const formatDate = (timestamp: Date) => {
    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    return formattedDate;
  };

  return (
    <div className={`card ${className}`}>
      {/* begin::Body */}
      <div className='card-body p-0'>
        {/* begin::Header */}
        <div className={`px-9 pt-7 card-rounded h-275px w-100 bg-${color}`} style={{ backgroundImage: `url('${img}')` }}>
          {/* begin::Heading */}
          <div className='d-flex flex-stack'>
            <h3 className='m-0 text-white fw-bold fs-3'>Thông tin khách hàng</h3>
            <div className='ms-1'>
              {/* begin::Menu */}
              <CustomersListHeader />
              {/* end::Menu */}
            </div>
          </div>
          {/* end::Heading */}
          <div className='d-flex text-center flex-column text-white pt-8'>
            <span className='fw-semibold fs-7'>Số thuê bao</span>
            <span className='fw-bold fs-2x pt-1'>{customerData.subscriberNumber || 'N/A'}</span>
          </div>
        </div>
        {/* end::Header */}
        {/* begin::Items */}
        <div
          className='shadow-xs card-rounded mx-9 mb-9 px-6 py-9 position-relative z-index-1 bg-body'
          style={{ marginTop: '-100px' }}
        >
          <div className='row'>
            <div className='col-lg-4'>
              <div className='d-flex align-items-center bg-light-danger rounded p-5 mb-7'>
                {/* <div className='bullet bullet-bar bg-primary h-25px me-5'></div> */}
                <span className=' text-warning me-5'>
                  <KTIcon iconName='dropbox' className='text-danger fs-1 me-5' />
                </span>
                <div className='d-flex flex-column'>
                  <span className='fw-bold text-gray-800 fs-5'>Gói hiện tại:</span>
                  <span className='text-gray-600'>{customerData.currentPackage || 'N/A'}</span>
                </div>
              </div>
              <div className='d-flex align-items-center bg-light-primary rounded p-5 mb-7'>
                <span className=' text-warning me-5'>
                  <KTIcon iconName='dropbox' className='text-primary fs-1 me-5' />
                </span>
                <div className='d-flex flex-column'>
                  <span className='fw-bold text-gray-800 fs-5'>Gói đặc biệt (ưu tiên 1):</span>
                  <span className='text-gray-600'>{customerData.priorityPackage1 || 'N/A'}</span>
                </div>
              </div>
              <div className='d-flex align-items-center bg-light-primary rounded p-5 mb-7'>
                <span className=' text-warning me-5'>
                  <KTIcon iconName='dropbox' className='text-primary fs-1 me-5' />
                </span>
                <div className='d-flex flex-column'>
                  <span className='fw-bold text-gray-800 fs-5'>Gói cước gán (ưu tiên 2):</span>
                  <span className='text-gray-600'>{customerData.priorityPackage2 || 'N/A'}</span>
                </div>
              </div>
              <div className='d-flex align-items-center bg-light-primary rounded p-5 mb-7'>
                <span className=' text-warning me-5'>
                  <KTIcon iconName='calendar-tick' className='text-primary fs-1 me-5' />
                </span>
                <div className='d-flex flex-column'>
                  <span className='fw-bold text-gray-800 fs-5'>Ngày đăng ký:</span>
                  <span className='text-gray-600'>{customerData.registrationDate ? formatDate(customerData.registrationDate) : 'N/A'}</span>
                </div>
              </div>
              <div className='d-flex align-items-center bg-light-primary rounded p-5 mb-7'>
                <span className=' text-warning me-5'>
                  <KTIcon iconName='calendar-remove' className='text-primary fs-1 me-5' />
                </span>
                <div className='d-flex flex-column'>
                  <span className='fw-bold text-gray-800 fs-5'>Ngày hết hạn:</span>
                  <span className='text-gray-600'>{customerData.expirationDate ? formatDate(customerData.expirationDate) : 'N/A'}</span>
                </div>
              </div>
              <div className='d-flex align-items-center bg-light-primary rounded p-5 mb-7'>
                <span className=' text-warning me-5'>
                  <KTIcon iconName='notepad-edit' className='text-primary fs-1 me-5' />
                </span>
                <div className='d-flex flex-column'>
                  <span className='fw-bold text-gray-800 fs-5'>Ghi chú:</span>
                  <span className='text-gray-600'>{customerData.notes || 'N/A'}</span>
                </div>
              </div>
              <div className='d-flex align-items-center bg-light-primary rounded p-5 mb-7'>
                <span className=' text-warning me-5'>
                  <KTIcon iconName='geolocation' className='text-primary fs-1 me-5' />
                </span>
                <div className='d-flex flex-column'>
                  <span className='fw-bold text-gray-800 fs-5'>Nơi cấp data:</span>
                  <span className='text-gray-600'>{customerData.placeOfIssue || 'N/A'}</span>
                </div>
              </div>
            </div>
            <div className='col-lg-4'>
              <div className='d-flex align-items-center bg-light-danger rounded p-5 mb-7'>
                <span className=' text-warning me-5'>
                  <KTIcon iconName='dropbox' className='text-danger fs-1 me-5' />
                </span>
                <div className='d-flex flex-column'>
                  <span className='fw-bold text-gray-800 fs-5'>Gói cước tư vấn:</span>
                  <span className='text-gray-600'>{customerData.Package || 'N/A'}</span>
                </div>
              </div>
              <div className='d-flex align-items-center bg-light-primary rounded p-5 mb-7'>
                <span className=' text-warning me-5'>
                  <KTIcon iconName='abstract-26' className='text-primary fs-1 me-5' />
                </span>
                <div className='d-flex flex-column'>
                  <span className='fw-bold text-gray-800 fs-5'>APRU 3 tháng:</span>
                  <span className='text-gray-600'>{customerData.APRU3Months || 'N/A'}</span>
                </div>
              </div>
              <div className='d-flex align-items-center bg-light-primary rounded p-5 mb-7'>
                <span className=' text-warning me-5'>
                  <KTIcon iconName='abstract-26' className='text-primary fs-1 me-5' />
                </span>
                <div className='d-flex flex-column'>
                  <span className='fw-bold text-gray-800 fs-5'>Tiêu dùng n-1:</span>
                  <span className='text-gray-600'>{customerData.usageMonth1 || 'N/A'}</span>
                </div>
              </div>
              <div className='d-flex align-items-center bg-light-primary rounded p-5 mb-7'>
                <span className=' text-warning me-5'>
                  <KTIcon iconName='abstract-26' className='text-primary fs-1 me-5' />
                </span>
                <div className='d-flex flex-column'>
                  <span className='fw-bold text-gray-800 fs-5'>Tiêu dùng n-2:</span>
                  <span className='text-gray-600'>{customerData.usageMonth2 || 'N/A'}</span>
                </div>
              </div>
              <div className='d-flex align-items-center bg-light-primary rounded p-5 mb-7'>
                <span className=' text-warning me-5'>
                  <KTIcon iconName='abstract-26' className='text-primary fs-1 me-5' />
                </span>
                <div className='d-flex flex-column'>
                  <span className='fw-bold text-gray-800 fs-5'>Tiêu dùng n-3:</span>
                  <span className='text-gray-600'>{customerData.usageMonth3 || 'N/A'}</span>
                </div>
              </div>
              <div className='d-flex align-items-center bg-light-primary rounded p-5 mb-7'>
                <span className=' text-warning me-5'>
                  <KTIcon iconName='abstract-26' className='text-primary fs-1 me-5' />
                </span>
                <div className='d-flex flex-column'>
                  <span className='fw-bold text-gray-800 fs-5'>Tiêu dùng n-4:</span>
                  <span className='text-gray-600'>{customerData.usageMonth4 || 'N/A'}</span>
                </div>
              </div>
              <div className='d-flex align-items-center bg-light-primary rounded p-5 mb-7'>
                <span className=' text-warning me-5'>
                  <KTIcon iconName='abstract-26' className='text-primary fs-1 me-5' />
                </span>
                <div className='d-flex flex-column'>
                  <span className='fw-bold text-gray-800 fs-5'>Tiêu dùng TKC:</span>
                  <span className='text-gray-600'>{customerData.totalTKCUsage || 'N/A'}</span>
                </div>
              </div>
            </div>
            <div className='col-lg-4'>
              <div className='d-flex align-items-center bg-light-danger rounded p-5 mb-7'>
                <span className=' text-warning me-5'>
                  <KTIcon iconName='abstract-26' className='text-danger fs-1 me-5' />
                </span>
                <div className='d-flex flex-column'>
                  <span className='fw-bold text-gray-800 fs-5'>TKC:</span>
                  <span className='text-gray-600'>{customerData.TKC || 'N/A'}</span>
                </div>
              </div>
              <div className='d-flex align-items-center bg-light-primary rounded p-5 mb-7'>
                <span className=' text-warning me-5'>
                  <KTIcon iconName='abstract-26' className='text-primary fs-1 me-5' />
                </span>
                <div className='d-flex flex-column'>
                  <span className='fw-bold text-gray-800 fs-5'>Tiêu dùng thoại:</span>
                  <span className='text-gray-600'>{customerData.voiceUsage || 'N/A'}</span>
                </div>
              </div>
              <div className='d-flex align-items-center bg-light-primary rounded p-5 mb-7'>
                <span className=' text-warning me-5'>
                  <KTIcon iconName='abstract-26' className='text-primary fs-1 me-5' />
                </span>
                <div className='d-flex flex-column'>
                  <span className='fw-bold text-gray-800 fs-5'>Tiêu dùng data:</span>
                  <span className='text-gray-600'>{customerData.dataUsage || 'N/A'}</span>
                </div>
              </div>
              <div className='d-flex align-items-center bg-light-primary rounded p-5 mb-7'>
                <span className=' text-warning me-5'>
                  <KTIcon iconName='abstract-26' className='text-primary fs-1 me-5' />
                </span>
                <div className='d-flex flex-column'>
                  <span className='fw-bold text-gray-800 fs-5'>Dùng data ngoài gói:</span>
                  <span className='text-gray-600'>{customerData.outOfPackageDataUsage || 'N/A'}</span>
                </div>
              </div>
              <div className='d-flex align-items-center bg-light-primary rounded p-5 mb-7'>
                <span className=' text-warning me-5'>
                  <KTIcon iconName='abstract-26' className='text-primary fs-1 me-5' />
                </span>
                <div className='d-flex flex-column'>
                  <span className='fw-bold text-gray-800 fs-5'>Khác 1:</span>
                  <span className='text-gray-600'>{customerData.other1 || 'N/A'}</span>
                </div>
              </div>
              <div className='d-flex align-items-center bg-light-primary rounded p-5 mb-7'>
                <span className=' text-warning me-5'>
                  <KTIcon iconName='abstract-26' className='text-primary fs-1 me-5' />
                </span>
                <div className='d-flex flex-column'>
                  <span className='fw-bold text-gray-800 fs-5'>Khác 2:</span>
                  <span className='text-gray-600'>{customerData.other2 || 'N/A'}</span>
                </div>
              </div>
              <div className='d-flex align-items-center bg-light-primary rounded p-5 mb-7'>
                <span className=' text-warning me-5'>
                  <KTIcon iconName='abstract-26' className='text-primary fs-1 me-5' />
                </span>
                <div className='d-flex flex-column'>
                  <span className='fw-bold text-gray-800 fs-5'>Khác 3:</span>
                  <span className='text-gray-600'>{customerData.other3 || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
          {/* end::Item */}
        </div>
        {/* end::Items */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export { CustomerForm }
