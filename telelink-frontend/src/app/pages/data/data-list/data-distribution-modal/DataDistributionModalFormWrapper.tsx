import { useQuery } from 'react-query'
import { DataDistributionModalForm } from './DataDistributionModalForm'
import { isNotEmpty, QUERIES } from '../../../../../_metronic/helpers'
import { useListView } from '../core/ListViewProvider'
import { getUserById } from '../core/_requests'
import { initialData } from '../core/_models'
import { useEffect } from 'react'

const DataDistributionModalFormWrapper: React.FC<{ onClose: () => void }> = ({ onClose }) => {

  return <DataDistributionModalForm onClose={onClose}/>
}

export { DataDistributionModalFormWrapper }
