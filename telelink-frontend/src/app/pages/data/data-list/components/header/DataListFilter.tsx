import { useEffect, useState } from 'react'
import { MenuComponent } from '../../../../../../_metronic/assets/ts/components'
import { initialQueryState, KTIcon } from '../../../../../../_metronic/helpers'
import { useQueryRequest } from '../../core/QueryRequestProvider'
import { useQueryResponse } from '../../core/QueryResponseProvider'
import { useIntl } from 'react-intl'
import { ref } from 'firebase/storage'
import { getAllPlaceOfIssues } from '../../core/_requests'

const DataListFilter = () => {
  const { updateState } = useQueryRequest()
  const { isLoading } = useQueryResponse()
  const [placeOfIssue, setPlaceOfIssue] = useState<string | undefined>()
  const [placeOfIssues, setPlaceOfIssues] = useState<{ [key: string]: { count: number } }>({})
  const [networkName, setNetworkName] = useState<string | undefined>()
  const intl = useIntl()
  const { refetch } = useQueryResponse();


  const API_URL = import.meta.env.VITE_APP_API_URL;

  const fetchPlaceOfIssues = async () => {
    try {
      const placeOfIssues = await getAllPlaceOfIssues();
      setPlaceOfIssues(placeOfIssues);
    } catch (error) {
      console.error('Failed to fetch place of issues:', error);
    }
  }

  useEffect(() => {
    MenuComponent.reinitialization();
  
    fetchPlaceOfIssues();
  }, []);
  
  const resetData = () => {
    setPlaceOfIssue('')
    setNetworkName('')
    updateState({
      filter: {
        placeOfIssue: '',
        networkName: '',
      }, ...initialQueryState
    })
    refetch()
  }

  const filterData = () => {
    console.log("Applying filters:", { placeOfIssue, networkName });
    updateState({
      filter: { placeOfIssue, networkName },
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
          {/* begin::Input group */}
          <div className="mb-10">
            <label className="form-label fs-6 fw-bold">Nơi cấp data:</label>
            <select
              className="form-select form-select-solid fw-bolder"
              data-kt-select2="true"
              data-placeholder="Select option"
              data-allow-clear="true"
              data-kt-user-table-filter="role"
              data-hide-search="true"
              onChange={(e) => setPlaceOfIssue(e.target.value)}
              value={placeOfIssue}
            >
              <option value=""></option>
              {Object.entries(placeOfIssues).map(([name, count]) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          {/* end::Input group */}

          {/* begin::Input group */}
          <div className='mb-10'>
            <label className='form-label fs-6 fw-bold'>Nhà mạng:</label>
            <select
              className='form-select form-select-solid fw-bolder'
              data-kt-select2='true'
              data-placeholder='Select option'
              data-allow-clear='true'
              data-kt-user-table-filter='two-step'
              data-hide-search='true'
              onChange={(e) => setNetworkName(e.target.value)}
              value={networkName}
            >
              <option value=''></option>
              <option value='Viettel'>Viettel</option>
              <option value='Vinaphone'>Vinaphone</option>
              <option value='Mobifone'>Mobifone</option>
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
      </div>
      {/* end::SubMenu */}
    </>
  )
}

export { DataListFilter }
