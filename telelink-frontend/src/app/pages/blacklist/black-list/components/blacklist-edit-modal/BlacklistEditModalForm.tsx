import { FC, useState, useEffect } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import { ID, isNotEmpty, toAbsoluteUrl } from '../../../../../../_metronic/helpers'
import { initialBlacklist, Blacklist } from '../../core/_models'
import clsx from 'clsx'
import { useListView } from '../../core/ListViewProvider'
import { UsersListLoading } from '../loading/UsersListLoading'
import { createBlacklistNumber, updateBlacklistNumber } from '../../core/_requests'
import { useQueryResponse } from '../../core/QueryResponseProvider'
import { useIntl } from 'react-intl'
import axios from 'axios'

const API_URL = import.meta.env.VITE_APP_API_URL;

type Props = {
  isUserLoading: boolean
  number: Blacklist
}

const token = localStorage.getItem('auth_token');
const vietnamesePhoneRegExp = /((09|03|07|08|05)+([0-9]{8})\b)/g;

const BlacklistSchema = Yup.object().shape({
  SDT: Yup.string()
  .matches(vietnamesePhoneRegExp, 'Phone number is not valid')
  .required('Phone number is required'),
  note: Yup.string().nullable(),
})

const BlacklistEditModalForm: FC<Props> = ({ number, isUserLoading }) => {
  const intl = useIntl();
  const { setItemIdForUpdate } = useListView()
  const { refetch } = useQueryResponse()

  const [blacklistForEdit, setBlacklistForEdit] = useState<Blacklist>({
    ...number,
    SDT: number.SDT || initialBlacklist.SDT,
    note: number.note || initialBlacklist.note,

  });


  const cancel = (withRefresh?: boolean) => {
    if (withRefresh) {
      refetch()
    }
    setItemIdForUpdate(undefined)
  }

  const blacklistFormik = useFormik<Blacklist>({
    initialValues: blacklistForEdit,
    enableReinitialize: true,
    validationSchema: BlacklistSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)
      try {
        if (isNotEmpty(values.id)) {
          await updateBlacklistNumber(values, token || '')
        } else {
          await createBlacklistNumber(values)
        }
      } catch (ex) {
        console.error(ex)
      } finally {
        setSubmitting(false)
        cancel(true)
      }
    },
  })

  return (
    <>
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
              <label className='required fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'CODE' })}</label>
              {/* end::Label */}

              {/* begin::Input */}
              <input
                placeholder='Chặn số điện thoại'
                {...blacklistFormik.getFieldProps('SDT')}
                type='text'
                name='SDT'
                className={clsx(
                  'form-control form-control-solid mb-3 mb-lg-0',
                  { 'is-invalid': blacklistFormik.touched.SDT && blacklistFormik.errors.SDT },
                  {
                    'is-valid': blacklistFormik.touched.SDT && !blacklistFormik.errors.SDT,
                  }
                )}
                autoComplete='off'
                disabled={blacklistFormik.isSubmitting || isUserLoading}
              />
              {blacklistFormik.touched.SDT && blacklistFormik.errors.SDT && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{blacklistFormik.errors.SDT}</span>
                  </div>
                </div>
              )}
              {/* end::Input */}
            </div>
            {/* end::Input group */}

            {/* begin::Input group */}
            <div className='fv-row mb-7'>
              {/* begin::Label */}
              <label className='required fw-bold fs-6 mb-2'>{intl.formatMessage({ id: 'NOTE' })}</label>
              {/* end::Label */}

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
                disabled={blacklistFormik.isSubmitting || isUserLoading}
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
              onClick={() => cancel()}
              className='btn btn-light me-3'
              data-kt-users-modal-action='cancel'
              disabled={blacklistFormik.isSubmitting || isUserLoading}
            >
              {intl.formatMessage({ id: "FORM.CANCEL" })}
            </button>

            <button
              type='submit'
              className='btn btn-primary'
              data-kt-users-modal-action='submit'
              disabled={isUserLoading || blacklistFormik.isSubmitting || !blacklistFormik.isValid || !blacklistFormik.dirty}
            >
              <span className='indicator-label'>{intl.formatMessage({ id: "FORM.SUBMIT" })}</span>
              {(blacklistFormik.isSubmitting || isUserLoading) && (
                <span className='indicator-progress'>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
            {(blacklistFormik.isSubmitting || isUserLoading) && <UsersListLoading />}
          </div>
        </form>
      }
      {(blacklistFormik.isSubmitting || isUserLoading) && <UsersListLoading />}
    </>
  )
}

export { BlacklistEditModalForm }
