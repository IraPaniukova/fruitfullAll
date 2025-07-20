import { Box, Button, Stack, Typography } from '@mui/material';
import { useAppSelector } from '../../store/typeHooks';
import { useNavigate } from 'react-router-dom';

export const PrivacyPolicyPage = () => {
    const loggedIn = useAppSelector(state => !!state.auth.accessToken);
    const navigate = useNavigate();

    return (
        <Stack
            alignItems="center"
            spacing={3}
            pt={5}
            width={{ xs: '90%', md: '65%' }}
            mx="auto"
            my={10}
            textAlign="justify"
            sx={{ backgroundColor: 'background.paper', px: 3 }}
        >
            <Typography textAlign='center' variant="h4" fontWeight="bold">
                Privacy Policy for Fruitfull App
            </Typography>

            <Typography variant="body1">
                This Privacy Policy explains how Fruitfull App ("we", "our", "us") collects, uses, and discloses information when you use our application. By using Fruitfull App, you agree to the collection and use of information in accordance with this policy.
            </Typography>

            <Typography variant="h5" component="h2">
                Information We Collect
            </Typography>
            <Typography variant="body1">
                When you use the Fruitfull App and choose to sign in with your Google account, we collect basic profile information from your Google account. This typically includes:
            </Typography>
            <Box component="ul" sx={{ pl: 4 }}> {/* Use Box for ul to apply sx */}
                <Typography component="li" variant="body1">Your email address</Typography>
                <Typography component="li" variant="body1">Your public profile information (such as your name and profile picture)</Typography>
            </Box>
            <Typography variant="body1">
                We collect this information solely for the purpose of user authentication and to enable the core functionalities of the Fruitfull App.
            </Typography>

            <Typography variant="h5" component="h2">
                How We Use Your Information
            </Typography>
            <Typography variant="body1">
                The information we collect from your Google account is used exclusively for the following purposes:
            </Typography>
            <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body1">Authenticating your identity to provide secure access to the app.</Typography>
                <Typography component="li" variant="body1">Personalizing your experience within the Fruitfull App (e.g., displaying your name).</Typography>
                <Typography component="li" variant="body1">Providing and improving the services and features offered by the Fruitfull App.</Typography>
                <Typography component="li" variant="body1">For internal analytics to understand app usage and improve user experience.</Typography>
            </Box>
            <Typography variant="body1">
                We do not use your information for advertising, marketing, or any purpose unrelated to the app's core functionality.
            </Typography>

            <Typography variant="h5" component="h2">
                Information Sharing and Disclosure
            </Typography>
            <Typography variant="body1">
                We are committed to protecting your privacy. We do not share, sell, rent, or trade your personal information with third parties for their marketing or commercial purposes. Any sharing of data would only occur:
            </Typography>
            <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body1">With service providers who perform services on our behalf (e.g., hosting providers), under strict confidentiality agreements.</Typography>
                <Typography component="li" variant="body1">To comply with legal obligations (e.g., responding to a court order or subpoena).</Typography>
                <Typography component="li" variant="body1">To protect our rights, property, or safety, or the rights, property, or safety of our users or others.</Typography>
            </Box>

            <Typography variant="h5" component="h2">
                Data Security
            </Typography>
            <Typography variant="body1">
                We implement reasonable security measures designed to protect your information from unauthorized access, use, or disclosure. However, please be aware that no method of transmission over the internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </Typography>

            <Typography variant="h5" component="h2">
                Your Choices and Rights
            </Typography>
            <Typography variant="body1">
                You can review and update your profile information within the Fruitfull App. If you wish to remove your Google account association from the Fruitfull App, please contact us directly using the contact information provided below.
            </Typography>

            <Typography variant="h5" component="h2">
                Changes to This Privacy Policy
            </Typography>
            <Typography variant="body1">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </Typography>

            <Typography variant="h5" component="h2">
                Contact Us
            </Typography>
            <Typography variant="body1">
                If you have any questions about this Privacy Policy, please contact us at: <strong>fruitfull.iq@gmail.com</strong>
            </Typography>

            <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary' }}>
                Last updated: July 19, 2025
            </Typography>

            {!loggedIn &&
                <Box zIndex={1} position='absolute' top={0} left={0} pl={2} >
                    <Button onClick={() => { navigate('/') }} variant='text' sx={{ color: 'text.secondary' }}>
                        Home
                    </Button>
                </Box>}
        </Stack>
    );
};
