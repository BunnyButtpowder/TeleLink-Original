import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {BlackListHeader} from './components/header/BlackListHeader'
import {BlackListTable} from './table/BlackListTable'
import {KTCard} from '../../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../_metronic/layout/components/content'
import { useState } from 'react'
import { Blacklist } from './core/_models'
import { ToastContainer } from 'react-toastify' // Import ToastContainer
import {UserEditModal} from './components/blacklist-edit-modal/BlackListEditModal'
import 'react-toastify/dist/ReactToastify.css'

const BlackList = () => {
  const {itemIdForUpdate} = useListView()
  const [tableData, setTableData] = useState<Blacklist[]>([]); // Manage table data.

  const handleUploadComplete = (uploadedData: Blacklist[]) => {
    setTableData(uploadedData);
  };

  return (
    <>
      <KTCard>
        <BlackListHeader onUploadComplete = {handleUploadComplete}/>
        <BlackListTable/>
      </KTCard>
      {itemIdForUpdate !== undefined && <UserEditModal />}
      <ToastContainer />
    </>
  )
}

const BlackListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ToolbarWrapper />
        <Content>
          <BlackList />
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {BlackListWrapper}
