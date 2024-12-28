import { FC } from 'react'

type Props = {
  result?: number
}

const ResultCell: FC<Props> = ({ result }) => {
  let resultLabel = '';
  let badgeClass = '';

  switch (result) {
    case 1: // Đồng ý
      resultLabel = 'Đồng ý'
      badgeClass = 'badge badge-success'
      break;
    case 2: // Không đồng ý
      resultLabel = 'Không đồng ý'
      badgeClass = 'badge badge-danger'
      break;
    case 3: // Từ chối cuộc gọi
      resultLabel = 'Từ chối cuộc gọi'
      badgeClass = 'badge badge-warning'
      break;
    case 4: // Không liên lạc được
      resultLabel = 'Không liên lạc được'
      badgeClass = 'badge badge-warning'
      break;
    case 5: // Hẹn gọi lại sau
      resultLabel = 'Hẹn gọi lại sau'
      badgeClass = 'badge badge-warning'
      break;
    case 6: // Đang tư vấn
      resultLabel = 'Đang tư vấn'
      badgeClass = 'badge badge-warning'
      break;
    case 7: // Chờ nạp thẻ, Ckhoan
      resultLabel = 'Chờ nạp thẻ, chuyển khoản'
      badgeClass = 'badge badge-warning'
      break;
    case 8: // Mất đơn
      resultLabel = 'Mất đơn'
      badgeClass = 'badge badge-dark'
      break;
    default: // Undefined role - grey
      resultLabel = 'Unknown'
      badgeClass = 'badge badge-light-secondary'
      break;
  }

  return <div className={badgeClass}>{resultLabel}</div>
}

export { ResultCell }
