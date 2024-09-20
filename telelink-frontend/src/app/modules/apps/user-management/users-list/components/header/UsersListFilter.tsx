import {useEffect, useState} from 'react'
import {MenuComponent} from '../../../../../../../_metronic/assets/ts/components'
import {initialQueryState, KTIcon} from '../../../../../../../_metronic/helpers'
import {useQueryRequest} from '../../core/QueryRequestProvider'
import {useQueryResponse} from '../../core/QueryResponseProvider'
import {useIntl} from 'react-intl'

const UsersListFilter = () => {
  const {updateState} = useQueryRequest()
  const {isLoading} = useQueryResponse()
  const [role, setRole] = useState<string | undefined>()
  const [lastLogin, setLastLogin] = useState<string | undefined>()
  const intl = useIntl()

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const resetData = () => {
    updateState({filter: undefined, ...initialQueryState})
  }

  const filterData = () => {
    updateState({
      filter: {role, last_login: lastLogin},
      ...initialQueryState,
    })
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
          {/* begin::Input group */}
          <div className='mb-10'>
            <label className='form-label fs-6 fw-bold'>Role:</label>
            <select
              className='form-select form-select-solid fw-bolder'
              data-kt-select2='true'
              data-placeholder='Select option'
              data-allow-clear='true'
              data-kt-user-table-filter='role'
              data-hide-search='true'
              onChange={(e) => setRole(e.target.value)}
              value={role}
            >
              <option value=''></option>
              <option value='Partner'>Partner</option>
              <option value='Sub-admin'>Administrator (Sub)</option>
              <option value='Salesman'>Salesman</option>
            </select>
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='mb-10'>
            <label className='form-label fs-6 fw-bold'>Last login:</label>
            <select
              className='form-select form-select-solid fw-bolder'
              data-kt-select2='true'
              data-placeholder='Select option'
              data-allow-clear='true'
              data-kt-user-table-filter='two-step'
              data-hide-search='true'
              onChange={(e) => setLastLogin(e.target.value)}
              value={lastLogin}
            >
              <option value=''></option>
              <option value='Yesterday'>Yesterday</option>
              <option value='20 mins ago'>20 mins ago</option>
              <option value='5 hours ago'>5 hours ago</option>
              <option value='2 days ago'>2 days ago</option>
            </select>
          </div>
          {/* end::Input group */}

          {/* begin::Actions */}
          <div className='d-flex justify-content-end'>
            <button
              type='button'
              disabled={isLoading}
              onClick={filterData}
              className='btn btn-light btn-active-light-primary fw-bold me-2 px-6'
              data-kt-menu-dismiss='true'
              data-kt-user-table-filter='reset'
            >
              Reset
            </button>
            <button
              disabled={isLoading}
              type='button'
              onClick={resetData}
              className='btn btn-primary fw-bold px-6'
              data-kt-menu-dismiss='true'
              data-kt-user-table-filter='filter'
            >
              Apply
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
