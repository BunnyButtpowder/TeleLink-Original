import {AddReportModalForm} from './AddReportModalForm'

const AddReportModalFormWrapper: React.FC<{onClose: () => void}> = ({onClose}) => {
  return <AddReportModalForm onClose={onClose}/>
}

export {AddReportModalFormWrapper}
