import {Column} from 'react-table'
import {UserInfoCell} from './UserInfoCell'
import {UserLastLoginCell} from './UserLastLoginCell'
import {UserTwoStepsCell} from './UserTwoStepsCell'
import {UserActionsCell} from './UserActionsCell'
import {UserSelectionCell} from './UserSelectionCell'
import {UserCustomHeader} from './UserCustomHeader'
import {UserSelectionHeader} from './UserSelectionHeader'
import {Revenue} from '../../core/_models'

const revenueColumns: ReadonlyArray<Column<Revenue>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <UserSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='#' className='min-w-40px' />,
    id: 'id',
    Cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Chi nhánh' className='min-w-125px' />,
    id: 'agency',
    accessor: 'agency',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Tổng đơn hàng' className='min-w-125px' />
    ),
    id: 'revenue',
    Cell: ({...props}) => <span>{props.data[props.row.index]?.report?.revenue}</span>,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Đồng ý' className='min-w-100px' />
    ),
    id: 'accept',
    Cell: ({...props}) => <span>{props.data[props.row.index]?.report?.accept}</span>,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Không đồng ý' className='min-w-125px' />
    ),
    id: 'reject',
    Cell: ({...props}) => <span>{props.data[props.row.index]?.report?.reject}</span>,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Không bắt máy' className='min-w-125px' />
    ),
    id: 'unanswered',
    Cell: ({...props}) => <span>{props.data[props.row.index]?.report?.unanswered}</span>,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Không liên lạc được' className='min-w-200px' />
    ),
    id: 'unreachable',
    Cell: ({...props}) => <span>{props.data[props.row.index]?.report?.unreachable}</span>,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Đồng ý xử lý lại' className='min-w-150px' />
    ),
    id: 'rehandle',
    Cell: ({...props}) => <span>{props.data[props.row.index]?.report?.rehandle}</span>,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Mất đơn' className='min-w-125px' />
    ),
    id: 'lost',
    Cell: ({...props}) => <span>{props.data[props.row.index]?.report?.lost}</span>,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Tỷ lệ thành công' className='min-w-125px' />
    ),
    id: 'successRate',
    Cell: ({...props}) => <span>{props.data[props.row.index]?.report?.successRate}</span>,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Tỷ lệ không thành công' className='min-w-125px' />
    ),
    id: 'failRate',
    Cell: ({...props}) => <span>{props.data[props.row.index]?.report?.failRate}</span>,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Tác vụ' className='text-end min-w-100px' />
    ),
    id: 'actions',
    Cell: ({...props}) => <UserActionsCell id={props.data[props.row.index].id} />,
  },
]

export {revenueColumns}
