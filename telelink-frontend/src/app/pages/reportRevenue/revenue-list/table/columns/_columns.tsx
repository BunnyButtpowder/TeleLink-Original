import { Column } from 'react-table'
import { AgencyCell } from './AgencyCell'
import { RevenueActionsCell } from './RevenueActionsCell'
import { RevenueSelectionCell } from './RevenueSelectionCell'
import { ResultCustomHeader } from './ResultCustomHeader'
import { RevenueSelectionHeader } from './ResultSelectionHeader'
import { Revenue } from '../../core/_models'

const revenueColumns: ReadonlyArray<Column<Revenue>> = [
  // {
  //   Header: (props) => <RevenueSelectionHeader tableProps={props} />,
  //   id: 'selection',
  //   Cell: ({ ...props }) => <RevenueSelectionCell id={props.data[props.row.index].id} />,
  // },
  {
    Header: (props) => <ResultCustomHeader tableProps={props} title='#' className='min-w-40px' />,
    id: 'id',
    Cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    Header: (props) => <ResultCustomHeader tableProps={props} title='Chi nhánh' className='min-w-125px' />,
    id: 'agency',
    // accessor: 'agency',
    Cell: ({...props}) => <AgencyCell agency={props.data[props.row.index]?.agency?.name} />,
  },
  {
    Header: (props) => (
      <ResultCustomHeader tableProps={props} title='Thời gian cập nhật cuối' className='min-w-125px' />
    ),
    id: 'updatedAt',
    accessor: 'updatedAt',
    Cell: ({ ...props }) => {
      const timestamp = props.data[props.row.index].updatedAt;
  
      if (timestamp) {
        // Convert to milliseconds if the timestamp is in seconds
        const adjustedTimestamp = timestamp.toString().length === 10 ? timestamp * 1000 : timestamp;
  
        const date = new Date(adjustedTimestamp);
        const formattedDate = date.toLocaleString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false, // Use 24-hour format
        });
        return <span>{formattedDate}</span>;
      }
      return <span></span>;
    }
  }
  ,
  {
    Header: (props) => (
      <ResultCustomHeader tableProps={props} title='Tổng đơn hàng' className='min-w-125px' />
    ),
    id: 'revenue',
    Cell: ({ ...props }) => {
      const revenue = props.data[props.row.index]?.revenue;
      const formattedPrice = revenue !== undefined ? new Intl.NumberFormat('vi-VN').format(revenue) : '';
      return <span>{formattedPrice}</span>;
    },
  },
  {
    Header: (props) => (
      <ResultCustomHeader tableProps={props} title='Đồng ý' className='min-w-100px' />
    ),
    id: 'accept',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.accept}</span>,
  },
  {
    Header: (props) => (
      <ResultCustomHeader tableProps={props} title='Không đồng ý' className='min-w-125px' />
    ),
    id: 'reject',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.reject}</span>,
  },
  {
    Header: (props) => (
      <ResultCustomHeader tableProps={props} title='Không bắt máy' className='min-w-125px' />
    ),
    id: 'unanswered',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.unanswered}</span>,
  },
  {
    Header: (props) => (
      <ResultCustomHeader tableProps={props} title='Không liên lạc được' className='min-w-200px' />
    ),
    id: 'unavailable',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.unavailable}</span>,
  },
  {
    Header: (props) => (
      <ResultCustomHeader tableProps={props} title='Xử lý lại' className='min-w-150px' />
    ),
    id: 'rehandle',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.rehandle}</span>,
  },
  {
    Header: (props) => (
      <ResultCustomHeader tableProps={props} title='Mất đơn' className='min-w-125px' />
    ),
    id: 'lost',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.lost}</span>,
  },
  {
    Header: (props) => (
      <ResultCustomHeader tableProps={props} title='Tỷ lệ thành công' className='min-w-125px' />
    ),
    id: 'successRate',
    // Cell: ({ ...props }) => <span>{props.data[props.row.index]?.report?.successRate} %</span>,
    Cell: ({ ...props }) => {
      const report = props.data[props.row.index];
      console.log('Report Data:', report);
      const successRate = report?.successRate ?? 0;
      return <div className='badge badge-success fw-bolder'>{successRate.toFixed(2)}%</div>
    },
  },
  {
    Header: (props) => (
      <ResultCustomHeader tableProps={props} title='Tỷ lệ không thành công' className='min-w-125px' />
    ),
    id: 'failRate',
    // Cell: ({ ...props }) => <span>{props.data[props.row.index]?.report?.failRate} %</span>,
    Cell: ({ ...props }) => {
      const report = props.data[props.row.index];
      console.log('Report Data:', report);
      const failRate = report?.failRate ?? 0;
      return <div className='badge badge-danger fw-bolder'>{failRate.toFixed(2)}%</div>
    },
  },
  // {
  //   Header: (props) => (
  //     <ResultCustomHeader tableProps={props} title='Tác vụ' className='text-end min-w-100px' />
  //   ),
  //   id: 'actions',
  //   Cell: ({...props}) => <UserActionsCell id={props.data[props.row.index].id} />,
  // },
]

export { revenueColumns }
