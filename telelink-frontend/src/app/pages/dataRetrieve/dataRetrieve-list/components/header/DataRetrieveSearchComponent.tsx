/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useRef, useState } from 'react'
import { initialQueryState, KTIcon, useDebounce } from '../../../../../../_metronic/helpers'
import { useQueryRequest } from '../../core/QueryRequestProvider'
import { useIntl } from 'react-intl'

const DataRetrieveSearchComponent = () => {
  const { state, updateState } = useQueryRequest()
  const [searchTerm, setSearchTerm] = useState<string>(state.search || '');
  const intl = useIntl()
  const debouncedSearchTerm = useDebounce(searchTerm, 250)
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.search !== searchTerm) {
      setSearchTerm(state.search || '');
    }
  }, [state.search]);

  useEffect(
    () => {
      if (debouncedSearchTerm !== undefined && searchTerm !== undefined) {
        updateState({ search: debouncedSearchTerm})

        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    },
    [debouncedSearchTerm]
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
  
    if (value === '') {
      updateState({ search: '' });
    }
  };
  

  return (
    <div className='card-title'>
      {/* begin::Search */}
      <div className='d-flex align-items-center position-relative me-3'>
        <KTIcon iconName='magnifier' className='fs-1 position-absolute ms-6' />
        <input
          ref={inputRef}
          type='text'
          data-kt-user-table-filter='search'
          className='form-control form-control-solid w-250px ps-14'
          placeholder={intl.formatMessage({ id: 'ECOMMERCE.COMMON.SEARCH' })}
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>
      {/* end::Search */}
    </div>
  )
}

export { DataRetrieveSearchComponent }
