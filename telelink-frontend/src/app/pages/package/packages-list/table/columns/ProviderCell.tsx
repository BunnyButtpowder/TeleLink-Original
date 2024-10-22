import { FC } from 'react'

type Props = {
  provider?: string
}

const ProviderCell: FC<Props> = ({ provider }) => {
  let providerLabel = '';
  let badgeClass = '';

  switch (provider) {
    case 'Viettel': // Viettel - red
      providerLabel = 'Viettel'
      badgeClass = 'badge badge-light-danger'
      break;
    case 'Vinaphone': // Vinaphone - blue
      providerLabel = 'Vinaphone'
      badgeClass = 'badge badge-light-primary'
      break;
    default: // Undefined network name - grey
      providerLabel = 'Unknown'
      badgeClass = 'badge badge-light-secondary'
      break;
  }

  return <div className={badgeClass}>{providerLabel}</div>
}

export { ProviderCell }
