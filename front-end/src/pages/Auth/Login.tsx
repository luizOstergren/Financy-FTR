import { useState } from "react"
import logoIcon from "@/assets/logoIcon.svg"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Separator } from "@/components/ui/separator"
import { UserRoundPlus } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { useAuthStore } from "@/stores/auth"
import { toast } from "sonner"


export function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const login = useAuthStore((state) => state.login)

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setLoading(true)

    try {
      const loginMutate = await login({
        email,
        password,
      })
      if (loginMutate) {
        toast.success("Login realizado com sucesso!")
      }
    } catch (error) {
      toast.error("Falha ao realizar o login!")
      console.error("Houve um erro ao tentar fazer login:", error)
    } finally {
      setLoading(false)
    }
   }

  return (
    <div className="flex items-center min-h-[calc(100vh-4rem)] justify-center flex-col gap-6">
      <img src={logoIcon} className="w-32 h-8" />
      <Card className="w-full max-w-md rounded-xl justify-between items-center">
        <CardHeader className="items-center">
          <CardTitle className="text-2xl font-bold">Fazer login</CardTitle>
          <CardDescription>
            Entre na sua conta para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end items-center gap-4">
              
                <FieldGroup className="mx-auto  items-center  max-w-62.5">
                  <Field orientation={"horizontal"} className="normal-case text-sm">
                    <Checkbox id="remember" name="remember" className="cursor-pointer"  />
                    <FieldLabel htmlFor="remember" className="flex items-center cursor-pointer">
                      Lembrar de mim
                    </FieldLabel>
                  </Field>
                </FieldGroup>

                <Link to="/forgot-password" className="text-sm text-green-700 hover:text-green-600 transition-colors">
                  Recuperar senha
                </Link>
              
            </div>
            <Button type="submit" 
            className="w-full text-white bg-brand-base hover:bg-brand-dark" 
            disabled={loading}>
              Entrar
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center items-center flex-col">
            <div className="flex items-center my-6 w-full justify-center">
            <Separator className="grow max-w-40 bg-gray-300" />
            <span className="px-4 text-gray-500">ou</span>
            <Separator className="grow max-w-40 bg-gray-300" /> 
            </div>

            <div className="text-gray-600 mb-4">Ainda não tem uma conta?</div>
            <Button variant="outline" className="w-full border-gray-300" asChild>
            <Link to="/signup" className="items-center justify-between">
                <UserRoundPlus />
                Criar conta
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}