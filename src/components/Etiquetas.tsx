import { useState } from "react"
import {withMask, useHookFormMask} from 'use-mask-input'
import {useForm} from 'react-hook-form'


type Cliente = {nome:string, email:string, cpf:string, local?:string, numero?:string, bairro?:string, cidade?:string, estado?:string, cep?:string}

export default function Etiquetas(){

    // const [cliente, setCliente] = useState<Cliente>({nome:"",email:"",cpf:""})

    const {handleSubmit, register, formState:{errors}, reset, setValue, setFocus} = useForm()

    const resgisterWithMask = useHookFormMask(register)

    const searchCEP = (e: React.FocusEvent<HTMLInputElement>)=>{
        const cep = e.target.value.replace(/\D/g, '')
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(res => res.json())
        .then(data =>{
            setValue('local', data.logradouro)
            setValue('bairro', data.bairro)
            setValue('cidade', data.localidade)
            setValue('estado', data.uf)
            setFocus('numero')
        })
    }

    const [listaClientes, setListaClientes] = useState<Cliente[]>([])

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    //     const {name, value} = e.target
    //     setCliente({...cliente, [name]:value})
    // }

    // const handleSubmit = (e: React.FormEvent)=>{
    //     e.preventDefault()
    //     setListaClientes([...listaClientes, cliente])
    //     setCliente({nome:"",email:"",cpf:""})
    // }
    const onSubmit = (data: any) => {
        setListaClientes([...listaClientes, data])
        reset()
    }

    return(
        <div className="font-sans bg-blue-500 min-h-screen p-5 flex gap-5">
            <form onSubmit={handleSubmit(onSubmit)} className="w-96 m-auto bg-white rounded-md p-1 flex flex-col gap-5">
                <fieldset className="p-5 mb-5">
                    <legend className="text-2xl text-center p-2.5">Dados Pessoais</legend>
                    <input className="mb-1 p-1.5 rounded-md outline-gray-400 w-full border-2 border-gray-200" placeholder="Nome" {...register('nome',{required:'Nome obrigatório!'})} />
                    {errors.nome && <span className="text-red-500 mb-1">{errors.nome.message as string}</span>}
                    <input className="mb-1 p-1.5 rounded-md outline-gray-400 w-full border-2 border-gray-200" placeholder="E-mail" {...register('email', {
                      pattern:{value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/, message: 'E-mail inválido!'}})} />
                    {errors.email && <span className="text-red-500 mb-1">{errors.email.message as string}</span>}  
                    <input className="mb-1 p-1.5 rounded-md outline-gray-400 w-full border-2 border-gray-200" placeholder="CPF" {...resgisterWithMask('cpf','999.999.999-99')}/>
                    {errors.cpf && <span className="text-red-500 mb-1">{errors.cpf.message as string}</span>}  
                </fieldset>
                <fieldset>
                    <legend>Endereço</legend>
                    <input className="mb-1 p-1.5 rounded-md outline-gray-400 w-full border-2 border-gray-200" placeholder="CEP" {...resgisterWithMask('cep','99999-999')}
                    onBlur={searchCEP} />
                    <input className="mb-1 p-1.5 rounded-md outline-gray-400 w-full border-2 border-gray-200" placeholder="Local" {...register('local')} />
                    <input className="mb-1 p-1.5 rounded-md outline-gray-400 w-full border-2 border-gray-200" placeholder="Número" {...register('numero')} />
                    <input className="mb-1 p-1.5 rounded-md outline-gray-400 w-full border-2 border-gray-200" placeholder="Bairro" {...register('bairro')} />
                    <input className="mb-1 p-1.5 rounded-md outline-gray-400 w-full border-2 border-gray-200" placeholder="Cidade" {...register('cidade')} />
                    <input className="mb-1 p-1.5 rounded-md outline-gray-400 w-full border-2 border-gray-200" placeholder="Estado" {...register('estado')} />
                </fieldset>
                    <button className="py-1.5 px-4 rounded-md bg-green-500 text-white" type="submit">Criar</button>
            </form>
            <div className="mt-4 w-full bg-gray-400 flex flex-wrap justify-evenly grow">

                {
                    listaClientes.map((cli, index)=>(

                    <div key={index} className="h-68 p-2.5 border-2 border-blue-900 w-96 m-2.5 bg-blue-500 rounded-md">
                        <p className="mb-1 font-bold">Nome: {cli.nome}</p>
                        <p className="mb-1 font-bold">E-mail: {cli.email}</p>
                        <p className="mb-1 font-bold">CPF: {cli.cpf}</p>
                        <p className="mb-1 font-bold">Local: {cli.local}</p>
                        <p className="mb-1 font-bold">nº: {cli.numero}</p>
                        <p className="mb-1 font-bold">Bairro: {cli.bairro}</p>
                        <p className="mb-1 font-bold">Cidade: {cli.cidade}</p>
                        <p className="mb-1 font-bold">Estado: {cli.estado}</p>
                        <p className="mb-1 font-bold">CEP: {cli.cep}</p>
                    </div>
                    ))
                }
            </div>
        </div>
    )
}