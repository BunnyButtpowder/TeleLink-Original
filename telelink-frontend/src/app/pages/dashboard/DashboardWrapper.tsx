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
import { getTop10Salesmen, getTop10Agencies } from '../../../app/pages/reportRevenue/revenue-list/core/_requests'

type Salesman = {
  fullname: string
  avatar?: string
  "Total revenue"?: number
  saleman: number
  agency: string
}

type Agency = {
  name: string
  avatar?: string
  "Total revenue"?: number
}

const DashboardPage: FC = () => {
  const [salesmanCount, setSalesmanCount] = useState<number>(0)
  const [agencyCount, setAgencyCount] = useState<number>(0)
  const { currentUser } = useAuth();
  const userRole = currentUser?.auth.role;
  const agencyId = currentUser?.agency?.id;
  const [isAdmin] = useState(currentUser?.auth?.role === 1);
  const [topSalesmen, setTopSalesmen] = useState<Salesman[]>([])
  const [topAgencies, setTopAgencies] = useState<Agency[]>([])

  const fetchTopSalesmen = async () => {
    try {
      const response = await getTop10Salesmen({ number: 10 })
      setTopSalesmen(response.data)
    } catch (error) {
      console.error('Error fetching top salesmen:', error)
    }
  }

  const fetchTopAgencies = async () => {
    try {
      const response = await getTop10Agencies({ top: 10 })
      setTopAgencies(response.data)
    } catch (error) {
      console.error('Error fetching top agencies:', error)
    }
  }

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
    fetchTopSalesmen();
    fetchTopAgencies();
  }, []);

  return (
    <>
      <ToolbarWrapper />
      <Content>
        {userRole === 1 && (
          <>
            <div className='row g-5 g-xl-10 mb-5 mb-xl-10'>
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
                  topSalesmen={topSalesmen}
                  labelColor='dark'
                  textColor='gray-300'
                />
              </div>

              <div className='col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10'>
                <CardsWidget17 className='h-md-50 mb-5 mb-xl-10' />
                <StatisticsWidget5
                  className='card-xl-stretch mb-xl-8 h-50'
                  svgIcon='briefcase'
                  color='warning'
                  iconColor='white'
                  title={agencyCount}
                  topAgencies={topAgencies}
                  titleColor='white'
                  description='Chi nhánh trong hệ thống'
                  descriptionColor='white'
                  labelColor='dark'
                  textColor='gray-300'
                />
              </div>

              <div className='col-xxl-6'>
                <ChartsWidget3 className='h-md-100' />
              </div>
            </div>

            <div className='row gx-5 gx-xl-10'>
              <div className='col-xxl-6 mb-5 mb-xl-10'>
              </div>

              <div className='col-xxl-6 mb-5 mb-xl-10'>
              </div>
            </div>

            <div className='row gy-5 gx-xl-8'>
              <div className='col-xl-12'>
                <TablesWidget10
                  className='card-xxl-stretch mb-5 mb-xl-8 bg-light-warning'
                  stats={salesmanCount}
                  topSalesmen={topSalesmen}
                />
              </div>
            </div>

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
          </>
        )}

        {userRole === 2 && (
          <>
            <div className='row g-5 g-xl-10 mb-5 mb-xl-10'>
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
                  topSalesmen={topSalesmen}
                  labelColor='dark'
                  textColor='gray-300'
                />
              </div>

              <div className='col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10'>
                <CardsWidget17 className='h-md-50 mb-5 mb-xl-10' />
                <StatisticsWidget5
                  className='card-xl-stretch mb-xl-8 h-50'
                  svgIcon='briefcase'
                  color='warning'
                  iconColor='white'
                  title={agencyCount}
                  topAgencies={topAgencies}
                  titleColor='white'
                  description='Chi nhánh trong hệ thống'
                  descriptionColor='white'
                  labelColor='dark'
                  textColor='gray-300'
                />
              </div>

              <div className='col-xxl-6'>
                <ChartsWidget3 className='h-md-100' />
              </div>
            </div>

            <div className='row gx-5 gx-xl-10'>
              <div className='col-xxl-6 mb-5 mb-xl-10'>
              </div>

              <div className='col-xxl-6 mb-5 mb-xl-10'>
              </div>
            </div>

            <div className='row gy-5 gx-xl-8'>
              <div className='col-xl-12'>
                <TablesWidget10
                  className='card-xxl-stretch mb-5 mb-xl-8 bg-light-warning'
                  stats={salesmanCount}
                  topSalesmen={topSalesmen}
                />
              </div>
            </div>
          </>
        )}

        {userRole === 3 && (
          <>
            {/* <div className='row g-5 g-xl-10 mb-5 mb-xl-10'>

              <div className='col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10'>
                <CardsWidget17 className='h-md-50 mb-5 mb-xl-10' />
                <StatisticsWidget5
                  className='card-xl-stretch mb-xl-8 h-50'
                  svgIcon='briefcase'
                  color='warning'
                  iconColor='white'
                  title={agencyCount}
                  topAgencies={topAgencies}
                  titleColor='white'
                  description='Chi nhánh trong hệ thống'
                  descriptionColor='white'
                  labelColor='dark'
                  textColor='gray-300'
                />
              </div>

              <div className='col-xxl-6'>
                <ChartsWidget3 className='h-md-100' />
              </div>
            </div> */}

            <div className='row gx-5 gx-xl-10'>
              <div className='col-xxl-6 mb-5 mb-xl-10'>
              </div>

              <div className='col-xxl-6 mb-5 mb-xl-10'>
              </div>
            </div>

            <div className='row gy-5 gx-xl-8'>
              <div className='col-xxl-4'>
                <ListsWidget3 className='card-xxl-stretch mb-xl-3' />
              </div>
              <div className='col-xl-8'>
                <TablesWidget10
                  className='card-xxl-stretch mb-5 mb-xl-8 bg-light-warning'
                  stats={salesmanCount}
                  topSalesmen={topSalesmen}
                />
              </div>
            </div>
          </>
        )}

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
