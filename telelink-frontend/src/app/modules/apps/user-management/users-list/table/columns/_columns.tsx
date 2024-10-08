import { Column } from 'react-table'
import { UserInfoCell } from './UserInfoCell'
import { UserLastLoginCell } from './UserLastLoginCell'
import { UserRoleCell } from './UserRoleCell'
import { UserActionsCell } from './UserActionsCell'
import { UserSelectionCell } from './UserSelectionCell'
import { UserCustomHeader } from './UserCustomHeader'
import { UserSelectionHeader } from './UserSelectionHeader'
import { User } from '../../core/_models'

const usersColumns: ReadonlyArray<Column<User>> = [
  // id, fullname, username, role, createdAt
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({ ...props }) => <UserSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='#' className='min-w-125px' />,
    accessor: 'id',
    Cell: ({ ...props }) =>  <span>{props.data[props.row.index].id}</span>,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Tài khoản' className='min-w-125px' />,
    accessor: 'fullName',
    Cell: ({ ...props }) => <UserInfoCell user={props.data[props.row.index]} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Tên đăng nhập' className='min-w-125px' />,
    id: 'username',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.auth?.username}</span>,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Loại tài khoản' className='min-w-125px' />,
    id: 'role',
    Cell: ({ ...props }) => <UserRoleCell role={props.data[props.row.index].auth?.role}></UserRoleCell>,
  },
  // {
  //   Header: (props) => (
  //     <UserCustomHeader tableProps={props} title='Two steps' className='min-w-125px' />
  //   ),
  //   id: 'two_steps',
  //   Cell: ({...props}) => <UserTwoStepsCell two_steps={props.data[props.row.index].two_steps} />,
  // },
  // {
  //   Header: (props) => <UserCustomHeader tableProps={props} title='Ngày tạo' className='min-w-125px' />,
  //   accessor: 'createdAt',
  //   Cell: ({ ...props }) => {
  //     const date = new Date(props.data[props.row.index].createdAt)
  //     return <span>{date.toLocaleDateString()}</span>
  //   }
  // },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Tác vụ' className='text-end min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <UserActionsCell id={props.data[props.row.index].id} />,
  },
]

export { usersColumns }
