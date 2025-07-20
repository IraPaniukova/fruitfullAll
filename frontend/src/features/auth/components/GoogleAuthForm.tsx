// src/components/Auth/GoogleAuthForm.tsx

import React from 'react';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';
import { useAppDispatch, useAppSelector } from '../../../store/typeHooks';
import { googleAuthThunk } from '../authThunks';

export const GoogleAuthForm: React.FC = () => {
    const dispatch = useAppDispatch();

    const handleGoogleCredentialResponse = async (credentialResponse: CredentialResponse) => {
        try {
            if (credentialResponse.credential) {
                await dispatch(googleAuthThunk(credentialResponse.credential));
            } else {
                console.error("Google authentication failed: No credential received from Google.");
                alert("Google sign-in failed: No valid credential received.");
            }
        } catch (err: any) {
            console.error('Google authentication failed:', err);
            let errorMessage = "Google sign-in failed. Please try again.";
            if (err.message) {
                errorMessage = `Google sign-in failed: ${err.message}`;
            }
            alert(errorMessage);
        }
    };

    const handleGoogleError = () => {
        console.error('Google login component error: User canceled or other issue.');
        alert('Google sign-in was canceled or encountered an error. Please try again.');
    };

    const currentThemeMode = useAppSelector((state) => state.theme);
    const googleButtonTheme = currentThemeMode === 'dark' ? 'filled_black' : 'outline';

    return (
        <div>
            <GoogleLogin
                onSuccess={handleGoogleCredentialResponse}
                onError={handleGoogleError}
                theme={googleButtonTheme}
                size="large"
            />
        </div>
    );
};