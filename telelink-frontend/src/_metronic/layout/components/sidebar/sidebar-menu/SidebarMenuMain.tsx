import { useIntl } from 'react-intl'
import { KTIcon, toAbsoluteUrl } from '../../../../helpers'
import { SidebarMenuItemWithSub } from './SidebarMenuItemWithSub'
import { SidebarMenuItem } from './SidebarMenuItem'
import { useAuth } from '../../../../../app/modules/auth'

const SidebarMenuMain = () => {
  const intl = useIntl()
  const { currentUser } = useAuth()

  const userRole = currentUser?.auth.role

  return (
    <>
      {/* All users access */}
      <SidebarMenuItem
        to='/dashboard'
        icon='element-11'
        title={intl.formatMessage({ id: 'MENU.DASHBOARD' })}
        fontIcon='bi-app-indicator'
      />

      {/* Admin access */}
      {userRole === 1 && (
        <>
          <SidebarMenuItem
            to='/data'
            icon='wifi-square'
            title={intl.formatMessage({ id: 'DATA' })}
            fontIcon='bi-app-indicator'
          />
          <SidebarMenuItem
            to='/packages'
            icon='ocean'
            title={intl.formatMessage({ id: 'ECOMMERCE.CELLPHONE.PLAN' })}
            fontIcon='bi-app-indicator'
          />
          <SidebarMenuItem
            to='/customers'
            icon='profile-user'
            title={intl.formatMessage({ id: 'ECOMMERCE.CUSTOMERS.CUSTOMERS' })}
            fontIcon='bi-app-indicator'
          />
          <SidebarMenuItemWithSub
            to='/reports'
            title='Báo cáo'
            fontIcon='bi-chat-left'
            icon='graph-4'
          >
            <SidebarMenuItem to='/reports/revenue' title='Báo cáo doanh thu' hasBullet={true} />
            <SidebarMenuItem to='/reports/call-results' title='Báo cáo cuộc gọi' hasBullet={true} />
          </SidebarMenuItemWithSub>
          {/* <SidebarMenuItem to='/builder' icon='switch' title='Layout Builder' fontIcon='bi-layers' /> */}
          <div className='menu-item'>
            <div className='menu-content pt-8 pb-2'>
              <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Cá Nhân</span>
            </div>
          </div>
          {/* <SidebarMenuItemWithSub
        to='/crafted/pages'
        title='Pages'
        fontIcon='bi-archive'
        icon='element-plus'
      >
        <SidebarMenuItemWithSub to='/crafted/pages/profile' title='Profile' hasBullet={true}>
          <SidebarMenuItem to='/crafted/pages/profile/overview' title='Overview' hasBullet={true} />
          <SidebarMenuItem to='/crafted/pages/profile/projects' title='Projects' hasBullet={true} />
          <SidebarMenuItem
            to='/crafted/pages/profile/campaigns'
            title='Campaigns'
            hasBullet={true}
          />
          <SidebarMenuItem
            to='/crafted/pages/profile/documents'
            title='Documents'
            hasBullet={true}
          />
          <SidebarMenuItem
            to='/crafted/pages/profile/connections'
            title='Connections'
            hasBullet={true}
          />
        </SidebarMenuItemWithSub>

        <SidebarMenuItemWithSub to='/crafted/pages/wizards' title='Wizards' hasBullet={true}>
          <SidebarMenuItem
            to='/crafted/pages/wizards/horizontal'
            title='Horizontal'
            hasBullet={true}
          />
          <SidebarMenuItem to='/crafted/pages/wizards/vertical' title='Vertical' hasBullet={true} />
        </SidebarMenuItemWithSub>
      </SidebarMenuItemWithSub> */}
          <SidebarMenuItemWithSub
            to='/crafted/accounts'
            title='Tài khoản'
            icon='profile-circle'
            fontIcon='bi-person'
          >
            <SidebarMenuItem to='/crafted/account/overview' title='Tổng quan' hasBullet={true} />
            <SidebarMenuItem to='/crafted/account/settings' title='Cài đặt' hasBullet={true} />
          </SidebarMenuItemWithSub>
          {/* <SidebarMenuItemWithSub to='/error' title='Errors' fontIcon='bi-sticky' icon='cross-circle'>
        <SidebarMenuItem to='/error/404' title='Error 404' hasBullet={true} />
        <SidebarMenuItem to='/error/500' title='Error 500' hasBullet={true} />
      </SidebarMenuItemWithSub> */}
          {/* <SidebarMenuItemWithSub
        to='/crafted/widgets'
        title='Widgets'
        icon='element-7'
        fontIcon='bi-layers'
      >
        <SidebarMenuItem to='/crafted/widgets/lists' title='Lists' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/statistics' title='Statistics' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/charts' title='Charts' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/mixed' title='Mixed' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/tables' title='Tables' hasBullet={true} />
        <SidebarMenuItem to='/crafted/widgets/feeds' title='Feeds' hasBullet={true} />
      </SidebarMenuItemWithSub> */}
          <div className='menu-item'>
            <div className='menu-content pt-8 pb-2'>
              <span className='menu-section text-muted text-uppercase fs-8 ls-1'>{intl.formatMessage({ id: 'SIDEBAR.ADMINISTRATION' })}</span>
            </div>
          </div>
          {/* <SidebarMenuItemWithSub
        to='/apps/chat'
        title='Chat'
        fontIcon='bi-chat-left'
        icon='message-text-2'
      >
        <SidebarMenuItem to='/apps/chat/private-chat' title='Private Chat' hasBullet={true} />
        <SidebarMenuItem to='/apps/chat/group-chat' title='Group Chart' hasBullet={true} />
        <SidebarMenuItem to='/apps/chat/drawer-chat' title='Drawer Chart' hasBullet={true} />
      </SidebarMenuItemWithSub> */}
          <SidebarMenuItem
            to='/apps/user-management/users'
            icon='abstract-28'
            title={intl.formatMessage({ id: 'SIDEBAR.USER_MANAGEMENT' })}
            fontIcon='bi-layers'
          />
        </>
      )}

      {/* Agency access */}
      {userRole === 2 && (
        <>
          <SidebarMenuItem
            to='/data'
            icon='wifi-square'
            title={intl.formatMessage({ id: 'DATA' })}
            fontIcon='bi-app-indicator'
          />
          <SidebarMenuItem
            to='/customers'
            icon='profile-user'
            title={intl.formatMessage({ id: 'ECOMMERCE.CUSTOMERS.CUSTOMERS' })}
            fontIcon='bi-app-indicator'
          />
          <SidebarMenuItemWithSub
            to='/reports'
            title='Báo cáo'
            fontIcon='bi-chat-left'
            icon='graph-4'
          >
            <SidebarMenuItem to='/reports/revenue' title='Báo cáo doanh thu' hasBullet={true} />
            <SidebarMenuItem to='/reports/call-results' title='Báo cáo cuộc gọi' hasBullet={true} />
          </SidebarMenuItemWithSub>
          <div className='menu-item'>
            <div className='menu-content pt-8 pb-2'>
              <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Cá Nhân</span>
            </div>
          </div>
          <SidebarMenuItemWithSub
            to='/crafted/accounts'
            title='Tài khoản'
            icon='profile-circle'
            fontIcon='bi-person'
          >
            <SidebarMenuItem to='/crafted/account/overview' title='Tổng quan' hasBullet={true} />
            <SidebarMenuItem to='/crafted/account/settings' title='Cài đặt' hasBullet={true} />
          </SidebarMenuItemWithSub>
          <SidebarMenuItem
            to='/apps/user-management/users'
            icon='abstract-28'
            title={intl.formatMessage({ id: 'SIDEBAR.USER_MANAGEMENT' })}
            fontIcon='bi-layers'
          />
        </>
      )}

      {/* Salesman access */}
      {userRole === 3 && (
        <>
          <SidebarMenuItem
            to='/customers'
            icon='profile-user'
            title={intl.formatMessage({ id: 'ECOMMERCE.CUSTOMERS.CUSTOMERS' })}
            fontIcon='bi-app-indicator'
          />
          <SidebarMenuItemWithSub
            to='/reports'
            title='Báo cáo'
            fontIcon='bi-chat-left'
            icon='graph-4'
          >
            <SidebarMenuItem to='/reports/revenue' title='Báo cáo doanh thu' hasBullet={true} />
            <SidebarMenuItem to='/reports/call-results' title='Báo cáo cuộc gọi' hasBullet={true} />
          </SidebarMenuItemWithSub>
          <div className='menu-item'>
            <div className='menu-content pt-8 pb-2'>
              <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Cá Nhân</span>
            </div>
          </div>
          <SidebarMenuItemWithSub
            to='/crafted/accounts'
            title='Tài khoản'
            icon='profile-circle'
            fontIcon='bi-person'
          >
            <SidebarMenuItem to='/crafted/account/overview' title='Tổng quan' hasBullet={true} />
            <SidebarMenuItem to='/crafted/account/settings' title='Cài đặt' hasBullet={true} />
          </SidebarMenuItemWithSub>
        </>
      )}
    </>
  )
}

export { SidebarMenuMain }
