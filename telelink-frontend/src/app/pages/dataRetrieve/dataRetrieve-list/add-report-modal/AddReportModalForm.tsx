import React, { FC, useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { initialResult, Result } from '../core/_models';
import { RetrievePageLoading } from '../components/loading/RetrievePageLoading';
import { getCategoriesByUserID, getCategoriesByAgencyID, retrieveFromSalesmanToAdmin, retrieveFromAgencyToAdmin, retrieveFromSalesmanToAgency } from '../core/_requests';
import { useIntl } from 'react-intl';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../../../modules/auth';
import Swal from 'sweetalert2';
import Select from 'react-select';
import { useQueryResponse } from '../core/QueryResponseProvider'

type Props = {
  onClose: () => void;
};

const AddReportModalForm: FC<Props> = ({ onClose }) => {
  const intl = useIntl();
  const { currentUser } = useAuth();
  const dataDetails = localStorage.getItem(`dataDetails_${currentUser?.id}`) || '';
  const dataId = dataDetails ? JSON.parse(dataDetails).id : '';
  const [date, setDate] = useState<string>('');
  const [agencyId, setAgencyId] = useState<number | undefined>(currentUser?.agency?.id);
  const [agencies, setAgencies] = useState<{ id: number, name: string }[]>([]);
  const [salesmen, setSalesmen] = useState<{ id: number, fullName: string }[]>([]);
  const [categories, setCategories] = useState<{ value: string, label: string }[]>([]);
  const [selectedTarget, setSelectedTarget] = useState<'agency' | 'salesman'>('agency');
  const isAdmin = currentUser?.auth?.role === 1;
  const { refetch } = useQueryResponse()

  const API_URL = import.meta.env.VITE_APP_API_URL;

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/agencys/getall`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        if (result && result.data) {
          setAgencies(result.data);
        }
      } catch (error) {
        console.error('Error fetching agencies:', error);
      }
    };

    if (isAdmin) {
      fetchAgencies();
    }
  }, [isAdmin]);

  useEffect(() => {
    const fetchSalesmen = async () => {
      if (!agencyId) {
        setSalesmen([]);
        return;
      }

      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/users/agency?agencyId=${agencyId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        if (result && result.employees) {
          setSalesmen(result.employees.map((employee: any) => ({ id: employee.id, fullName: employee.fullName })));
        }
      } catch (error) {
        console.error('Error fetching salesmen:', error);
      }
    };

    fetchSalesmen();
  }, [agencyId]);

  const handleTargetChange = (target: 'agency' | 'salesman') => {
    setSelectedTarget(target);
    formik.setFieldValue('salesman', []); // Corrected field name
    formik.setFieldValue('agencyId', '');
    setCategories([]);
  };

  const handleSalesmanChange = async (selectedOptions: any) => {
    let selectedSalesmen: number[] = [];

    if (Array.isArray(selectedOptions)) {
      selectedSalesmen = selectedOptions.map((option: any) => option.value);
    } else if (selectedOptions) {
      selectedSalesmen = [selectedOptions.value];
    }

    formik.setFieldValue('salesman', selectedSalesmen);
    setCategories([]); // Empty the category selection

    if (selectedSalesmen.length > 0) {
      try {
        const categoriesResponse = await getCategoriesByUserID(selectedSalesmen[0]);
        const categories = categoriesResponse.categories.map((category: string) => ({ value: category, label: category }));
        setCategories(categories);
        formik.setFieldValue('categories', categories.map((category) => category.value));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
  };

  const handleAgencyChange = async (selectedOption: any) => {
    const selectedAgencyId = selectedOption ? selectedOption.value : undefined;
    setAgencyId(selectedAgencyId);
    setSalesmen([]); 
    setCategories([]); 
  
    if (selectedAgencyId) {
      try {
        const categoriesResponse = await getCategoriesByAgencyID(selectedAgencyId);
        if (categoriesResponse) {
          const categories = Object.keys(categoriesResponse).map((category) => ({ value: category, label: category }));
          setCategories(categories);
          formik.setFieldValue('categories', categories.map((category) => category.value));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
  };

  const formik = useFormik<Result>({
    initialValues: {
      ...initialResult,
      categories: [],
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        let response;
        if (isAdmin && selectedTarget === 'agency') {
          response = await retrieveFromAgencyToAdmin(agencyId!, values.categories || []);
        } else if (isAdmin && selectedTarget === 'salesman') {
          if (Array.isArray(values.salesman) && values.salesman.length > 0) { // Corrected field name
            response = await retrieveFromSalesmanToAdmin(values.salesman[0], values.categories || []); // Corrected field name
          } else {
            throw new Error('Salesman is not selected');
          }
        } else {
          if (Array.isArray(values.salesman) && values.salesman.length > 0) { // Corrected field name
            response = await retrieveFromSalesmanToAgency(values.salesman[0], values.categories || []); // Corrected field name
          } else {
            throw new Error('Salesman is not selected');
          }
        }

        refetch();
        onClose();
        Swal.fire({
          title: 'Thành công',
          text: 'Thu hồi thành công !',
          icon: 'success',
          timer: 5000,
          showConfirmButton: false,
          position: 'top-end',
          toast: true,
          timerProgressBar: true,
        });
      } catch (error) {
        const errorMessage = (error as any).response?.data?.message || 'Thu hồi thất bại!';
        toast.error(errorMessage);
        console.error('Có lỗi trong quá trình thu hồi', errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    console.log('Salesmen updated:', salesmen);
  }, [salesmen]);

  useEffect(() => {
    console.log('Categories updated:', categories);
  }, [categories]);

  return (
    <>
      <ToastContainer />
      {/* Report Form */}
      {
        <form id='kt_modal_add_user_form' className='form' onSubmit={formik.handleSubmit}>
          <div
            className='d-flex flex-column me-n7 pe-7'
            id='kt_modal_add_user_scroll'
            data-kt-scroll='true'
            data-kt-scroll-activate='{default: false, lg: true}'
            data-kt-scroll-max-height='auto'
            data-kt-scroll-dependencies='#kt_modal_add_user_header'
            data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
            data-kt-scroll-offset='300px'
          >

            {isAdmin && (
              <div className='d-flex justify-content-evenly mb-7'>
                <label className='form-check form-check-inline' style={{ cursor: 'pointer' }}>
                  <input
                    className='form-check-input'
                    type='radio'
                    name='target'
                    value='agency'
                    checked={selectedTarget === 'agency'}
                    onChange={() => handleTargetChange('agency')}
                  />
                  <span className='form-check-label'>Chi nhánh</span>
                </label>
                <label className='form-check form-check-inline' style={{ cursor: 'pointer' }}>
                  <input
                    className='form-check-input'
                    type='radio'
                    name='target'
                    value='salesman'
                    checked={selectedTarget === 'salesman'}
                    onChange={() => handleTargetChange('salesman')}
                  />
                  <span className='form-check-label'>Nhân viên</span>
                </label>
              </div>
            )}

            {isAdmin && selectedTarget === 'agency' && (
              <>
                <div className='fv-row mb-7'>
                  <label className='fw-bold fs-6 mb-2'>Chi nhánh:</label>
                  <Select
                    options={agencies.map((agency) => ({
                      value: agency.id,
                      label: agency.name,
                    }))}
                    onChange={handleAgencyChange}
                    isClearable
                    isSearchable={true}
                    placeholder='Chọn chi nhánh'
                    classNamePrefix="react-select"
                  />
                </div>

                <div className='fv-row mb-7'>
                  <label className='fw-bold fs-6 mb-2'>Loại dữ liệu:</label>
                  <Select
                    options={categories}
                    isMulti={true}
                    isClearable
                    isSearchable={true}
                    placeholder='Chọn loại dữ liệu'
                    classNamePrefix="react-select"
                    onChange={(selectedOptions) => formik.setFieldValue('categories', selectedOptions ? selectedOptions.map((option: any) => option.value) : [])}
                  />
                </div>
              </>
            )}

            {isAdmin && selectedTarget === 'salesman' && (
              <>
                <div className='fv-row mb-7'>
                  <label className='fw-bold fs-6 mb-2'>Chi nhánh:</label>
                  <Select
                    options={agencies.map((agency) => ({
                      value: agency.id,
                      label: agency.name,
                    }))}
                    onChange={handleAgencyChange}
                    isClearable
                    isSearchable={true}
                    placeholder='Chọn chi nhánh'
                    classNamePrefix="react-select"
                  />
                </div>

                <div className='fv-row mb-7'>
                  <label className='fw-bold fs-6 mb-2'>Nhân viên bán hàng:</label>
                  <Select
                    options={salesmen.map((salesman) => ({
                      value: salesman.id,
                      label: salesman.fullName,
                    }))}
                    onChange={handleSalesmanChange}
                    isClearable
                    isSearchable={true}
                    placeholder='Chọn nhân viên bán hàng'
                    classNamePrefix="react-select"
                  />
                </div>

                <div className='fv-row mb-7'>
                  <label className='fw-bold fs-6 mb-2'>Loại dữ liệu:</label>
                  <Select
                    options={categories}
                    isMulti={true}
                    isClearable
                    isSearchable={true}
                    placeholder='Chọn loại dữ liệu'
                    classNamePrefix="react-select"
                    onChange={(selectedOptions) => formik.setFieldValue('categories', selectedOptions ? selectedOptions.map((option: any) => option.value) : [])}
                  />
                </div>
              </>
            )}

            {!isAdmin && (
              <>
                <div className='fv-row mb-7'>
                  <label className='fw-bold fs-6 mb-2'>Nhân viên bán hàng:</label>
                  <Select
                    options={salesmen.map((salesman) => ({
                      value: salesman.id,
                      label: salesman.fullName,
                    }))}
                    onChange={handleSalesmanChange}
                    isClearable
                    isSearchable={true}
                    placeholder='Chọn nhân viên bán hàng'
                    classNamePrefix="react-select"
                  />
                </div>

                <div className='fv-row mb-7'>
                  <label className='fw-bold fs-6 mb-2'>Loại dữ liệu:</label>
                  <Select
                    options={categories}
                    isMulti={true}
                    isClearable
                    isSearchable={true}
                    placeholder='Chọn loại dữ liệu'
                    classNamePrefix="react-select"
                    onChange={(selectedOptions) => formik.setFieldValue('categories', selectedOptions ? selectedOptions.map((option: any) => option.value) : [])}
                  />
                </div>
              </>
            )}
          </div>
          {/* end::Scroll */}

          {/* begin::Actions */}
          <div className='text-center pt-5'>
            <button type='button' onClick={onClose} className='btn btn-light me-3' disabled={formik.isSubmitting}>
              {intl.formatMessage({ id: 'FORM.CANCEL' })}
            </button>
            <button
              type='submit'
              className='btn btn-primary'
              disabled={formik.isSubmitting || !formik.isValid || !formik.dirty}
            >
              <span className='indicator-label'>{intl.formatMessage({ id: "FORM.SUBMIT" })}</span>
              {(formik.isSubmitting) && (
                <span className='indicator-progress'>
                  Đang xử lý...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
            {(formik.isSubmitting) && <RetrievePageLoading />}
          </div>
        </form>
      }
      {(formik.isSubmitting) && <RetrievePageLoading />}
    </>
  );
};

export { AddReportModalForm };