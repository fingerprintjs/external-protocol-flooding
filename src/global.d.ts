declare module 'assets/*' {
  const filePath: string
  export default filePath
}

declare module '*.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}
