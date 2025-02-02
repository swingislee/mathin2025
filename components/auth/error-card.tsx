import { BsExclamationTriangle } from "react-icons/bs";
import { CardWrapper } from "./card-wrapper";

export const ErrorCard = () => {
  return (
    <div>
        <CardWrapper
            headerLabel="Oops! Something went wrong!"
            titleLabel="Auth"
            backButtonHref="/login"
            backButtonLabel="Back to login"            
        >
            <div className="w-full flex justify-center items-center" >
                <BsExclamationTriangle  className="text-destructive"/>
            </div>
        </CardWrapper>
    </div>
  );
};