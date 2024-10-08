import {FC} from 'react'

type Props = {
  role?: number
}

const UserRoleCell: FC<Props> = ({role}) => {
  let roleLabel = '';
  let badgeClass = '';
  
  switch(role) {
    case 1: // Admin role is red
      roleLabel = 'Admin'
      badgeClass = 'badge badge-light-danger'
      break;
    case 2: // Agency role is yellow
      roleLabel = 'Chi nhánh'
      badgeClass = 'badge badge-light-warning'
      break;
    case 3: // Salesman role is green
      roleLabel = 'Salesman'
      badgeClass = 'badge badge-light-success'
      break;
    default: // Undefined role is grey
      roleLabel = 'Unknown'
      badgeClass = 'badge badge-light-secondary'
      break;
  }

  return <div className={badgeClass}>{roleLabel}</div>
}

export {UserRoleCell}
