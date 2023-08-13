/*
Authors : Anupam Mallick
Website : 
App Name : Agro Web App
Created : 20-Nov-2021
*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './layouts/users/users.component';
import { ErrorsComponent } from './layouts/errors/errors.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'categories',
        loadChildren: () => import('./components/categories/categories.module').then(m => m.CategoriesModule),
        data: { title: 'Categories' }
      },
      {
        path: 'home',
        loadChildren: () => import('./components/home/home.module').then(m => m.HomeModule),
        data: { title: 'Home' }
      },
      {
        path: 'product-detail',
        loadChildren: () => import('./components/product-detail/product-detail.module').then(m => m.ProductDetailModule),
        data: { title: 'Product Details' }
      },
      {
        path: 'orders',
        loadChildren: () => import('./components/orders/orders.module').then(m => m.OrdersModule),
        canActivate: [AuthGuard],
        data: { title: 'Orders' }
      },
      {
        path: 'order-detail',
        loadChildren: () => import('./components/order-detail/order-detail.module').then(m => m.OrderDetailModule),
        canActivate: [AuthGuard],
        data: { title: 'Order Details' }
      },
      {
        path: 'account',
        loadChildren: () => import('./components/account/account.module').then(m => m.AccountModule),
        canActivate: [AuthGuard],
        data: { title: 'Account' }
      },
      {
        path: 'checkout',
        loadChildren: () => import('./components/checkout/checkout.module').then(m => m.CheckoutModule),
        canActivate: [AuthGuard],
        data: { title: 'Checkout' }
      },
      {
        path: 'privacy-policy',
        loadChildren: () => import('./components/privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyModule),
        data: { title: 'Privacy Policy' }
      },
      {
        path: 'contact',
        loadChildren: () => import('./components/contact/contact.module').then(m => m.ContactModule),
        data: { title: 'Contact' }
      },
      {
        path: 'refund-policy',
        loadChildren: () => import('./components/refund-policy/refund-policy.module').then(m => m.RefundPolicyModule),
        data: { title: 'Refund Policy' }
      },
      {
        path: 'help',
        loadChildren: () => import('./components/help/help.module').then(m => m.HelpModule),
        data: { title: 'Help' }
      },
      {
        path: 'login',
        loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule),
        data: { title: 'Login' }
      },
      {
        path: 'register',
        loadChildren: () => import('./components/register/register.module').then(m => m.RegisterModule),
        data: { title: 'Categories' }
      },
      {
        path: 'sub-categoris',
        loadChildren: () => import('./components/subcats/subcats.module').then(m => m.SubcatsModule),
        data: { title: 'Sub Categories' }
      },
      {
        path: 'reset',
        loadChildren: () => import('./components/reset/reset.module').then(m => m.ResetModule),
        data: { title: 'Reset' }
      },
      {
        path: 'faq',
        loadChildren: () => import('./components/faq/faq.module').then(m => m.FaqModule),
        data: { title: 'Faqs' }
      },
      {
        path: 'top-picked',
        loadChildren: () => import('./components/top-picked/top-picked.module').then(m => m.TopPickedModule),
        data: { title: 'Top Picked' }
      },
      {
        path: 'top-stores',
        loadChildren: () => import('./components/top-store/top-store.module').then(m => m.TopStoreModule),
        data: { title: 'Top Stores' }
      },
      {
        path: 'top-offers',
        loadChildren: () => import('./components/top-offers/top-offers.module').then(m => m.TopOffersModule),
        data: { title: 'Top Offers' }
      },
      {
        path: 'search',
        loadChildren: () => import('./components/search/search.module').then(m => m.SearchModule),
        data: { title: 'Search' }
      },
      {
        path: 'stores-products',
        loadChildren: () => import('./components/stores-product/stores-product.module').then(m => m.StoresProductModule),
        data: { title: 'Categories' }
      },
      {
        path: 'paytmcallback',
        loadChildren: () => import('./components/paytmcallback/paytmcallback.module').then(m => m.PaytmcallbackModule),
        data: { title: 'Success' }
      },
      {
        path: 'instamojocallback',
        loadChildren: () => import('./components/instamojocallback/instamojocallback.module').then(m => m.InstamojocallbackModule),
        data: { title: 'Success' }
      },
      {
        path: 'flutterwavecallback',
        loadChildren: () => import('./components/flutterwavecallback/flutterwavecallback.module').then(m => m.FlutterwavecallbackModule),
        data: { title: 'Success' }
      },
      {
        path: 'chats',
        loadChildren: () => import('./components/chats/chats.module').then(m => m.ChatsModule),
        canActivate: [AuthGuard],
        data: { title: 'Chats' }
      },
      {
        path: 'about',
        loadChildren: () => import('./components/about/about.module').then(m => m.AboutModule),
        canActivate: [AuthGuard],
        data: { title: 'About' }
      },
      {
        path: '404',
        component: ErrorsComponent
      },
      {
        path: '**',
        component: ErrorsComponent
      }

    ]
  },
  {
    path: '**',
    component: ErrorsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
