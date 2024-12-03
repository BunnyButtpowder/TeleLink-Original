import {useEffect, useState} from 'react'
import {MenuComponent} from '../../../../../../_metronic/assets/ts/components'
import {initialReportQueryState, KTIcon} from '../../../../../../_metronic/helpers'
import {useQueryRequest} from '../../core/QueryRequestProvider'
import {useQueryResponse} from '../../core/QueryResponseProvider'
import {useIntl} from 'react-intl'

const ReportListFilter = () => {
  const {updateState} = useQueryRequest()
  const {isLoading} = useQueryResponse()
  const [month, setMonth] = useState<string | undefined>('')
  const [year, setYear] = useState<string | undefined>('')
  const intl = useIntl()
  const { refetch } = useQueryResponse();


  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const resetData = () => {
    setMonth(undefined)
    setYear(undefined)
    updateState({
      filter: {
        month: undefined,
        year: undefined,
      }, ...initialReportQueryState
    })
    refetch()
  }

  const filterData = () => {
    console.log(month, year);
    const date = month && year ? `${month}-${year}` : '';
    console.log("Applying filters:", { date });
    updateState({
      filter: {date},
    });
    refetch();
  }

  return (
    <>
      {/* begin::Filter Button */}
      <button
        disabled={isLoading}
        type='button'
        className='btn btn-light-primary me-3'
        data-kt-menu-trigger='click'
        data-kt-menu-placement='bottom-end'
      >
        <KTIcon iconName='filter' className='fs-2' />
        {intl.formatMessage({id: 'ECOMMERCE.COMMON.FILTER'})}
      </button>
      {/* end::Filter Button */}
      {/* begin::SubMenu */}
      <div className='menu menu-sub menu-sub-dropdown w-300px w-md-325px' data-kt-menu='true'>
        {/* begin::Header */}
        <div className='px-7 py-5'>
          <div className='fs-5 text-gray-900 fw-bolder'>{intl.formatMessage({id: 'ECOMMERCE.COMMON.FILTER_OPTIONS'})}</div>
        </div>
        {/* end::Header */}

        {/* begin::Separator */}
        <div className='separator border-gray-200'></div>
        {/* end::Separator */}

        {/* begin::Content */}
        <div className='px-7 py-5' data-kt-user-table-filter='form'>
         {/* Month Selector */}
         <div className="mb-10 d-flex justify-content-between">
            <div>
              <label className="form-label fs-6 fw-bold">Tháng:</label>
              <select
                className="form-select form-select-solid fw-bolder"
                onChange={(e) => setMonth(e.target.value)}
                value={month}
              >
                <option value="">Chọn tháng</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                    {`Tháng ${i + 1}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label fs-6 fw-bold">Năm:</label>
              <select
                className="form-select form-select-solid fw-bolder"
                onChange={(e) => setYear(e.target.value)}
                value={year}
              >
                <option value="">Chọn năm</option>
                {[...Array(5)].map((_, i) => (
                  <option key={i} value={(new Date().getFullYear() - i).toString()}>
                    {new Date().getFullYear() - i}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* begin::Actions */}
          <div className='d-flex justify-content-end'>
            <button
              type='button'
              disabled={isLoading}
              onClick={resetData}
              className='btn btn-light btn-active-light-primary fw-bold me-2 px-6'
              data-kt-menu-dismiss='true'
              data-kt-user-table-filter='reset'
            >
              Đặt lại
            </button>
            <button
              disabled={isLoading}
              type='button'
              onClick={filterData}
              className='btn btn-primary fw-bold px-6'
              data-kt-menu-dismiss='true'
              data-kt-user-table-filter='filter'
            >
              Áp dụng 
            </button>
          </div>
          {/* end::Actions */}
        </div>
        {/* end::Content */}
      </div>
      {/* end::SubMenu */}
    </>
  )
}

export {ReportListFilter}
