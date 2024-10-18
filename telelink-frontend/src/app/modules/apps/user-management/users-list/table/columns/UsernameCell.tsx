import { FC } from 'react'

type Props = {
  username?: string
}

const UsernameCell: FC<Props> = ({ username }) => {
  return <div className='badge badge-light fs-7'>{username}</div>
}

export { UsernameCell }
