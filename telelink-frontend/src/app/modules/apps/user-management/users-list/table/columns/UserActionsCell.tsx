import {FC, useEffect} from 'react'
import {useMutation, useQueryClient} from 'react-query'
import {MenuComponent} from '../../../../../../../_metronic/assets/ts/components'
import {ID, KTIcon, QUERIES} from '../../../../../../../_metronic/helpers'
import {useListView} from '../../core/ListViewProvider'
import {useQueryResponse} from '../../core/QueryResponseProvider'
import {deleteUser} from '../../core/_requests'
import {toast} from 'react-toastify'
import Swal from 'sweetalert2';

type Props = {
  id: ID
  role?: number
}

const UserActionsCell: FC<Props> = ({id, role}) => {
  const {setItemIdForUpdate} = useListView()
  const {query} = useQueryResponse()
  const queryClient = useQueryClient()

  useEffect(() => {
    MenuComponent.reinitialization()
  }, [])

  const openEditModal = () => {
    setItemIdForUpdate(id)
  }

  const deleteItem = useMutation(() => deleteUser(id), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`])
      toast.success('Xoá tài khoản thành công!', {position: 'top-right'})
    },
    onError: () => {
      toast.error('Xoá tài khoản thất bại. Vui lòng thử lại.', {position: 'top-right'})
    },
  })

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa?',
      text: 'Hành động này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    });
    if (result.isConfirmed) {
      await deleteItem.mutateAsync()
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

        {role === 3 && ( // Render only if the role is Salesman
          <div className='menu-item px-3'>
            <a
              className='menu-link px-3'
              data-kt-users-table-filter='delete_row'
              onClick={handleDelete}
            >
              Xoá
            </a>
          </div>
        )}
      </div>
      {/* end::Menu */}
    </>
  )
}

export {UserActionsCell}
