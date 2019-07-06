import { SkipNavContent } from '@reach/skip-nav';
import { useAmp } from 'next/amp';

import Page from '../components/page';
import Header from '../components/header';
import Footer from '../components/footer';
import Navbar from '../components/navbar';
import Notification from '../components/notification';

import Intro from '../components/home/intro';
import Demo from '../components/home/demo';
import Features from '../components/home/features';
import Customers from '../components/home/customers';
import Learn from '../components/home/learn';
import SocialMeta from '../components/social-meta';

export default () => {
  const isAmp = useAmp();

  return (
    <>
      <Header height={64} shadow defaultActive>
        <Navbar hideLogo={{ desktop: !isAmp, mobile: false }} />
      </Header>
      <Page title="Next.js - The React Framework">
        <SocialMeta
          image="/static/twitter-cards/home.jpg"
          title="Next.js - The React Framework"
          url="https://nextjs.org"
          description="Production grade React applications that scale. The world’s leading companies use Next.js to build server-rendered applications, static websites, and more."
        />
        <SkipNavContent />
        <Notification href="/blog/next-8" title="Next 8 is out!" titleMobile="Next 8 is out!">
          <b>Next 8 is out!</b> — Serverless mode, performance and security improvements and more.
          <span className="highlight">Learn More →</span>
        </Notification>
        <Intro isAmp={isAmp} />
        <Demo />
        <Features />
        <Customers />
        <Learn />
        <Footer />
      </Page>
    </>
  );
};

export const config = {
  amp: 'hybrid'
};
