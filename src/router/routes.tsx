import { Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'

import { env } from '@/config/env'
import { APP_ROUTES } from '@/constants/routes'
import { AdminLayout } from '@/layouts/AdminLayout'
import { PublicLayout } from '@/layouts/PublicLayout'
import { RootLayout } from '@/layouts/RootLayout'
import { UserLayout } from '@/layouts/UserLayout'
import { ProfilePage } from '@/features/account/pages/ProfilePage'
import { MyAppointmentsPage } from '@/features/account/pages/MyAppointmentsPage'
import { MyPaymentsPage } from '@/features/account/pages/MyPaymentsPage'
import { AgendaPage } from '@/features/admin/pages/AgendaPage'
import { DashboardPage } from '@/features/admin/pages/DashboardPage'
import { GoogleCalendarPage } from '@/features/admin/pages/GoogleCalendarPage'
import { PaymentsAdminPage } from '@/features/admin/pages/PaymentsAdminPage'
import { ReportsPage } from '@/features/admin/pages/ReportsPage'
import { ServicesAdminPage } from '@/features/admin/pages/ServicesAdminPage'
import { SocialLinksPage } from '@/features/admin/pages/SocialLinksPage'
import { UsersPage } from '@/features/admin/pages/UsersPage'
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { RegisterPage } from '@/features/auth/pages/RegisterPage'
import { ResetPasswordPage } from '@/features/auth/pages/ResetPasswordPage'
import { BookingPage } from '@/features/booking/pages/BookingPage'
import { ComponentsPage } from '@/features/design-system/pages/ComponentsPage'
import { GatewaySimulatorPage } from '@/features/payments/pages/GatewaySimulatorPage'
import { PayAppointmentPage } from '@/features/payments/pages/PayAppointmentPage'
import { PaymentResultPage } from '@/features/payments/pages/PaymentResultPage'
import { HomePage } from '@/features/services/pages/HomePage'
import { LegalPage } from '@/features/services/pages/LegalPage'
import { NotFoundPage } from '@/features/services/pages/NotFoundPage'
import { ServiceDetailPage } from '@/features/services/pages/ServiceDetailPage'
import { ServicesPage } from '@/features/services/pages/ServicesPage'
import { GuestRoute, ProtectedRoute } from '@/router/ProtectedRoute'

const A = APP_ROUTES.admin
/** Rutas del panel, relativas a /admin. */
const rel = (path: string) => path.replace(`${A.root}/`, '')

export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: APP_ROUTES.home, element: <HomePage /> },
          { path: APP_ROUTES.terms, element: <LegalPage kind="terms" /> },
          { path: APP_ROUTES.privacy, element: <LegalPage kind="privacy" /> },
          { path: APP_ROUTES.components, element: <ComponentsPage /> },
          {
            path: APP_ROUTES.login,
            element: (
              <GuestRoute>
                <LoginPage />
              </GuestRoute>
            ),
          },
          {
            path: APP_ROUTES.register,
            element: (
              <GuestRoute>
                <RegisterPage />
              </GuestRoute>
            ),
          },
          {
            path: APP_ROUTES.recover,
            element: (
              <GuestRoute>
                <ForgotPasswordPage />
              </GuestRoute>
            ),
          },
          { path: APP_ROUTES.resetPassword, element: <ResetPasswordPage /> },
          { path: APP_ROUTES.services, element: <ServicesPage /> },
          { path: `${APP_ROUTES.services}/:serviceId`, element: <ServiceDetailPage /> },
          { path: APP_ROUTES.booking, element: <Navigate to={APP_ROUTES.services} replace /> },
          {
            path: `${APP_ROUTES.booking}/:serviceId`,
            element: (
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/pagar/:appointmentId',
            element: (
              <ProtectedRoute>
                <PayAppointmentPage />
              </ProtectedRoute>
            ),
          },
          {
            path: APP_ROUTES.payment.result,
            element: (
              <ProtectedRoute>
                <PaymentResultPage />
              </ProtectedRoute>
            ),
          },
          {
            path: APP_ROUTES.account.root,
            element: (
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            ),
            children: [
              { index: true, element: <Navigate to={APP_ROUTES.account.appointments} replace /> },
              { path: 'citas', element: <MyAppointmentsPage /> },
              { path: 'pagos', element: <MyPaymentsPage /> },
              { path: 'perfil', element: <ProfilePage /> },
            ],
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
      // Pasarela simulada: solo existe en desarrollo con datos de prueba.
      ...(env.mocksEnabled
        ? [
            {
              path: APP_ROUTES.payment.simulator,
              element: (
                <ProtectedRoute>
                  <GatewaySimulatorPage />
                </ProtectedRoute>
              ),
            },
          ]
        : []),
      {
        path: A.root,
        element: (
          <ProtectedRoute role="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <DashboardPage /> },
          { path: rel(A.agenda), element: <AgendaPage /> },
          { path: rel(A.services), element: <ServicesAdminPage /> },
          { path: rel(A.users), element: <UsersPage /> },
          { path: rel(A.payments), element: <PaymentsAdminPage /> },
          { path: rel(A.socialLinks), element: <SocialLinksPage /> },
          { path: rel(A.reports), element: <ReportsPage /> },
          { path: rel(A.googleCalendar), element: <GoogleCalendarPage /> },
          { path: '*', element: <Navigate to={A.root} replace /> },
        ],
      },
    ],
  },
]
