"use client"

import FormInput from "@/components/form-inputs";
import FormButton from "@/components/form-btn";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { handleForm } from "./action";

export default function Login() {

    const [state, action] = useFormState(handleForm, null)

    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">안녕하세요!</h1>
                <h2 className="text-xl">Log in with email and password</h2>
            </div>
            <form action={action} className="flex flex-col gap-3">
                <FormInput
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    errors={[""]} 
                    />
                <FormInput
                    name="passwd"
                    type="password"
                    placeholder="password"
                    required
                    errors={state?.errors ?? []} 
                    />
                <FormButton text="Log in" />
            </form>
            <SocialLogin />
        </div>
    );
}