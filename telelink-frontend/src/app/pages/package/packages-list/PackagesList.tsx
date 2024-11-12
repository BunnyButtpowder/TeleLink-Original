import {ListViewProvider, useListView} from './core/ListViewProvider'
import {QueryRequestProvider} from './core/QueryRequestProvider'
import {QueryResponseProvider} from './core/QueryResponseProvider'
import {PackageListHeader} from './components/header/PackageListHeader'
import {PackageTable} from './table/PackageTable'
import {UserEditModal} from './package-edit-modal/PackageEditModal'
import {KTCard} from '../../../../_metronic/helpers'
import { ToolbarWrapper } from '../../../../_metronic/layout/components/toolbar'
import { Content } from '../../../../_metronic/layout/components/content'
import { Package} from './core/_models'
import { useState } from 'react'

const PackageList = () => {
  const {itemIdForUpdate} = useListView()
  const [tableData, setTableData] = useState<Package[]>([]); // Manage table data.

  const handleUploadComplete = (uploadedData: Package[]) => {
    setTableData(uploadedData);
  };
  return (
    <>
      <KTCard>
        <PackageListHeader onUploadComplete={handleUploadComplete}/>
        <PackageTable />
      </KTCard>
      {itemIdForUpdate !== undefined && <UserEditModal />}
    </>
  )
}

const PackageListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ToolbarWrapper />
        <Content>
          <PackageList />
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
)

export {PackageListWrapper}
