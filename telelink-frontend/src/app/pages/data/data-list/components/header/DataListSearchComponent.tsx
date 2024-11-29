import { useEffect, useState } from 'react'
import { initialQueryState, KTIcon, useDebounce } from '../../../../../../_metronic/helpers'
import { useQueryRequest } from '../../core/QueryRequestProvider'
import { useIntl } from 'react-intl'
import { useAuth } from '../../../../../../app/modules/auth'
import { getAllNetworks, getNetworksByAgency } from '../../core/_requests'

const DataListSearchComponent = () => {
  const { updateState } = useQueryRequest()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const intl = useIntl()
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const { currentUser } = useAuth()
  const [isAdmin] = useState(currentUser?.auth?.role === 1);
  const [agencyId] = useState(isAdmin ? '' : currentUser?.agency?.id);
  const [isLoadingNetworks, setIsLoadingNetworks] = useState(false);
  const [networks, setNetworks] = useState<{ [key: string]: { count: number } }>({});

  const fetchNetworks = async () => {
    setIsLoadingNetworks(true);
    try {
      if (isAdmin) {
        const networks = await getAllNetworks();
        setNetworks(networks);
      } else {
        const networks = await getNetworksByAgency(agencyId?.toString() || '');
        setNetworks(networks);
      }
    } catch (error) {
      console.error('Failed to fetch data networks:', error);
    } finally {
      setIsLoadingNetworks(false);
    }
  }

  useEffect(() => {
    fetchNetworks();
  }, [isAdmin, agencyId])

  useEffect(() => {
    if (debouncedSearchTerm !== undefined && searchTerm !== undefined) {
      updateState({ search: debouncedSearchTerm, ...initialQueryState })
    }
  },
    [debouncedSearchTerm] // Only call effect if debounced search term changes
  )

  return (
    <div className='card-title'>
      {/* begin::Search */}
      <div className='d-flex align-items-center position-relative my-1'>
        <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
        <input
          type='text'
          data-kt-user-table-filter='search'
          className='form-control form-control-solid w-250px ps-14'
          placeholder={intl.formatMessage({ id: 'ECOMMERCE.COMMON.SEARCH' })}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* end::Search */}
      <div className='ms-3 fs-5'>
        {isLoadingNetworks ? (
          <span>Đang tải...</span>
        ) : (
          <div className='fs-6'>
            Kho data: 
            {Object.entries(networks).map(([key, value]) => {
              let badgeClass = '';
              switch (key) {
                case 'Viettel':
                  badgeClass = 'badge badge-light-danger';
                  break;
                case 'Vinaphone':
                  badgeClass = 'badge badge-light-info';
                  break;
                case 'Mobifone':
                  badgeClass = 'badge badge-light-primary';
                  break;
                default:
                  badgeClass = 'badge badge-light-secondary';
              }

              return (
                <span key={key} className={`ms-3 ${badgeClass}`}>
                  {key}: {value.count}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export { DataListSearchComponent }
