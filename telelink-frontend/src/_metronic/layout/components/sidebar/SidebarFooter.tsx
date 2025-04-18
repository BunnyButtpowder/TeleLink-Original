
import {KTIcon} from '../../../helpers'

const SidebarFooter = () => {
  return (
    <div className='app-sidebar-footer flex-column-auto pt-2 pb-6 px-6' id='kt_app_sidebar_footer'>
      <a
        href='#'
        target='_blank'
        className='btn btn-flex flex-center btn-custom btn-primary overflow-hidden text-nowrap px-0 h-40px w-100'
        data-bs-toggle='tooltip'
        data-bs-trigger='hover'
        data-bs-dismiss-='click'
        title='TeleLink About Page'
      >
        <span className='btn-label'>TeleLink</span>
        <KTIcon iconName='document' className='btn-icon fs-2 m-0' />
      </a>
    </div>
  )
}

export {SidebarFooter}
