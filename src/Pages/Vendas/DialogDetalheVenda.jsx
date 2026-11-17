import {Button,Dialog,DialogActions,DialogContent,DialogTitle,Stack,TextField,Typography} from "@mui/material";

export default function DialogDetalheVenda({ dialogPreenchido, onFechar }) {
    const dataVenda = dialogPreenchido.data
        ? new Date(dialogPreenchido.data).toLocaleString("pt-BR")
        : "Não informada";

    return (
        <Dialog open fullWidth maxWidth="sm" onClose={onFechar}>
            <DialogTitle align="center">
                Detalhes da venda
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="ID da venda"
                        value={dialogPreenchido.id || "Não informado"}
                        fullWidth
                        disabled
                    />
                    <TextField
                        label="ID do cliente"
                        value={dialogPreenchido.idCliente || "Não informado"}
                        fullWidth
                        disabled
                    />
                    <TextField
                        label="Data da venda"
                        value={dataVenda}
                        fullWidth
                        disabled
                    />
                    <Typography variant="h6">Produtos</Typography>
                    {dialogPreenchido.produtos?.length
                        ? dialogPreenchido.produtos.map((produto, index) => (
                            <Stack
                                key={`${produto.idProduto}-${index}`}
                                direction="row"
                                spacing={2}
                            >
                                <TextField
                                    label="ID do produto"
                                    value={produto.idProduto}
                                    fullWidth
                                    disabled
                                />
                                <TextField
                                    label="Quantidade"
                                    value={produto.quantidade}
                                    disabled
                                />
                            </Stack>
                        ))
                        : <Typography>Nenhum produto informado.</Typography>}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" onClick={onFechar}>
                    Fechar
                </Button>
            </DialogActions>
        </Dialog>
    );
}