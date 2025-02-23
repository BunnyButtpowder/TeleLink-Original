
import clsx from 'clsx'
import {useQueryResponseLoading, useQueryResponsePagination} from '../../core/QueryResponseProvider'
import {useQueryRequest} from '../../core/QueryRequestProvider'
import {PaginationState} from '../../../../../../_metronic/helpers'
import {useMemo} from 'react'

const RetrieveDataPagination = () => {
  const pagination = useQueryResponsePagination()
  const isLoading = useQueryResponseLoading()
  const {updateState} = useQueryRequest()

  const updatePage = (page: number | undefined | null) => {
    if (!page || isLoading || pagination.page === page) {
      return
    }
    updateState({page})
  }

  const createPageNumbers = () => {
    const pageNumbers = []
    const PAGINATION_PAGES_COUNT = 5
    const half = Math.floor(PAGINATION_PAGES_COUNT / 2)
    const startPage = Math.max((pagination.page ?? 1) - half, 1)
    const endPage = Math.min(startPage + PAGINATION_PAGES_COUNT - 1, pagination.total_pages || 1)

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return pageNumbers
  }

  const pageNumbers = createPageNumbers()

  return (
    <div className='row mb-3 me-5'>
      <div className='col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start'></div>
      <div className='col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'>
        <div id='kt_table_customers_paginate'>
          <ul className='pagination'>
            <li
              className={clsx('page-item', {
                disabled: isLoading || pagination.page === 1,
              })}
            >
              <a onClick={() => updatePage(1)} style={{cursor: 'pointer'}} className='page-link'>
                Trang đầu
              </a>
            </li>
            
            <li
              className={clsx('page-item', {
                disabled: isLoading || pagination.page === 1,
              })}
            >
              <a
                onClick={() => updatePage((pagination.page ?? 1) - 1)}
                style={{ cursor: 'pointer' }}
                className='page-link'
              >
                Trước
              </a>
            </li>

            {pageNumbers.map((page) => (
              <li
                key={page}
                className={clsx('page-item', {
                  active: pagination.page === page,
                  disabled: isLoading,
                })}
              >
                <a
                  className='page-link'
                  onClick={() => updatePage(page)}
                  style={{ cursor: 'pointer' }}
                >
                  {page}
                </a>
              </li>
            ))}

            <li
              className={clsx('page-item', {
                disabled: isLoading || pagination.page === pagination.total_pages,
              })}
            >
              <a
                onClick={() => updatePage((pagination.page ?? 1) + 1)}
                style={{ cursor: 'pointer' }}
                className='page-link'
              >
                Sau
              </a>
            </li>

            <li
              className={clsx('page-item', {
                disabled: isLoading || pagination.page === pagination.total_pages,
              })}
            >
              <a
                onClick={() => updatePage(pagination.total_pages)}
                style={{ cursor: 'pointer' }}
                className='page-link'
              >
                Trang cuối
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export {RetrieveDataPagination}
