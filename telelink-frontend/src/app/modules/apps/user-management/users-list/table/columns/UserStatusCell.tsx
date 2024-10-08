import { FC } from 'react'

type Props = {
  status?: number
}

const UserStatusCell: FC<Props> = ({ status }) => {
  let statusLabel = '';
  let badgeClass = '';

  switch (status) {
    case 1:
      statusLabel = 'Đã kích hoạt'
      badgeClass = 'badge badge-light-success'
      break;
    case 0:
      statusLabel = 'Chưa kích hoạt'
      badgeClass = 'badge badge-light-danger'
      break;
    default:
      statusLabel = 'Không rõ';
      badgeClass = 'badge badge-light-secondary';
      break;
  }

  return <div className={badgeClass}>{statusLabel}</div>
}

export { UserStatusCell }
