import {Column} from 'react-table'
import {DataInfoCell} from './DataInfoCell'
import {UserLastLoginCell} from './UserLastLoginCell'
import {UserTwoStepsCell} from './UserTwoStepsCell'
import {DataActionsCell} from './DataActionsCell'
import {UserSelectionCell} from './UserSelectionCell'
import {DataCustomHeader} from './DataCustomHeader'
import {UserSelectionHeader} from './UserSelectionHeader'
import {Data} from '../../core/_models'

const usersColumns: ReadonlyArray<Column<Data>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <UserSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Nơi cấp data' className='min-w-125px' />
    ),
    accessor: 'dataSrc',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Nhà mạng' className='min-w-125px' />
    ),
    accessor: 'networkName',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Phân loại data' className='min-w-125px' />
    ),
    accessor: 'category',
  },
  {
    Header: (props) => <DataCustomHeader tableProps={props} title='Số thuê bao' className='min-w-125px' />,
    id: 'phoneNum',
    Cell: ({...props}) => <DataInfoCell data={props.data[props.row.index]} />,
  },
  {
    Header: (props) => <DataCustomHeader tableProps={props} title='Gói hiện tại' className='min-w-125px' />,
    accessor: 'currentPack',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Gói tư vấn (ưu tiên 1)' className='min-w-125px' />
    ),
    id: 'last_login',
    // Cell: ({...props}) => <UserLastLoginCell last_login={props.data[props.row.index].last_login} />,
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Gói tư vấn (ưu tiên 2)' className='min-w-125px' />
    ),
    id: 'two_steps',
    // Cell: ({...props}) => <UserTwoStepsCell two_steps={props.data[props.row.index].two_steps} />,
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Ngày đăng ký' className='min-w-125px' />
    ),
    accessor: 'regisDate',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Ngày hết hạn' className='min-w-125px' />
    ),
    accessor: 'expDate',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Ghi chú' className='min-w-125px' />
    ),
    accessor: 'note',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='TKC' className='min-w-125px' />
    ),
    accessor: 'mainAccount',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='APRU 3 tháng' className='min-w-125px' />
    ),
    accessor: 'avg',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Tiêu dùng n-1' className='min-w-125px' />
    ),
    accessor: 'consump_n1',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Tiêu dùng n-2' className='min-w-125px' />
    ),
    accessor: 'consump_n2',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Tiêu dùng n-3' className='min-w-125px' />
    ),
    accessor: 'consump_n3',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Tiêu dùng n-4' className='min-w-125px' />
    ),
    accessor: 'consump_n4',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Gói cước' className='min-w-125px' />
    ),
    accessor: 'consultingPackage',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Tiêu dùng TKC' className='min-w-125px' />
    ),
    accessor: 'mainAcc_consump',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Tiêu dùng thoại' className='min-w-125px' />
    ),
    accessor: 'voice_consump',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Tiêu dùng data' className='min-w-125px' />
    ),
    accessor: 'data_consump',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Dùng data ngoài gói' className='min-w-125px' />
    ),
    accessor: 'outPackage_consump',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Khac 1' className='min-w-125px' />
    ),
    accessor: 'khac1',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Khac 2' className='min-w-125px' />
    ),
    accessor: 'khac2',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Khac 3' className='min-w-125px' />
    ),
    accessor: 'khac3',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Tác vụ' className='text-end min-w-100px' />
    ),
    id: 'actions',
    Cell: ({...props}) => <DataActionsCell id={props.data[props.row.index].id} />,
  },
]

export {usersColumns}
