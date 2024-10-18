import { FC } from 'react'

type Props = {
    networkName?: string
}

const DataNetworkCell: FC<Props> = ({ networkName }) => {
    let networkLabel = '';
    let badgeClass = '';

    switch (networkName) {
        case 'Viettel': // Viettel - red
            networkLabel = 'Viettel'
            badgeClass = 'badge badge-light-danger'
            break;
        case 'Vinaphone': // Vinaphone - blue
            networkLabel = 'Vinaphone'
            badgeClass = 'badge badge-light-primary'
            break;
        default: // Undefined network name - grey
            networkLabel = 'Unknown'
            badgeClass = 'badge badge-light-secondary'
            break;
    }

    return <div className={badgeClass}>{networkLabel}</div>
}

export { DataNetworkCell }
