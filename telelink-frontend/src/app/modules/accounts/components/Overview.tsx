import { Link } from 'react-router-dom'
import { KTIcon } from '../../../../_metronic/helpers'
import {
  ChartsWidget1,
  ListsWidget5,
  TablesWidget1,
  TablesWidget5,
} from '../../../../_metronic/partials/widgets'
import { Content } from '../../../../_metronic/layout/components/content'
import { useAuth } from '../../../../app/modules/auth'

export function Overview() {
  const { currentUser } = useAuth();
  return (
    <Content>
      <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
        <div className='card-header cursor-pointer'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>Thông tin</h3>
          </div>

          <Link to='/crafted/account/settings' className='btn btn-primary align-self-center'>
            Chỉnh sửa
          </Link>
        </div>

        <div className='card-body p-9'>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Tên đầy đủ</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-gray-900'>{currentUser?.fullName}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Chi nhánh</label>

            <div className='col-lg-8 fv-row'>
              <span className='fw-bold fs-6'>{currentUser?.agency}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>
              Số điện thoại
              <i
                className='fas fa-exclamation-circle ms-1 fs-7'
                data-bs-toggle='tooltip'
                title='Số điện thoại phải đang hoạt động'
              ></i>
            </label>

            <div className='col-lg-8 d-flex align-items-center'>
              <span className='fw-bolder fs-6 me-2'>{currentUser?.phoneNumber}</span>

              {/* <span className='badge badge-success'>Đã xác minh</span> */}
            </div>
          </div>

          {/* <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Website chi nhánh</label>

            <div className='col-lg-8'>
              <a href='https://selfolio.pages.dev/minhvu' className='fw-bold fs-6 text-gray-900 text-hover-primary'>
                selfolio.pages.dev/minhvu
              </a>
            </div>
          </div> */}

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Giới tính</label>
            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-gray-900'>{currentUser?.gender}</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>
              Địa chỉ
              <i
                className='fas ms-1 fs-7'
              ></i>
            </label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-gray-900'>{currentUser?.address}</span>
            </div>
          </div>

          <div className='row mb-10'>
            <label className='col-lg-4 fw-bold text-muted'>Ngày sinh</label>

            <div className='col-lg-8'>
            <span className='fw-bolder fs-6 text-gray-900'>{currentUser?.dob}</span>
            </div>
          </div>

          {/* <div className='notice d-flex bg-light-warning rounded border-warning border border-dashed p-6'>
            <KTIcon iconName='information-5' className='fs-2tx text-warning me-4' />
            <div className='d-flex flex-stack flex-grow-1'>
              <div className='fw-bold'>
                <h4 className='text-gray-800 fw-bolder'>We need your attention!</h4>
                <div className='fs-6 text-gray-600'>
                  Your payment was declined. To start using tools, please
                  <Link className='fw-bolder' to='/crafted/account/settings'>
                    {' '}
                    Add Payment Method
                  </Link>
                  .
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* widget */}
      {/* <div className='row gy-10 gx-xl-10'>
        <div className='col-xl-6'>
          <ChartsWidget1 className='card-xxl-stretch mb-5 mb-xl-10' />
        </div>

        <div className='col-xl-6'>
          <TablesWidget1 className='card-xxl-stretch mb-5 mb-xl-10' />
        </div>
      </div>

      <div className='row gy-10 gx-xl-10'>
        <div className='col-xl-6'>
          <ListsWidget5 className='card-xxl-stretch mb-5 mb-xl-10' />
        </div>

        <div className='col-xl-6'>
          <TablesWidget5 className='card-xxl-stretch mb-5 mb-xl-10' />
        </div>
      </div> */}
    </Content>
  )
}
