import Image from 'next/image';
import imageLogo from '/public/images/img2.webp';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row relative h-screen">
      {/* Contenedor de la imagen - oculto en móvil, mitad de la pantalla en desktop */}
      <div className="hidden md:block md:w-1/2 relative">
        <Image
          src={imageLogo || "/placeholder.svg"}
          alt="Authentication background"
          fill
          priority
          style={{ objectFit: "cover" }}
        />
      </div>
      
      {/* Contenedor del contenido - pantalla completa en móvil, mitad en desktop */}
      <div className="w-full md:w-1/2 flex items-center justify-center min-h-screen md:min-h-0">
        <div className="w-full md:max-w-[506px] px-6 md:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}