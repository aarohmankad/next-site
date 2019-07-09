import '../lib/polyfill';
import React from 'react';
import App, { Container } from 'next/app';
import url from 'url';

import { setToken, removeToken, getToken } from '../lib/learn/authenticate';
import { getUser } from '../lib/learn/api';
import { UserProvider } from '../lib/learn/user';
import NProgress from '../components/nprogress';

// Migrate the loginToken to a new cookie with the path set to `/`, this is just temporal and
// should be removed in 30 days
function replaceLoginCookie() {
  const Cookies = require('js-cookie');
  const loginToken = Cookies.get('loginToken');

  if (loginToken) {
    Cookies.remove('loginToken', { path: '/learn' });
    // if a cookie with the path `/learn` was removed then move it to `/`
    if (!Cookies.get('loginToken')) {
      Cookies.set('loginToken', loginToken, {
        path: '/',
        expires: 30 // 30 days
      });
    }
  }
}

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    const isLearnPage = ctx.pathname.startsWith('/learn');

    if (!process.browser) {
      const {
        res,
        asPath,
        query: { loginToken, logout }
      } = ctx;

      if ((loginToken && loginToken.length < 50) || logout) {
        const parsedAsPath = url.parse(asPath);

        if (loginToken) {
          setToken(ctx, loginToken);
          res.writeHead(302, {
            Location: parsedAsPath.pathname
          });
          res.end();
          return {};
        }

        if (logout) {
          removeToken(ctx);
          res.writeHead(302, { Location: parsedAsPath.pathname });
          res.end();
          return {};
        }
      }

      if (!isLearnPage) {
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
      }
    }

    const props = { pageProps: {} };

    if (isLearnPage) {
      const loginToken = getToken(ctx);

      if (loginToken) {
        const user = await getUser(loginToken);

        // If the user is null then the loginToken is no longer valid
        if (user === null) removeToken(ctx);

        props.user = user || undefined;
      }
      if (!Component.getInitialProps) {
        // Make sure that learn pages have getInitialProps set so they don't get catched
        Component.getInitialProps = () => ({});
      }
    }

    if (Component.getInitialProps) {
      props.pageProps = await Component.getInitialProps(ctx);
    }

    return props;
  }

  componentDidMount() {
    replaceLoginCookie();
  }

  componentDidUpdate() {
    replaceLoginCookie();
  }

  render() {
    const { Component, pageProps, user } = this.props;

    return (
      <Container>
        <UserProvider user={user}>
          <Component {...pageProps} />
        </UserProvider>
        <NProgress />
      </Container>
    );
  }
}
