import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Payments from '@/components/Payments'
import Providers from '@/components/Providers'
import Sto from '@/components/Sto'
import Clients from '@/components/Clients'
import MutualProviders from '@/components/MutualProviders'
import MutualSto from '@/components/MutualSto'
import Debet from '@/components/Debet'
import Credit from '@/components/Credit'
import Chat from '@/components/Chat'
import Stats from '@/components/Stats'
import Login from '@/components/Login'
import Transactions from '@/components/Transactions'
import NotFound from '@/components/NotFound'
import Register from '@/components/Reg'
import login from '@/components/Login'
import Cars from '@/components/Cars'
import Balances from '@/components/Balances'
import Brand from '@/components/Brand'
import Team from '@/components/Team'
import Traders from '@/components/Traders'
import Notifications from '@/components/Notifications'
import ClientOrders from '@/components/ClientOrders'
import Purchase from '@/components/Purchase'
import Staff from '@/components/Staff'
import UserProfile from '@/components/UserProfile'
import SystemLogs from '@/components/SystemLogs'
import Statistics from '@/components/Statistics'
import Users from '@/components/Users'
import SupportCatalog from '@/components/SupportCatalog'
import Configuration from '@/components/Configuration'
import Logos from '@/components/logos/Logos'
import FuelCatalog from '@/components/FuelCatalog'
import Fastorders from '@/components/Fastorders'
import Requests from '@/components/Requests'
import VinCatalogs from '@/components/VinCatalogs'


Vue.use(Router)

export default new Router({
	mode: 'history',
  routes: [{
    path: '/',
    name: 'Login',
    //redirect: '/',
    component: Login
  }, {
    path: '/tickets',
    name: 'Main',
    component: Main
  }, {
    path: '/payments',
    name: 'Payments',
    component: Payments
  }, {
    path: '/providers',
    name: 'Providers',
    component: Providers
  }, {
    path: '/sto',
    name: 'Sto',
    component: Sto
  }, {
    path: '/clients',
    name: 'Clients',
    component: Clients
  }, {
    path: '/mutual_providers',
    name: 'MutualProviders',
    component: MutualProviders
  }, {
    path: '/mutual_sto',
    name: 'MutualSto',
    component: MutualSto
  }, {
    path: '/debet',
    name: 'Debet',
    component: Debet
  }, {
    path: '/credit',
    name: 'Credit',
    component: Credit
  }, {
    path: '/chat',
    name: 'Chat',
    component: Chat
  }, {
    path: '/stats',
    name: 'Stats',
    component: Stats
  }, {
    path: '/reg',
    name: 'Register',
    //redirect: '/',
    component: Register
  }, {
    path: '/transactions',
    name: 'Transactions',
    component: Transactions
  }, {
    path: '*',
    name: 'NotFound',
    component: NotFound
  }, {
    path: '/cars',
    name: 'Cars',
    component: Cars
  }, {
    path: '/balances',
    name: 'Balances',
    component: Balances
  }, {
    path: '/brand',
    name: 'Brand',
    component: Brand
  }, {
    path: '/purchase',
    name: 'Purchase',
    component: Purchase
  }, {
    path: '/team',
    name: 'Team',
    component: Team
  }, {
    path: '/notifications',
    name: 'Notifications',
    component: Notifications
  }, {
    path: '/traders',
    name: 'Traders',
    component: Traders
  }, {
    path: '/client-orders',
    name: 'ClientOrders',
    component: ClientOrders
  }, {
    path: '/staff',
    name: 'Staff',
    component: Staff
  }, {
    path: '/user-profile',
    name: 'UserProfile',
    component: UserProfile
  }, {
    path: '/system-logs',
    name: 'SystemLogs',
    component: SystemLogs
  }, {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics
  }, {
    path: '/users',
    name: 'Users',
    component: Users
  }, {
    path: '/support-catalog',
    name: 'SupportCatalog',
    component: SupportCatalog
  }, {
    path: '/configuration',
    name: 'Configuration',
    component: Configuration
  }, {
    path: '/logos',
    name: 'Logos',
    component: Logos
  }, {
    path: '/fuel',
    name: 'FuelCatalog',
    component: FuelCatalog
  }, {
    path: '/fastorders',
    name: 'Fastorders',
    component: Fastorders
  }, {
    path: '/requests',
    name: 'Requests',
    component: Requests
  }, {
    path: '/vin-catalogs',
    name: 'VinCatalogs',
    component: VinCatalogs
  }]
})
