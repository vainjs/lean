import ReactDOM from 'react-dom'
import App from './App'
import 'app.css'

ReactDOM.render(<App />, document.getElementById('app'))

if (module.hot) {
  module.hot.accept()
}
