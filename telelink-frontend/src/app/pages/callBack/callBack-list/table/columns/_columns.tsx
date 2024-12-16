import { Column } from 'react-table'
import { UserSelectionCell } from './UserSelectionCell'
import { CallBackCustomHeader } from './CallBackCustomHeader'
import { UserSelectionHeader } from './UserSelectionHeader'
import { Rehandle } from '../../core/_models'
import { ResultCell } from './ResultCell'
import { ActionsCell } from './ActionsCell'

const customersColumns: ReadonlyArray<Column<Rehandle>> = [
  {
    Header: (props) => <CallBackCustomHeader tableProps={props} title='Số thuê bao' className='min-w-125px' />,
    id: 'subscriberNumber',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.data?.subscriberNumber}</span>,
  },
  {
    Header: (props) => <CallBackCustomHeader tableProps={props} title='Khách hàng' className='min-w-125px' />,
    accessor: 'customerName',
  },
  {
    Header: (props) => <CallBackCustomHeader tableProps={props} title='Ngày gọi lại' className='min-w-125px' />,
    accessor: 'dateToCall',
    Cell: ({ ...props }) => {
      const timestamp = props.data[props.row.index]?.dateToCall;

      if (timestamp) {
        const date = new Date(timestamp);
        return <span className='badge badge-danger'>{date.toLocaleDateString('vi-VN')}</span>
      }
      return <span></span>;
    }
  },
  {
    Header: (props) => <CallBackCustomHeader tableProps={props} title='Kết quả gần nhất' className='min-w-125px' />,
    id: 'latestResult',
    Cell: ({ ...props }) => <ResultCell result={props.data[props.row.index].latestResult}></ResultCell>,
  },
  {
    Header: (props) => <CallBackCustomHeader tableProps={props} title='Gói hiện tại' className='min-w-125px' />,
    id: 'currentPackage',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.data?.currentPackage}</span>,
  },
  {
    Header: (props) => (
      <CallBackCustomHeader tableProps={props} title='Gói đặc biệt (ưu tiên 1)' className='min-w-125px' />
    ),
    id: 'priorityPackage1',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.data?.priorityPackage1}</span>,
  },
  {
    Header: (props) => (
      <CallBackCustomHeader tableProps={props} title='Gói cước gán (ưu tiên 2)' className='min-w-125px' />
    ),
    id: 'priorityPackage2',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.data?.priorityPackage2}</span>,
  },
  {
    Header: (props) => <CallBackCustomHeader tableProps={props} title='Ngày đăng ký' className='min-w-125px' />,
    id: 'registrationDate',
    Cell: ({ ...props }) => {
      const timestamp = props.data[props.row.index]?.data?.registrationDate

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
    Header: (props) => <CallBackCustomHeader tableProps={props} title='Ngày hết hạn' className='min-w-125px' />,
    id: 'expirationDate',
    Cell: ({ ...props }) => {
      const timestamp = props.data[props.row.index]?.data?.expirationDate

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
      <CallBackCustomHeader tableProps={props} title='Ghi chú' className='min-w-125px' />
    ),
    accessor: 'note',
  },
  {
    Header: (props) => (
      <CallBackCustomHeader tableProps={props} title='TKC' className='min-w-125px' />
    ),
    id: 'TKC',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.data?.TKC}</span>,
  },
  {
    Header: (props) => (
      <CallBackCustomHeader tableProps={props} title='APRU 3 tháng' className='min-w-125px' />
    ),
    id: 'APRU3Months',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.data?.APRU3Months}</span>,
  },
  {
    Header: (props) => (
      <CallBackCustomHeader tableProps={props} title='Tiêu dùng n-1' className='min-w-125px' />
    ),
    id: 'usageMonth1',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.data?.usageMonth1}</span>,
  },
  {
    Header: (props) => (
      <CallBackCustomHeader tableProps={props} title='Tiêu dùng n-2' className='min-w-125px' />
    ),
    id: 'usageMonth2',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.data?.usageMonth2}</span>,
  },
  {
    Header: (props) => (
      <CallBackCustomHeader tableProps={props} title='Tiêu dùng n-3' className='min-w-125px' />
    ),
    id: 'usageMonth3',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.data?.usageMonth3}</span>,
  },
  {
    Header: (props) => (
      <CallBackCustomHeader tableProps={props} title='Tiêu dùng n-4' className='min-w-125px' />
    ),
    id: 'usageMonth4',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.data?.usageMonth4}</span>,
  },
  {
    Header: (props) => (
      <CallBackCustomHeader tableProps={props} title='Gói cước tư vấn' className='min-w-125px' />
    ),
    id: 'Package',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.data?.Package}</span>,
  },
  {
    Header: (props) => (
      <CallBackCustomHeader tableProps={props} title='Nơi cấp data' className='min-w-125px' />
    ),
    id: 'placeOfIssue',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.data?.placeOfIssue}</span>,
  },
  {
    Header: (props) => (
      <CallBackCustomHeader tableProps={props} title='Tiêu dùng TKC' className='min-w-125px' />
    ),
    id: 'totalTKCUsage',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.data?.totalTKCUsage}</span>,
  },
  {
    Header: (props) => (
      <CallBackCustomHeader tableProps={props} title='Tiêu dùng thoại' className='min-w-125px' />
    ),
    id: 'voiceUsage',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.data?.voiceUsage}</span>,
  },
  {
    Header: (props) => (
      <CallBackCustomHeader tableProps={props} title='Tiêu dùng data' className='min-w-125px' />
    ),
    id: 'dataUsage',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.data?.dataUsage}</span>,
  },
  {
    Header: (props) => (
      <CallBackCustomHeader tableProps={props} title='Dùng data ngoài gói' className='min-w-125px' />
    ),
    id: 'outOfPackageDataUsage',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.data?.outOfPackageDataUsage}</span>,
  },
  {
    Header: (props) => (
      <CallBackCustomHeader tableProps={props} title='Khac 1' className='min-w-125px' />
    ),
    id: 'other1',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.data?.other1}</span>,
  },
  {
    Header: (props) => (
      <CallBackCustomHeader tableProps={props} title='Khac 2' className='min-w-125px' />
    ),
    id: 'other2',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.data?.other2}</span>,
  },
  {
    Header: (props) => (
      <CallBackCustomHeader tableProps={props} title='Khac 3' className='min-w-125px' />
    ),
    id: 'other3',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.data?.other3}</span>,
  },
  {
    Header: (props) => (
      <CallBackCustomHeader tableProps={props} title='Tác vụ' className='text-end min-w-100px' />
    ),
    id: 'actions',
    Cell: ({...props}) => <ActionsCell id={props.data[props.row.index]?.id} />,
  },
]

export { customersColumns }
