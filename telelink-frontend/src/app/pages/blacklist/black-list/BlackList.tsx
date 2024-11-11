import React from 'react';
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
import {BlacklistEditModal} from './components/blacklist-edit-modal/BlackListEditModal'

const BlackList = () => {
  const {itemIdForUpdate} = useListView()
  const [tableData, setTableData] = useState<Blacklist[]>([]);

  const handleUploadComplete = (uploadedData: Blacklist[]) => {
    setTableData(uploadedData);
  };

  return (
    <>
      <KTCard>
        <BlackListHeader onUploadComplete = {handleUploadComplete}/>
        <BlackListTable/>
      </KTCard>
      {itemIdForUpdate !== undefined && <BlacklistEditModal />}
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
