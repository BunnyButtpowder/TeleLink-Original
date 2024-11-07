import { DataDistributionModalForm } from './DataDistributionModalForm'

const DataDistributionModalFormWrapper: React.FC<{ onClose: () => void }> = ({ onClose }) => {

  return <DataDistributionModalForm onClose={onClose}/>
}

export { DataDistributionModalFormWrapper }
