import { useSelector } from 'react-redux';

const WithAuth = (WrappedComponent) => {
  const token = useSelector((state) => state.data.token);

  if (!token) {
    // Redirect to login page or display an error message
    return <div>You are not authorized to access this page.</div>;
  }

  return <WrappedComponent />;
};

export default WithAuth;