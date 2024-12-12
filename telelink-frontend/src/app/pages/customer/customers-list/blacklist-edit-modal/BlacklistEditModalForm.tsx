import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FC, useState, useEffect } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { ID, isNotEmpty, toAbsoluteUrl } from '../../../../../_metronic/helpers'
import { initialBlacklist, Blacklist } from '../../../blacklist/black-list/core/_models'
import clsx from 'clsx'
import { UsersListLoading } from '../components/loading/UsersListLoading'
import { createBlacklistNumber } from '../../../blacklist/black-list/core/_requests'
import { useQueryResponse } from '../core/QueryResponseProvider'
import { useIntl } from 'react-intl'
import { useAuth } from '../../../../../app/modules/auth'

type Props = {
  onClose: () => void
}

const BlacklistSchema = Yup.object().shape({
    note: Yup.string().required('Vui lòng nhập lý do'),
})

const BlacklistEditModalForm: FC<Props> = ({ onClose }) => {
  const intl = useIntl();
  const { setDataDetails, refetch } = useQueryResponse()
  const { currentUser } = useAuth();
  
  const userId = currentUser?.id;
  const dataDetails = localStorage.getItem(`dataDetails_${currentUser?.id}`) || ''
  const dataNumber = dataDetails ? JSON.parse(dataDetails).subscriberNumber : '' 

  const [blacklistForEdit, setBlacklistForEdit] = useState<Blacklist>({
    ...initialBlacklist,
    SDT: dataNumber,
  });


  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
  }

  const blacklistFormik = useFormik<Blacklist>({
    initialValues: blacklistForEdit,
    enableReinitialize: true,
    validationSchema: BlacklistSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)
      try {
        let response;
        if (dataNumber){
          response = await createBlacklistNumber(values, userId?.toString() || '')
          refetch();
          localStorage.removeItem(`dataDetails_${currentUser?.id}`);
          setDataDetails(undefined);
          onClose()  
          toast.success('Thêm số chặn thành công')
        }
        else {
          toast.error('Hãy lấy số trước khi thêm số chặn!')
        }  
          
      } catch (ex) {
        const errorMessage = (ex as any).response?.data?.message || 'Gửi kết quả cuộc gọi thất bại!'
        toast.error(errorMessage)
        console.error('Có lỗi trong quá trình tạo số chặn', errorMessage)
      } finally {
        setSubmitting(false)
        cancel(true)
      }
    },
  })

  return (
    <>
    <ToastContainer />
      {/* Package Form */}
      {
        <form id='kt_modal_add_user_form' className='form' onSubmit={blacklistFormik.handleSubmit} noValidate>
          {/* Package form fields */}
          <div
            className='d-flex flex-column scroll-y me-n7 pe-7'
            id='kt_modal_add_user_scroll'
            data-kt-scroll='true'
            data-kt-scroll-activate='{default: false, lg: true}'
            data-kt-scroll-max-height='auto'
            data-kt-scroll-dependencies='#kt_modal_add_user_header'
            data-kt-scroll-wrappers='#kt_modal_add_user_scroll'
            data-kt-scroll-offset='300px'
          >

            {/* begin::Input group */}
            <div className='fv-row mb-7'>
              {/* begin::Label */}
              <label className='required fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'NOTE' })}</label>              {/* end::Label */}

              {/* begin::Input */}
              <input
                placeholder='Ghi chú'
                {...blacklistFormik.getFieldProps('note')}
                type='text'
                name='note'
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  { 'is-invalid': blacklistFormik.touched.note && blacklistFormik.errors.note },
                  { 'is-valid': blacklistFormik.touched.note && !blacklistFormik.errors.note }
                )}
                autoComplete='off'
                disabled={blacklistFormik.isSubmitting}
              />
              {blacklistFormik.touched.note && blacklistFormik.errors.note && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{blacklistFormik.errors.note}</span>
                  </div>
                </div>
              )}
              {/* end::Input */}
            </div>
            {/* end::Input group */}


          </div>
          {/* end::Scroll */}

          {/* begin::Actions */}
          <div className='text-center pt-5'>
            <button
              type='reset'
              onClick={onClose}
              className='btn btn-light me-3'
              data-kt-users-modal-action='cancel'
              disabled={blacklistFormik.isSubmitting }
            >
              {intl.formatMessage({ id: "FORM.CANCEL" })}
            </button>

            <button
              type='submit'
              className='btn btn-primary'
              data-kt-users-modal-action='submit'
              disabled={ blacklistFormik.isSubmitting || !blacklistFormik.isValid || !blacklistFormik.dirty}
            >
              <span className='indicator-label'>{intl.formatMessage({ id: "FORM.SUBMIT" })}</span>
              {(blacklistFormik.isSubmitting ) && (
                <span className='indicator-progress'>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
            {(blacklistFormik.isSubmitting ) && <UsersListLoading />}
          </div>
        </form>
      }
      {(blacklistFormik.isSubmitting ) && <UsersListLoading />}
    </>
  )
}

export { BlacklistEditModalForm }
