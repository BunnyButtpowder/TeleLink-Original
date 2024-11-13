import {Column} from 'react-table'
import {UserInfoCell} from './UserInfoCell'
import {UserLastLoginCell} from './UserLastLoginCell'
import {ResultCell} from './ResultCell'
import {ResultActionsCell} from './ResultActionsCell'
import {UserSelectionCell} from './UserSelectionCell'
import {ResultCustomHeader} from './ResultCustomHeader'
import {UserSelectionHeader} from './UserSelectionHeader'
import {CallResult} from '../../core/_models'

const resultsColumns: ReadonlyArray<Column<CallResult>> = [
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({...props}) => <UserSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => <ResultCustomHeader tableProps={props} title='#' className='min-w-30px' />,
    accessor: 'id',
    Cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    Header: (props) => <ResultCustomHeader tableProps={props} title='Kết quả' className='min-w-125px' />,
    id: 'role',
    Cell: ({ ...props }) => <ResultCell result={props.data[props.row.index].result}></ResultCell>,
  },
  {
    Header: (props) => <ResultCustomHeader tableProps={props} title='Ngày thực hiện' className='min-w-125px' />,
    id: 'createdAt',
    accessor: 'createdAt',
    Cell: ({ ...props }) => {
      const timestamp = props.data[props.row.index].createdAt;

      if (timestamp) {
        const date = new Date(timestamp);
        return <span>{date.toLocaleDateString('vi-VN')}</span>
      }
      return <span></span>;
    }
  },
  {
    Header: (props) => <ResultCustomHeader tableProps={props} title='Chi nhánh sales' className='min-w-125px' />,
    id: 'agency',
    accessor: 'agency',
  },
  {
    Header: (props) => (
      <ResultCustomHeader tableProps={props} title='Họ và tên Sales' className='min-w-125px' />
    ),
    id: 'saleman',
    accessor: 'saleman',
    // Cell: ({...props}) => <UserLastLoginCell last_login={props.data[props.row.index].last_login} />,
  },
  {
    Header: (props) => (
      <ResultCustomHeader tableProps={props} title='Thời gian' className='min-w-125px' />
    ),
    id: 'updatedAt',
    accessor: 'updatedAt',
    Cell: ({ ...props }) => {
      const timestamp = props.data[props.row.index].updatedAt;

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
      return <span></span>; 
    }
  },
  {
    Header: (props) => (
      <ResultCustomHeader tableProps={props} title='Tên gói cước' className='min-w-125px' />
    ),
    id: 'dataPackage',
    accessor: 'dataPackage',
  },
  {
    Header: (props) => (
      <ResultCustomHeader tableProps={props} title='Số ĐT' className='min-w-125px' />
    ),
    id: 'subscriberNumber',
    accessor: 'subscriberNumber',
  },
  {
    Header: (props) => (
      <ResultCustomHeader tableProps={props} title='Khách hàng' className='min-w-125px' />
    ),
    id: 'customerName',
    accessor: 'customerName',
  },
  {
    Header: (props) => (
      <ResultCustomHeader tableProps={props} title='Địa chỉ' className='min-w-125px' />
    ),
    id: 'address',
    accessor: 'address',
  },
  {
    Header: (props) => (
      <ResultCustomHeader tableProps={props} title='Doanh thu gói' className='min-w-125px' />
    ),
    id: 'revenue',
    accessor: 'revenue',
  },
  {
    Header: (props) => (
      <ResultCustomHeader tableProps={props} title='Ghi chú' className='min-w-125px' />
    ),
    id: 'note',
    accessor: 'note',
  },
  {
    Header: (props) => (
      <ResultCustomHeader tableProps={props} title='Tác vụ' className='text-end min-w-100px' />
    ),
    id: 'actions',
    Cell: ({...props}) => <ResultActionsCell id={props.data[props.row.index].id} />,
  },
]

export {resultsColumns}
