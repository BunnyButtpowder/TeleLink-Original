import { DeleteManyModalForm } from './DeleteManyModalForm'


const DeleteManyModalFormWrapper: React.FC<{onClose: () => void}> = ({onClose}) => {
  return <DeleteManyModalForm onClose={onClose}/>
}

export { DeleteManyModalFormWrapper }
