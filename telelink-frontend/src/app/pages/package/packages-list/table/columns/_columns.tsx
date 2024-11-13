import { Column } from 'react-table'
import { ProviderCell } from './ProviderCell'
import { UserActionsCell } from './UserActionsCell'
import { UserSelectionCell } from './UserSelectionCell'
import { PackageCustomHeader } from './PackageCustomHeader'
import { UserSelectionHeader } from './UserSelectionHeader'
import { Package } from '../../core/_models'

const usersColumns: ReadonlyArray<Column<Package>> = [
  // id, fullname, username, role, createdAt
  {
    Header: (props) => <UserSelectionHeader tableProps={props} />,
    id: 'selection',
    Cell: ({ ...props }) => <UserSelectionCell id={props.data[props.row.index].id} />,
  },
  {
    Header: (props) => <PackageCustomHeader tableProps={props} title='#' className='min-w-30px' />,
    accessor: 'id',
    Cell: ({ row }) => <span>{row.index + 1}</span>,
    // Cell: ({ ...props }) => <span>{props.data[props.row.index].id}</span>,
  },
  {
    Header: (props) => <PackageCustomHeader tableProps={props} title='Mã số' className='min-w-125px' />,
    accessor: 'code',
    Cell: ({ ...props }) => <span>{props.data[props.row.index].code}</span>,
  },
  {
    Header: (props) => <PackageCustomHeader tableProps={props} title='Mã gói' className='min-w-125px' />,
    id: 'title',
    // Cell: ({ ...props }) => <span>{props.data[props.row.index]?.auth?.username}</span>,
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.title}</span>,
  },
  {
    Header: (props) => <PackageCustomHeader tableProps={props} title='Nhà mạng' className='min-w-125px' />,
    id: 'provider',
    Cell: ({ ...props }) => <ProviderCell provider={props.data[props.row.index].provider}></ProviderCell>,
  },
  {
    Header: (props) => <PackageCustomHeader tableProps={props} title='Loại thuê bao' className='min-w-125px' />,
    accessor: 'type',
    Cell: ({ ...props }) => <span>{props.data[props.row.index]?.type}</span>,
  },
  {
    Header: (props) => <PackageCustomHeader tableProps={props} title='Đơn giá' className='min-w-200px' />,
    accessor: 'price',
    Cell: ({ ...props }) => {
      const price = props.data[props.row.index].price;
      const formattedPrice = price !== undefined ? new Intl.NumberFormat('vi-VN').format(price) : '';
      return <span>{formattedPrice}</span>;
    },
  },
  {
    Header: (props) => <PackageCustomHeader tableProps={props} title='Thời điểm tạo' className='min-w-125px' />,
    accessor: 'createdAt',
    Cell: ({ ...props }) => {
      const timestamp = props.data[props.row.index].createdAt;

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
      <PackageCustomHeader tableProps={props} title='Tác vụ' className='text-end min-w-100px' />
    ),
    id: 'actions',
    Cell: ({ ...props }) => <UserActionsCell id={props.data[props.row.index].id} />,
  },
]

export { usersColumns }
