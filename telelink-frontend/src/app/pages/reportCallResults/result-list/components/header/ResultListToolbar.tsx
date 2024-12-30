import { KTIcon } from '../../../../../../_metronic/helpers'
import { useListView } from '../../core/ListViewProvider'
import { ResultListFilter } from './ResultListFilter'
import { useIntl } from 'react-intl'
import {useState} from 'react'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify'
import { ResultListExportModal } from '../../result-export-modal/ResultListExportModal'
import { close } from 'node:inspector'

const ResultListToolbar = () => {
  const intl = useIntl()
  const [isResultExportModalOpen, setResultExportModalOpen] = useState(false)
  const { setItemIdForUpdate } = useListView()
  const openAddUserModal = () => {
    setItemIdForUpdate(null)
  }

  const openResultExportModal = () => {
    setResultExportModalOpen(true);
  }

  const closeResultExportModal = () => {
    setResultExportModalOpen(false);
  }


  return (
    <>
      <ToastContainer />
      <div className='d-flex justify-content-end' data-kt-user-table-toolbar='base'>
        <ResultListFilter />
        <button
        type="button"
        className="btn btn-info me-3"
        onClick={openResultExportModal}
      >
        <KTIcon iconName="folder-up" className="fs-2" />
        Xuất báo cáo 
      </button>
      </div>
      {isResultExportModalOpen && <ResultListExportModal onClose={closeResultExportModal} />}
    </>

  )
}

export { ResultListToolbar }
