import {Column} from 'react-table'
import {DataActionsCell} from './DataActionsCell'
import {UserSelectionCell} from './UserSelectionCell'
import {DataCustomHeader} from './DataCustomHeader'
import {UserSelectionHeader} from './UserSelectionHeader'
import {Data} from '../../core/_models'
import { DataNetworkCell } from './DataNetworkCell'

const usersColumns: ReadonlyArray<Column<Data>> = [
  // {
  //   Header: (props) => <UserSelectionHeader tableProps={props} />,
  //   id: 'selection',
  //   Cell: ({...props}) => <UserSelectionCell id={props.data[props.row.index].id} />,
  // },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Nơi cấp data' className='min-w-125px' />
    ),
    id: 'placeOfIssue',
    accessor: 'placeOfIssue',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Nhà mạng' className='min-w-125px' />
    ),
    id: 'networkName',
    accessor: 'networkName',
    Cell: ({ ...props }) => <DataNetworkCell networkName={props.data[props.row.index].networkName}></DataNetworkCell>,
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Phân loại data' className='min-w-125px' />
    ),
    id: 'category',
    accessor: 'category',
  },
  {
    Header: (props) => <DataCustomHeader tableProps={props} title='Số thuê bao' className='min-w-125px' />,
    id: 'subscriberNumber',
    accessor: 'subscriberNumber',
    // Cell: ({...props}) => <DataInfoCell data={props.data[props.row.index]} />,
  },
  {
    Header: (props) => <DataCustomHeader tableProps={props} title='Gói hiện tại' className='min-w-125px' />,
    id: 'currentPackage',
    accessor: 'currentPackage',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Gói tư vấn (ưu tiên 1)' className='min-w-125px' />
    ),
    id: 'priorityPackage1',
    accessor: 'priorityPackage1',
    // Cell: ({...props}) => <UserLastLoginCell last_login={props.data[props.row.index].last_login} />,
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Gói tư vấn (ưu tiên 2)' className='min-w-125px' />
    ),
    id: 'priorityPackage2',
    accessor: 'priorityPackage2',
    // Cell: ({...props}) => <UserTwoStepsCell two_steps={props.data[props.row.index].two_steps} />,
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Ngày đăng ký' className='min-w-125px' />
    ),
    id: 'registrationDate',
    accessor: 'registrationDate',
    Cell: ({...props}) => {
      const timestamp = props.data[props.row.index].registrationDate

      if (timestamp) {
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        return <span>{formattedDate}</span>
      }
      return <span></span> // return empty span if `registrationDate` is null or undefined
    }
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Ngày hết hạn' className='min-w-125px' />
    ),
    id: 'expirationDate',
    accessor: 'expirationDate',
    Cell: ({...props}) => {
      const timestamp = props.data[props.row.index].expirationDate

      if (timestamp) {
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        return <span>{formattedDate}</span>
      }
      return <span></span> // return empty span if `registrationDate` is null or undefined
    }
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Ghi chú' className='min-w-125px' />
    ),
    id: 'notes',
    accessor: 'notes',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='TKC' className='min-w-125px' />
    ),
    id: 'TKC',
    accessor: 'TKC',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='APRU 3 tháng' className='min-w-125px' />
    ),
    id: 'ARPU3Months',
    accessor: 'ARPU3Months',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Tiêu dùng n-1' className='min-w-125px' />
    ),
    id: 'usageMonth1',
    accessor: 'usageMonth1',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Tiêu dùng n-2' className='min-w-125px' />
    ),
    id: 'usageMonth2',
    accessor: 'usageMonth2',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Tiêu dùng n-3' className='min-w-125px' />
    ),
    id: 'usageMonth3',
    accessor: 'usageMonth3',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Tiêu dùng n-4' className='min-w-125px' />
    ),
    id: 'usageMonth4',
    accessor: 'usageMonth4',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Gói cước' className='min-w-200px' />
    ),
    id: 'Package',
    accessor: 'Package',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Tiêu dùng TKC' className='min-w-125px' />
    ),
    id: 'totalTKCUsage',
    accessor: 'totalTKCUsage',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Tiêu dùng thoại' className='min-w-125px' />
    ),
    id: 'voiceUsage',
    accessor: 'voiceUsage',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Tiêu dùng data' className='min-w-125px' />
    ),
    id: 'dataUsage',
    accessor: 'dataUsage',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Dùng data ngoài gói' className='min-w-125px' />
    ),
    id: 'outOfPackageDataUsage',
    accessor: 'outOfPackageDataUsage',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Khac 1' className='min-w-125px' />
    ),
    id: 'other1',
    accessor: 'other1',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Khac 2' className='min-w-125px' />
    ),
    id: 'other2',
    accessor: 'other2',
  },
  {
    Header: (props) => (
      <DataCustomHeader tableProps={props} title='Khac 3' className='min-w-125px' />
    ),
    id: 'other3',
    accessor: 'other3',
  },
  // {
  //   Header: (props) => (
  //     <DataCustomHeader tableProps={props} title='Tác vụ' className='text-end min-w-100px' />
  //   ),
  //   id: 'actions',
  //   Cell: ({...props}) => <DataActionsCell id={props.data[props.row.index].id} />,
  // },
]

export {usersColumns}
