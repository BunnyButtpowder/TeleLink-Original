import { FC, useEffect } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { MenuComponent } from '../../../../../../../_metronic/assets/ts/components'
import { ID, KTIcon, QUERIES } from '../../../../../../../_metronic/helpers'
import { useListView } from '../../core/ListViewProvider'
import { useQueryResponse } from '../../core/QueryResponseProvider'
import { deleteUser, banUser } from '../../core/_requests'
import { toast } from 'react-toastify'

type Props = {
  id: ID
  role?: number
  isActive?: number
}

const UserActionsCell: FC<Props> = ({ id, role, isActive }) => {
  const { setItemIdForUpdate } = useListView()
  const { query } = useQueryResponse()
  const queryClient = useQueryClient()

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const openEditModal = () => {
    setItemIdForUpdate(id)
  }

  useEffect(() => {
    console.log('Component Mounted/Updated. Current isActive:', isActive)
  }, [isActive])

  const deleteItem = useMutation(() => deleteUser(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`])
      toast.success('Xoá tài khoản thành công!', { position: 'top-right' })
    },
    onError: () => {
      toast.error('Xoá tài khoản thất bại. Vui lòng thử lại.', { position: 'top-right' })
    },
  })

  const handleDelete = async () => {
    const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa?')
    if (isConfirmed) {
      await deleteItem.mutateAsync()
    }
  }

  const banItem = useMutation((isBan: boolean) => banUser(id, isBan), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`])
      toast.success('Thay đổi trạng thái chặn thành công!', { position: 'top-right' })
    },
    onError: () => {
      toast.error('Thay đổi trạng thái chặn thất bại. Vui lòng thử lại.', { position: 'top-right' })
    },
  })

  const handleBanUnban = async () => {
    console.log('isActive value:', isActive) // Logs the current value of isActive
    console.log(id)
    console.log(role)

    const action = isActive === 1 ? 'chặn' : 'bỏ chặn' // Adjusted to check if isActive is 1 or 0
    const isConfirmed = window.confirm(`Bạn có chắc chắn muốn ${action} người dùng này?`)
    
    if (isConfirmed) {
      // If isActive is 1, ban the user (true); if 0, unban the user (false)
      await banItem.mutateAsync(isActive === 1 ? false : true)
    }
  }

  return (
    <>
      <a
        href='#'
        className='btn btn-light btn-active-light-primary btn-sm'
        data-kt-menu-trigger='click'
        data-kt-menu-placement='bottom-end'
      >
        Tác vụ
        <KTIcon iconName='down' className='fs-5 m-0' />
      </a>
      {/* begin::Menu */}
      <div
        className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4'
        data-kt-menu='true'
      >
        {/* begin::Menu item */}
        <div className='menu-item px-3'>
          <a className='menu-link px-3' onClick={openEditModal}>
            Sửa
          </a>
        </div>
        {/* end::Menu item */}

        {(role === 3 || role === 2) && ( // Salesman or Agency
          <div className='menu-item px-3'>
            <a
              className='menu-link px-3'
              data-kt-users-table-filter='ban_unban_row'
              onClick={handleBanUnban}
            >
              {isActive === 1 ? 'Chặn' : 'Bỏ chặn'}
            </a>
            {role === 3 && (
              <a
                className='menu-link px-3'
                data-kt-users-table-filter='delete_row'
                onClick={handleDelete}
              >
                Xoá
              </a>
            )}
          </div>
        )}
      </div>
      {/* end::Menu */}
    </>
  )
}

export { UserActionsCell }
