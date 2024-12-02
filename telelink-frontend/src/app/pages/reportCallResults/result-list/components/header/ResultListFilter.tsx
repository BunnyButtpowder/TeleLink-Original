import {useEffect, useState} from 'react'
import {MenuComponent} from '../../../../../../_metronic/assets/ts/components'
import {initialResultQueryState, KTIcon} from '../../../../../../_metronic/helpers'
import {useQueryRequest} from '../../core/QueryRequestProvider'
import {useQueryResponse} from '../../core/QueryResponseProvider'
import {useIntl} from 'react-intl'
import { useAuth } from '../../../../../../app/modules/auth'
import { parse } from 'path'

const ResultListFilter = () => {
  const { updateState } = useQueryRequest()
  const { isLoading } = useQueryResponse()
  const { currentUser } = useAuth()
  const [month, setMonth] = useState<string | undefined>('')
  const [year, setYear] = useState<string | undefined>('')
  const [agencyId, setAgencyId] = useState< number | undefined>()
  const [agencies, setAgencies] = useState<{ id: number, name: string }[]>([]) // State to hold agency list
  const [salesmen, setSalesmen] = useState<{ id: number, fullName: string }[]>([]) // State to hold salesmen list
  const [result, setResult] = useState<number | undefined>()
  const [saleman, setSaleman] = useState<number | undefined>()
  const intl = useIntl()
  const { refetch } = useQueryResponse();
  

  const API_URL = import.meta.env.VITE_APP_API_URL;

  const userRole = currentUser?.auth.role;
  const agencyID = currentUser?.agency?.id;

  useEffect(() => {
    
    MenuComponent.reinitialization()
    if (userRole !== 3) {

    const fetchAgencies = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const response = await fetch(`${API_URL}/agencys/getall`, {
          headers: {
            'Authorization': `Bearer ${token}`, // Adjust if a different auth scheme is used
            'Content-Type': 'application/json'
          }
        })
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
  
        const result = await response.json()
        if (result && result.data) {
          setAgencies(result.data)
        }
      } catch (error) {
        console.error('Error fetching agencies:', error)
      }
    }

    fetchAgencies()
    }
  }, [userRole])

  useEffect(() => {
    const fetchSalesmen = async () => {
      let fetchAgencyId = agencyId;

      if (userRole === 2) {
        fetchAgencyId = agencyID; 
      }

      console.log(fetchAgencyId)

      if (!fetchAgencyId) {
        setSalesmen([]) 
        return
      }

      try {
        const token = localStorage.getItem('auth_token')
        const response = await fetch(`${API_URL}/users/agency?agencyId=${fetchAgencyId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const result = await response.json()

      console.log(result);
        if (result && result.employees) {
          setSalesmen(result.employees.map((employee: any) => ({ id: employee.id, fullName: employee.fullName })))
        }
        console.log(salesmen);
      } catch (error) {
        console.error('Error fetching salesmen:', error)
      }
    }
    
    fetchSalesmen()
  }, [agencyId, agencyID, userRole])  


  const resetData = () => {
    setMonth(undefined)
    setYear(undefined)
    setAgencyId(undefined)
    setResult(undefined)
    setSaleman(undefined)
    updateState({
      filter: {
        month: undefined,
        year: undefined,
        agencyId: undefined,
        result: undefined,
        saleman: undefined,
      }, ...initialResultQueryState
    })
    refetch()
  }


  const filterData = () => {
    const date = month && year ? `${month}-${year}` : '';
    console.log("Applying filters:", { agencyId, result, saleman, date });
    updateState({
      filter: {agencyId, result, saleman, date},
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
          {userRole !== 2 && userRole !== 3 && (
            <div className='mb-10'>
              <label className='form-label fs-6 fw-bold'>Chi nhánh:</label>
              <select
                className='form-select form-select-solid fw-bolder'
                onChange={(e) => setAgencyId(e.target.value  ? parseInt(e.target.value, 10) : undefined)}
                value={agencyId}
              >
                <option value=''></option>
                {agencies.map((agency) => (
                  <option key={agency.id} value={agency.id}>
                    {agency.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {userRole !== 3 && (
            <div className='mb-10'>
              <label className='form-label fs-6 fw-bold'>Nhân viên bán hàng:</label>
              <select
                className='form-select form-select-solid fw-bolder'
                onChange={(e) => setSaleman(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                value={saleman}
                // disabled={!agencyId}
              >
                <option value=''></option>
                {salesmen.map((salesman) => (
                  <option key={salesman.id} value={salesman.id}>
                    {salesman.fullName}
                  </option>
                ))}
                
              </select>
            </div>
          )}
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='mb-10'>
            <label className='form-label fs-6 fw-bold'>Kết quả: </label>
            <select
              className='form-select form-select-solid fw-bolder'
              data-kt-select2='true'
              data-placeholder='Select option'
              data-allow-clear='true'
              data-kt-user-table-filter='two-step'
              data-hide-search='true'
              onChange={(e) => setResult(e.target.value ? parseInt(e.target.value, 10) : undefined)}
              value={result}
            >
              <option value=''></option>
              <option value='1'>Đồng ý</option>
              <option value='5'>Hẹn gọi lại sau</option>
              <option value='6'>Đang tư vấn</option>
              <option value='7'>Chờ nạp thẻ, chuyển khoản</option>
            </select>
          </div>
          {/* end::Input group */}

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
      </div >
      {/* end::SubMenu */}
    </>
  )
}

export { ResultListFilter }
