import Footer from "@/components/footer/footer";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div>
            {children}
            <Footer />
        </div>
    );
}
