import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { initWindowMessaging } from '../detector/window'
import * as routes from './routes'

initWindowMessaging()

export default function App() {
  return (
    <Switch>
      <Route path='/pdf' component={routes.Pdf} />
      <Route path='/blank' component={routes.Blank} />
      <Route path='/popup' component={routes.Popup} />
      <Route path='/' component={routes.Home} />
    </Switch>
  )
}