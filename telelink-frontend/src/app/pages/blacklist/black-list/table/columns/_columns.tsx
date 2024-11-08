import {Column} from 'react-table'
import {BlacklistActionsCell} from './BlacklistActionsCell'
import {UserSelectionCell} from './UserSelectionCell'
import {BlacklistCustomHeader} from './BlacklistCustomHeader'
import {UserSelectionHeader} from './UserSelectionHeader'
import {Blacklist} from '../../core/_models'


const usersColumns: ReadonlyArray<Column<Blacklist>> = [

  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({ ...props }) => <UserSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => <BlacklistCustomHeader tableProps={props} title='#' className='min-w-30px' />,
    accessor: 'id',
    Cell: ({ ...props }) => <span>{props.data[props.row.index].id}</span>,
  },
  {
    Header: (props) => (
      <BlacklistCustomHeader tableProps={props} title='Số bị chặn' className='min-w-125px' />
    ),
    accessor: 'SDT',
  },
  {
    Header: (props) => (
      <BlacklistCustomHeader tableProps={props} title='Ghi chú' className='min-w-125px' />
    ),
    accessor: 'note',
  },
  {
    Header: (props) => (
      <BlacklistCustomHeader tableProps={props} title='Ngày thêm' className='min-w-125px' />
    ),
    accessor: 'createdAt',
    Cell: ({...props}) => {
      const timestamp = props.data[props.row.index].createdAt

      if (timestamp) {
        const date = new Date(timestamp)
        return <span>{date.toLocaleDateString('vi-VN')}</span>
      }
      return <span></span> // return empty span if `registrationDate` is null or undefined
    }
  },

  {
    Header: (props) => (
      <BlacklistCustomHeader tableProps={props} title='Người thêm' className='min-w-125px' />
    ),
    accessor: 'user',
    Cell: ({...props}) => {
      const user = props.data[props.row.index].user
      return <span>{user?.fullName || ''}</span> // Display full name if available, otherwise empty
    },
  },

  {
    Header: (props) => (
      <BlacklistCustomHeader tableProps={props} title='Tác vụ' className='text-end min-w-100px' />
    ),
    id: 'actions',
    Cell: ({...props}) => <BlacklistActionsCell id={props.data[props.row.index].id} />,
  },
]

export {usersColumns}
