import { BlacklistEditModalForm } from './BlacklistEditModalForm'


const BlacklistEditModalFormWrapper: React.FC<{onClose: () => void}> = ({onClose}) => {
  return <BlacklistEditModalForm onClose={onClose}/>
}

export { BlacklistEditModalFormWrapper }
