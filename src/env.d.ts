declare namespace NodeJS {
  interface ProcessEnv {
    JWT_SECRET: string
    POSTGRES_HOST: string
    POSTGRES_USERNAME: string
    POSTGRES_PASSWORD: string
    POSTGRES_DATABASE: string
    POSTGRES_TEST_DATABASE: string
    EMAIL_USERNAME: string
    EMAIL_PASSWORD: string
    DOMAIN_NAME: string
  }
}
