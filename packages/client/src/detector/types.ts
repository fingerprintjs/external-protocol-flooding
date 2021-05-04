export enum BrowserFamily {
  Safari,
  Chrome,
  Firefox,
  TorBrowser,
  Unknown,
}

/**
 * A single entry of an application for detector
 */
export type ApplicationCandidate = {
  title: string
  scheme: string
  icon: string
}

/**
 * We need the crossBrowserDemo param to separate messages from Webpack or others
 */
export type GenericMessage = { crossBrowserDemo: true } & ControlMessage
export type ControlMessage =
  | {
      type: 'redirected'
    }
  | {
      type: 'force_reload'
    }
  | {
      type: 'pdf_loaded'
    }

export type GenericMessageType = {
  [K in keyof ControlMessage]: ControlMessage[K]
}[keyof ControlMessage]
