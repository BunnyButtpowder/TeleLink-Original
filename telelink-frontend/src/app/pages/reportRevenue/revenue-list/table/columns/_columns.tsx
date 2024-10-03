import {Column} from 'react-table'
import {UserInfoCell} from './UserInfoCell'
import {UserLastLoginCell} from './UserLastLoginCell'
import {UserTwoStepsCell} from './UserTwoStepsCell'
import {UserActionsCell} from './UserActionsCell'
import {UserSelectionCell} from './UserSelectionCell'
import {UserCustomHeader} from './UserCustomHeader'
import {UserSelectionHeader} from './UserSelectionHeader'
import {Customer} from '../../core/_models'

const usersColumns: ReadonlyArray<Column<Customer>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <UserSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='#' className='min-w-125px' />,
    id: 'id',
    Cell: ({...props}) => <UserInfoCell customer={props.data[props.row.index]} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Chi nhánh' className='min-w-125px' />,
    accessor: 'currentPack',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Mã khu vực cấp data' className='min-w-125px' />
    ),
    id: 'last_login',
    // Cell: ({...props}) => <UserLastLoginCell last_login={props.data[props.row.index].last_login} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Tổng đơn hàng' className='min-w-125px' />
    ),
    id: 'two_steps',
    // Cell: ({...props}) => <UserTwoStepsCell two_steps={props.data[props.row.index].two_steps} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Đồng ý' className='min-w-125px' />
    ),
    accessor: 'regisDate',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Không đồng ý' className='min-w-125px' />
    ),
    accessor: 'expDate',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Không bắt máy' className='min-w-125px' />
    ),
    accessor: 'note',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Không liên lạc được' className='min-w-125px' />
    ),
    accessor: 'mainAccount',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Đồng ý xử lý lại' className='min-w-125px' />
    ),
    accessor: 'avg',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Tổng Thành công' className='min-w-125px' />
    ),
    accessor: 'consump_n1',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Tỷ lệ thành công' className='min-w-125px' />
    ),
    accessor: 'consump_n2',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Tổng không thành công' className='min-w-125px' />
    ),
    accessor: 'consump_n3',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Tỷ lệ không thành công' className='min-w-125px' />
    ),
    accessor: 'dataSrc',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Tác vụ' className='text-end min-w-100px' />
    ),
    id: 'actions',
    Cell: ({...props}) => <UserActionsCell id={props.data[props.row.index].id} />,
  },
]

export {usersColumns}
