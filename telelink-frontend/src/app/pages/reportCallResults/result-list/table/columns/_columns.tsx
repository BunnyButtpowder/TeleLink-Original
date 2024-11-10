import {Column} from 'react-table'
import {UserInfoCell} from './UserInfoCell'
import {UserLastLoginCell} from './UserLastLoginCell'
import {UserTwoStepsCell} from './UserTwoStepsCell'
import {ResultActionsCell} from './ResultActionsCell'
import {UserSelectionCell} from './UserSelectionCell'
import {UserCustomHeader} from './UserCustomHeader'
import {UserSelectionHeader} from './UserSelectionHeader'
import {Report} from '../../core/_models'

const resultsColumns: ReadonlyArray<Column<Report>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <UserSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Ngày thực hiện' className='min-w-125px' />,
    id: 'occurred_at',
    Cell: ({...props}) => <UserInfoCell customer={props.data[props.row.index]} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Chi nhánh sales' className='min-w-125px' />,
    accessor: 'currentPack',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Họ và tên Sales' className='min-w-125px' />
    ),
    id: 'fullname',
    // Cell: ({...props}) => <UserLastLoginCell last_login={props.data[props.row.index].last_login} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Thời gian' className='min-w-125px' />
    ),
    id: 'two_steps',
    // Cell: ({...props}) => <UserTwoStepsCell two_steps={props.data[props.row.index].two_steps} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Mã KV' className='min-w-125px' />
    ),
    accessor: 'regisDate',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Tên gói cước' className='min-w-125px' />
    ),
    accessor: 'expDate',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Số ĐT' className='min-w-125px' />
    ),
    accessor: 'note',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='SL gói' className='min-w-125px' />
    ),
    accessor: 'mainAccount',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Doanh thu gói' className='min-w-125px' />
    ),
    accessor: 'avg',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Số gói OK' className='min-w-125px' />
    ),
    accessor: 'consump_n1',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Tác vụ' className='text-end min-w-100px' />
    ),
    id: 'actions',
    Cell: ({...props}) => <ResultActionsCell id={props.data[props.row.index].id} />,
  },
]

export {resultsColumns}
