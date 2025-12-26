import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../hooks/useAuth";
import Spinner from "./ui components/Spinner";

export default function ProtectedRoute({ children }) {
  const { session, isLoading } = useAuth();
  const location = useLocation();

  if (!session && isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-black">
        <div className="h-20 w-20 ">
          <img src="/favicon.ico" className="animate-spin" alt="Loading" />
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node,
};
