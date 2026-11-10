import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";

export default function DialogCliente(props) {
    function enviar(formdata) {
        let cliente = {
            nome: formdata.get("nome"),
            cpf: formdata.get("cpf")
        }
        return props.onEnviar(cliente)
    }
    return <>
        <Dialog open fullWidth maxWidth="sm">
            <form action={enviar}>
                <DialogTitle align="center">
                    {props.clienteEditar ? `Editar cliente ID:${props.clienteEditar.id}` : "Cadastro de Cliente novo"}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                        <TextField label="Nome" name="nome" defaultValue={props.clienteEditar?.nome} variant="outlined" required fullWidth />
                        <TextField label="Cpf" name="cpf" defaultValue={props.clienteEditar?.cpf} variant="outlined" required fullWidth />
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