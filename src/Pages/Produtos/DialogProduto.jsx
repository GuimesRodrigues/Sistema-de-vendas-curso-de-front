import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";

export default function DialogProduto (props) {

    function enviar(formdata){
        let produto = {
            nome:formdata.get("nome"),
            valor:formdata.get("valor"),
            estoque:formdata.get("estoque")
        }
        return props.onEnviar(produto)
    }

    return <>
        <Dialog open fullWidth maxWidth="sm">
            <form action={enviar}>
                <DialogTitle align="center">
                    {props.produtoParaEditar?
                    `Editar produto ID:${props.produtoParaEditar.id}`:"Cadastro de Produto"}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{mt:2}}>
                        <TextField label="Nome" name="nome" defaultValue={props.produtoParaEditar?.nome} variant="outlined" required fullWidth />
                        <TextField label="Valor" name="valor" defaultValue={props.produtoParaEditar?.valor} variant="outlined" required fullWidth />
                        <TextField label="Estoque" name="estoque" defaultValue={props.produtoParaEditar?.estoque} variant="outlined" required fullWidth />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button color="warning" type="button" onClick={props.onCancelar}>Cancelar</Button>
                    <Button color="primary" type="submit">
                    {props.produtoParaEditar?"Atualizar":"Cadastrar"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    </>
}