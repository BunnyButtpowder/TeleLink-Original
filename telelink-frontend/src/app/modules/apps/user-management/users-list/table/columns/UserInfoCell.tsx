
import clsx from 'clsx'
import {FC} from 'react'
import {toAbsoluteUrl} from '../../../../../../../_metronic/helpers'
import {User, initialUser} from '../../core/_models'

type Props = {
  user: User
}

const UserInfoCell: FC<Props> = ({user}) => (
  <div className='d-flex align-items-center'>
    {/* begin:: Avatar */}
    <div className='symbol symbol-circle symbol-50px overflow-hidden me-3'>
      <a href='#'>
        {user.avatar ? (
          <div className='symbol-label'>
            <img src={(`${user.avatar}`)} alt='avatar' className='w-100' />
          </div>
        ) : (
          <div
            className={clsx(
              'symbol-label fs-3'
            )}
          >
            <img src={(`${initialUser.avatar}`)} alt='avatar' className='w-100' />
          </div>
        )}
      </a>
    </div>
    <div className='d-flex flex-column'>
      <a href='#' className='text-gray-800 text-hover-primary mb-1'>
        {user.fullName}
      </a>
      {user.auth && <span>{user.auth.email}</span>}
      {/* {user.auth?  (<span>{user.auth.email}</span>) : (<span>{user.email}</span>)} */}
    </div>
  </div>
)

export {UserInfoCell}
