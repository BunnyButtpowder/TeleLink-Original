import React, { FC, useEffect, useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import clsx from 'clsx'
import axios from 'axios'
import { useIntl } from 'react-intl'
import { dataAssignAgency, dataAssignSalesman, dataAssignAdminToSaleman, getAllAgencies, getAllDataCategories, getSalesmenByAgency, getAllNetworks, getNetworksByAgency, getCategoriesByAgency } from '../core/_requests'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../../../../app/modules/auth'
import { useQueryResponse } from '../core/QueryResponseProvider'


// Define the schemas for form validation
const dataDistributionSchema = Yup.object().shape({
  agencyId: Yup.string().required('Vui lòng chọn chi nhánh'),
  quantity: Yup.number().required('Vui lòng nhập số lượng').min(1, 'Số lượng phải lớn hơn 0'),
  network: Yup.string().required('Vui lòng chọn nhà mạng'),
  category: Yup.string().required('Vui lòng chọn loại data'),
})

const salesmanDataDistributionSchema = Yup.object().shape({
  quantity: Yup.number()
  .integer('Số lượng phải là số nguyên')
  .min(1, 'Số lượng phải lớn hơn hoặc bằng 1')
  .required('Vui lòng điền vào trường này'),  
  agencyId: Yup.string().required('Vui lòng chọn chi nhánh'),
  userId: Yup.string().required('Vui lòng chọn nhân viên'),
  network: Yup.string().required('Vui lòng chọn nhà mạng'),
  category: Yup.string().required('Vui lòng chọn loại data'),
})

interface DataDistributionModalFormProps {
  onClose: () => void;
}

const DataDistributionModalForm: FC<DataDistributionModalFormProps> = ({ onClose }) => {
  const intl = useIntl()
  const { currentUser } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [agencies, setAgencies] = useState<Array<{ id: number; name: string }>>([]);
  const [categories, setCategories] = useState<{ [key: string]: { count: number } }>({});
  const [networks, setNetworks] = useState<{ [key: string]: { count: number } }>({});
  const [salesman, setSalesman] = useState<Array<{ id: number; fullName: string }>>([]);
  const [selectedCategoryCount, setSelectedCategoryCount] = useState<number | null>(null);
  const [isLoadingAgencies, setIsLoadingAgencies] = useState(false);
  const [isLoadingNetworks, setIsLoadingNetworks] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isAdmin] = useState(currentUser?.auth?.role === 1);
  const [selectedTarget, setSelectedTarget] = useState(isAdmin ? 'agency' : 'salesman');
  const [agencyId] = useState(isAdmin ? '' : currentUser?.agency?.id);
  const { refetch } = useQueryResponse()

  const fetchAgencies = async () => {
    setIsLoadingAgencies(true);
    try {
      const agencies = await getAllAgencies();
      setAgencies(agencies.data);
    } catch (error) {
      console.error('Failed to fetch agencies:', error);
    } finally {
      setIsLoadingAgencies(false);
    }
  }

  const fetchNetworks = async () => {
    setIsLoadingNetworks(true);
    try {
      if (isAdmin) {
        const networks = await getAllNetworks();
        setNetworks(networks);
      } else {
        const networks = await getNetworksByAgency(agencyId?.toString() || '');
        setNetworks(networks);
      }
    } catch (error) {
      console.error('Failed to fetch data networks:', error);
    } finally {
      setIsLoadingNetworks(false);
    }
  }

  const fetchSalesmen = async () => {
    try {
      if (!isAdmin) {
        const salesmen = await getSalesmenByAgency(agencyId?.toString() || '');
        setSalesman(salesmen);
      }
    } catch (error) {
      console.error('Failed to fetch agency salesmen:', error);
    } finally {
      setIsLoadingNetworks(false);
    }
  }

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      if (isAdmin) {
        const categories = await getAllDataCategories();
        setCategories(categories);
      } else {
        const categories = await getCategoriesByAgency(agencyId?.toString() || '');
        setCategories(categories);
      }
    } catch (error) {
      console.error('Failed to fetch data categories:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  }

  // Fetch agencies only if logged in user is admin
  useEffect(() => {
    if (isAdmin) {
      fetchAgencies();
    }

    // Fetch salesmen, networks and categories
    fetchSalesmen();
    fetchNetworks();
    fetchCategories();
  }, [isAdmin])

  // Fetch salesman when agency changes
  const handleAgencyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAgencyId = e.target.value;
    formik.setFieldValue('agencyId', selectedAgencyId);
    try {
      const salesmen = await getSalesmenByAgency(selectedAgencyId);
      setSalesman(salesmen);
    } catch (error) {
      console.error('Failed to fetch salesman:', error);
    }
  }

  // Update network value when selecting networks
  const handleNetworkChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedNetwork = e.target.value;
    formik.setFieldValue('network', selectedNetwork);
  }

  // Update count when category changes
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    formik.setFieldValue('category', selectedCategory);
    setSelectedCategoryCount(categories[selectedCategory]?.count || null);
  }

  const formik = useFormik({
    initialValues: {
      agencyId: agencyId || '',
      userId: '',
      quantity: '',
      network: '',
      category: '',
    },
    validationSchema: isAdmin && selectedTarget === 'agency' ? dataDistributionSchema : salesmanDataDistributionSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      try {
        let response;
        if (isAdmin && selectedTarget === 'agency') {
          response = await dataAssignAgency(values);
        } else if (isAdmin && selectedTarget === 'salesman') {
          response = await dataAssignAdminToSaleman(values);
        } else {
          response = await dataAssignSalesman(values);
        }

        resetForm();
        fetchNetworks();
        fetchCategories();
        refetch();
        onClose();
        toast.success("Phân phối dữ liệu thành công!")

      } catch (error) {
        const errorMessage = (error as any).response?.data?.message || 'Phân phối dữ liệu thất bại!';
        
        console.error('Error distributing data:', errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
  });
  

  return (
    <>
          <ToastContainer />
      {isAdmin && (
        // Radio buttons only for admin to choose between agency and salesman
        <div className='d-flex justify-content-evenly mb-7'>
          <label className='form-check form-check-inline' style={{ cursor: 'pointer' }}>
            <input
              className='form-check-input'
              type='radio'
              name='target'
              value='agency'
              checked={selectedTarget === 'agency'}
              onChange={() => {
                setSelectedTarget('agency');
                formik.setFieldValue('userId', '');
              }}
            />
            <span className='form-check-label'>Cho chi nhánh</span>
          </label>
          <label className='form-check form-check-inline' style={{ cursor: 'pointer' }}>
            <input
              className='form-check-input'
              type='radio'
              name='target'
              value='salesman'
              checked={selectedTarget === 'salesman'}
              onChange={() => setSelectedTarget('salesman')}
            />
            <span className='form-check-label'>Cho nhân viên</span>
          </label>
        </div>
      )}

      <form id='kt_modal_data_distribution_form' className='form' onSubmit={formik.handleSubmit} noValidate>
        <div
          className='d-flex flex-column scroll-y me-n7 pe-7'
          id='kt_modal_data_distribution_scroll'
          data-kt-scroll='true'
          data-kt-scroll-activate='{default: false, lg: true}'
          data-kt-scroll-max-height='auto'
          data-kt-scroll-dependencies='#kt_modal_data_distribution_header'
          data-kt-scroll-wrappers='#kt_modal_data_distribution_scroll'
          data-kt-scroll-offset='300px'
        >
          {/* Begin::Agency Selection */}
          {!isAdmin && (
            // Automatic agency ID for agency users
            <input type='hidden' name='agencyId' value={agencyId} />
          )}
          {isAdmin && (
            // Agency selection for admin
            <div className='fv-row mb-7'>
              <label className='required fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'AGENCY' })}</label>
              <select
                {...formik.getFieldProps('agencyId')}
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  { 'is-invalid': formik.touched.agencyId && formik.errors.agencyId },
                  { 'is-valid': formik.touched.agencyId && !formik.errors.agencyId }
                )}
                onChange={handleAgencyChange}
              >
                <option value='' disabled>{intl.formatMessage({ id: 'SELECT.AGENCY' })}</option>
                {isLoadingAgencies ? (
                  <option>Loading agencies...</option>
                ) : (
                  agencies.map((agency) => (
                    <option key={agency.id} value={agency.id.toString()}>
                      {agency.name}
                    </option>
                  )))
                }
              </select>
              {formik.touched.agencyId && formik.errors.agencyId && (
                <div className='fv-plugins-message-container'>
                  <span role='alert'>{formik.errors.agencyId}</span>
                </div>
              )}
            </div>
          )}
          {/* End::Agency Selection */}

          {/* Begin:: Salesman Selection */}
          {selectedTarget === 'salesman' && (
            <div className='fv-row mb-7'>
              <label className='required fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'SALESMAN' })}</label>
              <select
                {...formik.getFieldProps('userId')}
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  { 'is-invalid': formik.touched.userId && formik.errors.userId },
                  { 'is-valid': formik.touched.userId && !formik.errors.userId }
                )}
              >
                <option value='' disabled>{intl.formatMessage({ id: 'SELECT.SALESMAN' })}</option>
                {salesman.map((employee) => (
                  <option key={employee.id} value={employee.id.toString()}>
                    {employee.fullName}
                  </option>
                ))}
              </select>
              {formik.touched.userId && formik.errors.userId && (
                <div className='fv-plugins-message-container'>
                  <div className="fv-help-block">
                  <span role='alert'>{formik.errors.userId}</span>
                </div>
                </div>
              )}
            </div>
          )}
          {/* End:: Salesman Selection */}

          {/* Begin::Network Input */}
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'NETWORK' })}</label>
            <select
              value={formik.values.network}
              onChange={handleNetworkChange}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                { 'is-invalid': formik.touched.network && formik.errors.network },
                { 'is-valid': formik.touched.network && !formik.errors.network }
              )}
            >
              <option value='' disabled>{intl.formatMessage({ id: 'SELECT.NETWORK' })}</option>
              {isLoadingNetworks ? (
                <option>Loading networks...</option>
              ) : (
                networks && Object.entries(networks).map(([network]) => (
                  <option key={network} value={network}>
                    {network}
                  </option>
                ))
              )}
            </select>
            {formik.touched.network && formik.errors.network && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.network}</span>
              </div>
            )}
          </div>
          {/* End::Network Input */}

          {/* Begin::Category Selection */}
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'DATA_CLASSIFY' })}</label>
            <select
              value={formik.values.category}
              onChange={handleCategoryChange}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                { 'is-invalid': formik.touched.category && formik.errors.category },
                { 'is-valid': formik.touched.category && !formik.errors.category }
              )}
            >
              <option value='' disabled>{intl.formatMessage({ id: 'SELECT.DATA_CLASSIFY' })}</option>
              {isLoadingCategories ? (
                <option>Loading categories...</option>
              ) : (
                categories && Object.entries(categories).map(([category, { count }]) => (
                  <option key={category} value={category}>
                    {category} (Số lượng còn lại: {count})
                  </option>
                ))
              )}
            </select>
            {formik.touched.category && formik.errors.category && (
              <div className='fv-plugins-message-container'>
                <span role='alert'>{formik.errors.category}</span>
              </div>
            )}
          </div>
          {/* End::Category Selection */}

          {/* Begin::Quantity Input */}
          <div className='fv-row mb-7'>
            <label className='required fw-bold fs-6 mb-2'>
              {intl.formatMessage({ id: 'QUANTITY' })}{' '}
              {selectedCategoryCount !== null ? `(Tối đa: ${selectedCategoryCount})` : ''}
            </label>
            <input
              type='text' // Use 'text' to intercept invalid inputs like decimals or negatives
              {...formik.getFieldProps('quantity')}
              className={clsx(
                'form-control form-control-solid mb-3 mb-lg-0',
                { 'is-invalid': formik.touched.quantity && formik.errors.quantity },
                { 'is-valid': formik.touched.quantity && !formik.errors.quantity }
              )}
              placeholder='Số lượng'
              autoComplete='off'
              onChange={(e) => {
                const rawValue = e.target.value;
                // Allow only digits
                const numericValue = rawValue.replace(/[^0-9]/g, '');
                formik.setFieldValue('quantity', numericValue); // Update Formik value
              }}
            />
            {formik.touched.quantity && formik.errors.quantity && (
              <div className='fv-plugins-message-container'>
                <div className='fv-help-block'>

                <span role='alert'>{formik.errors.quantity}</span>
                </div>
              </div>
            )}
          </div>
          {/* End::Quantity Input */}

        </div>

        {/* Begin::Actions */}
        <div className='text-center pt-5'>
          <button
            type='button'
            onClick={onClose}
            className='btn btn-light me-3'
            disabled={isSubmitting}
          >
            {intl.formatMessage({ id: "FORM.CANCEL" })}
          </button>
          <button
            type='submit'
            className='btn btn-primary'
            disabled={isSubmitting || !formik.isValid || !formik.dirty}
          >
            <span className='indicator-label'>{intl.formatMessage({ id: "FORM.SUBMIT" })}</span>
            {isSubmitting && (
              <span className='indicator-progress'>
                Please wait...{' '}
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
        {/* End::Actions */}
 
      </form>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />

    </>
  )
}

export { DataDistributionModalForm }
