import { FC, useState, useEffect } from 'react'
import { useIntl } from 'react-intl'
import { toAbsoluteUrl } from '../../../_metronic/helpers'
import { PageTitle } from '../../../_metronic/layout/core'
import {
  ListsWidget2,
  ListsWidget3,
  ListsWidget4,
  ListsWidget6,
  TablesWidget5,
  TablesWidget10,
  MixedWidget8,
  CardsWidget7,
  CardsWidget17,
  CardsWidget20,
  ListsWidget26,
  EngageWidget10,
  ChartsWidget3,
  StatisticsWidget5
} from '../../../_metronic/partials/widgets'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
import { Content } from '../../../_metronic/layout/components/content'
import { useAuth } from '../../../app/modules/auth'
import { getUsers, getSalesmenByAgency } from '../../modules/apps/user-management/users-list/core/_requests'
import { get } from 'http'

const DashboardPage: FC = () => {
  const [salesmanCount, setSalesmanCount] = useState<number>(0)
  const [agencyCount, setAgencyCount] = useState<number>(0)
  const { currentUser } = useAuth();
  const userRole = currentUser?.auth.role;
  const agencyId = currentUser?.agency?.id;
  const [isAdmin] = useState(currentUser?.auth?.role === 1);

  const fetchSalesmenCount = async () => {
    try {
      if (userRole === 1) {
        const response = await getUsers({ role: 3 });
        setSalesmanCount(response.count ?? 0);
      } else if (userRole === 2 && agencyId) {
        const response = await getSalesmenByAgency({ agencyId });
        setSalesmanCount(response.count ?? 0);
      }
    } catch (error) {
      console.error('Failed to fetch salesmen count:', error);
    }
  }

  const fetchAgencyCount = async () => {
    try {
      const response = await getUsers({ role: 2 });
      setAgencyCount(response.count ?? 0);
    } catch (error) {
      console.error('Failed to fetch salesmen count:', error);
    }
  }

  useEffect(() => {
    fetchAgencyCount();
    fetchSalesmenCount();
  }, []);

  return (
    <>
      <ToolbarWrapper />
      <Content>
        {/* begin::Row */}
        <div className='row g-5 g-xl-10 mb-5 mb-xl-10'>
          {/* begin::Col */}
          <div className='col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10'>
            <CardsWidget20
              className='h-md-50 mb-5 mb-xl-10'
              description='Dữ liệu trong kho'
              color='#F1416C'
              img={toAbsoluteUrl('media/patterns/vector-1.png')}
            />
            <CardsWidget7
              className='h-md-50 mb-5 mb-xl-10'
              description='Nhân viên'
              icon={false}
              stats={salesmanCount}
              labelColor='dark'
              textColor='gray-300'
            />
          </div>
          {/* end::Col */}

          {/* begin::Col */}
          <div className='col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10'>
            <CardsWidget17 className='h-md-50 mb-5 mb-xl-10' />
            {/* <ListsWidget26 className='h-lg-50' /> */}
            <StatisticsWidget5
              className='card-xl-stretch mb-xl-8 h-50'
              svgIcon='briefcase'
              color='warning'
              iconColor='white'
              title={agencyCount}
              titleColor='white'
              description='Chi nhánh trong hệ thống'
              descriptionColor='white'
            />
          </div>
          {/* end::Col */}

          {/* begin::Col */}
          <div className='col-xxl-6'>
            <ChartsWidget3 className='h-md-100' />
          </div>
          {/* end::Col */}
        </div>
        {/* end::Row */}

        {/* begin::Row */}
        <div className='row gx-5 gx-xl-10'>
          {/* begin::Col */}
          <div className='col-xxl-6 mb-5 mb-xl-10'>
            {/* <app-new-charts-widget8 cssclassName="h-xl-100" chartHeight="275px" [chartHeightNumber]="275"></app-new-charts-widget8> */}
          </div>
          {/* end::Col */}

          {/* begin::Col */}
          <div className='col-xxl-6 mb-5 mb-xl-10'>
            {/* <app-cards-widget18 cssclassName="h-xl-100" image="./assetsmedia/stock/600x600/img-65.jpg"></app-cards-widget18> */}
          </div>
          {/* end::Col */}
        </div>
        {/* end::Row */}

        {/* begin::Row */}
        <div className='row gy-5 gx-xl-8'>
          <div className='col-xxl-4'>
            <ListsWidget3 className='card-xxl-stretch mb-xl-3' />
          </div>
          <div className='col-xl-8'>
            <TablesWidget10 className='card-xxl-stretch mb-5 mb-xl-8' />
          </div>
        </div>
        {/* end::Row */}

        {/* begin::Row */}
        {/* <div className='row gy-5 g-xl-8'>
          <div className='col-xl-4'>
            <ListsWidget2 className='card-xl-stretch mb-xl-8' />
          </div>
          <div className='col-xl-4'>
            <ListsWidget6 className='card-xl-stretch mb-xl-8' />
          </div>
          <div className='col-xl-4'>
            <ListsWidget4 className='card-xl-stretch mb-5 mb-xl-8' items={5} />
          </div>
        </div> */}
        {/* end::Row */}

        {/* <div className='row g-5 gx-xxl-8'>
          <div className='col-xxl-4'>
            <MixedWidget8
              className='card-xxl-stretch mb-xl-3'
              chartColor='success'
              chartHeight='150px'
            />
          </div>
          <div className='col-xxl-8'>
            <TablesWidget5 className='card-xxl-stretch mb-5 mb-xxl-8' />
          </div>
        </div> */}
      </Content>
    </>
  )
}

const DashboardWrapper: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({ id: 'MENU.DASHBOARD' })}</PageTitle>
      <DashboardPage />
    </>
  )
}

export { DashboardWrapper }
