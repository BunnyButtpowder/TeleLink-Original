import { UploadDataModalForm } from './UploadPackageModalForm'


const UploadDataModalFormWrapper: React.FC<{onClose: () => void}> = ({onClose}) => {
  return <UploadDataModalForm onClose={onClose}/>
}

export { UploadDataModalFormWrapper }
