import { ResetForm } from "@/components/auth/reset-form";

type Params = Promise<{ lng: string }>
type SearchParams = Promise<{ [key: string]: string | undefined }>

const ResetPage = async (props: {
  params: Params
  searchParams: SearchParams
})  => { 

  const params = await props.params
  const lng = params.lng
  
  return (
    <ResetForm lng={lng} />
  );
};

export default ResetPage;