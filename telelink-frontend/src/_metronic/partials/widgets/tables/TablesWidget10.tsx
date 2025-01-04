
import { FC } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../helpers'
import { TopSalesmanFilter } from '../../content/dropdown/TopSalesmanFilter'

type Props = {
  className: string
  stats: number
  topSalesmen: Salesman[]
}

type Salesman = {
  fullname: string
  avatar?: string
  "Total revenue"?: number
  saleman: number
  agency: string
}

const formatRevenue = (revenue: number) => {
  if (typeof revenue !== "number") return revenue;
  return new Intl.NumberFormat("vi-VN").format(revenue);
}

const rankingIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <KTIcon iconName='cup' className='fs-1 text-warning me-2' />;
    case 2:
      return <KTIcon iconName='cup' className='fs-1 text-dark me-2' />;
    case 3:
      return <KTIcon iconName='cup' className='fs-1 text-bronze me-2' />;
    default:
      return <KTIcon iconName='medal-star' className='fs-1 me-2' />;
  }
}

const TablesWidget10: FC<Props> = ({ className, stats, topSalesmen }) => {
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <div className='card-label d-flex align-items-center'>
            <div><KTIcon iconName='cup' className='fs-1 text-warning me-2' /></div>
            <span className='card-label fw-bold fs-3 mb-1'>Bảng xếp hạng top 10</span>
          </div>
          {stats > 10 && (
            <span className='text-muted mt-1 fw-semibold fs-7'>Trên tổng số {stats} nhân viên</span>
          )}
        </h3>
        <div className='card-toolbar'>
          {/* begin::Menu */}
          <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTIcon iconName='category' className='fs-2' />
          </button>
          <TopSalesmanFilter />
          {/* end::Menu */}
        </div>
        {/* <div
          className='card-toolbar'
          data-bs-toggle='tooltip'
          data-bs-placement='top'
          data-bs-trigger='hover'
          title='Click to add a user'
        >
          <a
            href='#'
            className='btn btn-sm btn-light-primary'
            // data-bs-toggle='modal'
            // data-bs-target='#kt_modal_invite_friends'
          >
            <KTIcon iconName='plus' className='fs-3' />
            New Member
          </a>
        </div> */}
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        {/* begin::Table container */}
        <div className='table-responsive'>
          {/* begin::Table */}
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            {/* begin::Table head */}
            <thead>
              <tr className='fw-bold text-muted'>
                {/* <th className='w-25px'>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    <input
                      className='form-check-input'
                      type='checkbox'
                      value='1'
                      data-kt-check='true'
                      data-kt-check-target='.widget-9-check'
                    />
                  </div>
                </th> */}
                <th className='min-w-30px'>No.</th>
                <th className='min-w-150px'>Nhân viên xuất sắc</th>
                <th className='min-w-140px'>Thuộc chi nhánh</th>
                <th className='min-w-120px'>Doanh thu (VND)</th>
                <th className='min-w-100px text-end'>Xếp hạng</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {topSalesmen.map((salesman, index) => (
                <tr>
                  {/* <td>
                  <div className='form-check form-check-sm form-check-custom form-check-solid'>
                    <input className='form-check-input widget-9-check' type='checkbox' value='1' />
                  </div>
                </td> */}
                  <td>
                      <span className='-gray-900 fw-bold text-hover-warning fs-6'>#{index + 1}</span>
                    {/* <span className='text-muted fw-semibold text-muted d-block fs-7'>
                      Web, UI/UX Design
                    </span> */}
                  </td>
                  <td>
                    <div className='d-flex align-items-center'>
                      <div className='symbol symbol-45px me-5'>
                        <img src={salesman.avatar} alt={salesman.fullname} />
                      </div>
                      <div className='d-flex justify-content-start flex-column'>
                        <a href='#' className='text-gray-900 fw-bold text-hover-warning fs-6'>
                          {salesman.fullname}
                        </a>
                        {/* <span className='text-muted fw-semibold text-muted d-block fs-7'>
                          HTML, JS, ReactJS
                        </span> */}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className='text-gray-900 fw-bold d-block fs-6'>
                      {salesman.agency}
                    </span>
                    {/* <span className='text-muted fw-semibold text-muted d-block fs-7'>
                      Web, UI/UX Design
                    </span> */}
                  </td>
                  <td className='text-end'>
                    <div className='d-flex flex-column w-100 me-2'>
                      <div className='d-flex flex-stack mb-2'>
                        <span className='badge badge-success me-2 fs-7 fw-bolder'>{formatRevenue(salesman['Total revenue'] ?? 0)}</span>
                      </div>
                      {/* <div className='progress h-6px w-100'>
                        <div
                          className='progress-bar bg-primary'
                          role='progressbar'
                          style={{ width: '50%' }}
                        ></div>
                      </div> */}
                    </div>
                  </td>
                  <td className='text-end'>
                    <div className='d-flex justify-content-end align-items-center me-3'>
                      {rankingIcon(index + 1)}
                    </div>
                  </td>
                  {/* <td>
                    <div className='d-flex justify-content-end flex-shrink-0'>
                      <a
                        href='#'
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                      >
                        <KTIcon iconName='switch' className='fs-3' />
                      </a>
                      <a
                        href='#'
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'
                      >
                        <KTIcon iconName='pencil' className='fs-3' />
                      </a>
                      <a
                        href='#'
                        className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'
                      >
                        <KTIcon iconName='trash' className='fs-3' />
                      </a>
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  )
}

export { TablesWidget10 }
