import React, {  useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FC, useState } from 'react';
import * as Yup from 'yup';
import { useIntl } from 'react-intl'
import Select from 'react-select';
import { useFormik } from 'formik';
import { useAuth } from '../../../../../app/modules/auth'
import { useQueryResponse } from '../core/QueryResponseProvider';
import { deleteManyData, getAllNetworks, getDataCategoriesByNetworks, deleteCategory } from '../core/_requests';

type Props = {
  onClose: () => void;
};

const DeleteManySchema = Yup.object().shape({
  networkName: Yup.string().nullable(),
  createdAt: Yup.string().nullable(),
  category: Yup.string().nullable(),
  network: Yup.string().required('Vui lòng chọn mạng!'),
});

const DeleteManyModalForm: FC<Props> = ({ onClose }) => {
  const intl = useIntl();
  const { refetch } = useQueryResponse();
  const { currentUser } = useAuth();

  const [isAdmin] = useState(currentUser?.auth?.role === 1);
  const [selectedTarget, setSelectedTarget] = useState(isAdmin ? 'agency' : 'salesman');
  const [isLoadingNetworks, setIsLoadingNetworks] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const [networks, setNetworks] = useState<{ [key: string]: { count: number } }>({});
  const [categories, setCategories] = useState<{ [key: string]: { count: number } }>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const fetchNetworks = async () => {
    setIsLoadingNetworks(true);
    try {
      const networks = await getAllNetworks();
      setNetworks(networks);
    } catch (error) {
      console.error('Failed to fetch networks:', error);
    } finally {
      setIsLoadingNetworks(false);
    }
  };

  useEffect(() => {
    fetchNetworks();
  }, [isAdmin]);

  const handleNetworkChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedNetwork = e.target.value;
    deleteFormik.setFieldValue('network', selectedNetwork);

    if (selectedNetwork) {
      try {
        setIsLoadingCategories(true);
        const categories = await getDataCategoriesByNetworks(selectedNetwork);
        setCategories(categories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    }
  };

  const deleteFormik = useFormik({
    initialValues: {
      networkName: '',
      createdAt: '',
      category: '',
      network: '',
    },
    enableReinitialize: true,
    validationSchema: DeleteManySchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        if (selectedTarget === 'type') {
          await deleteCategory(selectedCategories);
        } else {
          await deleteManyData(values);
        }
        refetch();
        toast.success('Xóa dữ liệu thành công!');
        onClose();
      } catch (error) {
        const errorMessage =
          (error as any)?.response?.data?.message || 'Xóa dữ liệu thất bại!';
        toast.error(errorMessage);
        console.error('Error deleting data:', errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <ToastContainer />
      <form
        id='kt_modal_delete_many_form'
        className='form'
        onSubmit={deleteFormik.handleSubmit}
        noValidate
      >
        {isAdmin && (
        <div className='mb-7'>
          <label className="fw-bold fs-6 mb-5">Chọn loại xóa</label>
            <div className="d-flex">
            <label className='form-check form-check-inline' >
              <input
                className='form-check-input'
                type='radio'
                name='target'
                value='normal'
                checked={selectedTarget === 'normal'}
                onChange={() => setSelectedTarget('normal')}
              />
              <span className='form-check-label'>Xóa thường</span>
            </label>
            <label className='form-check form-check-inline' >
              <input
                className='form-check-input'
                type='radio'
                name='target'
                value='type'
                checked={selectedTarget === 'type'}
                onChange={() => setSelectedTarget('type')}
              />
              <span className='form-check-label'>Xóa kho</span>
            </label>
          </div>
        </div>
      )}
        <div className='d-flex flex-column scroll-y me-n7 pe-7'>
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>Nhà mạng</label>
            <select
              {...deleteFormik.getFieldProps('networkName')}
              name='networkName'
              className={`form-control form-control-solid mb-3 mb-lg-0 ${
                deleteFormik.touched.networkName && deleteFormik.errors.networkName
                  ? 'is-invalid'
                  : 'is-valid'
              }`}
              value={deleteFormik.values.networkName} 
              onChange={(e) => {
                handleNetworkChange(e);
                deleteFormik.setFieldValue('networkName', e.target.value); 
              }}
              disabled={deleteFormik.isSubmitting}
            >
              <option value='' disabled>
                {intl.formatMessage({ id: 'SELECT.NETWORK' })}
              </option>
              {isLoadingNetworks ? (
                <option>Loading networks...</option>
              ) : (
                networks &&
                Object.entries(networks).map(([network]) => (
                  <option key={network} value={network}>
                    {network}
                  </option>
                ))
              )}
            </select>
            {deleteFormik.touched.networkName && deleteFormik.errors.networkName && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>
                  <span role='alert'>{deleteFormik.errors.networkName}</span>
                </div>
              </div>
            )}
          </div>

          {selectedTarget !== 'type' && (
            <div className='fv-row mb-7'>
              <label className='fw-bold fs-6 mb-2'>Ngày tạo</label>
              <input
                type='date'
                {...deleteFormik.getFieldProps('createdAt')}
                className={`form-control form-control-solid mb-3 mb-lg-0 ${
                  deleteFormik.touched.createdAt && deleteFormik.errors.createdAt
                    ? 'is-invalid'
                    : 'is-valid'
                }`}
                disabled={deleteFormik.isSubmitting}
              />
            </div>
          )}

          {selectedTarget === 'type' && (
            <div className='fv-row mb-7'>
              <label className='fw-bold fs-6 mb-2'>Loại danh mục</label>
              <Select
                options={Object.entries(categories).map(([category, { count }]) => ({
                  value: category,
                  label: `${category} (Số lượng: ${count})`,
                }))}
                onChange={(selectedOptions) =>
                  setSelectedCategories(
                    selectedOptions ? selectedOptions.map((option) => option.value) : []
                  )
                }
                isMulti={true}
                isClearable
                isSearchable
                isLoading={isLoadingCategories}
                placeholder='Chọn loại danh mục'
              />
            </div>
          )}
        </div>

        <div className='text-center pt-5'>
          <button
            type='reset'
            onClick={onClose}
            className='btn btn-light me-3'
            disabled={deleteFormik.isSubmitting}
          >
            Huỷ
          </button>
          <button
            type='submit'
            className='btn btn-primary'
            disabled={
              deleteFormik.isSubmitting ||
              !deleteFormik.isValid ||
              !deleteFormik.dirty ||
              (selectedTarget === 'type' && selectedCategories.length === 0)
            }
          >
            <span className='indicator-label'>Xóa</span>
            {deleteFormik.isSubmitting && (
              <span className='indicator-progress'>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
      </form>
    </>
  );
};


export { DeleteManyModalForm };
