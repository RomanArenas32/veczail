"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Mail, Key, User, ArrowRight, Eye, Loader2 as ReloadIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { signInSchema } from "@/schemma/auth";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInAction } from "@/action/auth";

const AuthForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setIsLoading(true);
    const result = await signInAction({
      usernameOrEmail: values.usernameOrEmail,
      password: values.password,
    });
    console.log("result", result);
    setIsLoading(false);
  
    if (result?.error) {
      toast({
        variant: "destructive",
        title: result.error,
        description: result.message,
        duration: 4000,
      });
    } else if (result?.success) {
      router.push(result.redirectTo.toString()); // Debería redirigir aquí
    } else {
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-bronze">Grupo Laces</h1>
        <p className="text-charcoal-light mt-2">Ingrese a su cuenta</p>
      </div>

      <div className="space-y-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
            <div className="space-y-8">
              <FormField
                control={form.control}
                name="usernameOrEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email o Usuario</FormLabel>
                    <FormControl>
                      <Input
                        className="text-[#0B1120]"
                        placeholder="Ingrese su email o usuario"
                        {...field}
                        icon={<Mail className="text-[#0B1120]" />}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="text-[#0B1120]"
                          type={showPassword ? "text" : "password"}
                          placeholder="Ingrese su contraseña"
                          {...field}
                        />
                        <Eye
                          size={20}
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#0B1120] size-6"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex w-full items-center">
                <Separator className="shrink hover:cursor-pointer" />
                <Link href="/login">
                  <p className="text-[#667085] whitespace-nowrap font-medium hover:cursor-pointer">
                    Olvide mi contraseña
                  </p>
                </Link>
                <Separator className="shrink" />
              </div>
            </div>
            <Button
              type="submit"
              size={"lg"}
              className="w-full text-white font-bold hover:cursor-pointer"
              disabled={isLoading || form.formState.isSubmitting}
            >
              {isLoading || form.formState.isSubmitting ? (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Ingresar
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AuthForm;