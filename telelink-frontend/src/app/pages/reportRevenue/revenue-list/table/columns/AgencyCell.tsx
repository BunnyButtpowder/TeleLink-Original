import {FC} from 'react'

type Props = {
  agency?: string
}

const AgencyCell: FC<Props> = ({agency}) => (
  <div className='badge badge-warning fw-bolder'>{agency}</div>
)

export {AgencyCell}
