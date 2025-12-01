import {
  useNavigate as useReactRouterNavigate,
  type NavigateOptions,
} from "react-router-dom";

export default function useNavigate() {
  const navigate = useReactRouterNavigate();

  return (to: string, options?: NavigateOptions) => {
    navigate(to, {
      viewTransition: true,
      ...options,
    });
  };
}
