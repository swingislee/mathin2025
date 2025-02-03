import { NewPasswordForm } from "@/components/auth/new-password-form";

type Params = Promise<{ lng: string }>
type SearchParams = Promise<{ [key: string]: string | undefined }>

const NewPasswordPage = async (props: {
  params: Params
  searchParams: SearchParams
}) => {

  const params = await props.params
  const searchParams = await props.searchParams
  const lng = params.lng
  const token = searchParams.token

  return (
    <div>
      <NewPasswordForm lng={lng} token={token!} />
    </div>
  );
};

export default NewPasswordPage;