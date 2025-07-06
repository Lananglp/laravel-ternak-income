import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import AuthSplitLayout from './auth/auth-split-layout';
import AuthCardLayout from './auth/auth-card-layout';

export default function AuthLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
    return (
        <AuthLayoutTemplate title={title} description={description} {...props}>
            {children}
        </AuthLayoutTemplate>
        // <AuthCardLayout title={title} description={description} {...props}>
        //     {children}
        // </AuthCardLayout>
    );
}
