import {useEffect, useState} from 'react'
import {MenuComponent} from '../../../../../../_metronic/assets/ts/components'
import {initialPackageQueryState, KTIcon} from '../../../../../../_metronic/helpers'
import {useQueryRequest} from '../../core/QueryRequestProvider'
import {useQueryResponse} from '../../core/QueryResponseProvider'
import {useIntl} from 'react-intl'

const PackageListFilter = () => {
  const {updateState} = useQueryRequest()
  const {isLoading} = useQueryResponse()
  const [provider, setProvider] = useState<string | undefined>()
  const [type, setType] = useState<string | undefined>()
  const intl = useIntl()
  const { refetch } = useQueryResponse();


  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const resetData = () => {
    setProvider('')
    setType('')
    updateState({filter: {
      provider: '', 
      type: '',
    }, ...initialPackageQueryState})
    refetch()
  }

  const filterPackage = () => {
    console.log("Applying filters:", { provider, type });
    updateState({
      filter: {provider, type},
      // ...initialQueryState,
      
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
            <label className='form-label fs-6 fw-bold'>Nhà mạng:</label>
            <select
              className='form-select form-select-solid fw-bolder'
              data-kt-select2='true'
              data-placeholder='Select option'
              data-allow-clear='true'
              data-kt-user-table-filter='role'
              data-hide-search='true'
              onChange={(e) => setProvider(e.target.value)}
              value={provider}
            >
              <option value=''></option>
              <option value='Viettel'>Viettel</option>
              <option value='Vinaphone'>Vinaphone</option>
              <option value='Mobifone'>Mobifone</option>
              <option value='Vietnamobile'>Vietnamobile</option>
            </select>
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='mb-10'>
            <label className='form-label fs-6 fw-bold'>Loại:</label>
            <select
              className='form-select form-select-solid fw-bolder'
              data-kt-select2='true'
              data-placeholder='Select option'
              data-allow-clear='true'
              data-kt-user-table-filter='two-step'
              data-hide-search='true'
              onChange={(e) => setType(e.target.value)}
              value={type}
            >
              <option value=''></option>
              <option value='TT'>Trả trước</option>
              <option value='TS'>Trả sau</option>
              
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
              onClick={filterPackage}
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

export {PackageListFilter}
