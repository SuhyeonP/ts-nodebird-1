import React, { ReactElement } from 'react';
import Helmet, { HelmetData } from 'react-helmet';
import Document, { Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

interface Props {
  helmet: HelmetData,
  styles: ReactElement,
}

class MyDocument extends Document<Props> {
  static async getInitialProps(context) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = context.renderPage;

    try {
      context.renderPage = () => originalRenderPage({
        enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
      });
      const initialProps = await Document.getInitialProps(context);
      return {
        ...initialProps,
        helmet: Helmet.renderStatic(),
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    const { htmlAttributes, bodyAttributes, ...helmet } = this.props.helmet;
    const htmlAttrs = htmlAttributes.toComponent();
    const bodyAttrs = bodyAttributes.toComponent();

    return (
      <html {...htmlAttrs} lang="ko">
        <head>
          {this.props.styles}
          {Object.values(helmet).map((el) => el.toComponent())}
        </head>
        <body {...bodyAttrs}>
          <Main />
          {process.env.NODE_ENV === 'production'
          && <script src="https://polyfill.io/v3/polyfill.min.js?features=default%2Ces2015%2Ces2016%2Ces2017%2Ces2018%2Ces2019" />}
          <NextScript />
        </body>
      </html>
    );
  }
}

export default MyDocument;
