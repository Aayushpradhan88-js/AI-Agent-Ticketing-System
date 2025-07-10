"use Client"

import { useState } from "react";
import {useForm} from "react-hook-form"
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import { object } from "zod/v4-mini";

type FormType = "sign-in" | "sign-up";

const AuthFormReolver = (formType : FormType) => {
    return z.object({
        email: z.string().email(),
        fullname: 
          formType === 'sign-up' ? z.string().min(2).max(20) : z.string().optional()
    });
}

function AuthForm({type}: {formType: FormType}) {
    const[isLoading, setIsLoading] = useState(false);
    const[errorMessage, setErrorMessage] = useState("");
    const[accountId, setAccountId] = useState(null);

    const formSchema = AuthFormReolver(type);

    const form = useForm<z.infer<typeof formSchema>>({
            resolver: zodResolver(formSchema),
            defaultValues: {
                email: "",
                fullname: ""
            }
    });

    const formSubmit = async (values: z.inferor<typeof formSchema>) => {
        setIsLoading(true)
        setErrorMessage("");

        const user = type === "signup" ? await createAccount({
            fullname: values.fullname | "",
            email: values.email
        }) : await SignInUser({ email: values.email})
    }
}

export default AuthForm;