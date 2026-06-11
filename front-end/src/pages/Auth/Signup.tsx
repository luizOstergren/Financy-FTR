import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import logoIcon from "@/assets/logoIcon.svg"
import { Link } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { EyeClosedIcon, EyeIcon, LockIcon, LogIn, MailIcon, UserIcon } from "lucide-react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { useAuthStore } from "@/stores/auth"
import { z } from "zod"
import { toast } from "sonner"

const signupSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres"),
 });

 type RegisterInput = z.infer<typeof signupSchema>;

export function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false);

  const signup = useAuthStore((state) => state.signup)

  const handlePasswordVisibility = () => {
      setPasswordVisible((current) => !current);
    };


  const result = signupSchema.safeParse({ name, email, password });
  if (!result.success) {
    result.error.issues.forEach((err) => {
      toast.error(err.message);
      setLoading(false);
      return;
    });
   }

  const handleSubmit = async (e: {preventDefault: () => void}) => {
    e.preventDefault()
    setLoading(true)

    try {
      const signupMutate = await signup(result.data as RegisterInput)
      if (signupMutate) {
        toast.success("Cadastro realizado com sucesso!")
      }
    } catch (error) {
      toast.error("Erro ao realizar o cadastro");
      console.error("Signup error:", error);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center min-h-[calc(100vh-4rem)] justify-center flex-col gap-6">
      <img src={logoIcon} className="w-32 h-8" />
      <Card className="w-full max-w-md rounded-xl justify-between items-center">
        <CardHeader className="items-center">
          <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
          <CardDescription>
            Comece a controlar suas finanças ainda hoje
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} id="register-form" className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Nome completo</Label>
              <InputGroup className="border-gray-300 py-5">
                  <InputGroupInput
                    id="fullName"
                    type="text"
                    placeholder="Seu nome completo"
                    className="border-gray-200  px-4 py-5"
                    required
                    value={name}
                    autoComplete="name"
                    onChange={(e) => setName(e.target.value)}
                  />
                  <InputGroupAddon align="inline-start">
                    <UserIcon className="text-muted-foreground" />
                  </InputGroupAddon>
                </InputGroup>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <InputGroup className="border-gray-300 py-5">
                  <InputGroupInput
                    id="email"
                    type="email"
                    placeholder="mail@example.com"
                    className="border-gray-200  px-4 py-5"
                    required
                    value={email}
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <InputGroupAddon align="inline-start">
                    <MailIcon className="text-muted-foreground" />
                  </InputGroupAddon>
                </InputGroup>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Senha</Label>
              <InputGroup className="border-gray-300 py-5">
                  <InputGroupInput
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="Digite sua senha"
                    required
                    value={password}
                    autoComplete="new-password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputGroupAddon align="inline-start">
                    <LockIcon className="text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handlePasswordVisibility}
                      aria-label={
                        passwordVisible ? "Ocultar senha" : "Mostrar senha"
                      }
                    >
                      {passwordVisible ? (
                        <EyeIcon className="text-muted-foreground" />
                      ) : (
                        <EyeClosedIcon className="text-muted-foreground" />
                      )}
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
            </div>
            <Button 
             type="submit" 
             form="register-form"
             className="w-full bg-brand-base hover:bg-brand-dark text-white" 
             disabled={loading}>
              Cadastrar
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center items-center flex-col">
            <div className="flex items-center my-4 w-full justify-center">
            <Separator className="grow max-w-40 bg-gray-300" />
            <span className="px-4 text-gray-500">ou</span>
            <Separator className="grow max-w-40 bg-gray-300" /> 
            </div>

            <div className="text-gray-600 mb-4">Já tem uma conta?</div>
            <Button variant="outline" className="w-full border-gray-300" asChild>
            <Link to="/login" className="items-center justify-between">
                <LogIn />
                Fazer login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}