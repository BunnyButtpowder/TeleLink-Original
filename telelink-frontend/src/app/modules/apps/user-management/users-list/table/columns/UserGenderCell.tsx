import { FC } from 'react'

type Props = {
  gender?: string
}

const UserGenderCell: FC<Props> = ({ gender }) => {
  let genderLabel = '';

  switch (gender) {
    case 'male':
      genderLabel = 'Nam'
      break;
    case 'female':
      genderLabel = 'Nữ'
      break;
    case 'other':
      genderLabel = 'Khác'
      break;
    default:
      genderLabel = '';
      break;
  }

  return <div>{genderLabel}</div>
}

export { UserGenderCell }
