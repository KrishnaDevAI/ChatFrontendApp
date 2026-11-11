import { useGoogleLogin } from '@react-oauth/google';

import { googleLogin } from 'api/auth';

export default function useGoogleAuth(onSuccess, onError) {
    return useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const data = await googleLogin(tokenResponse.access_token);
                onSuccess(data);
            } catch (error) {
                onError(error);
            }
        },
        onError: () => onError(new Error('Google sign-in was cancelled or failed.'))
    });
}