import { useEffect, useState } from 'react';
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import ReactMarkdwon from 'react-markdown';
import gql from 'graphql-tag';

export default function Demo() {
  const [articles, changeArticle] = useState([]);

  const client = new ApolloClient({
    uri: `https://graphql.contentful.com/content/v1/spaces/${process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID}`,
    cache: new InMemoryCache(),
    headers: {
      authorization: `Bearer ${process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN}`
    },
  });

  useEffect(() => {
    client.query({
      query: gql`
        query ($preview: Boolean) {
          articleCollection (preview: $preview) {
            items {
              title
              content {
                json
              }
              createdAt
              markdown
            }
          }
        }
      `,
    }).then(res => changeArticle(res.data.articleCollection.items));
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <ul>
          { articles.map((article, id) => {
            return (
              <li key={id}>
                <strong>{ article.title }</strong>
                <div>{ documentToReactComponents(article.content.json) }</div>
                <span style={ { color: 'lightgray' } }>{ article.createdAt }</span>
                <ReactMarkdwon skipHtml={true}>{article.markdown}</ReactMarkdwon>
              </li>
            )
          }) }
        </ul>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
        </a>
      </footer>
    </div>
  )
}
