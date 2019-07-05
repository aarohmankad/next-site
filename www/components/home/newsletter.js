import React from 'react';

import Container from '../container';

import EmailForm from '../email-form';

class Newsletter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    };

    this.onEmail = this.email.bind(this);
  }

  email(val) {
    this.setState({ loading: true });
    fetch('https://api-subscribe-nextjs.sh', {
      method: 'POST',
      body: JSON.stringify({ email: val })
    })
      .then(res => {
        if (res.status === 400) {
          return res.json().then(body => {
            if (body.already_subscribed) {
              this.setState({ loading: false, success: true });
            } else {
              throw new Error('Bad request');
            }
          });
        }
        if (res.status === 200) {
          this.setState({ loading: false, success: true });
        } else {
          throw new Error('Bad response');
        }
      })
      .catch(() => {
        this.setState({ loading: false, errorMessage: true });
      });
  }

  render() {
    return (
      <Container gray wide overflow center padding role="region" aria-labelledby="customers">
        <div className="content">
          <h2>Stay tuned for upcoming releases.</h2>
          {this.state.success ? (
            <p className="subscribe-success">Thanks for subscribing!</p>
          ) : (
            <div className="email-form">
              <EmailForm
                errorMessage={this.state.errorMessage}
                loading={this.state.loading}
                onEmail={this.onEmail}
                buttonLabel="SUBSCRIBE"
                message="Subscribe"
                align="left"
                withButton
                withIcon
              />
            </div>
          )}
        </div>
        <style jsx>{`
          .content {
            display: grid;
            grid-template-columns: 1fr 0.5fr;
            align-items: center;
            margin: 2rem auto;
            padding: 0 1.5rem;
            max-width: 1024px;
          }
          .content h2 {
            font-size: 2rem;
            text-align: left;
          }
          .email-form {
            margin-left: auto;
          }

          @media screen and (max-width: 640px) {
            .content {
              display: grid;
              grid-template-columns: 1fr;
            }
            .content h2 {
              text-align: center;
            }
            .email-form {
              margin: auto;
              margin-top: 2rem;
            }
          }
        `}</style>
      </Container>
    );
  }
}

export default Newsletter;
