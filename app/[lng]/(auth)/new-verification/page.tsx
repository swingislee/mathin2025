import { NewVerificationForm } from "@/components/auth/new-verification-form";

type Params = Promise<{ lng: string }>
type SearchParams = Promise<{ [key: string]: string | undefined }>

const NewVerificationPage = async (props: {
  params: Params
  searchParams: SearchParams
}) => {
  const params = await props.params
  const searchParams = await props.searchParams
  const lng = params.lng
  const token = searchParams.token

  return (
    <div>
      <NewVerificationForm lng={lng} token={token!} />
    </div>
  );
};

export default NewVerificationPage;