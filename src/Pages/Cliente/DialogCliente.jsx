import { Alert,Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { cpf } from 'cpf-cnpj-validator'
import { useState } from "react";
export default function DialogCliente(props) {
    const[erro,setErro] = useState(null)
    function validarNome(nome) {
  // Remove espaços extras no início/fim e normaliza espaços duplos internamente
  const nomeLimpo = nome.trim().replace(/\s+/g, ' ');

  // Regex que valida:
  // ^[A-Za-zÀ-ÖØ-öø-ÿ]+ -> Primeira palavra (apenas letras e acentos)
  // (?: [A-Za-zÀ-ÖØ-öø-ÿ]+)+$ -> Uma ou mais palavras seguintes, separadas por um espaço simples
  const regexNomeCompleto = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?: [A-Za-zÀ-ÖØ-öø-ÿ]+)+$/;

  return regexNomeCompleto.test(nomeLimpo);
}
    function enviar(formdata) {
        let cliente = {
            nome: formdata.get("nome"),
            cpf: cpf.format(formdata.get("cpf"))
        }
        let cpfValidado = cpf.isValid(cliente.cpf)
        let nomeValidado = validarNome(cliente.nome)
        console.log(nomeValidado)
        if(cpfValidado==true && nomeValidado==true) {
           return props.onEnviar(cliente)
        } else {
            setErro(<Alert severity="error">Valor de CPF invalido ou Nome Invalido</Alert>)
        }
        
    }
    return <>
        <Dialog open fullWidth maxWidth="sm">
            <form action={enviar}>
                <DialogTitle align="center">
                    {props.clienteEditar ? `Editar cliente ID:${props.clienteEditar.id}` : "Cadastro de Cliente novo"}
                </DialogTitle>
                <DialogContent>
                     {erro}
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <TextField label="Nome Completo" name="nome" defaultValue={props.clienteEditar?.nome} variant="outlined" required fullWidth />
                        <TextField label="CPF" name="cpf" defaultValue={props.clienteEditar?.cpf} variant="outlined" required fullWidth />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="warning" type="button" onClick={props.onCancelar}>Cancelar</Button>
                    <Button variant="contained" color="primary" type="submit">
                        {props.clienteEditar ? "Atualizar" : "Cadastrar"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    </>
}