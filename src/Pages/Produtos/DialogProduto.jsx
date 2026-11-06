import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { useState } from "react";

export default function DialogProduto (props) {
    const [erro, setErro] = useState(null)
    function enviar(formdata){
        let produto = {
            nome:formdata.get("nome"),
            valor:Number(formdata.get("valor")),
            estoque:Number(formdata.get("estoque"))
        }

        let valor = produto.valor
        let estoque = produto.estoque
        if( valor<0 || estoque<0){
            setErro(<Alert severity="error">Valores negativos não são aceitos</Alert>)
        }   else {
            setErro(null)
            return props.onEnviar(produto)
        }
    }

    return <>
        <Dialog open fullWidth maxWidth="sm">
            <form action={enviar}>
                <DialogTitle align="center">
                    {props.produtoParaEditar?
                    `Editar produto ID:${props.produtoParaEditar.id}`:"Cadastro de Produto"}
                </DialogTitle>
                <DialogContent>
                    {erro}
                <Stack spacing={2} sx={{mt:2}}>
                        <TextField label="Nome" name="nome" defaultValue={props.produtoParaEditar?.nome} variant="outlined" required fullWidth />
                        <TextField label="Valor" name="valor" defaultValue={props.produtoParaEditar?.valor} variant="outlined" required fullWidth />
                        <TextField label="Estoque" name="estoque" defaultValue={props.produtoParaEditar?.estoque} variant="outlined" required fullWidth />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="warning" type="button" onClick={props.onCancelar}>Cancelar</Button>
                    <Button variant="contained" color="primary" type="submit">
                    {props.produtoParaEditar?"Atualizar":"Cadastrar"}
                    </Button>
                </DialogActions>

            </form>
        </Dialog>
    </>
}