import { ResultListExportModalForm } from './ResultListExportModalForm'


const ResultListExportModalFormWrapper: React.FC<{onClose: () => void}> = ({onClose}) => {
  return <ResultListExportModalForm onClose={onClose}/>
}

export { ResultListExportModalFormWrapper }
