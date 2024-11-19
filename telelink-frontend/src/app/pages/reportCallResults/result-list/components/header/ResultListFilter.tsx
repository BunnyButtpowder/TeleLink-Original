import { useEffect, useState } from 'react'
import { MenuComponent } from '../../../../../../_metronic/assets/ts/components'
import { initialResultQueryState, KTIcon } from '../../../../../../_metronic/helpers'
import { useQueryRequest } from '../../core/QueryRequestProvider'
import { useQueryResponse } from '../../core/QueryResponseProvider'
import { useIntl } from 'react-intl'
import { getAllAgencies } from '../../../../data/data-list/core/_requests'
import { useAuth } from '../../../../../../app/modules/auth'

const ResultListFilter = () => {
  const { updateState } = useQueryRequest()
  const { isLoading } = useQueryResponse()
  const { currentUser } = useAuth()
  const [month, setMonth] = useState<string | undefined>('')
  const [year, setYear] = useState<string | undefined>('')
  const [agencyId, setAgencyId] = useState<string | undefined>()
  const [result, setResult] = useState<number | undefined>()
  const [agencies, setAgencies] = useState<{ id: string, name: string }[]>([])
  const [isAdmin] = useState(currentUser?.auth?.role === 1);
  const intl = useIntl()
  const { refetch } = useQueryResponse();

  const fetchAgencies = async () => {
    try {
      const agencies = await getAllAgencies();
      setAgencies(agencies.data);
    } catch (error) {
      console.error('Failed to fetch agencies:', error);
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchAgencies();
    }
    MenuComponent.reinitialization()
  }, [isAdmin])

  const resetResult = () => {
    setMonth('')
    setYear('')
    setAgencyId('')
    setResult(undefined)
    updateState({
      ...initialResultQueryState
    })
    refetch()
  }

  const filterResult = () => {
    const date = month && year ? `${month}-${year}` : '';
    updateState({
      filter: { date, agencyId, result },
    })
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
        {intl.formatMessage({ id: 'ECOMMERCE.COMMON.FILTER' })}
      </button>
      {/* end::Filter Button */}
      {/* begin::SubMenu */}
      <div className='menu menu-sub menu-sub-dropdown w-300px w-md-325px' data-kt-menu='true'>
        {/* begin::Header */}
        <div className='px-7 py-5'>
          <div className='fs-5 text-gray-900 fw-bolder'>{intl.formatMessage({ id: 'ECOMMERCE.COMMON.FILTER_OPTIONS' })}</div>
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

          {/* begin::Input group */}
          <div className='mb-10'>
            <label className='form-label fs-6 fw-bold'>Kết quả:</label>
            <select
              className='form-select form-select-solid fw-bolder'
              data-kt-select2='true'
              data-placeholder='Select option'
              data-allow-clear='true'
              data-kt-user-table-filter='role'
              data-hide-search='true'
              onChange={(e) => setResult(e.target.value ? parseInt(e.target.value, 10) : undefined)}
              value={result ?? ''}
            >
              <option value=''></option>
              <option value='1'>Đồng ý</option>
              <option value='2'>Không đồng ý</option>
              <option value='3'>Không bắt máy</option>
              <option value='4'>Không liên lạc được</option>
              <option value='5'>Hẹn gọi lại sau</option>
              <option value='6'>Đang tư vấn</option>
              <option value='7'>Chờ nạp thẻ, chuyển khoản</option>
              <option value='8'>Mất đơn</option>
            </select>
          </div>
          {/* end::Input group */}

          {isAdmin && (
            <>
              {/* begin::Input group */}
              < div className='mb-10'>
                <label className='form-label fs-6 fw-bold'>Chi nhánh:</label>
                <select
                  className='form-select form-select-solid fw-bolder'
                  data-kt-select2='true'
                  data-placeholder='Select option'
                  data-allow-clear='true'
                  data-kt-user-table-filter='two-step'
                  data-hide-search='true'
                  onChange={(e) => setAgencyId(e.target.value)}
                  value={agencyId}
                >
                  <option value=''></option>
                  {agencies.map(agency => (
                    <option key={agency.id} value={agency.id}>{agency.name}</option>
                  ))}
                </select>
              </div>
              {/* end::Input group */}
            </>
          )}


          {/* begin::Actions */}
          <div className='d-flex justify-content-end'>
            <button
              type='button'
              disabled={isLoading}
              onClick={resetResult}
              className='btn btn-light btn-active-light-primary fw-bold me-2 px-6'
              data-kt-menu-dismiss='true'
              data-kt-user-table-filter='reset'
            >
              Đặt lại
            </button>
            <button
              disabled={isLoading}
              type='button'
              onClick={filterResult}
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
      </div >
      {/* end::SubMenu */}
    </>
  )
}

export { ResultListFilter }
