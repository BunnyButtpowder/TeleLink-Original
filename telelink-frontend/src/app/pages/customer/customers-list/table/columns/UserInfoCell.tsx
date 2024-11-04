
import clsx from 'clsx'
import {FC} from 'react'
import {toAbsoluteUrl} from '../../../../../../_metronic/helpers'
import {Customer} from '../../core/_models'

type Props = {
  customer: Customer
}

const UserInfoCell: FC<Props> = ({customer}) => (
  <div className='d-flex align-items-center'>
    {/* begin:: Avatar */}
    <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'>
      <a href='#'>
        {/* {customer.phoneNum ? (
          <div className='symbol-label'>
            <img src={toAbsoluteUrl(`media/${customer.avatar}`)} alt={customer.name} className='w-100' />
          </div>
        ) : (
          <div
            className={clsx(
              'symbol-label fs-3',
              `bg-light-${customer.initials?.state}`,
              `text-${customer.initials?.state}`
            )}
          >
            {customer.initials?.label}
          </div>
        )} */}
        {customer.subscriberNumber}
      </a>
    </div>
    {/* <div className='d-flex flex-column'>
      <a href='#' className='text-gray-800 text-hover-primary mb-1'>
        {customer.name}
      </a>
      <span>{customer.email}</span>
    </div> */}
  </div>
)

export {UserInfoCell}
