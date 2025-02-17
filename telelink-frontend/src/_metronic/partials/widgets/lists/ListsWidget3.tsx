import { FC, useState, useEffect } from 'react'
import React from 'react'
import { KTIcon } from '../../../helpers'
import { Dropdown1 } from '../../content/dropdown/Dropdown1'
import { getLatestCalls } from '../../../../app/pages/callBack/callBack-list/core/_requests'
import { Rehandle } from '../../../../app/pages/callBack/callBack-list/core/_models'

type Props = {
  className: string
}

const ListsWidget3: React.FC<Props> = ({ className }) => {
  const [latestCalls, setLatestCalls] = useState<Rehandle[]>([])
  const fetchLastestCalls = async () => {
    try {
      const response = await getLatestCalls();
      setLatestCalls(response.data);
    } catch (error) {
      console.error('Error fetching lastest calls:', error);
    }
  }

  useEffect (() =>{
    fetchLastestCalls();
  }, []);

  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0'>
        <h3 className='card-title fw-bold text-gray-900'>Yêu cầu xử lý lại</h3>
        <div className='card-toolbar'>
          {/* begin::Menu */}
          <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTIcon iconName='category' className='fs-2' />
          </button>
          <Dropdown1 />
          {/* end::Menu */}
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body pt-2'>
        {latestCalls?.map((call, index) => (
          < div className='d-flex align-items-center mb-8' >
            < span className='bullet bullet-vertical h-40px bg-danger' ></span>
            {/* <div className='form-check form-check-custom form-check-solid mx-5'>
              <input className='form-check-input' type='checkbox' value='' />
            </div> */}
            <div className='ms-5 flex-grow-1'>
              <a href='#' className='text-gray-800 text-hover-primary fw-bold fs-6'>
                {call.customerName}
              </a>
              <span className='text-muted fw-semibold d-block'>{call.data.subscriberNumber}</span>
            </div>
            <span className='badge badge-light-danger fs-8 fw-bold'>{new Date(call.dateToCall).toLocaleDateString('vi-VN')}</span>
          </div>
        ))}
      </div >
      {/* end::Body */}
    </div >
  )
}

export { ListsWidget3 }
