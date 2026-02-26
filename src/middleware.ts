import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import { auth } from "@/auth";

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  return intlMiddleware(req);
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(de|en|uk)/:path*']
};
