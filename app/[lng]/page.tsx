import { Translate } from "@/lib/i18n";
import Image from 'next/image'
import Navbar from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

type Params = Promise<{ lng: string }>

export default async function Page(props: {
  params: Params
}){
  const { lng } = await props.params
  const { t } = await Translate(lng)
  

  return (
    <div>
      <h1 className={`
         absolute whitespace-nowrap justify-center top-16 text-7xl font-semibold 
         left-1/2 -translate-x-1/2 dl:left-14  dl:translate-x-0 dl:text-[5rem]
         ${lng === 'en' ? 'dl:tracking-tight italic':'tracking-wide  dl:tracking-widest'}
        `}>    
          {t('title')}
      </h1>     
      <div className="absolute w-screen h-screen -z-20 overflow-hidden">
        <Image
        src={"/assets/Main.png"} width={1000} height={1000} alt="Picture of the author"
        className="relative h-auto w-full sl:h-full sl:w-auto -z-20 scale-125
        left-1/2 top-[45%] sl:top-[57%]  -translate-x-1/2 -translate-y-1/2" 
        />
      </div>
      <Navbar lng={lng} page="home" />   

      <div className="absolute w-full h-full z-20 overflow-hidden pointer-events-none">
        <Sidebar lng={lng}/>
      </div>
      
    </div>
  )
}