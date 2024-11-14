import { Column } from 'react-table'
import { UserInfoCell } from './UserInfoCell'
import { UserStatusCell } from './UserStatusCell'
import { UserRoleCell } from './UserRoleCell'
import { UserActionsCell } from './UserActionsCell'
import { UserSelectionCell } from './UserSelectionCell'
import { UserCustomHeader } from './UserCustomHeader'
import { UserSelectionHeader } from './UserSelectionHeader'
import { UsernameCell } from './UsernameCell'
import { User } from '../../core/_models'

const usersColumns: ReadonlyArray<Column<User>> = [
  // id, fullname, username, role, createdAt
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({ ...props }) => <UserSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='#' className='min-w-30px' />,
    accessor: 'id',
    Cell: ({ row }) => <span>{row.index + 1}</span>,
    // Cell: ({ ...props }) => <span>{props.data[props.row.index].id}</span>,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Tài khoản' className='min-w-125px' />,
    accessor: 'fullName',
    Cell: ({ ...props }) => <UserInfoCell user={props.data[props.row.index]} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Tên đăng nhập' className='min-w-125px' />,
    id: 'username',
    // Cell: ({ ...props }) => <span>{props.data[props.row.index]?.auth?.username}</span>,
    Cell: ({ ...props }) => <UsernameCell username={props.data[props.row.index].auth?.username}></UsernameCell>,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Loại tài khoản' className='min-w-125px' />,
    id: 'role',
    Cell: ({ ...props }) => <UserRoleCell role={props.data[props.row.index].auth?.role}></UserRoleCell>,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Liên hệ' className='min-w-125px' />,
    accessor: 'phoneNumber',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.phoneNumber}</span>,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Địa chỉ' className='min-w-200px' />,
    accessor: 'address',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.address}</span>,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Ngày sinh' className='min-w-125px' />,
    accessor: 'dob',
    Cell: ({ ...props }) => {
      const timestamp = props.data[props.row.index].dob;

      if (timestamp) {
        const date = new Date(timestamp);
        return <span>{date.toLocaleDateString('vi-VN')}</span>
      }
      return <span></span>;
    }
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Giới tính' className='min-w-100px' />,
    accessor: 'gender',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.gender === 'male' ? 'Nam' : 'Nữ'}</span>,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Phân loại data' className='min-w-125px' />,
    accessor: 'dataType',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.dataType}</span>,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Chi nhánh' className='min-w-125px' />,
    accessor: 'agency',
    Cell: ({ ...props }) => <span>{props.data[props.row.index].agency?.name}</span>,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Ngày tạo' className='min-w-125px' />,
    accessor: 'createdAt',
    Cell: ({ ...props }) => {
      const timestamp = props.data[props.row.index].createdAt;

      if (timestamp) {
        const date = new Date(timestamp);
        return <span>{date.toLocaleDateString('vi-VN')}</span>
      }
      return <span></span>; // return empty span if `createdAt` is null or undefined
    }
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Trạng thái' className='min-w-125px' />,
    id: 'status',
    Cell: ({ ...props }) => <UserStatusCell status={props.data[props.row.index].auth?.isActive ? 0 : 1}></UserStatusCell>,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Tác vụ' className='text-end min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <UserActionsCell id={props.data[props.row.index].id} />,
  },
]

export { usersColumns }
