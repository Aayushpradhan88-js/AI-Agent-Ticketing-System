"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

type FormType = "sign-in" | "sign-up";

const authFormSchema = (formtype: FormType) => {
    return z.object({
        email: z.string().email(),
        fullName: formtype === "sign-up" ?
            z.string().min(2).max(50) :
            z.string().optional()
    });
};

const AuthForm({ type }: { type: FormType }) => {
    const formSchema = authFormSchema(type)
    const form = useForm< z.infer< typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: '',
            email: ''
        },
    });

    const onSubmit = await (values: z.infer<typeof formSchema>) => {
        console.log(values);

        return (
            <>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
                        <h1 className='form-title'>
                            {type === 'sign-in' ? 'Sign In' : 'Sign Up'}
                        </h1>

                        {type === 'sign-up' &&
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public display name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        }
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </>
        )
    }
}

export default AuthForm;