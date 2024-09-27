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
    Header: (props) => <UserCustomHeader tableProps={props} title='Số thuê bao' className='min-w-125px' />,
    id: 'phoneNum',
    Cell: ({...props}) => <UserInfoCell user={props.data[props.row.index]} />,
  },
  {
    Header: (props) => <UserCustomHeader tableProps={props} title='Gói hiện tại' className='min-w-125px' />,
    accessor: 'currentPack',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Gói đặc biệt (ưu tiên 1)' className='min-w-125px' />
    ),
    id: 'last_login',
    Cell: ({...props}) => <UserLastLoginCell last_login={props.data[props.row.index].last_login} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Gói cước gán (ưu tiên 2)' className='min-w-125px' />
    ),
    id: 'two_steps',
    Cell: ({...props}) => <UserTwoStepsCell two_steps={props.data[props.row.index].two_steps} />,
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Ngày đăng ký' className='min-w-125px' />
    ),
    accessor: 'regisDate',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Ngày hết hạn' className='min-w-125px' />
    ),
    accessor: 'expDate',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Ghi chú' className='min-w-125px' />
    ),
    accessor: 'note',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='TKC' className='min-w-125px' />
    ),
    accessor: 'mainAccount',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='APRU 3 tháng' className='min-w-125px' />
    ),
    accessor: 'avg',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Tiêu dùng n-1' className='min-w-125px' />
    ),
    accessor: 'consump_n1',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Tiêu dùng n-2' className='min-w-125px' />
    ),
    accessor: 'consump_n2',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Tiêu dùng n-3' className='min-w-125px' />
    ),
    accessor: 'consump_n3',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Nơi cấp data' className='min-w-125px' />
    ),
    accessor: 'dataSrc',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Tiêu dùng TKC' className='min-w-125px' />
    ),
    accessor: 'mainAcc_consump',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Tiêu dùng thoại' className='min-w-125px' />
    ),
    accessor: 'voice_consump',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Tiêu dùng data' className='min-w-125px' />
    ),
    accessor: 'data_consump',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Dùng data ngoài gói' className='min-w-125px' />
    ),
    accessor: 'outPackage_consump',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Khac 1' className='min-w-125px' />
    ),
    accessor: 'khac1',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Khac 2' className='min-w-125px' />
    ),
    accessor: 'khac2',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Khac 3' className='min-w-125px' />
    ),
    accessor: 'khac3',
  },
  {
    Header: (props) => (
      <UserCustomHeader tableProps={props} title='Actions' className='text-end min-w-100px' />
    ),
    id: 'actions',
    Cell: ({...props}) => <UserActionsCell id={props.data[props.row.index].id} />,
  },
]

export {usersColumns}
