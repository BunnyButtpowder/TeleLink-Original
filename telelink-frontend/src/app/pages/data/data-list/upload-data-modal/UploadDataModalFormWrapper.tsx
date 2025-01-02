import { UploadDataModalForm } from './UploadDataModalForm'


const UploadDataModalFormWrapper: React.FC<{onClose: () => void}> = ({onClose}) => {
  return <UploadDataModalForm onClose={onClose}/>
}

export { UploadDataModalFormWrapper }
