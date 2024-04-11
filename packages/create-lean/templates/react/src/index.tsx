import ReactDOM from 'react-dom'
import 'app.css'

ReactDOM.render(<Root />, document.getElementById('app'))

if (module.hot) {
  module.hot.accept()
}
