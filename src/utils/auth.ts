
export interface AuthLocationState {
  from: string;
  formData?: any;
}

export const getAuthRedirectState = (state: any): AuthLocationState => {
  return {
    from: state?.from || '/',
    formData: state?.formData
  };
};
