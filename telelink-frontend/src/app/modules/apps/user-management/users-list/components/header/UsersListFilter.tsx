import {useEffect, useState} from 'react'
import {MenuComponent} from '../../../../../../../_metronic/assets/ts/components'
import {initialUserQueryState, KTIcon} from '../../../../../../../_metronic/helpers'
import {useQueryRequest} from '../../core/QueryRequestProvider'
import {useQueryResponse} from '../../core/QueryResponseProvider'
import {useIntl} from 'react-intl'

const UsersListFilter = () => {
  const {updateState} = useQueryRequest()
  const {isLoading} = useQueryResponse()
  const [role, setRole] = useState<number | undefined>()
  const [agency, setAgency] = useState<number | undefined>()
  const [agencies, setAgencies] = useState<{ id: number, name: string }[]>([]) // State to hold agency list
  const intl = useIntl()
  const { refetch } = useQueryResponse();

  const API_URL = import.meta.env.VITE_APP_API_URL;

  useEffect(() => {
    MenuComponent.reinitialization()

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
  }, [])

  const resetData = () => {
    setAgency(undefined)
    setRole(undefined)
    updateState({filter: {
      agency: undefined,
      role: undefined,
    }, ...initialUserQueryState})
    refetch()
  }

  const filterData = () => {
    console.log("Applying filters:", { agency, role });
    updateState({
      filter: {role, agency},
    });
    refetch();
  };

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
          {/* begin::Input group */}
          <div className='mb-10'>
            <label className='form-label fs-6 fw-bold'>Loại tài khoản:</label>
            <select
              className='form-select form-select-solid fw-bolder'
              data-kt-select2='true'
              data-placeholder='Select option'
              data-allow-clear='true'
              data-kt-user-table-filter='role'
              data-hide-search='true'
              onChange={(e) => setRole(e.target.value ? parseInt(e.target.value, 10) : undefined)}
              value={role}
            >
              <option value=''></option>
              <option value='1'>Admin</option>
              <option value='2'>Chi nhánh</option>
              <option value='3'>Salesman</option>
            </select>
          </div>
          {/* end::Input group */}


          {/* Agency Filter */}
          <div className='mb-10'>
            <label className='form-label fs-6 fw-bold'>Chi nhánh:</label>
            <select
              className='form-select form-select-solid fw-bolder'
              data-kt-select2='true'
              data-placeholder='Select an agency'
              data-allow-clear='true'
              data-kt-user-table-filter='agency'
              data-hide-search='true'
              onChange={(e) => setAgency(e.target.value ? parseInt(e.target.value, 10) : undefined)}
              value={agency}
            >
              <option value=''></option>
              {agencies.map(agency => (
                <option key={agency.id} value={agency.id}>{agency.name}</option>
              ))}
            </select>
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

export {UsersListFilter}
