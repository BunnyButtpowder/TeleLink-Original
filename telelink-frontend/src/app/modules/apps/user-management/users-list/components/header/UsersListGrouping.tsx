import {useQueryClient, useMutation} from 'react-query'
import {QUERIES} from '../../../../../../../_metronic/helpers'
import {useListView} from '../../core/ListViewProvider'
import {useQueryResponse} from '../../core/QueryResponseProvider'
import {deleteSelectedUsers} from '../../core/_requests'

const UsersListGrouping = () => {
  const {selected, clearSelected} = useListView()
  const queryClient = useQueryClient()
  const {query} = useQueryResponse()

  const deleteSelectedItems = useMutation(() => deleteSelectedUsers(selected), {
    onSuccess: () => {
      queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`])
      clearSelected()
    },
  })

  const handleDelete = async () => {
    const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa các tài khoản đã chọn?')
    if (isConfirmed) {
      await deleteSelectedItems.mutateAsync()
    }
  }

  return (
    <div className='d-flex justify-content-end align-items-center'>
      <div className='fw-bolder me-5'>
        <span className='me-2'>{selected.length}</span> Chọn
      </div>

      <button
        type='button'
        className='btn btn-danger'
        onClick={handleDelete}
      >
        Xoá tài khoản đã chọn
      </button>
    </div>
  )
}

export {UsersListGrouping}
