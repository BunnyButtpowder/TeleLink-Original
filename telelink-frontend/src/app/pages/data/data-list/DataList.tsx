import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {DataListHeader} from './components/header/DataListHeader'
import {DataTable} from './table/DataTable'
import {KTCard} from '../../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../_metronic/layout/components/content'
import { useState } from 'react'
import { Data } from './core/_models'
import { ToastContainer } from 'react-toastify' // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'

const DataList = () => {
  const {itemIdForUpdate} = useListView()
  const [tableData, setTableData] = useState<Data[]>([]); // Manage table data.

  const handleUploadComplete = (uploadedData: Data[]) => {
    setTableData(uploadedData);
  };

  return (
    <>
      <KTCard>
        <DataListHeader onUploadComplete = {handleUploadComplete}/>
        <DataTable/>
      </KTCard>
    </>
  )
}

const DataListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ToolbarWrapper />
        <Content>
          <DataList />
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {DataListWrapper}
