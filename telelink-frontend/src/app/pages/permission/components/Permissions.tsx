import React, { useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { getPermissionsByRole, updatePermissionByRole } from '../core/_requests'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const Permissions: React.FC = () => {
  const intl = useIntl()
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState<number>(1)
  const [permissions, setPermissions] = useState<number[]>([]);

  const fetchPermissions = async (roleId: number) => {
    setLoading(true)
    try {
      const response = await getPermissionsByRole(roleId);
      setPermissions(response.data ? response.data.map((permission: any) => permission.id) : []);
    } catch (error) {
      console.error('Failed to fetch permissions', error);
      toast.error('Lỗi lấy quyền truy cập!');
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }

  const togglePermission = (permissionId: number) => {
    if (role === 1 && (permissionId === 1 || permissionId === 2)) {
      if (permissions.includes(1) && permissions.includes(2)) {
        setPermissions((prevPermissions) => prevPermissions.filter((id) => id !== 1 && id !== 2)); // Remove both permissions
      } else {
        setPermissions((prevPermissions) =>
          prevPermissions.includes(permissionId) ?
          prevPermissions : [...new Set([...prevPermissions, 1, 2])]); // Add both permissions
      }
    } else {
      setPermissions((prevPermissions) =>
        prevPermissions.includes(permissionId) ?
          prevPermissions.filter((id) => id !== permissionId) // Remove permission
          : [...prevPermissions, permissionId] // Add permission
      );
    }
  }

  const savePerm = async () => {
    setLoading(true)
    try {
      await updatePermissionByRole(role, permissions);
      toast.success('Cập nhật thành công!');
    } catch (error) {
      const errorMessage = (error as any).response?.data?.message || 'Lỗi cập nhật quyền truy cập!';
      toast.error(errorMessage);
      console.error('Failed to update permissions', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (role) fetchPermissions(role);
  }, [role])


  return (
    <div className='card mb-5 mb-xl-10'>
      <div className=''>
        <select
          className='form-select form-select-solid fw-bolder fs-5 ps-8'
          data-kt-select2='true'
          data-placeholder='Select option'
          data-allow-clear='true'
          data-kt-user-table-filter='role'
          data-hide-search='true'
          onChange={(e) => setRole(e.target.value ? parseInt(e.target.value, 10) : 1)}
          value={role}
        >
          <option value='1'>Admin</option>
          <option value='2'>Chi nhánh</option>
          <option value='3'>Nhân viên</option>
        </select>
      </div>
      <div
        className='card-header border-0 cursor-pointer'
        role='button'
        data-bs-toggle='collapse'
        data-bs-target='#kt_account_notifications'
        aria-expanded='true'
        aria-controls='kt_account_notifications'
      >
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>{intl.formatMessage({ id: 'PERMISSION' })}</h3>

        </div>
      </div>

      <div id='kt_account_notifications' className='collapse show'>
        <form className='form'>
          <div className='card-body border-top px-9 pt-3 pb-4'>
            <div className='table-responsive'>
              <table className='table table-row-dashed border-gray-300 align-middle gy-6'>
                <tbody className='fs-6 fw-bold'>
                  <tr>
                    <td className='min-w-250px fs-4 fw-bolder'>Mô đun</td>
                    <td className='min-w-60px fs-4 fw-bolder'>Tác vụ</td>
                  </tr>

                  <tr>
                    <td>Dữ liệu</td>
                    <td>
                      <div className='form-check form-check-solid'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          checked={permissions.includes(1) || permissions.includes(2)}
                          onChange={() => togglePermission(2)}
                        />
                        <label className='form-check-label ps-2'>Xem</label>
                      </div>
                    </td>
                    <td>
                      <div className='form-check form-check-solid'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          checked={permissions.includes(3)}
                          onChange={() => togglePermission(3)}
                        />
                        <label className='form-check-label ps-2'>Upload dữ liệu</label>
                      </div>
                    </td>
                    <td>
                      <div className='form-check form-check-solid'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          checked={permissions.includes(9)}
                        />
                        <label className='form-check-label ps-2'>Phân phối tới chi nhánh</label>
                      </div>
                    </td>
                    <td>
                      <div className='form-check form-check-solid'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          checked={permissions.includes(10) || permissions.includes(11)}
                        />
                        <label className='form-check-label ps-2'>Phân phối tới nhân viên</label>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>Gói cước</td>
                    <td>
                      <div className='form-check form-check-solid'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          checked={permissions.includes(4)}
                          onChange={() => togglePermission(4)}
                        />
                        <label className='form-check-label ps-2'>Xem</label>
                      </div>
                    </td>
                    <td>
                      <div className='form-check form-check-solid'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          
                        />
                        <label className='form-check-label ps-2'>Sửa</label>
                      </div>
                    </td>
                    <td>
                      <div className='form-check form-check-solid'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          
                        />
                        <label className='form-check-label ps-2'>Xoá</label>
                      </div>
                    </td>
                    <td>
                      <div className='form-check form-check-solid'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          checked={permissions.includes(12)}
                        />
                        <label className='form-check-label ps-2'>Tạo</label>
                      </div>
                    </td>
                  </tr>

                  {/* <tr>
                    <td>Danh sách chặn số</td>
                    <td>
                      <div className='form-check form-check-solid'>
                        <input
                          className='form-check-input'
                          type='checkbox'

                        />
                        <label className='form-check-label ps-2'>Xem</label>
                      </div>
                    </td>
                    <td>
                      <div className='form-check form-check-solid'>
                        <input
                          className='form-check-input'
                          type='checkbox'

                        />
                        <label className='form-check-label ps-2'>Sửa</label>
                      </div>
                    </td>
                    <td>
                      <div className='form-check form-check-solid'>
                        <input
                          className='form-check-input'
                          type='checkbox'

                        />
                        <label className='form-check-label ps-2'>Xoá</label>
                      </div>
                    </td>
                    <td>
                      <div className='form-check form-check-solid'>
                        <input
                          className='form-check-input'
                          type='checkbox'

                        />
                        <label className='form-check-label ps-2'>Tạo</label>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className='border-bottom-0'>Báo cáo doanh thu</td>
                    <td className='border-bottom-0'>
                      <div className='form-check form-check-solid'>
                        <input
                          className='form-check-input'
                          type='checkbox'

                        />
                        <label className='form-check-label ps-2' htmlFor='newsletter1'></label>
                      </div>
                    </td>
                    <td className='border-bottom-0'>
                      <div className='form-check form-check-solid'>
                        <input
                          className='form-check-input'
                          type='checkbox'

                        />
                        <label className='form-check-label ps-2' htmlFor='newsletter2'></label>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className='border-bottom-0'>Báo cáo cuộc gọi</td>
                    <td className='border-bottom-0'>
                      <div className='form-check form-check-solid'>
                        <input
                          className='form-check-input'
                          type='checkbox'

                        />
                        <label className='form-check-label ps-2' htmlFor='newsletter1'>Xem</label>
                      </div>
                    </td>
                    <td className='border-bottom-0'>
                      <div className='form-check form-check-solid'>
                        <input
                          className='form-check-input'
                          type='checkbox'

                        />
                        <label className='form-check-label ps-2' htmlFor='newsletter2'></label>
                      </div>
                    </td>
                  </tr> */}
                </tbody>
              </table>
            </div>
          </div>

          <div className='card-footer d-flex justify-content-end py-6 px-9'>
            <button className='btn btn-light btn-active-light-primary me-2'>Đặt lại</button>
            <button type='button' onClick={savePerm} className='btn btn-primary'>
              {!loading && 'Lưu thay đổi'}
              {loading && (
                <span className='indicator-progress' style={{ display: 'block' }}>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export { Permissions }
