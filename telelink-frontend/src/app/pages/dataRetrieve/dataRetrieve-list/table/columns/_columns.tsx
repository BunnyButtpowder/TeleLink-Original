import { Column } from 'react-table'
import { UserInfoCell } from './UserInfoCell'
import { UserLastLoginCell } from './UserLastLoginCell'
import { UserTwoStepsCell } from './UserTwoStepsCell'
import { UserSelectionCell } from './UserSelectionCell'
import { CustomerCustomHeader } from './CustomerCustomHeader'
import { UserSelectionHeader } from './UserSelectionHeader'
import { Customer } from '../../core/_models'

const customersColumns: ReadonlyArray<Column<Customer>> = [
  {
    Header: (props) => <CustomerCustomHeader tableProps={props} title='Số thuê bao' className='min-w-125px' />,
    accessor: 'subscriberNumber',
  },
  {
    Header: (props) => <CustomerCustomHeader tableProps={props} title='Gói hiện tại' className='min-w-125px' />,
    accessor: 'currentPackage',
  },
  {
    Header: (props) => (
      <CustomerCustomHeader tableProps={props} title='Gói đặc biệt (ưu tiên 1)' className='min-w-125px' />
    ),
    accessor: 'priorityPackage1',
    // Cell: ({...props}) => <UserLastLoginCell last_login={props.data[props.row.index].last_login} />,
  },
  {
    Header: (props) => (
      <CustomerCustomHeader tableProps={props} title='Gói cước gán (ưu tiên 2)' className='min-w-125px' />
    ),
    accessor: 'priorityPackage2',
  },
  {
    Header: (props) => <CustomerCustomHeader tableProps={props} title='Ngày đăng ký' className='min-w-125px' />,
    accessor: 'registrationDate',
    Cell: ({ ...props }) => {
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
      return <span></span>
    }
  },
  {
    Header: (props) => <CustomerCustomHeader tableProps={props} title='Ngày hết hạn' className='min-w-125px' />,
    accessor: 'expirationDate',
    Cell: ({ ...props }) => {
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
      return <span></span>
    }
  },
  {
    Header: (props) => (
      <CustomerCustomHeader tableProps={props} title='Ghi chú' className='min-w-125px' />
    ),
    accessor: 'notes',
  },
  {
    Header: (props) => (
      <CustomerCustomHeader tableProps={props} title='TKC' className='min-w-125px' />
    ),
    accessor: 'TKC',
  },
  {
    Header: (props) => (
      <CustomerCustomHeader tableProps={props} title='APRU 3 tháng' className='min-w-125px' />
    ),
    accessor: 'APRU3Months',
  },
  {
    Header: (props) => (
      <CustomerCustomHeader tableProps={props} title='Tiêu dùng n-1' className='min-w-125px' />
    ),
    accessor: 'usageMonth1',
  },
  {
    Header: (props) => (
      <CustomerCustomHeader tableProps={props} title='Tiêu dùng n-2' className='min-w-125px' />
    ),
    accessor: 'usageMonth2',
  },
  {
    Header: (props) => (
      <CustomerCustomHeader tableProps={props} title='Tiêu dùng n-3' className='min-w-125px' />
    ),
    accessor: 'usageMonth3',
  },
  {
    Header: (props) => (
      <CustomerCustomHeader tableProps={props} title='Tiêu dùng n-4' className='min-w-125px' />
    ),
    accessor: 'usageMonth4',
  },
  {
    Header: (props) => (
      <CustomerCustomHeader tableProps={props} title='Gói cước tư vấn' className='min-w-125px' />
    ),
    accessor: 'Package',
  },
  {
    Header: (props) => (
      <CustomerCustomHeader tableProps={props} title='Nơi cấp data' className='min-w-125px' />
    ),
    accessor: 'placeOfIssue',
  },
  {
    Header: (props) => (
      <CustomerCustomHeader tableProps={props} title='Tiêu dùng TKC' className='min-w-125px' />
    ),
    accessor: 'totalTKCUsage',
  },
  {
    Header: (props) => (
      <CustomerCustomHeader tableProps={props} title='Tiêu dùng thoại' className='min-w-125px' />
    ),
    accessor: 'voiceUsage',
  },
  {
    Header: (props) => (
      <CustomerCustomHeader tableProps={props} title='Tiêu dùng data' className='min-w-125px' />
    ),
    accessor: 'dataUsage',
  },
  {
    Header: (props) => (
      <CustomerCustomHeader tableProps={props} title='Dùng data ngoài gói' className='min-w-125px' />
    ),
    accessor: 'outOfPackageDataUsage',
  },
  {
    Header: (props) => (
      <CustomerCustomHeader tableProps={props} title='Khac 1' className='min-w-125px' />
    ),
    accessor: 'other1',
  },
  {
    Header: (props) => (
      <CustomerCustomHeader tableProps={props} title='Khac 2' className='min-w-125px' />
    ),
    accessor: 'other2',
  },
  {
    Header: (props) => (
      <CustomerCustomHeader tableProps={props} title='Khac 3' className='min-w-125px' />
    ),
    accessor: 'other3',
  }
]

export { customersColumns }
