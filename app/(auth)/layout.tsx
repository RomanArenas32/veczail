import Image from "next/image";

export default function Component({ children }: { children: React.ReactNode }) {

    return (
        <div className="flex relative h-screen px-0">

            {/*
         <div className="absolute top-4 md:top-8 left-4 md:left-8 z-[6]">

         <Image
          src="/icons/logo-white.svg"
          alt="Meetlabs Icon"
          width={36}
          height={41}
          priority={true}
          className="flex "
          style={{ height: '41px', width: '36px' }}
        />
      </div>
        */}

            <div
                className="hidden md:flex w-1/2  text-white p-8 flex-col-reverse justify-between relative "
                style={{
                    backgroundImage: "url('/images/image2.jpeg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center">
                <div className="w-full md:max-w-[506px] px-6 md:px-10">{children}</div>
            </div>
        </div>
    );
}