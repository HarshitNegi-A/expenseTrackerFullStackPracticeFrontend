
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({children,isLoggedIn}) => {
  return (
    isLoggedIn?children:<Navigate to='/signup' replace/>  )
}

export default ProtectedRoute